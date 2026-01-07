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
import { PWAInstall } from "@/components/PWAInstall";

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
  { id: 'default', label: 'Blue (Default)', color: 'bg-blue-500' },
  { id: 'aurora', label: 'Aurora (Purple)', color: 'bg-purple-500' },
  { id: 'ocean', label: 'Ocean (Teal)', color: 'bg-cyan-500' },
  { id: 'sunset', label: 'Sunset (Orange)', color: 'bg-orange-500' },
  { id: 'forest', label: 'Forest (Green)', color: 'bg-green-500' },
  { id: 'midnight', label: 'Midnight (Navy)', color: 'bg-indigo-700' },
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
    <div className="flex h-full flex-col">
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Select the theme and color scheme for the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-4">Light/Dark Mode</p>
                <div className="grid grid-cols-3 gap-4">
                  {THEME_MODES.map((mode) => {
                    const isActive = theme === mode.id;
                    return (
                      <Button
                        key={mode.id}
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => setTheme(mode.id)}
                        className="flex h-auto flex-col items-center justify-center gap-2 rounded-lg p-4"
                      >
                        <mode.icon className="h-6 w-6" />
                        <span>{mode.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-4">Color Scheme</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {COLOR_THEMES.map((colorTheme) => {
                    const isSelected = typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === colorTheme.id;
                    return (
                      <button
                        key={colorTheme.id}
                        onClick={() => {
                          document.documentElement.setAttribute('data-theme', colorTheme.id);
                          localStorage.setItem('selectedColorTheme', colorTheme.id);
                          window.dispatchEvent(new Event('storage'));
                        }}
                        title={colorTheme.label}
                        className={cn(
                          "flex flex-col items-center gap-2 p-2 rounded-lg transition-all border-2",
                          isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-muted'
                        )}
                      >
                        <div className={`h-10 w-10 rounded-lg ${colorTheme.color}`} />
                        <span className="text-xs text-center font-medium">{colorTheme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Length */}
          <Card>
            <CardHeader>
              <CardTitle>AI Response Length</CardTitle>
              <CardDescription>
                Choose how detailed the AI responses should be
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {RESPONSE_LENGTH_MODES.map((mode) => {
                const isActive = responseLength === mode.id;
                return (
                  <Card
                    key={mode.id}
                    onClick={() =>
                      setResponseLength(mode.id as ResponseLength)
                    }
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      isActive
                        ? 'border-accent ring-2 ring-accent'
                        : 'border'
                    )}
                  >
                    <CardContent className="flex flex-col items-center gap-2 p-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <mode.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold">{mode.label}</h3>
                      <p className="text-xs text-muted-foreground text-center">
                        {mode.description}
                      </p>
                      {isActive && (
                        <div className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Personality */}
          <Card>
            <CardHeader>
              <CardTitle>AI Personality</CardTitle>
              <CardDescription>
                Choose how the AI responds to you
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERSONALITY_MODES.map((mode) => {
                const isActive = personalityMode === mode.id;
                return (
                  <Card
                    key={mode.id}
                    onClick={() =>
                      setPersonalityMode(mode.id as PersonalityMode)
                    }
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      isActive
                        ? 'border-accent ring-2 ring-accent'
                        : 'border'
                    )}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-lg',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <mode.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{mode.label}</h3>
                        <p className="text-xs text-muted-foreground">
                          {mode.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          {/* UI & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>UI & Feedback</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label
                    htmlFor="animations-switch"
                    className="font-semibold"
                  >
                    Animation Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable chat animations and transitions.
                  </p>
                </div>
                <Switch
                  id="animations-switch"
                  checked={enableAnimations}
                  onCheckedChange={setEnableAnimations}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="typing-switch" className="font-semibold">
                    Typing Indicator
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show or hide the AI typing animation.
                  </p>
                </div>
                <Switch
                  id="typing-switch"
                  checked={enableTypingIndicator}
                  onCheckedChange={setEnableTypingIndicator}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 bg-primary/5 border-primary/20">
                <div>
                  <Label htmlFor="biometric-switch" className="font-semibold flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    Biometric Security
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use Fingerprint or Face ID to lock the app.
                  </p>
                </div>
                <Switch
                  id="biometric-switch"
                  checked={biometricEnabled}
                  onCheckedChange={handleBiometricToggle}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Push Notifications */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Push Notifications</CardTitle>
              <CardDescription className="text-muted-foreground">
                Get notified about updates and new features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enable push notifications to receive alerts about new features, updates, and important announcements directly on your device via Pushify.
              </p>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="bg-accent/15">
            <CardHeader>
              <CardTitle>About Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your preferences are automatically saved to your browser.
                Customize your AI personality, interface theme, and interaction
                feedback to match your style.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
