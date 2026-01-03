
import { NextResponse } from 'next/server';

// Pool of Gemini API Keys from environment variable (comma-separated)
const keys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
let currentIndex = 0;

// State to track exhausted keys
const exhaustedUntil: Record<number, number> = {};

function getNextKeyIndex() {
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const idx = (currentIndex + i) % keys.length;
    if (!exhaustedUntil[idx] || exhaustedUntil[idx] < now) {
      currentIndex = (idx + 1) % keys.length;
      return idx;
    }
  }
  return null;
}

export async function POST(req: Request, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const path = params.path.join('/');
  const searchParams = new URL(req.url).searchParams;
  
  // Reconstruct target URL
  const targetBase = "https://generativelanguage.googleapis.com";
  
  const body = await req.json();
  
  let attempt = 0;
  let lastError: any = null;

  while (attempt < keys.length) {
    const keyIndex = getNextKeyIndex();
    if (keyIndex === null) break;
    
    const apiKey = keys[keyIndex];
    const targetUrl = new URL(`${targetBase}/${path}`);
    searchParams.forEach((v, k) => targetUrl.searchParams.set(k, v));
    targetUrl.searchParams.set('key', apiKey);

    try {
      const response = await fetch(targetUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return response;
      }

      if ([429, 403, 401].includes(response.status)) {
        console.warn(`Gemini Key ${keyIndex} exhausted or invalid (${response.status}). Rotating...`);
        exhaustedUntil[keyIndex] = Date.now() + 60 * 1000; // 1 minute cooldown
        attempt++;
        continue;
      }

      // If it's a real error (e.g. 400 Bad Request), don't rotate, just return it
      return response;
    } catch (err) {
      lastError = err;
      attempt++;
    }
  }

  return NextResponse.json({ error: "All Gemini API keys exhausted or failed.", details: lastError }, { status: 429 });
}

export async function GET(req: Request, context: { params: Promise<{ path: string[] }> }) {
   // Handle GET if needed (though Gemini is mostly POST)
   return POST(req, context);
}
