import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import type { Analysis } from "@shared/schema";

interface RiskCalculatorProps {
  analysis: Analysis;
}

export default function RiskCalculator({ analysis }: RiskCalculatorProps) {
  const [position, setPosition] = useState(1000);

  if (!analysis.strategy) return null;

  const { strategy } = analysis;

  const riskAmount = ((strategy.entryPrice - strategy.stopLoss) / strategy.entryPrice) * position;
  const rewardAmount = ((strategy.takeProfit - strategy.entryPrice) / strategy.entryPrice) * position;
  const riskRewardRatio = rewardAmount / riskAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Position Size (USD)</p>
            <Slider
              value={[position]}
              onValueChange={([value]) => setPosition(value)}
              min={100}
              max={10000}
              step={100}
            />
            <p className="text-xl font-semibold">${position.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Potential Loss</p>
            <p className="text-xl font-medium text-red-500">
              ${riskAmount.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Potential Profit</p>
            <p className="text-xl font-medium text-green-500">
              ${rewardAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Risk/Reward Ratio</p>
          <p className="text-2xl font-semibold">1:{riskRewardRatio.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {riskRewardRatio >= 2
              ? "Favorable risk/reward ratio"
              : "Consider adjusting your take profit or stop loss"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}