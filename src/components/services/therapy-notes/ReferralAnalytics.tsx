
import React, { useState } from "react";
import { useReferral } from "@/hooks/useReferral";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Users, RefreshCw, UserCheck, Clock, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";

export const ReferralAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { referralData, isLoading, error, refetch } = useReferral();
  const { toast } = useToast();
  
  const handleRefresh = () => {
    refetch();
    toast.success({
      title: "Data Refreshed",
      description: "Your referral data has been updated.",
    });
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium">Loading your referral data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full p-8">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">Error Loading Data</CardTitle>
            <CardDescription className="text-red-600">
              We encountered a problem retrieving your referral information.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              Please try refreshing the page or contact support if this issue persists.
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data for charts
  const referralStats = [
    { name: 'Total Sent', value: referralData?.totalReferrals || 0 },
    { name: 'Pending', value: referralData?.pendingReferrals || 0 },
    { name: 'Completed', value: referralData?.completedReferrals || 0 },
    { name: 'Conversions', value: referralData?.successfulConversions || 0 },
  ];

  const conversionRate = referralData?.totalReferrals 
    ? Math.round((referralData.successfulConversions || 0) / referralData.totalReferrals * 100) 
    : 0;

  const pieData = [
    { name: 'Converted', value: referralData?.successfulConversions || 0 },
    { name: 'Not Converted', value: (referralData?.totalReferrals || 0) - (referralData?.successfulConversions || 0) }
  ];

  // New data for enhanced analytics
  const monthlyData = referralData?.monthlyReferrals || {};
  const months = Object.keys(monthlyData);
  
  const timeSeriesData = months.map(month => ({
    name: month,
    referrals: monthlyData[month] || 0
  })).sort((a, b) => {
    const [aYear, aMonth] = a.name.split('-').map(Number);
    const [bYear, bMonth] = b.name.split('-').map(Number);
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  });
  
  // Calculate running average
  let total = 0;
  const timeSeriesWithAvg = timeSeriesData.map((item, index) => {
    total += item.referrals;
    return {
      ...item,
      average: Math.round(total / (index + 1) * 10) / 10
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Generate some mock data for the funnel chart
  const funnelData = [
    { name: 'Emails Sent', value: referralData?.totalReferrals || 0, fill: '#8884d8' },
    { name: 'Emails Opened', value: Math.round(((referralData?.totalReferrals || 0) * 0.75) || 0), fill: '#83a6ed' },
    { name: 'Clicked Link', value: Math.round(((referralData?.totalReferrals || 0) * 0.5) || 0), fill: '#8dd1e1' },
    { name: 'Signed Up', value: Math.round(((referralData?.totalReferrals || 0) * 0.3) || 0), fill: '#82ca9d' },
    { name: 'Converted', value: referralData?.successfulConversions || 0, fill: '#a4de6c' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Referral Analytics</h2>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Stats Cards */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Referrals</p>
                <p className="text-3xl font-bold">{referralData?.totalReferrals || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600">Successful Conversions</p>
                <p className="text-3xl font-bold">{referralData?.successfulConversions || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600">Earnings</p>
                <p className="text-3xl font-bold">${referralData?.earnings || 0}</p>
              </div>
              <CircleDollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600">Conversion Rate</p>
                <p className="text-3xl font-bold">{conversionRate}%</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Performance</CardTitle>
              <CardDescription>
                Breakdown of your referral performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={referralStats}
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
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>
                Percentage of referrals that converted to subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Referral Trends</CardTitle>
              <CardDescription>
                Track your referral performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesWithAvg}
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
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="referrals" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Monthly Referrals"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#82ca9d" 
                      name="Running Average"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cumulative Growth</CardTitle>
              <CardDescription>
                Visualize your referral growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeSeriesWithAvg}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="referrals" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Referrals"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>
                List of your most recent referral invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralData?.recentReferrals && referralData.recentReferrals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-xs text-gray-500">
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralData.recentReferrals.map((referral: any) => (
                        <tr key={referral.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{referral.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${referral.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : referral.status === 'verified'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'}`
                            }>
                              {referral.status === 'completed' ? 'Completed' : 
                               referral.status === 'verified' ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>You haven't sent any referrals yet.</p>
                  <p className="text-sm">Invite colleagues to start earning rewards!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Your Earnings</CardTitle>
              <CardDescription>
                Track your referral earnings and redemption history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Available Credit</p>
                      <p className="text-3xl font-bold">${referralData?.earnings || 0}</p>
                    </div>
                    <CircleDollarSign className="h-10 w-10 text-green-500" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">How It Works</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="bg-blue-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-blue-700 text-xs font-bold">1</div>
                      <span>You earn $10 for each successful referral</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-blue-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-blue-700 text-xs font-bold">2</div>
                      <span>Credits are automatically applied to your next invoice</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-blue-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-blue-700 text-xs font-bold">3</div>
                      <span>Unused credits roll over to future months</span>
                    </li>
                  </ul>
                </div>
                
                {/* This would be populated with real data in a production environment */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Credits</h3>
                  {(referralData?.successfulConversions || 0) > 0 ? (
                    <div className="border rounded-md">
                      <div className="border-b px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Referral Credit</p>
                          <p className="text-sm text-gray-500">Applied to May 2025 invoice</p>
                        </div>
                        <p className="font-semibold text-green-600">+$10.00</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-md">
                      <p>No credits earned yet</p>
                      <p className="text-sm">Get referring to start earning!</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                See how many referrals progress through each stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="value" 
                      barSize={30}
                    >
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Funnel Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The conversion funnel shows how many people progress through each stage of your referral process.
                  A steep drop-off at any stage may indicate an issue to investigate.
                </p>
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                  <h4 className="font-medium mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                    Optimization Tip
                  </h4>
                  <p className="text-sm">
                    Focus on improving the largest drop-off point in your funnel for the biggest impact on conversion rates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
