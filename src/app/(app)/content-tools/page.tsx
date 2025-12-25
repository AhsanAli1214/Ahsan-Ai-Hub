'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  BookOpen,
  Code,
  Copy,
  Edit3,
  Loader2,
  Mail,
  PenTool,
  ArrowRight,
  Languages,
  Share2,
  FileText,
  Feather,
  Grid,
  Sparkles,
  Download,
  RotateCcw,
  Check,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
  assistResumeAction,
  explainProgrammingAction,
  generateBlogPostAction,
  generateEmailAction,
  generateSocialMediaPostAction,
  generateStoryAction,
  generateStudyMaterialAction,
  enhanceTextAction,
  solveMathAction,
  translateTextAction,
} from '@/app/actions';
import { cn } from '@/lib/utils';
import type {
  EnhanceTextInput,
  GenerateEmailInput,
  GenerateBlogPostInput,
  GenerateStudyMaterialInput,
  GenerateSocialMediaPostInput,
  AssistResumeInput,
} from '@/ai/flows/content-tools';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { LANGUAGES } from '@/lib/languages';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math' | 'translate' | 'social' | 'resume' | 'story';

const toolsList: {
  id: Tool;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  placeholder: string;
  tip: string;
}[] = [
  {
    id: 'enhance',
    label: 'Text Enhancer',
    icon: Edit3,
    desc: 'Improve grammar, style, and clarity',
    color: 'bg-blue-500',
    placeholder: 'Paste your text here to enhance...',
    tip: 'Use this for professionalizing casual messages or polishing drafts.',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: Mail,
    desc: 'Craft professional or casual emails',
    color: 'bg-purple-500',
    placeholder: 'Tell me who you are emailing and what it is about...',
    tip: 'Mention the relationship with the recipient for a better tone.',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: PenTool,
    desc: 'Create SEO-optimized articles',
    color: 'bg-orange-500',
    placeholder: 'Enter your blog topic or main keywords...',
    tip: 'Specific keywords help in generating a more targeted SEO-friendly post.',
  },
  {
    id: 'study',
    label: 'Study Assistant',
    icon: BookOpen,
    desc: 'Generate notes and explanations',
    color: 'bg-emerald-500',
    placeholder: 'Paste a topic or text you want to learn more about...',
    tip: 'Ask for specific formats like "summaries" or "flashcard ideas".',
  },
  {
    id: 'code',
    label: 'Code Explainer',
    icon: Code,
    desc: 'Understand programming concepts',
    color: 'bg-indigo-500',
    placeholder: 'Paste the code snippet you want explained...',
    tip: 'You can also ask about specific bugs or performance issues.',
  },
  {
    id: 'math',
    label: 'Math Solver',
    icon: Grid,
    desc: 'Step-by-step solutions',
    color: 'bg-rose-500',
    placeholder: 'Enter your math problem step-by-step...',
    tip: 'Works best for algebra, calculus, and word problems.',
  },
  {
    id: 'translate',
    label: 'Translator',
    icon: Languages,
    desc: 'Translate between languages',
    color: 'bg-cyan-500',
    placeholder: 'Paste text to translate...',
    tip: 'AI handles idiomatic expressions better than basic translators.',
  },
  {
    id: 'social',
    label: 'Social Media Post',
    icon: Share2,
    desc: 'Platform-ready posts',
    color: 'bg-yellow-500',
    placeholder: 'What is your post about? Mention the goal...',
    tip: 'Specify your target audience for better engagement.',
  },
  {
    id: 'resume',
    label: 'Resume Assistant',
    icon: FileText,
    desc: 'Improve resume sections',
    color: 'bg-slate-500',
    placeholder: 'Paste your current experience or skills...',
    tip: 'Use action verbs and quantify achievements for best results.',
  },
  {
    id: 'story',
    label: 'Creative Story Writer',
    icon: Feather,
    desc: 'Generate story ideas and plots',
    color: 'bg-violet-500',
    placeholder: 'Describe the story idea you want...',
    tip: 'Give details about the genre or main character traits.',
  },
];

