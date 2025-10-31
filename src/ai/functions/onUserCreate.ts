
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Ensure admin is initialized only once
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Cloud Function to create a user document in Firestore when a new user is created in Firebase Auth.
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
    const { uid, email, displayName, photoURL } = user;

    // Use a transaction to ensure atomicity, although a simple set is likely fine here.
    const userDocRef = db.collection('users').doc(uid);

    return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (userDoc.exists) {
            functions.logger.log(`User document for ${uid} already exists. Skipping creation.`);
            return;
        }

        // Generate a unique referral code for the new user
        const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;

        // Prepare the user document data
        // We will pull the referrer from custom claims if it exists, otherwise default to root.
        const referredBy = user.customClaims?.referredBy || 'ADMIN_ROOT_USER';
        
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
            status: finalRole === 'User' ? 'Active' : 'Pending', // Set to 'Pending' for special roles
            registeredAt: admin.firestore.FieldValue.serverTimestamp(),
            role: finalRole,
            avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
        };

        transaction.set(userDocRef, userDocumentData);
        functions.logger.log(`Successfully created user document for ${uid}`);
    });
});
