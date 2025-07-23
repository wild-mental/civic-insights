import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Users, TrendingUp, DollarSign } from 'lucide-react';
import ContentCard from '@/components/content-card';
import { fetchLatestArticles } from '@/lib/api';

export default async function Home() {
  // 백엔드 API에서 최신 기사 3개 가져오기
  const latestArticles = await fetchLatestArticles(3);

  const categories = [
    {
      name: '시민참여',
      description: '기술이 만드는 새로운 민주주의와 시민의 역할 변화를 탐구합니다.',
      icon: <Users className="w-12 h-12 text-primary" />,
    },
    {
      name: '메가트렌드',
      description: 'AI, 기후변화 등 거대한 흐름 속에서 기회와 위기를 분석합니다.',
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
    },
    {
      name: '기본소득',
      description: '미래 사회의 대안, 기본소득의 전 세계적 실험과 담론을 추적합니다.',
      icon: <DollarSign className="w-12 h-12 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-secondary/50">
        <div className="container mx-auto text-center px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            복잡한 세상의 변화,
            <br />
            <span className="text-primary">핵심을 꿰뚫는 인사이트</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            '시빅 파라다임'은 시민참여, 메가트렌드, 기본소득의 교차점에서 미래를 탐색합니다. 깊이 있는 분석으로 세상을 주도적으로 이해하는 눈을 기르세요.
          </p>
          <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="flex-grow text-base"
              aria-label="Email for subscription"
            />
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              무료로 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            최신 콘텐츠
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ContentCard key={article.id} article={article} />
            ))}
          </div>
           <div className="text-center mt-12">
            <Link href="/archive" passHref>
              <Button variant="outline" size="lg">
                모든 콘텐츠 보기 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            우리의 핵심 카테고리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {categories.map((category) => (
              <Card key={category.name} className="flex flex-col items-center p-8 border-2 hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4">{category.icon}</div>
                <h3 className="font-headline text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
