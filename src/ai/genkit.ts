import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use Replit AI Integrations for Gemini API access
// Environment variables: AI_INTEGRATIONS_GEMINI_API_KEY and AI_INTEGRATIONS_GEMINI_BASE_URL
// These are automatically set on Replit. For Vercel, add them to your environment settings.

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  if (!apiKey) {
    throw new Error('Missing AI_INTEGRATIONS_GEMINI_API_KEY environment variable. Please add it to your Vercel/deployment environment settings.');
  }
  if (!baseUrl) {
    throw new Error('Missing AI_INTEGRATIONS_GEMINI_BASE_URL environment variable. Please add it to your Vercel/deployment environment settings.');
  }
}

// Use fallback URLs for development/local testing
const finalApiKey = apiKey || 'dummy-key-for-local-testing';
const finalBaseUrl = baseUrl || 'https://generativelanguage.googleapis.com/v1beta/openai/';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: finalApiKey,
      ...(finalBaseUrl && { baseUrl: finalBaseUrl })
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
