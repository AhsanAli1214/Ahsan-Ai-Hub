'use server';

import {
  getPersonalizedToolRecommendations,
  type PersonalizedToolRecommendationsInput,
  type PersonalizedToolRecommendationsOutput,
} from '@/ai/flows/personalized-tool-recommendations';
import {
  enhanceText,
  generateEmail,
  generateBlogPost,
  generateStudyMaterial,
  explainProgramming,
  solveMath,
  translateText,
  generateSocialMediaPost,
  assistResume,
  generateStory,
  type EnhanceTextInput,
  type GenerateEmailInput,
  type GenerateBlogPostInput,
  type GenerateStudyMaterialInput,
  type ExplainProgrammingInput,
  type SolveMathInput,
  type TranslateTextInput,
  type GenerateSocialMediaPostInput,
  type AssistResumeInput,
  type GenerateStoryInput,
} from '@/ai/flows/content-tools';
import { textToSpeech, type TextToSpeechInput } from '@/ai/flows/tts';

// Personalized Recommendations Action
type RecommendationsActionResult =
  | { success: true; data: PersonalizedToolRecommendationsOutput }
  | { success: false; error: string };

export async function getRecommendationsAction(
  input: PersonalizedToolRecommendationsInput
): Promise<RecommendationsActionResult> {
  try {
    const recommendations = await getPersonalizedToolRecommendations(input);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error('Error getting recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

// Content Tools Actions
type ContentToolResult = { success: true; data: string } | { success: false; error: string };

export async function enhanceTextAction(input: EnhanceTextInput): Promise<ContentToolResult> {
  try {
    const { result } = await enhanceText(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error enhancing text:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to enhance text. Please check your input and try again.';
    return { success: false, error: errorMsg };
  }
}

export async function generateEmailAction(input: GenerateEmailInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateEmail(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating email:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate email. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function generateBlogPostAction(input: GenerateBlogPostInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateBlogPost(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating blog post:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate blog post. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function generateStudyMaterialAction(input: GenerateStudyMaterialInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateStudyMaterial(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating study material:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate study material. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function explainProgrammingAction(input: ExplainProgrammingInput): Promise<ContentToolResult> {
  try {
    const { result } = await explainProgramming(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error explaining code:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to explain code. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function solveMathAction(input: SolveMathInput): Promise<ContentToolResult> {
  try {
    const { result } = await solveMath(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error solving math problem:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to solve math problem. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function translateTextAction(input: TranslateTextInput): Promise<{ success: true, data: string } | { success: false, error: string }> {
  try {
    const { translatedText } = await translateText(input);
    return { success: true, data: translatedText };
  } catch (error) {
    console.error('Error translating text:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to translate text. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function generateSocialMediaPostAction(input: GenerateSocialMediaPostInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateSocialMediaPost(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating social media post:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate social media post. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function assistResumeAction(input: AssistResumeInput): Promise<ContentToolResult> {
  try {
    const { result } = await assistResume(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error assisting with resume:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to assist with resume. Please try again.';
    return { success: false, error: errorMsg };
  }
}

export async function generateStoryAction(input: GenerateStoryInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateStory(input);
    return { success: true, data: result };
  } catch (error) {
        console.error('Error generating story:', error);
        return { success: false, error: 'Failed to generate story.' };
    }
}

// Text-to-Speech Action
type TextToSpeechResult = { success: true; data: string } | { success: false; error: string };

export async function textToSpeechAction(input: TextToSpeechInput): Promise<TextToSpeechResult> {
  try {
    const { audio } = await textToSpeech(input);
    return { success: true, data: audio };
  } catch (error) {
    console.error('Error in textToSpeechAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during text-to-speech conversion.';
    return { success: false, error: errorMessage };
  }
}
