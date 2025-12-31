'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Loader2, Globe, Check, X } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { LANGUAGES } from '@/lib/languages';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<any>(LANGUAGES[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isListening,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceInput({
    onTranscript: (text) => {
      onTranscript(text);
      setIsOpen(false);
      setIsProcessing(false);
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Voice Input Error",
        description: error,
      });
    },
  });

  const handleStart = () => {
    setIsProcessing(true);
    startListening(selectedLang.code);
  };

  const handleStop = () => {
    stopListening();
    setIsProcessing(false);
  };

  if (!isSupported) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full transition-all duration-300 hover:bg-primary/10",
          isListening && "text-destructive animate-pulse bg-destructive/10 hover:bg-destructive/20",
          className
        )}
        onClick={() => setIsOpen(true)}
        title="Voice Input"
      >
        <Mic className={cn("h-5 w-5", isListening && "fill-current")} />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleStop();
        }
        setIsOpen(open);
      }}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-primary/20 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-center flex items-center justify-center gap-2">
              <Mic className={cn("h-6 w-6", isListening ? "text-destructive animate-pulse" : "text-primary")} />
              {isListening ? "Listening..." : "Voice Assistant"}
            </DialogTitle>
            <DialogDescription className="text-center font-medium">
              {isListening 
                ? "Speak clearly into your microphone" 
                : "Choose your language to start speaking"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {!isListening ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-wider text-primary">Select Language</span>
                </div>
                <ScrollArea className="h-[280px] rounded-2xl border border-border/50 bg-background/50 p-2">
                  <div className="grid grid-cols-1 gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left",
                          selectedLang.code === lang.code 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-accent"
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{lang.name}</span>
                          <span className={cn("text-[10px] uppercase font-medium opacity-60", selectedLang.code === lang.code ? "text-primary-foreground" : "text-muted-foreground")}>
                            {lang.code}
                          </span>
                        </div>
                        {selectedLang.code === lang.code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
                <Button 
                  onClick={handleStart} 
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm gap-2 shadow-xl shadow-primary/20"
                >
                  Start Recording
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive text-white shadow-2xl shadow-destructive/40">
                    <Mic className="h-10 w-10 fill-current" />
                  </div>
                </div>
                
                <div className="w-full max-w-sm space-y-3">
                  <div className="min-h-[80px] p-4 rounded-2xl bg-muted/50 border border-border/50 italic text-sm text-center leading-relaxed">
                    {interimTranscript || "Waiting for speech..."}
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleStop}
                      className="flex-1 h-12 rounded-xl border-2 font-bold gap-2"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                    <Button 
                      onClick={handleStop}
                      className="flex-1 h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold gap-2 shadow-lg shadow-destructive/20"
                    >
                      <Check className="h-4 w-4" /> Finish
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
