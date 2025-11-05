
'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
 * Finds a user ID by their referral code.
 * @param {string} referralCode The referral code to look for.
 * @returns {Promise<string|null>} The UID of the user with the given code, or null if not found.
 */
async function findUserByReferralCode(referralCode: string): Promise<string | null> {
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

    // Return the UID of the found user.
    return snapshot.docs[0].id;
}


/**
 * [PRIMARY] Cloud Function to create a user document in Firestore when a new
 * user is created in Firebase Auth. This is the single source of truth for user doc creation.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;
    
    // The client may pass custom claims during registration, including a referrer code.
    const referredByCode = user.customClaims?.referredBy as string | undefined;

    // The user document reference
    const userDocRef = db.collection('users').doc(uid);

    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        // This check is a safety net. In a normal flow, the document should never exist yet.
        if (userDoc.exists) {
            functions.logger.log(`User document for ${uid} already exists. Fallback function exiting.`);
            return;
        }

        functions.logger.log(`Creating new user document for ${uid}.`);

        // --- THIS IS THE FIX ---
        // 1. Asynchronously find the referrer's UID using their referral code.
        let referrerUid: string | null = null;
        if (referredByCode) {
            referrerUid = await findUserByReferralCode(referredByCode);
        }

        // 2. Generate a unique referral code for the new user.
        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;

        // 3. Default role is 'User'. Special roles can be assigned.
        let finalRole = user.customClaims?.role as string || 'User';
        if (email && email.toLowerCase() === 'admin@publicgovernance.com') {
            finalRole = 'Super Admin';
        }
        
        // 4. Prepare the complete user document data.
        const userDocumentData = {
            uid: uid,
            name: displayName || email?.split('@')[0] || 'New User',
            email: email,
            phone: user.phoneNumber || '',
            street: '',
            village: '',
            block: '',
            taluka: '',
            district: '',
            area: '',
            state: '',
            country: user.customClaims?.country || '',
            pgcBalance: 0,
            // 5. Save the referrer's UID. If not found, default to a root admin.
            referredBy: referrerUid || 'ADMIN_ROOT_USER', 
            referralCode: referralCode,
            walletPublicKey: null,
            isVerified: false,
            // THIS IS THE FIX: All regular users start as 'Active'.
            status: 'Active',
            role: finalRole,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid} with referrer ${referrerUid || 'ADMIN_ROOT_USER'}.`);
    });
});
