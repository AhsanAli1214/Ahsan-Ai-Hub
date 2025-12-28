import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import {
  Globe,
  Instagram,
  Mail,
  ChevronRight,
  Award,
  Rocket,
  Shield,
  Twitter,
  Facebook
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { AhsanAiHubLogo } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Ahsan AI Hub - Creator Ahsan Ali",
  description: "Meet Ahsan Ali, the developer behind Ahsan AI Hub. Learn about our mission to democratize AI, privacy-first platform design, and the journey of creating free AI tools.",
  keywords: ['about Ahsan AI', 'Ahsan Ali developer', 'AI hub creator', 'free AI mission'],
  openGraph: {
    title: "About Ahsan AI Hub - Creator Ahsan Ali",
    description: "Discover the story behind Ahsan AI Hub and Ahsan Ali's mission to bring powerful AI tools to everyone.",
  },
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
    label: "Twitter",
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
    label: "Portfolio",
    handle: "Personal Website",
    url: "https://ahsan-tech-hub.blogspot.com/",
    color: "text-[#0F4C75]",
    bgColor: "bg-[#0F4C75]/15",
  },
];


const developerImage = PlaceHolderImages.find(
  (img) => img.id === "developer-avatar",
);

export default function AboutPage() {
  const SUPPORT_EMAIL = "tickets@ahsan-ai-hub.p.tawk.email";

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ahsan Ali",
    "url": "https://ahsan-ai-hub.replit.dev",
    "image": "https://ahsan-ai-hub.replit.dev/api/og",
    "description": "CIT Student & Passionate Developer - Creator of Ahsan AI Hub",
    "jobTitle": "Lead Developer",
    "sameAs": SOCIAL_LINKS.map(l => l.url),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Technical Support",
      "email": SUPPORT_EMAIL
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AppHeader title="About the Developer" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-12 pb-20">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl border border-accent/20 bg-card/50 backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-12">
              <div className="flex justify-center md:col-span-4 lg:col-span-3">
                {developerImage && (
                  <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-accent shadow-2xl transition-transform hover:scale-105 duration-300">
                    <Image
                      src={developerImage.imageUrl}
                      alt="Developer Ahsan Ali"
                      fill
                      className="object-cover"
                      data-ai-hint={developerImage.imageHint}
                      priority
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4 text-center md:col-span-8 md:text-left lg:col-span-9">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
                  <Award className="h-3 w-3" />
                  Lead Developer
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                  Ahsan Ali
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  A CIT Student & Full-Stack Developer dedicated to building high-performance, privacy-focused AI solutions that empower users globally.
                </p>
                <div className="flex flex-wrap justify-center gap-3 md:justify-start pt-2">
                   <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20" asChild>
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl border-accent/30 hover:bg-accent/5" asChild>
                    <a href="https://ahsan-tech-hub.blogspot.com/" target="_blank">Portfolio</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="group relative overflow-hidden border-accent/20 bg-card/50 transition-all hover:border-accent/40">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent to-primary" />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-accent/10 p-3 text-accent group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">The Mission</h3>
                  <p className="text-sm text-muted-foreground">Why Ahsan AI Hub exists</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  I believe that advanced AI should be a human right, not a luxury. My mission is to remove the barriers of entry—logins, data tracking, and high costs—so that students and professionals everywhere can innovate freely.
                </p>
                <p className="leading-relaxed">
                  Ahsan AI Hub is engineered to be your "Privacy-First Companion," ensuring that your creative thoughts and technical challenges stay between you and the machine.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-primary/20 bg-card/50 transition-all hover:border-primary/40">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-accent" />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Privacy Commitment</h3>
                  <p className="text-sm text-muted-foreground">Zero logs, total freedom</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Every line of code in this project is written with security in mind. I've eliminated server-side storage for chats and replaced it with local browser storage, putting you in total control of your data.
                </p>
                <p className="leading-relaxed">
                  By using cutting-edge language models via Genkit, we ensure high-speed responses while maintaining a lightweight footprint that works perfectly on any device.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What is Ahsan AI Hub Section */}
          <section className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2 className="text-3xl font-bold tracking-tight">What is Ahsan AI Hub?</h2>
              <div className="flex gap-2">
                <div className="h-1 w-24 rounded-full bg-accent/30" />
                <div className="h-1 w-8 rounded-full bg-accent" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border-accent/20 bg-card/50 p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Free AI Tools for Everyone</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ahsan AI Hub provides completely free access to advanced AI tools. No login required, no data stored on servers. Perfect for professionals, students, and creative minds.
                </p>
                <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                  <p>✓ 100% Privacy-First - All data stays local</p>
                  <p>✓ Zero Cost - All features free forever</p>
                  <p>✓ 9 Content Tools - For writing, coding, creativity</p>
                  <p>✓ 50+ Languages - Instant translation support</p>
                </div>
              </Card>

              <Card className="border-primary/20 bg-card/50 p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Key Features</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From AI chat to text enhancement, code explanation to email writing, Ahsan AI Hub has tools for every task. Customize personality modes, response length, and theme to match your preference.
                </p>
                <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                  <p>✓ AI Chat - Real-time conversations</p>
                  <p>✓ Text-to-Speech - Listen to responses</p>
                  <p>✓ Content Generation - Blogs, emails, resumes</p>
                  <p>✓ Code Assistance - Explain and debug code</p>
                </div>
              </Card>
            </div>
          </section>

          {/* Social Connect */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Connect & Collaborate</h3>
              <p className="text-muted-foreground">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
              </p>
              <div className="flex gap-4">
                 {SOCIAL_LINKS.map(link => (
                   <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-xl",
                      link.bgColor,
                      link.color
                    )}
                   >
                     <link.icon className="h-6 w-6" />
                   </a>
                 ))}
              </div>
            </div>
            
            <Card className="border-accent/30 bg-accent/5 backdrop-blur-sm">
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Support Request - Ahsan Ai Hub`}
                className="group flex h-full items-center p-8 transition-colors hover:bg-accent/10"
              >
                <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-foreground">Have a question?</h4>
                  <p className="text-sm text-muted-foreground mt-1">Send a direct message to support</p>
                  <p className="mt-2 font-mono text-xs text-accent font-bold uppercase tracking-widest">{SUPPORT_EMAIL}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 transition-transform" />
              </a>
            </Card>
          </div>

          </div>
      </div>
    </div>
  );
}
