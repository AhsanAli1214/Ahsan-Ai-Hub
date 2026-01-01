'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Star, User, Mail, MessageCircle, ArrowLeft, CheckCircle2, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/layout/AppHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback - Help Us Improve Ahsan AI Hub',
  description: 'Share your thoughts, suggestions, or report issues with Ahsan AI Hub. Your feedback directly helps us build a better, more private AI experience for everyone.',
  keywords: ['Ahsan AI feedback', 'AI tool suggestions', 'privacy-first AI feedback', 'report AI issues', 'AI hub improvements'],
  openGraph: {
    title: 'Feedback - Help Us Improve Ahsan AI Hub',
    description: 'Share your thoughts, suggestions, or report issues with Ahsan AI Hub.',
    type: 'website',
    url: 'https://ahsan-ai-hub.vercel.app/feedback',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feedback - Help Us Improve Ahsan AI Hub',
    description: 'Share your thoughts, suggestions, or report issues with Ahsan AI Hub.',
  }
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a message.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSuccess(true);
        toast({ title: 'Success', description: 'Your feedback has been sent!' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex h-full flex-col bg-background">
        <AppHeader title="Success" />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-white">Thank You!</h1>
              <p className="text-zinc-400 text-lg font-medium">Your feedback helps us make Ahsan AI Hub even better for everyone.</p>
            </div>
            <Button asChild size="lg" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs">
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col bg-background">
      <AppHeader title="Feedback" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="text-center space-y-4 pt-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">We value your <span className="text-primary underline decoration-primary/30 underline-offset-8">opinion</span></h1>
            <p className="text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed">
              Have suggestions or found a bug? Tell us what you think about Ahsan AI Hub.
            </p>
          </div>

          <Card className="rounded-[2.5rem] bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />
            
            <CardContent className="p-8 md:p-10 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input 
                        placeholder="Your Name" 
                        className="h-12 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input 
                        placeholder="your@email.com" 
                        type="email"
                        className="h-12 pl-12 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Subject</label>
                  <Input 
                    placeholder="What is this about?" 
                    className="h-12 px-6 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Experience Rating</label>
                  <div className="flex gap-3 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoveredRating || formData.rating) 
                              ? 'fill-primary text-primary' 
                              : 'text-zinc-700 hover:text-zinc-500'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Your Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-zinc-500" />
                    <Textarea 
                      placeholder="Share your thoughts, suggestions, or report a bug..." 
                      className="min-h-[150px] pl-12 py-4 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 transition-all text-white resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      SUBMIT FEEDBACK
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Made with <Heart className="h-3 w-3 fill-primary text-primary" /> for the community
          </div>
        </div>
      </div>
    </main>
  );
}