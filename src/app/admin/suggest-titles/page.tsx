'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { suggestArticleTitles } from '@/ai/flows/suggest-article-titles';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  currentTitle: z.string().min(5, '현재 제목은 5자 이상이어야 합니다.'),
  articleContent: z.string().min(50, '기사 내용은 최소 50자 이상이어야 합니다.'),
});

type FormValues = z.infer<typeof formSchema>;
type SuggestionOutput = {
    suggestedTitles: string[];
};

export default function SuggestTitlesPage() {
  const [suggestions, setSuggestions] = useState<SuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentTitle: '',
      articleContent: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSuggestions(null);
    setError(null);
    try {
      const result = await suggestArticleTitles(data);
      setSuggestions(result);
    } catch (err) {
      setError('제목을 제안하는 동안 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
          AI 제목 제안 도구
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          기사 내용과 현재 제목을 입력하면, AI가 조회수를 높일 수 있는 매력적인 대안 제목들을 제안해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Wand2 className="w-6 h-6 text-primary" />
              <span>콘텐츠 입력</span>
            </CardTitle>
            <CardDescription>
              아래 폼을 작성하고 AI의 마법을 경험해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="currentTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>현재 제목</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 전 세계 기본소득 실험 결과 분석" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="articleContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>기사 내용</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="여기에 기사 본문을 붙여넣으세요..."
                          className="min-h-[250px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      제안 생성 중...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      매력적인 제목 제안받기
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
                <Lightbulb className="w-6 h-6 text-primary" />
                <span>AI 제안 결과</span>
            </CardTitle>
            <CardDescription>
              AI가 생성한 대안 제목들입니다. 현재 제목과 비교해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-center">
            {isLoading && (
              <div className="text-center text-muted-foreground space-y-2">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p>AI가 열심히 제목을 구상하고 있습니다...</p>
              </div>
            )}
            {error && <p className="text-destructive text-center">{error}</p>}
            
            {!isLoading && !suggestions && !error && (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <p>결과가 여기에 표시됩니다.</p>
                </div>
            )}

            {suggestions && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">현재 제목</h3>
                        <p className="p-3 bg-secondary rounded-md font-medium">{form.getValues('currentTitle')}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI 추천 제목</h3>
                        <ul className="space-y-2">
                            {suggestions.suggestedTitles.map((title, index) => (
                                <li key={index} className="p-3 bg-primary/10 rounded-md text-primary-foreground font-semibold text-foreground border-l-4 border-primary">
                                    {title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
