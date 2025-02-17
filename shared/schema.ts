import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  indicators: json("indicators").$type<{
    support: number[];
    resistance: number[];
    patterns: string[];
    ema?: number[];
    rsi?: number;
    macd?: {signal: number; histogram: number};
  }>(),
  strategy: json("strategy").$type<{
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    confidence: number;
    direction: "long" | "short";
    reasoning: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;
