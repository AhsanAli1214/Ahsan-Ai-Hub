'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendContactForm } from '@/app/actions/contact';
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
    
    // Final check for the persistent name error
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Your name is required to send a message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        name: trimmedName,
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      const result = await sendContactForm(payload);

      if (result.success) {
        setSubmitted(true);
        toast({
          title: 'Message Sent Successfully!',
          description: result.message,
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
        }, 3000);
      } else {
        setError(result.error || 'Failed to send message. Please check your details.');
      }
    } catch (err) {
      setError('A system error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, toast]);

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl overflow-hidden p-12 text-center animate-in fade-in zoom-in duration-500 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative rounded-full bg-primary/20 p-8 shadow-inner border border-primary/30">
              <CheckCircle2 className="h-20 w-20 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-foreground uppercase tracking-tight leading-none">Transmission Successful! 🚀</h3>
            <p className="text-muted-foreground text-xl max-w-lg mx-auto font-medium leading-relaxed">
              Your inquiry is being reviewed by our experts. You will receive a response at your provided email address within the next business day.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="default" onClick={() => setSubmitted(false)} className="rounded-2xl font-black uppercase tracking-widest px-10 h-14 shadow-lg shadow-primary/25 bg-primary hover:scale-105 transition-transform">
              Send Another
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          <Mail className="h-3 w-3" />
          Get In Touch
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
          How can we <span className="text-primary">help you</span> today?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
          Have questions, feedback, or a partnership idea? Our team is ready to listen and assist you.
        </p>
      </div>

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
                  aria-label={`Select category: ${cat.label}`}
                  aria-pressed={formData.category === cat.value}
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
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center sm:text-left">
              Secure Submission • 100% Privacy-First • Fast Response
            </p>
          </div>
        </form>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
        <div className="p-6 rounded-[2rem] bg-accent/30 border border-border/40 flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-1">Fast Response</h4>
            <p className="text-sm text-muted-foreground">We typically reply within 24 hours.</p>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-accent/30 border border-border/40 flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-1">Expert Help</h4>
            <p className="text-sm text-muted-foreground">Direct access to our lead developer.</p>
          </div>
        </div>
        <div className="p-6 rounded-[2rem] bg-accent/30 border border-border/40 flex flex-col items-center text-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-xs mb-1">Private Chat</h4>
            <p className="text-sm text-muted-foreground">Your data is never shared with third parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
