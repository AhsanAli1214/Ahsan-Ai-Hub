'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Star, MessageSquare, AlertCircle, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const feedbackTypes = [
  { id: 'General Feedback', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'Bug Report', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'Feature Request', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export function FeedbackForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [type, setType] = useState('General Feedback');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      feedback: formData.get('feedback'),
      type,
      rating,
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to send feedback');

      setIsSuccess(true);
      toast({
        title: "Feedback Sent!",
        description: "Thank you for helping us improve Ahsan AI Hub.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
        </div>
        <h3 className="text-2xl font-black mb-2">Message Received!</h3>
        <p className="text-muted-foreground mb-8">
          Your feedback has been sent directly to the development team. 
          We appreciate your contribution to Ahsan AI Hub.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="rounded-full px-8"
        >
          Send More Feedback
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {feedbackTypes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setType(item.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 gap-2",
              type === item.id 
                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" 
                : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <item.icon className={cn("h-6 w-6", item.color)} />
            <span className="text-xs font-bold tracking-tight">{item.id}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-black uppercase tracking-widest opacity-50">Overall Experience</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-90"
              >
                <Star 
                  className={cn(
                    "h-8 w-8 transition-colors duration-200",
                    star <= (hoveredRating || rating) 
                      ? "fill-amber-400 text-amber-400" 
                      : "text-muted-foreground/30"
                  )} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest pl-2">Name (Optional)</label>
            <Input 
              name="name" 
              placeholder="Your name" 
              className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest pl-2">Email (Optional)</label>
            <Input 
              name="email" 
              type="email" 
              placeholder="your@email.com" 
              className="h-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest pl-2">Your Feedback</label>
          <Textarea 
            name="feedback" 
            required 
            placeholder="Tell us what you think, what's broken, or what you'd like to see..." 
            className="min-h-[150px] rounded-3xl bg-muted/30 border-none focus-visible:ring-primary/20 resize-none p-6 text-base"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-sm gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Transmit Feedback
            <Send className="h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}
