'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Star, Heart, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function FeedbackDialog() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show feedback dialog after 2 minutes for new users
    const hasSeenFeedback = localStorage.getItem('ahsan-feedback-seen');
    if (!hasSeenFeedback) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 120000); // 2 minutes
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating required",
        description: "Please select a rating before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback, email }),
      });

      if (response.ok) {
        setSubmitted(true);
        localStorage.setItem('ahsan-feedback-seen', 'true');
        setTimeout(() => {
          setIsOpen(false);
          // Reset after closing
          setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setFeedback('');
            setEmail('');
          }, 500);
        }, 3000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error sending your feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 md:bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:scale-110 active:scale-95 transition-all z-[60] p-0"
        title="Give Feedback"
      >
        <MessageSquare className="h-6 w-6 text-primary-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-primary/20 bg-card/95 backdrop-blur-2xl p-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8"
              >
                <DialogHeader className="mb-8">
                  <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <DialogTitle className="text-3xl font-black text-center tracking-tight">
                    Help Us Improve
                  </DialogTitle>
                  <DialogDescription className="text-center text-base font-medium text-muted-foreground mt-2">
                    Your feedback helps Ahsan Ali build a better AI Hub for everyone.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={cn(
                          "p-2 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-90",
                          rating >= star ? "text-yellow-400 scale-110" : "text-muted-foreground/30"
                        )}
                      >
                        <Star className={cn("h-8 w-8", rating >= star && "fill-current")} />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your email (optional)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-2xl border-primary/10 bg-primary/5 focus:ring-primary/20"
                    />
                    <Textarea
                      placeholder="What can we do better?"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px] rounded-[1.5rem] border-primary/10 bg-primary/5 focus:ring-primary/20 resize-none p-4"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSubmitting ? "Sending..." : "Submit Feedback"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Thank You!</h3>
                  <p className="text-muted-foreground font-medium">
                    Your feedback has been sent directly to Ahsan Ali's team.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
