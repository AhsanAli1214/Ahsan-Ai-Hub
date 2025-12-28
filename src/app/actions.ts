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
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: errorMessage };
  }
}

// Reduced overhead and streamlined for speed
export async function chatAction(message: string, history: any[] = []) {
  try {
    return await getRecommendationsAction({
      interests: message,
      previousActivity: 'No previous activity',
      personality: 'Professional',
      responseLength: 'medium'
    });
  } catch (error) {
    return { success: false, error: 'Chat optimization error' };
  }
}

// Content Tools Actions
type ContentToolResult = { success: true; data: string } | { success: false; error: string };

export async function enhanceTextAction(input: EnhanceTextInput): Promise<ContentToolResult> {
  try {
    const { result } = await enhanceText(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to enhance text.';
    return { success: false, error: errorMsg };
  }
}

export async function generateEmailAction(input: GenerateEmailInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateEmail(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate email.';
    return { success: false, error: errorMsg };
  }
}

export async function generateBlogPostAction(input: GenerateBlogPostInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateBlogPost(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate blog post.';
    return { success: false, error: errorMsg };
  }
}

export async function generateStudyMaterialAction(input: GenerateStudyMaterialInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateStudyMaterial(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate study material.';
    return { success: false, error: errorMsg };
  }
}

export async function explainProgrammingAction(input: ExplainProgrammingInput): Promise<ContentToolResult> {
  try {
    const { result } = await explainProgramming(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to explain code.';
    return { success: false, error: errorMsg };
  }
}

export async function solveMathAction(input: SolveMathInput): Promise<ContentToolResult> {
  try {
    const { result } = await solveMath(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to solve math problem.';
    return { success: false, error: errorMsg };
  }
}

export async function translateTextAction(input: TranslateTextInput): Promise<{ success: true, data: string } | { success: false, error: string }> {
  try {
    const { translatedText } = await translateText(input);
    return { success: true, data: translatedText };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to translate text.';
    return { success: false, error: errorMsg };
  }
}

export async function generateSocialMediaPostAction(input: GenerateSocialMediaPostInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateSocialMediaPost(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate social media post.';
    return { success: false, error: errorMsg };
  }
}

export async function assistResumeAction(input: AssistResumeInput): Promise<ContentToolResult> {
  try {
    const { result } = await assistResume(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to assist with resume.';
    return { success: false, error: errorMsg };
  }
}

export async function generateStoryAction(input: GenerateStoryInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateStory(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate story.';
    return { success: false, error: errorMsg };
  }
}

// Text-to-Speech Action
export async function textToSpeechAction(input: TextToSpeechInput): Promise<{ success: true; data: string } | { success: false; error: string }> {
  try {
    const { audio } = await textToSpeech(input);
    return { success: true, data: audio };
  } catch (error) {
    return { success: false, error: 'TTS conversion error' };
  }
}

// Error Reporting Action
export async function reportErrorAction(errorData: {
  errorMessage: string;
  feature: string;
  userAgent?: string;
  timestamp?: number;
}): Promise<{ success: boolean; message: string; mailtoLink?: string }> {
  try {
    const { errorMessage, feature, userAgent = 'Unknown', timestamp = Date.now() } = errorData;
    const subject = `[ERROR REPORT] ${feature} - ${new Date(timestamp).toLocaleString()}`;
    const body = `Feature: ${feature}\nError: ${errorMessage}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Ahsan AI Hub <onboarding@resend.dev>',
          to: 'tickets@ahsan-ai-hub.p.tawk.email',
          subject,
          text: body,
        }),
      });
    }
    return { success: true, message: 'Reported' };
  } catch (error) {
    return { success: true, message: 'Logged' };
  }
}
