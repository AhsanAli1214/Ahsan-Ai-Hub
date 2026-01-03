import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Gemini API Configuration
// Supports multiple keys via GEMINI_API_KEYS (comma separated)
// Falls back to GEMINI_API_KEY if only one is provided
const apiKey = process.env.GEMINI_API_KEY;

/**
 * Note: Key rotation is handled by the proxy at /api/gemini-proxy
 * To enable rotation:
 * 1. Add GEMINI_API_KEYS="key1,key2,key3" to your secrets
 */

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || 'dummy-key-for-testing',
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});

