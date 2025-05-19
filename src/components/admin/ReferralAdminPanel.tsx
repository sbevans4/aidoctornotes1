
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, Filter, RefreshCw, Ban, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const ReferralAdminPanel: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch all referrals for admin view
  const { data: referrals, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-referrals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referral_invites')
        .select(`
          id,
          email,
          code,
          status,
          created_at,
          updated_at,
          referrer_id,
          profiles:referrer_id (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch fraud flags (would connect to a real system in production)
  const { data: fraudFlags } = useQuery({
    queryKey: ['fraud-flags'],
    queryFn: async () => {
      // This would be a real API call in production
      // Here we're simulating some flagged emails
      return {
        flaggedEmails: [
          'suspicious@example.com',
          'multiple-accounts@test.com'
        ],
        flaggedIps: [
          '192.168.1.100',
          '10.0.0.50'
        ]
      };
    }
  });

  // Update referral status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('referral_invites')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-referrals'] });
      toast({
        title: "Status Updated",
        description: "The referral status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Filter referrals based on search term and status filter
  const filteredReferrals = referrals?.filter((referral: any) => {
    const matchesSearch = searchTerm === '' || 
      referral.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (referral.profiles?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (referral.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle view details
  const handleViewDetails = (referral: any) => {
    setSelectedReferral(referral);
    setIsDetailsOpen(true);
  };

  // Check if email is flagged for potential fraud
  const isEmailFlagged = (email: string) => {
    return fraudFlags?.flaggedEmails.includes(email);
  };

  // Handle status update
  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus.mutate({ id, status }); // Changed from 'newStatus' to 'status'
    setIsDetailsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Error loading referrals: {error instanceof Error ? error.message : "Unknown error"}</p>
        <Button onClick={() => refetch()} className="mt-2" variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold">Referral Management</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral Analytics</CardTitle>
          <CardDescription>Overview of referral program performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Invites</p>
              <p className="text-2xl font-bold">{referrals?.length || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold">
                {referrals?.filter(r => r.status === 'pending').length || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold">
                {referrals?.filter(r => r.status === 'completed').length || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Flagged</p>
              <p className="text-2xl font-bold">
                {referrals?.filter(r => isEmailFlagged(r.email)).length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Invitations</CardTitle>
          <CardDescription>Manage and monitor all referral invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search by email or name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
              <div className="col-span-4">Email</div>
              <div className="col-span-3">Referrer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="divide-y">
              {filteredReferrals?.length > 0 ? (
                filteredReferrals.map((referral: any) => (
                  <div key={referral.id} className="grid grid-cols-12 p-3 text-sm items-center">
                    <div className="col-span-4 flex items-center gap-2">
                      {referral.email}
                      {isEmailFlagged(referral.email) && (
                        <Badge variant="destructive" className="h-5">Flagged</Badge>
                      )}
                    </div>
                    <div className="col-span-3 text-gray-600">
                      {referral.profiles?.full_name || referral.profiles?.email || 'Unknown'}
                    </div>
                    <div className="col-span-2 text-gray-600">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-2">
                      <Badge className={`
                        ${referral.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                        ${referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                        ${referral.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                      `}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(referral)}>
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No referrals found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedReferral && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Referral Details</DialogTitle>
              <DialogDescription>
                View and manage referral information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedReferral.email}</div>
                
                <div className="font-medium">Referrer:</div>
                <div className="col-span-2">
                  {selectedReferral.profiles?.full_name || selectedReferral.profiles?.email || 'Unknown'}
                </div>
                
                <div className="font-medium">Code:</div>
                <div className="col-span-2">{selectedReferral.code}</div>
                
                <div className="font-medium">Created:</div>
                <div className="col-span-2">
                  {new Date(selectedReferral.created_at).toLocaleDateString() + ' ' + 
                   new Date(selectedReferral.created_at).toLocaleTimeString()}
                </div>
                
                <div className="font-medium">Status:</div>
                <div className="col-span-2">
                  <Badge className={`
                    ${selectedReferral.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedReferral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedReferral.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedReferral.status.charAt(0).toUpperCase() + selectedReferral.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Label>Update Status</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button 
                    onClick={() => handleStatusUpdate(selectedReferral.id, 'completed')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" /> Mark Completed
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedReferral.id, 'pending')}
                    size="sm"
                    variant="outline"
                  >
                    Reset to Pending
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedReferral.id, 'rejected')}
                    size="sm"
                    variant="destructive"
                  >
                    <Ban className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
