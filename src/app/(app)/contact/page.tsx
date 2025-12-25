import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertCircle,
  ChevronRight,
  Facebook,
  Globe,
  Info,
  Instagram,
  Mail,
  Twitter,
  MessageSquare,
  Clock,
  Phone,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Ahsan Ai Hub",
  description: "Get in touch with the creator of Ahsan Ai Hub.",
};

const SOCIAL_LINKS = [
  {
    id: "instagram",
    icon: Instagram,
    label: "Instagram",
    handle: "@ahsan.ali.wadani",
    url: "https://www.instagram.com/ahsan.ali.wadani?igsh=MzNlNGNkZWQ4Mg==",
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/15",
  },
  {
    id: "twitter",
    icon: Twitter,
    label: "Twitter / X",
    handle: "@Ahsan_Ali_12",
    url: "https://x.com/Ahsan_Ali_12?s=09",
    color: "text-[#1DA1F2]",
    bgColor: "bg-[#1DA1F2]/15",
  },
  {
    id: "facebook",
    icon: Facebook,
    label: "Facebook",
    handle: "Ahsan Ali",
    url: "https://www.facebook.com/profile.php?id=100091175299202&mibextid=PzaGJu",
    color: "text-[#1877F2]",
    bgColor: "bg-[#1877F2]/15",
  },
  {
    id: "website",
    icon: Globe,
    label: "Website",
    handle: "Personal Portfolio",
    url: "https://ahsan-tech-hub.blogspot.com/",
    color: "text-[#0F4C75]",
    bgColor: "bg-[#0F4C75]/15",
  },
];

export default function ContactPage() {
  const SUPPORT_EMAIL = "tickets@ahsan-ai-hub.p.tawk.email";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ahsan AI Hub",
    "url": "https://ahsan-ai-hub.replit.dev",
    "description": "An intelligent AI-powered platform offering chat, content tools, and AI integration",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Support",
      "email": SUPPORT_EMAIL
    },
    "sameAs": [
      "https://www.instagram.com/ahsan.ali.wadani",
      "https://x.com/Ahsan_Ali_12",
      "https://www.facebook.com/profile.php?id=100091175299202",
      "https://ahsan-tech-hub.blogspot.com/"
    ]
  };

  return (
    <div className="flex h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <AppHeader title="Get in Touch" />
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-16">
          {/* Hero Section */}
          <div className="space-y-4 mb-16 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="text-sm font-black text-primary uppercase tracking-[0.15em]">Contact & Support</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Have questions, feedback, or found an issue? We'd love to hear from you. Reach out through any of the channels below.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Email */}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="group">
              <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer p-6 md:p-8 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-black text-lg text-foreground mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">Reach our support team with any questions or concerns</p>
                <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  <span className="break-all text-xs md:text-sm font-semibold">{SUPPORT_EMAIL}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </a>

            {/* Quick Response */}
            <div className="group">
              <Card className="h-full border-2 border-border/60 p-6 md:p-8 flex flex-col bg-card/50 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5">
                  <Clock className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-black text-lg text-foreground mb-2">Fast Response</h3>
                <p className="text-sm text-muted-foreground flex-1">We typically respond to all inquiries within 24 hours or less</p>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-auto">Available 24/7</span>
              </Card>
            </div>

            {/* Direct Message */}
            <a href="https://www.instagram.com/ahsan.ali.wadani" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full border-2 border-border hover:border-[#E4405F]/50 transition-all duration-300 hover:shadow-lg cursor-pointer p-6 md:p-8 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-[#E4405F]/10 flex items-center justify-center mb-5 group-hover:bg-[#E4405F]/20 transition-colors">
                  <MessageSquare className="h-7 w-7 text-[#E4405F]" />
                </div>
                <h3 className="font-black text-lg text-foreground mb-2">Direct Message</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">Connect on Instagram for quicker casual conversations</p>
                <div className="flex items-center text-[#E4405F] font-bold text-sm group-hover:gap-2 transition-all">
                  <span>@ahsan.ali.wadani</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </a>
          </div>

          {/* Social Media Section */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">Follow on Social Media</h2>
              <p className="text-muted-foreground">Stay updated with the latest features and announcements</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer p-4 md:p-6 flex flex-col items-center text-center h-full">
                    <div className={`w-12 h-12 rounded-2xl ${link.bgColor} ${link.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{link.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{link.handle}</p>
                    <div className="mt-3 text-primary font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Visit</div>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Support Categories */}
          <div className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-foreground mb-2">How Can We Help?</h2>
              <p className="text-muted-foreground">Select the type of inquiry to get faster assistance</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bug Report */}
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Bug Report - Ahsan Ai Hub`} className="group">
                <Card className="border-2 border-border/60 hover:border-destructive/50 transition-all duration-300 hover:shadow-md cursor-pointer p-6 md:p-8 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center flex-shrink-0 group-hover:bg-destructive/20 transition-colors">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-base text-foreground group-hover:text-destructive transition-colors">Report a Bug</h3>
                    <p className="text-sm text-muted-foreground mt-1">Found something not working? Help us improve by reporting it</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-destructive/60 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Card>
              </a>

              {/* Feedback */}
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Feedback - Ahsan Ai Hub`} className="group">
                <Card className="border-2 border-border/60 hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer p-6 md:p-8 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-base text-foreground group-hover:text-primary transition-colors">Feedback & Ideas</h3>
                    <p className="text-sm text-muted-foreground mt-1">Have suggestions to make Ahsan Ai Hub better? We'd love to hear them</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary/60 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Card>
              </a>
            </div>
          </div>

          {/* Response Time Info */}
          <Card className="border-2 border-primary/30 bg-primary/5 p-6 md:p-8 mb-16">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-foreground mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">We're committed to responding to all inquiries as quickly as possible. Most support requests are answered within 24 hours. For urgent issues, please mark your email as urgent or reach out on social media.</p>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <footer className="py-12 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-3">Thank you for being part of the Ahsan Ai Hub community!</p>
            <p className="text-xs text-muted-foreground/60">We appreciate your feedback and support in making this platform better.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
