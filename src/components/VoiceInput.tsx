'use client';

import React, { useState } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { LANGUAGES, type Language } from '@/lib/languages';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { toast } = useToast();
  const [selectedLang, setSelectedLang] = useState<any>(LANGUAGES[0]);

  const {
    isListening,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceInput({
    onTranscript: (text) => {
      onTranscript(text);
      toast({
        title: "Speech Detected",
        description: `Language: ${selectedLang.name}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Voice Input Error",
        description: error,
      });
    },
  });

  if (!isSupported) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full transition-all duration-300",
              isListening && "bg-destructive/10 text-destructive animate-pulse"
            )}
            onClick={() => (isListening ? stopListening() : startListening(selectedLang.code))}
          >
            <Mic className={cn("h-5 w-5", isListening && "fill-current")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 p-2 rounded-2xl max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {isListening ? (
            <div className="p-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="font-medium">Listening...</span>
              </div>
              {interimTranscript && (
                <p className="italic text-xs border-t pt-2 mt-2">{interimTranscript}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => setSelectedLang(lang)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-accent focus:bg-accent",
                    selectedLang.code === lang.code && "bg-primary/10 text-primary"
                  )}
                >
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-[10px] opacity-50 uppercase">{lang.code}</span>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
