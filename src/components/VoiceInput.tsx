'use client';

import React, { useState } from 'react';
import { Mic, Globe, Check, X, Languages, Volume2 } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<any>(LANGUAGES[0]);
  const [step, setStep] = useState<'language' | 'recording'>('language');

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
      setStep('language');
    },
    onError: (error) => {
      setStep('language');
      toast({
        variant: "destructive",
        title: "Voice Input Error",
        description: error,
      });
    },
  });

  const handleStart = () => {
    setStep('recording');
    startListening(selectedLang.code);
  };

  const handleStop = () => {
    stopListening();
    setStep('language');
  };

  const handleFinish = () => {
    stopListening();
    setIsOpen(false);
    setStep('language');
  };

  if (!isSupported) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full transition-all duration-300 hover:bg-primary/10",
          isListening && "text-destructive bg-destructive/10 hover:bg-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
          className
        )}
        onClick={() => setIsOpen(true)}
        title="Voice Input"
      >
        <Mic className={cn("h-5 w-5", isListening && "animate-pulse fill-current")} />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleStop();
        }
        setIsOpen(open);
        if (open) setStep('language');
      }}>
        <DialogContent className="sm:max-w-[400px] w-[95vw] overflow-hidden rounded-[2rem] border-primary/20 bg-card/98 backdrop-blur-3xl p-0 shadow-2xl">
          <div className="p-5">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-xl transition-colors duration-500",
                  step === 'recording' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  <Mic className={cn("h-5 w-5", step === 'recording' && "animate-pulse")} />
                </div>
                {step === 'recording' ? "Listening..." : "Voice Input"}
              </DialogTitle>
              <DialogDescription className="text-center text-xs font-medium text-muted-foreground">
                {step === 'recording' 
                  ? "Speak clearly into your microphone" 
                  : "Select a language to start"}
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {step === 'language' ? (
                <motion.div
                  key="language-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <ScrollArea className="h-[240px] rounded-2xl border border-primary/5 bg-muted/20 p-2">
                    <div className="grid grid-cols-1 gap-1.5">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLang(lang)}
                          className={cn(
                            "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left relative overflow-hidden",
                            selectedLang.code === lang.code 
                              ? "bg-primary text-primary-foreground shadow-md" 
                              : "hover:bg-primary/10"
                          )}
                        >
                          <div className="relative z-10 flex flex-col">
                            <span className="font-semibold text-sm">{lang.name}</span>
                            <span className={cn(
                              "text-[9px] uppercase font-bold tracking-wider opacity-60",
                              selectedLang.code === lang.code ? "text-primary-foreground" : "text-muted-foreground"
                            )}>
                              {lang.code.toUpperCase()}
                            </span>
                          </div>
                          {selectedLang.code === lang.code && (
                            <motion.div
                              layoutId="active-check"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative z-10 bg-white/20 p-1 rounded-full"
                            >
                              <Check className="h-3 w-3" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button 
                    onClick={handleStart} 
                    className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Start Recording
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="recording-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="flex flex-col items-center justify-center space-y-6 py-2"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.2, 0.05, 0.2]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-destructive/30" 
                    />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive text-white shadow-xl shadow-destructive/30">
                      <Mic className="h-10 w-10 fill-current animate-pulse" />
                    </div>
                    
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                      {[1,2,3,4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [3, 10, 3] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                          className="w-0.5 bg-destructive rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="relative">
                      <div className="min-h-[100px] max-h-[160px] overflow-y-auto p-4 rounded-2xl bg-muted/40 border border-primary/5 italic text-sm text-center leading-relaxed backdrop-blur-sm scrollbar-none">
                        {interimTranscript ? (
                          <span className="text-foreground font-medium">{interimTranscript}</span>
                        ) : (
                          <span className="text-muted-foreground/60 flex flex-col items-center gap-1.5 py-4">
                            <Volume2 className="h-4 w-4 animate-bounce" />
                            <span className="text-[10px] uppercase font-bold tracking-tighter">Listening for audio...</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="ghost" 
                        onClick={handleStop}
                        className="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] gap-2 hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                      <Button 
                        onClick={handleFinish}
                        className="flex-[1.5] h-11 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold uppercase tracking-wider text-[10px] gap-2 shadow-lg shadow-destructive/20"
                      >
                        <Check className="h-3.5 w-3.5" /> Finish
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
