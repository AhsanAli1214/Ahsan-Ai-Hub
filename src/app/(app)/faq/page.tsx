
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, LifeBuoy, Zap, Shield, MessageCircle, Settings, Smartphone, BookOpen, Clock, Heart, Code, Globe, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ & Help Center | Ahsan AI Hub Help',
  description: 'Find answers to common questions about Ahsan AI Hub. Learn about privacy, AI chat, free content tools, and troubleshooting without login.',
  keywords: [
    'FAQ Ahsan AI Hub',
    'Ahsan AI help center',
    'how to use Ahsan AI',
    'AI chat privacy FAQ',
    'free AI tools troubleshooting',
    'Ahsan Ali AI support',
    'no login AI help',
    'anonymous AI assistant FAQ'
  ],
  openGraph: {
    title: 'FAQ - Help Center | Ahsan AI Hub',
    description: 'Find answers to all your questions about using Ahsan AI Hub tools and features.',
    url: 'https://ahsan-ai-hub.vercel.app/faq',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
  },
};

const FAQ_CATEGORIES = [
  { id: 'general', name: 'General', icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'features', name: 'Features', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'privacy', name: 'Privacy', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'technical', name: 'Technical', icon: Code, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const FAQData = [
  // General
  { 
    cat: 'general',
    q: "What makes Ahsan AI Hub different from other AI platforms?", 
    a: "Unlike most platforms that require accounts and track your data, Ahsan AI Hub is 'Privacy-First' and 'Access-First'. We don't store your chats on our servers, we require zero login, and we provide unrestricted access to 10+ AI-powered tools for free." 
  },
  { 
    cat: 'general',
    q: "Is it really 100% free to use?", 
    a: "Yes. Every tool—from the advanced AI Chat to the Code Explainer and Text Rewriter—is free. There are no hidden subscription tiers or 'Pro' locks on core functionality. My mission is to make powerful AI accessible to everyone." 
  },
  { 
    cat: 'general',
    q: "How can I contact the developer for feedback or issues?", 
    a: "You can reach out directly via the Contact page or email me at tickets@ahsan-ai-hub.p.tawk.email. I personally review all feedback to improve the platform." 
  },
  
  // Features
  { 
    cat: 'features',
    q: "What AI model powers Ahsan AI Hub?", 
    a: "We use cutting-edge language models through the Google Genkit framework. This ensures lightning-fast response times and high intelligence for complex tasks like coding and creative writing." 
  },
  { 
    cat: 'features',
    q: "How do the 'Personality Modes' work?", 
    a: "In Settings, you can switch between modes like 'Professional' (for business/work), 'Teacher' (for learning), 'Creative' (for stories/art), or 'Friendly' (for casual chat). This changes how the AI structures its tone and vocabulary." 
  },
  { 
    cat: 'features',
    q: "Can I use the app for audio translations?", 
    a: "Yes! Every AI message includes a speaker icon for text-to-speech and a translation menu. You can translate responses into 50+ languages and listen to them instantly, making it a great tool for language learning." 
  },
  { 
    cat: 'features',
    q: "What are 'Smart Prompts'?", 
    a: "Smart Prompts are expertly crafted conversation starters designed to show you what the AI is capable of. They help you get high-quality results without having to think of a complex prompt yourself." 
  },
  
  // Privacy
  { 
    cat: 'privacy',
    q: "Where is my chat history stored?", 
    a: "Your chat history never leaves your device. It is stored in your browser's local storage. This means if you clear your browser data or use a different device, the history will reset. We do this to ensure your absolute privacy." 
  },
  { 
    cat: 'privacy',
    q: "Does Ahsan AI Hub use my data to train AI?", 
    a: "No. Since we don't store your personal conversations on our servers, your data is not used for training. You are interacting with the model through an encrypted API connection." 
  },
  { 
    cat: 'privacy',
    q: "Is there any tracking or analytics?", 
    a: "We use minimal, anonymous performance analytics (like Vercel Analytics) to ensure the site is running fast and without errors. We do NOT track individual user identities or message content." 
  },

  // Technical
  { 
    cat: 'technical',
    q: "How do I install the app on my phone or computer?", 
    a: "Since this is a Progressive Web App (PWA), you can install it without an app store. On Chrome (Android/Desktop), click the 'Install App' button or the 'Add to Home Screen' option in your browser menu. On Safari (iOS), tap 'Share' then 'Add to Home Screen'." 
  },
  { 
    cat: 'technical',
    q: "What should I do if the AI stops responding?", 
    a: "First, check your internet connection. If you're online and it's still stuck, try refreshing the page. If the issue persists, use the 'Report Error' button that appears when a crash is detected to notify the developer." 
  },
  { 
    cat: 'technical',
    q: "Can I use Ahsan AI Hub while offline?", 
    a: "While the interface and your saved chat history work offline, generating new AI responses requires an active internet connection to communicate with the AI models." 
  },
  { 
    cat: 'technical',
    q: "Does it support dark mode?", 
    a: "Yes! The app follows your system preference by default, but you can manually toggle between Light and Dark themes in the Settings page." 
  }
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <main className="flex h-full flex-col bg-background" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AppHeader title="Help Center" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-10">
        <div className="mx-auto max-w-5xl space-y-12 pb-24">
          <h1 id="faq-heading" className="sr-only">Frequently Asked Questions about Ahsan AI Hub</h1>
            <p>
              Find answers to questions like: Is Ahsan AI Hub free? How does privacy work? 
              How can I use the AI story writer? Does Ahsan AI Hub require a login? 
              Ahsan AI Hub is the best free AI platform for students and professionals.
              Learn about our zero-log policy, text-to-speech features, and translation capabilities.
              Developed by Ahsan Ali Wadani, this platform offers the most secure AI chat experience online.
            </p>
          

          {/* Enhanced Hero Section */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 border border-primary/20 p-10 md:p-16 text-center">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="rounded-2xl bg-primary/20 p-5 backdrop-blur-md shadow-inner">
                  <HelpCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                How can we help?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explore our comprehensive guides and frequently asked questions to get the most out of Ahsan AI Hub.
              </p>
            </div>
          </div>
          
          {/* Visual Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FAQ_CATEGORIES.map((cat) => (
              <Card key={cat.id} className="group cursor-pointer border-accent/10 bg-card/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-accent/40 hover:shadow-xl">
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`mx-auto w-12 h-12 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm tracking-wide uppercase">{cat.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main FAQ Accordion */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight">Most Common Questions</h2>
            </div>
            
            <Card className="border border-accent/20 overflow-hidden bg-card/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-2 sm:p-6 lg:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {FAQData.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b border-accent/10 last:border-0 px-4">
                      <AccordionTrigger className="text-left py-6 text-lg font-bold hover:no-underline group" aria-label={`Read answer for: ${item.q}`}>
                        <span className="group-hover:text-primary transition-colors flex items-center gap-4">
                          <span className="text-xs font-mono text-accent/50" aria-hidden="true">{index + 1}</span>
                          {item.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-base md:text-lg pl-8">
                        <div className="bg-accent/5 rounded-2xl p-6 border border-accent/10">
                          {item.a}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* New: Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-accent/10 bg-accent/5 p-6 flex items-center gap-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Systems: Operational</div>
            </Card>
            <Card className="border-accent/10 bg-accent/5 p-6 flex items-center gap-4">
              <Globe className="h-5 w-5 text-accent" />
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Global CDN: Active</div>
            </Card>
            <Card className="border-accent/10 bg-accent/5 p-6 flex items-center gap-4">
              <Shield className="h-5 w-5 text-accent" />
              <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Security: Encrypted</div>
            </Card>
          </div>

          {/* Support Call-to-Action */}
          <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground p-1 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <CardContent className="relative bg-background/5 backdrop-blur-xl rounded-[calc(2.5rem-4px)] p-10 md:p-16 text-center">
              <div className="flex justify-center mb-8">
                <div className="rounded-3xl bg-primary p-6 shadow-2xl">
                  <LifeBuoy className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Still need assistance?</h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                I'm dedicated to providing the best AI experience. If you found a bug or have a suggestion, please reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default" className="rounded-2xl h-14 px-8 text-lg font-bold shadow-xl" asChild>
                  <Link href="/contact">
                    <MessageCircle className="mr-2 h-6 w-6" />
                    Chat with Support
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 text-lg font-bold border-accent/20" asChild>
                  <a href="mailto:tickets@ahsan-ai-hub.p.tawk.email">
                    <Mail className="mr-2 h-6 w-6" />
                    Email Developer
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Updated FAQ Footer */}
          <footer className="pt-10 pb-20 text-center space-y-6">
            <div className="flex justify-center gap-2">
               {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-accent/20" />)}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
