import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SEOAnalysis, SEOMetaTag } from "@shared/schema";
import { CodeIcon, LightbulbIcon, CheckIcon, AlertTriangleIcon, XIcon } from "lucide-react";

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
            <CheckIcon className="text-white h-3 w-3" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center">
            <AlertTriangleIcon className="text-white h-3 w-3" />
          </div>
        );
      case 'missing':
        return (
          <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center">
            <XIcon className="text-white h-3 w-3" />
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
      <div className="font-mono text-sm text-slate-800 break-all whitespace-pre-wrap">
        <span className="text-purple-600">&lt;meta</span> {' '}
        <span className="text-blue-600">{tag.property ? 'property' : 'name'}</span>=
        <span className="text-orange-600">"{propName}"</span> {' '}
        <span className="text-blue-600">content</span>=
        <span className="text-orange-600">"{tag.content}"</span>
        <span className="text-purple-600">&gt;</span>
      </div>
    );
  };

  // Filter meta tags by status for mobile view
  const goodTags = analysis.metaTags.filter(tag => tag.status === 'good');
  const warningTags = analysis.metaTags.filter(tag => tag.status === 'warning');
  const missingTags = analysis.metaTags.filter(tag => tag.status === 'missing' || !tag.status);
  
  return (
    <div className="max-w-5xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 px-4">Detailed Analysis</h2>
      
      {/* Mobile View (Tabs for smaller screens) */}
      <div className="md:hidden mb-8">
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="recommendations">
              <LightbulbIcon className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="metatags">
              <CodeIcon className="h-4 w-4 mr-2" />
              Meta Tags
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="mt-0">
            <Card className="shadow-md">
              <CardContent className="pt-4 px-4">
                <div className="space-y-6">
                  {analysis.recommendations.length > 0 ? (
                    analysis.recommendations.map((rec) => (
                      <div key={rec.id} className="flex items-start border-b border-slate-200 pb-5 last:border-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 mt-1">
                          <span className="text-white font-bold text-xs">{rec.id}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-base">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mt-2">{rec.description}</p>
                          <div className="mt-3 font-mono text-xs bg-slate-100 p-3 rounded border border-slate-200 text-slate-700 overflow-auto">
                            <pre className="whitespace-pre-wrap break-all">{rec.implementation}</pre>
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
          </TabsContent>
          
          <TabsContent value="metatags" className="mt-0">
            <Card className="shadow-md">
              <CardContent className="pt-4 pb-6 px-4">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="good" className="text-success">Good</TabsTrigger>
                    <TabsTrigger value="warning" className="text-warning">Warnings</TabsTrigger>
                    <TabsTrigger value="missing" className="text-error">Missing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-2">
                    {analysis.metaTags.length > 0 ? (
                      analysis.metaTags.map((tag, index) => (
                        <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          {formatMetaTag(tag)}
                          {tag.status && (
                            <div className="flex items-center mt-2">
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
                  </TabsContent>
                  
                  <TabsContent value="good" className="space-y-4 mt-2">
                    {goodTags.length > 0 ? (
                      goodTags.map((tag, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-100">
                          {formatMetaTag(tag)}
                          <div className="flex items-center mt-2">
                            {getStatusIndicator(tag.status)}
                            <p className="text-sm text-slate-600 ml-2">
                              {tag.message || 'Well implemented'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                        <p className="text-slate-600">No properly implemented meta tags found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="warning" className="space-y-4 mt-2">
                    {warningTags.length > 0 ? (
                      warningTags.map((tag, index) => (
                        <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                          {formatMetaTag(tag)}
                          <div className="flex items-center mt-2">
                            {getStatusIndicator(tag.status)}
                            <p className="text-sm text-slate-600 ml-2">
                              {tag.message || 'Needs improvement'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                        <p className="text-slate-600">No warnings found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="missing" className="space-y-4 mt-2">
                    {missingTags.length > 0 ? (
                      missingTags.map((tag, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-100">
                          {formatMetaTag(tag)}
                          <div className="flex items-center mt-2">
                            {getStatusIndicator(tag.status)}
                            <p className="text-sm text-slate-600 ml-2">
                              {tag.message || 'Missing or needs attention'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                        <p className="text-slate-600">No missing meta tags</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Desktop View (Side by side cards) */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <CodeIcon className="text-primary mr-2" />
              Meta Tags Found
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {analysis.metaTags.length > 0 ? (
                analysis.metaTags.map((tag, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {formatMetaTag(tag)}
                    {tag.status && (
                      <div className="flex items-center mt-2">
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
        
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <LightbulbIcon className="text-accent mr-2" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
              {analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start pb-5 border-b border-slate-200 last:border-0">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white font-bold text-xs">{rec.id}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{rec.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                      <div className="mt-2 font-mono text-xs bg-slate-100 p-3 rounded border border-slate-200 text-slate-700 overflow-auto">
                        <pre className="whitespace-pre-wrap break-all">{rec.implementation}</pre>
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
    </div>
  );
}
