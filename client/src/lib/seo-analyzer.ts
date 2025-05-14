import { SEOMetaTag, SEOAnalysis } from "@shared/schema";

export function analyzeTitleTag(title: string | undefined): { status: 'good' | 'warning' | 'error'; message: string } {
  if (!title) {
    return { status: 'error', message: 'Missing title tag' };
  }
  
  if (title.length < 30) {
    return { status: 'warning', message: 'Title tag is too short (under 30 characters)' };
  }
  
  if (title.length > 60) {
    return { status: 'warning', message: `Title tag is too long at ${title.length} characters (over 60)` };
  }
  
  return { status: 'good', message: `Title tag is well-optimized at ${title.length} characters` };
}

export function analyzeDescriptionTag(description: string | undefined): { status: 'good' | 'warning' | 'error'; message: string } {
  if (!description) {
    return { status: 'error', message: 'Missing meta description' };
  }
  
  if (description.length < 80) {
    return { status: 'warning', message: 'Meta description is too short (under 80 characters)' };
  }
  
  if (description.length > 158) {
    return { status: 'warning', message: `Meta description is too long at ${description.length} characters (over 158)` };
  }
  
  return { status: 'good', message: 'Meta description is present and well-formatted' };
}

export function analyzeOpenGraphTags(metaTags: SEOMetaTag[]): { status: 'good' | 'warning' | 'error'; message: string } {
  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  
  const missingTags = requiredOgTags.filter(
    tag => !metaTags.some(meta => meta.property === tag)
  );
  
  if (missingTags.length > 0) {
    if (missingTags.includes('og:title') || missingTags.includes('og:description')) {
      return { status: 'error', message: `Missing critical Open Graph tags: ${missingTags.join(', ')}` };
    } else {
      return { status: 'warning', message: `Missing recommended Open Graph tags: ${missingTags.join(', ')}` };
    }
  }
  
  // Check for image dimensions
  const hasOgImage = metaTags.some(meta => meta.property === 'og:image');
  const hasOgImageWidth = metaTags.some(meta => meta.property === 'og:image:width');
  const hasOgImageHeight = metaTags.some(meta => meta.property === 'og:image:height');
  
  if (hasOgImage && (!hasOgImageWidth || !hasOgImageHeight)) {
    return { status: 'warning', message: 'Missing Open Graph image dimensions' };
  }
  
  return { status: 'good', message: 'Open Graph tags are well implemented' };
}

export function analyzeTwitterCardTags(metaTags: SEOMetaTag[]): { status: 'good' | 'warning' | 'error'; message: string } {
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  
  const missingTags = requiredTwitterTags.filter(
    tag => !metaTags.some(meta => meta.name === tag)
  );
  
  if (missingTags.length === requiredTwitterTags.length) {
    return { status: 'error', message: 'Twitter card meta tags are missing' };
  }
  
  if (missingTags.length > 0) {
    return { status: 'warning', message: `Some Twitter card tags are missing: ${missingTags.join(', ')}` };
  }
  
  return { status: 'good', message: 'Twitter card tags are well implemented' };
}

export function calculateSEOScore(analysis: Partial<SEOAnalysis>): number {
  let score = 0;
  let maxPoints = 0;
  
  // Title tag - 20 points
  maxPoints += 20;
  if (analysis.title) {
    if (analysis.title.length >= 30 && analysis.title.length <= 60) {
      score += 20;
    } else if (analysis.title.length > 0) {
      score += 10; // Partial points
    }
  }
  
  // Meta description - 20 points
  maxPoints += 20;
  if (analysis.description) {
    if (analysis.description.length >= 80 && analysis.description.length <= 158) {
      score += 20;
    } else if (analysis.description.length > 0) {
      score += 10; // Partial points
    }
  }
  
  // Open Graph tags - 30 points
  if (analysis.metaTags) {
    const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    maxPoints += 30;
    
    // 5 points for each required OG tag (20 total)
    for (const tag of requiredOgTags) {
      if (analysis.metaTags.some(meta => meta.property === tag)) {
        score += 5;
      }
    }
    
    // 5 points for og:type
    if (analysis.metaTags.some(meta => meta.property === 'og:type')) {
      score += 5;
    }
    
    // 5 points for image dimensions
    if (
      analysis.metaTags.some(meta => meta.property === 'og:image:width') &&
      analysis.metaTags.some(meta => meta.property === 'og:image:height')
    ) {
      score += 5;
    }
  }
  
  // Twitter Card tags - 20 points
  if (analysis.metaTags) {
    const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    maxPoints += 20;
    
    // 5 points for each required Twitter tag
    for (const tag of requiredTwitterTags) {
      if (analysis.metaTags.some(meta => meta.name === tag)) {
        score += 5;
      }
    }
  }
  
  // Canonical URL - 10 points
  maxPoints += 10;
  if (analysis.metaTags && analysis.metaTags.some(meta => 
    meta.type === 'link' && meta.property === 'canonical'
  )) {
    score += 10;
  }
  
  // Return percentage
  return Math.round((score / maxPoints) * 100);
}

