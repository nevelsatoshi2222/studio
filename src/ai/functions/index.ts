
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { freeTrackRewards, paidTrackRewards } from '../../lib/data';

admin.initializeApp();

const db = admin.firestore();

type UserData = {
    uid: string;
    referredByCode?: string;
    referredBy?: string;
    isPaid: boolean;
    directReferrals: string[];
    totalTeamSize: number;
    paidTeamSize: number;
    freeRank: string;
    paidRank: string;
    referralCode?: string;
};

// This is the robust, consolidated function that will fix the referral and rank system.
export const onUserCreate = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snap, context) => {
        const newUser = snap.data() as UserData;
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

                // Update the new user with the direct referrer's ID
                batch.update(snap.ref, { referredBy: referrerId });

                // Add the new user to the referrer's direct team
                batch.update(referrerDoc.ref, {
                    directReferrals: admin.firestore.FieldValue.arrayUnion(newUser.uid)
                });

                upline.push(referrerId);
                const referrerData = referrerDoc.data() as UserData;
                
                // Build the rest of the upline (up to 15 levels)
                let currentUplineMemberId = referrerData.referredBy;
                for (let i = 0; i < 14 && currentUplineMemberId; i++) {
                    if (currentUplineMemberId === 'ADMIN_ROOT_USER') break;
                    upline.push(currentUplineMemberId);
                    const nextUplineDoc = await db.collection('users').doc(currentUplineMemberId).get();
                    if (nextUplineDoc.exists) {
                        currentUplineMemberId = (nextUplineDoc.data() as UserData).referredBy;
                    } else {
                        break;
                    }
                }
            } else {
                 console.log(`Referral code ${newUser.referredByCode} not found.`);
            }
        }
        
        // 2. Update team sizes and check for rewards for the entire upline
        for (const [index, uplineMemberId] of upline.entries()) {
            const uplineMemberRef = db.collection('users').doc(uplineMemberId);
            
            // Increment team sizes
            batch.update(uplineMemberRef, {
                totalTeamSize: admin.firestore.FieldValue.increment(1),
                paidTeamSize: admin.firestore.FieldValue.increment(newUser.isPaid ? 1 : 0),
            });

            // Handle commissions for direct (Level 1) referrer
            if (index === 0 && newUser.isPaid) {
                const commissionAmount = 10; // $10 commission for a $100 paid user
                 batch.update(uplineMemberRef, {
                    usdtBalance: admin.firestore.FieldValue.increment(commissionAmount),
                });
                const commissionTxRef = db.collection('transactions').doc();
                batch.set(commissionTxRef, {
                    userId: uplineMemberId,
                    type: 'COMMISSION',
                    amount: commissionAmount,
                    currency: 'USDT',
                    level: 1,
                    fromUser: newUser.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }
        
        await batch.commit();

        // 3. Post-commit: Check ranks for all upline members (run after sizes are committed)
        // This is done separately to ensure we read the *new* team sizes.
        for (const uplineMemberId of upline) {
            const uplineMemberRef = db.collection('users').doc(uplineMemberId);
            const uplineMemberSnap = await uplineMemberRef.get();
            if (uplineMemberSnap.exists) {
                await checkAndAwardRank(uplineMemberSnap.data() as UserData, uplineMemberRef);
            }
        }

        console.log(`Processed new user ${newUser.uid} with upline:`, upline);
    });

async function checkAndAwardRank(user: UserData, userRef: admin.firestore.DocumentReference): Promise<void> {
    const rankBatch = db.batch();
    let rankUpdated = false;

    // Find the next applicable rank in the free track
    const currentFreeRankIndex = freeTrackRewards.findIndex(r => r.name === user.freeRank);
    const nextFreeRank = freeTrackRewards.find((rank, index) => 
        index > currentFreeRankIndex && user.totalTeamSize >= (rank.goal || 0)
    );

    if (nextFreeRank) {
        rankUpdated = true;
        rankBatch.update(userRef, { freeRank: nextFreeRank.name });
        const pgcReward = parseFloat(nextFreeRank.reward.split(' ')[0]);
        if (!isNaN(pgcReward)) {
            rankBatch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcReward) });
            const freeRankTx = db.collection('transactions').doc();
            rankBatch.set(freeRankTx, {
                userId: user.uid,
                type: 'RANK_REWARD',
                amount: pgcReward,
                currency: 'PGC',
                rewardName: nextFreeRank.name,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
    }

    // Find the next applicable rank in the paid track
    const currentPaidRankIndex = paidTrackRewards.findIndex(r => r.name === user.paidRank);
    const nextPaidRank = paidTrackRewards.find((rank, index) => 
        index > currentPaidRankIndex && user.paidTeamSize >= (rank.goal || 0)
    );
    
    if (nextPaidRank) {
        rankUpdated = true;
        rankBatch.update(userRef, { paidRank: nextPaidRank.name });
        const pgcStarReward = parseFloat(nextPaidRank.reward.split(' ')[0]);
        if (!isNaN(pgcStarReward)) {
            rankBatch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcStarReward) });
             const paidRankTx = db.collection('transactions').doc();
            rankBatch.set(paidRankTx, {
                userId: user.uid,
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
        console.log(`Updated ranks for user ${user.uid}`);
    }
}
