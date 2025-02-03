import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ProcedureCodes = () => {
  const [codes, setCodes] = useState<string[]>(Array(5).fill(""));

  const handleCodeChange = (index: number, value: string) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
  };

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Procedure Codes</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {codes.map((code, index) => (
          <Input
            key={index}
            placeholder={`Code ${index + 1}`}
            value={code}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-full"
          />
        ))}
      </div>
    </Card>
  );
};

export default ProcedureCodes;