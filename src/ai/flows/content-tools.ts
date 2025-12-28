'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Text Enhancer
const EnhanceTextInputSchema = z.object({
  text: z.string().describe('The text to enhance.'),
  mode: z.enum(['grammar', 'improve', 'rewrite']).describe('The enhancement mode.'),
});
export type EnhanceTextInput = z.infer<typeof EnhanceTextInputSchema>;

const EnhanceTextOutputSchema = z.object({
  result: z.string().describe('The enhanced text.'),
});
export type EnhanceTextOutput = z.infer<typeof EnhanceTextOutputSchema>;

export async function enhanceText(input: EnhanceTextInput): Promise<EnhanceTextOutput> {
  return enhanceTextFlow(input);
}

const enhanceTextFlow = ai.defineFlow(
  {
    name: 'enhanceTextFlow',
    inputSchema: EnhanceTextInputSchema,
    outputSchema: EnhanceTextOutputSchema,
  },
  async ({ text, mode }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a text enhancement AI. Your task is to ${mode} the following text.
- If the mode is 'grammar', correct any grammatical errors, spelling mistakes, and punctuation.
- If the mode is 'improve', enhance the clarity, flow, and vocabulary of the text while preserving the original meaning.
- If the mode is 'rewrite', rewrite the entire text to make it sound more professional and compelling.

Return ONLY the resulting text.

Text:
"""
${text}
"""

Result:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });

    return output ?? { result: '' };
  }
);


