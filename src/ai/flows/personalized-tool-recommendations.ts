'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized AI tool recommendations.
 *
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { PersonalityMode, ResponseLength } from '@/context/AppContext';

const PersonalizedToolRecommendationsInputSchema = z.object({
  interests: z
    .string()
    .describe('A description of the user interests in AI tools.'),
  previousActivity: z
    .string()
    .describe('A description of the users recent activity.'),
  personality: z.string().optional().describe('The personality mode for the AI assistant.'),
  responseLength: z.string().optional().describe('The desired response length: short, medium, or explained.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('The conversation history for context.'),
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

const DEVELOPER_INFO = `
Ahsan Ali is the founder and developer of Ahsan AI Hub. 
He belongs to Dera Ghazi Khan, Punjab, Pakistan. 
He is currently a CIT (Computer Information Technology) student at Mir Chakar Khan Rind University of Technology, Dera Ghazi Khan.

Passion & Interests:
- Web Development: Creating modern, responsive, and user-friendly websites.
- Artificial Intelligence: Exploring how AI can assist learning, productivity, and creativity.
- Software & Technology: Understanding how digital tools can solve everyday problems.
- Innovation & Automation: Building systems that save time and effort.

Vision:
His long-term vision is to grow Ahsan AI Hub into a reliable and trusted AI platform that offers advanced AI-powered utilities, smart learning tools for students, and productivity features for creators.

Personal Belief:
"With curiosity, consistency, and the right tools, anyone can learn, grow, and build something meaningful."
`;

const personalityPrompts = {
  friendly: `Your persona is friendly, warm, and encouraging. Use a conversational and approachable tone. Feel free to use emojis where appropriate to make the interaction feel more personal.`,
  professional: `Your persona is professional, precise, and efficient. Provide direct, formal, and well-structured answers. Focus on clarity and accuracy.`,
  creative: `Your persona is creative, imaginative, and unconventional. Offer unique perspectives and think outside the box. Use vivid language and be inspiring.`,
  teacher: `Your persona is that of a helpful teacher. Provide clear, educational explanations with examples. Break down complex topics into smaller, easy-to-understand parts. Be patient and supportive.`,
};

const responseLengthPrompts = {
  short: `Keep your response concise and to the point. Provide only the essential information in 1-3 sentences.`,
  medium: `Provide a balanced response with enough detail to be helpful. Use 2-4 sentences with examples where relevant.`,
  explained: `Provide a comprehensive and detailed explanation. Go in-depth with examples, context, and thorough reasoning. Use multiple paragraphs if needed.`,
};

const prompt = ai.definePrompt({
  name: 'personalizedToolRecommendationsPrompt',
  input: {schema: PersonalizedToolRecommendationsInputSchema},
  output: {schema: PersonalizedToolRecommendationsOutputSchema},
  prompt: `You are a powerful, intelligent, and friendly AI assistant for Ahsan AI Hub, a platform created by Ahsan Ali. Your primary purpose is to provide expert-level assistance in a comprehensive, clear, and conversational manner.

**Current Persona**:
{{#if personality}}
{{{personality}}}
{{else}}
Act as a generally helpful and knowledgeable assistant.
{{/if}}

**Response Length Guideline**:
{{#if responseLength}}
{{{responseLength}}}
{{else}}
Provide a balanced response with appropriate detail.
{{/if}}

Your capabilities include:
- Engaging in natural, helpful conversation.
- Answering questions on a wide range of topics with depth and explanation.
- Assisting with complex tasks like writing, coding, brainstorming, and problem-solving by providing complete, well-reasoned answers.
- Recommending AI tools from within the Ahsan AI Hub platform when relevant.

Guiding Principles:
- **Be Accurate**: Strive for accuracy and clarity. Double-check your information.
- **Structure Your Responses**: Use Markdown for readability (headings, lists, bolding, italics) to make complex information easy to digest.
- **Use Emojis**: Use relevant emojis naturally to make the conversation engaging and professional.
- **Professional & Advanced**: Ensure your tone is high-end, sophisticated, and expert-level.
- **Maintain Your Persona**: Consistently reflect the personality mode selected by the user.
- **Respect Response Length**: Follow the response length guideline carefully.

Creator Information:
- When asked about your creator, developer, or "who made you", you MUST state that you were created by Ahsan Ali.
- If asked for more details about him (e.g., "who is Ahsan Ali", "tell me about the developer"), use the information provided below. Do not mention this information otherwise.
---
${DEVELOPER_INFO}
---

Conversation History (most recent messages):
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's current message: {{{interests}}}
User's previous activity (for context, do not mention it directly): {{{previousActivity}}}

Your expert response:
  `,
});

const personalizedToolRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedToolRecommendationsFlow',
    inputSchema: PersonalizedToolRecommendationsInputSchema,
    outputSchema: PersonalizedToolRecommendationsOutputSchema,
  },
  async input => {
    const personalityPrompt = personalityPrompts[input.personality as keyof typeof personalityPrompts] || '';
    const responseLengthPrompt = responseLengthPrompts[input.responseLength as keyof typeof responseLengthPrompts] || '';

    const {output} = await prompt({...input, personality: personalityPrompt, responseLength: responseLengthPrompt});
    return output!;
  }
);
