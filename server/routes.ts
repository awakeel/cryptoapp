import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema } from "@shared/schema";
import { analyzeChart } from "./ai-service";
import { setupAuth } from "./auth";
import { z } from "zod";
export async function registerRoutes(app: Express) {
  setupAuth(app);

  // Create new analysis
  app.post("/api/analyses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // First analyze the chart with AI
      const analysis = await analyzeChart(req.body.imageUrl);

      // Then save the analysis with validated data
      const data = insertAnalysisSchema.parse({
        imageUrl: req.body.imageUrl,
        userId: req.user.id,
        ...analysis,
      });

      const savedAnalysis = await storage.createAnalysis(data);
      res.json(savedAnalysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid analysis data" });
        return;
      }
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to create analysis" });
    }
  });

  // Get analysis by ID
  app.get("/api/analyses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid analysis ID" });
      return;
    }

    const analysis = await storage.getAnalysis(id);
    if (!analysis) {
      res.status(404).json({ message: "Analysis not found" });
      return;
    }

    res.json(analysis);
  });

  // Get user's analyses
  app.get("/api/user/analyses", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const analyses = await storage.getUserAnalyses(req.user.id);
    res.json(analyses);
  });

  // Get recent analyses
  app.get("/api/analyses", async (_req, res) => {
    const analyses = await storage.getRecentAnalyses();
    res.json(analyses);
  });
  app.get("/api/news", async (_req, res) => {
    const googleNews = await storage.getNews();
    console.log(googleNews);
    res.json(googleNews);
  });
  const httpServer = createServer(app);
  return httpServer;
}
