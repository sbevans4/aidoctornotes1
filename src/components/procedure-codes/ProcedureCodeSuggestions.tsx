
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CheckCircle2 } from "lucide-react";
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
  const { procedureCodes, isLoading, error, saveCode } = useProcedureCodes(transcript);
  const [refreshing, setRefreshing] = useState(false);

  const handleSelectCode = (code: string) => {
    onSelectCode(code);
    saveCode(code);
  };

  const isCodeSelected = (code: string) => {
    return selectedCodes.includes(code);
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          <p className="text-sm text-gray-500">Suggesting procedure codes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!procedureCodes.length) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Suggested Procedure Codes</h4>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={async () => {
            if (!transcript) return;
            setRefreshing(true);
            await saveCode("refresh");
            setRefreshing(false);
          }}
          disabled={refreshing || !transcript}
        >
          {refreshing ? (
            <span className="flex items-center">
              <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full mr-1"></div>
              Refreshing...
            </span>
          ) : (
            "Refresh suggestions"
          )}
        </Button>
      </div>
      
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
    </div>
  );
};

export default ProcedureCodeSuggestions;
