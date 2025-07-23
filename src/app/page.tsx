import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Users, TrendingUp, DollarSign } from 'lucide-react';
import ContentCard from '@/components/content-card';
import { getLatestArticles } from '@/lib/mock-data';

export default function Home() {
  const latestArticles = getLatestArticles(3);

  const categories = [
    {
      name: '시민참여 (Civic Engagement)',
      description: '시민의 목소리가 정책이 되는 과정을 탐구합니다.',
      icon: <Users className="w-12 h-12 text-primary" />,
    },
    {
      name: '메가트렌드 (Megatrends)',
      description: '기술, 사회, 경제의 거대한 흐름을 분석하고 미래를 예측합니다.',
      icon: <TrendingUp className="w-12 h-12 text-primary" />,
    },
    {
      name: '기본소득 (Basic Income)',
      description: '모두의 기본적인 삶을 보장하는 새로운 사회 안전망을 논합니다.',
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
            '시빅 파라다임'은 사회 변화, 기술 트렌드, 정치 혁신의 중심에서 길어 올린 깊이 있는 분석과 전망을 제공합니다.
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
            최신 콘텐츠 미리보기
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
            주요 카테고리
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

      {/* Trust/Recommendation Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground p-8 md:p-12 lg:p-16 rounded-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="https://placehold.co/150x150.png"
                  alt="Recommender"
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-primary-foreground/50"
                  data-ai-hint="person portrait"
                />
              </div>
              <div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4">이런 분들께 추천합니다</h2>
                <ul className="space-y-2 list-disc list-inside text-lg">
                  <li>단순한 뉴스 요약을 넘어, 현상의 본질을 이해하고 싶은 분</li>
                  <li>미래 사회의 변화를 주도적으로 준비하고 싶은 기획자, 연구자, 활동가</li>
                  <li>신뢰할 수 있는 정보원을 통해 꾸준히 지적 성장을 추구하는 분</li>
                </ul>
                 <Link href="/subscribe" passHref>
                    <Button variant="secondary" size="lg" className="mt-6">
                        구독 플랜 자세히 보기
                    </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
