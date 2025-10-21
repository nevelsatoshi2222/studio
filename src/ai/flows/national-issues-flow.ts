'use server';
/**
 * @fileOverview A Genkit flow that generates the top 25 national problems and their solutions for a given country.
 *
 * - generateNationalIssues - A function that calls the Genkit flow.
 * - NationalIssuesInput - The input type for the flow (country name).
 * - NationalIssuesOutput - The output type for the flow (an array of problems with solutions).
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NationalIssuesInputSchema = z.string();
export type NationalIssuesInput = z.infer<typeof NationalIssuesInputSchema>;

const NationalIssuesOutputSchema = z.array(
    z.object({
        title: z.string().describe("The concise title of the national problem."),
        description: z.string().describe("A brief, one-sentence description of the problem."),
        solutions: z.array(z.string()).describe("An array of 3-4 distinct, actionable solutions for the problem."),
    })
);
export type NationalIssuesOutput = z.infer<typeof NationalIssuesOutputSchema>;

// Exported wrapper function to be used in client components
export async function generateNationalIssues(country: NationalIssuesInput): Promise<NationalIssuesOutput> {
    return nationalIssuesFlow(country);
}

const nationalIssuesPrompt = ai.definePrompt({
    name: 'nationalIssuesPrompt',
    input: { schema: NationalIssuesInputSchema },
    output: { schema: NationalIssuesOutputSchema },
    prompt: `You are an expert political scientist and sociologist.
    Generate a list of the top 25 major national problems for the country of {{{input}}}.

    For each problem, provide:
    1.  A concise title for the problem.
    2.  A brief, one-sentence description of the problem.
    3.  A list of 3-4 distinct, actionable, and realistic solutions.

    Return the output as a JSON array of objects, matching the defined output schema. Do not include any markdown or introductory text.
    `,
});

const nationalIssuesFlow = ai.defineFlow(
    {
        name: 'nationalIssuesFlow',
        inputSchema: NationalIssuesInputSchema,
        outputSchema: NationalIssuesOutputSchema,
    },
    async (input) => {
        const { output } = await nationalIssuesPrompt(input);
        
        if (!output) {
            throw new Error('The AI model failed to return a structured response.');
        }

        // The model can sometimes return more or fewer than 25, so we standardize it.
        return output.slice(0, 25);
    }
);
