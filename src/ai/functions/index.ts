
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { freeTrackRewards, paidTrackRewards, levelCommissions } from '../../lib/data';

admin.initializeApp();

const db = admin.firestore();

type UserData = {
    uid: string;
    referredBy?: string;
    referralCode?: string;
    isPaid: boolean;
    totalTeamSize: number;
    paidTeamSize: number;
    freeRank: string;
    paidRank: string;
    upline?: string[];
};

// This function triggers when a new user document is created.
export const onUserCreate = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snap, context) => {
        const newUser = snap.data() as UserData & { referredByCode?: string };
        const batch = db.batch();
        
        let upline: string[] = [];
        let referrerId: string | undefined = undefined;

        // 1. Find the referrer and build the upline chain
        if (newUser.referredByCode) {
            const referrerQuery = await db.collection('users')
                .where('referralCode', '==', newUser.referredByCode)
                .limit(1)
                .get();

            if (!referrerQuery.empty) {
                const referrerDoc = referrerQuery.docs[0];
                referrerId = referrerDoc.id;
                const referrerData = referrerDoc.data() as UserData;

                // Update the new user with the direct referrer's ID and build their upline
                batch.update(snap.ref, { 
                    referredBy: referrerId,
                    upline: [referrerId, ...(referrerData.upline || [])].slice(0, 15) // Build and limit upline
                });

                // Add the new user to the referrer's direct team
                batch.update(referrerDoc.ref, {
                    directReferrals: admin.firestore.FieldValue.arrayUnion(newUser.uid)
                });
                
                upline = [referrerId, ...(referrerData.upline || [])].slice(0, 15);

            } else {
                 console.log(`Referral code ${newUser.referredByCode} not found.`);
            }
        }
        
        // 2. Update team sizes for the entire upline
        if (upline.length > 0) {
            for (const uplineMemberId of upline) {
                const uplineMemberRef = db.collection('users').doc(uplineMemberId);
                const updatePayload: { [key: string]: admin.firestore.FieldValue } = {
                    totalTeamSize: admin.firestore.FieldValue.increment(1)
                };
                if (newUser.isPaid) {
                    updatePayload.paidTeamSize = admin.firestore.FieldValue.increment(1);
                }
                batch.update(uplineMemberRef, updatePayload);
            }
        }
        
        await batch.commit();

        // 4. Post-commit: Check ranks for all upline members (run after sizes are committed)
        // This is done separately to ensure we read the *new* team sizes.
        if (upline.length > 0) {
            for (const uplineMemberId of upline) {
                try {
                    const uplineMemberSnap = await db.collection('users').doc(uplineMemberId).get();
                    if (uplineMemberSnap.exists) {
                        await checkAndAwardRank(uplineMemberSnap.id, uplineMemberSnap.data() as UserData);
                    }
                } catch(e) {
                    console.error(`Error checking rank for upline member ${uplineMemberId}`, e);
                }
            }
        }

        console.log(`Processed new user ${newUser.uid} with upline:`, upline);
    });

// This function triggers when a Presale document is updated, specifically when it becomes 'COMPLETED'.
export const onPresaleComplete = functions.firestore
    .document('presales/{presaleId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        // Check if the status has changed from 'PENDING_VERIFICATION' to 'COMPLETED'
        if (before.status !== 'COMPLETED' && after.status === 'COMPLETED') {
            console.log(`Presale ${context.params.presaleId} completed for user ${after.userId}. Distributing commissions.`);
            const buyerId = after.userId;
            const purchaseAmount = after.amountUSDT;

            const userDoc = await db.collection('users').doc(buyerId).get();
            if (!userDoc.exists) {
                console.error(`Buyer user document ${buyerId} not found.`);
                return;
            }

            const buyerData = userDoc.data() as UserData;
            const upline = buyerData.upline;

            if (!upline || upline.length === 0) {
                console.log(`User ${buyerId} has no upline. No commissions to distribute.`);
                return;
            }

            const commissionBatch = db.batch();

            // Distribute commissions up the chain
            for (let i = 0; i < upline.length; i++) {
                const uplineMemberId = upline[i];
                const level = i + 1; // Level 1 is the direct referrer

                if (level > levelCommissions.length) break; // Stop if we've exceeded our defined commission levels

                const commissionRate = levelCommissions.find(lc => lc.level === level)?.percentage;
                if (commissionRate === undefined) continue;

                const commissionAmount = purchaseAmount * (commissionRate / 100);

                if (commissionAmount > 0) {
                    const uplineMemberRef = db.collection('users').doc(uplineMemberId);
                    commissionBatch.update(uplineMemberRef, {
                        usdtBalance: admin.firestore.FieldValue.increment(commissionAmount)
                    });

                    const commissionTxRef = db.collection('transactions').doc();
                    commissionBatch.set(commissionTxRef, {
                        userId: uplineMemberId,
                        type: 'COMMISSION',
                        amount: commissionAmount,
                        currency: 'USDT',
                        fromUser: buyerId,
                        level: level,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        purchaseRef: change.after.ref.path
                    });

                    console.log(`Level ${level} commission of ${commissionAmount} USDT for ${uplineMemberId}`);
                }
            }
            await commissionBatch.commit();
            console.log(`Finished distributing commissions for presale ${context.params.presaleId}.`);
        }
    });


async function checkAndAwardRank(userId: string, user: UserData): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    const rankBatch = db.batch();
    let rankUpdated = false;

    // Find the next applicable rank in the free track
    const currentFreeRankIndex = freeTrackRewards.findIndex(r => r.name === user.freeRank) ?? -1;
    // We check all ranks higher than the current one to see if any goal is met
    const nextFreeRank = freeTrackRewards.find((rank, index) => 
        index > currentFreeRankIndex && (user.totalTeamSize >= (rank.goal || Infinity))
    );

    if (nextFreeRank) {
        rankUpdated = true;
        rankBatch.update(userRef, { freeRank: nextFreeRank.name });
        const pgcReward = parseFloat(nextFreeRank.reward.split(' ')[0]);
        if (!isNaN(pgcReward)) {
            rankBatch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcReward) });
            const freeRankTx = db.collection('transactions').doc();
            rankBatch.set(freeRankTx, {
                userId: userId,
                type: 'RANK_REWARD',
                amount: pgcReward,
                currency: 'PGC',
                rewardName: nextFreeRank.name,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    // Find the next applicable rank in the paid track
    const currentPaidRankIndex = paidTrackRewards.findIndex(r => r.name === user.paidRank) ?? -1;
    const nextPaidRank = paidTrackRewards.find((rank, index) => 
        index > currentPaidRankIndex && (user.paidTeamSize >= (rank.goal || Infinity))
    );
    
    if (nextPaidRank) {
        rankUpdated = true;
        rankBatch.update(userRef, { paidRank: nextPaidRank.name });
        const pgcStarReward = parseFloat(nextPaidRank.reward.split(' ')[0]);
        if (!isNaN(pgcStarReward)) {
            rankBatch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcStarReward) });
             const paidRankTx = db.collection('transactions').doc();
            rankBatch.set(paidRankTx, {
                userId: userId,
                type: 'RANK_REWARD',
                amount: pgcStarReward,
                currency: 'PGC',
                rewardName: nextPaidRank.name,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    if (rankUpdated) {
        await rankBatch.commit();
        console.log(`Updated ranks for user ${userId}`);
    }
}
