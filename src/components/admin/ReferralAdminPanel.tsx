
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Users, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ReferralStatus = 'pending' | 'verified' | 'completed' | 'rejected';

interface Referral {
  id: string;
  referrer_email: string;
  referrer_id: string;
  referred_email: string;
  referred_id: string | null;
  status: ReferralStatus;
  created_at: string;
  is_suspicious: boolean;
}

export const ReferralAdminPanel = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("recent");
  const { toast } = useToast();

  useEffect(() => {
    fetchReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [referrals, searchQuery, statusFilter]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_invites')
        .select(`
          id,
          referrer_id,
          email,
          status,
          created_at,
          referrers:referrer_id(email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data.map((item: any) => ({
        id: item.id,
        referrer_email: item.referrers?.email || 'Unknown',
        referrer_id: item.referrer_id,
        referred_email: item.email,
        referred_id: null, // This would come from auth.users in a real implementation
        status: item.status,
        created_at: item.created_at,
        is_suspicious: false // This would be determined by fraud detection in a real implementation
      }));
      
      setReferrals(formattedData);
      setFilteredReferrals(formattedData);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast({
        title: "Error loading referrals",
        description: "Could not load referral data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterReferrals = () => {
    let filtered = [...referrals];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ref => ref.status === statusFilter);
    }
    
    // Apply search filter - search in emails
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ref => 
          ref.referrer_email.toLowerCase().includes(query) || 
          ref.referred_email.toLowerCase().includes(query)
      );
    }
    
    setFilteredReferrals(filtered);
  };

  const handleUpdateStatus = async (id: string, status: ReferralStatus) => {
    try {
      const { error } = await supabase
        .from('referral_invites')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setReferrals(referrals.map(ref => 
        ref.id === id ? { ...ref, status } : ref
      ));
      
      toast({
        title: "Status updated",
        description: `Referral status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error updating status",
        description: "Could not update the referral status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFlagSuspicious = async (id: string, isSuspicious: boolean) => {
    try {
      // In a real implementation this would update a is_suspicious field in the database
      // For now we'll just update the local state
      setReferrals(referrals.map(ref => 
        ref.id === id ? { ...ref, is_suspicious: isSuspicious } : ref
      ));
      
      toast({
        title: isSuspicious ? "Marked as suspicious" : "Marked as valid",
        description: isSuspicious 
          ? "Referral has been flagged for review" 
          : "Referral has been marked as valid",
      });
    } catch (error) {
      console.error("Error updating flag:", error);
      toast({
        title: "Error updating flag",
        description: "Could not update the suspicious flag. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "verified":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Verified</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    }
  };

  const renderReferralTable = () => {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Referrer</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Referred</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <tr 
                    key={referral.id} 
                    className={`border-t hover:bg-gray-50 ${
                      referral.is_suspicious ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">{referral.referrer_email}</td>
                    <td className="px-4 py-3">{referral.referred_email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(referral.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Select 
                          defaultValue={referral.status} 
                          onValueChange={(value) => handleUpdateStatus(referral.id, value as ReferralStatus)}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant={referral.is_suspicious ? "default" : "outline"} 
                          size="sm"
                          className={referral.is_suspicious ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => handleFlagSuspicious(referral.id, !referral.is_suspicious)}
                        >
                          {referral.is_suspicious ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                          )}
                          {referral.is_suspicious ? 'Mark Valid' : 'Flag'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {loading ? 'Loading referrals...' : 'No referrals found matching your filters'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Referral Management</CardTitle>
              <CardDescription>
                Review and manage referrals across the platform
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={fetchReferrals}
              >
                <Users className="h-4 w-4" /> 
                Refresh
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" /> 
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                defaultValue="all"
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Recent Referrals</TabsTrigger>
              <TabsTrigger value="suspicious">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Suspicious
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              {renderReferralTable()}
            </TabsContent>
            <TabsContent value="suspicious">
              <div>
                {filteredReferrals.some(r => r.is_suspicious) ? (
                  renderReferralTable()
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Suspicious Referrals</h3>
                    <p className="text-gray-500 mt-2">
                      There are currently no referrals flagged as suspicious.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of the referral system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-green-50 border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">System Status</p>
                  <p className="font-semibold flex items-center mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1.5" />
                    Operational
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rate Limits</p>
                  <p className="font-semibold flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-600 mr-1.5" />
                    10 / day, 50 / month
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Fraud Detection</p>
                  <p className="font-semibold flex items-center mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1.5" />
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
