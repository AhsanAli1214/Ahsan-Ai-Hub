import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertCircle,
  ChevronRight,
  Facebook,
  Globe,
  Info,
  Instagram,
  Mail,
  Twitter,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Ahsan Ai Hub',
  description: 'Get in touch with the creator of Ahsan Ai Hub.',
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
    label: 'Twitter / X',
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
    label: 'Website',
    handle: 'Personal Portfolio',
    url: 'http://a121472.website2.me/',
    color: 'text-[#0F4C75]',
    bgColor: 'bg-[#0F4C75]/15',
  },
];

export default function ContactPage() {
  const SUPPORT_EMAIL = 'tickets@ahsan-ai-hub.p.tawk.email';

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Get in Touch" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Header Card */}
          <div className="rounded-lg bg-accent p-8 text-center text-accent-foreground shadow-md">
            <Mail className="mx-auto h-12 w-12" />
            <h1 className="mt-4 font-headline text-3xl font-bold">
              Get in Touch
            </h1>
            <p className="mt-2 text-accent-foreground/80">
              Connect with Ahsan Ali on social media
            </p>
          </div>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <h2 className="font-headline text-xl font-semibold">
                Social Media
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Support Section */}
          <div>
             <h2 className="mb-4 font-headline text-xl font-semibold">
                Support
            </h2>
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
                    Support Email
                    </h3>
                    <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
            </Card>
          </div>
          

          {/* Note Card */}
          <Card className="flex items-start p-6">
            <Info className="mr-4 h-6 w-6 text-accent" />
            <div className="flex-1">
              <h3 className="font-semibold">Feedback & Suggestions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Have ideas to improve Ahsan Ai Hub? Reach out on any of the
                social platforms above or email our support team!
              </p>
            </div>
          </Card>

          {/* Bug Report Card */}
            <Card className="border-destructive/50 bg-destructive/10">
                 <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Bug Report - Ahsan Ai Hub`}
                className="flex items-center p-6"
                >
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/20 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-destructive">
                    Report a Bug or Error
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Found an issue? Let us know immediately - tap to contact support
                    </p>
                </div>
                <ChevronRight className="h-5 w-5 text-destructive/80" />
                </a>
            </Card>
         

          {/* Footer */}
          <footer className="py-8 text-center text-sm text-muted-foreground">
            <p>Thank you for using Ahsan Ai Hub!</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
