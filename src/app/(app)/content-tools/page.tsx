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
  Grid,
  ArrowRight,
  Languages,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import {
  enhanceTextAction,
  generateEmailAction,
  generateBlogPostAction,
  generateStudyMaterialAction,
  explainProgrammingAction,
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
} from '@/ai/flows/content-tools';
import Image from 'next/image';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LANGUAGES, Language } from '@/lib/languages';
import { ScrollArea } from '@/components/ui/scroll-area';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math' | 'translate';

const toolsList: {
  id: Tool;
  label: string;
  icon: React.ElementType;
  desc: string;
  imageId: string;
}[] = [
  {
    id: 'enhance',
    label: 'Text Enhancer',
    icon: Edit3,
    desc: 'Improve grammar, style, and clarity',
    imageId: 'content-tool-enhance',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: Mail,
    desc: 'Craft professional or casual emails',
    imageId: 'content-tool-email',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: PenTool,
    desc: 'Create engaging, SEO-optimized articles',
    imageId: 'content-tool-blog',
  },
  {
    id: 'study',
    label: 'Study Assistant',
    icon: BookOpen,
    desc: 'Generate notes and explanations',
    imageId: 'content-tool-study',
  },
  {
    id: 'code',
    label: 'Code Explainer',
    icon: Code,
    desc: 'Understand programming concepts',
    imageId: 'content-tool-code',
  },
  {
    id: 'math',
    label: 'Math Solver',
    icon: Grid,
    desc: 'Get step-by-step solutions',
    imageId: 'content-tool-math',
  },
    {
    id: 'translate',
    label: 'Translator',
    icon: Languages,
    desc: 'Translate text between languages',
    imageId: 'content-tool-translate',
  },
];

const getImageForTool = (tool: (typeof toolsList)[0]): ImagePlaceholder | undefined => {
    return PlaceHolderImages.find((img) => img.id === tool.imageId);
}

