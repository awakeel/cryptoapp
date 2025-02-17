import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Target, Ban } from "lucide-react";
import type { Analysis } from "@shared/schema";

interface TradingStrategyProps {
  analysis: Analysis;
}

export default function TradingStrategy({ analysis }: TradingStrategyProps) {
  if (!analysis.strategy || !analysis.indicators) return null;

  const { strategy, indicators } = analysis;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {strategy.direction === "long" ? (
            <ArrowUpCircle className="text-green-500" />
          ) : (
            <ArrowDownCircle className="text-red-500" />
          )}
          Trading Strategy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Entry Price</p>
            <p className="text-2xl font-semibold">${strategy.entryPrice}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-2xl font-semibold">
              {(strategy.confidence * 100).toFixed(0)}%
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="text-green-500 h-4 w-4" />
              <p className="text-sm text-muted-foreground">Take Profit</p>
            </div>
            <p className="text-xl font-medium">${strategy.takeProfit}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Ban className="text-red-500 h-4 w-4" />
              <p className="text-sm text-muted-foreground">Stop Loss</p>
            </div>
            <p className="text-xl font-medium">${strategy.stopLoss}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Technical Indicators</p>
          <div className="text-sm text-muted-foreground space-y-1">
            {indicators.patterns.map((pattern) => (
              <p key={pattern}>• {pattern}</p>
            ))}
            {indicators.rsi && <p>• RSI: {indicators.rsi}</p>}
            {indicators.macd && (
              <p>
                • MACD Signal: {indicators.macd.signal}, Histogram:{" "}
                {indicators.macd.histogram}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Analysis</p>
          <p className="text-sm text-muted-foreground">{strategy.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}