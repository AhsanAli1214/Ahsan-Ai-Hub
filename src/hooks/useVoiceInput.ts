'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceInputOptions {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

// BCP-47 mapping for common languages to ensure high accuracy
const BCP47_MAP: Record<string, string> = {
  'en': 'en-US',
  'ur': 'ur-PK',
  'hi': 'hi-IN',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'ja': 'ja-JP',
  'zh': 'zh-CN',
  'ar': 'ar-SA',
  'pt': 'pt-BR',
  'ko': 'ko-KR',
  'it': 'it-IT',
  'tr': 'tr-TR',
  'ru': 'ru-RU',
  'bn': 'bn-BD',
  'pa': 'pa-IN',
  'ta': 'ta-IN',
  'te': 'te-IN'
};

export function useVoiceInput({ onTranscript, onError }: VoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.maxAlternatives = 1;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Stop error:', e);
      }
    }
    setIsListening(false);
    setInterimTranscript('');
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    // Auto-stop after 15 seconds of total silence for better UX in longer thoughts
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, 15000);
  }, [stopListening]);

  const startListening = useCallback((langCode: string = 'en') => {
    if (!recognitionRef.current) return;

    // Reset state
    setTranscript('');
    setInterimTranscript('');
    
    // Use mapped BCP-47 code or fallback to provided code
    const fullLangCode = BCP47_MAP[langCode] || langCode;
    setDetectedLanguage(fullLangCode);
    recognitionRef.current.lang = fullLangCode;

    recognitionRef.current.onresult = (event: any) => {
      resetSilenceTimer();
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
        onTranscript(final);
      }
      setInterimTranscript(interim);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (onError && event.error !== 'no-speech') {
        const errorMessages: Record<string, string> = {
          'not-allowed': 'Microphone access denied. Please check your browser settings.',
          'network': 'Network error occurred. Please check your connection.',
          'aborted': 'Voice input was cancelled.',
          'language-not-supported': `The selected language (${langCode}) is not supported by your browser.`
        };
        onError(errorMessages[event.error] || `Error: ${event.error}`);
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      resetSilenceTimer();
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      if (e instanceof Error && (e as any).name === 'InvalidStateError') {
        setIsListening(true);
        resetSilenceTimer();
      } else {
        setIsListening(false);
        if (onError) onError('Could not start microphone. Is it already in use?');
      }
    }
  }, [onTranscript, onError, resetSilenceTimer]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    detectedLanguage,
    startListening,
    stopListening
  };
}
