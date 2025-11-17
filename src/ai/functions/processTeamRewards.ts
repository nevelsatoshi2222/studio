
'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// These reward tiers should match what's in your frontend `lib/data.ts`
const freeTrackRewards = [
  { name: 'Bronze', requirement: 5, reward: 1 },
  { name: 'Silver', requirement: 25, reward: 2 },
  { name: 'Gold', requirement: 125, reward: 4 },
  { name: 'Emerald', requirement: 625, reward: 10 },
  { name: 'Platinum', requirement: 3125, reward: 20 },
  { name: 'Diamond', requirement: 15625, reward: 250 },
  { name: 'Crown', requirement: 78125, reward: 1000 },
];

const paidTrackRewards = [
  { name: 'Bronze Star', requirement: 5, reward: 2.5 },
  { name: 'Silver Star', requirement: 25, reward: 5 },
  { name: 'Gold Star', requirement: 125, reward: 10 },
  { name: 'Emerald Star', requirement: 625, reward: 20 },
  { name: 'Platinum Star', requirement: 3125, reward: 125 },
  { name: 'Diamond Star', requirement: 15625, reward: 1250 },
  { name: 'Crown Star', requirement: 78125, reward: 6250 },
];

/**
 * This function processes team counts and rank achievements.
 * It's triggered by a task queue whenever a new user is created.
 */
export const processTeamRewards = functions.tasks.taskQueue().onDispatch(async (data) => {
    const { newUserId } = data as { newUserId: string };
    if (!newUserId) {
        functions.logger.error('No newUserId provided in task data.');
        return;
    }

    functions.logger.log(`Processing team rewards triggered by new user: ${newUserId}`);

    const newUserDoc = await db.collection('users').doc(newUserId).get();
    if (!newUserDoc.exists) {
        functions.logger.error(`New user document ${newUserId} not found.`);
        return;
    }
    const newUser = newUserDoc.data()!;
    const isNewUserPaid = newUser.isPaid || false;
    let currentUplineId = newUser.referredByUserId;

    if (!currentUplineId) {
        functions.logger.log(`New user ${newUserId} has no upline. Exiting.`);
        return;
    }

    const maxLevels = 15;
    const processedUplines = new Set(); // To prevent duplicate processing in complex chains

    for (let level = 1; level <= maxLevels; level++) {
        if (!currentUplineId || processedUplines.has(currentUplineId)) {
            break;
        }

        processedUplines.add(currentUplineId);
        const uplineRef = db.collection('users').doc(currentUplineId);
        
        try {
          const uplineDoc = await uplineRef.get();
          
          if (!uplineDoc.exists) {
              functions.logger.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
              break;
          }

          const uplineData = uplineDoc.data()!;
          const batch = db.batch();
          let rankUpdated = false;

          // --- 1. Increment Team Sizes ---
          const newTotalTeamSize = (uplineData.totalTeamSize || 0) + 1;
          batch.update(uplineRef, { totalTeamSize: admin.firestore.FieldValue.increment(1) });
          
          if (isNewUserPaid) {
              const newPaidTeamSize = (uplineData.paidTeamSize || 0) + 1;
              batch.update(uplineRef, { paidTeamSize: admin.firestore.FieldValue.increment(1) });
              await checkRank(uplineRef, uplineData, newPaidTeamSize, paidTrackRewards, 'paidRank', batch);
          }
          
          await checkRank(uplineRef, uplineData, newTotalTeamSize, freeTrackRewards, 'freeRank', batch);
          
          await batch.commit();

          // Move to the next upline
          currentUplineId = uplineData.referredByUserId;

        } catch (error) {
           functions.logger.error(`Error processing upline ${currentUplineId} at level ${level}:`, error);
           break; // Stop processing this chain on error
        }
    }

    functions.logger.log(`Successfully processed team updates for new user ${newUserId}.`);
});


/**
 * Checks if a user qualifies for a new rank and adds updates to the batch.
 */
async function checkRank(userRef: admin.firestore.DocumentReference, userData: any, newTeamSize: number, rewardTiers: any[], rankField: 'freeRank' | 'paidRank', batch: admin.firestore.WriteBatch) {
    const currentRankName = userData[rankField] || 'None';
    const currentRankIndex = rewardTiers.findIndex(r => r.name === currentRankName);
    
    // Iterate from highest rank to lowest to award the best possible rank
    for (let i = rewardTiers.length - 1; i > currentRankIndex; i--) {
        const rank = rewardTiers[i];
        if (newTeamSize >= rank.requirement) {
            const rewardAmount = rank.reward;
            
            // Update user's rank and balance
            batch.update(userRef, {
                [rankField]: rank.name,
                pgcBalance: admin.firestore.FieldValue.increment(rewardAmount)
            });

            // Log the rank reward transaction
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: userRef.id,
                type: 'RANK_REWARD',
                amount: rewardAmount,
                currency: 'PGC',
                rewardName: `${rankField === 'paidRank' ? 'Paid: ' : 'Free: '}${rank.name}`,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            functions.logger.log(`User ${userRef.id} achieved rank ${rank.name} and will be awarded ${rewardAmount} P