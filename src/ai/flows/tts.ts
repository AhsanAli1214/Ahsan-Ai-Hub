// This file is deprecated. TTS now uses browser-native speechSynthesis API only.
// Keeping exports for backward compatibility but redirecting or removing usage.
export async function textToSpeech(input: any): Promise<any> {
  throw new Error('AI-based TTS is disabled. Use browser-native speechSynthesis.');
}
