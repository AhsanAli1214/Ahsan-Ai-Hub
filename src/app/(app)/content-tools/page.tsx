'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { executeReCaptcha, verifyReCaptcha } from '@/components/ReCaptcha';
import {
  ArrowLeft,
  BookOpen,
  Code,
  Copy,
  Edit3,
  Loader2,
  Mail,
  PenTool,
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
  Upload,
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
import { TextToSpeech } from '@/components/TextToSpeech';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math' | 'translate' | 'social' | 'resume' | 'story';

const toolsList: {
  id: Tool;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  placeholder: string;
  tip: string;
  features?: string[];
  image?: string;
}[] = [
  {
    id: 'enhance',
    label: 'Text Enhancer',
    icon: Edit3,
    desc: 'Improve grammar, style, and clarity',
    color: 'bg-blue-500',
    placeholder: 'Paste your text here to enhance...',
    tip: 'Use this for professionalizing casual messages or polishing drafts.',
    features: ['Grammar Check', 'Style Options', 'Tone Selection', 'Readability Analysis'],
    image: '/tool-icons/text_enhancer_tool_icon.png',
  },
  {
    id: 'email',
    label: 'Email Writer',
    icon: Mail,
    desc: 'Craft professional or casual emails',
    color: 'bg-purple-500',
    placeholder: 'Tell me who you are emailing and what it is about...',
    tip: 'Mention the relationship with the recipient for a better tone.',
    features: ['Tone Selection', 'Custom Details', 'Professional Templates', 'Preview'],
    image: '/tool-icons/email_writer_tool_icon.png',
  },
  {
    id: 'blog',
    label: 'Blog Generator',
    icon: PenTool,
    desc: 'Create SEO-optimized articles',
    color: 'bg-orange-500',
    placeholder: 'Enter your blog topic or main keywords...',
    tip: 'Specific keywords help in generating a more targeted SEO-friendly post.',
    features: ['SEO Optimized', 'Length Control', 'Markdown Format', 'Image Suggestions'],
    image: '/tool-icons/blog_generator_tool_icon.png',
  },
  {
    id: 'study',
    label: 'Study Assistant',
    icon: BookOpen,
    desc: 'Generate notes and explanations',
    color: 'bg-emerald-500',
    placeholder: 'Paste a topic or text you want to learn more about...',
    tip: 'Ask for specific formats like "summaries" or "flashcard ideas".',
    features: ['Deep Summaries', 'Quiz Gen', 'Step-by-step', 'Resource Links'],
    image: '/tool-icons/study_assistant_tool_icon.png',
  },
  {
    id: 'code',
    label: 'Code Explainer',
    icon: Code,
    desc: 'Understand programming concepts',
    color: 'bg-indigo-500',
    placeholder: 'Paste the code snippet you want explained...',
    tip: 'You can also ask about specific bugs or performance issues.',
    features: ['Logic Check', 'Optimization', 'Security Scan', 'Multi-language'],
    image: '/tool-icons/code_explainer_tool_icon.png',
  },
  {
    id: 'math',
    label: 'Math Solver',
    icon: Grid,
    desc: 'Step-by-step solutions',
    color: 'bg-rose-500',
    placeholder: 'Enter your math problem step-by-step...',
    tip: 'Works best for algebra, calculus, and word problems.',
    features: ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
    image: '/tool-icons/math_solver_tool_icon.png',
  },
  {
    id: 'translate',
    label: 'Translator',
    icon: Languages,
    desc: 'Translate text between languages',
    color: 'bg-cyan-500',
    placeholder: 'Paste text to translate...',
    tip: 'AI handles idiomatic expressions better than basic translators.',
    features: ['50+ Langs', 'Slang Support', 'Formal/Casual', 'Instant Output'],
    image: '/tool-icons/translator_tool_icon.png',
  },
  {
    id: 'social',
    label: 'Social Media Post',
    icon: Share2,
    desc: 'Platform-ready posts',
    color: 'bg-yellow-500',
    placeholder: 'What is your post about? Mention the goal...',
    tip: 'Specify your target audience for better engagement.',
    features: ['Hashtag Gen', 'Emoji Support', 'Multi-platform', 'Viral Hook'],
    image: '/tool-icons/social_media_post_tool_icon.png',
  },
  {
    id: 'resume',
    label: 'Resume Assistant',
    icon: FileText,
    desc: 'Improve resume sections',
    color: 'bg-slate-500',
    placeholder: 'Paste your current experience or skills...',
    tip: 'Use action verbs and quantify achievements for best results.',
    features: ['ATS Ready', 'Power Verbs', 'Formatting', 'Skill Mapping'],
    image: '/tool-icons/resume_assistant_tool_icon.png',
  },
  {
    id: 'story',
    label: 'Creative Story Writer',
    icon: Feather,
    desc: 'Generate story ideas and plots',
    color: 'bg-violet-500',
    placeholder: 'Describe the story idea you want...',
    tip: 'Give details about the genre or main character traits.',
    features: ['World Building', 'Plot Twists', 'Character Dev', 'Genre Specific'],
    image: '/tool-icons/story_writer_tool_icon.png',
  },
];

function ToolCard({ tool, onSelect }: { tool: (typeof toolsList)[0]; onSelect: () => void }) {
  const IconComponent = tool.icon;
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/60 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl hover:from-card/90 hover:to-card/70',
        'hover:border-primary/50 hover:shadow-primary/20'
      )}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {tool.image && (
        <div className="relative w-full h-32 bg-muted overflow-hidden">
          <img 
            src={tool.image} 
            alt={tool.label}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={cn('absolute inset-0', tool.color, 'opacity-0 group-hover:opacity-20 transition-opacity')} />
        </div>
      )}
      <div className="relative p-7 flex flex-col h-full flex-1 space-y-5">
        <div className="flex items-start gap-4 pb-2">
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-115 group-hover:shadow-2xl shadow-lg flex-shrink-0', tool.color)}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">{tool.label}</h3>
            <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-90 mt-1">AI Powered</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 text-balance">{tool.desc}</p>
        
        <div className="mt-auto pt-3">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all rounded-xl py-5 font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" variant="default">
            <span>Use Tool</span>
            <span className="ml-auto group-hover:translate-x-1 transition-transform duration-200">→</span>
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
    difficulty: 'intermediate',
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    let patienceMessageShown = false;
    let timeoutHandle: NodeJS.Timeout | null = null;

    try {
      const captchaPromise = (async () => {
        const token = await executeReCaptcha('content_tool_use');
        return await verifyReCaptcha(token);
      })();

      const showPatienceMessage = new Promise<void>((resolve) => {
        timeoutHandle = setTimeout(() => {
          patienceMessageShown = true;
          toast({ 
            title: 'Verifying security... Please wait',
            description: 'This takes just a moment.',
          });
          resolve();
        }, 1500);
      });

      const captchaVerification = await captchaPromise;
      if (timeoutHandle) clearTimeout(timeoutHandle);

      if (!captchaVerification.success) {
        toast({ title: 'Security verification failed. Please try again.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      if (patienceMessageShown) {
        toast({ 
          title: 'Generating content... Almost done',
          description: 'Your AI assistant is working on your request.',
        });
      }

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

  const handleDownload = (format: 'txt' | 'pdf') => {
    const element = document.createElement("a");
    const file = new Blob([output], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ai-output-${Date.now()}.${format}`;
    document.body.appendChild(element);
    element.click();
    toast({ title: `Downloading ${format.toUpperCase()}...` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setInput(text);
          toast({ title: 'File uploaded successfully' });
        }
      };
      reader.readAsText(file);
    }
  };

  if (!selectedTool) {
    return (
      <div className="space-y-20 p-8 lg:p-20 max-w-7xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block px-5 py-3 rounded-full bg-primary/10 border border-primary/30">
            <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Professional Tools</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black tracking-tight text-foreground leading-tight">AI Studio</h2>
          <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-2xl mx-auto">Harness the power of advanced AI to accelerate your creative and professional workflow with precision-engineered tools.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-max">
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
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b bg-background sticky top-0 z-20 flex items-center justify-between shadow-md backdrop-blur-xl border-primary/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedTool(null);
            setInput('');
            setOutput('');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all rounded-xl font-bold px-4 py-2"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Studio
        </Button>
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-2xl border border-border/60 backdrop-blur-sm">
          <div className={cn('w-3 h-3 rounded-full shadow-md', tool.color)} />
          <span className="font-black text-sm uppercase tracking-[0.15em] text-foreground">{tool.label}</span>
        </div>
        <div className="w-24 md:block hidden" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-10 pb-44 md:pb-28">
          <div className="space-y-8">
            <Card className="overflow-hidden border-2 border-primary/20 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-10 space-y-6">
                  <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl', tool.color)}>
                    <tool.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-foreground uppercase tracking-tight">{tool.label}</h2>
                    <p className="text-muted-foreground font-medium mt-2 leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tool.features?.map(f => (
                      <span key={f} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">{f}</span>
                    ))}
                  </div>
                </div>
                {tool.image && (
                  <div className="relative h-full min-h-[200px] hidden md:block">
                    <img src={tool.image} alt={tool.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary font-black text-lg">
                <Sparkles className="h-6 w-6" />
                <span>Your Input</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload File
                  <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.js,.ts,.py,.css,.html" onChange={handleFileUpload} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInput('')} className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                  <RotateCcw className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedTool === 'enhance' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Tone & Mode</label>
                    <select
                      className="w-full h-12 px-4 rounded-2xl border border-border/60 bg-background/50 outline-none transition-all font-bold appearance-none cursor-pointer"
                      value={options.enhanceMode}
                      onChange={(e) => setOptions({ ...options, enhanceMode: e.target.value })}
                    >
                      <option value="improve">🚀 General Improvement</option>
                      <option value="academic">🎓 Academic Perfection</option>
                      <option value="casual">👋 Friendly & Casual</option>
                      <option value="formal">👔 Formal Business</option>
                    </select>
                  </div>
                </>
              )}
              {/* Add other tool options here as needed, simplified for speed */}
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={tool.placeholder}
              className="min-h-[250px] rounded-[2rem] bg-card/60 border-2 border-border/40 p-8 text-lg font-medium focus:border-primary/60 transition-all shadow-inner"
            />

            <Button
              onClick={handleProcess}
              disabled={loading}
              className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all bg-primary"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Generate Masterpiece'}
            </Button>

            {output && (
              <div ref={scrollRef} className="space-y-8 pt-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-500 font-black text-lg">
                    <CheckCircle2 className="h-6 w-6" />
                    <span>AI Result</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2 border-primary/30 hover:bg-primary/10" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 border-2 border-emerald-500/20 bg-card/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles className="h-20 w-20 text-emerald-500" />
                    </div>
                    <div className="prose dark:prose-invert prose-emerald max-w-none font-medium leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {output}
                      </ReactMarkdown>
                    </div>
                  </Card>
                  
                  <div className="space-y-6">
                    <TextToSpeech text={output} />
                    <Card className="border-border/40 bg-accent/30 p-6 rounded-[2rem] space-y-4 shadow-lg">
                      <h4 className="font-black uppercase tracking-widest text-xs">Export Options</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={() => handleDownload('txt')} className="rounded-xl font-bold gap-2 border-border/60 hover:bg-background/80">
                          <FileText className="h-4 w-4" /> TXT
                        </Button>
                        <Button variant="outline" onClick={() => handleDownload('pdf')} className="rounded-xl font-bold gap-2 border-border/60 hover:bg-background/80">
                          <Download className="h-4 w-4" /> PDF
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}