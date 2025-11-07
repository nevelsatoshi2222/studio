'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { freeTrackRewards, paidTrackRewards, levelCommissions } from '../../lib/data';

// Initialize Firebase Admin SDK
// This should only be done once per application instance.
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

interface UserData {
    uid: string;
    referredBy?: string;
    upline?: string[];
    isPaid: boolean;
    totalTeamSize: number;
    paidTeamSize: number;
    freeRank: string;
    paidRank: string;
    referralCode?: string; // The user's own referral code
}

// This Cloud Function triggers when a new document is created in the 'users' collection.
export const onUserCreate = functions.firestore
    .document('users/{userId}')
    .onCreate(async (snap, context) => {
        const newUser = snap.data() as UserData & { referralCode?: string; referredByCode?: string };
        const newUserId = context.params.userId;
        const batch = db.batch();
        
        let upline: string[] = [];
        let referrerId: string | undefined = undefined;

        // THE CORE FIX: Use 'referredByCode' which is what the registration form provides.
        const referralCode = newUser.referredByCode;

        // 1. Find the referrer and build the upline chain
        if (referralCode) {
            const referrerQuery = await db.collection('users')
                .where('referralCode', '==', referralCode)
                .limit(1)
                .get();

            if (!referrerQuery.empty) {
                const referrerDoc = referrerQuery.docs[0];
                referrerId = referrerDoc.id;
                const referrerData = referrerDoc.data() as UserData;

                // Build the upline for the new user
                upline = [referrerId, ...(referrerData.upline || [])].slice(0, 15);

                // Update the new user with the direct referrer's ID and their upline
                batch.update(snap.ref, { 
                    referredBy: referrerId,
                    upline: upline
                });

                // Add the new user to the referrer's direct team
                batch.update(referrerDoc.ref, {
                    directReferrals: admin.firestore.FieldValue.arrayUnion(newUserId)
                });
            } else {
                 console.log(`Referral code ${referralCode} not found.`);
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
        
        // 3. Distribute commissions if the new user is a paid member
        if (newUser.isPaid && upline.length > 0) {
            const purchaseAmount = 100; // Assume a $100 purchase for a "paid" user
            for (let i = 0; i < upline.length; i++) {
                const uplineMemberId = upline[i];
                const level = i + 1;

                if (level > levelCommissions.length) break;

                const commissionRate = levelCommissions.find(lc => lc.level === level)?.percentage;
                if (commissionRate === undefined) continue;

                const commissionAmount = purchaseAmount * commissionRate;
                if (commissionAmount > 0) {
                    const uplineMemberRef = db.collection('users').doc(uplineMemberId);
                    batch.update(uplineMemberRef, {
                        usdtBalance: admin.firestore.FieldValue.increment(commissionAmount)
                    });

                    const commissionTxRef = db.collection('transactions').doc();
                    batch.set(commissionTxRef, {
                        userId: uplineMemberId,
                        type: 'COMMISSION',
                        amount: commissionAmount,
                        currency: 'USDT',
                        fromUser: newUserId,
                        level: level,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        }

        await batch.commit();

        // 4. Post-commit: Check ranks for all upline members (run after sizes are committed)
        if (upline.length > 0) {
            // Use Promise.all to check ranks in parallel after the main batch is committed.
            await Promise.all(upline.map(async (uplineMemberId) => {
                try {
                    const uplineMemberSnap = await db.collection('users').doc(uplineMemberId).get();
                    if (uplineMemberSnap.exists) {
                        // Pass the fresh data to the rank check function
                        await checkAndAwardRank(uplineMemberSnap.id, uplineMemberSnap.data() as UserData);
                    }
                } catch(e) {
                    console.error(`Error checking rank for upline member ${uplineMemberId}`, e);
                }
            }));
        }

        console.log(`Processed new user ${newUserId} with referrer ${referrerId || 'None'}`);
    });

async function checkAndAwardRank(userId: string, user: UserData): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    const batch = db.batch();
    let ranksUpdated: string[] = [];

    // --- Check Free Track ---
    const currentFreeRankIndex = freeTrackRewards.findIndex(r => r.name === user.freeRank);
    // Iterate from highest rank to lowest to award the best possible rank
    for (let i = freeTrackRewards.length - 1; i > currentFreeRankIndex; i--) {
        const rank = freeTrackRewards[i];
        if (user.totalTeamSize >= rank.goal) {
            batch.update(userRef, { freeRank: rank.name });
            // Rewards are PGC strings like "1 PGC"
            const pgcReward = parseFloat(rank.reward.split(' ')[0]);
            if (!isNaN(pgcReward)) {
                batch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcReward) });
                const rankTxRef = db.collection('transactions').doc();
                batch.set(rankTxRef, {
                    userId: userId,
                    type: 'RANK_REWARD',
                    amount: pgcReward,
                    currency: 'PGC',
                    rewardName: `Free: ${rank.name}`,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            }
            ranksUpdated.push(`Free: ${rank.name}`);
            break; // Award the highest applicable rank and stop checking for this track
        }
    }

    // --- Check Paid Track ---
    const currentPaidRankIndex = paidTrackRewards.findIndex(r => r.name === user.paidRank);
    // Iterate from highest rank to lowest
    for (let i = paidTrackRewards.length - 1; i > currentPaidRankIndex; i--) {
        const rank = paidTrackRewards[i];
        if (user.paidTeamSize >= rank.goal) {
            batch.update(userRef, { paidRank: rank.name });
             // Rewards are PGC strings like "2.5 PGC"
            const pgcReward = parseFloat(rank.reward.split(' ')[0]);
            if (!isNaN(pgcReward)) {
                batch.update(userRef, { pgcBalance: admin.firestore.FieldValue.increment(pgcReward) });
                const rankTxRef = db.collection('transactions').doc();
                batch.set(rankTxRef, {
                    userId: userId,
                    type: 'RANK_REWARD',
                    amount: pgcReward,
                    currency: 'PGC',
                    rewardName: `Paid: ${rank.name}`,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            }
            ranksUpdated.push(`Paid: ${rank.name}`);
            break; // Award the highest applicable rank and stop checking for this track
        }
    }

    if (ranksUpdated.length > 0) {
        await batch.commit();
        console.log(`User ${userId} awarded new ranks: ${ranksUpdated.join(', ')}`);
    }
}
