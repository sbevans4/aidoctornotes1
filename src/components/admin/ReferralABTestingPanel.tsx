
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Save, Trash2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Dummy data for testing
const campaignPerformanceData = [
  { name: 'Campaign A', invites: 120, signups: 80, conversions: 40 },
  { name: 'Campaign B', invites: 150, signups: 60, conversions: 35 },
  { name: 'Campaign C', invites: 180, signups: 100, conversions: 70 },
];

const conversionData = [
  { name: 'Campaign A', value: 33.3 },
  { name: 'Campaign B', value: 23.3 },
  { name: 'Campaign C', value: 38.9 },
];

export const ReferralABTestingPanel: React.FC = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'Campaign A', description: 'Standard referral offer', status: 'active' },
    { id: '2', name: 'Campaign B', description: 'Double reward offer', status: 'active' },
    { id: '3', name: 'Campaign C', description: 'Limited time offer', status: 'paused' },
  ]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    status: 'draft'
  });
  const [activeTab, setActiveTab] = useState('campaigns');

  const handleSaveCampaign = () => {
    if (!newCampaign.name) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for this campaign",
        variant: "destructive",
      });
      return;
    }
    
    const id = Math.random().toString(36).substring(2, 9);
    setCampaigns([...campaigns, { ...newCampaign, id }]);
    setNewCampaign({ name: '', description: '', status: 'draft' });
    
    toast({
      title: "Campaign created",
      description: "New A/B test campaign has been created",
    });
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    
    toast({
      title: "Campaign deleted",
      description: "The campaign has been removed",
    });
  };

  const handleUpdateCampaignStatus = (id: string, status: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, status } : campaign
    ));
    
    toast({
      title: "Campaign updated",
      description: `Campaign status changed to ${status}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Referral A/B Testing</CardTitle>
          <CardDescription>
            Create and manage A/B test campaigns for your referral program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns" className="space-y-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-12 p-4 border-b bg-slate-50 font-medium">
                  <div className="col-span-4">Campaign</div>
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="grid grid-cols-12 p-4 border-b items-center">
                    <div className="col-span-4">{campaign.name}</div>
                    <div className="col-span-5">{campaign.description}</div>
                    <div className="col-span-2">
                      <Select
                        defaultValue={campaign.status}
                        onValueChange={(newStatus) => handleUpdateCampaignStatus(campaign.id, newStatus)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="p-0 h-auto text-red-500 hover:text-red-700 hover:bg-transparent"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input 
                        id="campaign-name" 
                        value={newCampaign.name} 
                        onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                        placeholder="Enter campaign name" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-description">Description</Label>
                      <Input 
                        id="campaign-description" 
                        value={newCampaign.description} 
                        onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
                        placeholder="Describe this campaign" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="campaign-status">Initial Status</Label>
                      <Select 
                        defaultValue={newCampaign.status}
                        onValueChange={(value) => setNewCampaign({...newCampaign, status: value})}
                      >
                        <SelectTrigger id="campaign-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleSaveCampaign}
                      className="w-full flex items-center gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Campaign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Compare performance metrics across campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={campaignPerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="invites" fill="#8884d8" name="Invites Sent" />
                        <Bar dataKey="signups" fill="#82ca9d" name="Sign Ups" />
                        <Bar dataKey="conversions" fill="#ffc658" name="Conversions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="conversion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate Analysis</CardTitle>
                  <CardDescription>Conversion rates by campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={conversionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}%`}
                        >
                          {conversionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      Conversion rate measures the percentage of invited users who completed a subscription purchase
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
