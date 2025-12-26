import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Code,
  Globe,
  Instagram,
  Mail,
  Zap,
  ChevronRight,
  Github,
  Award,
  Book,
  Rocket,
  Shield,
  Linkedin,
  Twitter,
  Facebook
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { AhsanAiHubLogo } from "@/components/icons";

export const metadata: Metadata = {
  title: "About | Ahsan AI Hub",
  description: "Learn more about Ahsan Ali, the developer behind Ahsan AI Hub, and the mission to democratize AI.",
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

const SKILLS = [
  { name: "Next.js 15", level: "Expert" },
  { name: "TypeScript", level: "Expert" },
  { name: "AI Integration", level: "Advanced" },
  { name: "Tailwind CSS", level: "Expert" },
  { name: "Google Genkit", level: "Advanced" },
  { name: "Mobile PWA", level: "Expert" },
];

const MILESTONES = [
  { date: "Oct 2024", title: "Project Inception", desc: "First vision for a privacy-first AI hub." },
  { date: "Dec 2024", title: "v1.0 Launch", desc: "Released core chat and translation tools." },
  { date: "Dec 2025", title: "Global Reach", desc: "Optimized for speed and SEO (currently serving users)." },
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
                  By using Google's Gemini 2.5 Flash via Genkit, we ensure high-speed responses while maintaining a lightweight footprint that works perfectly on any device.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Skills & Expertise */}
          <section className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <h2 className="text-3xl font-bold tracking-tight">Technical Expertise</h2>
              <div className="flex gap-2">
                <div className="h-1 w-24 rounded-full bg-accent/30" />
                <div className="h-1 w-8 rounded-full bg-accent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {SKILLS.map((skill) => (
                <Card key={skill.name} className="border-accent/10 bg-card/30 p-4 text-center hover:bg-accent/5 transition-colors">
                  <div className="text-sm font-bold text-foreground">{skill.name}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-accent font-semibold">{skill.level}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Roadmap / Milestones */}
          <Card className="border-accent/20 bg-card/50 overflow-hidden">
             <CardHeader className="bg-accent/5">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Book className="h-5 w-5 text-accent" />
                  Project Roadmap
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-accent/20 before:to-transparent">
                  {MILESTONES.map((item, i) => (
                    <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                         <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-accent/10 bg-accent/5 shadow-sm">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-foreground">{item.title}</div>
                          <time className="font-mono text-xs text-accent">{item.date}</time>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
          </Card>

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
