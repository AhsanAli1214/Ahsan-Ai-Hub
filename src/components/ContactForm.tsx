'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendContactForm, type ContactFormInput } from '@/app/actions/contact';
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
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FormCategory = 'bug_report' | 'feature_request' | 'general_inquiry' | 'collaboration' | 'feedback';

interface FormData {
  name: string;
  email: string;
  subject: string;
  category: FormCategory;
  message: string;
}

const CATEGORIES: { value: FormCategory; label: string; icon: React.ElementType; description: string; color: string }[] = [
  { value: 'bug_report', label: 'Bug Report', icon: AlertTriangle, description: 'Report a technical issue', color: 'text-red-500' },
  { value: 'feature_request', label: 'Feature Request', icon: Lightbulb, description: 'Suggest new features', color: 'text-yellow-500' },
  { value: 'general_inquiry', label: 'General Inquiry', icon: MessageCircle, description: 'General questions', color: 'text-blue-500' },
  { value: 'collaboration', label: 'Collaboration', icon: Zap, description: 'Partnership opportunities', color: 'text-purple-500' },
  { value: 'feedback', label: 'Feedback', icon: MessageSquare, description: 'Share your thoughts', color: 'text-green-500' },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCategoryChange = (category: FormCategory) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await sendContactForm(formData);

      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Message Sent Successfully! ✨',
          description: result.message,
          variant: 'default',
        });

        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            subject: '',
            category: 'general_inquiry',
            message: '',
          });
          setSubmitted(false);
        }, 2000);
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
        toast({
          title: 'Message Failed',
          description: result.error || 'Could not send your message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-500/20 bg-green-500/5 backdrop-blur-sm overflow-hidden">
        <div className="p-8 sm:p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/20 p-6 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Thank You! 🎉</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your message has been received successfully. We appreciate your input and will review it shortly. Our team will get back to you as soon as possible.
            </p>
          </div>
          <p className="text-sm text-muted-foreground/70">Redirecting back to form...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" />
          Send us a Message
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Have a question, suggestion, or found a bug? We'd love to hear from you. Fill out the form below and we'll get back to you shortly.
        </p>
      </div>

      <Card className="border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="flex gap-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-foreground">
                Your Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-12 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-foreground">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-12 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-bold text-foreground">
              Subject *
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="e.g., Login feature not working, Suggestion for improvement"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="h-12 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryChange(cat.value)}
                  className={cn(
                    "group relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                    formData.category === cat.value
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border/40 bg-background/30 hover:border-primary/40 hover:bg-background/50"
                  )}
                >
                  <cat.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", cat.color)} />
                  <span className="text-xs font-bold text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-bold text-foreground">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us more about your message, suggestion, or issue. The more details, the better we can help!"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className="rounded-xl bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.message.length}/5000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
              className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider flex-1 md:flex-none shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ name: '', email: '', subject: '', category: 'general_inquiry', message: '' })}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider"
            >
              Clear
            </Button>
          </div>

          {/* Form Footer */}
          <div className="pt-6 border-t border-border/40 space-y-3">
            <p className="text-xs text-muted-foreground/70">
              ✓ Your email will only be used to respond to your message
            </p>
            <p className="text-xs text-muted-foreground/70">
              ✓ We typically respond within 24 hours
            </p>
            <p className="text-xs text-muted-foreground/70">
              ✓ For urgent issues, contact us on Instagram @ahsan.ali.wadani
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
