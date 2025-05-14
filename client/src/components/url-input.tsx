import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GlobeIcon, SearchIcon, AlertCircleIcon } from "lucide-react";

interface UrlInputProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function UrlInput({ onAnalyze, isLoading, error }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!url.trim() || !url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      return;
    }
    
    await onAnalyze(url);
  };

  return (
    <Card className="max-w-3xl mx-auto mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <GlobeIcon className="h-5 w-5" />
            </div>
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              className="pl-10 py-6"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-blue-700 text-white px-6 py-6 h-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <SearchIcon className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </form>

        {isLoading && (
          <div className="mt-4 flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-slate-600">Analyzing website...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
