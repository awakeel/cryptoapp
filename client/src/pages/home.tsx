import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ChartUpload from "@/components/chart-upload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import type { Analysis } from "@shared/schema";

export default function Home() {
  const { data: recentAnalyses, isLoading } = useQuery<Analysis[]>({
    queryKey: ["/api/analyses"],
  });

  return (
    <div className="bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Trading Assistant
          </h1>
          <p className="text-muted-foreground">
            Upload a crypto chart and get AI-powered trading strategies
          </p>
        </div>

        <ChartUpload />

        <div className="space-y-4">
          <Separator />
          <h2 className="text-2xl font-semibold">Recent Analyses</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="hover:bg-muted/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recentAnalyses?.length ? (
              recentAnalyses.map((analysis) => (
                <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {analysis.strategy?.direction === "long" ? "Long" : "Short"}{" "}
                        Position
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {analysis.createdAt &&
                          formatDistanceToNow(new Date(analysis.createdAt), {
                            addSuffix: true,
                          })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>Entry: ${analysis.strategy?.entryPrice}</p>
                        <p>
                          Confidence:{" "}
                          <span
                            className={
                              analysis.strategy?.confidence >= 0.7
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {(analysis.strategy?.confidence * 100).toFixed(0)}%
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                No analyses yet. Upload a chart to get started!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}