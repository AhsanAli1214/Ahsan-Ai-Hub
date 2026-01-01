'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Star, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lastPrompt = localStorage.getItem('feedback-prompt-date');
    const today = new Date().toDateString();

    if (lastPrompt !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('feedback-prompt-date', today);
      }, 30000); // Show after 30 seconds of activity
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black/95 border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />
          
          <DialogHeader className="relative z-10 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center border border-primary/20">
              <MessageSquare className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">Enjoying Ahsan AI?</DialogTitle>
            <DialogDescription className="text-zinc-400 font-medium leading-relaxed">
              Your feedback helps us grow. Could you take 30 seconds to tell us what you think?
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 flex flex-col gap-4 pt-4">
            <Button asChild size="lg" className="h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs gap-2">
              <Link href="/feedback" onClick={() => setIsOpen(false)}>
                GIVE FEEDBACK <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="h-12 rounded-2xl text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:bg-white/5"
            >
              MAYBE LATER
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}