// Email Writer
const GenerateEmailInputSchema = z.object({
    context: z.string().describe("The purpose or context of the email."),
    tone: z.string().describe("The tone of the email."),
    details: z.string().optional().describe("Any additional details to include."),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

const GenerateEmailOutputSchema = z.object({
    result: z.string().describe("The generated email content."),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;

export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
    return generateEmailFlow(input);
}

const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailInputSchema,
    outputSchema: GenerateEmailOutputSchema,
  },
  async ({ context, tone, details }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an expert email writing assistant. Write a complete email based on the following requirements. 

- Purpose/Context: ${context}
- Tone: ${tone}
${details ? `- Additional Details to include: ${details}` : ''}

The email must include:
1. A clear Subject Line starting with "Subject: ".
2. A professional body with appropriate formatting.

Generated Email:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);


// Blog Post Generator
const GenerateBlogPostInputSchema = z.object({
    topic: z.string().describe("The topic of the blog post."),
    length: z.string().describe("The desired length of the blog post."),
    audience: z.string().optional().describe("The target audience."),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
    result: z.string().describe("The generated blog post content."),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
    return generateBlogPostFlow(input);
}

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async ({ topic, length, audience }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an expert blog post generator. Write a well-structured, engaging, and SEO-friendly blog post.

Topic: "${topic}"
Length: ${length}
Target Audience: ${audience || 'General'}

The blog post should include:
1. A catchy and relevant title.
2. An introduction that hooks the reader.
3. A body with clear headings for different sections.
4. A concluding summary.

Format the output using Markdown.

Blog Post:`,
       output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);

// Study Assistant
const GenerateStudyMaterialInputSchema = z.object({
    topic: z.string().describe("The topic to generate study materials for."),
    type: z.string().describe("The type of study material to generate."),
    difficulty: z.string().optional().describe("The difficulty level."),
});
export type GenerateStudyMaterialInput = z.infer<typeof GenerateStudyMaterialInputSchema>;

const GenerateStudyMaterialOutputSchema = z.object({
    result: z.string().describe("The generated study material."),
});
export type GenerateStudyMaterialOutput = z.infer<typeof GenerateStudyMaterialOutputSchema>;

export async function generateStudyMaterial(input: GenerateStudyMaterialInput): Promise<GenerateStudyMaterialOutput> {
    return generateStudyMaterialFlow(input);
}

const generateStudyMaterialFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialFlow',
    inputSchema: GenerateStudyMaterialInputSchema,
    outputSchema: GenerateStudyMaterialOutputSchema,
  },
  async ({ topic, type, difficulty }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a helpful study assistant. Generate study material for the given topic.

Topic: "${topic}"
Format: "${type}"
Difficulty Level: "${difficulty || 'Intermediate'}"

- If 'explanation', provide a clear and comprehensive explanation.
- If 'notes', create structured, bulleted notes summarizing key points.
- If 'flashcards', generate a list of questions and answers (Q: [Question] \n A: [Answer]).
- If 'quiz', generate 5 multiple choice questions with answers at the end.

Study Material:`,
       output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);


// Code Explainer
const ExplainProgrammingInputSchema = z.object({
    code: z.string().describe("The code snippet to explain."),
    language: z.string().optional().describe("The programming language."),
    mode: z.string().optional().describe("The analysis mode (explain, optimize, debug, security)."),
});
export type ExplainProgrammingInput = z.infer<typeof ExplainProgrammingInputSchema>;

const ExplainProgrammingOutputSchema = z.object({
    result: z.string().describe("The explanation of the code."),
});
export type ExplainProgrammingOutput = z.infer<typeof ExplainProgrammingOutputSchema>;

export async function explainProgramming(input: ExplainProgrammingInput): Promise<ExplainProgrammingOutput> {
    return explainProgrammingFlow(input);
}

const explainProgrammingFlow = ai.defineFlow(
  {
    name: 'explainProgrammingFlow',
    inputSchema: ExplainProgrammingInputSchema,
    outputSchema: ExplainProgrammingOutputSchema,
  },
  async ({ code, language, mode }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an expert software engineer. Perform a ${mode || 'explanation'} on the following ${language || ''} code snippet.

Analysis Mode: ${mode || 'General Explanation'}

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Provide a clear, structured response. Use Markdown.

Result:`,
       output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);


// Math Solver
const SolveMathInputSchema = z.object({
    problem: z.string().optional().describe("The math problem to solve."),
    image: z.string().optional().describe("Base64 encoded image of the math problem."),
});
export type SolveMathInput = z.infer<typeof SolveMathInputSchema>;

const SolveMathOutputSchema = z.object({
    result: z.string().describe("The solution and explanation for the math problem."),
});
export type SolveMathOutput = z.infer<typeof SolveMathOutputSchema>;

export async function solveMath(input: SolveMathInput): Promise<SolveMathOutput> {
    return solveMathFlow(input);
}

const solveMathFlow = ai.defineFlow(
  {
    name: 'solveMathFlow',
    inputSchema: SolveMathInputSchema,
    outputSchema: SolveMathOutputSchema,
  },
  async ({ problem, image }) => {
    try {
      const basePrompt = `You are an elite Mathematical AI Expert. Solve the following problem with absolute precision.
      
CRITICAL INSTRUCTIONS:
1. Provide ONLY the mathematical solution and steps. 
2. NO conversational text, NO "Here is the solution", NO "I hope this helps".
3. Use proper LaTeX for EVERYTHING. 
   - Fractions: \\frac{num}{den}
   - Powers: x^{y}
   - Roots: \\sqrt{x}
   - Wrap all math in $ for inline and $$ for block.
4. If there are steps, number them 1, 2, 3.
5. End with "Final Answer: [result]" in bold.

Problem: ${problem || 'Solve the problem in the image.'}

SOLUTION:`;

      let promptArray: any;
      
      if (image && image.startsWith('data:image')) {
        // Handle base64 data URL format
        try {
          const base64Match = image.match(/data:image\/([^;]+);base64,(.+)/);
          if (base64Match) {
            const mimeType = `image/${base64Match[1]}`;
            const base64Data = base64Match[2];
            
            promptArray = [
              { text: basePrompt },
              { media: { data: base64Data, contentType: mimeType } }
            ];
          } else {
            // Fallback to text only if parsing fails
            promptArray = basePrompt;
          }
        } catch (err) {
          // Fallback to text only on error
          promptArray = basePrompt;
        }
      } else if (image) {
        // Direct base64 or already encoded format
        promptArray = [
          { text: basePrompt },
          { media: { data: image, contentType: 'image/jpeg' } }
        ];
      } else {
        promptArray = basePrompt;
      }

      const { output } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: promptArray,
        output: {
          schema: z.object({ result: z.string() })
        }
      });
      
      return output ?? { result: 'Unable to generate solution. Please try again.' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      if (errorMessage.includes('429')) {
        return { result: 'The AI service is currently busy. Please wait a moment and try again.' };
      }
      return { result: `Error solving math problem: ${errorMessage}. Please try again.` };
    }
  }
);


// Translator
const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language.'),
  tone: z.string().optional().describe('The tone of the translation.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async ({ text, targetLanguage, tone }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `Translate the following text to ${targetLanguage}. 

Tone: ${tone || 'Neutral'}

Return ONLY the translated text.

Text:
"""
${text}
"""
`,
      output: {
        schema: z.object({ translatedText: z.string() })
      }
    });

    return output ?? { translatedText: '' };
  }
);

// Social Media Post Generator
const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe("The topic or main message of the post."),
  platform: z.string().describe("The social media platform."),
  goal: z.string().optional().describe("The goal of the post."),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  result: z.string().describe("The generated social media post."),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async ({ topic, platform, goal }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a social media marketing expert. Create a compelling post for ${platform}.

Topic/Message: "${topic}"
Post Goal: ${goal || 'Engagement'}

Requirements:
- For Twitter, be concise and use hashtags.
- For Instagram, write an engaging caption and hashtags.
- For LinkedIn, be professional and insightful.
- For TikTok, write a short script or hook.

Format the output as a complete post.

Post:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);


// Resume Assistant
const AssistResumeInputSchema = z.object({
  section: z.string().describe("The resume section."),
  details: z.string().describe("User-provided details."),
  role: z.string().optional().describe("Target job role."),
});
export type AssistResumeInput = z.infer<typeof AssistResumeInputSchema>;

const AssistResumeOutputSchema = z.object({
  result: z.string().describe("The generated resume content."),
});
export type AssistResumeOutput = z.infer<typeof AssistResumeOutputSchema>;

export async function assistResume(input: AssistResumeInput): Promise<AssistResumeOutput> {
  return assistResumeFlow(input);
}

const assistResumeFlow = ai.defineFlow(
  {
    name: 'assistResumeFlow',
    inputSchema: AssistResumeInputSchema,
    outputSchema: AssistResumeOutputSchema,
  },
  async ({ section, details, role }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a professional resume writer. Help the user optimize their resume.

Section: ${section}
Target Role: ${role || 'General'}
User's Details:
"""
${details}
"""

Instructions:
- If 'summary', write a powerful professional summary (3-4 sentences).
- If 'experience', use action verbs and quantifiable results.
- If 'skills', categorize them professionally.

Provide only the generated content.

Result:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);


// Creative Story Writer
const GenerateStoryInputSchema = z.object({
  prompt: z.string().describe("The story idea."),
  genre: z.string().optional().describe("The genre."),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  result: z.string().describe("The story."),
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async ({ prompt, genre }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a creative writer. Write an engaging story.

Genre: ${genre || 'any'}
Prompt: "${prompt}"

Story:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);
