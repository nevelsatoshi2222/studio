
'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Reward definitions
const freeTrackRewards = [
  { name: 'Bronze', requirement: 5, reward: 1, key: 'bronze' },
  { name: 'Silver', requirement: 5, reward: 2, key: 'silver', dependsOn: 'bronze' },
  { name: 'Gold', requirement: 5, reward: 4, key: 'gold', dependsOn: 'silver' },
  // ... add more free ranks if needed
];

const paidTrackRewards = [
  { name: 'Bronze Star', requirement: 5, reward: 2.5, key: 'bronzeStar' },
  { name: 'Silver Star', requirement: 5, reward: 5, key: 'silverStar', dependsOn: 'bronzeStar' },
  { name: 'Gold Star', requirement: 5, reward: 10, key: 'goldStar', dependsOn: 'silverStar' },
  // ... add more paid ranks if needed
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
    let currentUplineId = newUser.referredByUserId;

    if (!currentUplineId) {
        functions.logger.log(`New user ${newUserId} has no upline. Exiting.`);
        return;
    }

    const processedUplines = new Set<string>();

    for (let level = 1; level <= 15; level++) {
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
            
            // This is the user who just got a new downline member
            const directUplineId = (level === 1) ? currentUplineId : uplineData.referredByUserId;

            // Increment total team size and paid team size if applicable
            const updates: { [key: string]: any } = { totalTeamSize: admin.firestore.FieldValue.increment(1) };
            if (newUser.isPaid) {
                updates.paidTeamSize = admin.firestore.FieldValue.increment(1);
            }
            await uplineRef.update(updates);

            // Re-fetch the data after update to get the latest counts
            const updatedUplineDoc = await uplineRef.get();
            const updatedUplineData = updatedUplineDoc.data()!;

            // Check for new rank achievements
            const achievedFreeRank = await checkAndApplyRank(uplineRef, updatedUplineData, freeTrackRewards, 'freeRank', 'freeAchievers', 'direct_team');
            const achievedPaidRank = await checkAndApplyRank(uplineRef, updatedUplineData, paidTrackRewards, 'paidRank', 'paidAchievers', 'direct_team');

            // NOW, if a new rank was achieved, update the NEXT upline's achiever count
            if (directUplineId && directUplineId !== currentUplineId) {
                const nextUplineRef = db.collection('users').doc(directUplineId);
                const rankUpdates: { [key: string]: any } = {};

                if (achievedFreeRank) {
                    rankUpdates[`freeAchievers.${achievedFreeRank}`] = admin.firestore.FieldValue.increment(1);
                }
                if (achievedPaidRank) {
                    rankUpdates[`paidAchievers.${achievedPaidRank}`] = admin.firestore.FieldValue.increment(1);
                }

                if (Object.keys(rankUpdates).length > 0) {
                     functions.logger.log(`Updating rank achiever count for ${directUplineId}:`, rankUpdates);
                     await nextUplineRef.update(rankUpdates);
                }
            }
            
            currentUplineId = uplineData.referredByUserId; // Move to the next level up
        } catch (error) {
            functions.logger.error(`Error processing upline ${currentUplineId} at level ${level}:`, error);
            break;
        }
    }
    functions.logger.log(`Successfully processed team updates for new user ${newUserId}.`);
});

/**
 * Checks if a user qualifies for a new rank and applies it within a transaction.
 * Returns the key of the achieved rank if a new rank is awarded.
 */
async function checkAndApplyRank(
  userRef: admin.firestore.DocumentReference, 
  userData: any, 
  rewardTiers: any[], 
  rankField: 'freeRank' | 'paidRank',
  achieversField: 'freeAchievers' | 'paidAchievers',
  teamField: 'direct_team'
): Promise<string | null> {
    const currentRankName = userData[rankField] || 'None';
    const currentRankIndex = rewardTiers.findIndex(r => r.name === currentRankName);
    
    let bestNewRank = null;
    let newRankIndex = -1;

    for (let i = rewardTiers.length - 1; i > currentRankIndex; i--) {
        const rank = rewardTiers[i];
        let qualifies = false;

        if (rank.dependsOn) { // For Silver, Gold, etc.
            const requiredAchievers = rank.requirement;
            const actualAchievers = userData[achieversField]?.[rank.dependsOn] || 0;
            if (actualAchievers >= requiredAchievers) {
                qualifies = true;
            }
        } else { // For Bronze and Bronze Star
            const requiredDirects = rank.requirement;
            const directTeam = userData[teamField] || [];
            
            if(rankField === 'paidRank') {
                 const paidDirectsSnapshot = await db.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', directTeam.length > 0 ? directTeam : ['placeholder']).where('isPaid', '==', true).get();
                 if (paidDirectsSnapshot.size >= requiredDirects) {
                     qualifies = true;
                 }
            } else {
                 if(directTeam.length >= requiredDirects) {
                     qualifies = true;
                 }
            }
        }

        if (qualifies) {
            bestNewRank = rank;
            newRankIndex = i;
            break;
        }
    }

    if (bestNewRank) {
        const rewardAmount = bestNewRank.reward;
        
        await db.runTransaction(async (transaction) => {
            transaction.update(userRef, {
                [rankField]: bestNewRank.name,
                pgcBalance: admin.firestore.FieldValue.increment(rewardAmount)
            });

            const transactionRef = db.collection('transactions').doc();
            transaction.set(transactionRef, {
                userId: userRef.id,
                type: 'RANK_REWARD',
                amount: rewardAmount,
                currency: 'PGC',
                rewardName: `${rankField === 'paidRank' ? 'Paid: ' : 'Free: '}${bestNewRank.name}`,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        
        functions.logger.log(`User ${userRef.id} achieved rank ${bestNewRank.name} and was awarded ${rewardAmount} PGC.`);
        return bestNewRank.key; // Return the key of the new rank
    }
    
    return null; // No new rank achieved
}
