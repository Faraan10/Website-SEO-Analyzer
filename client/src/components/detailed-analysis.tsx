import { Card, CardContent } from "@/components/ui/card";
import { SEOAnalysis, SEOMetaTag } from "@shared/schema";
import { CodeIcon, LightbulbIcon } from "lucide-react";

interface DetailedAnalysisProps {
  analysis: SEOAnalysis;
}

export default function DetailedAnalysis({ analysis }: DetailedAnalysisProps) {
  // Function to get the status indicator
  const getStatusIndicator = (status?: string) => {
    switch(status) {
      case 'good':
        return (
          <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
        );
      case 'missing':
        return (
          <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center">
            <span className="text-white text-xs">✗</span>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs">i</span>
          </div>
        );
    }
  };
  
  // Function to format the meta tag as HTML-like code
  const formatMetaTag = (tag: SEOMetaTag) => {
    const propName = tag.property || tag.name;
    return (
      <span className="font-mono text-sm text-slate-800">
        <span className="text-purple-600">&lt;meta</span> {' '}
        <span className="text-blue-600">{tag.property ? 'property' : 'name'}</span>=
        <span className="text-orange-600">"{propName}"</span> {' '}
        <span className="text-blue-600">content</span>=
        <span className="text-orange-600">"{tag.content}"</span>
        <span className="text-purple-600">&gt;</span>
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <CodeIcon className="text-primary mr-2" />
            Meta Tags Found
          </h3>
          <div className="space-y-4">
            {analysis.metaTags.length > 0 ? (
              analysis.metaTags.map((tag, index) => (
                <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="mb-1">{formatMetaTag(tag)}</p>
                  {tag.status && (
                    <div className="flex items-center mt-1">
                      {getStatusIndicator(tag.status)}
                      <p className="text-sm text-slate-600 ml-2">
                        {tag.message || (tag.status === 'good' ? 'Well implemented' : 'Needs attention')}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-slate-600">No meta tags found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <LightbulbIcon className="text-accent mr-2" />
            Recommendations
          </h3>
          <div className="space-y-4">
            {analysis.recommendations.length > 0 ? (
              analysis.recommendations.map((rec) => (
                <div key={rec.id} className="flex">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xs">{rec.id}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{rec.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                    <div className="mt-2 font-mono text-xs bg-slate-100 p-2 rounded border border-slate-200 text-slate-700 whitespace-pre-wrap">
                      {rec.implementation}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600">No recommendations at this time.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
