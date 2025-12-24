'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  ChevronDown,
  Share2,
  FileText,
  Feather,
  PlusCircle,
  Grid,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
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
  TranslateTextInput,
  GenerateSocialMediaPostInput,
  AssistResumeInput,
  GenerateStoryInput,
} from '@/ai/flows/content-tools';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LANGUAGES } from '@/lib/languages';
import { ScrollArea } from '@/components/ui/scroll-area';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math' | 'translate' | 'social' | 'resume' | 'story';

const toolsList: {
  id: Tool;
  label: string;
  icon: React.ElementType;
  desc: string;
  imageId: string;
  gradient: string;
}[] = [
  {
    id: 'enhance',
    label: 'Text Enhancer',
    icon: Edit3,
    desc: 'Improve grammar, style, and clarity',
    imageId: 'content-tool-enhance',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: Mail,
    desc: 'Craft professional or casual emails',
    imageId: 'content-tool-email',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: PenTool,
    desc: 'Create engaging, SEO-optimized articles',
    imageId: 'content-tool-blog',
    gradient: 'from-orange-500/10 to-red-500/10',
  },
  {
    id: 'study',
    label: 'Study Assistant',
    icon: BookOpen,
    desc: 'Generate notes and explanations',
    imageId: 'content-tool-study',
    gradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    id: 'code',
    label: 'Code Explainer',
    icon: Code,
    desc: 'Understand programming concepts',
    imageId: 'content-tool-code',
    gradient: 'from-indigo-500/10 to-blue-500/10',
  },
  {
    id: 'math',
    label: 'Math Solver',
    icon: Grid,
    desc: 'Get step-by-step solutions',
    imageId: 'content-tool-math',
    gradient: 'from-rose-500/10 to-pink-500/10',
  },
  {
    id: 'translate',
    label: 'Translator',
    icon: Languages,
    desc: 'Translate text between languages',
    imageId: 'content-tool-translate',
    gradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    id: 'social',
    label: 'Social Media Post',
    icon: Share2,
    desc: 'Generate posts for social platforms',
    imageId: 'content-tool-social',
    gradient: 'from-yellow-500/10 to-orange-500/10',
  },
  {
    id: 'resume',
    label: 'Resume Assistant',
    icon: FileText,
    desc: 'Improve your resume sections',
    imageId: 'content-tool-resume',
    gradient: 'from-slate-500/10 to-gray-500/10',
  },
  {
    id: 'story',
    label: 'Creative Story Writer',
    icon: Feather,
    desc: 'Generate story ideas and plots',
    imageId: 'content-tool-story',
    gradient: 'from-violet-500/10 to-purple-500/10',
  },
];

const getImageForTool = (tool: (typeof toolsList)[0]): ImagePlaceholder | undefined => {
    return PlaceHolderImages.find((img) => img.id === tool.imageId);
}

function ToolCard({ tool, onSelect }: { tool: (typeof toolsList)[0], onSelect: () => void }) {
  const image = getImageForTool(tool);
  const IconComponent = tool.icon;
  return (
    <Card onClick={onSelect} className={cn("group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-accent/20 bg-gradient-to-br from-card to-card/50 hover:border-accent/50")}>
      <CardHeader className="p-0 relative">
        <div className={cn("relative h-40 w-full bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform", tool.gradient)}>
          {image ? (
            <Image 
              src={image.imageUrl} 
              alt={tool.label}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <IconComponent className="h-16 w-16 text-muted-foreground/30" />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg text-foreground">{tool.label}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
        </div>
      </CardContent>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
          Use Tool <ArrowRight className="h-4 w-4" />
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
        setOutput(result.data.output);
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

  const renderToolUI = () => {
    if (!selectedTool) {
      return (
        <div className="space-y-8 p-4 lg:p-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Professional Content Tools</h2>
            <p className="text-muted-foreground text-lg">Select a tool to get started with AI-powered content creation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {toolsList.map(tool => (
              <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool.id)} />
            ))}
          </div>
        </div>
      );
    }

    const tool = toolsList.find(t => t.id === selectedTool);
    if (!tool) return null;

    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTool(null);
              setInput('');
              setOutput('');
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Tools
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tool Header */}
          <div className={cn("rounded-lg bg-gradient-to-r p-6 text-white", 
            tool.gradient.replace('/10', '').replace('from-', 'from-').replace('to-', 'to-')
          )}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <tool.icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{tool.label}</h1>
                <p className="text-white/80">{tool.desc}</p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <Card className="border-accent/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTool === 'enhance' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Enhancement Mode</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    value={options.enhanceMode}
                    onChange={(e) => setOptions({ ...options, enhanceMode: e.target.value })}
                  >
                    <option>improve</option>
                    <option>academic</option>
                    <option>casual</option>
                    <option>formal</option>
                  </select>
                </div>
              )}

              {selectedTool === 'email' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                      value={options.emailTone}
                      onChange={(e) => setOptions({ ...options, emailTone: e.target.value })}
                    >
                      <option>professional</option>
                      <option>casual</option>
                      <option>formal</option>
                    </select>
                  </div>
                </>
              )}

              {selectedTool === 'blog' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Article Length</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    value={options.blogLength}
                    onChange={(e) => setOptions({ ...options, blogLength: e.target.value })}
                  >
                    <option>short</option>
                    <option>medium</option>
                    <option>long</option>
                  </select>
                </div>
              )}

              {selectedTool === 'translate' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Target Language</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  {selectedTool === 'code' ? 'Code' : selectedTool === 'math' ? 'Problem' : 'Text'}
                </label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Enter your ${selectedTool === 'code' ? 'code' : selectedTool === 'math' ? 'math problem' : 'text'} here...`}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button 
                onClick={handleProcess} 
                disabled={loading}
                className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          {output && !loading && (
            <Card className="border-primary/30 shadow-xl bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Result
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      toast({ title: 'Copied to clipboard!' });
                    }}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 rounded-lg border bg-background p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium" />,
                        h1: ({ node, ...props }) => <h1 className="font-bold text-2xl mb-4 mt-6 first:mt-0 text-foreground" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="font-bold text-xl mb-3 mt-5 first:mt-0 text-foreground" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="font-bold text-lg mb-2 mt-4 first:mt-0 text-foreground" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                        code: ({ node, inline, className, children, ...props }: any) => {
                          return !inline ? (
                            <div className="my-4 rounded-lg bg-muted p-4 overflow-x-auto border border-border">
                              <code className="text-sm font-mono text-foreground" {...props}>
                                {children}
                              </code>
                            </div>
                          ) : (
                            <code className="px-2 py-1 bg-muted rounded-md text-primary font-mono text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />,
                      }}
                    >
                      {output}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <AppHeader title="Content Tools" />
      <div className="flex-1 overflow-y-auto">
        {renderToolUI()}
      </div>
    </div>
  );
}
