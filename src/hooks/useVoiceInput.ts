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
  
  const lastProcessedIndexRef = useRef<number>(-1);
  
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
    // Auto-stop after 10 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  }, [stopListening]);

  const startListening = useCallback((langCode: string = 'en-US') => {
    if (!recognitionRef.current) return;

    // Reset state
    setTranscript('');
    setInterimTranscript('');
    setDetectedLanguage(langCode);
    lastProcessedIndexRef.current = -1;
    
    // Map short codes to full BCP-47 if needed, but the library usually handles it
    recognitionRef.current.lang = langCode === 'en' ? 'en-US' : 
                                 langCode === 'ur' ? 'ur-PK' : 
                                 langCode === 'hi' ? 'hi-IN' : langCode;

    recognitionRef.current.onresult = (event: any) => {
      resetSilenceTimer();
      let interim = '';
      
      // Keep track of the results we've already processed to avoid duplicates
      // Browsers sometimes re-emit results or trigger the event multiple times
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Only process results that are finalized and haven't been processed yet
        if (result.isFinal) {
          if (i > lastProcessedIndexRef.current) {
            const final = result[0].transcript.trim();
            if (final) {
              setTranscript(prev => prev + (prev ? ' ' : '') + final);
              onTranscript(final);
            }
            lastProcessedIndexRef.current = i;
          }
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (onError && event.error !== 'no-speech') {
        onError(event.error === 'not-allowed' ? 'Microphone access denied' : event.error);
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
      // If already started, we just reset the state
      if (e instanceof Error && (e as any).name === 'InvalidStateError') {
        setIsListening(true);
        resetSilenceTimer();
      } else {
        setIsListening(false);
        if (onError) onError('Could not start microphone');
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
