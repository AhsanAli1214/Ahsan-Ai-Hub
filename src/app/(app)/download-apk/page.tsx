import { Metadata } from 'next';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Download,
  CheckCircle2,
  Smartphone,
  Zap,
  Lock,
  Eye,
  Share2,
  FileText,
  Settings,
  HelpCircle,
  Star,
  ArrowRight,
  Shield,
  Lightbulb,
  MessageCircle,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download APK - Ahsan AI Hub',
  description: 'Download Ahsan AI Hub APK for Android. Get the complete AI chat and tools app with offline support and privacy protection.',
  keywords: ['download APK', 'Android app', 'Ahsan AI Hub app', 'AI chat APK'],
};

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Chat',
    description: 'Intelligent conversations with advanced AI powered by Google Gemini',
    color: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Content Tools',
    description: '10+ specialized tools for writing, translation, and content generation',
    color: 'text-purple-500',
  },
  {
    icon: Lightbulb,
    title: 'Smart Features',
    description: 'Text rewriting, code explanation, idea generation, and more',
    color: 'text-yellow-500',
  },
  {
    icon: Lock,
    title: 'No Login',
    description: 'Start using immediately without creating an account',
    color: 'text-green-500',
  },
  {
    icon: Eye,
    title: 'No Data Tracking',
    description: 'Complete privacy - your conversations are never stored or shared',
    color: 'text-red-500',
  },
  {
    icon: Zap,
    title: 'Fast & Smooth',
    description: 'Optimized performance with instant responses and smooth animations',
    color: 'text-orange-500',
  },
];

const INSTALLATION_STEPS = [
  {
    number: 1,
    title: 'Download the APK',
    description: 'Click the download button below to get the latest APK file',
    icon: Download,
  },
  {
    number: 2,
    title: 'Enable Unknown Sources',
    description: 'Go to Settings → Security → Enable "Unknown Sources" to allow APK installation',
    icon: Settings,
  },
  {
    number: 3,
    title: 'Open the File',
    description: 'Open the downloaded APK file from your Downloads folder',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Install the App',
    description: 'Follow the installation prompts and grant necessary permissions',
    icon: Smartphone,
  },
  {
    number: 5,
    title: 'Launch and Enjoy',
    description: 'Find Ahsan AI Hub in your app drawer and start using it',
    icon: Star,
  },
];

const USER_MANUAL = [
  {
    title: 'Getting Started',
    items: [
      'Open the app and you\'ll see the AI Chat section',
      'No login required - start chatting immediately',
      'Type your message in the input field and press send',
      'The AI will respond with helpful answers',
    ],
  },
  {
    title: 'Using Content Tools',
    items: [
      'Tap "Content Tools" from the sidebar',
      'Choose from 10+ specialized tools',
      'Email Writer, Code Generator, Story Writer, and more',
      'Each tool has its own interface optimized for the task',
    ],
  },
  {
    title: 'Personality Modes',
    items: [
      'Switch between Friendly, Professional, Creative, or Teacher modes',
      'Each mode adjusts the AI\'s tone and style',
      'Find the mode selector in the chat interface',
      'Perfect for different contexts and preferences',
    ],
  },
  {
    title: 'Conversation History',
    items: [
      'View all your past conversations in History section',
      'Search through your previous chats',
      'Delete conversations you no longer need',
      'Create new conversations anytime',
    ],
  },
  {
    title: 'Settings & Customization',
    items: [
      'Access Settings to customize your experience',
      'Change themes and colors',
      'Adjust notification preferences',
      'Manage app permissions and privacy settings',
    ],
  },
  {
    title: 'Tips & Tricks',
    items: [
      'Use specific prompts for better AI responses',
      'Try the personality modes for different outputs',
      'Bookmark your favorite tools for quick access',
      'Use content tools for homework and professional work',
    ],
  },
];

const FAQS = [
  {
    question: 'Is Ahsan AI Hub completely free?',
    answer: 'Yes! Ahsan AI Hub is 100% free with no hidden charges. All features are available without a paid subscription.',
  },
  {
    question: 'Do I need internet to use the app?',
    answer: 'Yes, you need an active internet connection to connect with the AI servers. The app requires internet for all features.',
  },
  {
    question: 'Is my data safe and private?',
    answer: 'Absolutely! We don\'t store your conversations or personal data. Your privacy is our top priority.',
  },
  {
    question: 'What Android version is required?',
    answer: 'The app works on Android 6.0 and above for best compatibility and features.',
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Yes! Download and install the app on any Android device. There\'s no limit on the number of devices.',
  },
  {
    question: 'How do I get the latest version?',
    answer: 'Check this page regularly for updates, or enable notifications in the app settings.',
  },
];

export default function DownloadAPKPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Download APK" />
      
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-8 sm:p-12 text-center">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-20 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center justify-center">
                <Smartphone className="h-16 w-16 text-primary animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-black text-foreground">
                  Ahsan AI Hub
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-semibold">
                  The Complete AI Platform for Android
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <a href="/Ahsan%20Ai%20Hub.apk" download className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-base font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform">
                    <Download className="h-5 w-5" />
                    Download APK Now
                  </Button>
                </a>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2"
                  asChild
                >
                  <Link href="/recommendations">
                    <MessageCircle className="h-5 w-5" />
                    Try Online
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Privacy Safe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                Powerful Features
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need in one app
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="border-border/50 hover:border-primary/40 transition-all hover:shadow-lg">
                    <CardContent className="pt-6 space-y-4">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                      <div>
                        <h3 className="font-bold text-foreground text-lg mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Installation Guide */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                How to Install
              </h2>
              <p className="text-muted-foreground text-lg">
                Easy step-by-step installation guide
              </p>
            </div>

            <div className="space-y-4">
              {INSTALLATION_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.number} className="border-border/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-6">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                            {step.number}
                          </div>
                        </div>
                        <div className="flex-1 py-1">
                          <h4 className="font-bold text-foreground text-lg">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* User Manual */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                User Manual
              </h2>
              <p className="text-muted-foreground text-lg">
                Learn how to use every feature
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USER_MANUAL.map((section) => (
                <Card key={section.title} className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Got questions? We have answers
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* System Requirements */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-200/20 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-foreground mb-2">System Requirements</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Android 6.0 or higher</li>
                    <li>• Minimum 50 MB free storage</li>
                    <li>• Active internet connection</li>
                    <li>• Works on phones and tablets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center space-y-6 py-8">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground text-lg">
                Download now and experience the power of AI in your hands
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/Ahsan%20Ai%20Hub.apk" download className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 text-base font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  <Download className="h-5 w-5" />
                  Download APK
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/">
                  <ArrowRight className="h-5 w-5" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
