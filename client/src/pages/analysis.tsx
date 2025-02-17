import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TradingStrategy from "@/components/trading-strategy";
import RiskCalculator from "@/components/risk-calculator";
import type { Analysis } from "@shared/schema";

export default function Analysis() {
  const { id } = useParams();
  const { data: analysis, isLoading } = useQuery<Analysis>({
    queryKey: [`/api/analyses/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trading Analysis</h1>
          <p className="text-muted-foreground">
            AI-generated trading strategy and risk analysis
          </p>
        </div>

        <Card className="p-4">
          <img
            src={analysis.imageUrl}
            alt="Trading Chart"
            className="w-full rounded-lg"
          />
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <TradingStrategy analysis={analysis} />
          <RiskCalculator analysis={analysis} />
        </div>
      </div>
    </div>
  );
}
