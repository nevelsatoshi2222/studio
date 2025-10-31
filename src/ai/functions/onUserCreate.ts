
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// This Cloud Function is no longer the primary method for creating user documents,
// as that logic has been moved to the client-side registration form for reliability.
// It is kept here as a fallback or for potential future server-side user creation events.
// It will NOT fire on a standard email/password registration from the client anymore,
// as the client now creates the document first, preventing this `onCreate` from triggering
// due to the document already existing.

// Ensure admin is initialized only once
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * [FALLBACK] Cloud Function to create a user document in Firestore if one doesn't exist
 * when a new user is created in Firebase Auth. This is a safety net.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;

    const userDocRef = db.collection('users').doc(uid);

    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        // Only run if the document does NOT exist. This prevents overwriting the client-created doc.
        if (userDoc.exists) {
            functions.logger.log(`User document for ${uid} already exists. Fallback function exiting.`);
            return;
        }

        functions.logger.log(`User document for ${uid} not found. Creating fallback document.`);

        // Generate a unique referral code for the new user
        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;

        // Prepare the user document data
        const referredBy = 'ADMIN_ROOT_USER'; // Default referrer for fallback
        
        let finalRole = 'User';
        if (email && email.toLowerCase() === 'admin@publicgovernance.com') {
            finalRole = 'Super Admin';
        }

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
            country: '',
            pgcBalance: 0,
            referredBy: referredBy,
            referralCode: referralCode,
            walletPublicKey: null,
            isVerified: false,
            status: finalRole === 'User' ? 'Active' : 'Pending',
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
            role: finalRole,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created FALLBACK user document for ${uid}`);
    });
});
