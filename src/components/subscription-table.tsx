import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  { feature: '위클리 브리핑', free: true, paid: true },
  { feature: '심층 분석 리포트', free: false, paid: true },
  { feature: '전문가 인터뷰', free: false, paid: true },
  { feature: '구독자 커뮤니티', free: false, paid: true },
];

export default function SubscriptionTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">구독 플랜 비교</CardTitle>
        <CardDescription>자신에게 맞는 플랜을 선택하고 더 깊이 있는 인사이트를 만나보세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[60%] font-semibold text-foreground">기능</TableHead>
                <TableHead className="text-center font-semibold text-foreground">무료 구독자</TableHead>
                <TableHead className="text-center font-semibold text-primary">유료 구독자</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {features.map((item) => (
                <TableRow key={item.feature}>
                    <TableCell className="font-medium">{item.feature}</TableCell>
                    <TableCell className="text-center">
                    {item.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="text-center">
                    {item.paid ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
