'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Star, User, Mail, ArrowLeft, CheckCircle2, Loader2, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/layout/AppHeader';

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
        <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150" />
              <div className="relative h-24 w-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                <CheckCircle2 className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-foreground tracking-tight">Thank You!</h1>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">Your feedback helps us make Ahsan AI Hub even better for everyone. We truly appreciate your time.</p>
            </div>
            <Button asChild size="lg" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all active:scale-95">
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col bg-background selection:bg-primary/30">
      <AppHeader title="Feedback" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.03)_0%,transparent_100%)]">
        <div className="mx-auto max-w-2xl space-y-10">
          <div className="text-center space-y-6 pt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles className="h-3 w-3" />
              Community Driven
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
              We value your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient">opinion</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed text-lg">
              Have suggestions or found a bug? Tell us what you think about Ahsan AI Hub.
            </p>
          </div>

          <Card className="rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border-primary/10 shadow-2xl overflow-hidden relative group transition-all duration-500 hover:border-primary/20">
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 blur-[100px] rounded-full transition-all duration-500 group-hover:bg-primary/10" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-blue-500/5 blur-[100px] rounded-full transition-all duration-500 group-hover:bg-blue-500/10" />
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Name (Optional)</label>
                    <div className="relative group/input">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        placeholder="Your Name" 
                        className="h-14 pl-12 rounded-2xl bg-primary/5 border-transparent focus:border-primary/30 focus:bg-primary/10 transition-all text-foreground font-medium placeholder:text-muted-foreground/50"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email (Optional)</label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                      <Input 
                        placeholder="your@email.com" 
                        type="email"
                        className="h-14 pl-12 rounded-2xl bg-primary/5 border-transparent focus:border-primary/30 focus:bg-primary/10 transition-all text-foreground font-medium placeholder:text-muted-foreground/50"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Subject</label>
                  <div className="relative group/input">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <Input 
                      placeholder="What is this about?" 
                      className="h-14 pl-12 rounded-2xl bg-primary/5 border-transparent focus:border-primary/30 focus:bg-primary/10 transition-all text-foreground font-medium placeholder:text-muted-foreground/50"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 block text-center md:text-left">Experience Rating</label>
                  <div className="flex gap-4 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all active:scale-75 relative"
                      >
                        {star <= (hoveredRating || formData.rating) && (
                          <motion.div
                            layoutId="star-glow"
                            className="absolute inset-0 bg-primary/20 blur-lg rounded-full"
                          />
                        )}
                        <Star 
                          className={`h-10 w-10 transition-all duration-300 relative ${
                            star <= (hoveredRating || formData.rating) 
                              ? 'fill-primary text-primary scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                              : 'text-muted-foreground/20 hover:text-muted-foreground/40'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Your Message</label>
                  <div className="relative group/input">
                    <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    <Textarea 
                      placeholder="Share your thoughts, suggestions, or report a bug..." 
                      className="min-h-[180px] pl-12 py-4 rounded-2xl bg-primary/5 border-transparent focus:border-primary/30 focus:bg-primary/10 transition-all text-foreground font-medium placeholder:text-muted-foreground/50 resize-none leading-relaxed"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-[1.25rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-sm gap-4 shadow-2xl shadow-primary/30 transition-all active:scale-[0.97] hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      SUBMIT FEEDBACK
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.3em] pb-10"
          >
            Built with <Heart className="h-3 w-3 fill-primary/40 text-primary/40" /> by Ahsan Ali
          </motion.div>
        </div>
      </div>
    </main>
  );
}