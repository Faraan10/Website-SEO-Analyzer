import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SEOAnalysis } from "@shared/schema";
import { SearchIcon } from "lucide-react";
import { FaFacebook, FaTwitter } from "react-icons/fa";

interface PreviewTabsProps {
  analysis: SEOAnalysis;
}

export default function PreviewTabs({ analysis }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'facebook' | 'twitter'>('google');
  
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

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex border-b border-slate-200 mb-4">
        <button
          onClick={() => setActiveTab('google')}
          className={`px-4 py-2 font-medium hover:text-primary focus:outline-none ${
            activeTab === 'google' ? 'tab-active text-primary border-b-2 border-primary' : 'text-slate-600'
          }`}
        >
          Google Preview
        </button>
        <button
          onClick={() => setActiveTab('facebook')}
          className={`px-4 py-2 font-medium hover:text-primary focus:outline-none ${
            activeTab === 'facebook' ? 'tab-active text-primary border-b-2 border-primary' : 'text-slate-600'
          }`}
        >
          Facebook Preview
        </button>
        <button
          onClick={() => setActiveTab('twitter')}
          className={`px-4 py-2 font-medium hover:text-primary focus:outline-none ${
            activeTab === 'twitter' ? 'tab-active text-primary border-b-2 border-primary' : 'text-slate-600'
          }`}
        >
          Twitter Preview
        </button>
      </div>
      
      <Card className={activeTab === 'google' ? 'block' : 'hidden'}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <SearchIcon className="mr-1 text-primary" />
            Google Search Result Preview
          </h3>
          <div className="border border-slate-200 rounded-lg p-4 max-w-xl">
            <p className="text-xl text-blue-700 font-medium mb-1 truncate">
              {analysis.title || 'No title found'}
            </p>
            <p className="text-green-800 text-sm mb-1">
              {analysis.url}
            </p>
            <p className="text-sm text-slate-700 line-clamp-2">
              {analysis.description || 'No description found'}
            </p>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p>
              <span className="font-medium">Title:</span> {titleLength} characters 
              (Optimal: 50-60)
              {titleLength > 60 && <span className="text-warning"> - Too long</span>}
              {titleLength < 30 && titleLength > 0 && <span className="text-warning"> - Too short</span>}
              {titleLength === 0 && <span className="text-error"> - Missing</span>}
            </p>
            <p>
              <span className="font-medium">Description:</span> {descriptionLength} characters 
              (Optimal: 120-158)
              {descriptionLength > 158 && <span className="text-warning"> - Too long</span>}
              {descriptionLength < 80 && descriptionLength > 0 && <span className="text-warning"> - Too short</span>}
              {descriptionLength === 0 && <span className="text-error"> - Missing</span>}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className={activeTab === 'facebook' ? 'block' : 'hidden'}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <FaFacebook className="mr-1 text-[#3b5998]" />
            Facebook Preview
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden max-w-md">
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
                {ogTitle}
              </p>
              <p className="text-[#606770] text-sm line-clamp-2">
                {ogDescription}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium">og:title:</span> 
              {getMetaTagStatus('og:title') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">og:description:</span> 
              {getMetaTagStatus('og:description') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">og:image:</span> 
              {getMetaTagStatus('og:image') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">og:url:</span> 
              {getMetaTagStatus('og:url') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">og:type:</span> 
              {getMetaTagStatus('og:type') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-warning"> ⚠ Missing</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className={activeTab === 'twitter' ? 'block' : 'hidden'}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <FaTwitter className="mr-1 text-[#1da1f2]" />
            Twitter Preview
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden max-w-md">
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
                {twitterTitle}
              </p>
              <p className="text-[#536471] text-sm line-clamp-2">
                {twitterDescription}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium">twitter:card:</span> 
              {getMetaTagStatus('twitter:card') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">twitter:title:</span> 
              {getMetaTagStatus('twitter:title') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">twitter:description:</span> 
              {getMetaTagStatus('twitter:description') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            <p>
              <span className="font-medium">twitter:image:</span> 
              {getMetaTagStatus('twitter:image') === 'good' ? (
                <span className="text-success"> ✓ Present</span>
              ) : (
                <span className="text-error"> ✗ Missing</span>
              )}
            </p>
            {(!twitterCard || !findMetaTag('twitter:title')) && (
              <p className="text-sm text-slate-700 mt-2 italic">
                Note: Using Open Graph fallbacks for preview
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
