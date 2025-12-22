
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { AhsanAILogo } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About | Ahsan Ai Hub',
  description: 'Learn more about the creator of Ahsan Ai Hub.',
};

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    icon: Instagram,
    label: 'Instagram',
    handle: '@ahsan.ali.wadani',
    url: 'https://www.instagram.com/ahsan.ali.wadani?igsh=MzNlNGNkZWQ4Mg==',
    color: 'text-[#E4405F]',
    bgColor: 'bg-[#E4405F]/15',
  },
  {
    id: 'twitter',
    icon: Twitter,
    label: 'Twitter',
    handle: '@Ahsan_Ali_12',
    url: 'https://x.com/Ahsan_Ali_12?s=09',
    color: 'text-[#1DA1F2]',
    bgColor: 'bg-[#1DA1F2]/15',
  },
  {
    id: 'facebook',
    icon: Facebook,
    label: 'Facebook',
    handle: 'Ahsan Ali',
    url: 'https://www.facebook.com/profile.php?id=100091175299202&mibextid=PzaGJu',
    color: 'text-[#1877F2]',
    bgColor: 'bg-[#1877F2]/15',
  },
  {
    id: 'website',
    icon: Globe,
    label: 'Portfolio',
    handle: 'Personal Website',
    url: 'http://a121472.website2.me/',
    color: 'text-[#0F4C75]',
    bgColor: 'bg-[#0F4C75]/15',
  },
];

const developerImage = PlaceHolderImages.find(
  (img) => img.id === 'developer-avatar'
);

export default function AboutPage() {
  const SUPPORT_EMAIL = 'tickets@ahsan-ai-hub.p.tawk.email';

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="About Me" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Developer Hero Section */}
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 items-center md:grid-cols-3">
                <div className="relative h-64 w-full md:h-full md:col-span-1">
                  {developerImage && (
                    <Image
                      src={developerImage.imageUrl}
                      alt="Developer Ahsan Ali"
                      fill
                      className="object-cover"
                      data-ai-hint={developerImage.imageHint}
                    />
                  )}
                </div>
                <div className="p-6 md:col-span-2">
                  <h1 className="font-headline text-3xl font-bold">Ahsan Ali</h1>
                  <p className="mt-2 text-muted-foreground">
                    CIT Student & Passionate Developer
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="border border-accent bg-accent/20 text-accent"
                    >
                      CIT Student
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="border border-accent bg-accent/20 text-accent"
                    >
                      Developer
                    </Badge>
                  </div>
                   <p className="mt-4 text-muted-foreground">
                    I created Ahsan Ai Hub to democratize AI access—making it easier
                    for everyone to leverage intelligent AI.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Highlights Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="bg-accent/15 text-center">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Code className="mb-2 h-8 w-8 text-accent" />
                <h3 className="font-headline text-lg font-semibold text-accent">
                  Development
                </h3>
                <p className="text-sm text-muted-foreground">
                  Building modern solutions
                </p>
              </CardContent>
            </Card>
            <Card className="bg-accent/15 text-center">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Zap className="mb-2 h-8 w-8 text-accent" />
                <h3 className="font-headline text-lg font-semibold text-accent">
                  AI Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Powering innovation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <h2 className="font-headline text-xl font-semibold">About Me</h2>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                I'm a CIT student and passionate developer with a deep interest
                in AI, automation, and building modern applications that solve
                real problems.
              </p>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
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
                  className="h-auto justify-start p-4"
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
          <footer className="py-8 text-center text-muted-foreground">
            <AhsanAILogo className="mx-auto mb-4 h-10 w-10 opacity-60" />
            <p className="text-sm">Crafted with passion by Ahsan Ali</p>
            <p className="mt-2 text-xs">
              © {new Date().getFullYear()} Ahsan Ai Hub. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
