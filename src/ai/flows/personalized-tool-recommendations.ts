'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized AI tool recommendations.
 *
 * The flow takes user interests and activity as input and recommends relevant AI tools.
 * @param {PersonalizedToolRecommendationsInput} input - The input to the flow.
 * @returns {Promise<PersonalizedToolRecommendationsOutput>} - A promise that resolves with the AI tool recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedToolRecommendationsInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the user interests in AI tools.'),
  previousActivity: z
    .string()
    .describe('A description of the users recent activity.'),
});
export type PersonalizedToolRecommendationsInput = z.infer<typeof PersonalizedToolRecommendationsInputSchema>;

const PersonalizedToolRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The AI tool recommendations, listed with descriptions.'),
});
export type PersonalizedToolRecommendationsOutput = z.infer<typeof PersonalizedToolRecommendationsOutputSchema>;

export async function getPersonalizedToolRecommendations(
  input: PersonalizedToolRecommendationsInput
): Promise<PersonalizedToolRecommendationsOutput> {
  return personalizedToolRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedToolRecommendationsPrompt',
  input: {schema: PersonalizedToolRecommendationsInputSchema},
  output: {schema: PersonalizedToolRecommendationsOutputSchema},
  prompt: `You are a friendly and helpful AI assistant for Ahsan Ai Hub.

  Your goal is to have a natural conversation with the user, answer their questions, and help them with their tasks.

  - If the user asks for tool recommendations, you can suggest tools from the app.
  - You can also help with writing, coding, brainstorming, and other general queries.
  - Keep your responses concise and easy to understand.

  User's message: {{{interests}}}
  User's previous activity (for context, you don't have to mention it): {{{previousActivity}}}

  Your response:
  `,
});

const personalizedToolRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedToolRecommendationsFlow',
    inputSchema: PersonalizedToolRecommendationsInputSchema,
    outputSchema: PersonalizedToolRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
