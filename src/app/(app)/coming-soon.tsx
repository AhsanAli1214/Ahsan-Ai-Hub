import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function GenericPage({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col bg-background">
      <AppHeader title={title} />
      <main className="flex-1 overflow-y-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-4xl font-black tracking-tight text-foreground">{title}</h1>
          <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-2xl p-8">
            <CardContent className="p-0 py-12">
              <p className="text-muted-foreground text-lg">
                The {title} section is coming soon. We are working hard to bring you a professional experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
