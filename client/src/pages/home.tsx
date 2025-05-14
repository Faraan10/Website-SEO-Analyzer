import { Helmet } from "react-helmet";
import UrlInput from "@/components/url-input";
import SEOScoreCard from "@/components/seo-score-card";
import PreviewTabs from "@/components/preview-tabs";
import DetailedAnalysis from "@/components/detailed-analysis";
import { useState } from "react";
import { SEOAnalysis } from "@shared/schema";

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze website");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>SEO Meta Tag Analyzer</title>
        <meta name="description" content="Analyze and visualize SEO meta tags for any website with real-time previews and optimization suggestions" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">SEO Meta Tag Analyzer</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Analyze and visualize SEO meta tags for any website with real-time previews and optimization suggestions
          </p>
        </header>
        
        <UrlInput 
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />
        
        {analysis && (
          <div className="results-section">
            <SEOScoreCard analysis={analysis} />
            <PreviewTabs analysis={analysis} />
            <DetailedAnalysis analysis={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}
