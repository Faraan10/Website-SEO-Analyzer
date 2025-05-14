import { Card, CardContent } from "@/components/ui/card";
import { SEOAnalysis } from "@shared/schema";
import { CheckIcon, XIcon, AlertTriangleIcon } from "lucide-react";

interface SEOScoreCardProps {
  analysis: SEOAnalysis;
}

export default function SEOScoreCard({ analysis }: SEOScoreCardProps) {
  // Calculate the dash array for the circle based on the score
  const circumference = 2 * Math.PI * 15.9155;
  const dashOffset = circumference * (1 - analysis.score / 100);
  
  // Get the appropriate color based on the score
  const getScoreColor = () => {
    if (analysis.score >= 80) return "stroke-success";
    if (analysis.score >= 50) return "stroke-warning";
    return "stroke-error";
  };

  // Get color for text based on score
  const getScoreTextColor = () => {
    if (analysis.score >= 80) return "text-success";
    if (analysis.score >= 50) return "text-warning";
    return "text-error";
  };
  
  // Get the appropriate icon and background based on status
  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch(status) {
      case 'good':
        return {
          bg: "bg-success",
          icon: <CheckIcon className="text-white" size={14} />
        };
      case 'warning':
        return {
          bg: "bg-warning",
          icon: <AlertTriangleIcon className="text-white" size={14} />
        };
      case 'error':
        return {
          bg: "bg-error",
          icon: <XIcon className="text-white" size={14} />
        };
    }
  };

  // Count different status types
  const goodCount = analysis.summaryPoints.filter(point => point.status === 'good').length;
  const warningCount = analysis.summaryPoints.filter(point => point.status === 'warning').length;
  const errorCount = analysis.summaryPoints.filter(point => point.status === 'error').length;

  return (
    <Card className="max-w-5xl mx-auto mb-8 overflow-hidden shadow-md">
      <div className="flex flex-col lg:flex-row">
        <div className="p-6 lg:w-1/3 flex flex-col items-center justify-center bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <svg className="w-40 h-40 md:w-48 md:h-48" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  className={getScoreColor()}
                  strokeWidth="3"
                  strokeDasharray={`${circumference}, ${circumference}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">
                  {analysis.score}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-slate-800 font-semibold text-xl mb-1">SEO Score</p>
              <p className={`${getScoreTextColor()} font-medium`}>
                {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : analysis.score >= 40 ? 'Needs Improvement' : 'Poor'}
              </p>
              <p className="text-slate-500 text-sm mt-1">Based on meta tag implementation</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 lg:w-2/3">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Analysis Summary</h2>
          
          {/* Status Counters */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
              <div className="text-2xl font-bold text-success">{goodCount}</div>
              <div className="text-sm text-slate-600">Passed</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 text-center">
              <div className="text-2xl font-bold text-warning">{warningCount}</div>
              <div className="text-sm text-slate-600">Warnings</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
              <div className="text-2xl font-bold text-error">{errorCount}</div>
              <div className="text-sm text-slate-600">Failed</div>
            </div>
          </div>
          
          <div className="space-y-3 mt-5">
            {analysis.summaryPoints.map((point, index) => {
              const { bg, icon } = getStatusIcon(point.status);
              return (
                <div key={index} className="flex items-start">
                  <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center mt-0.5 flex-shrink-0 mr-3`}>
                    {icon}
                  </div>
                  <p className="text-slate-700">{point.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
