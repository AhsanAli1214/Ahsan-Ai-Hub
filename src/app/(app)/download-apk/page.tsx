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
  FileText,
  Settings,
  HelpCircle,
  Star,
  ArrowRight,
  Shield,
  Lightbulb,
  MessageCircle,
  BookOpen,
  Laptop,
  Apple,
  Chrome,
  AlertCircle,
  Copy,
  Share2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download & Install - Ahsan AI Hub',
  description: 'Download Ahsan AI Hub APK for Android or install PWA on Desktop/iOS. Complete installation guides for all devices.',
  keywords: ['download APK', 'Android app', 'PWA install', 'iOS app', 'Desktop app'],
};

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'AI Chat',
    description: 'Intelligent conversations with advanced AI',
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

const ANDROID_STEPS = [
  {
    number: 1,
    title: 'Locate Download Button',
    description: 'Scroll down on this page and click the "Download APK Now" button at the bottom',
    icon: Download,
  },
  {
    number: 2,
    title: 'Enable Unknown Sources',
    description: 'Go to Settings → Security → Enable "Unknown Sources" or "Install from unknown apps"',
    icon: Settings,
  },
  {
    number: 3,
    title: 'Open Downloaded File',
    description: 'Open file manager, navigate to Downloads folder, and tap the APK file',
    icon: FileText,
  },
  {
    number: 4,
    title: 'Grant Permissions',
    description: 'Follow the installation prompts and grant necessary permissions when asked',
    icon: CheckCircle2,
  },
  {
    number: 5,
    title: 'Open and Use',
    description: 'Find Ahsan AI Hub in your app drawer and tap to launch the app',
    icon: Star,
  },
];

const DESKTOP_PWA_STEPS = [
  {
    os: 'Windows (Chrome/Edge)',
    steps: [
      'Open this website in Chrome or Microsoft Edge browser',
      'Look for the "Install" icon (usually in the address bar on the right)',
      'Click the install icon or go to Menu (⋮) → "Install app"',
      'Confirm the installation when the dialog appears',
      'The app will be installed and appear in your Start menu',
      'Launch Ahsan AI Hub from Start menu anytime',
    ],
  },
  {
    os: 'Mac (Chrome/Safari)',
    steps: [
      'Open this website in Chrome or Safari browser',
      'In Chrome: Click Menu (⋮) → "Install app"',
      'In Safari: Click Share → "Add to Dock"',
      'Confirm the installation when prompted',
      'The app appears in your Applications folder and Dock',
      'Open from Dock or Applications folder anytime',
    ],
  },
  {
    os: 'Linux (Chrome)',
    steps: [
      'Open this website in Chrome or Chromium browser',
      'Click the install icon in the address bar or Menu (⋮)',
      'Select "Install app"',
      'Confirm installation',
      'The app will be available in your applications menu',
      'Launch from your application launcher',
    ],
  },
];

const IOS_PWA_STEPS = [
  {
    number: 1,
    title: 'Open in Safari',
    description: 'Open this website in Safari browser (NOT Chrome) on your iPhone or iPad',
    icon: Apple,
  },
  {
    number: 2,
    title: 'Tap Share Button',
    description: 'Tap the Share icon (arrow pointing up) at the bottom of the screen',
    icon: Share2,
  },
  {
    number: 3,
    title: 'Select "Add to Home Screen"',
    description: 'Scroll down in the share menu and tap "Add to Home Screen"',
    icon: Smartphone,
  },
  {
    number: 4,
    title: 'Confirm Installation',
    description: 'A dialog will appear. Tap "Add" to confirm adding the app to your home screen',
    icon: CheckCircle2,
  },
  {
    number: 5,
    title: 'Find on Home Screen',
    description: 'The app now appears on your home screen. Tap to launch Ahsan AI Hub',
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
      'Find the mode selector in the settings',
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
      'Change themes and colors to your preference',
      'Adjust notification settings',
      'Manage app permissions and privacy',
    ],
  },
  {
    title: 'Tips & Tricks',
    items: [
      'Use specific prompts for better AI responses',
      'Try different personality modes for varied outputs',
      'Bookmark your favorite tools for quick access',
      'Use content tools for homework and professional work',
    ],
  },
];

