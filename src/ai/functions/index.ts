
// This is the entry point for deploying your Genkit flows and Cloud Functions.
import { https, onCall } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { ai } from '@/ai/genkit';
import { listFlows } from 'genkit';
import * as admin from 'firebase-admin';
import { getFunctions } from 'firebase-admin/functions';

// Initialize admin SDK if not already done
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Import functions for their side effects, which registers them.
import { distributeCommission } from './distributeCommission';
import { processTeamRewards } from './processTeamRewards';
import '@/ai/flows/national-issues-flow';
import '@/ai/flows/state-issues-flow';

// Export Cloud Functions for deployment
export const distributeCommissionTrigger = distributeCommission;
export const processTeamRewardsTrigger = processTeamRewards;

/**
 * Finds a user by their referral code and returns their full document data.
 */
async function findUserByReferralCode(referralCode: string): Promise<admin.firestore.DocumentSnapshot | null> {
    if (!referralCode) return null;
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('referralCode', '==', referralCode).limit(1).get();
    if (snapshot.empty) {
        console.warn(`Referral code ${referralCode} not found.`);
        return null;
    }
    return snapshot.docs[0];
}

/**
 * [NEW & SIMPLIFIED] Cloud Function to create a user document in Firestore.
 * This is called directly from the client after auth user is created.
 */
export const createUserDocument = onCall(async (request) => {
    const { uid, email, name, country, referredByCode, isPaid } = request.data;

    if (!uid || !email || !name) {
        throw new https.HttpsError('invalid-argument', 'The function must be called with "uid", "email", and "name" arguments.');
    }
    
    console.log(`Creating document for new user: ${uid}, email: ${email}.`);

    const userDocRef = db.collection('users').doc(uid);

    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (userDoc.exists) {
                console.log(`User document for ${uid} already exists. Exiting.`);
                return;
            }

            let referrerUid: string | null = null;
            let referrerDocRef: admin.firestore.DocumentReference | null = null;

            if (referredByCode) {
                const referrerDoc = await findUserByReferralCode(referredByCode);
                if (referrerDoc) {
                    referrerUid = referrerDoc.id;
                    referrerDocRef = referrerDoc.ref;
                    transaction.update(referrerDocRef, {
                        directReferrals: admin.firestore.FieldValue.arrayUnion(uid)
                    });
                    console.log(`Scheduled update for referrer ${referrerUid} to add new user ${uid}.`);
                } else {
                    console.warn(`Referrer with code ${referredByCode} was not found.`);
                }
            }

            const referralCode = `PGC-${uid.substring(0, 8).toUpperCase()}`;
            
            const userDocumentData = {
                uid: uid,
                name: name,
                email: email,
                phone: null,
                street: '',
                village: '',
                block: '',
                taluka: '',
                district: '',
                area: '',
                state: '',
                country: country || '',
                pgcBalance: 0,
                usdtBalance: 0,
                referredBy: referrerUid || 'ADMIN_ROOT_USER',
                referralCode: referralCode,
                walletPublicKey: null,
                isVerified: false,
                status: 'Active',
                role: 'User',
                avatarId: `avatar-${Math.ceil(Math.random() * 4)}`,
                registeredAt: admin.firestore.FieldValue.serverTimestamp(),
                directReferrals: [],
                totalTeamSize: 0,
                paidTeamSize: 0,
                freeRank: 'None',
                paidRank: 'None',
                isPaid: isPaid || false
            };

            transaction.set(userDocRef, userDocumentData);
        });

        // After the transaction, conditionally create the presale document and enqueue team rewards
        if (isPaid) {
            console.log(`User ${uid} registered with a paid package. Creating presale document.`);
            await db.collection('presales').add({
                userId: uid,
                amountUSDT: 100, // This is the fixed test amount
                pgcCredited: 200, // 100 base + 100 bonus
                status: 'PENDING_VERIFICATION',
                purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
                registeredWithPurchase: true,
            });
        }
        
        console.log(`Enqueuing team reward processing for new user ${uid}.`);
        const queue = getFunctions().taskQueue('processTeamRewards');
        await queue.enqueue({ newUserId: uid });

        return { result: `Successfully created user document for ${uid}.` };

    } catch (error: any) {
        console.error("Error in createUserDocument function:", error);
        throw new https.HttpsError('internal', 'Failed to create user document.', error.message);
    }
});

// Generic handler for calling Genkit flows from the client or Firebase Studio UI.
export const handler = onRequest(
  async (req: https.Request, res: https.Response): Promise<void> => {
    const { flowId, input } = req.body.data;
    if (!flowId) {
      res.status(400).send({ error: 'flowId is required' });
      return;
    }

    const flows = await listFlows();
    const flow = flows.find(f => f.name === flowId);

    if (!flow) {
      res.status(404).send({ error: `Flow ${flowId} not found` });
      return;
    }
    
    try {
      const output = await ai.run(flowId, input);
      res.status(200).send({ output });
    } catch (e: any) {
      console.error(e);
      res.status(500).send({ error: e.message });
    }
  }
);

    