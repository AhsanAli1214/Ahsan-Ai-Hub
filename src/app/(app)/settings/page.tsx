'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BookOpen, Briefcase, Check, Smile, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

type PersonalityMode =
  | 'friendly'
  | 'professional'
  | 'creative'
  | 'teacher';

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

export default function SettingsPage() {
    const { toast } = useToast();
    const [personalityMode, setPersonalityMode] = useState<PersonalityMode>('creative');
    const [enableAnimations, setEnableAnimations] = useState(true);
    const [enableTypingIndicator, setEnableTypingIndicator] = useState(true);

    useEffect(() => {
        const storedPersonality = localStorage.getItem('personalityMode') as PersonalityMode;
        const storedAnimations = localStorage.getItem('enableAnimations');
        const storedTyping = localStorage.getItem('enableTypingIndicator');

        if (storedPersonality) setPersonalityMode(storedPersonality);
        if (storedAnimations) setEnableAnimations(JSON.parse(storedAnimations));
        if (storedTyping) setEnableTypingIndicator(JSON.parse(storedTyping));
    }, []);

    const handlePersonalityChange = (mode: PersonalityMode) => {
        setPersonalityMode(mode);
        localStorage.setItem('personalityMode', mode);
        toast({ title: "Personality Updated", description: `AI personality set to ${mode}.` });
    };

    const handleAnimationChange = (value: boolean) => {
        setEnableAnimations(value);
        localStorage.setItem('enableAnimations', JSON.stringify(value));
    };

    const handleTypingIndicatorChange = (value: boolean) => {
        setEnableTypingIndicator(value);
        localStorage.setItem('enableTypingIndicator', JSON.stringify(value));
    };


  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl space-y-8">
            
            {/* AI Personality */}
            <Card>
                <CardHeader>
                    <CardTitle>AI Personality</CardTitle>
                    <CardDescription>Choose how the AI responds to you</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {PERSONALITY_MODES.map((mode) => {
                        const isActive = personalityMode === mode.id;
                        return (
                        <Card
                            key={mode.id}
                            onClick={() => handlePersonalityChange(mode.id as PersonalityMode)}
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
                    <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="animations-switch" className="font-semibold">Animation Effects</Label>
                            <p className="text-sm text-muted-foreground">Enable or disable chat animations and transitions.</p>
                        </div>
                        <Switch id="animations-switch" checked={enableAnimations} onCheckedChange={handleAnimationChange} />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="typing-switch" className="font-semibold">Typing Indicator</Label>
                            <p className="text-sm text-muted-foreground">Show or hide the AI typing animation.</p>
                        </div>
                        <Switch id="typing-switch" checked={enableTypingIndicator} onCheckedChange={handleTypingIndicatorChange} />
                    </div>
                </CardContent>
            </Card>

            {/* Info Section */}
            <Card className="bg-accent/15">
                <CardHeader>
                    <CardTitle>About Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Your preferences are automatically saved to your browser. Customize your AI personality, interface theme, and interaction feedback to match your style.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
