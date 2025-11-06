
'use server';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const freeTrackRewards = [
    { name: 'Bronze', requirement: 5 },
    { name: 'Silver', requirement: 25 }, // 5 users who have 5 users
    { name: 'Gold', requirement: 125 },
    { name: 'Emerald', requirement: 625 },
    { name: 'Platinum', requirement: 3125 },
    { name: 'Diamond', requirement: 15625 },
    { name: 'Crown', requirement: 78125 },
];

const paidTrackRewards = [
    { name: 'Bronze Star', requirement: 5 },
    { name: 'Silver Star', requirement: 25 },
    { name: 'Gold Star', requirement: 125 },
    { name: 'Emerald Star', requirement: 625 },
    { name: 'Platinum Star', requirement: 3125 },
    { name: 'Diamond Star', requirement: 15625 },
    { name: 'Crown Star', requirement: 78125 },
];

const REWARD_COINS: { [key: string]: number } = {
    'Bronze': 1, 'Silver': 2, 'Gold': 4, 'Emerald': 10, 'Platinum': 20, 'Diamond': 250, 'Crown': 1000,
    'Bronze Star': 2.5, 'Silver Star': 5, 'Gold Star': 10, 'Emerald Star': 20, 'Platinum Star': 125, 'Diamond Star': 1250, 'Crown Star': 6250
};

/**
 * This function processes team counts and rank achievements.
 * It's triggered by a task queue whenever a new user is created.
 */
export const processTeamRewards = admin.tasks.taskQueue().onDispatch(async (data) => {
    const { newUserId } = data as { newUserId: string };
    if (!newUserId) {
        console.error('No newUserId provided in task data.');
        return;
    }

    console.log(`Processing team rewards triggered by new user: ${newUserId}`);

    const newUserDoc = await db.collection('users').doc(newUserId).get();
    if (!newUserDoc.exists) {
        console.error(`New user document ${newUserId} not found.`);
        return;
    }
    const newUser = newUserDoc.data()!;
    const isNewUserPaid = newUser.isPaid || false;
    let currentUplineId = newUser.referredBy;

    if (!currentUplineId || currentUplineId === 'ADMIN_ROOT_USER') {
        console.log(`New user ${newUserId} has no upline. Exiting.`);
        return;
    }

    const batch = db.batch();
    const maxLevels = 15;

    for (let level = 1; level <= maxLevels; level++) {
        if (!currentUplineId || currentUplineId === 'ADMIN_ROOT_USER') {
            break;
        }

        const uplineRef = db.collection('users').doc(currentUplineId);
        const uplineDoc = await uplineRef.get();
        
        if (!uplineDoc.exists) {
            console.warn(`Upline user ${currentUplineId} not found at level ${level}. Stopping chain.`);
            break;
        }

        const uplineData = uplineDoc.data()!;
        
        // --- 1. Increment Total Team Size ---
        batch.update(uplineRef, { totalTeamSize: admin.firestore.FieldValue.increment(1) });
        const newTotalTeamSize = (uplineData.totalTeamSize || 0) + 1;

        // --- 2. Check and Award Free Rank ---
        const currentFreeRankIndex = freeTrackRewards.findIndex(r => r.name === uplineData.freeRank);
        const nextFreeRank = freeTrackRewards[currentFreeRankIndex + 1];

        if (nextFreeRank && newTotalTeamSize >= nextFreeRank.requirement) {
            const rewardAmount = REWARD_COINS[nextFreeRank.name as keyof typeof REWARD_COINS];
            batch.update(uplineRef, {
                freeRank: nextFreeRank.name,
                pgcBalance: admin.firestore.FieldValue.increment(rewardAmount)
            });

            // Log the rank reward transaction
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: currentUplineId,
                type: 'RANK_REWARD',
                amount: rewardAmount,
                currency: 'PGC', // Rank rewards are in PGC
                rewardName: nextFreeRank.name,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`User ${currentUplineId} achieved rank ${nextFreeRank.name} and was awarded ${rewardAmount} PGC.`);
        }

        // --- 3. Check and Award Paid Rank (if new user made a purchase) ---
        if (isNewUserPaid) {
            const newPaidTeamSize = (uplineData.paidTeamSize || 0) + 1;
            batch.update(uplineRef, { paidTeamSize: admin.firestore.FieldValue.increment(1) });

            const currentPaidRankIndex = paidTrackRewards.findIndex(r => r.name === uplineData.paidRank);
            const nextPaidRank = paidTrackRewards[currentPaidRankIndex + 1];

            if (nextPaidRank && newPaidTeamSize >= nextPaidRank.requirement) {
                const rewardAmount = REWARD_COINS[nextPaidRank.name as keyof typeof REWARD_COINS];
                batch.update(uplineRef, {
                    paidRank: nextPaidRank.name,
                    pgcBalance: admin.firestore.FieldValue.increment(rewardAmount)
                });
                
                const transactionRef = db.collection('transactions').doc();
                batch.set(transactionRef, {
                    userId: currentUplineId,
                    type: 'RANK_REWARD',
                    amount: rewardAmount,
                    currency: 'PGC', // Rank rewards are in PGC
                    rewardName: nextPaidRank.name,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`User ${currentUplineId} achieved PAID rank ${nextPaidRank.name} and was awarded ${rewardAmount} PGC.`);
            }
        }
        
        // Move to the next upline
        currentUplineId = uplineData.referredBy;
    }

    try {
        await batch.commit();
        console.log(`Successfully processed team updates for new user ${newUserId}.`);
    } catch (error) {
        console.error(`Error committing batch for team rewards processing:`, error);
    }
});
