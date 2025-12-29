'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square, Zap, Globe, Gauge, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextToSpeechProps {
  text: string;
  disabled?: boolean;
  compact?: boolean;
}

export function TextToSpeech({ text, disabled = false, compact = false }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speed, setSpeed] = useState(1.1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          const natural = availableVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || availableVoices[0];
          setSelectedVoice(natural.name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const handleSpeak = useCallback(() => {
    if (!text.trim()) {
      toast({ title: 'No text detected to read', variant: 'destructive' });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setProgress(0);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = speed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setProgress(0);
      toast({ title: 'System speech failure', description: 'Try selecting a different voice.', variant: 'destructive' });
    };

    // Simple progress estimation
    let charIndex = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        charIndex = event.charIndex;
        setProgress((charIndex / text.length) * 100);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isSpeaking, speed, selectedVoice, voices, toast]);

  if (!isSupported) return null;

  if (compact) {
    return (
      <Button
        onClick={handleSpeak}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className={`h-10 w-10 rounded-xl transition-all ${
          isSpeaking 
            ? 'bg-primary/20 text-primary hover:bg-primary/30' 
            : 'hover:bg-primary/10 hover:text-primary'
        }`}
        title={isSpeaking ? 'Stop playback' : 'Start high-fidelity reading'}
      >
        {isSpeaking ? (
          <Square className="h-5 w-5 animate-pulse" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl overflow-hidden group">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Volume2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground/80">Audio Output</h4>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">HD Browser-Based TTS</p>
            </div>
          </div>
          {isSpeaking && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full animate-pulse">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Live Playback</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
              <Globe className="h-3 w-3" /> Voice Selection
            </label>
            <Select
              value={selectedVoice}
              onValueChange={(value) => setSelectedVoice(value)}
            >
              <SelectTrigger className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background/50 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none">
                <SelectValue placeholder="Select Voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((v) => (
                  <SelectItem key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1">
              <Gauge className="h-3 w-3" /> Playback Speed: {speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-11 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Progress value={progress} className="h-2 rounded-full bg-primary/5" />
          <Button
            onClick={handleSpeak}
            disabled={disabled}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg ${
              isSpeaking 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-primary hover:bg-primary/90 shadow-primary/20'
            }`}
          >
            {isSpeaking ? (
              <span className="flex items-center gap-2 italic">
                <Square className="h-4 w-4 fill-current" /> Stop Audio Hub
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" /> Initialize Reading
              </span>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border/40">
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
            Supports {voices.length} Local System Voices • 100% Private Processing
          </p>
        </div>
      </div>
    </Card>
  );
}
