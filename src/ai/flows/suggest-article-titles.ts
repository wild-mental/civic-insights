'use server';

/**
 * @fileOverview A flow for generating alternative article titles to improve viewership.
 *
 * - suggestArticleTitles - A function that suggests alternative article titles.
 * - SuggestArticleTitlesInput - The input type for the suggestArticleTitles function.
 * - SuggestArticleTitlesOutput - The return type for the suggestArticleTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestArticleTitlesInputSchema = z.object({
  articleContent: z.string().describe('The content of the article to generate titles for.'),
  currentTitle: z.string().describe('The current title of the article.'),
});
export type SuggestArticleTitlesInput = z.infer<typeof SuggestArticleTitlesInputSchema>;

const SuggestArticleTitlesOutputSchema = z.object({
  suggestedTitles: z.array(z.string()).describe('An array of suggested article titles.'),
});
export type SuggestArticleTitlesOutput = z.infer<typeof SuggestArticleTitlesOutputSchema>;

export async function suggestArticleTitles(input: SuggestArticleTitlesInput): Promise<SuggestArticleTitlesOutput> {
  return suggestArticleTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestArticleTitlesPrompt',
  input: {schema: SuggestArticleTitlesInputSchema},
  output: {schema: SuggestArticleTitlesOutputSchema},
  prompt: `You are an expert at writing engaging titles for articles.

  Given the following article content and current title, generate 5 alternative titles that are more engaging and likely to improve viewership.

  Article Content:
  {{articleContent}}

  Current Title:
  {{currentTitle}}

  Suggested Titles:`, 
});

const suggestArticleTitlesFlow = ai.defineFlow(
  {
    name: 'suggestArticleTitlesFlow',
    inputSchema: SuggestArticleTitlesInputSchema,
    outputSchema: SuggestArticleTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
