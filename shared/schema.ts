import {
  pgTable,
  text,
  serial,
  integer,
  json,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // Make password optional for Google auth
  googleId: text("google_id").unique(), // Add Google ID field
  email: text("email").unique(), // Add email field
  displayName: text("display_name"), // Add display name field
  avatar: text("avatar"), // Add avatar URL field
  createdAt: timestamp("created_at").defaultNow(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url").notNull(),
  indicators: json("indicators").$type<{
    support: number[];
    resistance: number[];
    patterns: string[];
    ema?: number[];
    rsi?: number;
    macd?: { signal: number; histogram: number };
  }>(),
  strategy: json("strategy").$type<{
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    confidence: number;
    direction: "long" | "short";
    reasoning: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  urlToImage: text("url_to_image").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    googleId: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    displayName: z.string().optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
  })
  .omit({
    id: true,
    createdAt: true,
  });

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type User = typeof users.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type NewsItem = typeof news.$inferSelect;