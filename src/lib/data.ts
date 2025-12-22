import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type React from 'react';

export type ToolCategory = 'Content Creation' | 'Image Generation' | 'Productivity' | 'Development';

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

export const getToolBySlug = (slug: string): AiTool | undefined => {
  return undefined;
};

export const getToolImage = (tool: AiTool): ImagePlaceholder | undefined => {
  return PlaceHolderImages.find((img) => img.id === tool.imageId);
};
