import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="flex h-full w-full flex-col bg-background">
      <AppHeader title="Careers" />
      <main className="flex-1 overflow-y-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black tracking-tight text-foreground">Join the Team</h1>
          </div>
          <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-8 text-center">
            <CardContent className="p-0 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Building the future of Privacy-First AI</h2>
              <p className="text-muted-foreground leading-relaxed">
                Currently, Ahsan AI Hub is a solo project developed by Ahsan Ali. While we don't have open positions at the moment, we are always looking for contributors and collaborators.
              </p>
              <div className="pt-6">
                <p className="text-sm font-semibold">Interested in collaborating?</p>
                <a href="mailto:tickets@ahsan-ai-hub.p.tawk.email" className="text-primary hover:underline">Reach out to us</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
