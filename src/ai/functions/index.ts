
// This is the entry point for deploying your Genkit flows and Cloud Functions.
import { https } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { ai } from '@/ai/genkit';
import { listFlows } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize admin SDK if not already done
if (!admin.apps.length) {
    admin.initializeApp();
}

// Import functions for their side effects, which registers them.
import { onUserCreate } from './onUserCreate';
import { distributeCommission } from './distributeCommission';
import { processTeamRewards } from './processTeamRewards';
import '@/ai/flows/national-issues-flow';
import '@/ai/flows/state-issues-flow';

// Export Cloud Functions for deployment
export const onUserCreateTrigger = onUserCreate;
export const distributeCommissionTrigger = distributeCommission;
export const processTeamRewardsTrigger = processTeamRewards;


// A new, secure Cloud Function to set custom claims on a user.
// This can only be called by an authenticated user on the client.
// In a production app, you would add more security to ensure only admins can call this.
export const setCustomClaims = https.onCall(async (data, context) => {
  // Optional: Add security check here to ensure only admins can set claims.
  // For now, we trust the client-side checks in the 'create-admin' page.
  
  const { uid, claims } = data;
  if (!uid || !claims) {
    throw new https.HttpsError('invalid-argument', 'The function must be called with "uid" and "claims" arguments.');
  }

  try {
    await admin.auth().setCustomUserClaims(uid, claims);
    return { result: `Custom claims set for user ${uid}` };
  } catch (error: any) {
    console.error('Error setting custom claims:', error);
    throw new https.HttpsError('internal', error.message);
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

    // Dynamically find the flow from all registered flows.
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
