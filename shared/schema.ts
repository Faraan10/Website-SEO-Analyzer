import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analyzer Types
export const seoMetaTagSchema = z.object({
  type: z.string(),
  name: z.string().optional(),
  property: z.string().optional(),
  content: z.string(),
  status: z.enum(['good', 'warning', 'missing']).optional(),
  message: z.string().optional()
});

export type SEOMetaTag = z.infer<typeof seoMetaTagSchema>;

export const seoAnalysisSchema = z.object({
  title: z.string().optional(),
  url: z.string(),
  description: z.string().optional(),
  score: z.number(),
  metaTags: z.array(seoMetaTagSchema),
  recommendations: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    implementation: z.string()
  })),
  summaryPoints: z.array(z.object({
    status: z.enum(['good', 'warning', 'error']),
    message: z.string()
  }))
});

export type SEOAnalysis = z.infer<typeof seoAnalysisSchema>;
