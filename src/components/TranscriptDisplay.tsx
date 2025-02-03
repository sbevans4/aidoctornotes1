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
  transcript: string;
  speakers?: Speaker[];
  segments?: Segment[];
}

const TranscriptDisplay = ({ transcript, speakers, segments }: TranscriptDisplayProps) => {
  if (!transcript) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Transcript</h3>
      
      {speakers && speakers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Speakers</h4>
          <div className="flex gap-2">
            {speakers.map((speaker) => (
              <span
                key={speaker.id}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {speaker.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {segments && segments.length > 0 ? (
        <div className="space-y-4">
          {segments.map((segment, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              {segment.speaker && (
                <span className="text-sm font-medium text-medical-primary mb-1 block">
                  {segment.speaker}
                </span>
              )}
              <p className="text-gray-700">{segment.text}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {Math.floor(segment.start)}s - {Math.ceil(segment.end)}s
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;