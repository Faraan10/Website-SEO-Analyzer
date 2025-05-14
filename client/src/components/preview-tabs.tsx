import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SEOAnalysis } from "@shared/schema";
import { SearchIcon, CheckIcon, XIcon, AlertTriangleIcon } from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

interface PreviewTabsProps {
  analysis: SEOAnalysis;
}

export default function PreviewTabs({ analysis }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState("google");
  
  // Find specific meta tags
  const findMetaTag = (property: string) => {
    return analysis.metaTags.find(tag => 
      tag.property === property || tag.name === property
    );
  };
  
  const getMetaTagStatus = (property: string) => {
    const tag = findMetaTag(property);
    if (!tag) return 'missing';
    return tag.status || 'good';
  };
  
  // Get content from meta tags
  const ogTitle = findMetaTag('og:title')?.content || analysis.title || '';
  const ogDescription = findMetaTag('og:description')?.content || analysis.description || '';
  const ogImage = findMetaTag('og:image')?.content || '';
  const ogUrl = findMetaTag('og:url')?.content || analysis.url || '';
  const ogType = findMetaTag('og:type')?.content || '';
  
  const twitterTitle = findMetaTag('twitter:title')?.content || ogTitle;
  const twitterDescription = findMetaTag('twitter:description')?.content || ogDescription;
  const twitterImage = findMetaTag('twitter:image')?.content || ogImage;
  const twitterCard = findMetaTag('twitter:card')?.content || '';
  
  // Calculate title and description lengths
  const titleLength = analysis.title?.length || 0;
  const descriptionLength = analysis.description?.length || 0;

  // Status indicator component for consistency 
  const TagStatus = ({ status }: { status: string }) => {
    if (status === 'good') {
      return <span className="text-success font-medium flex items-center"><CheckIcon className="w-4 h-4 mr-1" /> Present</span>;
    } else if (status === 'warning') {
      return <span className="text-warning font-medium flex items-center"><AlertTriangleIcon className="w-4 h-4 mr-1" /> Missing</span>;
    } else {
      return <span className="text-error font-medium flex items-center"><XIcon className="w-4 h-4 mr-1" /> Missing</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <Tabs defaultValue="google" className="w-full">
        <TabsList className="flex w-full border-b rounded-none justify-start h-auto p-0 bg-transparent mb-4">
          <TabsTrigger 
            value="google" 
            className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <SearchIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Google Preview</span>
            <span className="sm:hidden">Google</span>
          </TabsTrigger>
          <TabsTrigger 
            value="facebook" 
            className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <FaFacebook className="w-4 h-4 mr-2 text-[#3b5998]" />
            <span className="hidden sm:inline">Facebook Preview</span>
            <span className="sm:hidden">Facebook</span>
          </TabsTrigger>
          <TabsTrigger 
            value="twitter" 
            className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            <FaTwitter className="w-4 h-4 mr-2 text-[#1da1f2]" />
            <span className="hidden sm:inline">Twitter Preview</span>
            <span className="sm:hidden">Twitter</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="mt-0">
          <Card className="shadow-md">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <SearchIcon className="mr-2 text-primary" />
                Google Search Result Preview
              </h3>
              <div className="border border-slate-200 rounded-lg p-4 max-w-xl mx-auto mb-4">
                <p className="text-xl text-blue-700 font-medium mb-1 truncate">
                  {analysis.title || 'No title found'}
                </p>
                <p className="text-green-800 text-sm mb-1 break-all">
                  {analysis.url}
                </p>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {analysis.description || 'No description found'}
                </p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
                <h4 className="font-medium text-slate-800 mb-3">SEO Metrics</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Title Length:</span>
                    <div className="flex items-center">
                      <span className="mr-2">{titleLength} characters</span>
                      {titleLength === 0 && <span className="text-error text-xs px-2 py-0.5 bg-red-50 rounded-full">Missing</span>}
                      {titleLength > 0 && titleLength < 30 && <span className="text-warning text-xs px-2 py-0.5 bg-amber-50 rounded-full">Too Short</span>}
                      {titleLength > 60 && <span className="text-warning text-xs px-2 py-0.5 bg-amber-50 rounded-full">Too Long</span>}
                      {titleLength >= 30 && titleLength <= 60 && <span className="text-success text-xs px-2 py-0.5 bg-green-50 rounded-full">Good</span>}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Description Length:</span>
                    <div className="flex items-center">
                      <span className="mr-2">{descriptionLength} characters</span>
                      {descriptionLength === 0 && <span className="text-error text-xs px-2 py-0.5 bg-red-50 rounded-full">Missing</span>}
                      {descriptionLength > 0 && descriptionLength < 80 && <span className="text-warning text-xs px-2 py-0.5 bg-amber-50 rounded-full">Too Short</span>}
                      {descriptionLength > 158 && <span className="text-warning text-xs px-2 py-0.5 bg-amber-50 rounded-full">Too Long</span>}
                      {descriptionLength >= 80 && descriptionLength <= 158 && <span className="text-success text-xs px-2 py-0.5 bg-green-50 rounded-full">Good</span>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook" className="mt-0">
          <Card className="shadow-md">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FaFacebook className="mr-2 text-[#3b5998]" />
                Facebook Preview
              </h3>
              
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="border border-slate-200 rounded-lg overflow-hidden md:flex-1 mb-5 md:mb-0 mx-auto max-w-sm">
                  {ogImage ? (
                    <div className="w-full h-52 bg-slate-200 flex items-center justify-center">
                      <img 
                        src={ogImage}
                        alt="Social media preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Handle image load error by replacing with a placeholder
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23CBD5E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-slate-200 flex items-center justify-center text-slate-400">
                      No og:image available
                    </div>
                  )}
                  <div className="p-3 bg-[#f2f3f5]">
                    <p className="text-[#606770] text-xs uppercase tracking-wide">
                      {analysis.url && analysis.url.startsWith('http') ? new URL(analysis.url).hostname : 'website.com'}
                    </p>
                    <p className="text-[#1d2129] font-medium leading-tight my-1">
                      {ogTitle || 'No title found'}
                    </p>
                    <p className="text-[#606770] text-sm line-clamp-2">
                      {ogDescription || 'No description found'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 md:flex-1">
                  <h4 className="font-medium text-slate-800 mb-3">Open Graph Tags</h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span>og:title</span>
                      <TagStatus status={getMetaTagStatus('og:title')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>og:description</span>
                      <TagStatus status={getMetaTagStatus('og:description')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>og:image</span>
                      <TagStatus status={getMetaTagStatus('og:image')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>og:url</span>
                      <TagStatus status={getMetaTagStatus('og:url')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>og:type</span>
                      <TagStatus status={getMetaTagStatus('og:type')} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="twitter" className="mt-0">
          <Card className="shadow-md">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FaTwitter className="mr-2 text-[#1da1f2]" />
                Twitter Preview
              </h3>
              
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="border border-slate-200 rounded-lg overflow-hidden md:flex-1 mb-5 md:mb-0 mx-auto max-w-sm">
                  {twitterImage ? (
                    <div className="w-full h-52 bg-slate-200 flex items-center justify-center">
                      <img 
                        src={twitterImage}
                        alt="Twitter card preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Handle image load error
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23CBD5E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-slate-200 flex items-center justify-center text-slate-400">
                      No twitter:image available
                    </div>
                  )}
                  <div className="p-3 bg-white">
                    <p className="text-[#536471] text-sm mb-1">
                      {analysis.url && analysis.url.startsWith('http') ? new URL(analysis.url).hostname : 'website.com'}
                    </p>
                    <p className="text-[#0f1419] font-medium leading-tight mb-1">
                      {twitterTitle || 'No title found'}
                    </p>
                    <p className="text-[#536471] text-sm line-clamp-2">
                      {twitterDescription || 'No description found'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 md:flex-1">
                  <h4 className="font-medium text-slate-800 mb-3">Twitter Card Tags</h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span>twitter:card</span>
                      <TagStatus status={getMetaTagStatus('twitter:card')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>twitter:title</span>
                      <TagStatus status={getMetaTagStatus('twitter:title')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>twitter:description</span>
                      <TagStatus status={getMetaTagStatus('twitter:description')} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>twitter:image</span>
                      <TagStatus status={getMetaTagStatus('twitter:image')} />
                    </div>
                  </div>
                  
                  {(!twitterCard || !findMetaTag('twitter:title')) && (
                    <div className="flex items-center mt-4 p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                      <AlertTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>Using Open Graph fallbacks for preview</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
