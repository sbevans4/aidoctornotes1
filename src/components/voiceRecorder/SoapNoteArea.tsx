
import { useTranscription } from "@/contexts/TranscriptionContext";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Save, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SoapNoteExport from "./SoapNoteExport";

const SoapNoteArea = () => {
  const { soapNote, isProcessing, setSoapNote } = useTranscription();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  if (!soapNote.subjective && !soapNote.objective && !soapNote.assessment && !soapNote.plan) {
    return null;
  }
  
  const handleEdit = (section: string, content: string) => {
    setEditingSection(section);
    setEditContent(content);
  };
  
  const handleSave = () => {
    if (!editingSection) return;
    
    setSoapNote({
      ...soapNote,
      [editingSection]: editContent
    });
    
    setEditingSection(null);
    setEditContent("");
    
    toast({
      title: "Saved",
      description: `The ${editingSection} section has been updated.`,
    });
  };
  
  const handleCancel = () => {
    setEditingSection(null);
    setEditContent("");
  };
  
  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${section} copied to clipboard.`,
    });
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>SOAP Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="subjective">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="subjective">Subjective</TabsTrigger>
              <TabsTrigger value="objective">Objective</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="plan">Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjective">
              <div className="relative">
                {editingSection === "subjective" ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px] p-4"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border rounded-md whitespace-pre-wrap min-h-[200px]">
                      {soapNote.subjective}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(soapNote.subjective, "Subjective")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit("subjective", soapNote.subjective)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="objective">
              <div className="relative">
                {editingSection === "objective" ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px] p-4"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border rounded-md whitespace-pre-wrap min-h-[200px]">
                      {soapNote.objective}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(soapNote.objective, "Objective")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit("objective", soapNote.objective)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="assessment">
              <div className="relative">
                {editingSection === "assessment" ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px] p-4"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border rounded-md whitespace-pre-wrap min-h-[200px]">
                      {soapNote.assessment}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(soapNote.assessment, "Assessment")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit("assessment", soapNote.assessment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="plan">
              <div className="relative">
                {editingSection === "plan" ? (
                  <div className="space-y-4">
                    <Textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[200px] p-4"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white border rounded-md whitespace-pre-wrap min-h-[200px]">
                      {soapNote.plan}
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(soapNote.plan, "Plan")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit("plan", soapNote.plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {!isProcessing && <SoapNoteExport soapNote={soapNote} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default SoapNoteArea;
