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

Return only the resulting text.

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
    tone: z.enum(['professional', 'casual', 'formal']).describe("The tone of the email."),
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
      prompt: `You are an expert email writing assistant. Write a complete email based on the following requirements. The email should include a subject line and a body.

- Purpose/Context: ${context}
- Tone: ${tone}
${details ? `- Additional Details to include: ${details}` : ''}

Format the output clearly, starting with "Subject:".

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
    length: z.enum(['short', 'medium', 'long']).describe("The desired length of the blog post."),
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
  async ({ topic, length }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an expert blog post generator. Write a well-structured, engaging, and SEO-friendly blog post.

Topic: "${topic}"
Length: ${length} (short: ~300 words, medium: ~700 words, long: ~1200 words)

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
    type: z.enum(['explanation', 'notes', 'flashcards']).describe("The type of study material to generate."),
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
  async ({ topic, type }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a helpful study assistant. Generate study material for the given topic and format.

Topic: "${topic}"
Format: "${type}"

- If 'explanation', provide a clear and comprehensive explanation of the topic.
- If 'notes', create structured, bulleted notes summarizing the key points.
- If 'flashcards', generate a list of questions and answers in the format "Q: [Question]\nA: [Answer]".

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
    language: z.string().optional().describe("The programming language of the code."),
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
  async ({ code, language }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are an expert code explainer. Provide a clear, line-by-line explanation of the following ${language || ''} code snippet. Explain the purpose, logic, and what each part of the code does.

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Explanation:`,
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
      const basePrompt = `You are an elite Mathematical AI Expert specializing in solving complex mathematical problems with absolute precision.

CRITICAL INSTRUCTIONS:
1. Analyze the math problem carefully - identify every mathematical symbol, especially powers (e.g., x², 2^n), subscripts, fractions, and nested brackets.
2. Provide a complete STEP-BY-STEP solution where each step is numbered and clearly explained.
3. Use proper mathematical notation and LaTeX formatting where applicable (e.g., $x^2$ for squares, $\\sqrt{x}$ for roots).
4. Show all intermediate steps and reasoning.
5. If there are multiple parts, solve each one separately.
6. Always verify your final answer before presenting it.
7. Include any relevant mathematical formulas or theorems used.

${problem ? `Problem: ${problem}` : 'Solve the math problem shown in the image.'}

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
  targetLanguage: z.string().describe('The target language to translate to.'),
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
  async ({ text, targetLanguage }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `Translate the following text to ${targetLanguage}. Return ONLY the translated text.
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
  platform: z.enum(['Twitter', 'Instagram', 'LinkedIn']).describe("The social media platform."),
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
  async ({ topic, platform }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a social media marketing expert. Create a compelling post for ${platform}.

Topic/Message: "${topic}"

- For Twitter, be concise and use relevant hashtags.
- For Instagram, write an engaging caption and suggest relevant hashtags.
- For LinkedIn, be professional and focus on industry insights or career advice.

Format the output as a complete post, including hashtags.

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
  section: z.enum(['summary', 'experience', 'skills']).describe("The resume section to work on."),
  details: z.string().describe("User-provided details like job history, skills, or career goals."),
});
export type AssistResumeInput = z.infer<typeof AssistResumeInputSchema>;

const AssistResumeOutputSchema = z.object({
  result: z.string().describe("The generated or improved resume content."),
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
  async ({ section, details }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a professional resume writer and career coach. Help the user with their resume.

Section: ${section}
User's Details:
"""
${details}
"""

- If 'summary', write a compelling professional summary (3-4 sentences).
- If 'experience', rewrite the provided job description using action verbs and quantifiable achievements.
- If 'skills', organize the listed skills into relevant categories.

Provide only the generated content for the specified section.

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
  prompt: z.string().describe("The user's story prompt or idea."),
  genre: z.string().optional().describe("The genre of the story (e.g., fantasy, sci-fi, mystery)."),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  result: z.string().describe("The generated story or story part."),
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
      prompt: `You are a creative writer. Write a short story based on the user's prompt.

Genre: ${genre || 'any'}
Prompt: "${prompt}"

Begin the story. Make it engaging and imaginative.

Story:`,
      output: {
        schema: z.object({ result: z.string() })
      }
    });
    return output ?? { result: '' };
  }
);
