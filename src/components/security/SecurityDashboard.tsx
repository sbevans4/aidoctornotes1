
import React from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceChecklist, { ComplianceItem } from "./ComplianceChecklist";

interface SecurityDashboardProps {
  complianceItems: ComplianceItem[];
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ complianceItems }) => {
  // Calculate compliance statistics
  const totalItems = complianceItems.length;
  const completeItems = complianceItems.filter(item => item.status === "complete").length;
  const inProgressItems = complianceItems.filter(item => item.status === "in-progress").length;
  const notStartedItems = complianceItems.filter(item => item.status === "not-started").length;

  const compliancePercentage = Math.round((completeItems / totalItems) * 100);
  
  // Group by compliance type
  const hipaaItems = complianceItems.filter(item => item.requiredFor.includes("HIPAA"));
  const soc2Items = complianceItems.filter(item => item.requiredFor.includes("SOC 2"));
  const gdprItems = complianceItems.filter(item => item.requiredFor.includes("GDPR"));
  
  // Calculate completion percentages for each standard
  const hipaaPercentage = Math.round((hipaaItems.filter(item => item.status === "complete").length / hipaaItems.length) * 100);
  const soc2Percentage = Math.round((soc2Items.filter(item => item.status === "complete").length / soc2Items.length) * 100);
  const gdprPercentage = Math.round((gdprItems.filter(item => item.status === "complete").length / gdprItems.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{compliancePercentage}%</div>
              <Shield className={`h-5 w-5 ${compliancePercentage >= 80 ? 'text-green-500' : 'text-amber-500'}`} />
            </div>
            <Progress value={compliancePercentage} className="h-2 mt-2" />
            <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground mt-3">
              <div className="flex flex-col">
                <span className="font-medium text-green-600">{completeItems}</span>
                <span>Complete</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-amber-600">{inProgressItems}</span>
                <span>In Progress</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-500">{notStartedItems}</span>
                <span>Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">HIPAA Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{hipaaPercentage}%</div>
              {hipaaPercentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <Progress value={hipaaPercentage} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-3">
              {hipaaItems.filter(item => item.status === "complete").length} of {hipaaItems.length} requirements met
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SOC 2 Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{soc2Percentage}%</div>
              {soc2Percentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <Progress value={soc2Percentage} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-3">
              {soc2Items.filter(item => item.status === "complete").length} of {soc2Items.length} requirements met
            </div>
          </CardContent>
        </Card>
      </div>

      <ComplianceChecklist items={complianceItems} className="mt-8" />
    </div>
  );
};

export default SecurityDashboard;
