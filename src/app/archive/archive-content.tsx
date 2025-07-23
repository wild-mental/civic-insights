'use client';

import { useState } from 'react';
import ContentCard from '@/components/content-card';
import type { Article } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArchiveContentProps {
  articles: Article[];
}

const categories = [
  { slug: 'all', name: '모두' },
  { slug: 'Civic Engagement', name: '시민참여' },
  { slug: 'Megatrends', name: '메가트렌드' },
  { slug: 'Basic Income', name: '기본소득' },
];

export default function ArchiveContent({ articles }: ArchiveContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredArticles =
    activeCategory === 'all'
      ? articles
      : articles.filter((article: Article) => article.category === activeCategory);

  return (
    <>
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
    </>
  );
} 