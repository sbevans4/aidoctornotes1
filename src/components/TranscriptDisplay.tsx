
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
}

interface Segment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

interface TranscriptDisplayProps {
  transcript?: string;
  text?: string;
  speakers?: Speaker[];
  segments?: Segment[];
  isLoading?: boolean;
  error?: string;
  className?: string;
}

const TranscriptDisplay = ({ 
  transcript, 
  text, 
  speakers = [], 
  segments = [],
  isLoading = false,
  error,
  className = ''
}: TranscriptDisplayProps) => {
  // Use either transcript or text prop
  const transcriptContent = transcript || text;
  
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader className="animate-spin h-4 w-4 mr-2" />
            Transcribing Audio
          </CardTitle>
          <CardDescription>This may take a moment...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-300 border-l-transparent animate-spin mb-4"></div>
            <p className="text-sm text-muted-foreground">Processing your audio</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} border-red-200`}>
        <CardHeader>
          <CardTitle className="text-red-500">Transcription Error</CardTitle>
          <CardDescription>There was a problem with your audio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!transcriptContent && segments.length === 0) return null;

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
        <CardDescription>Audio transcription result</CardDescription>
      </CardHeader>
      <CardContent>
        {speakers.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Speakers</h4>
            <div className="flex flex-wrap gap-2">
              {speakers.map((speaker) => (
                <Badge key={speaker.id} variant="outline">
                  {speaker.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {segments.length > 0 ? (
          <div className="space-y-4">
            {segments.map((segment, index) => {
              // Find speaker name if available
              const speakerId = segment.speaker;
              const speakerName = speakerId ? 
                speakers.find(s => s.id === speakerId)?.name || speakerId : 
                undefined;
                
              return (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg transition-all hover:shadow-md"
                >
                  {speakerName && (
                    <Badge variant="secondary" className="mb-2">
                      {speakerName}
                    </Badge>
                  )}
                  <p className="text-gray-700 break-words">{segment.text}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {Math.floor(segment.start)}s - {Math.ceil(segment.end)}s
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 break-words">{transcriptContent}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptDisplay;
