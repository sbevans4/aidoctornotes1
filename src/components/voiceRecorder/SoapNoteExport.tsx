
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SoapNote } from "@/contexts/TranscriptionContext";
import { FilePdf, Loader2, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SoapNoteExportProps {
  soapNote: SoapNote;
  noteId?: string;
}

const SoapNoteExport = ({ soapNote, noteId }: SoapNoteExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    
    try {
      // Call the edge function to generate a PDF
      const { data, error } = await supabase.functions.invoke('generate-soap-pdf', {
        body: { 
          soapNote: soapNote,
          noteId: noteId 
        }
      });
      
      if (error) throw error;
      
      if (!data?.pdfUrl) {
        throw new Error('No PDF URL returned');
      }
      
      // Open the PDF in a new tab
      window.open(data.pdfUrl, '_blank');
      
      toast({
        title: "PDF Generated",
        description: "Your SOAP note has been exported as a PDF",
      });
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareSoapNote = async () => {
    setIsSharing(true);
    
    try {
      // This would normally use the Web Share API, but for simplicity, 
      // we'll just copy a link to the clipboard
      
      if (!noteId) {
        throw new Error('No note ID available for sharing');
      }
      
      const shareUrl = `${window.location.origin}/notes/${noteId}`;
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        
        toast({
          title: "Link Copied",
          description: "A link to this note has been copied to your clipboard",
        });
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (error: any) {
      console.error("Error sharing note:", error);
      toast({
        title: "Share Failed",
        description: error.message || "Failed to share note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        onClick={generatePDF}
        disabled={isExporting}
        className="flex items-center"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <FilePdf className="h-4 w-4 mr-2" />
        )}
        Export as PDF
      </Button>
      
      <Button
        variant="outline"
        onClick={shareSoapNote}
        disabled={isSharing || !noteId}
        className="flex items-center"
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4 mr-2" />
        )}
        Share
      </Button>
    </div>
  );
};

export default SoapNoteExport;
