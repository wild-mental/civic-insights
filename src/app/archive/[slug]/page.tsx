import { fetchArticleBySlug, fetchArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Paywall from '@/components/paywall';
import Link from 'next/link';
import { Calendar, User, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  // 백엔드 API에서 모든 기사를 가져와서 정적 경로 생성
  const articles = await fetchArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // 백엔드 API에서 특정 기사 가져오기
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const isPaid = article.type === 'paid';
  const paragraphs = article.content.split('\n\n');
  const previewContent = paragraphs.slice(0, 2).join('\n\n');
  const remainingContent = paragraphs.slice(2).join('\n\n');

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-8 md:mb-12 text-center">
        <div className="mb-4">
          <Link href="/archive">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
              {article.category === 'Civic Engagement' ? '시민참여' : 
               article.category === 'Megatrends' ? '메가트렌드' : 
               article.category === 'Basic Income' ? '기본소득' : article.category}
            </Badge>
          </Link>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-foreground leading-tight">
          {article.title}
        </h1>
        <div className="mt-6 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.publishDate}>{article.publishDate}</time>
          </div>
        </div>
      </header>

      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 md:mb-12 shadow-lg">
        <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
      </div>
      
      <div className="prose prose-lg max-w-none prose-p:font-body prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary">
        {isPaid ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: previewContent.replace(/\n/g, '<br />') }} />
            <Paywall>
              <div dangerouslySetInnerHTML={{ __html: remainingContent.replace(/\n/g, '<br />') }} />
            </Paywall>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
        )}
      </div>

      <Separator className="my-12" />
      
      {!isPaid && (
         <Card className="bg-secondary/70 text-center p-8">
            <CardContent className="p-0">
                <h3 className="font-headline text-2xl font-bold text-foreground mb-2">더 깊은 인사이트를 원하시나요?</h3>
                <p className="text-muted-foreground mb-6">유료 플랜에 가입하고 심층 분석 리포트와 전문가 인터뷰 전문을 확인해보세요.</p>
                <Link href="/subscribe">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">구독 플랜 자세히 보기</Button>
                </Link>
            </CardContent>
         </Card>
      )}

      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
        <span className="text-sm font-semibold text-muted-foreground">기사 공유하기:</span>
        <div className="flex gap-2">
            <Button variant="outline" size="icon"><Twitter className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><Facebook className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><Linkedin className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon"><LinkIcon className="w-4 h-4" /></Button>
        </div>
      </div>
    </article>
  );
}
