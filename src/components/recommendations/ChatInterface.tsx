'use client';

import { getRecommendationsAction, translateTextAction } from '@/app/actions';
import { AhsanAILogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn, parseLinks } from '@/lib/utils';
import { Bot, Copy, Send, User as UserIcon, Lightbulb, ExternalLink, Languages, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LANGUAGES, type Language } from '@/lib/languages';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string;
  translatedTo?: Language;
};

function MessageBubble({ message, onTranslate }: { message: Message, onTranslate: (messageId: string, text: string, lang: Language) => void }) {
  const { toast } = useToast();
  const isUser = message.role === 'user';
  const [isTranslating, setIsTranslating] = useState(false);

  const links = useMemo(() => parseLinks(message.content), [message.content]);
  const textContent = useMemo(() => {
    let content = message.content;
    links.forEach(link => {
      content = content.replace(link.link, '');
    });
    return content.trim();
  }, [message.content, links]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };
  
  const handleTranslate = async (lang: Language) => {
    setIsTranslating(true);
    await onTranslate(message.id, message.originalContent || message.content, lang);
    setIsTranslating(false);
  }

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
          'relative max-w-[80%] rounded-lg',
          isUser
            ? 'rounded-br-none bg-primary text-primary-foreground'
            : 'rounded-bl-none border bg-card'
        )}
      >
        <div className="p-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{textContent}</p>
             {message.originalContent && (
                <button 
                  className="mt-2 text-xs text-muted-foreground hover:underline"
                  onClick={() => onTranslate(message.id, message.content, message.translatedTo || 'en')}
                >
                  Show Original
                </button>
            )}
        </div>

        {links.length > 0 && (
            <div className="border-t p-3 space-y-2">
                {links.map((link, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="p-2">
                            <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 truncate block hover:underline">{link.text}</a>
                        </div>
                        <div className="flex border-t">
                            <Button variant="ghost" size="sm" className="flex-1 rounded-none border-r" asChild>
                                <a href={link.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" /> Open
                                </a>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 rounded-none" onClick={() => handleCopy(link.link)}>
                                <Copy className="mr-2 h-4 w-4" /> Copy
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        )}

        {!isUser && (
          <div className="flex items-center justify-end gap-1 border-t p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleCopy(message.content)}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={isTranslating}
                >
                    {isTranslating ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <Languages className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <ScrollArea className="h-64">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem key={lang.code} onSelect={() => handleTranslate(lang.code as Language)}>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
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
    { label: "Suggest some creative ideas for a new project", prompt: "Suggest some creative ideas for a new project related to AI." },
    { label: 'What are some interesting facts about space?', prompt: 'What are some interesting facts about space?' },
    { label: 'Write a short story about a friendly robot', prompt: 'Write a short story about a friendly robot who discovers a hidden talent.' },
    { label: 'Help me plan a weekend trip', prompt: 'Help me plan a weekend trip to a nearby city. I like history and good food.' },
];

export function ChatInterface({ initialPrompt }: { initialPrompt?: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { language } = useAppContext();

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
  
  const handleTranslateMessage = async (messageId: string, text: string, lang: Language) => {
    const targetMessage = messages.find(m => m.id === messageId);
    if (!targetMessage) return;

    // If it's already translated, revert to original
    if(targetMessage.originalContent) {
        setMessages(prev => prev.map(m => m.id === messageId ? {...m, content: m.originalContent!, originalContent: undefined, translatedTo: undefined} : m));
        return;
    }

    const result = await translateTextAction({ text, targetLanguage: lang });
    if (result.success) {
      setMessages(prev => prev.map(m => m.id === messageId ? {...m, content: result.data, originalContent: text, translatedTo: lang } : m));
      toast({ title: `Translated to ${LANGUAGES.find(l => l.code === lang)?.name || lang}` });
    } else {
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: result.error,
      });
    }
  };


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
              <MessageBubble key={message.id} message={message} onTranslate={handleTranslateMessage} />
            ))
          )}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="border-t bg-background/95 p-4">
        <div className="mx-auto max-w-3xl rounded-lg border bg-card p-2 shadow-sm">
           <div className="flex items-end gap-3">
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
    </div>
  );
}

    