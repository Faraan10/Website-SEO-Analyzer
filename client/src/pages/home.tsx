import { Helmet } from "react-helmet";
import UrlInput from "@/components/url-input";
import SEOScoreCard from "@/components/seo-score-card";
import PreviewTabs from "@/components/preview-tabs";
import DetailedAnalysis from "@/components/detailed-analysis";
import { useState } from "react";
import { SEOAnalysis } from "@shared/schema";
import { SearchIcon } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      const data = await response.json();
      setAnalysis(data);
      
      // Scroll to results if on mobile
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze website");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Helmet>
        <title>SEO Meta Tag Analyzer</title>
        <meta name="description" content="Analyze and visualize SEO meta tags for any website with real-time previews and optimization suggestions" />
        <meta property="og:title" content="SEO Meta Tag Analyzer" />
        <meta property="og:description" content="Analyze and visualize SEO meta tags for any website with real-time previews and optimization suggestions" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Meta Tag Analyzer" />
        <meta name="twitter:description" content="Analyze and visualize SEO meta tags for any website with real-time previews and optimization suggestions" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        <header className="text-center mb-6 md:mb-10">
          <div className="inline-flex items-center justify-center bg-primary/10 p-2 rounded-full mb-4">
            <SearchIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3 bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
            SEO Meta Tag Analyzer
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
            Analyze and visualize SEO meta tags for any website with 
            real-time previews and optimization suggestions
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <UrlInput 
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
          />
        </div>
        
        {analysis && (
          <div id="results-section" className="results-section mt-8 md:mt-12">
            <SEOScoreCard analysis={analysis} />
            <div className="my-8 md:my-12"></div>
            <PreviewTabs analysis={analysis} />
            <div className="my-8 md:my-12"></div>
            <DetailedAnalysis analysis={analysis} />
          </div>
        )}
        
        <footer className="text-center text-slate-500 text-sm mt-20 pb-8">
          <p>&copy; {new Date().getFullYear()} SEO Meta Tag Analyzer - Check your website's SEO optimization</p>
        </footer>
      </div>
    </div>
  );
}
