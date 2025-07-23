'use client';

import { useState } from 'react';
import ContentCard from '@/components/content-card';
import { getAllArticles, categories as categoryData } from '@/lib/mock-data';
import type { Article, ArticleCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ArchivePage() {
  const allArticles = getAllArticles();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredArticles =
    activeCategory === 'all'
      ? allArticles
      : allArticles.filter((article: Article) => article.category === activeCategory);
  
  const categories = categoryData;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
          콘텐츠 아카이브
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          '시빅 파라다임'이 발행한 모든 콘텐츠를 모아보고, 원하는 주제를 탐색해보세요.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={activeCategory === category.slug ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category.slug)}
            className={cn(
              'capitalize transition-all duration-200',
              activeCategory === category.slug && 'bg-primary hover:bg-primary/90'
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ContentCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg">
            해당 카테고리에는 아직 콘텐츠가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
