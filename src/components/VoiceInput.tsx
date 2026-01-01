'use client';

import React, { useState } from 'react';
import { Mic, Globe, Check, X, Languages, Volume2, Sparkles } from 'lucide-react';
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
        title: "Voice Recognition Error",
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
          "h-10 w-10 rounded-full transition-all duration-500 hover:bg-primary/15 active:scale-90",
          isListening && "text-destructive bg-destructive/10 hover:bg-destructive/20 shadow-[0_0_20px_rgba(239,68,68,0.4)] ring-2 ring-destructive/20",
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
        <DialogContent className="sm:max-w-md overflow-hidden rounded-[2.5rem] border-primary/20 bg-card/95 backdrop-blur-3xl p-0 shadow-2xl">
          <div className="relative">
            {/* Ambient Background Glow */}
            <div className={cn(
              "absolute -top-24 -left-24 w-48 h-48 blur-[80px] rounded-full transition-colors duration-700",
              step === 'recording' ? "bg-destructive/20" : "bg-primary/20"
            )} />
            
            <div className="relative p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black text-center flex items-center justify-center gap-3">
                  <motion.div 
                    layoutId="mic-container"
                    className={cn(
                      "p-3 rounded-2xl transition-all duration-500",
                      step === 'recording' ? "bg-destructive text-white shadow-lg shadow-destructive/30" : "bg-primary/10 text-primary"
                    )}
                  >
                    <Mic className={cn("h-6 w-6", step === 'recording' && "animate-pulse")} />
                  </motion.div>
                  <span className="tracking-tight">
                    {step === 'recording' ? "Listening Now" : "Voice Assistant"}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-center font-semibold text-muted-foreground/80">
                  {step === 'recording' 
                    ? `Detecting ${selectedLang.name}...` 
                    : "Select your language for best accuracy"}
                </DialogDescription>
              </DialogHeader>

              <AnimatePresence mode="wait">
                {step === 'language' ? (
                  <motion.div
                    key="language-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-primary/5 border border-primary/10 mb-2">
                      <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Ultra-Accurate Engine</span>
                    </div>

                    <ScrollArea className="h-[320px] rounded-[2rem] border border-primary/10 bg-black/5 dark:bg-white/5 p-3 shadow-inner">
                      <div className="grid grid-cols-1 gap-2.5">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLang(lang)}
                            className={cn(
                              "group flex items-center justify-between p-4 rounded-[1.5rem] transition-all duration-300 text-left relative overflow-hidden",
                              selectedLang.code === lang.code 
                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/25 scale-[1.02]" 
                                : "hover:bg-primary/10 active:scale-98"
                            )}
                          >
                            <div className="relative z-10 flex flex-col">
                              <span className="font-bold text-sm tracking-tight leading-none mb-1">{lang.name}</span>
                              <span className={cn(
                                "text-[10px] uppercase font-black tracking-widest opacity-60",
                                selectedLang.code === lang.code ? "text-primary-foreground/80" : "text-muted-foreground/60"
                              )}>
                                {lang.code.toUpperCase()}
                              </span>
                            </div>
                            {selectedLang.code === lang.code && (
                              <motion.div
                                layoutId="active-indicator"
                                className="relative z-10 bg-white/30 p-1.5 rounded-full backdrop-blur-md"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[3px]" />
                              </motion.div>
                            )}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>

                    <Button 
                      onClick={handleStart} 
                      className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.15em] text-sm gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.03] active:scale-[0.97] transition-all bg-primary hover:bg-primary/90"
                    >
                      Start Recording
                      <div className="bg-white/20 p-1 rounded-lg">
                        <Mic className="h-4 w-4" />
                      </div>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="recording-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center justify-center space-y-8 py-6"
                  >
                    <div className="relative">
                      {/* Pulse Waves */}
                      {[1, 2, 3].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ 
                            scale: [1, 1.8],
                            opacity: [0.4, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.4,
                            ease: "easeOut"
                          }}
                          className="absolute inset-0 rounded-full bg-destructive/30" 
                        />
                      ))}
                      
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-white shadow-[0_0_60px_rgba(239,68,68,0.5)] z-10"
                      >
                        <Mic className="h-14 w-14 fill-current animate-pulse" />
                      </motion.div>
                    </div>
                    
                    <div className="w-full space-y-5">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative min-h-[140px] max-h-[220px] overflow-y-auto p-7 rounded-[2.5rem] bg-muted/40 border border-primary/10 shadow-inner backdrop-blur-sm">
                          {interimTranscript ? (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-lg font-medium text-foreground leading-relaxed text-center"
                            >
                              {interimTranscript}
                            </motion.p>
                          ) : (
                            <div className="flex flex-col items-center gap-3 py-4">
                              <div className="flex gap-1.5">
                                {[1,2,3].map(i => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [8, 24, 8] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                    className="w-1.5 bg-destructive/40 rounded-full"
                                  />
                                ))}
                              </div>
                              <span className="text-muted-foreground font-bold text-sm uppercase tracking-widest opacity-40">
                                Listening for speech...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={handleStop}
                          className="flex-1 h-15 rounded-[1.5rem] border-2 border-primary/10 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button 
                          onClick={handleFinish}
                          className="flex-1 h-15 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-2xl shadow-primary/25 active:scale-95 transition-all"
                        >
                          <Check className="h-4 w-4" /> Finish
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
