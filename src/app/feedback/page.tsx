'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Star, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '@/components/layout/AppHeader';
import Link from 'next/link';

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
        localStorage.setItem('ahsan-feedback-date', new Date().toDateString());
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "There was an error sending your feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex h-full flex-col">
      <AppHeader title="Feedback" />
      
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-2xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card/50 backdrop-blur-2xl shadow-2xl">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 md:p-12"
                >
                  <div className="mb-10 text-center">
                    <div className="mx-auto w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-6">
                      <Heart className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4">Help Us Improve</h1>
                    <p className="text-lg font-medium text-muted-foreground max-w-md mx-auto">
                      Your feedback helps Ahsan Ali build a better AI Hub for everyone. We read every message.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                      <p className="text-center font-bold text-sm uppercase tracking-widest text-primary">Rate your experience</p>
                      <div className="flex justify-center gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={cn(
                              "p-3 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-90",
                              rating >= star ? "text-yellow-400 bg-yellow-400/10 scale-110" : "text-muted-foreground/30 bg-muted/30"
                            )}
                          >
                            <Star className={cn("h-10 w-10", rating >= star && "fill-current")} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest ml-1">Email Address (Optional)</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:ring-primary/20 px-6 text-lg"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-widest ml-1">Your Message</label>
                        <Textarea
                          placeholder="What can we do better? Any bugs or feature requests?"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="min-h-[180px] rounded-[2rem] border-primary/10 bg-primary/5 focus:ring-primary/20 resize-none p-6 text-lg"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {isSubmitting ? "Sending..." : "Send Feedback"}
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-16 flex flex-col items-center text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-14 w-14 text-green-500" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tight">Thank You!</h3>
                    <p className="text-xl text-muted-foreground font-medium max-w-md">
                      Your feedback has been sent directly to Ahsan Ali's team. We'll review it shortly.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl font-bold">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