export function generateRecommendations(analysis: Partial<SEOAnalysis>): {
  id: number;
  title: string;
  description: string;
  implementation: string;
}[] {
  const recommendations = [];
  let id = 1;
  
  // Check for missing title
  if (!analysis.title) {
    recommendations.push({
      id: id++,
      title: 'Add a title tag',
      description: 'Every page should have a unique, descriptive title tag (50-60 characters).',
      implementation: '<title>Your Page Title | Your Website Name</title>'
    });
  } else if (analysis.title.length > 60) {
    recommendations.push({
      id: id++,
      title: 'Shorten your title tag',
      description: 'Your title tag is too long. Keep it under 60 characters to avoid truncation in search results.',
      implementation: '<title>Shorter, More Concise Title | Website</title>'
    });
  }
  
  // Check for missing meta description
  if (!analysis.description) {
    recommendations.push({
      id: id++,
      title: 'Add a meta description',
      description: 'Every page should have a unique meta description (120-158 characters).',
      implementation: '<meta name="description" content="A concise description of your page content that will entice users to click through from search results.">'
    });
  } else if (analysis.description.length > 158) {
    recommendations.push({
      id: id++,
      title: 'Shorten your meta description',
      description: 'Your meta description is too long. Keep it under 158 characters to avoid truncation in search results.',
      implementation: '<meta name="description" content="A shorter, more concise description of your page content.">'
    });
  }
  
  // Check for missing Open Graph tags
  if (analysis.metaTags) {
    const hasOgTitle = analysis.metaTags.some(meta => meta.property === 'og:title');
    const hasOgDescription = analysis.metaTags.some(meta => meta.property === 'og:description');
    const hasOgImage = analysis.metaTags.some(meta => meta.property === 'og:image');
    const hasOgUrl = analysis.metaTags.some(meta => meta.property === 'og:url');
    const hasOgType = analysis.metaTags.some(meta => meta.property === 'og:type');
    
    if (!hasOgTitle || !hasOgDescription || !hasOgImage || !hasOgUrl) {
      recommendations.push({
        id: id++,
        title: 'Add Open Graph meta tags',
        description: 'Open Graph tags improve how your content appears when shared on social media platforms like Facebook.',
        implementation: `<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Your page description">\n<meta property="og:image" content="https://example.com/image.jpg">\n<meta property="og:url" content="https://example.com/page-url">${!hasOgType ? '\n<meta property="og:type" content="website">' : ''}`
      });
    }
    
    // Check for missing image dimensions
    if (hasOgImage) {
      const hasOgImageWidth = analysis.metaTags.some(meta => meta.property === 'og:image:width');
      const hasOgImageHeight = analysis.metaTags.some(meta => meta.property === 'og:image:height');
      
      if (!hasOgImageWidth || !hasOgImageHeight) {
        recommendations.push({
          id: id++,
          title: 'Add Open Graph image dimensions',
          description: 'Include width and height for og:image to improve social media previews.',
          implementation: '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">'
        });
      }
    }
    
    // Check for missing Twitter Card tags
    const hasTwitterCard = analysis.metaTags.some(meta => meta.name === 'twitter:card');
    const hasTwitterTitle = analysis.metaTags.some(meta => meta.name === 'twitter:title');
    const hasTwitterDescription = analysis.metaTags.some(meta => meta.name === 'twitter:description');
    const hasTwitterImage = analysis.metaTags.some(meta => meta.name === 'twitter:image');
    
    if (!hasTwitterCard || !hasTwitterTitle || !hasTwitterDescription || !hasTwitterImage) {
      recommendations.push({
        id: id++,
        title: 'Add Twitter Card meta tags',
        description: 'Implement basic Twitter Card meta tags to improve visibility when sharing on Twitter.',
        implementation: '<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="Your Title">\n<meta name="twitter:description" content="Your Description">\n<meta name="twitter:image" content="https://example.com/image.jpg">'
      });
    }
    
    // Check for canonical URL
    const hasCanonical = analysis.metaTags.some(meta => 
      meta.type === 'link' && meta.property === 'canonical'
    );
    
    if (!hasCanonical) {
      recommendations.push({
        id: id++,
        title: 'Add canonical URL',
        description: 'Implement a canonical URL to avoid duplicate content issues.',
        implementation: '<link rel="canonical" href="https://example.com/page-url">'
      });
    }
  }
  
  return recommendations;
}
