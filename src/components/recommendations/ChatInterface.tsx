'use client';

import { getRecommendationsAction, translateTextAction, textToSpeechAction } from '@/app/actions';
import { AhsanAiHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn, parseLinks } from '@/lib/utils';
import { Bot, Copy, Send, User as UserIcon, Lightbulb, ExternalLink, Languages, Loader2, Speaker, Pause, Play, ChevronDown, Link as LinkIcon, User } from 'lucide-react';
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
    <div className="group relative flex flex-col">
       <div
        className={cn(
          'flex items-start gap-2 sm:gap-3 w-full',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        {!isUser && (
           <AhsanAiHubLogo className="h-8 w-8 shrink-0 rounded-full mt-1" />
        )}
        <div
          className={cn(
            'relative max-w-[85%] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl p-3 sm:p-4 break-words overflow-hidden',
            isUser
              ? 'rounded-br-lg bg-primary text-primary-foreground'
              : 'rounded-bl-lg border bg-card'
          )}
        >
          <div className="break-words">
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
          </div>
          {message.originalContent && (
            <button 
              className="mt-2 text-xs text-muted-foreground hover:underline"
              onClick={() => onTranslate(message.id, message.content, message.translatedTo || 'en')}
            >
              Show Original
            </button>
          )}
          
          {links.length > 0 && (
            <div className="mt-3 border-t pt-3 space-y-2">
              {links.map((link, index) => (
                <Card key={index} className="overflow-hidden bg-card/50">
                  <div className="p-3 flex items-center gap-2">
                     <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 truncate flex-1 hover:underline">{link.text}</a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={link.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopy(link.link)}>
                             <Copy className="mr-2 h-4 w-4" /> Copy Link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        {isUser && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className={cn("mt-1 flex items-center gap-1 flex-wrap", isUser ? 'self-end' : 'self-start' )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-80 hover:opacity-100"
          onClick={() => handleCopy(message.content)}
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </Button>
        {!isUser && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-80 hover:opacity-100"
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
                className="h-7 w-7 opacity-80 hover:opacity-100"
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
          </>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
       <AhsanAiHubLogo className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex items-center space-x-1 rounded-2xl border bg-card p-3">
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
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { personalityMode, responseLength, enableAnimations, enableTypingIndicator } = useAppContext();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [isAudioBuffering, setIsAudioBuffering] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

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
  
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'auto') => {
    const scrollElement = scrollViewportRef.current || scrollAreaRef.current;
    if (scrollElement) {
      setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }, 0);
    }
  }
  
  useEffect(() => {
    scrollToBottom(enableAnimations ? 'smooth' : 'auto');
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
      responseLength: responseLength,
    });

    if (result.success && result.data) {
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.recommendations,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newAiMessage]);
    } else if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error,
      });
       const newErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.error,
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShowScrollButton(!atBottom);
  }
  
  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;
    
    const handleViewportScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!atBottom);
    };
    
    viewport.addEventListener('scroll', handleViewportScroll);
    return () => viewport.removeEventListener('scroll', handleViewportScroll);
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
        <div 
          ref={scrollViewportRef}
          className="h-full w-full overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-4xl space-y-3 sm:space-y-4 px-3 sm:px-4 py-4 sm:py-6">
          {messages.length === 0 && !isLoading ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 sm:gap-6 text-center px-4">
                <AhsanAiHubLogo className="h-16 w-16 sm:h-24 sm:w-24" />
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">How can I help you today?</h2>
                    <p className="mt-1 text-sm sm:text-base text-muted-foreground">Start a conversation or try one of these prompts.</p>
                </div>
                 <div className="w-full max-w-sm space-y-2 sm:space-y-3">
                    {SMART_PROMPTS.map((prompt) => (
                        <Card key={prompt.label} className="cursor-pointer p-3 sm:p-4 text-left transition-all hover:bg-accent/10 active:bg-accent/20" onClick={() => handlePromptClick(prompt.prompt)}>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 items-center justify-center shrink-0 rounded-lg bg-secondary">
                                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
                                </div>
                                <span className="flex-1 font-medium text-sm sm:text-base line-clamp-2">{prompt.label}</span>
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
        </div>
      </div>
       {showScrollButton && (
        <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-4 z-10">
            <Button size="icon" className="rounded-full shadow-lg h-10 w-10 sm:h-11 sm:w-11" onClick={() => scrollToBottom('smooth')}>
                <ChevronDown className="h-5 w-5" />
            </Button>
        </div>
      )}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 w-full">
        <div className="mx-auto w-full max-w-4xl">
           <div className="flex items-end gap-2 sm:gap-3 rounded-lg border bg-card p-2 sm:p-3 shadow-sm">
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
                className="flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm sm:text-base"
                rows={1}
                disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
