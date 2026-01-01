'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Mail,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Zap,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type FormCategory = 'bug_report' | 'feature_request' | 'general_inquiry' | 'collaboration' | 'feedback';

interface FormData {
  name: string;
  email: string;
  subject: string;
  category: FormCategory;
  message: string;
}

const CATEGORIES: { value: FormCategory; label: string; icon: React.ElementType; description: string; color: string; bgColor: string }[] = [
  { value: 'bug_report', label: 'Bug Report', icon: AlertTriangle, description: 'Report a technical issue', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, description: 'Suggest new features', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  { value: 'general_inquiry', label: 'General Inquiry', icon: MessageCircle, description: 'General questions', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { value: 'collaboration', label: 'Collaboration', icon: Zap, description: 'Partnership opportunities', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { value: 'feedback', label: 'Feedback', icon: MessageSquare, description: 'Share your thoughts', color: 'text-green-500', bgColor: 'bg-green-500/10' },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    category: 'general_inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  }, [error]);

  const handleCategoryChange = useCallback((category: FormCategory) => {
    setFormData(prev => ({ ...prev, category }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Your name is required to send a message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: formData.email.trim(),
          feedback: `[${formData.category.toUpperCase()}] ${formData.subject}\n\n${formData.message}`,
          type: 'Contact Inquiry',
          rating: 5
        }),
      });

      if (!response.ok) throw new Error('Failed to transmit message');

      setSubmitted(true);
      toast({
        title: 'Message Sent Successfully!',
        description: "Your inquiry has been delivered via Resend.",
      });

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general_inquiry',
          message: '',
        });
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message via secure link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, toast]);

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card/40 backdrop-blur-xl border-2 border-green-500/20 rounded-[2.5rem] p-12 text-center shadow-2xl"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative rounded-full bg-green-500/10 p-8 border border-green-500/30">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-foreground uppercase tracking-tight">Transmission Verified!</h3>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed">
              Your message has been delivered to our secure endpoint. 
              We'll respond to your email address shortly.
            </p>
          </div>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-2xl font-black uppercase tracking-widest px-10 h-14 border-2">
            Send New Message
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Card className="border-border/40 bg-card/60 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] shadow-2xl border-2">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {error && (
            <div className="flex items-center gap-4 p-5 rounded-2xl border-2 border-red-500/20 bg-red-500/5 animate-in slide-in-from-top-2">
              <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
              <Input
                id="name"
                name="name"
                placeholder="Ahsan Ali"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-14 rounded-2xl bg-background/40 border-2 border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg px-6"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-14 rounded-2xl bg-background/40 border-2 border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg px-6"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Choose Category</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3",
                    formData.category === cat.value
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-105"
                      : "border-border/40 bg-background/20 hover:border-primary/40 hover:bg-background/40"
                  )}
                >
                  <div className={cn("p-2 rounded-xl transition-colors", cat.bgColor)}>
                    <cat.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", cat.color)} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight">{cat.label}</span>
                  {formData.category === cat.value && (
                    <div className="absolute -top-1.5 -right-1.5 bg-primary rounded-full p-1 text-white shadow-lg">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="subject" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject</label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="h-14 rounded-2xl bg-background/40 border-2 border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg px-6"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="message" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Your Message</label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us everything..."
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="rounded-2xl bg-background/40 border-2 border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-lg px-6 py-4 resize-none min-h-[150px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
              className="w-full sm:w-auto h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all gap-3 bg-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <>
                  Initialize Transmission
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
