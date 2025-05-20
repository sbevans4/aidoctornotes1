
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CheckCircle2, RefreshCw, History } from "lucide-react";
import { useProcedureCodes } from "@/hooks/useProcedureCodes";

interface ProcedureCodeSuggestionsProps {
  transcript: string | null;
  onSelectCode: (code: string) => void;
  selectedCodes: string[];
}

const ProcedureCodeSuggestions = ({ 
  transcript, 
  onSelectCode,
  selectedCodes 
}: ProcedureCodeSuggestionsProps) => {
  const { 
    procedureCodes, 
    isLoading, 
    error, 
    isRefreshing,
    refreshSuggestedCodes, 
    saveCode, 
    getFrequentCodes 
  } = useProcedureCodes(transcript);
  
  const [activeTab, setActiveTab] = useState("suggested");
  const [frequentCodes, setFrequentCodes] = useState<string[]>([]);
  const [loadingFrequent, setLoadingFrequent] = useState(false);

  useEffect(() => {
    if (activeTab === "frequent") {
      loadFrequentCodes();
    }
  }, [activeTab]);

  const loadFrequentCodes = async () => {
    setLoadingFrequent(true);
    const codes = await getFrequentCodes();
    setFrequentCodes(codes);
    setLoadingFrequent(false);
  };

  const handleSelectCode = (code: string) => {
    onSelectCode(code);
    saveCode(code);
  };

  const handleRefreshCodes = async () => {
    if (!transcript) return;
    await refreshSuggestedCodes(transcript);
  };

  const isCodeSelected = (code: string) => {
    return selectedCodes.includes(code);
  };

  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Procedure Codes</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshCodes}
          disabled={isRefreshing || !transcript || isLoading}
        >
          {isRefreshing ? (
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Refreshing...
            </span>
          ) : (
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh suggestions
            </span>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggested">Suggested Codes</TabsTrigger>
          <TabsTrigger value="frequent">Frequent Codes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggested" className="pt-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <p className="text-sm text-gray-500">Suggesting procedure codes...</p>
            </div>
          ) : procedureCodes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {procedureCodes.map((code) => (
                <Badge 
                  key={code}
                  variant={isCodeSelected(code) ? "default" : "outline"} 
                  className="cursor-pointer px-3 py-1 hover:bg-primary/90 transition-colors"
                  onClick={() => handleSelectCode(code)}
                >
                  {code}
                  {isCodeSelected(code) ? (
                    <CheckCircle2 className="ml-1 h-3 w-3" />
                  ) : (
                    <PlusCircle className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-2">No procedure codes suggested. Try refreshing or enter codes manually.</p>
          )}
        </TabsContent>
        
        <TabsContent value="frequent" className="pt-2">
          {loadingFrequent ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              <p className="text-sm text-gray-500">Loading your frequent codes...</p>
            </div>
          ) : frequentCodes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {frequentCodes.map((code) => (
                <Badge 
                  key={code}
                  variant={isCodeSelected(code) ? "default" : "outline"} 
                  className="cursor-pointer px-3 py-1 hover:bg-primary/90 transition-colors"
                  onClick={() => handleSelectCode(code)}
                >
                  {code}
                  {isCodeSelected(code) ? (
                    <CheckCircle2 className="ml-1 h-3 w-3" />
                  ) : (
                    <PlusCircle className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4">
              <History className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No frequently used codes yet</p>
              <p className="text-xs text-gray-400">Your most used codes will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcedureCodeSuggestions;