function ToolCard({ tool, onSelect }: { tool: (typeof toolsList)[0]; onSelect: () => void }) {
  const IconComponent = tool.icon;
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border bg-card/50 backdrop-blur-sm'
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110', tool.color)}>
          <IconComponent className="h-6 w-6 text-white" />
        </div>
        <div className="space-y-2 mb-6">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{tool.label}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{tool.desc}</p>
        </div>
        <div className="mt-auto">
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all rounded-xl py-5" variant="secondary">
            Use Tool
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ContentToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [options, setOptions] = useState<Record<string, any>>({
    enhanceMode: 'improve',
    emailTone: 'professional',
    blogLength: 'medium',
    studyType: 'explanation',
    codeLanguage: 'JavaScript',
    socialPlatform: 'Twitter',
    resumeSection: 'summary',
    targetLanguage: 'Spanish',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (output && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({ title: 'Please enter some text', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      let result;
      switch (selectedTool) {
        case 'enhance':
          result = await enhanceTextAction({
            text: input,
            mode: (options.enhanceMode as EnhanceTextInput['mode']) || 'improve',
          });
          break;
        case 'email':
          result = await generateEmailAction({
            context: input,
            tone: (options.emailTone as GenerateEmailInput['tone']) || 'professional',
            details: options.emailDetails,
          });
          break;
        case 'blog':
          result = await generateBlogPostAction({
            topic: input,
            length: (options.blogLength as GenerateBlogPostInput['length']) || 'medium',
          });
          break;
        case 'study':
          result = await generateStudyMaterialAction({
            topic: input,
            type: (options.studyType as GenerateStudyMaterialInput['type']) || 'explanation',
          });
          break;
        case 'code':
          result = await explainProgrammingAction({
            code: input,
            language: options.codeLanguage,
          });
          break;
        case 'math':
          result = await solveMathAction({ problem: input });
          break;
        case 'translate':
          result = await translateTextAction({
            text: input,
            targetLanguage: options.targetLanguage || 'Spanish',
          });
          break;
        case 'social':
          result = await generateSocialMediaPostAction({
            topic: input,
            platform: (options.socialPlatform as GenerateSocialMediaPostInput['platform']) || 'Twitter',
          });
          break;
        case 'resume':
          result = await assistResumeAction({
            section: (options.resumeSection as AssistResumeInput['section']) || 'summary',
            details: input,
          });
          break;
        case 'story':
          result = await generateStoryAction({ prompt: input });
          break;
        default:
          return;
      }

      if (result.success && result.data) {
        setOutput(result.data);
      } else {
        toast({ title: 'Failed to generate content', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const renderToolUI = () => {
    if (!selectedTool) {
      return (
        <div className="space-y-8 p-4 lg:p-10 max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">AI Power Tools</h2>
            <p className="text-muted-foreground text-lg">Pick a tool to transform your productivity with cutting-edge AI.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolsList.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool.id)} />
            ))}
          </div>
        </div>
      );
    }

    const tool = toolsList.find((t) => t.id === selectedTool);
    if (!tool) return null;

    return (
      <div className="h-full flex flex-col bg-background/50">
        <div className="p-4 border-b bg-background sticky top-0 z-20 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTool(null);
              setInput('');
              setOutput('');
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors rounded-full"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', tool.color)} />
            <span className="font-bold text-sm uppercase tracking-wider">{tool.label}</span>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8 pb-40 md:pb-24">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="h-5 w-5" />
                <span>Describe your request</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTool === 'enhance' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Mode</label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-input bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={options.enhanceMode}
                      onChange={(e) => setOptions({ ...options, enhanceMode: e.target.value })}
                    >
                      <option value="improve">Improve Writing</option>
                      <option value="academic">Academic Tone</option>
                      <option value="casual">Friendly/Casual</option>
                      <option value="formal">Formal Business</option>
                    </select>
                  </div>
                )}

                {selectedTool === 'email' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Tone</label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-input bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={options.emailTone}
                      onChange={(e) => setOptions({ ...options, emailTone: e.target.value })}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Strictly Formal</option>
                    </select>
                  </div>
                )}

                {selectedTool === 'blog' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Article Length</label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-input bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={options.blogLength}
                      onChange={(e) => setOptions({ ...options, blogLength: e.target.value })}
                    >
                      <option value="short">Short (300 words)</option>
                      <option value="medium">Medium (600 words)</option>
                      <option value="long">Long (1000+ words)</option>
                    </select>
                  </div>
                )}

                {selectedTool === 'translate' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Target Language</label>
                    <select
                      className="w-full h-11 px-4 rounded-xl border border-input bg-card shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={options.targetLanguage}
                      onChange={(e) => setOptions({ ...options, targetLanguage: e.target.value })}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="relative group">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tool.placeholder}
                  className="min-h-[200px] p-6 rounded-2xl border-2 border-muted hover:border-primary/30 focus-visible:border-primary transition-all text-base bg-card shadow-inner resize-none"
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  {input.length} characters
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                  <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span><strong>Tip:</strong> {tool.tip}</span>
                </div>
                
                <Button onClick={handleProcess} disabled={loading} className="h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto md:min-w-[200px] md:mx-auto">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      AI is thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Result
                    </>
                  )}
                </Button>
              </div>
            </div>

            {(output || loading) && (
              <div ref={scrollRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-2 border-primary/10 overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md">
                  <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {loading ? <div className="h-2 w-2 bg-primary rounded-full animate-pulse" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{loading ? 'Processing...' : 'Result Ready'}</span>
                    </div>
                    {!loading && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleCopy}>
                          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={handleProcess}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 md:p-10">
                    {loading ? (
                      <div className="space-y-4 py-10">
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                        <div className="flex justify-center mt-8">
                          <p className="text-sm text-muted-foreground italic">Analyzing requirements & generating content...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 text-sm" {...props} />,
                            code: ({ node, inline, children, ...props }: any) =>
                              inline ? (
                                <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded font-mono text-sm" {...props}>{children}</code>
                              ) : (
                                <code {...props}>{children}</code>
                              ),
                          }}
                        >
                          {output}
                        </ReactMarkdown>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <AppHeader title="Smart AI Tools" />
      <main className="flex-1 overflow-y-auto">
        {renderToolUI()}
      </main>
      
      {selectedTool && !output && (
        <div className="md:hidden fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent z-40">
          <Button onClick={handleProcess} disabled={loading} className="w-full h-14 rounded-2xl shadow-xl font-bold gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? 'Processing...' : 'Generate Now'}
          </Button>
        </div>
      )}
    </div>
  );
}
