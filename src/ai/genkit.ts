import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Gemini API Configuration
// Environment variable: GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;

// Validate in production
if (process.env.NODE_ENV === 'production' && !apiKey) {
  throw new Error('Our AI is currently taking a short break. Please try again in a moment or refresh the page.');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-for-testing',
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
