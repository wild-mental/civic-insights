import SubscriptionTable from '@/components/subscription-table';
import FAQ from '@/components/faq';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SubscribePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
      <section className="text-center mb-16">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">
          '시빅 파라다임'과 함께
          <br />
          <span className="text-primary">세상의 변화를 주도하세요</span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
          우리는 복잡하게 얽힌 사회 문제의 본질을 파고들어, 더 나은 미래를 위한 대안을 모색합니다. 단순한 정보 전달을 넘어, 세상을 보는 새로운 관점과 깊이 있는 통찰을 제공하는 것이 우리의 미션입니다.
        </p>
      </section>

      <section className="mb-16">
        <SubscriptionTable />
      </section>

      <section className="mb-16">
        <FAQ />
      </section>
      
      <section className="bg-secondary p-8 md:p-12 rounded-lg text-center">
        <h2 className="font-headline text-3xl font-bold text-foreground mb-4">
            지금 바로 시작하세요
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            이메일을 등록하고 가장 먼저 '시빅 파라다임'의 위클리 브리핑을 받아보세요.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="flex-grow text-base bg-background"
              aria-label="Email for subscription"
            />
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              무료 구독하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
      </section>
    </div>
  );
}
