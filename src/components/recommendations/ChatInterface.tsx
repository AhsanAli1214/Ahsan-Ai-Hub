'use client';

import { getRecommendationsAction, translateTextAction, textToSpeechAction } from '@/app/actions';
import { AhsanAiHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn, parseLinks } from '@/lib/utils';
import { Bot, Copy, Send, User as UserIcon, Lightbulb, ExternalLink, Languages, Loader2, Speaker, Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LANGUAGES, type Language } from '@/lib/languages';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string;
  translatedTo?: Language;
  timestamp: number;
};

function MessageBubble({ 
    message, 
    onTranslate, 
    onPlayAudio, 
    isPlaying, 
    isBuffering,
    onPauseAudio 
}: { 
    message: Message, 
    onTranslate: (messageId: string, text: string, lang: Language) => void,
    onPlayAudio: (text: string) => void,
    isPlaying: boolean,
    isBuffering: boolean,
    onPauseAudio: () => void
}) {
  const { toast } = useToast();
  const isUser = message.role === 'user';
  const [isTranslating, setIsTranslating] = useState(false);

  const links = useMemo(() => parseLinks(message.content), [message.content]);
  const textContent = useMemo(() => {
    if (isUser) return message.content;
    let content = message.content;
    links.forEach(link => {
      content = content.replace(link.link, '');
    });
    return content.trim();
  }, [message.content, links, isUser]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };
  
  const handleTranslate = async (lang: Language) => {
    setIsTranslating(true);
    await onTranslate(message.id, message.originalContent || message.content, lang);
    setIsTranslating(false);
  }

  const handleAudioClick = () => {
    if (isPlaying) {
      onPauseAudio();
    } else {
      onPlayAudio(message.originalContent || message.content);
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <AhsanAiHubLogo className="h-6 w-6" />
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
        <div className="prose prose-sm dark:prose-invert max-w-none p-3">
             <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
                }}
            >
                {textContent}
            </ReactMarkdown>

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
             <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleAudioClick}
                disabled={isBuffering}
              >
                {isBuffering ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Speaker className="h-4 w-4 text-muted-foreground" />
                )}
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
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 p-1.5 text-primary">
          <AhsanAiHubLogo className="h-6 w-6" />
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

export function ChatInterface({
  initialPrompt,
}: {
  initialPrompt?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { personalityMode, enableAnimations, enableTypingIndicator } = useAppContext();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [isAudioBuffering, setIsAudioBuffering] = useState(false);


  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);
  
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const history = JSON.parse(savedHistory) as Message[];
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recentHistory = history.filter(msg => msg.timestamp > sevenDaysAgo);
        setMessages(recentHistory);
      }
    } catch (e) {
        console.error('Could not load chat history from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
        if(messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    } catch(e) {
        console.error('Could not save chat history to localStorage', e);
    }
  }, [messages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const behavior = enableAnimations ? 'smooth' : 'auto';
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior });
    }
  }, [messages, isLoading, enableAnimations]);

  useEffect(() => {
    if (audio) {
      const handleEnded = () => {
        setActiveMessageId(null);
      };
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        setAudio(null);
      };
    }
  }, [audio]);
  
  const playAudio = (audioDataUri: string) => {
    const newAudio = new Audio(audioDataUri);
    setAudio(newAudio);
    newAudio.play();
  };
  
  const handlePlayAudio = async (messageId: string, text: string) => {
    if (activeMessageId === messageId && audio) {
        if (!audio.paused) {
            audio.pause();
            setActiveMessageId(null);
            return;
        } else {
            audio.play();
            return;
        }
    }
    
    if (audio) {
      audio.pause();
    }
    
    setActiveMessageId(messageId);
    setIsAudioBuffering(true);
    
    try {
      const result = await textToSpeechAction({ text });
      if (result.success) {
        playAudio(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Audio Failed',
        description: error instanceof Error ? error.message : 'Could not play audio.',
      });
      setActiveMessageId(null);
    } finally {
        setIsAudioBuffering(false);
    }
  };

  const handlePauseAudio = () => {
    if (audio && !audio.paused) {
      audio.pause();
      setActiveMessageId(null);
    }
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setInput('');
    
    const previousActivity = 'No previous activity provided.';

    const result = await getRecommendationsAction({
      interests: input,
      previousActivity,
      personality: personalityMode,
    });

    if (result.success && result.data) {
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.recommendations,
        timestamp: Date.now(),
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
        content: result.error || "Sorry, I couldn't process that. Please try again.",
        timestamp: Date.now(),
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

    if(targetMessage.originalContent && targetMessage.translatedTo?.toString() === lang.toString()) {
        setMessages(prev => prev.map(m => m.id === messageId ? {...m, content: m.originalContent!, originalContent: undefined, translatedTo: undefined} : m));
        return;
    }

    const result = await translateTextAction({ text, targetLanguage: lang as string });
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
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <AhsanAiHubLogo className="h-16 w-16 text-accent" />
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
              <MessageBubble 
                key={message.id} 
                message={message} 
                onTranslate={handleTranslateMessage} 
                onPlayAudio={(text) => handlePlayAudio(message.id, text)}
                isPlaying={activeMessageId === message.id && audio ? !audio.paused : false}
                isBuffering={activeMessageId === message.id && isAudioBuffering}
                onPauseAudio={handlePauseAudio}
                />
            ))
          )}
          {isLoading && enableTypingIndicator && <TypingIndicator />}
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
