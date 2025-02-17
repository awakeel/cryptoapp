import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Upload, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Analysis } from "@shared/schema";

export default function ChartUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await apiRequest("POST", "/api/analyses", {
        imageUrl,
        indicators: {
          support: [30000, 28000],
          resistance: [35000, 38000],
          patterns: ["bullish engulfing"],
          rsi: 65,
          macd: { signal: 0.5, histogram: 0.2 }
        },
        strategy: {
          entryPrice: 32000,
          stopLoss: 30000,
          takeProfit: 38000,
          confidence: 0.85,
          direction: "long",
          reasoning: "Strong bullish pattern with support"
        }
      });
      return res.json() as Promise<Analysis>;
    },
    onSuccess: (data) => {
      setLocation(`/analysis/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze chart. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // In a real app, upload to storage and get URL
      const mockImageUrl = URL.createObjectURL(selectedFile);
      mutation.mutate(mockImageUrl);
    }
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="h-8 w-8" />
              <span>Upload Chart</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
              disabled
            >
              <Camera className="h-8 w-8" />
              <span>Capture Screen</span>
            </Button>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {mutation.isPending && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Analyzing chart...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}