import {
  analyses,
  users,
  news,
  type Analysis,
  type InsertAnalysis,
  type User,
  type InsertUser,
  InsertNews,
  insertNewsSchema,
  NewsItem
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

import NewsAPI from "newsapi";
console.log(NewsAPI);
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
export interface IStorage {
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getRecentAnalyses(): Promise<Analysis[]>;
  getUserAnalyses(userId: number): Promise<Analysis[]>;
  getNews(): Promise<any[]>;
  // User operations
  getDBNews(): Promise<any[]>;
  createDBNews(newsItem: InsertNews): Promise<NewsItem>; // Add this line

  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db
      .select()
      .from(analyses)
      .where(eq(analyses.id, id));
    return analysis;
  }
  getNews = async () => {
    const response = await newsapi.v2.everything({
      q: "bitcoin",
      language: "en",
      sortBy: "relevancy",
      page: 1,
    });
    return response.articles;
  };
  async getRecentAnalyses(): Promise<Analysis[]> {
    return await db
      .select()
      .from(analyses)
      .orderBy(analyses.createdAt)
      .limit(10);
  }

  async getUserAnalyses(userId: number): Promise<Analysis[]> {
    return await db
      .select()
      .from(analyses)
      .where(eq(analyses.userId, userId))
      .orderBy(analyses.createdAt);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    return user;
  }
}

export const storage = new DatabaseStorage();
