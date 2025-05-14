import { CheerioAPI } from "cheerio";
import { SEOMetaTag } from "@shared/schema";

// Get page title
export function getTitle($: CheerioAPI): string | undefined {
  return $("title").text() || undefined;
}

// Get meta description
export function getMetaDescription($: CheerioAPI): string | undefined {
  return $('meta[name="description"]').attr("content") || undefined;
}

// Get canonical URL
export function getCanonicalUrl($: CheerioAPI): string | undefined {
  return $('link[rel="canonical"]').attr("href") || undefined;
}

// Extract all meta tags
export function extractMetaTags($: CheerioAPI): SEOMetaTag[] {
  const metaTags: SEOMetaTag[] = [];
  
  // Extract standard meta tags
  $("meta").each((_, element) => {
    const name = $(element).attr("name");
    const property = $(element).attr("property");
    const content = $(element).attr("content");
    
    if ((name || property) && content) {
      const tag: SEOMetaTag = {
        type: "meta",
        content,
      };
      
      if (name) tag.name = name;
      if (property) tag.property = property;
      
      // Add status to meta tags based on their importance
      if (
        name === "description" ||
        property === "og:title" ||
        property === "og:description" ||
        property === "og:image" ||
        property === "og:url"
      ) {
        tag.status = "good";
        tag.message = "Well implemented";
      } else if (
        name === "twitter:card" ||
        name === "twitter:title" ||
        name === "twitter:description" ||
        name === "twitter:image"
      ) {
        tag.status = "good";
        tag.message = "Well implemented";
      } else if (property === "og:type") {
        tag.status = "good";
        tag.message = "Well implemented";
      } else if (
        property === "og:image:width" ||
        property === "og:image:height"
      ) {
        tag.status = "good";
        tag.message = "Image dimensions properly defined";
      }
      
      metaTags.push(tag);
    }
  });
  
  // Extract canonical link (as a special meta tag for our analysis)
  const canonicalLink = $('link[rel="canonical"]');
  if (canonicalLink.length) {
    metaTags.push({
      type: "link",
      property: "canonical",
      content: canonicalLink.attr("href") || "",
      status: "good",
      message: "Canonical URL defined"
    });
  }
  
  // Check for missing or incomplete tags and add warnings
  
  // Check og:image dimensions
  const hasOgImage = metaTags.some(tag => tag.property === "og:image");
  const hasOgImageWidth = metaTags.some(tag => tag.property === "og:image:width");
  const hasOgImageHeight = metaTags.some(tag => tag.property === "og:image:height");
  
  if (hasOgImage && (!hasOgImageWidth || !hasOgImageHeight)) {
    // Find the og:image tag and update its status
    const ogImageTag = metaTags.find(tag => tag.property === "og:image");
    if (ogImageTag) {
      ogImageTag.status = "warning";
      ogImageTag.message = "Missing dimensions (og:image:width, og:image:height)";
    }
  }
  
  return metaTags;
}

// URL validation function
export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
}
