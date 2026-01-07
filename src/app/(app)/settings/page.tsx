'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Briefcase,
  Check,
  Computer,
  Moon,
  Smile,
  Sun,
  Trash2,
  Zap,
  MessageCircle,
  MessageSquare,
  MessageSquareMore,
  Fingerprint,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAppContext, type PersonalityMode, type ResponseLength } from '@/context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { OneSignalButton } from '@/components/OneSignalButton';
import { PWAInstall } from '@/components/PWAInstall';

const PERSONALITY_MODES = [
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Warm, casual, and encouraging responses',
    icon: Smile,
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Formal, precise, and efficient communication',
    icon: Briefcase,
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Imaginative and unconventional perspectives',
    icon: Zap,
  },
  {
    id: 'teacher',
    label: 'Teacher',
    description: 'Educational explanations with examples',
    icon: BookOpen,
  },
];

const THEME_MODES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Computer },
];

const COLOR_THEMES = [
  { id: 'default', label: 'Blue (Default)', color: 'bg-blue-500', value: '221.2 83.2% 53.3%' },
  { id: 'aurora', label: 'Aurora (Purple)', color: 'bg-purple-500', value: '262.1 83.3% 57.8%' },
  { id: 'ocean', label: 'Ocean (Teal)', color: 'bg-cyan-500', value: '188.7 94.5% 42.7%' },
  { id: 'sunset', label: 'Sunset (Orange)', color: 'bg-orange-500', value: '24.6 95% 53.1%' },
  { id: 'forest', label: 'Forest (Green)', color: 'bg-green-500', value: '142.1 76.2% 36.3%' },
  { id: 'midnight', label: 'Midnight (Navy)', color: 'bg-indigo-700', value: '243.4 75.4% 58.6%' },
];

