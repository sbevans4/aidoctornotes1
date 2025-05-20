
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Campaign = {
  id: string;
  name: string;
  code_prefix: string;
  reward_amount: number;
  discount_percentage: number;
  conversion_rate: number;
  total_signups: number;
  active: boolean;
};

export const ReferralABTestingPanel: React.FC = () => {
  const [name, setName] = useState("");
  const [codePrefix, setCodePrefix] = useState("");
  const [rewardAmount, setRewardAmount] = useState(10);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock campaign data - in a real implementation, this would come from the database
  const mockCampaigns = [
    { 
      id: "1", 
      name: "Standard Campaign", 
      code_prefix: "REF", 
      reward_amount: 10, 
      discount_percentage: 10, 
      conversion_rate: 12.5, 
      total_signups: 48,
      active: true
    },
    { 
      id: "2", 
      name: "High Reward Campaign", 
      code_prefix: "VIP", 
      reward_amount: 20, 
      discount_percentage: 15, 
      conversion_rate: 17.2, 
      total_signups: 32,
      active: true 
    },
    { 
      id: "3", 
      name: "Low Reward Campaign", 
      code_prefix: "ECO", 
      reward_amount: 5, 
      discount_percentage: 5, 
      conversion_rate: 8.1, 
      total_signups: 24,
      active: false 
    }
  ];

  // In a real implementation, this would fetch from the database
  const { data: campaigns = mockCampaigns } = useQuery({
    queryKey: ["referral-campaigns"],
    queryFn: async () => {
      // This would be replaced with an actual API call
      return mockCampaigns;
    }
  });

  const createCampaign = useMutation({
    mutationFn: async (campaignData: Omit<Campaign, "id" | "conversion_rate" | "total_signups" | "active">) => {
      // This would be replaced with an actual API call
      console.log("Creating campaign:", campaignData);
      return { id: Date.now().toString(), ...campaignData, conversion_rate: 0, total_signups: 0, active: true };
    },
    onSuccess: () => {
      toast.success({
        title: "Campaign Created",
        description: "Your new A/B testing campaign has been created.",
      });
      setName("");
      setCodePrefix("");
      setRewardAmount(10);
      setDiscountPercentage(10);
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create campaign: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive",
      });
    }
  });

  const toggleCampaignStatus = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      // This would be replaced with an actual API call
      console.log(`Setting campaign ${id} to ${active ? "active" : "inactive"}`);
      return { id, active };
    },
    onSuccess: (data) => {
      toast.success({
        title: `Campaign ${data.active ? "Activated" : "Deactivated"}`,
        description: `The campaign has been ${data.active ? "activated" : "deactivated"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    }
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !codePrefix) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    createCampaign.mutate({ name, code_prefix: codePrefix, reward_amount: rewardAmount, discount_percentage: discountPercentage });
  };

  const chartData = campaigns.map(campaign => ({
    name: campaign.name,
    ConversionRate: campaign.conversion_rate,
    SignUps: campaign.total_signups
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create A/B Testing Campaign</CardTitle>
          <CardDescription>
            Test different referral incentives to optimize your conversion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Summer Promotion"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="codePrefix">Code Prefix</Label>
                <Input 
                  id="codePrefix" 
                  value={codePrefix} 
                  onChange={(e) => setCodePrefix(e.target.value.toUpperCase())} 
                  placeholder="SUMMER"
                  required
                  maxLength={6}
                />
                <p className="text-xs text-gray-500">Used to generate unique codes for this campaign</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rewardAmount">Referrer Reward ($)</Label>
                <Input 
                  id="rewardAmount" 
                  type="number" 
                  value={rewardAmount} 
                  onChange={(e) => setRewardAmount(Number(e.target.value))} 
                  min={0}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Referred User Discount (%)</Label>
                <Input 
                  id="discountPercentage" 
                  type="number" 
                  value={discountPercentage} 
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))} 
                  min={0}
                  max={100}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateCampaign}>Create Campaign</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>A/B Testing Performance</CardTitle>
          <CardDescription>Compare performance across different referral campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ConversionRate" fill="#8884d8" name="Conversion Rate (%)" />
                <Bar dataKey="SignUps" fill="#82ca9d" name="Total Sign-ups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Manage your A/B testing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-xs text-gray-500">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Prefix</th>
                    <th className="py-2 px-4 text-left">Reward</th>
                    <th className="py-2 px-4 text-left">Discount</th>
                    <th className="py-2 px-4 text-left">Conversion</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{campaign.name}</td>
                      <td className="py-3 px-4">{campaign.code_prefix}</td>
                      <td className="py-3 px-4">${campaign.reward_amount}</td>
                      <td className="py-3 px-4">{campaign.discount_percentage}%</td>
                      <td className="py-3 px-4">{campaign.conversion_rate}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleCampaignStatus.mutate({ id: campaign.id, active: !campaign.active })}
                        >
                          {campaign.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No campaigns yet. Create your first campaign to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