const FAQS = [
  {
    question: 'Where is the Download APK button?',
    answer: 'Scroll down to the bottom of this page. You\'ll find the bright blue "Download APK Now" button in the "Ready to Get Started?" section.',
  },
  {
    question: 'Which installation method should I use?',
    answer: 'Use APK for Android phones/tablets, PWA for desktop (Windows/Mac/Linux), and PWA for iOS. All provide the same features and experience.',
  },
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
    question: 'What\'s the difference between APK and PWA?',
    answer: 'APK is for Android devices. PWA works on all devices (desktop, iPhone, iPad) through any browser. Both offer the same features.',
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Yes! Download/install on any Android device or desktop. Install the PWA on iPhone/iPad. There\'s no limit on devices.',
  },
  {
    question: 'How do I get the latest version?',
    answer: 'For APK: Download the latest version from this page. For PWA: The app updates automatically when you open it.',
  },
];

export default function DownloadAPKPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Download & Install" />
      
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
                  Install on Any Device - Desktop, Android, or iPhone
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4 text-sm font-semibold">
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

          {/* Installation Methods - Tabs */}
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                Choose Your Device
              </h2>
              <p className="text-muted-foreground text-lg">
                Select your platform for step-by-step installation guide
              </p>
            </div>

            {/* Android APK Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-primary">
                <Smartphone className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Android (APK)</h3>
              </div>

              <div className="space-y-4">
                {ANDROID_STEPS.map((step) => {
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

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="text-blue-700 dark:text-blue-300 text-sm">
                    <p className="font-semibold mb-2">Important Note for Android:</p>
                    <p>If you get a "Cannot install app" error, it means "Install from Unknown Apps" is disabled. Go to Settings → Apps → Special App Access → Install unknown apps → Select your browser → Turn ON</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop PWA Section */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-500">
                <Laptop className="h-8 w-8 text-blue-500" />
                <h3 className="text-2xl font-bold text-foreground">Desktop (Windows, Mac, Linux)</h3>
              </div>

              <div className="space-y-6">
                {DESKTOP_PWA_STEPS.map((section) => (
                  <Card key={section.os} className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Chrome className="h-5 w-5" />
                        {section.os}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {section.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* iOS PWA Section */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-500">
                <Apple className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                <h3 className="text-2xl font-bold text-foreground">iPhone & iPad (iOS)</h3>
              </div>

              <div className="space-y-4">
                {IOS_PWA_STEPS.map((step) => {
                  const Icon = step.icon;
                  return (
                    <Card key={step.number} className="border-border/50 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-6">
                          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0">
                            <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
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

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div className="text-amber-700 dark:text-amber-300 text-sm">
                    <p className="font-semibold mb-2">Important Note for iOS:</p>
                    <p>You MUST use Safari browser (not Chrome). Only Safari supports adding web apps to the home screen on iOS. After adding to home screen, the app will work like a native app.</p>
                  </div>
                </div>
              </div>
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
                  <h3 className="font-bold text-foreground mb-3">System Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold text-sm mb-2">Android</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Android 6.0+</li>
                        <li>• 50 MB storage</li>
                        <li>• Internet required</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2">Desktop</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Windows/Mac/Linux</li>
                        <li>• Chrome/Edge/Safari</li>
                        <li>• Internet required</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2">iOS</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• iOS 12.0+</li>
                        <li>• Safari browser</li>
                        <li>• Internet required</li>
                      </ul>
                    </div>
                  </div>
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
                Choose your device above and follow the simple installation steps. No registration needed!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/Ahsan%20Ai%20Hub.apk" download className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 text-base font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  <Download className="h-5 w-5" />
                  Download APK Now
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
