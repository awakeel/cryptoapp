import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  // Create new analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      const data = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis(data);
      res.json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid analysis data" });
        return;
      }
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

  // Get recent analyses
  app.get("/api/analyses", async (_req, res) => {
    const analyses = await storage.getRecentAnalyses();
    res.json(analyses);
  });

  const httpServer = createServer(app);
  return httpServer;
}
