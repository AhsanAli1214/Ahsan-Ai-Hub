'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceInputOptions {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceInput({ onTranscript, onError }: VoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      stopListening();
    }, 8000); // Increased from 2s to 8s for better reliability
  }, [stopListening]);

  const startListening = useCallback((langCode: string = 'en-US') => {
    if (!recognitionRef.current) return;

    setTranscript('');
    setInterimTranscript('');
    setDetectedLanguage(langCode);
    recognitionRef.current.lang = langCode;

    recognitionRef.current.onresult = (event: any) => {
      resetIdleTimer();
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
      setIsListening(false);
      if (onError) onError(event.error);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      resetIdleTimer();
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error('Speech recognition start error:', e);
      // If already started, just ensure state is correct
      if (e instanceof Error && e.name === 'InvalidStateError') {
        setIsListening(true);
        resetIdleTimer();
      } else {
        setIsListening(false);
      }
    }
  }, [onTranscript, onError, resetIdleTimer]);

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
