import { Textarea } from "@/components/ui/textarea";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface SoapNoteDisplayProps {
  soapNote: SoapNote;
}

const SoapNoteDisplay = ({ soapNote }: SoapNoteDisplayProps) => {
  if (!soapNote.subjective) return null;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold">SOAP Note</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Subjective</h4>
          <Textarea value={soapNote.subjective} readOnly className="w-full" />
        </div>
        <div>
          <h4 className="font-medium mb-2">Objective</h4>
          <Textarea value={soapNote.objective} readOnly className="w-full" />
        </div>
        <div>
          <h4 className="font-medium mb-2">Assessment</h4>
          <Textarea value={soapNote.assessment} readOnly className="w-full" />
        </div>
        <div>
          <h4 className="font-medium mb-2">Plan</h4>
          <Textarea value={soapNote.plan} readOnly className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default SoapNoteDisplay;