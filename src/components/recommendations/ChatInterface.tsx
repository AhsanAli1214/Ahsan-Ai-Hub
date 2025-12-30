'use client';

import { getRecommendationsAction, translateTextAction, reportErrorAction } from '@/app/actions';
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
import dynamic from 'next/dynamic';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '@/lib/text-to-speech-utils';
import 'katex/dist/katex.min.css';

// Dynamic imports for heavy libraries
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
const remarkGfm = import('remark-gfm');
const rehypeRaw = import('rehype-raw');
const InlineMath = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { ssr: false });
const BlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { ssr: false });

function MessageBubble({ 
    message, 
    onTranslate, 
    onPlayAudio, 
    isPlaying, 
    isBuffering,
    onPauseAudio,
    onReportError,
    onToggleOriginal
}: { 
    message: Message, 
    onTranslate: (messageId: string, text: string, lang: Language) => void,
    onPlayAudio: (text: string) => void,
    isPlaying: boolean,
    isBuffering: boolean,
    onPauseAudio: () => void,
    onReportError?: (error: string) => void,
    onToggleOriginal?: (messageId: string) => void
}) {
  const { toast } = useToast();
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [isTranslating, setIsTranslating] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

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

  const handleReport = async () => {
    if (!onReportError) return;
    setIsReporting(true);
    await onReportError(message.originalContent || message.content);
    setIsReporting(false);
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
              : isError
                ? 'rounded-bl-lg border border-destructive/50 bg-destructive/10 text-destructive shadow-lg'
                : 'rounded-bl-lg border border-accent/20 bg-card backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-accent/40'
          )}
        >
          <div className="break-words">
            {isError ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-semibold text-destructive">
                  <Bot className="h-5 w-5" />
                  <span>Oops! Something went wrong</span>
                </div>
                <p className="text-sm opacity-90">
                  {message.content}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs bg-background/50 border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs text-destructive hover:bg-destructive/20"
                    onClick={handleReport}
                    disabled={isReporting}
                  >
                    {isReporting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Report Error
                  </Button>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[(async () => (await remarkGfm).default) as any]}
                rehypePlugins={[(async () => (await rehypeRaw).default) as any]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className={cn(isUser ? "text-white underline font-medium" : "text-primary hover:text-primary/80 underline font-medium")} />,
                  h1: ({node, ...props}) => <h1 className="font-bold text-xl mb-3 mt-3 first:mt-0" {...props} />,
                  h2: ({node, ...props}) => <h2 className="font-bold text-lg mb-2 mt-3 first:mt-0" {...props} />,
                  h3: ({node, ...props}) => <h3 className="font-semibold text-base mb-2 mt-2 first:mt-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const content = String(children).replace(/\n$/, '');
                    if (!inline) {
                      const isBlockMath = content.startsWith('$$') && content.endsWith('$$');
                      if (isBlockMath) {
                        // @ts-expect-error - Dynamic import type compatibility
                        return <BlockMath>{content.slice(2, -2)}</BlockMath>;
                      }
                      return (
                        <div className="my-2 rounded-lg bg-black/20 p-3 overflow-x-auto border border-white/10">
                          <code className="text-xs font-mono text-white/90" {...props}>{children}</code>
                        </div>
                      );
                    }
                    const isInlineMath = content.startsWith('$') && content.endsWith('$');
                    if (isInlineMath) {
                      // @ts-expect-error - Dynamic import type compatibility
                      return <InlineMath>{content.slice(1, -1)}</InlineMath>;
                    }
                    return <code className="px-2 py-1 bg-black/30 rounded text-white/90 font-mono text-sm" {...props}>{children}</code>;
                  },
                }}
              >
                {textContent}
              </ReactMarkdown>
            )}
          </div>
          {message.originalContent && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <button 
                className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors font-medium flex items-center gap-1"
                onClick={() => onToggleOriginal?.(message.id)}
              >
                <Languages className="h-3 w-3" />
                Show Original
              </button>
            </div>
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
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const stopSpeechRef = useRef<(() => void) | null>(null);

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
    // Scroll to bottom immediately on mount and when messages change
    // Using requestAnimationFrame to ensure DOM is updated and layout is calculated
    const scroll = () => {
      const viewport = scrollViewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
        // Also force a check for the scroll button
        const distanceToBottom = 0;
        setShowScrollButton(false);
      }
    };
    
    // Multiple attempts to ensure it works across different rendering cycles
    requestAnimationFrame(scroll);
    const timer = setTimeout(scroll, 100);
    const timer2 = setTimeout(scroll, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [messages.length]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom('auto');
    }
  }, [isLoading]);

  useEffect(() => {
    return () => {
      // Clean up speech synthesis on unmount
      stopSpeech();
      if (stopSpeechRef.current) {
        stopSpeechRef.current();
      }
    };
  }, []);
  
  const handleReportError = async (errorMsg: string) => {
    try {
      const result = await reportErrorAction({
        errorMessage: errorMsg,
        feature: 'Text-to-Speech',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        timestamp: Date.now(),
      });
      
      if (result.success) {
        if (result.mailtoLink) {
          toast({
            title: 'Error Report Ready',
            description: 'Click the link below to open your email client and send the error report.',
            action: <Button size="sm" variant="outline" onClick={() => window.location.href = result.mailtoLink!}>Send Email</Button>,
          });
        } else {
          toast({
            title: 'Error Reported',
            description: 'Thanks for reporting! Our team will investigate this issue.',
            variant: 'default',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Report Failed',
        description: 'Could not send error report. Please email tickets@ahsan-ai-hub.p.tawk.email directly.',
      });
    }
  };

  
  const handlePlayAudio = (messageId: string, text: string) => {
    try {
      if (!isSpeechSynthesisSupported()) {
        toast({
          variant: 'destructive',
          title: 'Not Supported',
          description: 'Text-to-speech is not supported in your browser.',
        });
        return;
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text to convert to speech');
      }

      // If already playing this message, stop it
      if (activeMessageId === messageId) {
        if (stopSpeechRef.current) {
          stopSpeechRef.current();
          stopSpeechRef.current = null;
        }
        setActiveMessageId(null);
        return;
      }

      // Stop any previously playing speech
      if (stopSpeechRef.current) {
        stopSpeechRef.current();
      }

      // Start new speech
      setActiveMessageId(messageId);
      stopSpeechRef.current = speakText(text, () => {
        setActiveMessageId(null);
        stopSpeechRef.current = null;
      });

      toast({
        title: 'Playing Audio',
        description: 'Audio is now playing. Click the speaker icon again to stop.',
      });
    } catch (error) {
      console.error('TTS Error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Could not play audio. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Audio Failed',
        description: errorMsg,
      });
      setActiveMessageId(null);
    }
  };

  const handlePauseAudio = () => {
    stopSpeech();
    setActiveMessageId(null);
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
        originalContent: userInput, // Store original error trigger for reporting
        timestamp: Date.now(),
        isError: true,
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
        translatedTo: lang,
        showOriginal: false
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

  const handleToggleOriginal = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.originalContent) {
      updateMessage(messageId, { 
        content: message.originalContent,
        originalContent: undefined,
        translatedTo: undefined,
        showOriginal: false 
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
      // Distance from bottom. If we're more than 150px from the bottom, show the button.
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollButton(distanceToBottom > 150);
    };
    
    viewport.addEventListener('scroll', handleViewportScroll);
    // Initial check
    handleViewportScroll();
    
    // Check after a short delay for content rendering
    const timer = setTimeout(handleViewportScroll, 100);
    
    return () => {
      viewport.removeEventListener('scroll', handleViewportScroll);
      clearTimeout(timer);
    };
  }, [messages.length, isLoading]);

  return (
    <div className="flex h-full w-full flex-col bg-background relative overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollViewportRef}
          className="h-full w-full overflow-y-auto pb-32 md:pb-24 scroll-smooth no-scrollbar"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                isPlaying={activeMessageId === message.id}
                isBuffering={false}
                onPauseAudio={handlePauseAudio}
                onReportError={(error) => handleReportError(error)}
                onToggleOriginal={handleToggleOriginal}
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
      <div className="fixed bottom-0 left-0 right-0 z-30 px-3 sm:px-4 py-3 sm:py-4 w-full pb-[calc(1rem+env(safe-area-inset-bottom))] mb-20 md:mb-0 pointer-events-none">
        <div className="mx-auto w-full max-w-4xl flex justify-center pointer-events-auto">
           <div className="flex items-end gap-2 sm:gap-3 w-full bg-background/80 backdrop-blur-lg p-2 rounded-3xl border border-border/40 shadow-2xl">
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
