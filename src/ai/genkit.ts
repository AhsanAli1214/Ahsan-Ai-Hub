import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use Replit AI Integrations for Gemini API access
// AI_INTEGRATIONS_GEMINI_API_KEY and AI_INTEGRATIONS_GEMINI_BASE_URL are automatically set
const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY || 'dummy-key-for-replit';
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey,
      ...(baseUrl && { baseUrl })
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
