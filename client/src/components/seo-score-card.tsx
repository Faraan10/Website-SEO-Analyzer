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
  
  // Get the appropriate icon and background based on status
  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch(status) {
      case 'good':
        return {
          bg: "bg-success",
          icon: <CheckIcon className="text-white text-xs" />
        };
      case 'warning':
        return {
          bg: "bg-warning",
          icon: <AlertTriangleIcon className="text-white text-xs" />
        };
      case 'error':
        return {
          bg: "bg-error",
          icon: <XIcon className="text-white text-xs" />
        };
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:w-1/3 flex flex-col items-center justify-center bg-slate-50">
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 36 36">
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
              <text x="18" y="20.35" className="text-3xl font-bold" textAnchor="middle" fill="#1e293b">
                {analysis.score}
              </text>
            </svg>
          </div>
          <div className="text-center mt-2">
            <p className="text-slate-800 font-semibold text-lg">SEO Score</p>
            <p className="text-slate-500 text-sm">Based on meta tag implementation</p>
          </div>
        </div>
        
        <div className="p-6 md:w-2/3">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Analysis Summary</h2>
          <div className="space-y-3">
            {analysis.summaryPoints.map((point, index) => {
              const { bg, icon } = getStatusIcon(point.status);
              return (
                <div key={index} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center mr-3`}>
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
