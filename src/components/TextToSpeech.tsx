'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextToSpeechProps {
  text: string;
  disabled?: boolean;
}

export function TextToSpeech({ text, disabled = false }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2;
    utterance.pitch = 1;
    utterance.volume = 1;

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
    <Button
      onClick={handleSpeak}
      disabled={disabled}
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
    >
      {isSpeaking ? (
        <Square className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}
