
// This is the entry point for deploying your Genkit flows and Cloud Functions.
import { https } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { ai } from '@/ai/genkit';
import { listFlows } from 'genkit';

// Import functions for their side effects, which registers them.
import * as onUserCreate from './onUserCreate';
import * as distributeCommission from './distributeCommission';
import * as processTeamRewards from './processTeamRewards';
import '@/ai/flows/national-issues-flow';
import '@/ai/flows/state-issues-flow';

// Export Cloud Functions for deployment
export const onUserCreateTrigger = onUserCreate.onUserCreate;
export const distributeCommissionTrigger = distributeCommission.distributeCommission;
export const processTeamRewardsTrigger = processTeamRewards.processTeamRewards;


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
