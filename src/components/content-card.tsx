import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User } from 'lucide-react';

type ContentCardProps = {
  article: Article;
};

export default function ContentCard({ article }: ContentCardProps) {
  return (
    <Link href={`/archive/${article.slug}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-primary">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={article['data-ai-hint']}
            />
             <Badge 
              variant={article.type === 'paid' ? 'default' : 'secondary'} 
              className="absolute top-3 right-3 capitalize"
              style={article.type === 'paid' ? { backgroundColor: 'hsl(var(--primary))' } : {}}
            >
              {article.type === 'paid' ? '유료' : '무료'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <Badge variant="outline" className="mb-2">{article.category}</Badge>
          <CardTitle className="font-headline text-xl leading-snug mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.summary}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
           <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
             </div>
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishDate}>{article.publishDate}</time>
             </div>
           </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            읽기 <ArrowRight className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
