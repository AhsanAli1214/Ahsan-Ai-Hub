'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecommendationsAction } from '@/app/actions';
import { Sparkles, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { tools } from '@/lib/data';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in a bit more detail.').max(500),
  previousActivity: z.string().min(10, 'Please describe your previous activity in a bit more detail.').max(500),
});

type FormValues = z.infer<typeof formSchema>;

export function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, favorites } = useAuth();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('initialPrompt');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: initialPrompt || '',
      previousActivity: '',
    },
  });

   useEffect(() => {
    if (initialPrompt) {
      form.setValue('interests', initialPrompt);
    }
  }, [initialPrompt, form]);

  useEffect(() => {
    if (user && favorites.length > 0 && form.getValues('previousActivity') === '') {
      const favoriteTools = tools.filter(t => favorites.includes(t.id));
      const favoriteToolNames = favoriteTools.map(t => t.name).join(', ');
      const activityText = `I have previously shown interest in tools like: ${favoriteToolNames}.`;
      form.setValue('previousActivity', activityText);
    }
  }, [user, favorites, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations(null);

    const result = await getRecommendationsAction(values);

    if (result.success && result.data) {
      setRecommendations(result.data.recommendations);
    } else {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: result.error || 'Unable to get recommendations. Please try again.',
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Personalized Recommendations</CardTitle>
          <CardDescription>
            Tell us about your interests and what you've been working on, and our AI will suggest some tools for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests or Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I'm interested in generative art, video creation, and automating my workflow."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormDescription>What kind of AI tools are you looking for? You can also enter a direct prompt.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Previous Activity</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I've been experimenting with image generators but find them too complex. I also tried a writing assistant."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>What have you tried or worked on recently? (This helps the AI)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Get Recommendations'}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Bot className="h-6 w-6" />
              <span>AI is thinking...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
          </CardContent>
        </Card>
      )}

      {recommendations && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Bot className="h-6 w-6" />
              <span>Here are your recommendations:</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p>{recommendations}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
