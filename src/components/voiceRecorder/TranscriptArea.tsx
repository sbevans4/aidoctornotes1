
import { useTranscription } from "@/contexts/TranscriptionContext";
import { useState, useEffect } from "react";
import TranscriptDisplay from "../TranscriptDisplay";
import ProcedureCodeValidator from "../procedure-codes/ProcedureCodeValidator";
import ProcedureCodeSuggestions from "../procedure-codes/ProcedureCodeSuggestions";
import { Button } from "@/components/ui/button";
import { Edit, Save, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TranscriptArea = () => {
  const { transcript, speakers, segments, isProcessing, setProcedureCodes, setTranscript, procedureCodes } = useTranscription();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  
  useEffect(() => {
    if (transcript && !isEditing) {
      setEditedTranscript(transcript);
      setOriginalTranscript(transcript);
    }
  }, [transcript, isEditing]);
  
  const handleProcedureCodesValidated = (codes: string[]) => {
    console.log("Procedure codes validated:", codes);
    setProcedureCodes(codes);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    console.log("Saving edited transcript");
    setTranscript(editedTranscript);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    console.log("Canceling transcript edit");
    setEditedTranscript(originalTranscript);
    setIsEditing(false);
  };

  const handleSelectCode = (code: string) => {
    if (procedureCodes.includes(code)) {
      setProcedureCodes(procedureCodes.filter(c => c !== code));
    } else {
      setProcedureCodes([...procedureCodes, code]);
    }
  };

  if (!transcript || isProcessing) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Transcript</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Edit your transcript for accuracy before generating the SOAP note" 
                : "Review your transcript"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea 
              value={editedTranscript}
              onChange={(e) => setEditedTranscript(e.target.value)}
              className="min-h-[200px]"
              placeholder="Edit transcript text here..."
            />
          ) : (
            <TranscriptDisplay
              transcript={transcript}
              speakers={speakers}
              segments={segments}
            />
          )}
          
          {/* Show suggested procedure codes based on transcript */}
          <ProcedureCodeSuggestions 
            transcript={transcript}
            onSelectCode={handleSelectCode}
            selectedCodes={procedureCodes}
          />
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Enter Procedure Codes</h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter the relevant procedure codes to ensure accurate SOAP note generation
        </p>
        <ProcedureCodeValidator onValidate={handleProcedureCodesValidated} />
      </div>
    </div>
  );
};

export default TranscriptArea;
