import Link from 'next/link';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 w-full py-3 px-4 border-t border-border/40 bg-background/95 backdrop-blur-sm md:relative md:z-auto md:mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-center md:text-left space-y-1">
          <p className="text-xs font-semibold text-foreground">Ahsan AI Hub © {new Date().getFullYear()}</p>
          <p className="text-[11px] text-muted-foreground/80">Privacy-First AI Tools • No Login • No Data Stored</p>
        </div>
        <div className="flex justify-center md:justify-end gap-4 text-[11px] text-muted-foreground/70 flex-wrap">
          <Link href="/privacy" className="hover:text-primary transition-colors font-medium hover:underline">Privacy</Link>
          <span className="text-border/40">•</span>
          <Link href="/terms" className="hover:text-primary transition-colors font-medium hover:underline">Terms</Link>
          <span className="text-border/40">•</span>
          <Link href="/data-rights" className="hover:text-primary transition-colors font-medium hover:underline">Data Rights</Link>
        </div>
      </div>
    </footer>
  );
}
