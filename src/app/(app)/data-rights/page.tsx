'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Check, ArrowLeft } from 'lucide-react';

export default function DataRightsPage() {
  return (
    <div className="flex h-full w-full flex-col bg-background selection:bg-primary/20">
      <AppHeader title="Your Data Rights" />
      
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
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-5xl font-black tracking-tight text-foreground">Your Data Rights</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                User Rights & Transparency Policy
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 mb-16">
            {/* Core Message */}
            <Card className="border-primary/30 bg-primary/5 backdrop-blur-md rounded-2xl p-8">
              <CardContent className="p-0 space-y-4">
                <h2 className="text-2xl font-black text-foreground">At Ahsan AI Hub, you're in control.</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strongly believe in user privacy, transparency, and control. Since our platform does not require any account creation, login, or signup, your rights are naturally protected by design.
                </p>
              </CardContent>
            </Card>

            {/* What Data We Collect */}
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-black text-foreground">What Data We Collect</h2>
                <p className="text-primary font-bold text-lg">👉 None.</p>
                <p className="text-muted-foreground">We do not collect, store, sell, or track:</p>
                <ul className="space-y-2 text-muted-foreground">
                  {[
                    'Names',
                    'Email addresses',
                    'Phone numbers',
                    'Login credentials',
                    'Personal identifiers',
                    'User accounts'
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How Our Tools Work */}
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-black text-foreground">How Our Tools Work</h2>
                <p className="text-muted-foreground">All tools work instantly and anonymously</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-bold text-foreground">•</span>
                    <span>Inputs are processed only to generate results</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-foreground">•</span>
                    <span>Inputs are not saved, logged, or reused</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-foreground">•</span>
                    <span>Once you close the page, your data is gone</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-black text-foreground">Your Rights as a User</h2>
                <p className="text-muted-foreground">You have the right to:</p>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    'Use the website anonymously',
                    'Access tools without sharing personal information',
                    'Leave the site without leaving a digital footprint',
                    'Contact us anytime for transparency or concerns'
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-black text-foreground">Third-Party AI Services</h2>
                <p className="text-muted-foreground">
                  Some AI features may rely on third-party AI APIs (such as AI model providers). These services process input only to generate responses and are governed by their own privacy standards.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-md rounded-2xl p-8">
              <CardContent className="p-0 space-y-4">
                <h2 className="text-2xl font-black text-foreground">Questions or Concerns?</h2>
                <p className="text-muted-foreground">We are committed to protecting your digital freedom.</p>
                <a 
                  href="mailto:tickets@ahsan-ai-hub.p.tawk.email"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-lg"
                >
                  📧 tickets@ahsan-ai-hub.p.tawk.email
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
