import { useState, useRef } from "react";
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
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await apiRequest("POST", "/api/analyses", { imageUrl });
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          mutation.mutate(event.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCaptureScreen = async () => {
    if (!cameraStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    } else {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const imageUrl = canvasRef.current.toDataURL("image/png");
          setCapturedImage(imageUrl);
          mutation.mutate(imageUrl);
        }
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
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
              disabled={mutation.isPending}
            >
              <Upload className="h-8 w-8" />
              <span>Upload Chart</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
              onClick={handleCaptureScreen}
              disabled={mutation.isPending}
            >
              <Camera className="h-8 w-8" />
              <span>{cameraStream ? "Capture Image" : "Open Camera"}</span>
            </Button>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={mutation.isPending}
          />
          {cameraStream && (
            <div className="flex flex-col items-center space-y-4">
              <video ref={videoRef} autoPlay className="w-full max-w-sm" />
              <canvas ref={canvasRef} className="hidden" width="640" height="480" />
            </div>
          )}
          {mutation.isPending && (
            <p className="text-sm text-muted-foreground animate-pulse">
              Analyzing chart with AI...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}