'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  text: string;
  disabled?: boolean;
}

export function TextToSpeech({ text, disabled = false }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speed, setSpeed] = useState(2.2);

  const handleSpeak = () => {
    if (!text.trim()) {
      toast({ title: 'No text to read', variant: 'destructive' });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any existing speech before starting new one for faster response
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = 1.0; 
    utterance.volume = 1;

    // Pre-load voices for faster initialization if needed
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer a natural sounding voice if available
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({ title: 'Speech failed', variant: 'destructive' });
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={handleSpeak}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className={`h-10 w-10 rounded-xl transition-all ${
          isSpeaking 
            ? 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30' 
            : 'hover:bg-primary/10 hover:text-primary'
        }`}
        title={isSpeaking ? 'Stop reading' : 'Read aloud (1.8x speed)'}
      >
        {isSpeaking ? (
          <Square className="h-5 w-5 animate-pulse" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      {isSpeaking && (
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Zap className="h-3 w-3" />
          Reading...
        </span>
      )}
    </div>
  );
}
