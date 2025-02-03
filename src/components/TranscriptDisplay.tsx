interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay = ({ transcript }: TranscriptDisplayProps) => {
  if (!transcript) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Transcript</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700">{transcript}</p>
      </div>
    </div>
  );
};

export default TranscriptDisplay;