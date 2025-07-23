import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const faqItems = [
  {
    question: "유료 구독 결제는 어떻게 하나요?",
    answer: "현재 MVP 단계에서는 별도의 결제 시스템을 구현하지 않았습니다. 향후 Stripe, Toss Payments 등 안전한 결제 솔루션을 도입할 예정입니다. 정식 런칭 시 이메일로 안내해 드리겠습니다.",
  },
  {
    question: "콘텐츠는 얼마나 자주 발행되나요?",
    answer: "무료 '위클리 브리핑'은 매주 1회 발행됩니다. 유료 구독자를 위한 '심층 분석 리포트'와 '전문가 인터뷰'는 격주로 발행될 예정입니다. 발행 주기는 향후 변동될 수 있습니다.",
  },
  {
    question: "구독을 해지하고 싶으면 어떻게 해야 하나요?",
    answer: "구독 해지는 언제든지 가능하며, 정식 결제 기능 도입 후에는 '마이페이지'에서 쉽게 처리하실 수 있도록 구현할 예정입니다. MVP 기간 중에는 별도의 해지 절차가 필요하지 않습니다.",
  },
  {
    question: "구독자 커뮤니티는 어떻게 참여할 수 있나요?",
    answer: "구독자 커뮤니티는 유료 구독자 전용으로 운영될 예정이며, Discord 또는 Slack과 같은 플랫폼을 활용할 계획입니다. 커뮤니티를 통해 다른 구독자들과 의견을 나누고, 필진과 직접 소통할 수 있는 기회를 제공할 것입니다.",
  },
];

export default function FAQ() {
  return (
    <Card>
       <CardHeader>
        <CardTitle className="font-headline text-2xl">자주 묻는 질문 (FAQ)</CardTitle>
        <CardDescription>궁금한 점이 있으신가요? 여기서 답변을 찾아보세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
