
'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getFunctions } from 'firebase-admin/functions';

// This Cloud Function is the primary and ONLY method for creating a user document.
// It is a secure, server-side trigger that runs after a user is created in Firebase Auth.
// It is designed to be robust and prevent the race conditions and permission errors
// that occurred with client-side document creation attempts.

// Ensure admin is initialized only once
if (!admin.apps.length) {
  admin.initializeApp();
}
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
    // We query for the referral code. An index must exist on the 'referralCode' field in Firestore.
    const snapshot = await usersRef.where('referralCode', '==', referralCode).limit(1).get();

    if (snapshot.empty) {
        functions.logger.warn(`Referral code ${referralCode} not found.`);
        return null;
    }

    // Return the full document snapshot of the found user.
    return snapshot.docs[0];
}


/**
 * [PRIMARY] Cloud Function to create a user document in Firestore when a new
 * user is created in Firebase Auth. This is the single source of truth for user doc creation.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;
    
    // The client may pass custom claims during registration, including a referrer code.
    const customClaims = (await admin.auth().getUser(uid)).customClaims;
    const referredByCode = customClaims?.referredByCode as string | undefined;

    functions.logger.log(`New user created: ${uid}, email: ${email}. Custom claims:`, customClaims);


    const userDocRef = db.collection('users').doc(uid);

    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (userDoc.exists) {
            functions.logger.log(`User document for ${uid} already exists. Fallback function exiting.`);
            return;
        }

        functions.logger.log(`Creating new user document for ${uid}.`);

        let referrerUid: string | null = null;
        let referrerDocRef: admin.firestore.DocumentReference | null = null;

        if (referredByCode) {
            functions.logger.log(`User ${uid} was referred by code: ${referredByCode}. Searching for referrer.`);
            const referrerDoc = await findUserByReferralCode(referredByCode);
            if (referrerDoc) {
                referrerUid = referrerDoc.id;
                referrerDocRef = referrerDoc.ref;
                functions.logger.log(`Found referrer ${referrerUid} for new user ${uid}.`);
            } else {
                functions.logger.warn(`Referrer with code ${referredByCode} was not found.`);
            }
        } else {
            functions.logger.log(`User ${uid} has no referrer code.`);
        }
        
        // If a valid referrer was found, add the new user's UID to the referrer's directReferrals array.
        if (referrerDocRef) {
            transaction.update(referrerDocRef, {
                directReferrals: admin.firestore.FieldValue.arrayUnion(uid)
            });
             functions.logger.log(`Scheduled update for referrer ${referrerUid} to add new user ${uid}.`);
        }

        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;
        
        let finalRole = customClaims?.role as string || 'User';
        // Special case for the root admin user
        if (email && email.toLowerCase() === 'admin@publicgovernance.com') {
            finalRole = 'Super Admin';
        }
        
        const investmentAmount = customClaims?.investmentTier || 25;
        const pgcCredited = investmentAmount * 2;

        const userDocumentData = {
            uid: uid,
            name: displayName || email?.split('@')[0] || 'New User',
            email: email,
            phone: customClaims?.phone || user.phoneNumber || null,
            street: customClaims?.street || '',
            village: customClaims?.village || '',
            block: customClaims?.block || '',
            taluka: customClaims?.taluka || '',
            district: customClaims?.district || '',
            state: customClaims?.state || '',
            country: customClaims?.country || '',
            pgcBalance: pgcCredited,
            referredBy: referrerUid || 'ADMIN_ROOT_USER', 
            referralCode: referralCode,
            walletPublicKey: null,
            isVerified: false,
            status: 'Active',
            role: finalRole,
            primaryRole: customClaims?.primaryRole || 'User',
            businessType: customClaims?.businessType || 'N/A',
            investmentTier: investmentAmount,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
            directReferrals: [],
            totalTeamSize: 0,
            paidTeamSize: 0,
            freeRank: 'None',
            paidRank: 'None',
            isPaid: customClaims?.isPaid || false
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid} with referrer ${referrerUid || 'ADMIN_ROOT_USER'}.`);
        
    }).then(() => {
        // After successfully creating the user, check if a purchase was made during registration.
        // If so, create the presale document which will trigger commission distribution.
        const isPaid = customClaims?.isPaid as boolean | undefined;
        const investmentAmount = customClaims?.investmentTier as number | undefined;
        
        if (isPaid && investmentAmount && investmentAmount >= 100) {
            functions.logger.log(`User ${uid} registered with a paid package. Creating presale document.`);
            const presaleCollection = db.collection('presales');
            const pgcCredited = investmentAmount * 2;

            return presaleCollection.add({
                userId: uid,
                amountUSDT: investmentAmount,
                pgcCredited: pgcCredited,
                status: 'PENDING_VERIFICATION', // This status will be updated by the commission function
                purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                registeredWithPurchase: true,
            });
        }
        return Promise.resolve();
    }).then(() => {
        // Now, enqueue a task to process team rewards. This happens regardless of purchase.
        // This is a non-blocking call.
        functions.logger.log(`Enqueuing team reward processing for new user ${uid}.`);
        const queue = getFunctions().taskQueue('processTeamRewards');
        return queue.enqueue({ newUserId: uid });
    }).catch(error => {
        functions.logger.error("Error in onUserCreate transaction or follow-up tasks:", error);
        // Throwing the error ensures that Firebase knows the function failed
        throw new functions.https.HttpsError('internal', 'Failed to complete user creation process.');
    });
});
