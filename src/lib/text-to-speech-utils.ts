/**
 * Text-to-Speech utility using browser's native Web Speech API
 * This provides unlimited, free speech synthesis without API limits
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Check if browser supports Web Speech API
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSynthesisSupported()) return [];
  return speechSynthesis.getVoices();
}

/**
 * Play text as speech using Web Speech API
 * @param text - The text to speak
 * @param onEnd - Callback when speech ends
 * @returns Function to stop speech
 */
export function speakText(text: string, onEnd?: () => void): () => void {
  if (!isSpeechSynthesisSupported()) {
    console.error('Web Speech API not supported in this browser');
    return () => {};
  }

  // Stop any currently playing speech
  if (currentUtterance) {
    speechSynthesis.cancel();
  }

  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure utterance
  utterance.rate = 1; // Normal speed
  utterance.pitch = 1; // Normal pitch
  utterance.volume = 1; // Full volume
  
  // Try to use a nice voice if available
  const voices = getAvailableVoices();
  if (voices.length > 0) {
    // Prefer a natural-sounding voice
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && v.name.includes('Google')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    utterance.voice = preferredVoice;
  }

  // Handle completion
  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  // Handle errors gracefully
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
    currentUtterance = null;
    onEnd?.();
  };

  // Start speaking
  currentUtterance = utterance;
  speechSynthesis.speak(utterance);

  // Return stop function
  return () => {
    if (currentUtterance === utterance) {
      speechSynthesis.cancel();
      currentUtterance = null;
    }
  };
}

/**
 * Pause/Resume speech
 */
export function pauseResumeSpeech(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    return true; // Now speaking
  } else {
    speechSynthesis.pause();
    return false; // Now paused
  }
}

/**
 * Stop all speech
 */
export function stopSpeech(): void {
  if (!isSpeechSynthesisSupported()) return;
  speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Check if speech is currently playing
 */
export function isSpeaking(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return speechSynthesis.speaking;
}

/**
 * Check if speech is paused
 */
export function isPaused(): boolean {
  if (!isSpeechSynthesisSupported()) return false;
  return speechSynthesis.paused;
}
