
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
 * [PRIMARY] Cloud Function to create a user document in Firestore when a new
 * user is created in Firebase Auth. This is the single source of truth for user doc creation.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName } = user;

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

        // Generate a unique referral code for the new user
        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;

        // Default role is 'User'. Special roles can be assigned.
        let finalRole = 'User';
        if (email && email.toLowerCase() === 'admin@publicgovernance.com') {
            finalRole = 'Super Admin';
        }

        // Prepare the complete user document data.
        // The client no longer provides this; the server sets defaults.
        const userDocumentData = {
            uid: uid,
            name: displayName || email?.split('@')[0] || 'New User',
            email: email,
            // THIS IS THE FIX: user.phoneNumber can be null/undefined. Safely check it.
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
            // The client-side registration should pass the referrer code via custom claims in a real-world, highly-scalable app.
            // For this project's scope, we will default it, and it can be updated via the user's profile later.
            referredBy: 'ADMIN_ROOT_USER',
            referralCode: referralCode, // The generated code
            walletPublicKey: null,
            isVerified: false,
            // If a user registers for a specific role (e.g., Influencer), they start as 'Pending'.
            // The client-side logic will need to be updated to pass this role if we want that functionality back.
            // For now, we default to 'Active' for simplicity and reliability.
            status: finalRole === 'User' ? 'Active' : 'Pending',
            role: finalRole,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid} with referral code ${referralCode}.`);
    });
});
