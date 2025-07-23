import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

type PaywallProps = {
  children: React.ReactNode;
};

export default function Paywall({ children }: PaywallProps) {
  return (
    <div className="relative mt-8">
      <div className="blur-lg select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg p-8 text-center">
        <Lock className="w-16 h-16 text-primary mb-4" />
        <h2 className="font-headline text-3xl font-bold text-foreground mb-2">
          유료 구독자 전용 콘텐츠입니다
        </h2>
        <p className="text-muted-foreground max-w-md mb-6">
          심층 분석 리포트와 전문가 인터뷰 전문을 확인하려면 유료 구독이 필요합니다. 더 깊이 있는 인사이트를 놓치지 마세요.
        </p>
        <Link href="/subscribe">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            구독 플랜 보러가기
          </Button>
        </Link>
      </div>
    </div>
  );
}
