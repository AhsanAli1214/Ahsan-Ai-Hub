import { NextResponse } from 'next/server';

const AI_TIPS = [
  "Use the Math Solver tool by uploading a clear photo for instant step-by-step solutions.",
  "Ahsan AI Hub is 100% private - your chat history never leaves your device.",
  "Try the 'Friendly' personality mode for a more casual and encouraging AI experience.",
  "The AI Text Rewriter can help you turn rough notes into professional blog posts.",
  "Add Ahsan AI Hub to your home screen for native-app performance and offline access.",
  "Use 'Zero Login' access to chat with AI instantly without sharing personal data.",
  "The Code Explainer tool is perfect for understanding complex logic in seconds."
];

export async function GET() {
  const tip = AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)];
  return NextResponse.json({ tip });
}
