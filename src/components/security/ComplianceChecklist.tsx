
import React from "react";
import { Check, Circle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "complete" | "in-progress" | "not-started";
  requiredFor: string[];
}

interface ComplianceChecklistProps {
  items: ComplianceItem[];
  className?: string;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  items,
  className,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <Check className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-amber-500" />;
      case "not-started":
        return <AlertTriangle className="h-5 w-5 text-gray-300" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-100 text-green-800";
      case "in-progress":
        return "bg-amber-50 border-amber-100 text-amber-800";
      case "not-started":
        return "bg-gray-50 border-gray-100 text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-xl font-semibold mb-4">Compliance Checklist</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-4 border rounded-lg flex items-start gap-3",
              getStatusClass(item.status)
            )}
          >
            <div className="mt-0.5">{getStatusIcon(item.status)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex gap-1">
                  {item.requiredFor.map((requirement) => (
                    <span
                      key={requirement}
                      className="px-2 py-0.5 bg-white/50 border text-xs rounded-full"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm mt-1 opacity-90">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;
