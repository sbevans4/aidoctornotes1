
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, AlertCircle } from "lucide-react";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";
import SoapNoteTab from "./soap-note/SoapNoteTab";
import SoapNoteFooter from "./soap-note/SoapNoteFooter";

interface SoapNoteDisplayProps {
  soapNote?: SoapNote;
  isLoading?: boolean;
  error?: string;
  onSave?: (note: SoapNote) => Promise<void>;
  onEmail?: (note: SoapNote) => Promise<void>;
  className?: string;
  editable?: boolean;
}

const SoapNoteDisplay = ({
  soapNote,
  isLoading = false,
  error,
  onSave,
  onEmail,
  className = "",
  editable = true
}: SoapNoteDisplayProps) => {
  const [editedNote, setEditedNote] = useState<SoapNote | undefined>(soapNote);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  
  // Update local state when prop changes
  React.useEffect(() => {
    if (soapNote) {
      setEditedNote(soapNote);
    }
  }, [soapNote]);
  
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader className="animate-spin h-4 w-4 mr-2" />
            Generating SOAP Note
          </CardTitle>
          <CardDescription>Please wait while we analyze the transcription...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200`}>
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Generation Error
          </CardTitle>
          <CardDescription>There was a problem creating the SOAP note</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!editedNote) return null;

  const handleSave = async () => {
    if (!onSave || !editedNote) return;
    
    try {
      setIsSaving(true);
      await onSave(editedNote);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the onSave function
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmail = async () => {
    if (!onEmail || !editedNote) return;
    
    try {
      setIsEmailing(true);
      await onEmail(editedNote);
    } catch (error) {
      // Error handling is done in the onEmail function
    } finally {
      setIsEmailing(false);
    }
  };

  const handleContentChange = (section: keyof SoapNote, value: string) => {
    if (editedNote) {
      setEditedNote({...editedNote, [section]: value});
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>SOAP Note</CardTitle>
        <CardDescription>
          {isEditing ? "Edit your documentation" : "Medical documentation based on the transcription"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subjective" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="subjective">S</TabsTrigger>
            <TabsTrigger value="objective">O</TabsTrigger>
            <TabsTrigger value="assessment">A</TabsTrigger>
            <TabsTrigger value="plan">P</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subjective">
            <SoapNoteTab
              title="Subjective"
              content={editedNote.subjective}
              isEditing={isEditing}
              onChange={(value) => handleContentChange("subjective", value)}
            />
          </TabsContent>
          
          <TabsContent value="objective">
            <SoapNoteTab
              title="Objective"
              content={editedNote.objective}
              isEditing={isEditing}
              onChange={(value) => handleContentChange("objective", value)}
            />
          </TabsContent>
          
          <TabsContent value="assessment">
            <SoapNoteTab
              title="Assessment"
              content={editedNote.assessment}
              isEditing={isEditing}
              onChange={(value) => handleContentChange("assessment", value)}
            />
          </TabsContent>
          
          <TabsContent value="plan">
            <SoapNoteTab
              title="Plan"
              content={editedNote.plan}
              isEditing={isEditing}
              onChange={(value) => handleContentChange("plan", value)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <SoapNoteFooter
          soapNote={editedNote}
          isEditing={isEditing}
          isSaving={isSaving}
          isEmailing={isEmailing}
          editable={editable}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onEmail={onEmail ? handleEmail : undefined}
        />
      </CardFooter>
    </Card>
  );
};

export default SoapNoteDisplay;
