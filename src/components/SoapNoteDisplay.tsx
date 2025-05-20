
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Save, Mail, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

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
  const [copied, setCopied] = useState(false);
  
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
      toast({
        title: "Note Saved",
        description: "Your SOAP note has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save the note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmail = async () => {
    if (!onEmail || !editedNote) return;
    
    try {
      setIsEmailing(true);
      await onEmail(editedNote);
      toast({
        title: "Email Sent",
        description: "Your SOAP note has been emailed successfully.",
      });
    } catch (error) {
      toast({
        title: "Email Error",
        description: "Failed to send the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEmailing(false);
    }
  };
  
  const handleCopyFull = async () => {
    if (!editedNote) return;
    
    const fullNote = `
SOAP NOTE

SUBJECTIVE:
${editedNote.subjective}

OBJECTIVE:
${editedNote.objective}

ASSESSMENT:
${editedNote.assessment}

PLAN:
${editedNote.plan}
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
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Subjective</h3>
              {isEditing ? (
                <Textarea
                  value={editedNote.subjective}
                  onChange={(e) => setEditedNote({...editedNote, subjective: e.target.value})}
                  rows={10}
                  className="font-mono"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{editedNote.subjective}</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="objective">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Objective</h3>
              {isEditing ? (
                <Textarea
                  value={editedNote.objective}
                  onChange={(e) => setEditedNote({...editedNote, objective: e.target.value})}
                  rows={10}
                  className="font-mono"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{editedNote.objective}</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assessment">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Assessment</h3>
              {isEditing ? (
                <Textarea
                  value={editedNote.assessment}
                  onChange={(e) => setEditedNote({...editedNote, assessment: e.target.value})}
                  rows={10}
                  className="font-mono"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{editedNote.assessment}</div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="plan">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Plan</h3>
              {isEditing ? (
                <Textarea
                  value={editedNote.plan}
                  onChange={(e) => setEditedNote({...editedNote, plan: e.target.value})}
                  rows={10}
                  className="font-mono"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{editedNote.plan}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        {editable && (
          <>
            {isEditing ? (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
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
            onClick={handleEmail} 
            disabled={isEmailing}
          >
            {isEmailing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
            {isEmailing ? "Sending..." : "Email Note"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SoapNoteDisplay;
