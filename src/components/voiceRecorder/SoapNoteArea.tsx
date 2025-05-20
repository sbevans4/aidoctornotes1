
import { useTranscription } from "@/contexts/TranscriptionContext";
import SoapNoteDisplay from "../SoapNoteDisplay";

const SoapNoteArea = () => {
  const { soapNote, isProcessing } = useTranscription();

  if (!soapNote.subjective || isProcessing) {
    return null;
  }

  return (
    <div className="mt-6">
      <SoapNoteDisplay soapNote={soapNote} />
    </div>
  );
};

export default SoapNoteArea;
