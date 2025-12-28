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
  Volume2,
  Camera,
  Image as ImageIcon,
  X,
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
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

type Tool = 'enhance' | 'email' | 'blog' | 'study' | 'code' | 'math' | 'translate' | 'social' | 'resume' | 'story' | 'tts';

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
    icon: Sparkles,
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
  {
    id: 'tts',
    label: 'Text to Speech',
    icon: Volume2,
    desc: 'Convert any text into high-quality human speech',
    color: 'bg-orange-600',
    placeholder: 'Paste the text you want to convert to speech...',
    tip: 'Select from multiple natural-sounding voices and adjust the speed for the best result.',
    features: ['Multi-Voice', 'Speed Control', '100% Private', 'HD Audio'],
    image: '/tool-icons/text_to_speech_tool_icon.png',
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
  const [mathImage, setMathImage] = useState<string | null>(null);
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
    if (selectedTool) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTool]);

  useEffect(() => {
    if (output && scrollRef.current) {
      const offset = 100;
      const elementPosition = scrollRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [output]);

  const handleProcess = async () => {
    if (!input.trim() && !mathImage) {
      toast({ title: 'Please enter some text or provide an image', variant: 'destructive' });
      return;
    }

    if (selectedTool === 'tts') {
      setOutput(input);
      setLoading(false);
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
            length: options.enhanceLength || 'original',
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
            length: options.blogLength || 'medium',
            audience: options.blogAudience,
          });
          break;
        case 'study':
          result = await generateStudyMaterialAction({
            topic: input,
            type: options.studyType || 'explanation',
            difficulty: options.difficulty,
          });
          break;
        case 'code':
          result = await explainProgrammingAction({
            code: input,
            language: options.codeLanguage,
            mode: options.codeMode,
          });
          break;
        case 'math':
          result = await solveMathAction({ 
            problem: input,
            image: mathImage || undefined 
          });
          break;
        case 'translate':
          result = await translateTextAction({
            text: input,
            targetLanguage: options.targetLanguage || 'Spanish',
            tone: options.translateTone,
          });
          break;
        case 'social':
          result = await generateSocialMediaPostAction({
            topic: input,
            platform: options.socialPlatform || 'Twitter',
            goal: options.socialGoal,
          });
          break;
        case 'resume':
          result = await assistResumeAction({
            section: options.resumeSection || 'summary',
            details: input,
            role: options.resumeRole,
          });
          break;
        case 'story':
          result = await generateStoryAction({ 
            prompt: input,
            genre: options.storyGenre,
            length: options.storyLength
          });
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
      if (file.type.startsWith('image/') && selectedTool === 'math') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result;
          if (typeof base64 === 'string') {
            setMathImage(base64);
            toast({ title: 'Image uploaded for math solving' });
          }
        };
        reader.readAsDataURL(file);
        return;
      }
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

            <div className="flex flex-col gap-6">
              {selectedTool === 'enhance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Enhancement Mode</label>
                    <select 
                      value={options.enhanceMode} 
                      onChange={(e) => setOptions({...options, enhanceMode: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="improve">Improve Flow</option>
                      <option value="grammar">Fix Grammar</option>
                      <option value="rewrite">Professional Rewrite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Length</label>
                    <select 
                      value={options.enhanceLength || 'original'} 
                      onChange={(e) => setOptions({...options, enhanceLength: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="original">Keep Original</option>
                      <option value="concise">More Concise</option>
                      <option value="detailed">More Detailed</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTool === 'email' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Email Tone</label>
                    <select 
                      value={options.emailTone} 
                      onChange={(e) => setOptions({...options, emailTone: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="professional">Professional</option>
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Specific Details</label>
                    <input 
                      type="text"
                      placeholder="e.g. Include meeting time at 2PM"
                      value={options.emailDetails || ''}
                      onChange={(e) => setOptions({...options, emailDetails: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Article Length</label>
                    <select 
                      value={options.blogLength} 
                      onChange={(e) => setOptions({...options, blogLength: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="short">Short (300 words)</option>
                      <option value="medium">Medium (700 words)</option>
                      <option value="long">Long (1200+ words)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Target Audience</label>
                    <input 
                      type="text"
                      placeholder="e.g. Tech enthusiasts, Beginners"
                      value={options.blogAudience || ''}
                      onChange={(e) => setOptions({...options, blogAudience: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'translate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Target Language</label>
                    <select 
                      value={options.targetLanguage} 
                      onChange={(e) => setOptions({...options, targetLanguage: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.name}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Tone</label>
                    <select 
                      value={options.translateTone || 'neutral'} 
                      onChange={(e) => setOptions({...options, translateTone: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="neutral">Neutral</option>
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTool === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Platform</label>
                    <select 
                      value={options.socialPlatform} 
                      onChange={(e) => setOptions({...options, socialPlatform: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Twitter">Twitter / X</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Facebook">Facebook</option>
                      <option value="TikTok">TikTok (Script)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Post Goal</label>
                    <select 
                      value={options.socialGoal || 'engagement'} 
                      onChange={(e) => setOptions({...options, socialGoal: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="engagement">Engagement</option>
                      <option value="informational">Informational</option>
                      <option value="promotional">Promotional</option>
                      <option value="humorous">Humorous</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTool === 'resume' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Resume Section</label>
                    <select 
                      value={options.resumeSection} 
                      onChange={(e) => setOptions({...options, resumeSection: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="summary">Professional Summary</option>
                      <option value="experience">Work Experience</option>
                      <option value="skills">Skills Optimization</option>
                      <option value="education">Education</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Target Role</label>
                    <input 
                      type="text"
                      placeholder="e.g. Senior Developer, Manager"
                      value={options.resumeRole || ''}
                      onChange={(e) => setOptions({...options, resumeRole: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'code' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Programming Language</label>
                    <select 
                      value={options.codeLanguage} 
                      onChange={(e) => setOptions({...options, codeLanguage: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="JavaScript">JavaScript</option>
                      <option value="TypeScript">TypeScript</option>
                      <option value="Python">Python</option>
                      <option value="Java">Java</option>
                      <option value="C++">C++</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Analysis Mode</label>
                    <select 
                      value={options.codeMode || 'explain'} 
                      onChange={(e) => setOptions({...options, codeMode: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="explain">Explain Logic</option>
                      <option value="optimize">Optimize Performance</option>
                      <option value="debug">Find Bugs</option>
                      <option value="security">Security Audit</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTool === 'study' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Output Type</label>
                    <select 
                      value={options.studyType} 
                      onChange={(e) => setOptions({...options, studyType: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="explanation">Deep Explanation</option>
                      <option value="notes">Concise Notes</option>
                      <option value="flashcards">Flashcards (Q&A)</option>
                      <option value="quiz">Multiple Choice Quiz</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Difficulty</label>
                    <select 
                      value={options.difficulty} 
                      onChange={(e) => setOptions({...options, difficulty: e.target.value})}
                      className="w-full h-12 bg-background border-2 border-border/40 rounded-xl px-4 font-bold focus:border-primary/60 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced / Expert</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedTool === 'math' && (
                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-muted/30 p-8 rounded-[2rem] border border-border/40 backdrop-blur-xl shadow-2xl">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                            <FileText className="h-4 w-4 text-rose-500" />
                          </div>
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-rose-500/80">Context & Description</label>
                        </div>
                        <div className="relative group/input">
                          <Textarea 
                            placeholder="Provide background information, explain the steps you've taken, or paste the full word problem here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="min-h-[140px] bg-background/50 border-2 border-border/40 rounded-2xl p-6 font-medium text-lg focus:border-rose-500/40 transition-all resize-none shadow-inner group-hover/input:bg-background/80"
                          />
                          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                            <BookOpen className="h-3 w-3" />
                            Narrative Input
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-rose-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-muted/30 p-8 rounded-[2rem] border border-border/40 backdrop-blur-xl shadow-2xl">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                              <Code className="h-4 w-4 text-primary" />
                            </div>
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-primary">Advanced Equation Editor</label>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Live Expression</span>
                          </div>
                        </div>

                        <div className="relative group/equation">
                          <input 
                            type="text"
                            placeholder="Type equation (e.g., lim x->0 sin(x)/x or f(x) = x^2 + 2x + 1)"
                            className="w-full h-20 bg-background/50 border-2 border-border/40 rounded-2xl px-8 font-mono text-2xl focus:border-primary/60 outline-none transition-all shadow-inner group-hover/equation:bg-background/80 placeholder:text-muted-foreground/30 text-primary"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value;
                                if (val) {
                                  setInput(prev => prev ? `${prev}\n\n[Equation Entry]\n${val}\n---` : `[Equation Entry]\n${val}\n---`);
                                  (e.target as HTMLInputElement).value = '';
                                  toast({ title: 'Equation Added to Workbench', className: 'rounded-xl font-bold' });
                                }
                              }
                            }}
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end mr-2">
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-40">Press Enter</span>
                              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-40">To Commit</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/equation:scale-110 transition-transform">
                              <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['π', '√', '∫', 'd/dx', 'lim', 'Σ', '∞', 'log'].map((sym) => (
                            <button
                              key={sym}
                              onClick={() => {
                                const inputEl = document.querySelector('input[placeholder*="Type equation"]') as HTMLInputElement;
                                if (inputEl) {
                                  const start = inputEl.selectionStart || 0;
                                  const end = inputEl.selectionEnd || 0;
                                  const text = inputEl.value;
                                  inputEl.value = text.substring(0, start) + sym + text.substring(end);
                                  inputEl.focus();
                                  inputEl.setSelectionRange(start + sym.length, start + sym.length);
                                }
                              }}
                              className="h-10 rounded-xl bg-background/40 border border-border/40 text-sm font-bold hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
                            >
                              {sym}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                          <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-foreground/80">Pro Tip: Use the Quick Symbols above</p>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                              You can combine narrative descriptions with multiple equations. Each committed equation is added to your workbench for final analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {selectedTool !== 'math' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <label className="text-sm font-black uppercase tracking-widest text-foreground">Input Details</label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setInput('');
                        setMathImage(null);
                      }}
                      className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 rounded-lg h-8"
                    >
                      <RotateCcw className="h-3 w-3 mr-2" /> Reset
                    </Button>
                  </div>
                  
                  <div className="relative group">
                    <Textarea
                      placeholder={tool.placeholder}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[180px] bg-card/60 border-2 border-primary/10 rounded-[2rem] p-8 text-lg font-medium focus:border-primary/40 transition-all backdrop-blur-xl shadow-inner resize-none group-hover:bg-card/80"
                    />
                    <div className="absolute bottom-6 right-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">AI Engine Ready</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-16 rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 hover:bg-primary/5 transition-all font-black text-xs uppercase tracking-widest gap-3 shadow-sm hover:shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Upload File</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept={selectedTool === 'math' ? 'image/*,text/*' : 'text/*'}
                />

                <Button
                  onClick={handleProcess}
                  disabled={loading || (!input.trim() && !mathImage)}
                  className={cn(
                    'h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-3',
                    tool.color.replace('bg-', 'shadow-') + '/20'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Content</span>
                    </>
                  )}
                </Button>
              </div>

              {mathImage && (
                <div className="relative w-full max-w-md mx-auto aspect-video rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl mt-4 group">
                  <img src={mathImage} alt="Math problem" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full w-10 h-10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setMathImage(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-3 text-center">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Image for analysis attached</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                <Lightbulb className="h-5 w-5 text-primary animate-pulse" />
                <p className="text-xs font-bold text-muted-foreground leading-relaxed">{tool.tip}</p>
              </div>

              {output && (
                <div ref={scrollRef} className="space-y-6 pt-10 border-t border-primary/10 mt-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <label className="text-sm font-black uppercase tracking-widest text-foreground">AI Generated Result</label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 border-primary/20 gap-2 h-9"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('txt')}
                        className="rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 border-primary/20 gap-2 h-9"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <Card className="rounded-[2.5rem] border-2 border-primary/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[300px] flex flex-col">
                    <CardContent className="p-10 flex-1 flex flex-col">
                      <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-black prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium prose-pre:bg-muted/50 prose-pre:rounded-2xl prose-pre:border-2 prose-pre:border-border/40 prose-pre:p-6 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            math: ({ value }) => <BlockMath math={value} />,
                            inlineMath: ({ value }) => <InlineMath math={value} />,
                          }}
                        >
                          {output}
                        </ReactMarkdown>
                      </div>
                      {selectedTool === 'tts' && (
                        <div className="mt-10 pt-10 border-t border-border/40 flex flex-col items-center">
                          <TextToSpeech text={output} className="w-full" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-10 opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rate this result:</p>
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-green-500/10 hover:text-green-500"><CheckCircle2 className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-red-500/10 hover:text-red-500"><X className="h-5 w-5" /></Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
