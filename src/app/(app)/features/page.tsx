'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Briefcase,
  Check,
  CheckCircle,
  Code,
  Copy,
  FileText,
  Globe,
  Share2,
  Smile,
  Trash2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

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

const CORE_CAPABILITIES = [
  {
    icon: Globe,
    label: 'Multi-language Responses',
    description: 'Get answers in multiple languages',
  },
  {
    icon: CheckCircle,
    label: 'Grammar Fix & Rewriting',
    description: 'Improve your text quality',
  },
  {
    icon: Code,
    label: 'Code Generation',
    description: 'Generate and explain code snippets',
  },
  {
    icon: FileText,
    label: 'Smart Summarization',
    description: 'Condense long content quickly',
  },
];

const PRODUCTIVITY_TOOLS = [
  {
    icon: Share2,
    label: 'Share Conversation',
    description: 'Share chat via any app',
  },
  { icon: Copy, label: 'Copy Messages', description: 'Copy any message with one tap' },
  {
    icon: Trash2,
    label: 'Clear History',
    description: 'Start fresh anytime',
  },
];

export default function FeaturesPage() {
  const [personalityMode, setPersonalityMode] =
    useState<PersonalityMode>('creative');

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Features" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* AI Personality Modes Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold">
              AI Personality Modes
            </h2>
            <p className="mt-1 text-muted-foreground">
              Choose how the AI responds to you
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PERSONALITY_MODES.map((mode) => {
                const isActive = personalityMode === mode.id;
                return (
                  <Card
                    key={mode.id}
                    onClick={() =>
                      setPersonalityMode(mode.id as PersonalityMode)
                    }
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      isActive
                        ? 'border-accent ring-2 ring-accent'
                        : 'border'
                    )}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-lg',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <mode.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{mode.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {mode.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Core Capabilities Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold">
              Core Capabilities
            </h2>
            <p className="mt-1 text-muted-foreground">
              Discover what our AI can do for you
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CORE_CAPABILITIES.map((feature, index) => (
                 <Card key={index} className="bg-card">
                    <CardContent className="flex items-center gap-4 p-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{feature.label}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </CardContent>
                 </Card>
              ))}
            </div>
          </div>
          
          {/* Productivity Tools Section */}
          <div>
            <h2 className="font-headline text-2xl font-bold">
              Productivity Tools
            </h2>
             <p className="mt-1 text-muted-foreground">
              Features to streamline your workflow
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PRODUCTIVITY_TOOLS.map((tool, index) => (
                 <Card key={index} className="bg-card">
                    <CardContent className="flex items-center gap-4 p-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                            <tool.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{tool.label}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                    </CardContent>
                 </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
