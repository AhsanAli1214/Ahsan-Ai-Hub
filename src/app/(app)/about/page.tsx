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
  title: "About Ahsan AI Hub | Privacy-First AI Developed by Ahsan Ali",
  description: "Learn about Ahsan Ali Wadani, the developer of Ahsan AI Hub. Discover our mission to provide free, private AI chat and content tools with no login required.",
  alternates: {
    canonical: '/about',
  },
  keywords: [
    'About Ahsan AI Hub', 
    'Ahsan Ali developer', 
    'Ahsan Ali Wadani AI', 
    'Ahsan Wadani tech',
    'privacy-first AI mission',
    'free AI tools creator',
    'anonymous AI assistant',
    'Ahsan Tech Hub about'
  ],
  openGraph: {
    title: "About Ahsan AI Hub | Creator Ahsan Ali",
    description: "Meet the creator of Ahsan AI Hub and learn about the mission to democratize private AI access.",
    url: 'https://ahsan-ai-hub.vercel.app/about',
    siteName: 'Ahsan AI Hub',
    images: [{ url: '/og-image.png' }],
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
    <main className="flex h-full flex-col bg-background" aria-labelledby="about-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AppHeader title="About the Developer" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-12 pb-20">
          <h1 id="about-heading" className="sr-only">About Ahsan Ali - Developer of Ahsan AI Hub</h1>
            <p>
              Ahsan Ali Wadani is a passionate CIT student and full-stack developer based in Pakistan. 
              As the founder of Ahsan AI Hub, he is dedicated to providing high-quality AI tools like 
              free AI chat, story generators, and code explainers with zero tracking and no login required.
              His mission is to make advanced technology accessible to everyone, ensuring privacy and ease of use.
              Ahsan Ali's work focus on React, Next.js, and AI integration using Google Genkit.
            </p>
          </div>
          
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl border border-accent/20 bg-card/50 backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-12">
              <div className="flex justify-center md:col-span-4 lg:col-span-3">
                <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-4 border-accent shadow-2xl transition-transform hover:scale-105 duration-300">
                  <Image
                    src="/images/developer.jpg"
                    alt="Developer Ahsan Ali"
                    fill
                    sizes="(max-width: 768px) 192px, 192px"
                    className="object-cover"
                    priority
                    fetchPriority="high"
                  />
                </div>
              </div>
              
              <div className="space-y-4 text-center md:col-span-8 md:text-left lg:col-span-9">
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent border border-accent/20">
                  <Award className="h-3 w-3" />
                  Founder & Developer
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                  Ahsan Ali
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                  I am a CIT (Computer Information Technology) student at Mir Chakar Khan Rind University of Technology, Dera Ghazi Khan. 
                  Originally from Dera Ghazi Khan, Punjab, Pakistan, I am a passionate self-learner and developer focused on 
                  building modern, responsive, and privacy-first AI solutions.
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

          {/* Detailed About Section */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-accent/20 bg-card/50 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Rocket className="h-6 w-6 text-accent" />
                My Passion & Technical Interests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Web Development</h3>
                  <p className="text-sm text-muted-foreground">Creating modern, responsive, and user-friendly websites using latest technologies.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Artificial Intelligence</h3>
                  <p className="text-sm text-muted-foreground">Exploring how AI can assist learning, productivity, and creativity for everyone.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Software & Tech</h3>
                  <p className="text-sm text-muted-foreground">Understanding how digital tools can solve everyday problems and simplify lives.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Building automated systems that save time and effort through smart technology.</p>
                </div>
              </div>
            </Card>

            <Card className="border-primary/20 bg-primary/5 p-8 flex flex-col justify-center text-center space-y-4">
              <p className="text-xl font-medium text-foreground italic">
                "With curiosity, consistency, and the right tools, anyone can learn, grow, and build something meaningful."
              </p>
              <p className="text-sm font-bold text-primary">— Personal Belief</p>
            </Card>
          </section>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="group relative overflow-hidden border-accent/20 bg-card/50 transition-all hover:border-accent/40">
              <div className="absolute top-0 left-0 h-1 w-full bg-accent" />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Why Ahsan AI Hub?</h3>
                  <p className="text-sm text-muted-foreground">Mission & Goals</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Ahsan AI Hub was created to offer free, powerful, and easy-to-use AI tools without the need for paid subscriptions or complicated setups.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">✓ Works without unnecessary logins</p>
                  <p className="flex items-center gap-2">✓ Fast, clean, and responsive on all devices</p>
                  <p className="flex items-center gap-2">✓ Designed for students, developers, and creators</p>
                  <p className="flex items-center gap-2">✓ Combines chat, writing, and coding in one platform</p>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-primary/20 bg-card/50 transition-all hover:border-primary/40">
              <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Role & Vision</h3>
                  <p className="text-sm text-muted-foreground">SOLE DEVELOPER RESPONSIBILITIES</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  As the sole developer, I handle everything from designing the frontend to optimizing AI performance and managing deployments.
                </p>
                <p className="leading-relaxed">
                  My long-term vision is to grow this platform into a reliable hub for advanced AI utilities, smart learning tools, and productivity resources for creators worldwide.
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
              <nav className="flex gap-4" aria-label="Social media links">
                 {SOCIAL_LINKS.map(link => (
                   <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Visit my ${link.label} profile`}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 transition-all hover:scale-110 hover:-translate-y-1 hover:shadow-xl",
                      link.bgColor,
                      link.color
                    )}
                   >
                     <link.icon className="h-6 w-6" aria-hidden="true" />
                   </a>
                 ))}
              </nav>
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
