import Link from 'next/link';
import { Mail, Github, Twitter, Instagram, Facebook, MapPin, Phone, ArrowUpRight, Send } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    products: [
      { label: 'AI Chat', href: '/' },
      { label: 'Content Tools', href: '/content-tools' },
      { label: 'Translation', href: '/translation' },
      { label: 'Text to Speech', href: '/text-to-speech' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: 'https://ahsan-tech-hub.blogspot.com/', external: true },
      { label: 'API Reference', href: '/api' },
      { label: 'Community', href: '/community' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'FAQ', href: '/faq' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Data Rights', href: '/data-rights' },
      { label: 'Cookies', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/Ahsan_Ali_12?s=09', label: 'X (Twitter)' },
    { icon: Instagram, href: 'https://www.instagram.com/ahsan.ali.wadani', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100091175299202&mibextid=PzaGJu', label: 'Facebook' },
    { icon: Github, href: 'https://github.com/ahsan-ali-12', label: 'GitHub' },
  ];

  return (
    <footer className="relative bg-background/95 backdrop-blur-xl border-t border-border/40">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 md:py-16 border-b border-border/40">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-foreground">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest AI tools, features, and tips delivered to your inbox</p>
            </div>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 h-12 px-4 rounded-xl bg-background/50 border border-border/40 focus:border-primary/40 focus:ring-primary/20 focus:outline-none transition text-sm"
              />
              <button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">
                    Ahsan <span className="text-primary">AI Hub</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Privacy-first AI platform with free tools for chat, content creation, and more.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <a href="mailto:tickets@ahsan-ai-hub.p.tawk.email" className="text-muted-foreground hover:text-foreground transition-colors">
                      tickets@ahsan-ai-hub.p.tawk.email
                    </a>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">Global • Remote First</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Products</h4>
              <ul className="space-y-2.5">
                {footerSections.products.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2.5">
                {footerSections.resources.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center gap-1 group"
                    >
                      {item.label}
                      {item.external && <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5">
                {footerSections.company.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2.5">
                {footerSections.legal.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social & Bottom Section */}
        <div className="py-8 border-t border-border/40 space-y-6 md:space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95 group"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Bottom Text */}
            <div className="text-center md:text-right space-y-2">
              <p className="text-xs font-semibold text-foreground">
                © {currentYear} Ahsan AI Hub. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Built with ❤️ • Privacy-First • No Data Tracking
              </p>
              <p className="text-[11px] text-muted-foreground/50">
                Powered by Google Gemini API • Hosted on Vercel
              </p>
            </div>
          </div>

          {/* Version Info */}
          <div className="pt-4 border-t border-border/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="text-xs text-muted-foreground/50">v1.0.0 • Stable Release</span>
            <div className="flex justify-center gap-4 text-xs">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">100% Free</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 font-medium">100% Private</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 font-medium">Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
