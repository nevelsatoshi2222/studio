
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
    const referredByCode = user.customClaims?.referredByCode as string | undefined;

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
            const referrerDoc = await findUserByReferralCode(referredByCode);
            if (referrerDoc) {
                referrerUid = referrerDoc.id;
                referrerDocRef = referrerDoc.ref;
                functions.logger.log(`Found referrer ${referrerUid} for new user ${uid}.`);
            }
        }
        
        // If a valid referrer was found, add the new user's UID to the referrer's directReferrals array.
        if (referrerDocRef) {
            transaction.update(referrerDocRef, {
                directReferrals: admin.firestore.FieldValue.arrayUnion(uid)
            });
             functions.logger.log(`Scheduled update for referrer ${referrerUid} to add new user ${uid}.`);
        }

        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;
        
        let finalRole = user.customClaims?.role as string || 'User';
        // Special case for the root admin user
        if (email && email.toLowerCase() === 'admin@publicgovernance.com') {
            finalRole = 'Super Admin';
        }
        
        const userDocumentData = {
            uid: uid,
            name: displayName || email?.split('@')[0] || 'New User',
            email: email,
            phone: user.phoneNumber || null,
            street: '',
            village: '',
            block: '',
            taluka: '',
            district: '',
            area: '',
            state: '',
            country: user.customClaims?.country || '',
            pgcBalance: 0,
            referredBy: referrerUid || 'ADMIN_ROOT_USER', 
            referralCode: referralCode,
            walletPublicKey: null,
            isVerified: false,
            status: 'Active', // Set status to Active by default for ALL users.
            role: finalRole,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
            directReferrals: [], // Initialize with an empty array for the new user
            totalTeamSize: 0, // Initialize team size
            paidTeamSize: 0,
            freeRank: 'None',
            paidRank: 'None',
            isPaid: user.customClaims?.isPaid || false // Track if user made a purchase on registration
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid} with referrer ${referrerUid || 'ADMIN_ROOT_USER'}.`);
        
    }).then(() => {
        // Enqueue a task to process team rewards for the new user and their upline.
        // This is a non-blocking call.
        const queue = getFunctions().taskQueue('processTeamRewards');
        return queue.enqueue({ newUserId: uid });
    }).catch(error => {
        functions.logger.error("Error in onUserCreate transaction or enqueueing task:", error);
    });
});
