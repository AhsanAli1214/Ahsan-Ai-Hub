'use client';

import { getRecommendationsAction, translateTextAction, textToSpeechAction } from '@/app/actions';
import { AhsanAiHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn, parseLinks } from '@/lib/utils';
import { Bot, Copy, Send, User as UserIcon, Lightbulb, ExternalLink, Languages, Loader2, Volume2, Pause, Play, ChevronDown, Link as LinkIcon, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { useChatHistory, type Message } from '@/context/ChatHistoryContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LANGUAGES, type Language } from '@/lib/languages';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
            'relative max-w-[85%] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-3xl p-3 sm:p-4 break-words overflow-hidden shadow-md transition-all duration-200',
            isUser
              ? 'rounded-br-lg bg-primary text-primary-foreground shadow-lg'
              : 'rounded-bl-lg border border-accent/20 bg-card backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-accent/40'
          )}
        >
          <div className="break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className={cn(isUser ? "text-white underline font-medium" : "text-primary hover:text-primary/80 underline font-medium")} />,
                h1: ({node, ...props}) => <h1 className="font-bold text-xl mb-3 mt-3 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="font-bold text-lg mb-2 mt-3 first:mt-0" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-semibold text-base mb-2 mt-2 first:mt-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                code: ({node, inline, className, children, ...props}: any) => 
                  !inline ? (
                    <div className="my-2 rounded-lg bg-black/20 p-3 overflow-x-auto border border-white/10">
                      <code className="text-xs font-mono text-white/90" {...props}>{children}</code>
                    </div>
                  ) : (
                    <code className="px-2 py-1 bg-black/30 rounded text-white/90 font-mono text-sm" {...props}>{children}</code>
                  ),
              }}
            >
              {textContent}
            </ReactMarkdown>
          </div>
          {message.originalContent && (
            <button 
              className="mt-2 text-xs text-muted-foreground hover:underline"
              onClick={() => onTranslate(message.id, message.content, (message.translatedTo as Language) || 'en')}
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
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
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
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { personalityMode, responseLength, enableAnimations, enableTypingIndicator } = useAppContext();
  const { currentSession, addMessage, updateCurrentSessionTitle, createSession, updateMessage } = useChatHistory();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [isAudioBuffering, setIsAudioBuffering] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (!currentSession && messages.length === 0) {
      createSession();
    }
  }, []);
  
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'auto') => {
    const scrollElement = scrollViewportRef.current;
    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: behavior
      });
    }
  }
  
  useEffect(() => {
    scrollToBottom('auto');
  }, [messages.length, isLoading]);

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

    // Check online status before sending
    if (!navigator.onLine) {
      toast({
        title: "You are offline",
        description: "AI features require an active internet connection. Please check your network and try again.",
        variant: "destructive"
      });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    addMessage(newUserMessage);
    setIsLoading(true);
    const userInput = input;
    setInput('');
    
    const previousActivity = 'No previous activity provided.';

    const result = await getRecommendationsAction({
      interests: userInput,
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
      addMessage(newAiMessage);
      
      if (currentSession && currentSession.messages.length === 1) {
        updateCurrentSessionTitle(userInput.substring(0, 50) + (userInput.length > 50 ? '...' : ''));
      }
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
      addMessage(newErrorMessage);
    }

    setIsLoading(false);
  };
  
  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  }
  
  const handleTranslateMessage = async (messageId: string, text: string, lang: Language) => {
    const result = await translateTextAction({ text, targetLanguage: lang as string });
    if (result.success && result.data) {
      updateMessage(messageId, { 
        content: result.data,
        originalContent: text,
        translatedTo: lang
      });
      toast({ title: `Translated to ${LANGUAGES.find(l => l.code === lang)?.name || lang}` });
    } else if (!result.success) {
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
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollButton(distanceToBottom > 150);
  }
  
  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport) return;
    
    const handleViewportScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollButton(distanceToBottom > 150);
    };
    
    viewport.addEventListener('scroll', handleViewportScroll);
    handleViewportScroll();
    return () => viewport.removeEventListener('scroll', handleViewportScroll);
  }, [messages.length, isLoading]);

  return (
    <div className="flex h-full w-full flex-col bg-background relative overflow-hidden">
      <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
        <div 
          ref={scrollViewportRef}
          className="h-full w-full overflow-y-auto pb-32 md:pb-24 scroll-smooth"
          onScroll={handleScroll}
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
        <div className="absolute bottom-40 sm:bottom-44 right-3 sm:right-4 z-10 animate-in fade-in zoom-in duration-300">
            <Button 
              size="icon" 
              className="rounded-full shadow-xl h-11 w-11 bg-primary hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all" 
              onClick={() => scrollToBottom('smooth')}
            >
                <ChevronDown className="h-6 w-6 animate-bounce" />
            </Button>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-3 sm:px-4 py-3 sm:py-4 w-full pb-[calc(1rem+env(safe-area-inset-bottom))] mb-20 md:mb-0">
        <div className="mx-auto w-full max-w-4xl">
           <div className="flex items-end gap-2 sm:gap-3">
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
                className="flex-1 resize-none rounded-2xl border border-border bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary text-sm sm:text-base min-h-[44px] py-3 px-4"
                rows={1}
                disabled={isLoading}
            />
            <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()} 
                size="icon" 
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
            </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
