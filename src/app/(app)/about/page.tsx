import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  title: 'About | AI Hub Express',
  description: 'Learn more about the creator of AI Hub Express.',
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
          {/* Developer Hero Card */}
          <Card className="overflow-hidden shadow-lg">
            <div className="bg-accent/30 p-8">
              <div className="mx-auto w-fit rounded-full border-4 border-accent bg-accent/20 p-1">
                <Avatar className="h-32 w-32">
                  {developerImage ? (
                    <AvatarImage
                      src={developerImage.imageUrl}
                      alt="Developer Ahsan Ali"
                    />
                  ) : (
                     <AvatarFallback>AA</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
            <div className="p-6 text-center">
              <h1 className="font-headline text-3xl font-bold">Ahsan Ali</h1>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="border border-accent bg-accent/20 text-accent">
                  CIT Student
                </Badge>
                <Badge variant="secondary" className="border border-accent bg-accent/20 text-accent">
                  Developer
                </Badge>
              </div>
            </div>
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
              <p>
                I created Ahsan AI Hub to democratize AI access—making it easier
                for students, developers, and everyone to leverage intelligent
                AI for productivity and learning.
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
              href={`mailto:${SUPPORT_EMAIL}?subject=Support Request - Ahsan AI Hub`}
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
              © {new Date().getFullYear()} Ahsan AI Hub. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
