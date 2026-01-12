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
    console.error('AI Flow Error:', error);
    const errorMessage = error instanceof Error && error.message.includes('429')
      ? 'Our AI is currently very busy handling other requests. Please try again in a moment.'
      : 'I encountered an unexpected issue. Please click the report button below so I can fix it, or try again.';
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
    const errorMsg = error instanceof Error && error.message.includes('429')
      ? 'Our AI is receiving a lot of requests right now. Please wait a minute and try again.'
      : 'Failed to enhance text. Please try again or report the error.';
    return { success: false, error: errorMsg };
  }
}

export async function generateEmailAction(input: GenerateEmailInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateEmail(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error && error.message.includes('429')
      ? 'Our AI is receiving a lot of requests right now. Please wait a minute and try again.'
      : 'Failed to generate email. Please try again or report the error.';
    return { success: false, error: errorMsg };
  }
}

export async function generateBlogPostAction(input: GenerateBlogPostInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateBlogPost(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error && error.message.includes('429')
      ? 'Our AI is receiving a lot of requests right now. Please wait a minute and try again.'
      : 'Failed to generate blog post. Please try again or report the error.';
    return { success: false, error: errorMsg };
  }
}

export async function generateStudyMaterialAction(input: GenerateStudyMaterialInput): Promise<ContentToolResult> {
  try {
    const { result } = await generateStudyMaterial(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error && error.message.includes('429')
      ? 'Our AI is receiving a lot of requests right now. Please wait a minute and try again.'
      : 'Failed to generate study material. Please try again or report the error.';
    return { success: false, error: errorMsg };
  }
}

export async function explainProgrammingAction(input: ExplainProgrammingInput): Promise<ContentToolResult> {
  try {
    const { result } = await explainProgramming(input);
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error && error.message.includes('429')
      ? 'Our AI is receiving a lot of requests right now. Please wait a minute and try again.'
      : 'Failed to explain code. Please try again or report the error.';
    return { success: false, error: errorMsg };
  }
}

export async function solveMathAction(input: SolveMathInput): Promise<ContentToolResult> {
  try {
    if (!input.problem && !input.image) {
      return { success: false, error: 'Please provide either a math problem or upload an image.' };
    }
    
    const { result } = await solveMath(input);
    
    // Check if result is an error message
    if (result && (result.includes('Error') || result.includes('Unable to generate'))) {
      return { success: false, error: result };
    }
    
    return { success: true, data: result };
  } catch (error) {
    const errorMsg = error instanceof Error 
      ? error.message.includes('429') 
        ? 'The AI service is currently busy. Please wait a moment and try again.'
        : `Error: ${error.message}`
      : 'Failed to solve math problem. Please try again.';
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

// Text-to-Speech Action (Deprecated - use browser-native API)
export async function textToSpeechAction(input: any): Promise<{ success: true; data: string } | { success: false; error: string }> {
  return { success: false, error: 'AI-based TTS is disabled. Please use the browser-native speech feature.' };
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
      const reportHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #dc2626;">New AI Error Reported</h2>
          <p><strong>Feature:</strong> ${feature}</p>
          <p><strong>Error Message:</strong> ${errorMessage}</p>
          <p><strong>User Agent:</strong> ${userAgent}</p>
          <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
          <hr style="border: 1px solid #eee;" />
          <p style="font-size: 12px; color: #666;">Sent from Ahsan AI Hub Monitoring</p>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'Ahsan AI Hub <onboarding@resend.dev>',
          to: 'a67515346@gmail.com',
          subject: `[AI ERROR] ${feature} - ${errorMessage.substring(0, 50)}...`,
          html: reportHtml,
        }),
      });
    }
    return { success: true, message: 'Reported' };
  } catch (error) {
    return { success: true, message: 'Logged' };
  }
}
