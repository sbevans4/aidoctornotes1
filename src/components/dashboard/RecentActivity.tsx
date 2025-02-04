import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ClinicalNote {
  id: string;
  created_at: string;
  content: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  status: string;
}

interface RecentActivityProps {
  recentNotes: ClinicalNote[];
}

export const RecentActivity = ({ recentNotes }: RecentActivityProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {recentNotes.length > 0 ? (
        <div className="space-y-4">
          {recentNotes.map((note) => (
            <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">
                    SOAP Note
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 capitalize">
                {note.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent notes found</p>
      )}
    </Card>
  );
};