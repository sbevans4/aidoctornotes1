
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import VoiceRecorder from './VoiceRecorder';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MedicalDocumentationForm = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Make sure you have a DeepSeek API key configured in your Supabase project for SOAP note generation.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Medical Documentation Assistant</CardTitle>
          <CardDescription>
            Record your patient conversation, select a template, and get an accurate SOAP note
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceRecorder />
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500 mt-6">
        <p>How to use this tool:</p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Select a documentation template that matches your specialty</li>
          <li>Click the red record button and have your conversation with the patient</li>
          <li>Stop the recording when finished</li>
          <li>Review the transcript for accuracy</li>
          <li>Enter relevant procedure codes</li>
          <li>Wait for your SOAP note to be generated</li>
          <li>Review and edit the note if needed</li>
        </ol>
      </div>
    </div>
  );
};

export default MedicalDocumentationForm;
