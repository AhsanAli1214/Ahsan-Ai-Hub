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
  Zap,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import dynamic from 'next/dynamic';
import { LANGUAGES } from '@/lib/languages';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamic imports for heavy components
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });
const remarkGfm = import('remark-gfm');
const remarkMath = import('remark-math');
const rehypeRaw = import('rehype-raw');
const rehypeKatex = import('rehype-katex');
const TextToSpeech = dynamic(() => import('@/components/TextToSpeech').then(mod => mod.TextToSpeech), { ssr: false });

// Tool metadata for SEO and internal use
const toolMeta: Record<Tool, { title: string; description: string; keywords: string[] }> = {
  enhance: {
    title: 'Free AI Text Enhancer - Improve Writing & Grammar Online',
    description: 'Instantly professionalize your writing with our free AI text enhancer. Improve grammar, style, and tone without login.',
    keywords: ['AI text enhancer', 'improve writing online free', 'AI grammar checker', 'writing assistant no login'],
  },
  email: {
    title: 'Free AI Email Writer - Generate Professional Emails Instantly',
    description: 'Write professional or casual emails in seconds with our free AI email generator. No signup required.',
    keywords: ['AI email writer free', 'email generator no login', 'professional email assistant', 'AI writing tools'],
  },
  blog: {
    title: 'Free AI Blog Generator - Create SEO-Optimized Articles',
    description: 'Generate high-quality, SEO-optimized blog posts instantly with our free AI blog writer. No login needed.',
    keywords: ['AI blog post generator', 'free AI writer', 'SEO article generator', 'content creation tool'],
  },
  study: {
    title: 'Free AI Study Assistant - Homework Help & Note Generator',
    description: 'Get step-by-step explanations and generate study notes with our free AI study assistant. Perfect for students.',
    keywords: ['AI study helper', 'homework assistant online', 'note generator', 'student AI tools'],
  },
  code: {
    title: 'Free AI Code Explainer - Understand Programming Concepts',
    description: 'Understand complex code snippets instantly with our free AI code explainer. Supports all major languages.',
    keywords: ['AI code explainer', 'programming assistant free', 'understand code online', 'coding help no login'],
  },
  math: {
    title: 'Free AI Math Solver - Step-by-Step Problem Solutions',
    description: 'Solve complex math problems with step-by-step guidance using our free AI math solver. Upload images or type problems.',
    keywords: ['AI math solver free', 'math homework help', 'step-by-step math solutions', 'math problem solver online'],
  },
  translate: {
    title: 'Free AI Translator - Translate 50+ Languages Instantly',
    description: 'Translate text accurately between 50+ languages with our free AI translator. Handles slang and idioms perfectly.',
    keywords: ['AI translator free', 'translate 50 languages', 'accurate translation tool', 'language translator no login'],
  },
  social: {
    title: 'Free AI Social Media Post Generator - Create Viral Content',
    description: 'Generate platform-ready social media posts with emojis and hashtags. Free AI social media content creator.',
    keywords: ['social media post generator', 'AI caption writer', 'viral content creator', 'Instagram caption generator free'],
  },
  resume: {
    title: 'Free AI Resume Builder - Professional Resume Assistant',
    description: 'Build and improve your resume sections with our free AI resume assistant. ATS-ready formatting and suggestions.',
    keywords: ['AI resume builder free', 'resume assistant no login', 'ATS resume checker', 'professional resume tools'],
  },
  story: {
    title: 'Free AI Story Writer - Creative Fiction & Plot Generator',
    description: 'Unleash your creativity with our free AI story writer. Generate plots, characters, and full stories instantly.',
    keywords: ['AI story generator', 'creative writing assistant', 'plot generator free', 'fiction writer AI'],
  },
  tts: {
    title: 'Free AI Text to Speech - High Quality Natural Voices',
    description: 'Convert any text into natural-sounding speech with our free AI text to speech tool. Downloadable HD audio.',
    keywords: ['AI text to speech free', 'natural voice generator', 'TTS online no login', 'text to audio converter'],
  }
};

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
          <Image 
            src={tool.image} 
            alt={tool.label}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
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
  const [isEquationEditorOpen, setIsEquationEditorOpen] = useState(false);
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
      // Update metadata dynamically for client-side navigation
      const meta = toolMeta[selectedTool];
      if (meta) {
        document.title = `${meta.title} | Ahsan AI Hub`;
        
        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', meta.description);

        // Update Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', meta.keywords.join(', '));
        
        // Update OG Description
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
          ogDesc.setAttribute('content', meta.description);
        }
        
        // Update OG Title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', meta.title);
        }
        
        // Update Twitter Description
        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) {
          twitterDesc.setAttribute('content', meta.description);
        }
      }
    } else {
      document.title = 'Free AI Content Tools - Best Writing, Coding & Study Hub | Ahsan AI Hub';
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

  const handleShare = async () => {
    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: true };
        const contacts = await (navigator as any).contacts.select(props, opts);
        
        if (contacts.length > 0) {
          const shareData = {
            title: 'Shared AI Content from Ahsan AI Hub',
            text: output,
            url: window.location.href,
          };
          
          if (navigator.share) {
            await navigator.share(shareData);
            toast({ title: 'Shared successfully!' });
          }
        }
      } else if (navigator.share) {
        await navigator.share({
          title: 'Shared AI Content from Ahsan AI Hub',
          text: output,
          url: window.location.href,
        });
        toast({ title: 'Shared successfully!' });
      } else {
        toast({ title: 'Share not supported', description: 'Your browser does not support sharing.' });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast({ variant: 'destructive', title: 'Share failed', description: 'Could not share content.' });
      }
    }
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
      <div className="p-4 border-b bg-background/80 sticky top-0 z-20 flex items-center justify-between shadow-sm backdrop-blur-xl border-primary/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedTool(null);
            setInput('');
            setOutput('');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all rounded-lg font-semibold px-3 py-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Studio
        </Button>

        <div className="flex-1 flex justify-center max-w-[280px] sm:max-w-md px-2">
          <Select
            value={selectedTool}
            onValueChange={(value) => {
              setSelectedTool(value as Tool);
              setInput('');
              setOutput('');
            }}
          >
            <SelectTrigger className="w-full h-10 bg-muted/30 border-primary/20 rounded-xl px-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:bg-muted/50 backdrop-blur-md shadow-sm group">
              <div className="flex items-center gap-2">
                <div className={cn('w-2 h-2 rounded-full', tool.color)} />
                <SelectValue placeholder="Switch Tool" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2 max-h-[70vh]">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Available Tools</p>
              </div>
              {toolsList.map((t) => (
                <SelectItem 
                  key={t.id} 
                  value={t.id} 
                  className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-3 transition-colors mb-1 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg text-white shadow-sm", t.color)}>
                      <t.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">{t.label}</span>
                      <span className="text-[10px] text-muted-foreground font-medium line-clamp-1 opacity-70">AI Powered</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                    <Image 
                      src={tool.image} 
                      alt={tool.label} 
                      fill
                      sizes="50vw"
                      priority={true}
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              {selectedTool === 'story' && (
                <div className="bg-muted/30 p-6 rounded-[2rem] border border-border/40 space-y-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <Lightbulb className="h-5 w-5" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Pro Tips for Best Input</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Feather className="h-3 w-3" /> Genre
                    </label>
                    <Select
                      value={options.storyGenre || 'fantasy'}
                      onValueChange={(value) => setOptions({ ...options, storyGenre: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Genre" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="fantasy" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">High Fantasy</SelectItem>
                        <SelectItem value="scifi" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Sci-Fi / Space</SelectItem>
                        <SelectItem value="mystery" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Mystery / Thriller</SelectItem>
                        <SelectItem value="horror" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Horror / Dark</SelectItem>
                        <SelectItem value="romance" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Romance / Drama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Length
                    </label>
                    <Select
                      value={options.storyLength || 'short'}
                      onValueChange={(value) => setOptions({ ...options, storyLength: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Length" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="short" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Short Story</SelectItem>
                        <SelectItem value="medium" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Detailed Scene</SelectItem>
                        <SelectItem value="long" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Chapter Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground font-medium italic">
                      Tip: Include character names, a specific setting, and a "conflict" in your description for a more engaging story.
                    </p>
                  </div>
                </div>
              )}
              {selectedTool === 'enhance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Enhancement Mode
                    </label>
                    <Select
                      value={options.enhanceMode || 'improve'}
                      onValueChange={(value) => setOptions({ ...options, enhanceMode: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="improve" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Improve Flow</SelectItem>
                        <SelectItem value="grammar" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Fix Grammar</SelectItem>
                        <SelectItem value="rewrite" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Professional Rewrite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Length
                    </label>
                    <Select
                      value={options.enhanceLength || 'original'}
                      onValueChange={(value) => setOptions({ ...options, enhanceLength: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Length" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="original" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Keep Original</SelectItem>
                        <SelectItem value="concise" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">More Concise</SelectItem>
                        <SelectItem value="detailed" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">More Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTool === 'email' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> Email Tone
                    </label>
                    <Select
                      value={options.emailTone || 'professional'}
                      onValueChange={(value) => setOptions({ ...options, emailTone: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="professional" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Professional</SelectItem>
                        <SelectItem value="formal" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Formal</SelectItem>
                        <SelectItem value="casual" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Casual</SelectItem>
                        <SelectItem value="friendly" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Friendly</SelectItem>
                        <SelectItem value="urgent" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Specific Details</label>
                    <input 
                      type="text"
                      placeholder="e.g. Include meeting time at 2PM"
                      value={options.emailDetails || ''}
                      onChange={(e) => setOptions({...options, emailDetails: e.target.value})}
                      className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary/60 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'blog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Article Length
                    </label>
                    <Select
                      value={options.blogLength || 'medium'}
                      onValueChange={(value) => setOptions({ ...options, blogLength: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Length" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="short" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Short (300 words)</SelectItem>
                        <SelectItem value="medium" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Medium (700 words)</SelectItem>
                        <SelectItem value="long" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Long (1200+ words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Target Audience</label>
                    <input 
                      type="text"
                      placeholder="e.g. Tech enthusiasts, Beginners"
                      value={options.blogAudience || ''}
                      onChange={(e) => setOptions({...options, blogAudience: e.target.value})}
                      className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary/60 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'translate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Languages className="h-3 w-3" /> Target Language
                    </label>
                    <Select
                      value={options.targetLanguage || 'Spanish'}
                      onValueChange={(value) => setOptions({ ...options, targetLanguage: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2 max-h-[40vh]">
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.name} className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Sparkles className="h-3 w-3" /> Tone
                    </label>
                    <Select
                      value={options.translateTone || 'neutral'}
                      onValueChange={(value) => setOptions({ ...options, translateTone: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Tone" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="neutral" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Neutral</SelectItem>
                        <SelectItem value="formal" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Formal</SelectItem>
                        <SelectItem value="casual" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Casual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTool === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Share2 className="h-3 w-3" /> Platform
                    </label>
                    <Select
                      value={options.socialPlatform || 'Twitter'}
                      onValueChange={(value) => setOptions({ ...options, socialPlatform: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="Twitter" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Twitter / X</SelectItem>
                        <SelectItem value="Instagram" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Instagram</SelectItem>
                        <SelectItem value="LinkedIn" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">LinkedIn</SelectItem>
                        <SelectItem value="Facebook" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Facebook</SelectItem>
                        <SelectItem value="TikTok" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">TikTok (Script)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Post Goal
                    </label>
                    <Select
                      value={options.socialGoal || 'engagement'}
                      onValueChange={(value) => setOptions({ ...options, socialGoal: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Goal" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="engagement" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Engagement</SelectItem>
                        <SelectItem value="informational" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Informational</SelectItem>
                        <SelectItem value="promotional" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Promotional</SelectItem>
                        <SelectItem value="humorous" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTool === 'resume' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Resume Section
                    </label>
                    <Select
                      value={options.resumeSection || 'summary'}
                      onValueChange={(value) => setOptions({ ...options, resumeSection: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="summary" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Professional Summary</SelectItem>
                        <SelectItem value="experience" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Work Experience</SelectItem>
                        <SelectItem value="skills" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Skills Optimization</SelectItem>
                        <SelectItem value="education" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary px-1">Target Role</label>
                    <input 
                      type="text"
                      placeholder="e.g. Senior Developer, Manager"
                      value={options.resumeRole || ''}
                      onChange={(e) => setOptions({...options, resumeRole: e.target.value})}
                      className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary/60 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'code' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Code className="h-3 w-3" /> Programming Language
                    </label>
                    <Select
                      value={options.codeLanguage || 'JavaScript'}
                      onValueChange={(value) => setOptions({ ...options, codeLanguage: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="JavaScript" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">JavaScript</SelectItem>
                        <SelectItem value="TypeScript" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">TypeScript</SelectItem>
                        <SelectItem value="Python" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Python</SelectItem>
                        <SelectItem value="Java" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Java</SelectItem>
                        <SelectItem value="C++" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">C++</SelectItem>
                        <SelectItem value="Go" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Go</SelectItem>
                        <SelectItem value="Rust" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Rust</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Analysis Mode
                    </label>
                    <Select
                      value={options.codeMode || 'explain'}
                      onValueChange={(value) => setOptions({ ...options, codeMode: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="explain" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Explain Logic</SelectItem>
                        <SelectItem value="optimize" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Optimize Performance</SelectItem>
                        <SelectItem value="debug" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Find Bugs</SelectItem>
                        <SelectItem value="security" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Security Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTool === 'study' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border/40">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <BookOpen className="h-3 w-3" /> Output Type
                    </label>
                    <Select
                      value={options.studyType || 'explanation'}
                      onValueChange={(value) => setOptions({ ...options, studyType: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="explanation" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Deep Explanation</SelectItem>
                        <SelectItem value="notes" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Concise Notes</SelectItem>
                        <SelectItem value="flashcards" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Flashcards (Q&A)</SelectItem>
                        <SelectItem value="quiz" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Multiple Choice Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-primary px-1 flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Difficulty
                    </label>
                    <Select
                      value={options.difficulty || 'intermediate'}
                      onValueChange={(value) => setOptions({ ...options, difficulty: value })}
                    >
                      <SelectTrigger className="w-full h-14 bg-background border-2 border-border/40 rounded-2xl px-5 font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all hover:border-primary/40 shadow-sm">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-primary/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-2">
                        <SelectItem value="beginner" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Beginner</SelectItem>
                        <SelectItem value="intermediate" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Intermediate</SelectItem>
                        <SelectItem value="advanced" className="rounded-xl focus:bg-primary/10 focus:text-primary p-3 transition-colors mb-1">Advanced / Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {selectedTool === 'math' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-muted/30 p-6 sm:p-8 rounded-[2rem] border border-border/40 backdrop-blur-xl shadow-2xl">
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
                            className="min-h-[120px] sm:min-h-[140px] bg-background/50 border-2 border-border/40 rounded-2xl p-4 sm:p-6 font-medium text-base sm:text-lg focus:border-rose-500/40 transition-all resize-none shadow-inner group-hover/input:bg-background/80"
                          />
                          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                            <BookOpen className="h-3 w-3" />
                            Narrative Input
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Collapsible open={isEquationEditorOpen} onOpenChange={setIsEquationEditorOpen}>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-rose-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative bg-muted/30 rounded-[2rem] border border-border/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-primary/5 transition-colors group/header">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                <Code className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex flex-col items-start gap-1">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-primary">Advanced Equation Editor</label>
                                <p className="text-[10px] text-muted-foreground font-medium">Click to expand • Add mathematical symbols & equations</p>
                              </div>
                            </div>
                            <ChevronDown className={cn(
                              "h-5 w-5 text-primary transition-transform duration-300",
                              isEquationEditorOpen && "rotate-180"
                            )} />
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-5 sm:px-6 pb-6 sm:pb-8 pt-2 border-t border-border/20 space-y-4">
                          <div className="relative group/equation">
                            <input 
                              type="text"
                              placeholder="Type equation (e.g., lim x->0 sin(x)/x or f(x) = x^2 + 2x + 1)"
                              className="w-full h-16 sm:h-20 bg-background/50 border-2 border-border/40 rounded-2xl px-5 sm:px-8 font-mono text-lg sm:text-2xl focus:border-primary/60 outline-none transition-all shadow-inner group-hover/equation:bg-background/80 placeholder:text-muted-foreground/30 text-primary text-sm sm:text-base"
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
                            <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
                              <div className="hidden md:flex flex-col items-end mr-1 sm:mr-2">
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-40">Press Enter</span>
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter opacity-40">To Commit</span>
                              </div>
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/equation:scale-110 transition-transform flex-shrink-0">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {[
                              'π', '√', '∫', 'd/dx', 'lim', 'Σ', '∞', 'log',
                              'sin', 'cos', 'tan', 'θ', 'Δ', 'λ', '≈', '≠',
                              '≤', '≥', '±', '→', '∂', '∇', '∩', '∪', 'μ', '^',
                              '!', 'ln', 'e', 'f(x)', 'α', 'β', 'γ', 'Ω',
                              '≡', '∝', '∠', '⊥', '||', '∈', '∉', '⊂', '⊃',
                              '∀', '∃', '∴', '∵', '⊕'
                            ].map((sym) => (
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
                                className="h-8 sm:h-10 rounded-lg text-xs sm:text-sm bg-background/40 border border-border/40 font-bold hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
                              >
                                {sym}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                            <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-foreground/80">Pro Tip: Quick Symbols</p>
                              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                Combine descriptions with equations. Each equation is added to your workbench.
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </Collapsible>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  className="h-12 sm:h-16 rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 hover:bg-primary/5 transition-all font-bold text-xs uppercase tracking-widest gap-2 sm:gap-3 shadow-sm hover:shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="hidden sm:inline">Upload File</span>
                  <span className="sm:hidden">Upload</span>
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
                    'h-12 sm:h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 sm:gap-3',
                    tool.color.replace('bg-', 'shadow-') + '/20'
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Solving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Generate Content</span>
                      <span className="sm:hidden">Solve</span>
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
                        onClick={handleShare}
                        className="rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 border-primary/20 gap-2 h-9"
                      >
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload('txt')}
                        className="rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 border-primary/20 gap-2 h-9"
                      >
                        <Download className="h-3.5 w-3.5" /> Export
                      </Button>
                    </div>
                  </div>

                  <Card className="border-2 border-primary/10 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl group">
                    <CardContent className="p-10">
                      {selectedTool === 'tts' && <TextToSpeech text={output} />}
                      <div className="prose prose-blue dark:prose-invert max-w-none text-foreground font-medium leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-strong:text-primary prose-code:text-rose-500 prose-pre:bg-black/50 prose-pre:rounded-3xl prose-pre:p-8 prose-pre:border prose-pre:border-primary/20">
                        <ReactMarkdown 
                          remarkPlugins={[(async () => (await remarkGfm).default) as any, (async () => (await remarkMath).default) as any]} 
                          rehypePlugins={[(async () => (await rehypeRaw).default) as any, (async () => (await rehypeKatex).default) as any]}
                        >
                          {output}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
