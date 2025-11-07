
// This is the entry point for deploying your Genkit flows.
// You can deploy these flows to a serverless environment like
// Cloud Run or Firebase Cloud Functions.
import { https } from 'firebase-functions/v2/https';
import { ai } from '@/ai/genkit';
import { listFlows } from 'genkit';

// Import functions for their side effects, which registers them.
import '@/ai/flows/national-issues-flow';
import '@/ai/flows/state-issues-flow';


// Generic handler for calling Genkit flows.
export const handler = https.onRequest(
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
    