'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'collect',
      title: '1. Information We Collect',
      content: `👉 None.

We do not collect:

• Personal data
• Login credentials
• Cookies for tracking
• IP-based user profiling`
    },
    {
      id: 'cookies',
      title: '2. Cookies & Tracking',
      content: `• We do not use tracking cookies
• Basic technical cookies may be used by hosting providers (Vercel) for performance and security only`
    },
    {
      id: 'processing',
      title: '3. How Data Is Processed',
      content: `• Inputs are processed temporarily
• No storage
• No logging
• No reuse
• No training on user inputs`
    },
    {
      id: 'third-party',
      title: '4. Third-Party Services',
      content: `We may use:

• AI APIs
• Hosting platforms (Vercel)
• Analytics strictly for performance, not identity

Each third party follows its own privacy practices.`
    },
    {
      id: 'security',
      title: '5. Data Security',
      content: `Even though we don't store data:

• HTTPS encryption is used
• Secure infrastructure is maintained
• No databases of user information exist`
    },
    {
      id: 'children',
      title: '6. Children\'s Privacy',
      content: `• No accounts
• No data collection
• Safe for general audiences
• Parents can allow use without privacy risk`
    },
    {
      id: 'updates',
      title: '7. Policy Updates',
      content: `Policy updates will be reflected on this page with immediate effect.`
    },
    {
      id: 'contact',
      title: '8. Contact Us',
      content: `Questions? Reach out to us at:`
    }
  ];

  return (
    <div className="flex h-full w-full flex-col bg-background selection:bg-primary/20">
      <AppHeader title="Privacy Policy" />
      
      <main className="flex-1 overflow-y-auto px-4 py-12 sm:px-6 lg:px-8 flex flex-col">
        <div className="mb-8">
          <Link href="/contact">
            <Button variant="outline" className="gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Back to Contact
            </Button>
          </Link>
        </div>
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-primary" />
                <h1 className="text-5xl font-black tracking-tight text-foreground">Privacy Policy</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Clear, Honest & Trust-Focused
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 mb-16">
            {/* Intro */}
            <Card className="border-primary/30 bg-primary/5 backdrop-blur-md rounded-2xl p-8">
              <CardContent className="p-0 space-y-4">
                <p className="text-lg font-bold text-foreground">Your privacy matters.</p>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to protecting your data and maintaining transparency about how we operate.
                </p>
              </CardContent>
            </Card>

            {/* Sections */}
            {sections.map((section) => (
              <Card key={section.id} className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <h2 className="text-xl font-black text-foreground">{section.title}</h2>
                  {section.id === 'contact' ? (
                    <a 
                      href="mailto:tickets@ahsan-ai-hub.p.tawk.email"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-lg"
                    >
                      📧 tickets@ahsan-ai-hub.p.tawk.email
                    </a>
                  ) : (
                    <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {section.content}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
