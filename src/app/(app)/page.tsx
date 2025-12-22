import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookText,
  Code,
  Cpu,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Smile,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getToolImage, type AiTool } from '@/lib/data';
import { AhsanAILogo } from '@/components/icons';
import type { Metadata } from 'next';
import { useAuth } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'AI Hub Express',
};

const QUICK_ACTIONS = [
  {
    id: '1',
    label: 'Rewrite Text',
    icon: BookText,
    prompt: 'Please rewrite this text to be clearer: ',
  },
  {
    id: '2',
    label: 'Explain Code',
    icon: Code,
    prompt: 'Can you explain this code: ',
  },
  {
    id: '3',
    label: 'Generate Ideas',
    icon: Lightbulb,
    prompt: 'Generate creative ideas for: ',
  },
  {
    id: '4',
    label: 'Solve Question',
    icon: HelpCircle,
    prompt: 'Help me solve this problem: ',
  },
];

const SMART_PROMPTS = [
    { label: 'Explain this to me like I\'m five', prompt: 'Explain this to me like I\'m five: ' },
    { label: 'Summarize the following text', prompt: 'Summarize the following text: ' },
    { label: 'Write a poem about...', prompt: 'Write a poem about a rainy day.' },
    { label: 'Translate to French', prompt: 'Translate this to French: ' },
    { label: 'What are the pros and cons of...', prompt: 'What are the pros and cons of learning to code?' },
    { label: 'Create a recipe for...', prompt: 'Create a recipe for a vegan chocolate cake.' },
];


export default function HomePage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Home" />
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="rounded-lg bg-accent p-6 text-accent-foreground shadow-md md:p-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-accent/80">
                <AhsanAILogo className="h-12 w-12 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-headline text-3xl font-bold md:text-4xl">
                  Ahsan AI
                </h1>
                <p className="mt-1 text-lg text-accent-foreground/80">
                  Intelligent AI Companion
                </p>
                <p className="mt-1 text-sm text-accent-foreground/70">
                  Powered by Advanced AI
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  href={`/recommendations?initialPrompt=${encodeURIComponent(
                    action.prompt
                  )}`}
                  key={action.id}
                  passHref
                >
                  <Card className="flex h-full transform flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105 hover:shadow-lg">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Stats & Mode Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Messages Sent
                    </CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">152</div>
                    <p className="text-xs text-muted-foreground">
                        21% more than last week
                    </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        AI Responses
                    </CardTitle>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">148</div>
                    <p className="text-xs text-muted-foreground">
                        19% more than last week
                    </p>
                    </CardContent>
                </Card>
            </div>
            
            {/* Mode */}
            <Card className="flex items-center justify-between p-4 lg:col-span-1">
                <div className='flex items-center'>
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                        <Smile className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Current Mode</p>
                        <p className="font-semibold">Creative</p>
                    </div>
                </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Change</Link>
              </Button>
            </Card>

          </div>


          {/* Smart Prompts Section */}
          <div>
            <h2 className="mb-4 font-headline text-xl font-semibold">
              Smart Prompts
            </h2>
            <div className="flex flex-wrap gap-2">
              {SMART_PROMPTS.map((prompt, index) => (
                <Button key={index} variant="outline" asChild>
                  <Link
                    href={`/recommendations?initialPrompt=${encodeURIComponent(
                      prompt.prompt
                    )}`}
                  >
                    {prompt.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
