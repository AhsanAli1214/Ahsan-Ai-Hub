import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  ArrowRight,
  Code,
  Facebook,
  Globe,
  Instagram,
  Mail,
  Twitter,
  Zap,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { AhsanAiHubLogo } from "@/components/icons";

export const metadata: Metadata = {
  title: "About | Ahsan Ai Hub",
  description: "Learn more about the creator of Ahsan Ai Hub.",
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
    "jobTitle": "Developer",
    "sameAs": [
      "https://www.instagram.com/ahsan.ali.wadani",
      "https://x.com/Ahsan_Ali_12",
      "https://www.facebook.com/profile.php?id=100091175299202",
      "https://ahsan-tech-hub.blogspot.com/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Support",
      "email": SUPPORT_EMAIL
    }
  };

  return (
    <div className="flex h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AppHeader title="About Me" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Developer Hero Section */}
          <Card className="overflow-hidden shadow-lg border-accent/30">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-0">
                <div className="relative flex min-h-64 w-full items-center justify-center bg-card p-6 md:min-h-full md:col-span-1">
                  {developerImage && (
                    <div className="relative h-44 w-44 overflow-hidden rounded-2xl border-4 border-accent shadow-xl ring-4 ring-accent/30">
                      <Image
                        src={developerImage.imageUrl}
                        alt="Developer Ahsan Ali"
                        fill
                        className="object-cover"
                        data-ai-hint={developerImage.imageHint}
                      />
                    </div>
                  )}
                </div>
                <div className="p-6 text-center md:col-span-2 md:text-left md:pr-8">
                  <h1 className="font-headline text-4xl md:text-3xl font-bold">
                    Ahsan Ali
                  </h1>
                  <p className="mt-2 text-lg text-muted-foreground">
                    CIT Student & Passionate Developer
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    <Badge
                      variant="secondary"
                      className="border border-accent bg-accent/20 text-accent font-semibold"
                    >
                      CIT Student
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border border-accent bg-accent/20 text-accent font-semibold"
                    >
                      Developer
                    </Badge>
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    I created Ahsan Ai Hub to democratize AI access—making it
                    easier for everyone to leverage intelligent AI.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Highlights Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="bg-card border-accent/30 hover:shadow-lg transition-shadow text-center">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-accent/25 p-3">
                  <Code className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-headline text-lg font-semibold text-foreground">
                  Development
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Building modern solutions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-accent/30 hover:shadow-lg transition-shadow text-center">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-accent/25 p-3">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-headline text-lg font-semibold text-foreground">
                  AI Integration
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Powering innovation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          <Card className="border-accent/30">
            <CardHeader>
              <h2 className="font-headline text-2xl font-semibold">About Me</h2>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                I'm{" "}
                <span className="font-semibold text-foreground">Ahsan Ali</span>
                , a Computer & Information Technology (CIT) student, AI
                enthusiast, and passionate software developer focused on
                building intelligent tools that solve real-world problems.
              </p>

              <div className="rounded-lg bg-accent/10 p-6 border border-accent/20">
                <h3 className="font-semibold text-foreground mb-3">
                  Core Expertise
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-accent">▪</span> Artificial
                    Intelligence & Automation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">▪</span> Mobile App
                    Development
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">▪</span> Full-stack Web
                    Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">▪</span> Natural Language
                    Processing
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-accent">▪</span> UI/UX Chatbot Design
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Mission & Vision
                </h3>
                <p className="leading-relaxed">
                  My mission is to make advanced AI technology accessible,
                  useful, and simple for everyone—whether for productivity,
                  creativity, education, or business use. I believe technology
                  should help people, not complicate their lives.
                </p>
              </div>

              <div className="rounded-lg bg-accent/10 p-6 border border-accent/20">
                <h3 className="font-semibold text-foreground mb-3">
                  Why Ahsan AI Hub?
                </h3>
                <p className="text-sm leading-relaxed">
                  Ahsan AI Hub is my personal AI project designed to assist with
                  everyday tasks, boost productivity, and support students,
                  freelancers, and professionals. It provides creative and
                  technical assistance while being fast, reliable, easy to use,
                  and multi-functional—bringing advanced AI features to
                  everyone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-accent/30">
            <CardHeader>
              <h2 className="font-headline text-xl font-semibold">
                Connect With Me
              </h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SOCIAL_LINKS.map((link) => (
                <Button
                  key={link.id}
                  variant="outline"
                  className="h-auto justify-start p-4 hover:bg-accent/10 transition-colors"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <div
                      className={`mr-4 flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor} ${link.color}`}
                    >
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {link.handle}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="bg-accent/15">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Support Request - Ahsan Ai Hub`}
              className="flex items-center p-6"
            >
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/25 text-accent">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Support & Feedback
                </h3>
                <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </a>
          </Card>

          {/* Footer */}
          <footer className="space-y-6 py-12 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-4">
              <AhsanAiHubLogo className="mx-auto h-12 w-12 text-accent" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Crafted with passion by Ahsan Ali
                </p>
                <div className="mx-auto w-fit rounded-full bg-accent/20 px-6 py-3 border border-accent/50">
                  <span className="text-2xl font-bold text-accent">
                    A❤️N
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} Ahsan Ai Hub. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
