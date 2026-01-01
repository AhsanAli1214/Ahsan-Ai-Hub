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
        <DialogContent className="sm:max-w-md overflow-hidden rounded-[2.5rem] border-primary/20 bg-card/95 backdrop-blur-2xl p-0">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-center flex items-center justify-center gap-3">
                <div className={cn(
                  "p-2 rounded-2xl transition-colors duration-500",
                  step === 'recording' ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  <Mic className={cn("h-6 w-6", step === 'recording' && "animate-pulse")} />
                </div>
                {step === 'recording' ? "Listening..." : "Voice Assistant"}
              </DialogTitle>
              <DialogDescription className="text-center font-medium text-muted-foreground">
                {step === 'recording' 
                  ? "Speak clearly into your microphone" 
                  : "Choose your language to begin"}
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {step === 'language' ? (
                <motion.div
                  key="language-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Languages className="h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-2">
                      <Globe className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Languages</span>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-3xl border border-primary/10 bg-black/5 dark:bg-white/5 p-3">
                    <div className="grid grid-cols-1 gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLang(lang)}
                          className={cn(
                            "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left relative overflow-hidden",
                            selectedLang.code === lang.code 
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                              : "hover:bg-primary/5"
                          )}
                        >
                          <div className="relative z-10 flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{lang.name}</span>
                            <span className={cn(
                              "text-[10px] uppercase font-black tracking-tighter opacity-50",
                              selectedLang.code === lang.code ? "text-primary-foreground" : "text-muted-foreground"
                            )}>
                              ISO-{lang.code.toUpperCase()}
                            </span>
                          </div>
                          {selectedLang.code === lang.code && (
                            <motion.div
                              layoutId="active-check"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="relative z-10 bg-white/20 p-1.5 rounded-full"
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
                    className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-sm gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Initialize Recording
                    <Mic className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="recording-step"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center justify-center space-y-8 py-4"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-destructive/40" 
                    />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-destructive text-white shadow-[0_0_50px_rgba(239,68,68,0.4)]">
                      <Mic className="h-12 w-12 fill-current animate-pulse" />
                    </div>
                    
                    {/* Visualizer bars */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-destructive rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="relative">
                      <div className="min-h-[120px] max-h-[200px] overflow-y-auto p-6 rounded-[2rem] bg-muted/30 border border-primary/10 italic text-base text-center leading-relaxed backdrop-blur-sm">
                        {interimTranscript ? (
                          <span className="text-foreground">{interimTranscript}</span>
                        ) : (
                          <span className="text-muted-foreground opacity-50 flex flex-col items-center gap-2">
                            <Volume2 className="h-5 w-5 animate-bounce" />
                            Awaiting audio input...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={handleStop}
                        className="flex-1 h-14 rounded-2xl border-2 font-black uppercase tracking-wider text-xs gap-2 hover:bg-destructive/5 hover:border-destructive/20 transition-colors"
                      >
                        <X className="h-4 w-4" /> Reset
                      </Button>
                      <Button 
                        onClick={handleFinish}
                        className="flex-1 h-14 rounded-2xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-wider text-xs gap-2 shadow-xl shadow-destructive/25"
                      >
                        <Check className="h-4 w-4" /> Send Message
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
