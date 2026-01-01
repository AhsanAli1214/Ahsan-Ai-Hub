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
    <DialogContent className="sm:max-w-[420px] w-[95vw] overflow-hidden rounded-[2.5rem] border-primary/10 bg-background/80 backdrop-blur-2xl p-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] transition-all duration-500">
          <div className="relative p-8">
            {/* Ambient Background Glow */}
            <div className={cn(
              "absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors duration-700",
              step === 'recording' ? "bg-destructive" : "bg-primary"
            )} />
            
            <DialogHeader className="mb-8 relative z-10">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "p-4 rounded-3xl transition-all duration-500 shadow-inner",
                    step === 'recording' ? "bg-destructive/10 text-destructive shadow-destructive/5" : "bg-primary/5 text-primary shadow-primary/5"
                  )}
                >
                  <Mic className={cn("h-8 w-8", step === 'recording' && "animate-pulse")} />
                </motion.div>
              </div>
              <DialogTitle className="text-2xl font-bold text-center tracking-tight">
                {step === 'recording' ? "Listening..." : "Voice Control"}
              </DialogTitle>
              <DialogDescription className="text-center text-sm font-medium text-muted-foreground/70 mt-2">
                {step === 'recording' 
                  ? "Go ahead, I'm listening to you" 
                  : "Choose your preferred language"}
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {step === 'language' ? (
                <motion.div
                  key="language-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="space-y-6 relative z-10"
                >
                  <ScrollArea className="h-[280px] rounded-[2rem] border border-primary/5 bg-muted/30 p-3 shadow-inner">
                    <div className="grid grid-cols-1 gap-2">
                      {LANGUAGES.map((lang, idx) => (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => setSelectedLang(lang)}
                          className={cn(
                            "group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden",
                            selectedLang.code === lang.code 
                              ? "bg-primary text-primary-foreground shadow-[0_8px_16px_-4px_rgba(var(--primary),0.3)] scale-[1.02]" 
                              : "hover:bg-primary/5 hover:translate-x-1"
                          )}
                        >
                          <div className="relative z-10 flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-colors",
                              selectedLang.code === lang.code ? "bg-white/20" : "bg-primary/5 text-primary/70"
                            )}>
                              {lang.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm tracking-tight">{lang.name}</span>
                              <span className={cn(
                                "text-[10px] uppercase font-black tracking-widest opacity-50",
                                selectedLang.code === lang.code ? "text-primary-foreground" : "text-muted-foreground"
                              )}>
                                {lang.code}
                              </span>
                            </div>
                          </div>
                          {selectedLang.code === lang.code && (
                            <motion.div
                              layoutId="active-check"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative z-10 bg-white/30 p-1.5 rounded-full"
                            >
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button 
                    onClick={handleStart} 
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-primary-foreground"
                  >
                    Start Experience
                    <div className="p-1 rounded-md bg-white/20">
                      <Mic className="h-3.5 w-3.5" />
                    </div>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="recording-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center justify-center space-y-8 py-2 relative z-10"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-destructive/40 blur-xl" 
                    />
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-destructive text-white shadow-[0_20px_40px_-10px_rgba(239,68,68,0.5)]"
                    >
                      <Mic className="h-12 w-12 fill-current" />
                    </motion.div>
                    
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-8">
                      {[1,2,3,4,5,6,7].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, Math.random() * 20 + 10, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                          className="w-1 bg-destructive rounded-full opacity-60"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full space-y-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-b from-primary/5 to-transparent rounded-[2rem] blur opacity-50 transition duration-1000 group-hover:opacity-100" />
                      <div className="relative min-h-[120px] max-h-[180px] overflow-y-auto p-6 rounded-[2rem] bg-muted/50 border border-primary/5 italic text-base text-center leading-relaxed backdrop-blur-md shadow-inner scrollbar-none">
                        {interimTranscript ? (
                          <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-foreground font-semibold bg-clip-text"
                          >
                            {interimTranscript}
                          </motion.span>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center gap-3 py-4">
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Volume2 className="h-6 w-6 text-primary/30" />
                            </motion.div>
                            <span className="text-[11px] uppercase font-black tracking-[0.25em] text-muted-foreground/40">Waiting for audio</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        onClick={handleStop}
                        className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] gap-2 hover:bg-destructive/5 hover:text-destructive transition-all border border-transparent hover:border-destructive/10"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </Button>
                      <Button 
                        onClick={handleFinish}
                        className="flex-[1.8] h-14 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-[0.15em] text-[10px] gap-2 shadow-2xl shadow-destructive/30 hover:shadow-destructive/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Check className="h-4 w-4" /> Finalize
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
