
import { useTranscription } from "@/contexts/TranscriptionContext";
import TranscriptDisplay from "../TranscriptDisplay";
import ProcedureCodeValidator from "../procedure-codes/ProcedureCodeValidator";

const TranscriptArea = () => {
  const { transcript, speakers, segments, isProcessing, setProcedureCodes } = useTranscription();
  
  const handleProcedureCodesValidated = (codes: string[]) => {
    setProcedureCodes(codes);
  };

  if (!transcript || isProcessing) {
    return null;
  }

  return (
    <div className="mt-6">
      <TranscriptDisplay
        transcript={transcript}
        speakers={speakers}
        segments={segments}
      />
      
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
