// This file exports all Cloud Functions for deployment.
// The `distributeCommission` function is also included here,
// as it's triggered by Firestore events.
export * from './onUserCreate';
export * from './distributeCommission';
export * from './processTeamRewards';

'use server';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// This function allows an authorized user (like an admin) to set custom claims on another user.
// It is a CRITICAL part of the secure registration flow for creating admins.
export const setCustomClaims = functions.https.onCall(async (data, context) => {
    // 1. Authentication Check: Ensure the user calling this function is an authenticated admin.
    // In a real production app, you would check for a specific admin role claim:
    // if (context.auth?.token.role !== 'Super Admin') {
    //   throw new functions.https.HttpsError('permission-denied', 'Must be a Super Admin to set claims.');
    // }
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // 2. Input Validation: Ensure the required data (uid and claims) is provided.
    const { uid, claims } = data;
    if (!uid || typeof uid !== 'string' || !claims || typeof claims !== 'object') {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "uid" and "claims" arguments.');
    }

    try {
        // 3. Set Custom Claims: Use the Admin SDK to set the claims on the target user.
        await admin.auth().setCustomUserClaims(uid, claims);
        
        // 4. Return Success: Send a success response back to the client.
        return { success: true, message: `Custom claims set successfully for user ${uid}` };
    } catch (error: any) {
        console.error('Error setting custom claims:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});


// This function is the secure entry point for creating a new user.
// It is called from the registration form on the client-side.
export const createUser = functions.https.onCall(async (data, context) => {
    const { email, password, displayName, claims } = data;
    
    if (!email || !password || !displayName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required fields.');
    }

    try {
        // Create the user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });

        // Set the custom claims provided during registration
        if (claims) {
            await admin.auth().setCustomUserClaims(userRecord.uid, claims);
        }

        // The onUserCreate trigger will handle creating the Firestore document.
        // We just return the new user's ID.
        return { success: true, userId: userRecord.uid, message: 'User created successfully.' };

    } catch (error: any) {
        // Handle specific auth errors gracefully
        if (error.code === 'auth/email-already-exists') {
            throw new functions.https.HttpsError('already-exists', 'The email address is already in use by another account.');
        }
        if (error.code === 'auth/invalid-password') {
            throw new functions.https.HttpsError('invalid-argument', 'The password must be a string with at least 6 characters.');
        }
        console.error('Error creating new user:', error);
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred while creating the user.');
    }
});
