
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Save, Mail, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";

interface SoapNoteFooterProps {
  soapNote: SoapNote;
  isEditing: boolean;
  isSaving: boolean;
  isEmailing: boolean;
  editable: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onEmail?: () => Promise<void>;
}

const SoapNoteFooter: React.FC<SoapNoteFooterProps> = ({
  soapNote,
  isEditing,
  isSaving,
  isEmailing,
  editable,
  onEdit,
  onSave,
  onEmail
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyFull = async () => {
    if (!soapNote) return;
    
    const fullNote = `
SOAP NOTE

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}
    `.trim();
    
    try {
      await navigator.clipboard.writeText(fullNote);
      setCopied(true);
      toast({
        title: "Copied",
        description: "SOAP note copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {editable && (
        <>
          {isEditing ? (
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button variant="outline" onClick={onEdit}>
              Edit Note
            </Button>
          )}
        </>
      )}
      
      <Button 
        variant={copied ? "default" : "secondary"} 
        onClick={handleCopyFull}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            Copy Note
          </>
        )}
      </Button>
      
      {onEmail && (
        <Button 
          variant="outline" 
          onClick={onEmail} 
          disabled={isEmailing}
        >
          {isEmailing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
          {isEmailing ? "Sending..." : "Email Note"}
        </Button>
      )}
    </div>
  );
};

export default SoapNoteFooter;
