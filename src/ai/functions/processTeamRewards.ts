
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
          await db.runTransaction(async (transaction) => {
            const uplineDoc = await transaction.get(uplineRef);
            
            if (!uplineDoc.exists) {
                functions.logger.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
                currentUplineId = null; // Stop the loop
                return;
            }

            const uplineData = uplineDoc.data()!;
            
            // --- 1. Increment Team Sizes ---
            const updates: {[key: string]: any} = { totalTeamSize: admin.firestore.FieldValue.increment(1) };
            const newTotalTeamSize = (uplineData.totalTeamSize || 0) + 1;
            
            if (isNewUserPaid) {
                updates.paidTeamSize = admin.firestore.FieldValue.increment(1);
                const newPaidTeamSize = (uplineData.paidTeamSize || 0) + 1;
                await checkAndApplyRank(transaction, uplineRef, uplineData, newPaidTeamSize, paidTrackRewards, 'paidRank');
            }
            
            await checkAndApplyRank(transaction, uplineRef, uplineData, newTotalTeamSize, freeTrackRewards, 'freeRank');
            
            transaction.update(uplineRef, updates);
            currentUplineId = uplineData.referredByUserId; // Prepare for next iteration
          });

        } catch (error) {
           functions.logger.error(`Error processing upline ${currentUplineId} at level ${level}:`, error);
           break; // Stop processing this chain on error
        }
    }

    functions.logger.log(`Successfully processed team updates for new user ${newUserId}.`);
});


/**
 * Checks if a user qualifies for a new rank and adds updates to the transaction.
 */
async function checkAndApplyRank(
  transaction: admin.firestore.Transaction, 
  userRef: admin.firestore.DocumentReference, 
  userData: any, 
  newTeamSize: number, 
  rewardTiers: any[], 
  rankField: 'freeRank' | 'paidRank'
) {
    const currentRankName = userData[rankField] || 'None';
    const currentRankIndex = rewardTiers.findIndex(r => r.name === currentRankName);
    
    // Find the highest new rank the user qualifies for
    let bestNewRank = null;
    for (let i = rewardTiers.length - 1; i > currentRankIndex; i--) {
        const rank = rewardTiers[i];
        if (newTeamSize >= rank.requirement) {
            bestNewRank = rank;
            break; // Found the highest possible new rank
        }
    }

    if (bestNewRank) {
      const rewardAmount = bestNewRank.reward;
      
      // Update user's rank and balance in the transaction
      transaction.update(userRef, {
          [rankField]: bestNewRank.name,
          pgcBalance: admin.firestore.FieldValue.increment(rewardAmount)
      });

      // Log the rank reward transaction
      const transactionRef = db.collection('transactions').doc();
      transaction.set(transactionRef, {
          userId: userRef.id,
          type: 'RANK_REWARD',
          amount: rewardAmount,
          currency: 'PGC',
          rewardName: `${rankField === 'paidRank' ? 'Paid: ' : 'Free: '}${bestNewRank.name}`,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      functions.logger.log(`User ${userRef.id} achieved rank ${bestNewRank.name} and will be awarded ${rewardAmount} PGC.`);
    }
}
