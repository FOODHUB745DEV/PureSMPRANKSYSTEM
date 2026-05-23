
'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate engaging sales slogans and announcements for a Minecraft server rank.
 *
 * - generateRankSlogans - A function that generates sales slogans for a Minecraft rank.
 * - GenerateRankSlogansInput - The input type for the generateRankSlogans function.
 * - GenerateRankSlogansOutput - The return type for the generateRankSlogans function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRankSlogansInputSchema = z.object({
  rankName: z.string().default('Pure').describe('The name of the Minecraft server rank.'),
  price: z.string().default('3000 Robux').describe('The price of the rank.'),
  benefits: z.string().describe('A detailed description of the in-game benefits and perks of the rank.'),
  targetAudience: z.string().default('Minecraft players looking for an enhanced experience and exclusive perks.').describe('The primary audience for the slogans.'),
  styleTone: z.string().default('epic, persuasive, and engaging').describe('The desired style and tone for the slogans (e.g., epic, funny, direct).'),
  numSlogans: z.number().int().min(1).max(10).default(3).describe('The number of slogans to generate.'),
});
export type GenerateRankSlogansInput = z.infer<typeof GenerateRankSlogansInputSchema>;

const GenerateRankSlogansOutputSchema = z.object({
  slogans: z.array(z.string()).describe('A list of generated sales slogans for the rank.'),
});
export type GenerateRankSlogansOutput = z.infer<typeof GenerateRankSlogansOutputSchema>;

export async function generateRankSlogans(input: GenerateRankSlogansInput): Promise<GenerateRankSlogansOutput> {
  return generateRankSlogansFlow(input);
}

const generateRankSlogansPrompt = ai.definePrompt({
  name: 'generateRankSlogansPrompt',
  input: { schema: GenerateRankSlogansInputSchema },
  output: { schema: GenerateRankSlogansOutputSchema },
  prompt: `You are a highly creative marketing expert specializing in crafting engaging and epic sales slogans for Minecraft server ranks. Your task is to generate compelling slogans for the "{{rankName}}" rank, designed to attract "{{targetAudience}}".

The rank is named "{{rankName}}" and costs {{price}}.
Key benefits include: {{{benefits}}}

Please generate {{numSlogans}} unique, {{styleTone}} slogans. Each slogan should be short, memorable, and highlight the value and excitement of acquiring the "{{rankName}}" rank.

Ensure the output is a JSON array of strings, as defined by the output schema.`,
});

const generateRankSlogansFlow = ai.defineFlow(
  {
    name: 'generateRankSlogansFlow',
    inputSchema: GenerateRankSlogansInputSchema,
    outputSchema: GenerateRankSlogansOutputSchema,
  },
  async (input) => {
    const { output } = await generateRankSlogansPrompt(input);
    if (!output) {
      throw new Error('Failed to generate slogans.');
    }
    return output;
  }
);
