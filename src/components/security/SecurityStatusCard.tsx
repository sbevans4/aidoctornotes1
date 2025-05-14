
import React from "react";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SecurityStatusCardProps {
  isAuthenticated: boolean | null;
  complianceScore?: number;
}

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ 
  isAuthenticated, 
  complianceScore = 85 // Default score for non-authenticated users
}) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Security Status</CardTitle>
              <Shield className="h-7 w-7 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Overall Compliance</span>
                    <span className="font-semibold">{complianceScore}%</span>
                  </div>
                  <Progress value={complianceScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>ISO 27001 Compliance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>GDPR Ready</span>
                  </div>
                </div>
                
                {!isAuthenticated && (
                  <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-md text-sm mt-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span>Sign in to view your organization's detailed security compliance status.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SecurityStatusCard;
