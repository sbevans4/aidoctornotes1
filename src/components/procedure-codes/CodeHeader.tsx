
import React from "react";
import { Info } from "lucide-react";

const CodeHeader = () => {
  return (
    <>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold" id="procedure-codes-heading">
          Procedure Codes
        </h2>
        <Info className="h-4 w-4 text-muted-foreground cursor-help" aria-hidden="true" />
      </div>
      <p className="text-sm text-muted-foreground" id="procedure-codes-description">
        Enter procedure codes in the format: one letter followed by 4-5 digits (e.g., A1234 or B12345)
      </p>
    </>
  );
};

export default CodeHeader;