function ToolCard({ tool, onSelect }: { tool: (typeof toolsList)[0], onSelect: () => void }) {
  const image = getImageForTool(tool);
  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {image && (
            <Image
              src={image.imageUrl}
              alt={tool.label}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
          )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute bottom-0 left-0 p-4">
             <h3 className="font-headline text-2xl font-bold text-white">{tool.label}</h3>
           </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <p className="flex-1 text-muted-foreground">{tool.desc}</p>
        <Button onClick={onSelect} className="mt-4 w-full">
          Open Tool <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}


export default function ContentToolsPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!input.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter some text to process.',
      });
      return;
    }
    setLoading(true);
    setOutput('');

    let result;
    try {
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
                targetLanguage: (options.targetLanguage as TranslateTextInput['targetLanguage']) || 'Spanish',
            });
            break;
        default:
          throw new Error('No tool selected');
      }

      if (result.success) {
        setOutput(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error instanceof Error ? error.message : 'Processing failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to clipboard' });
  };
  
  const handleOptionChange = (key: string, value: string) => {
    setOptions(prev => ({...prev, [key]: value}));
  }

  const renderToolUI = () => {
    if (!selectedTool) {
      return (
        <div className="p-4 lg:p-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="mb-8 text-center">
              <h1 className="font-headline text-4xl font-bold">Content Tools</h1>
              <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Powerful AI-driven utilities to create, enhance, and solve with
                professional quality.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {toolsList.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool.id)} />
                ))}
            </div>
          </div>
        </div>
      );
    }

    const currentTool = toolsList.find(t => t.id === selectedTool);

    return (
        <div className="p-4 lg:p-6">
            <Button variant="ghost" onClick={() => { setSelectedTool(null); setInput(''); setOutput(''); setOptions({})}} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Tools
            </Button>

            <div className="mb-8 flex items-center gap-4">
                 <div className={cn('flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10')}>
                    {currentTool && <currentTool.icon className={cn('h-8 w-8', 'text-primary')} />}
                </div>
                <div>
                    <h2 className="font-headline text-3xl font-bold">{currentTool?.label}</h2>
                    <p className="mt-1 text-muted-foreground">
                        {
                            selectedTool === 'enhance' ? 'Choose your enhancement type and input text.' :
                            selectedTool === 'email' ? 'Select tone and provide context for the email.' :
                            selectedTool === 'blog' ? 'Choose content length for your article.' :
                            selectedTool === 'study' ? 'Select learning material format.' :
                            selectedTool === 'code' ? 'Specify programming language and paste your code.' :
                            selectedTool === 'translate' ? 'Select target language and enter text.' :
                            'Enter your equation or problem to get a solution.'
                        }
                    </p>
                </div>
            </div>
            
            <Card>
                <CardContent className="p-6">
                    {/* Options */}
                    <div className="mb-6 space-y-4">
                        {selectedTool === 'enhance' && (
                            <div className="flex flex-wrap gap-2">
                                {(['grammar', 'improve', 'rewrite'] as EnhanceTextInput['mode'][]).map(opt => (
                                    <Button key={opt} variant={(options.enhanceMode || 'improve') === opt ? 'default' : 'outline'} onClick={() => handleOptionChange('enhanceMode', opt)}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Button>
                                ))}
                            </div>
                        )}
                        {selectedTool === 'email' && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {(['professional', 'casual', 'formal'] as GenerateEmailInput['tone'][]).map(tone => (
                                        <Button key={tone} variant={(options.emailTone || 'professional') === tone ? 'default' : 'outline'} onClick={() => handleOptionChange('emailTone', tone)}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Button>
                                    ))}
                                </div>
                                <Input placeholder="Additional details (optional)..." value={options.emailDetails || ''} onChange={e => handleOptionChange('emailDetails', e.target.value)} />
                            </div>
                        )}
                        {selectedTool === 'blog' && (
                            <div className="flex flex-wrap gap-2">
                                {(['short', 'medium', 'long'] as GenerateBlogPostInput['length'][]).map(len => (
                                    <Button key={len} variant={(options.blogLength || 'medium') === len ? 'default' : 'outline'} onClick={() => handleOptionChange('blogLength', len)}>{len.charAt(0).toUpperCase() + len.slice(1)}</Button>
                                ))}
                            </div>
                        )}
                        {selectedTool === 'study' && (
                            <div className="flex flex-wrap gap-2">
                                {(['explanation', 'notes', 'flashcards'] as GenerateStudyMaterialInput['type'][]).map(type => (
                                    <Button key={type} variant={(options.studyType || 'explanation') === type ? 'default' : 'outline'} onClick={() => handleOptionChange('studyType', type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Button>
                                ))}
                            </div>
                        )}
                        {selectedTool === 'code' && (
                            <Input placeholder="Language (e.g., JavaScript, Python)" value={options.codeLanguage || ''} onChange={e => handleOptionChange('codeLanguage', e.target.value)} />
                        )}
                        {selectedTool === 'translate' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {options.targetLanguage || 'Select Language'}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <ScrollArea className="h-64">
                                        {LANGUAGES.map(lang => (
                                            <DropdownMenuItem key={lang.code} onSelect={() => handleOptionChange('targetLanguage', lang.name)}>
                                                {lang.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </ScrollArea>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Input */}
                    <Textarea 
                        placeholder={
                            selectedTool === 'enhance' ? 'Enter text to enhance...' :
                            selectedTool === 'email' ? 'Enter the purpose or main points of your email...' :
                            selectedTool === 'blog' ? 'Enter the topic for your blog post...' :
                            selectedTool === 'study' ? 'Enter the topic you want to study...' :
                            selectedTool === 'code' ? 'Paste your code snippet here...' :
                            selectedTool === 'translate' ? 'Enter text to translate...' :
                            'Enter your math problem here...'
                        }
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="min-h-[200px] text-base"
                    />

                    <Button onClick={handleProcess} disabled={loading} size="lg" className="mt-4 w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Generating...' : 'Generate Result'}
                    </Button>
                </CardContent>
            </Card>
            
            {/* Output */}
            {(loading || output) && (
                <Card className="mt-8">
                     <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Result</CardTitle>
                        {output && !loading && (
                            <Button variant="ghost" size="sm" onClick={handleCopy}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading && (
                           <div className="flex items-center justify-center p-8">
                             <Loader2 className="h-10 w-10 animate-spin text-primary" />
                           </div>
                        )}
                        {output && (
                            <div className="prose prose-sm dark:prose-invert mt-4 max-w-none rounded-lg border bg-secondary/20 p-4">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" />,
                                    }}
                                >
                                    {output}
                                </ReactMarkdown>
                           </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Content Tools" />
      <div className="flex-1 overflow-y-auto">{renderToolUI()}</div>
    </div>
  );
}

    