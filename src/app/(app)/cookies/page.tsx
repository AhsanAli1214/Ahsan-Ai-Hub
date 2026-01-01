import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="flex h-full w-full flex-col bg-background">
      <AppHeader title="Cookie Policy" />
      <main className="flex-1 overflow-y-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black tracking-tight text-foreground">Cookie Policy</h1>
          </div>
          <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-8">
            <CardContent className="p-0 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ahsan AI Hub is designed with privacy at its core. We use minimal cookies strictly for technical performance and core functionality.
              </p>
              <h2 className="text-xl font-bold text-foreground mt-6">1. What are cookies?</h2>
              <p className="text-muted-foreground">Cookies are small text files stored on your device to help websites function better.</p>
              <h2 className="text-xl font-bold text-foreground mt-6">2. How we use cookies</h2>
              <p className="text-muted-foreground">We only use "essential" cookies that are required for the site to work, such as remembering your theme preference or maintaining your local chat history.</p>
              <h2 className="text-xl font-bold text-foreground mt-6">3. Third-party cookies</h2>
              <p className="text-muted-foreground">Our hosting provider (Vercel) may use technical cookies for security and analytics. These do not identify you personally.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
