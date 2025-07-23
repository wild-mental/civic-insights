import { fetchArticles } from '@/lib/api';
import ArchiveContent from './archive-content';

export default async function ArchivePage() {
  // 백엔드 API에서 모든 기사 가져오기
  const allArticles = await fetchArticles();

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

      <ArchiveContent articles={allArticles} />
    </div>
  );
}
