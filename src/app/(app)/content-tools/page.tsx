'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  BookOpen,
  Code,
  Copy,
  Edit3,
  Grid,
  Loader2,
  Mail,
  PenTool,
} from 'lucide-react';
import { useState } from 'react';
import {
  enhanceTextAction,
  generateEmailAction,
  generateBlogPostAction,
  generateStudyMaterialAction,
  explainProgrammingAction,
  solveMathAction,
} from '@/app/actions';
import { cn } from '@/lib/utils';
import type {
    EnhanceTextInput,
    GenerateEmailInput,
    GenerateBlogPostInput,
    GenerateStudyMaterialInput,
  } from '@/ai/flows/content-tools';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math';

const toolsList = [
  {
    id: 'enhance',
    label: 'Text Enhancer',
    icon: Edit3,
    desc: 'Grammar, style, rewriting',
    color: 'text-purple-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/15',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: Mail,
    desc: 'Professional communications',
    color: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/15',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: PenTool,
    desc: 'SEO-optimized content',
    color: 'text-pink-500',
    borderColor: 'border-pink-500/30',
    bgColor: 'bg-pink-500/15',
  },
  {
    id: 'study',
    label: 'Study Assistant',
    icon: BookOpen,
    desc: 'Learning materials',
    color: 'text-green-500',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/15',
  },
  {
    id: 'code',
    label: 'Code Explainer',
    icon: Code,
    desc: 'Programming concepts',
    color: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/15',
  },
  {
    id: 'math',
    label: 'Math Solver',
    icon: Grid,
    desc: 'Solutions & explanations',
    color: 'text-red-500',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/15',
  },
];

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
            mode: (options.enhanceMode as EnhanceTextInput['mode']) || 'grammar',
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
          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold">Content Tools</h2>
            <p className="mt-2 text-muted-foreground">
              Powerful AI-driven utilities to create, enhance, and solve with
              professional quality.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toolsList.map((tool) => (
              <Card
                key={tool.id}
                className={cn(
                  'flex cursor-pointer flex-col justify-between p-6 transition-all hover:shadow-lg hover:-translate-y-1',
                  tool.borderColor
                )}
                onClick={() => setSelectedTool(tool.id as Tool)}
              >
                <div>
                  <div
                    className={cn(
                      'mb-4 flex h-14 w-14 items-center justify-center rounded-lg',
                      tool.bgColor
                    )}
                  >
                    <tool.icon className={cn('h-7 w-7', tool.color)} />
                  </div>
                  <h3 className="font-headline text-xl font-semibold">
                    {tool.label}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{tool.desc}</p>
                </div>
                <div
                  className={cn(
                    'mt-4 inline-block self-start rounded-full px-3 py-1 text-sm font-semibold',
                    tool.bgColor,
                    tool.color
                  )}
                >
                  Get Started →
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    const currentTool = toolsList.find(t => t.id === selectedTool);

    return (
        <div className="p-4 lg:p-6">
            <Button variant="ghost" onClick={() => { setSelectedTool(null); setInput(''); setOutput(''); setOptions({})}} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
            </Button>

            <div className="mb-8">
                <h2 className="font-headline text-3xl font-bold">{currentTool?.label}</h2>
                <p className="mt-2 text-muted-foreground">
                    {
                        selectedTool === 'enhance' ? 'Choose your enhancement type and input text' :
                        selectedTool === 'email' ? 'Select tone and provide context' :
                        selectedTool === 'blog' ? 'Choose content length for your article' :
                        selectedTool === 'study' ? 'Select learning material format' :
                        selectedTool === 'code' ? 'Specify programming language and paste your code' :
                        'Enter your equation or problem'
                    }
                </p>
            </div>
            
            {/* Options */}
            <div className="mb-6 space-y-4">
                {selectedTool === 'enhance' && (
                    <div className="flex flex-wrap gap-2">
                        {(['grammar', 'improve', 'rewrite'] as EnhanceTextInput['mode'][]).map(opt => (
                            <Button key={opt} variant={options.enhanceMode === opt ? 'default' : 'outline'} onClick={() => handleOptionChange('enhanceMode', opt)}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Button>
                        ))}
                    </div>
                )}
                 {selectedTool === 'email' && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {(['professional', 'casual', 'formal'] as GenerateEmailInput['tone'][]).map(tone => (
                                <Button key={tone} variant={options.emailTone === tone ? 'default' : 'outline'} onClick={() => handleOptionChange('emailTone', tone)}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Button>
                            ))}
                        </div>
                        <Input placeholder="Additional details (optional)..." value={options.emailDetails || ''} onChange={e => handleOptionChange('emailDetails', e.target.value)} />
                    </div>
                )}
                {selectedTool === 'blog' && (
                    <div className="flex flex-wrap gap-2">
                        {(['short', 'medium', 'long'] as GenerateBlogPostInput['length'][]).map(len => (
                            <Button key={len} variant={options.blogLength === len ? 'default' : 'outline'} onClick={() => handleOptionChange('blogLength', len)}>{len.charAt(0).toUpperCase() + len.slice(1)}</Button>
                        ))}
                    </div>
                )}
                {selectedTool === 'study' && (
                    <div className="flex flex-wrap gap-2">
                        {(['explanation', 'notes', 'flashcards'] as GenerateStudyMaterialInput['type'][]).map(type => (
                            <Button key={type} variant={options.studyType === type ? 'default' : 'outline'} onClick={() => handleOptionChange('studyType', type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Button>
                        ))}
                    </div>
                )}
                {selectedTool === 'code' && (
                    <Input placeholder="Language (e.g., JavaScript)" value={options.codeLanguage || ''} onChange={e => handleOptionChange('codeLanguage', e.target.value)} />
                )}
            </div>

            {/* Input */}
            <Textarea 
                placeholder={
                    selectedTool === 'enhance' ? 'Enter text to enhance...' :
                    selectedTool === 'email' ? 'Email purpose/context...' :
                    selectedTool === 'blog' ? 'Blog topic...' :
                    selectedTool === 'study' ? 'Topic to study...' :
                    selectedTool === 'code' ? 'Paste code here...' :
                    'Enter math problem...'
                }
                value={input}
                onChange={e => setInput(e.target.value)}
                className="min-h-[150px] text-base"
            />

            <Button onClick={handleProcess} disabled={loading} size="lg" className="mt-4 w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Processing...' : 'Generate'}
            </Button>
            
            {/* Output */}
            {output && (
                <Card className="mt-8 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-headline text-xl font-semibold">Result</h3>
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert mt-4 max-w-none whitespace-pre-wrap">
                        {output}
                    </div>
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
