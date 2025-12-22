'use client';

import { getRecommendationsAction } from '@/app/actions';
import { AhsanAILogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Bot, Copy, Send, User as UserIcon, Lightbulb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function MessageBubble({ message }: { message: Message }) {
  const { toast } = useToast();
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          'relative max-w-[80%] rounded-lg p-3',
          isUser
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none border bg-card'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {!isUser && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <UserIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      <div className="flex items-center space-x-1 rounded-lg border bg-card p-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}

const SMART_PROMPTS = [
    { label: "Explain this to me like I'm five", prompt: "Explain this to me like I'm five: " },
    { label: 'Summarize the following text', prompt: 'Summarize the following text: ' },
    { label: 'Write a poem about...', prompt: 'Write a poem about a rainy day.' },
    { label: 'Translate to French', prompt: 'Translate this to French: ' },
];

export function ChatInterface({ initialPrompt }: { initialPrompt?: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setInput('');
    
    const previousActivity = 'No previous activity provided.';

    const result = await getRecommendationsAction({
      interests: input,
      previousActivity,
    });

    if (result.success && result.data) {
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.recommendations,
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          result.error || 'Unable to get recommendations. Please try again.',
      });
       const newErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, newErrorMessage]);
    }

    setIsLoading(false);
  };
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  }

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="mx-auto max-w-3xl space-y-6 p-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 pt-10 text-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <AhsanAILogo className="h-12 w-12 text-accent" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">How can I help you today?</h2>
                    <p className="mt-1 text-muted-foreground">Start a conversation or try one of these prompts.</p>
                </div>
                 <div className="w-full max-w-md space-y-3">
                    {SMART_PROMPTS.map((prompt) => (
                        <Card key={prompt.label} className="cursor-pointer p-4 text-left transition-all hover:bg-accent/10" onClick={() => handlePromptClick(prompt.prompt)}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                                    <Lightbulb className="h-5 w-5 text-secondary-foreground" />
                                </div>
                                <span className="flex-1 font-medium">{prompt.label}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/95 p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-lg border bg-card p-2 shadow-sm">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            rows={1}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="h-9 w-9 shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
