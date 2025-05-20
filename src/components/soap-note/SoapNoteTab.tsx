
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface SoapNoteTabProps {
  title: string;
  content: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
}

const SoapNoteTab: React.FC<SoapNoteTabProps> = ({
  title,
  content,
  isEditing,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">{title}</h3>
      {isEditing ? (
        <Textarea
          value={content}
          onChange={(e) => onChange && onChange(e.target.value)}
          rows={10}
          className="font-mono"
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
};

export default SoapNoteTab;
