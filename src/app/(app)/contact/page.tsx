import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mail, 
  MessageSquare, 
  Twitter, 
  Facebook,
  Globe,
  Clock,
  Instagram,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support - Reach Out to Ahsan AI Hub',
  description: 'Contact Ahsan AI Hub support for technical issues, feedback, or collaboration. Connect with us on Instagram, Twitter, or email for the fastest response.',
  keywords: [
    'contact Ahsan AI Hub',
    'AI support email',
    'AI developer contact',
    'technical support',
    'AI tool feedback',
  ],
};

export default function ContactPage() {
  const SUPPORT_EMAIL = "tickets@ahsan-ai-hub.p.tawk.email";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Ahsan AI Hub",
    "description": "Direct contact channels for Ahsan AI Hub support and collaboration.",
    "url": "https://ahsan-ai-hub.vercel.app/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ahsan AI Hub",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "email": SUPPORT_EMAIL,
          "contactType": "customer support"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/ahsan.ali.wadani",
        "https://x.com/Ahsan_Ali_12?s=09",
        "https://www.facebook.com/profile.php?id=100091175299202&mibextid=PzaGJu"
      ]
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      value: SUPPORT_EMAIL,
      description: "For official inquiries and technical support tickets. We respond to all queries within 24 hours.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: `mailto:${SUPPORT_EMAIL}`,
      badge: "Official"
    },
    {
      icon: MessageSquare,
      title: "Instagram Support",
      value: "@ahsan.ali.wadani",
      description: "Get quick assistance and stay updated on the latest AI features through our Instagram community.",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      link: "https://www.instagram.com/ahsan.ali.wadani",
      badge: "Fastest"
    },
    {
      icon: Twitter,
      title: "X (Twitter) Updates",
      value: "@Ahsan_Ali_12",
      description: "Follow us for real-time updates, AI news, and productivity tips from the Ahsan AI Hub team.",
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      link: "https://x.com/Ahsan_Ali_12?s=09",
    },
    {
      icon: Facebook,
      title: "Facebook Community",
      value: "Ahsan Ali",
      description: "Join our growing community on Facebook to share ideas and get the most out of our AI tools.",
      color: "text-blue-600",
      bg: "bg-blue-600/10",
      link: "https://www.facebook.com/profile.php?id=100091175299202&mibextid=PzaGJu",
    }
  ];

  const features = [
    { icon: Clock, text: "24/7 Global Support" },
    { icon: Zap, text: "Rapid Response Time" },
    { icon: ShieldCheck, text: "Secure Communication" },
    { icon: Star, text: "Priority for PWA Users" }
  ];

  return (
    <div className="flex h-full w-full flex-col bg-background selection:bg-primary/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <AppHeader title="Contact & Support" />
      
      <main className="flex-1 overflow-y-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="mb-20 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.2em] animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Direct Connection
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
              Skip the forms. Connect with us directly through our official channels for the fastest support and collaboration.
            </p>
            
            {/* Quick Stats/Features */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 pt-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <feature.icon className="h-4 w-4 text-primary/60" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {contactMethods.map((method, idx) => (
              <a 
                key={idx} 
                href={method.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group"
              >
                <Card className="h-full relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1.5 rounded-[2.5rem]">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                    <ArrowUpRight className="h-6 w-6 text-primary" />
                  </div>
                  
                  <CardContent className="p-8 sm:p-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className={cn("rounded-2xl p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", method.bg)}>
                        <method.icon className={cn("h-8 w-8", method.color)} />
                      </div>
                      {method.badge && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-base font-bold text-muted-foreground leading-relaxed line-clamp-2">
                        {method.description}
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-border/40">
                      <p className="text-sm font-black text-primary break-all tracking-tight flex items-center gap-2">
                        {method.value}
                        <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Portfolio/Website Section */}
          <div className="mt-12">
            <a 
              href="https://ahsan-tech-hub.blogspot.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm p-8 sm:p-10 rounded-[2.5rem] hover:border-primary/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-black text-foreground">Official Portfolio</h3>
                      <p className="font-bold text-muted-foreground">Discover more projects and technical articles.</p>
                    </div>
                  </div>
                  <Button className="rounded-2xl h-14 px-8 font-black text-sm uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Explore Now
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </a>
          </div>

          {/* Privacy & Legal Section */}
          <div className="mt-20 pt-12 border-t border-border/40">
            <div className="space-y-8">
              {/* Compliance Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 space-y-4">
                <h3 className="text-lg font-black text-foreground">Your Privacy & Security</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  At Ahsan AI Hub, we are committed to protecting your data and privacy. We comply with international data protection standards and implement industry-leading security measures to safeguard your personal information.
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-6">
                  <CardContent className="p-0 space-y-3">
                    <h4 className="font-black text-foreground text-base">Privacy Policy</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We collect and process data to provide our services. Your information is protected with modern encryption and is never shared with third parties without your consent. Learn how we handle your data.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-6">
                  <CardContent className="p-0 space-y-3">
                    <h4 className="font-black text-foreground text-base">Terms of Service</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      By using Ahsan AI Hub, you agree to our terms and conditions. Our service is provided as-is and we reserve the right to modify terms with notice. Please review our full terms before using our platform.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
