'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    image: '/tool-icons/story_writer_tool_icon.png',
  },
];

function ToolCard({ tool, onSelect }: { tool: (typeof toolsList)[0]; onSelect: () => void }) {
  const IconComponent = tool.icon;
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-border bg-card'
      )}
    >
      {tool.image && (
        <div className="relative w-full h-32 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <img 
            src={tool.image} 
            alt={tool.label}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className={cn('absolute inset-0', tool.color, 'opacity-0 group-hover:opacity-10 transition-opacity')} />
        </div>
      )}
      <div className="p-5 flex flex-col h-full flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm', tool.color)}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-2 mb-4 flex-1">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{tool.label}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{tool.desc}</p>
        </div>
        <div className="mt-auto">
          <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground transition-all rounded-xl py-5 font-bold text-sm shadow-md" variant="default">
            Use Tool →
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

  const renderToolUI = () => {
    if (!selectedTool) {
      return (
        <div className="space-y-12 p-6 lg:p-14 max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">AI Studio</h2>
            <p className="text-muted-foreground text-xl font-medium">Select a specialized tool to enhance your workflow instantly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        <div className="p-4 border-b bg-background sticky top-0 z-20 flex items-center justify-between shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTool(null);
              setInput('');
              setOutput('');
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Studio
          </Button>
          <div className="flex items-center gap-3">
            <div className={cn('w-3 h-3 rounded-full shadow-sm', tool.color)} />
            <span className="font-black text-sm uppercase tracking-widest">{tool.label}</span>
          </div>
          <div className="w-24 md:block hidden" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 lg:p-12 space-y-10 pb-44 md:pb-28">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-primary font-bold text-lg">
                  <Sparkles className="h-6 w-6" />
                  <span>Your Input</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload Doc
                  <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.js,.ts,.py,.css,.html" onChange={handleFileUpload} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedTool === 'enhance' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Tone & Mode</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold appearance-none"
                        value={options.enhanceMode}
                        onChange={(e) => setOptions({ ...options, enhanceMode: e.target.value })}
                      >
                        <option value="improve">🚀 General Improvement</option>
                        <option value="academic">🎓 Academic Perfection</option>
                        <option value="casual">👋 Friendly & Casual</option>
                        <option value="formal">👔 Formal Business</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Focus Area</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold appearance-none"
                        value={options.enhanceFocus || 'all'}
                        onChange={(e) => setOptions({ ...options, enhanceFocus: e.target.value })}
                      >
                        <option value="all">✨ All (Grammar + Style)</option>
                        <option value="grammar">📝 Grammar Only</option>
                        <option value="style">🎨 Style Only</option>
                        <option value="clarity">💡 Clarity & Conciseness</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'email' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Email Tone</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.emailTone}
                        onChange={(e) => setOptions({ ...options, emailTone: e.target.value })}
                      >
                        <option value="professional">💼 Professional</option>
                        <option value="casual">👋 Casual & Friendly</option>
                        <option value="formal">👔 Formal & Respectful</option>
                        <option value="persuasive">🎯 Persuasive</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Email Type</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.emailType || 'general'}
                        onChange={(e) => setOptions({ ...options, emailType: e.target.value })}
                      >
                        <option value="general">📧 General</option>
                        <option value="request">❓ Request</option>
                        <option value="complaint">⚠️ Complaint</option>
                        <option value="followup">↩️ Follow-up</option>
                        <option value="invitation">🎉 Invitation</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'blog' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Target Length</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.blogLength}
                        onChange={(e) => setOptions({ ...options, blogLength: e.target.value })}
                      >
                        <option value="short">📱 Short (Snippet)</option>
                        <option value="medium">📄 Medium (Standard)</option>
                        <option value="long">📚 Long (Full Article)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Blog Style</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.blogStyle || 'informative'}
                        onChange={(e) => setOptions({ ...options, blogStyle: e.target.value })}
                      >
                        <option value="informative">ℹ️ Informative</option>
                        <option value="storytelling">📖 Storytelling</option>
                        <option value="tutorial">🎓 Tutorial</option>
                        <option value="opinion">💭 Opinion/Essay</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'study' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Study Type</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.studyType}
                        onChange={(e) => setOptions({ ...options, studyType: e.target.value })}
                      >
                        <option value="explanation">📚 Explanation</option>
                        <option value="summary">📋 Summary</option>
                        <option value="qa">❓ Q&A Format</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Education Level</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.educationLevel || 'high-school'}
                        onChange={(e) => setOptions({ ...options, educationLevel: e.target.value })}
                      >
                        <option value="middle-school">🎒 Middle School</option>
                        <option value="high-school">📖 High School</option>
                        <option value="college">🎓 College/University</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'code' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Programming Language</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.codeLanguage}
                        onChange={(e) => setOptions({ ...options, codeLanguage: e.target.value })}
                      >
                        <option value="JavaScript">💛 JavaScript</option>
                        <option value="Python">🐍 Python</option>
                        <option value="Java">☕ Java</option>
                        <option value="C++">⚙️ C++</option>
                        <option value="TypeScript">📘 TypeScript</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Focus</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.codeFocus || 'explanation'}
                        onChange={(e) => setOptions({ ...options, codeFocus: e.target.value })}
                      >
                        <option value="explanation">📝 Explanation</option>
                        <option value="bugs">🐛 Find Bugs</option>
                        <option value="optimize">⚡ Optimization</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'resume' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Resume Section</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.resumeSection}
                        onChange={(e) => setOptions({ ...options, resumeSection: e.target.value })}
                      >
                        <option value="summary">👤 Professional Summary</option>
                        <option value="experience">💼 Work Experience</option>
                        <option value="skills">🛠️ Skills</option>
                        <option value="achievement">🏆 Achievements</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Job Level</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.jobLevel || 'mid'}
                        onChange={(e) => setOptions({ ...options, jobLevel: e.target.value })}
                      >
                        <option value="entry">🌱 Entry Level</option>
                        <option value="mid">📈 Mid Level</option>
                        <option value="senior">👑 Senior</option>
                        <option value="executive">🎯 Executive</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'story' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Story Genre</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.storyGenre || 'adventure'}
                        onChange={(e) => setOptions({ ...options, storyGenre: e.target.value })}
                      >
                        <option value="adventure">🗺️ Adventure</option>
                        <option value="fantasy">🐉 Fantasy</option>
                        <option value="mystery">🔍 Mystery</option>
                        <option value="romance">💕 Romance</option>
                        <option value="scifi">🚀 Science Fiction</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Story Length</label>
                      <select
                        className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                        value={options.storyLength || 'short'}
                        onChange={(e) => setOptions({ ...options, storyLength: e.target.value })}
                      >
                        <option value="short">📱 Short Story</option>
                        <option value="medium">📖 Novella</option>
                        <option value="long">📚 Novel Chapter</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTool === 'translate' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Target Language</label>
                    <select
                      className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
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

                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground uppercase ml-1 tracking-wider">Difficulty Level</label>
                  <select
                    className="w-full h-12 px-4 rounded-2xl border-2 border-border bg-card shadow-sm focus:border-primary outline-none transition-all font-bold"
                    value={options.difficulty}
                    onChange={(e) => setOptions({ ...options, difficulty: e.target.value })}
                  >
                    <option value="beginner">🟢 Beginner / Simple</option>
                    <option value="intermediate">🟡 Intermediate / Standard</option>
                    <option value="expert">🔴 Expert / Complex</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tool.placeholder}
                  className="min-h-[250px] p-8 rounded-[2rem] border-2 border-border hover:border-primary/50 focus-visible:border-primary transition-all text-lg bg-card shadow-inner-lg resize-none leading-relaxed font-medium"
                />
                <div className="absolute bottom-6 right-8 text-xs font-black text-muted-foreground/60 bg-muted/50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {input.length} Characters
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/50 p-5 rounded-3xl border-2 border-border/50">
                  <Lightbulb className="h-6 w-6 text-yellow-500 shrink-0" />
                  <span className="font-semibold"><strong>Pro Tip:</strong> {tool.tip}</span>
                </div>
                
                <Button onClick={handleProcess} disabled={loading} className="h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto md:px-8">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {(output || loading) && (
              <div ref={scrollRef} className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-primary/5 rounded-[2.5rem] blur-xl group-hover:bg-primary/10 transition-all duration-500" />
                  <Card className="relative border-2 border-border overflow-hidden shadow-2xl bg-white/90 dark:bg-card/90 backdrop-blur-2xl rounded-[2rem]">
                    <div className="px-8 py-5 border-b bg-muted/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {loading ? <div className="h-3 w-3 bg-primary rounded-full animate-pulse shadow-sm shadow-primary/50" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{loading ? 'Processing...' : 'Output Ready'}</span>
                      </div>
                      {!loading && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={handleCopy}>
                            {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all" onClick={() => handleDownload('txt')}>
                            <Download className="h-5 w-5" />
                          </Button>
                          <TextToSpeech text={output} />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8 md:p-14">
                      {loading ? (
                        <div className="space-y-6 py-12">
                          <div className="h-5 w-3/4 bg-muted rounded-full animate-pulse" />
                          <div className="h-5 w-full bg-muted rounded-full animate-pulse" />
                          <div className="h-5 w-5/6 bg-muted rounded-full animate-pulse" />
                          <div className="flex justify-center mt-12">
                            <p className="text-sm font-black text-muted-foreground uppercase tracking-widest animate-bounce">Generating excellence...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                          <textarea
                            className="w-full min-h-[400px] bg-transparent border-0 focus:ring-0 p-0 resize-none font-medium leading-relaxed text-foreground scrollbar-hide"
                            value={output}
                            onChange={(e) => setOutput(e.target.value)}
                            placeholder="Generated content appears here..."
                          />
                          <div className="mt-10 pt-10 border-t border-border/50">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-8">Preview Mode</h4>
                            <div className="bg-muted/30 p-8 rounded-3xl border-2 border-border/40">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                  p: ({ node, ...props }) => <p className="mb-6 leading-relaxed font-medium" {...props} />,
                                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-3 font-medium" {...props} />,
                                  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-3 font-medium" {...props} />,
                                  h1: ({ node, ...props }) => <h1 className="text-3xl font-black tracking-tight mb-8 mt-4" {...props} />,
                                  h2: ({ node, ...props }) => <h2 className="text-2xl font-black tracking-tight mb-6 mt-4" {...props} />,
                                  pre: ({ node, ...props }) => <pre className="bg-slate-900 text-slate-100 p-8 rounded-[1.5rem] overflow-x-auto my-8 shadow-xl border-2 border-white/5" {...props} />,
                                  code: ({ node, inline, children, ...props }: any) =>
                                    inline ? (
                                      <code className="px-2 py-1 bg-primary/10 text-primary rounded-lg font-bold text-sm" {...props}>{children}</code>
                                    ) : (
                                      <code className="text-sm font-mono" {...props}>{children}</code>
                                    ),
                                }}
                              >
                                {output}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <AppHeader title="AI Studio" />
      <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-background">
        {renderToolUI()}
      </main>
      
    </div>
  );
}
