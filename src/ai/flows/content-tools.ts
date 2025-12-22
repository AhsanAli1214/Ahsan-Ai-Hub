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
  async (input) => {
    const prompt = `You are a text enhancement AI. The user wants to ${input.mode} the following text. Please provide the result.

Text:
"""
{{{text}}}
"""

Result:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: { text: input.text },
    });
    return { result: output.text! };
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
  async (input) => {
    const prompt = `You are an email writing assistant. Write an email with the following requirements:
- Purpose/Context: {{{context}}}
- Tone: {{{tone}}}
{{#if details}}- Additional Details: {{{details}}}{{/if}}

Generated Email:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: input,
    });
    return { result: output.text! };
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
  async (input) => {
    const prompt = `You are a blog post generator. Write a {{length}} blog post about the following topic: "{{topic}}". Ensure it is well-structured and engaging.

Blog Post:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: input,
    });
    return { result: output.text! };
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
  async (input) => {
    const prompt = `You are a study assistant. Generate study material for the topic "{{topic}}". The desired format is "{{type}}".

Study Material:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: input,
    });
    return { result: output.text! };
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
  async (input) => {
    const prompt = `You are a code explainer. Explain the following{{#if language}} {{language}}{{/if}} code snippet.

Code:
\`\`\`
{{{code}}}
\`\`\`

Explanation:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: input,
    });
    return { result: output.text! };
  }
);


// Math Solver
const SolveMathInputSchema = z.object({
    problem: z.string().describe("The math problem to solve."),
});
export type SolveMathInput = z.infer<typeof SolveMathInputSchema>;

const SolveMathOutputSchema = z.object({
    result: z.string().describe("The solution and explanation for the math problem."),
});
export type SolveMathOutput = z_infer<typeof SolveMathOutputSchema>;

export async function solveMath(input: SolveMathInput): Promise<SolveMathOutput> {
    return solveMathFlow(input);
}

const solveMathFlow = ai.defineFlow(
  {
    name: 'solveMathFlow',
    inputSchema: SolveMathInputSchema,
    outputSchema: SolveMathOutputSchema,
  },
  async (input) => {
    const prompt = `You are a math solver. Solve the following problem and provide a step-by-step explanation.

Problem: {{{problem}}}

Solution:`;

    const { output } = await ai.generate({
      prompt: prompt,
      input: input,
    });
    return { result: output.text! };
  }
);
