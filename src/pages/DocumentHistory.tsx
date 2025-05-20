
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Updated to handle JSON type for suggested_codes
interface ClinicalNote {
  id: string;
  created_at: string;
  content: any;
  status: string;
  suggested_codes: string[] | any; // Updated to accept both string[] and Json type
}

export default function DocumentHistory() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const notesPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, page, activeTab]);

  const fetchNotes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from("clinical_notes")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Filter by status if not "all"
      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }

      // Add pagination
      const from = (page - 1) * notesPerPage;
      const to = from + notesPerPage - 1;
      
      const { data, count, error } = await query
        .range(from, to);

      if (error) throw error;

      // Convert data to match ClinicalNote interface
      const formattedNotes: ClinicalNote[] = data?.map(note => ({
        id: note.id,
        created_at: note.created_at,
        content: note.content,
        status: note.status,
        suggested_codes: Array.isArray(note.suggested_codes) 
          ? note.suggested_codes 
          : typeof note.suggested_codes === 'string'
            ? [note.suggested_codes]
            : []
      })) || [];

      setNotes(formattedNotes);
      setTotalPages(Math.ceil((count || 0) / notesPerPage));
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from("clinical_notes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
      toast({
        title: "Document deleted",
        description: "The document has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document. Please try again.",
      });
    }
  };

  const handleDownload = (note: ClinicalNote) => {
    try {
      // Create SOAP note text
      let content = note.content;
      let noteText = `SOAP Note - Generated on ${new Date(note.created_at).toLocaleString()}\n\n`;
      noteText += `Subjective: ${content.subjective}\n\n`;
      noteText += `Objective: ${content.objective}\n\n`;
      noteText += `Assessment: ${content.assessment}\n\n`;
      noteText += `Plan: ${content.plan}\n\n`;
      noteText += `Suggested Codes: ${note.suggested_codes.join(", ")}\n`;
      
      // Create blob and download
      const blob = new Blob([noteText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soap_note_${new Date(note.created_at).toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Document downloaded",
        description: "The document has been downloaded as a text file.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download document. Please try again.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <>
      <Helmet>
        <title>Document History | AIDoctorNotes</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Document History</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Generated Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg bg-muted/20">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No documents found.</p>
                    <p className="text-sm text-muted-foreground">
                      Generated notes will appear here.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>A list of your generated medical documents.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Procedure Codes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell>{formatDate(note.created_at)}</TableCell>
                          <TableCell>
                            <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                              note.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {note.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {Array.isArray(note.suggested_codes) ? note.suggested_codes.join(", ") : "N/A"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(note)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete
                                    the document from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                
                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => page > 1 && setPage(p => p - 1)}
                          className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        Page {page} of {totalPages}
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => page < totalPages && setPage(p => p + 1)}
                          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
