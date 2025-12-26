import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full mt-auto py-8 border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">Ahsan AI Hub, Developed by Ahsan Ali</p>
          <p className="text-xs text-muted-foreground font-medium">No Login Required • No Data Stored • 100% Privacy-First AI Tools</p>
        </div>
        <div className="flex justify-center gap-6 text-xs text-muted-foreground/60 flex-wrap">
          <Link href="/privacy" className="hover:text-primary transition-colors font-medium underline-offset-4 hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors font-medium underline-offset-4 hover:underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/data-rights" className="hover:text-primary transition-colors font-medium underline-offset-4 hover:underline">Your Data Rights</Link>
        </div>
        <p className="text-[10px] text-muted-foreground/50 pt-2 uppercase tracking-widest">
          © {new Date().getFullYear()} Ahsan AI Hub. Built with privacy-first AI tools.
        </p>
      </div>
    </footer>
  );
}
