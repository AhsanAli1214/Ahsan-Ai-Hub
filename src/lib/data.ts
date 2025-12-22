import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export type ToolCategory =
  | 'Content Creation'
  | 'Image Generation'
  | 'Productivity'
  | 'Development';

export type AiTool = {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  longDescription: string;
  usage: string;
  link: string;
  imageId: string;
};

export const tools: AiTool[] = [
  {
    id: '1',
    slug: 'writer-ai',
    name: 'Writer AI',
    category: 'Content Creation',
    description: 'Generate high-quality written content for any purpose.',
    longDescription:
      'Writer AI is a powerful content generation tool that can create articles, blog posts, marketing copy, and more. It uses advanced language models to produce human-like text that is both engaging and informative. Whether you need to draft an email or write a novel, Writer AI has you covered.',
    usage:
      'Simply provide a topic or prompt, and Writer AI will generate the content for you. You can then edit and refine the text to meet your specific needs.',
    link: '/content-tools',
    imageId: 'tool-writer-ai',
  },
  {
    id: '2',
    slug: 'artisan-ai',
    name: 'Artisan AI',
    category: 'Image Generation',
    description: 'Create stunning and unique images from text prompts.',
    longDescription:
      'Artisan AI is a state-of-the-art image generation tool that can turn your ideas into beautiful visuals. Describe the image you want to create, and Artisan AI will generate a unique piece of art for you. It\'s perfect for artists, designers, and anyone who wants to bring their creative visions to life.',
    usage:
      'Enter a detailed description of the image you want to create. Artisan AI will then generate a selection of images for you to choose from.',
    link: '/content-tools',
    imageId: 'tool-artisan-ai',
  },
  {
    id: '3',
    slug: 'code-buddy',
    name: 'Code Buddy',
    category: 'Development',
    description: 'Your AI partner for writing and debugging code.',
    longDescription:
      'Code Buddy is an AI-powered coding assistant that can help you write better code, faster. It can provide code completions, identify and fix bugs, and even generate entire functions or classes based on your requirements. It supports a wide range of programming languages and frameworks.',
    usage:
      'Integrate Code Buddy with your favorite code editor. It will then provide real-time assistance as you write and debug your code.',
    link: '/content-tools',
    imageId: 'tool-code-buddy',
  },
  {
    id: '4',
    slug: 'taskmaster',
    name: 'TaskMaster',
    category: 'Productivity',
    description: 'Organize your tasks and manage your projects with AI.',
    longDescription:
      'TaskMaster is an intelligent to-do list and project management tool that helps you stay organized and productive. It can automatically categorize your tasks, set priorities, and even suggest the best time to work on them. It\'s the ultimate tool for managing your personal and professional life.',
    usage:
      'Create a new project and start adding tasks. TaskMaster will then help you organize and prioritize them, ensuring you stay on top of your work.',
    link: '/content-tools',
    imageId: 'tool-taskmaster',
  },
  {
    id: '5',
    slug: 'story-weaver',
    name: 'StoryWeaver',
    category: 'Content Creation',
    description: 'Craft compelling narratives and stories with AI assistance.',
    longDescription:
      'StoryWeaver is an AI tool designed for writers and storytellers. It can help you brainstorm ideas, develop characters, and even write entire scenes or chapters. Whether you\'re writing a novel, a screenplay, or a short story, StoryWeaver can help you bring your vision to life.',
    usage:
      'Start a new story and use StoryWeaver\'s tools to help you develop your plot and characters. You can then use the AI to generate text and bring your story to life.',
    link: '/content-tools',
    imageId: 'tool-story-weaver',
  },
  {
    id: '6',
    slug: 'pixel-perfect',
    name: 'PixelPerfect',
    category: 'Image Generation',
    description: 'Enhance and upscale your images with AI.',
    longDescription:
      'PixelPerfect is an AI-powered image enhancement tool that can upscale low-resolution images, remove noise, and improve overall image quality. It\'s perfect for photographers, designers, and anyone who wants to improve the quality of their images.',
    usage:
      'Upload an image and select the enhancement options you want to apply. PixelPerfect will then process the image and provide you with a high-quality version.',
    link: '/content-tools',
    imageId: 'tool-pixel-perfect',
  },
];

export const getToolBySlug = (slug: string): AiTool | undefined => {
  return tools.find((tool) => tool.slug === slug);
};

export const getToolImage = (tool: AiTool): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === tool.imageId);
};