const RESPONSE_LENGTH_MODES = [
  {
    id: 'short',
    label: 'Short',
    description: 'Quick, concise answers',
    icon: MessageCircle,
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Balanced, detailed responses',
    icon: MessageSquare,
  },
  {
    id: 'explained',
    label: 'Explained',
    description: 'In-depth explanations',
    icon: MessageSquareMore,
  },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    personalityMode,
    setPersonalityMode,
    responseLength,
    setResponseLength,
    enableAnimations,
    setEnableAnimations,
    enableTypingIndicator,
    setEnableTypingIndicator,
    biometricEnabled,
    setBiometricEnabled,
  } = useAppContext();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('chatHistory');
      toast({
        title: 'Chat History Cleared',
        description: 'Your conversation history has been successfully deleted.',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear chat history.',
      });
    }
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        if (!('PublicKeyCredential' in window)) {
          throw new Error('Biometric authentication is not supported on this browser.');
        }

        // Generate a random challenge
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Create a new credential (passkey registration)
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: {
              name: "Ahsan AI Hub",
              id: window.location.hostname,
            },
            user: {
              id: new Uint8Array(16),
              name: "user@ahsan-ai-hub",
              displayName: "Ahsan AI Hub User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
            authenticatorSelection: {
              userVerification: "required",
              residentKey: "required",
              requireResidentKey: true,
            },
            timeout: 60000,
            attestation: "none",
          }
        }) as any;

        if (credential) {
          // Store the credential ID to use it later for verification
          localStorage.setItem('biometricCredentialId', credential.id);
          setBiometricEnabled(true);
          toast({
            title: 'Biometric Enabled',
            description: 'Your passkey has been created successfully. The app will now require biometric verification to unlock.',
          });
        }
      } catch (err: any) {
        console.error('Passkey registration failed:', err);
        setBiometricEnabled(false);
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: err.message || 'Could not create a passkey. Please ensure your device supports biometrics.',
        });
      }
    } else {
      setBiometricEnabled(false);
      localStorage.removeItem('biometricCredentialId');
      toast({
        title: 'Biometric Disabled',
        description: 'Biometric protection has been turned off.',
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader title="Settings" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Skeleton or loading state can go here */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background/50">
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-10">
        <div className="mx-auto max-w-4xl space-y-10 pb-24">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Preferences</h1>
            <p className="text-muted-foreground">Customize your AI experience and application interface.</p>
          </div>

          {/* Theme Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">Appearance</h2>
            </div>
            
            <Card className="border-accent/10 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="border-b border-accent/5 bg-accent/5">
                <CardTitle className="text-lg">Display Theme</CardTitle>
                <CardDescription>
                  Switch between light and dark modes or let your system decide.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {THEME_MODES.map((mode) => {
                    const isActive = theme === mode.id;
                    return (
                      <Button
                        key={mode.id}
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => setTheme(mode.id)}
                        className={cn(
                          "flex h-24 flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-300",
                          isActive ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-accent/10 border-accent/10"
                        )}
                      >
                        <mode.icon className={cn("h-7 w-7", isActive ? "text-primary-foreground" : "text-primary")} />
                        <span className="font-bold text-xs uppercase tracking-widest">{mode.label}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accent Color</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {COLOR_THEMES.map((colorTheme) => {
                      const isSelected = typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === colorTheme.id;
                      return (
                        <button
                          key={colorTheme.id}
                          onClick={() => {
                            document.documentElement.setAttribute('data-theme', colorTheme.id);
                            localStorage.setItem('selectedColorTheme', colorTheme.id);
                            if ((colorTheme as any).value) {
                              document.documentElement.style.setProperty('--primary', (colorTheme as any).value);
                              localStorage.setItem('customAccentColor', (colorTheme as any).value);
                            }
                            window.dispatchEvent(new Event('storage'));
                          }}
                          className={cn(
                            "group relative flex flex-col items-center gap-3 p-3 rounded-2xl transition-all border-2",
                            isSelected ? 'border-primary bg-primary/10 shadow-lg' : 'border-transparent hover:bg-accent/5'
                          )}
                        >
                          <div className={cn(
                            "h-12 w-12 rounded-xl shadow-inner transition-transform group-hover:scale-110",
                            colorTheme.color
                          )} />
                          <span className="text-[10px] text-center font-black uppercase tracking-tighter opacity-70 leading-none">
                            {colorTheme.label.split(' ')[0]}
                          </span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* AI Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">AI Behavior</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personality */}
              <Card className="border-accent/10 bg-card/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Intelligence Tone</CardTitle>
                  <CardDescription>Adjust how the AI communicates with you.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  {PERSONALITY_MODES.map((mode) => {
                    const isActive = personalityMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setPersonalityMode(mode.id as PersonalityMode)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                          isActive ? "border-primary bg-primary/10" : "border-transparent hover:bg-accent/5"
                        )}
                      >
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                          isActive ? "bg-primary text-primary-foreground" : "bg-accent/10 text-primary"
                        )}>
                          <mode.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm leading-none mb-1">{mode.label}</h3>
                          <p className="text-xs text-muted-foreground leading-tight">{mode.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Length */}
              <Card className="border-accent/10 bg-card/30 backdrop-blur-md shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Response Detail</CardTitle>
                  <CardDescription>Control the depth of AI generated content.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  {RESPONSE_LENGTH_MODES.map((mode) => {
                    const isActive = responseLength === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setResponseLength(mode.id as ResponseLength)}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                          isActive ? "border-primary bg-primary/10" : "border-transparent hover:bg-accent/5"
                        )}
                      >
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                          isActive ? "bg-primary text-primary-foreground" : "bg-accent/10 text-primary"
                        )}>
                          <mode.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm leading-none mb-1">{mode.label}</h3>
                          <p className="text-xs text-muted-foreground leading-tight">{mode.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Security & System */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-bold tracking-tight">Security & Experience</h2>
            </div>

            <Card className="border-accent/10 bg-card/30 backdrop-blur-md shadow-xl divide-y divide-accent/5">
              <div className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <Label htmlFor="biometric-switch" className="text-base font-bold flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-primary" />
                    Biometric Lock
                  </Label>
                  <p className="text-sm text-muted-foreground">Require TouchID/FaceID to access your local chats.</p>
                </div>
                <Switch
                  id="biometric-switch"
                  checked={biometricEnabled}
                  onCheckedChange={handleBiometricToggle}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <Label htmlFor="animations-switch" className="text-base font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Visual Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions and AI thinking animations.</p>
                </div>
                <Switch
                  id="animations-switch"
                  checked={enableAnimations}
                  onCheckedChange={setEnableAnimations}
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </h3>
                  <p className="text-sm text-muted-foreground">Permanently delete all data from this device.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto rounded-xl font-bold shadow-lg shadow-destructive/20">
                      Reset All App Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem] border-destructive/20 bg-background/95 backdrop-blur-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black">Absolute Deletion?</AlertDialogTitle>
                      <AlertDialogDescription className="text-base">
                        This action cannot be undone. All your local chat history, custom settings, and biometric configurations will be wiped permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel className="rounded-2xl font-bold border-accent/20">Keep My Data</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearHistory} className="rounded-2xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Wipe Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          </section>

          {/* Footer Info */}
          <footer className="pt-10 pb-20 text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-accent/5 border border-accent/10">
              <Smile className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-muted-foreground">Settings are saved locally to your device.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
