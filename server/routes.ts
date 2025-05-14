import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { SEOMetaTag, SEOAnalysis } from "@shared/schema";
import { getCanonicalUrl, getTitle, getMetaDescription, extractMetaTags, validateUrl } from "./seo-utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO Analyzer API route
  app.get("/api/analyze", async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      // Validate URL format
      if (!validateUrl(url)) {
        return res.status(400).json({ message: "Invalid URL format" });
      }
      
      // Fetch HTML from the URL
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SEOAnalyzer/1.0; +http://example.com)'
          }
        });
        
        if (!response.ok) {
          return res.status(response.status).json({ 
            message: `Failed to fetch URL: ${response.statusText}`
          });
        }
        
        const html = await response.text();
        
        // Parse HTML with Cheerio
        const $ = cheerio.load(html);
        
        // Extract basic SEO elements
        const title = getTitle($);
        const description = getMetaDescription($);
        const canonicalUrl = getCanonicalUrl($) || url;
        
        // Extract all meta tags
        const metaTags = extractMetaTags($);
        
        // Analyze the meta tags
        const analysis = analyzeMetaTags({
          title,
          url: canonicalUrl,
          description,
          metaTags
        });
        
        return res.json(analysis);
        
      } catch (error) {
        return res.status(500).json({ 
          message: `Error fetching or parsing the webpage: ${(error as Error).message}`
        });
      }
    } catch (error) {
      console.error("Error in /api/analyze:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to analyze meta tags and generate report
function analyzeMetaTags(data: {
  title?: string;
  url: string;
  description?: string;
  metaTags: SEOMetaTag[];
}): SEOAnalysis {
  // Import analyzer functions from front-end to maintain consistency
  const {
    analyzeTitleTag,
    analyzeDescriptionTag,
    analyzeOpenGraphTags,
    analyzeTwitterCardTags,
    calculateSEOScore,
    generateRecommendations
  } = require('../client/src/lib/seo-analyzer');
  
  // Generate summary points
  const titleAnalysis = analyzeTitleTag(data.title);
  const descriptionAnalysis = analyzeDescriptionTag(data.description);
  const ogAnalysis = analyzeOpenGraphTags(data.metaTags);
  const twitterAnalysis = analyzeTwitterCardTags(data.metaTags);
  
  const summaryPoints = [
    titleAnalysis,
    descriptionAnalysis,
    ogAnalysis,
    twitterAnalysis
  ];
  
  // Calculate the SEO score
  const score = calculateSEOScore(data);
  
  // Generate recommendations
  const recommendations = generateRecommendations(data);
  
  return {
    title: data.title,
    url: data.url,
    description: data.description,
    score,
    metaTags: data.metaTags,
    recommendations,
    summaryPoints
  };
}
