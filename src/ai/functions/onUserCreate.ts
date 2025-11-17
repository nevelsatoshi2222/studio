
'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getFunctions } from 'firebase-admin/functions';

// This Cloud Function is the primary and ONLY method for creating a user document.
// It is a secure, server-side trigger that runs after a user is created in Firebase Auth.

const db = admin.firestore();

/**
 * Finds a user by their referral code and returns their full document data.
 * @param {string} referralCode The referral code to look for.
 * @returns {Promise<admin.firestore.DocumentSnapshot|null>} The snapshot of the user with the given code, or null if not found.
 */
async function findUserByReferralCode(referralCode: string): Promise<admin.firestore.DocumentSnapshot | null> {
    if (!referralCode) {
        return null;
    }
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('referralCode', '==', referralCode).limit(1).get();

    if (snapshot.empty) {
        functions.logger.warn(`Referral code ${referralCode} not found.`);
        return null;
    }
    return snapshot.docs[0];
}


/**
 * [PRIMARY] Cloud Function to create a user document in Firestore when a new
 * user is created in Firebase Auth. This is the single source of truth for user doc creation.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;
    
    const customClaims = user.customClaims;
    const referredByCode = customClaims?.referredByCode as string | undefined;

    functions.logger.log(`New user created: ${uid}. Claims:`, customClaims);

    const userDocRef = db.collection('users').doc(uid);

    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (userDoc.exists) {
            functions.logger.log(`User document for ${uid} already exists. Exiting.`);
            return;
        }

        let referrerUid: string | null = null;
        let referrerDocRef: admin.firestore.DocumentReference | null = null;

        if (referredByCode) {
            const referrerDoc = await findUserByReferralCode(referredByCode);
            if (referrerDoc) {
                referrerUid = referrerDoc.id;
                referrerDocRef = referrerDoc.ref;
                functions.logger.log(`Found referrer ${referrerUid} for new user ${uid}.`);
            }
        }
        
        if (referrerDocRef) {
            transaction.update(referrerDocRef, {
                direct_team: admin.firestore.FieldValue.arrayUnion(uid)
            });
        }

        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;
        
        const isPaid = customClaims?.isPaid as boolean || false;
        const pgcCredited = isPaid ? 200 : 1; // 1 PGC for free, 200 for paid

        const userDocumentData = {
            uid: uid,
            name: displayName || email?.split('@')[0] || 'New User',
            email: email,
            phone: customClaims?.phone || user.phoneNumber || null,
            
            street: customClaims?.street || '',
            village: customClaims?.village || '',
            taluka: customClaims?.taluka || '',
            district: customClaims?.district || '',
            state: customClaims?.state || '',
            country: customClaims?.country || '',

            pgcBalance: pgcCredited,
            usdBalance: 0,
            totalCommission: 0,

            referredByUserId: referrerUid || null, 
            referralCode: referralCode,
            walletAddress: customClaims?.walletAddress || '',
            isVerified: false,
            status: 'Active',
            role: customClaims?.role || 'User',
            primaryRole: customClaims?.primaryRole || null,
            businessType: customClaims?.businessType || null,
            
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
            direct_team: [], 
            
            totalTeamSize: 0,
            paidTeamSize: 0,
            freeRank: 'None',
            paidRank: 'None',
            isPaid: isPaid,
            freeAchievers: { bronze: 0, silver: 0, gold: 0 },
            paidAchievers: { bronzeStar: 0, silverStar: 0, goldStar: 0 },
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid}.`);
        
    }).then(() => {
        if (customClaims?.isPaid) {
            functions.logger.log(`User ${uid} registered with a paid package. Creating presale document.`);
            const investmentAmount = 100;
            const pgcCredited = 200;

            return db.collection('presales').add({
                userId: uid,
                amountUSDT: investmentAmount,
                pgcCredited: pgcCredited,
                status: 'PENDING_VERIFICATION',
                purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                registeredWithPurchase: true,
            });
        }
        return Promise.resolve();
    }).then(() => {
        functions.logger.log(`Enqueuing team reward processing for new user ${uid}.`);
        const queue = getFunctions().taskQueue('processTeamRewards');
        return queue.enqueue({ newUserId: uid });
    }).catch(error => {
        functions.logger.error("Error in onUserCreate transaction or follow-up tasks:", error);
        throw new functions.https.HttpsError('internal', 'Failed to complete user creation process.');
    });
});
