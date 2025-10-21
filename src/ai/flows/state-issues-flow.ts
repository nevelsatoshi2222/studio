'use server';
/**
 * @fileOverview A Genkit flow that generates the top 10 state-level problems and their solutions for a given state in India.
 *
 * - generateStateIssues - A function that calls the Genkit flow.
 * - StateIssuesInput - The input type for the flow (state name).
 * - StateIssuesOutput - The output type for the flow (an array of problems with solutions).
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StateIssuesInputSchema = z.string();
export type StateIssuesInput = z.infer<typeof StateIssuesInputSchema>;

const StateIssuesOutputSchema = z.array(
    z.object({
        title: z.string().describe("The concise title of the state-level problem."),
        description: z.string().describe("A brief, one-sentence description of the problem relevant to the specific state."),
        solutions: z.array(z.string()).describe("An array of 3-4 distinct, actionable solutions for the problem."),
    })
);
export type StateIssuesOutput = z.infer<typeof StateIssuesOutputSchema>;

// Exported wrapper function to be used in client components
export async function generateStateIssues(state: StateIssuesInput): Promise<StateIssuesOutput> {
    return stateIssuesFlow(state);
}

const stateIssuesPrompt = ai.definePrompt({
    name: 'stateIssuesPrompt',
    input: { schema: StateIssuesInputSchema },
    output: { schema: StateIssuesOutputSchema },
    prompt: `You are an expert political scientist and sociologist specializing in India.
    Generate a list of the top 10 major and specific problems for the Indian state of {{{input}}}.

    The problems should be highly relevant to the local context of that particular state. Avoid overly generic problems that apply to the entire nation (like 'unemployment' or 'poverty') unless you can frame them with specific details and context unique to that state. Focus on issues that people in that state would immediately recognize and relate to.

    For each problem, provide:
    1.  A concise title for the problem.
    2.  A brief, one-sentence description of the problem, highlighting its local impact.
    3.  A list of 3-4 distinct, actionable, and realistic solutions.

    Return the output as a JSON array of objects, matching the defined output schema. Do not include any markdown or introductory text.
    `,
});

const stateIssuesFlow = ai.defineFlow(
    {
        name: 'stateIssuesFlow',
        inputSchema: StateIssuesInputSchema,
        outputSchema: StateIssuesOutputSchema,
    },
    async (input) => {
        const { output } = await stateIssuesPrompt(input);
        
        if (!output) {
            throw new Error('The AI model failed to return a structured response.');
        }

        return output.slice(0, 10);
    }
);
