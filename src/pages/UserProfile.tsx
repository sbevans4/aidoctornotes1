
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionPlanCard } from "@/components/subscription/SubscriptionPlanCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Clock, Check, AlertTriangle } from "lucide-react";

interface ProfileData {
  created_at: string;
  email: string;
  full_name: string;
  has_used_trial: boolean;
  id: string;
  purchase_date: string;
  refund_request_date: string;
  refund_requested: boolean;
  updated_at: string;
  organization?: string;
  title?: string;
  phone?: string;
}

interface UserProfileData {
  email: string;
  fullName: string;
  organization?: string;
  title?: string;
  phone?: string;
}

const UserProfile = () => {
  const [profileData, setProfileData] = useState<UserProfileData>({
    email: "",
    fullName: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { plans, currentSubscription, subscribeToPlan } = useSubscription();
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Fetch profile data from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // Type assertion to handle the extended profile fields
      const typedProfile = profile as ProfileData | null;
      
      setProfileData({
        email: user.email || "",
        fullName: typedProfile?.full_name || "",
        organization: typedProfile?.organization || "",
        title: typedProfile?.title || "",
        phone: typedProfile?.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Update profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: profileData.email,
          full_name: profileData.fullName,
          organization: profileData.organization,
          title: profileData.title,
          phone: profileData.phone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profileData.email, {
        redirectTo: window.location.origin + '/auth?reset=true',
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse space-y-4 w-full max-w-2xl">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Your Profile | ConvoNotes Genius</title>
        <meta 
          name="description" 
          content="Manage your profile settings and subscription details"
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="email">Email address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={handleInputChange}
                        readOnly
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={profileData.fullName} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="space-y-2 w-full sm:w-1/2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input 
                        id="organization" 
                        name="organization" 
                        value={profileData.organization || ""} 
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2 w-full sm:w-1/2">
                      <Label htmlFor="title">Professional title</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={profileData.title || ""} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="space-y-2 w-full sm:w-1/2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={profileData.phone || ""} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentSubscription ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-100 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            Active Subscription
                            <Badge variant="outline" className="ml-2">
                              {currentSubscription.subscription_plans?.tier}
                            </Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your subscription renews on {formatDate(currentSubscription.current_period_end)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Current Plan</h4>
                          <p className="text-sm text-muted-foreground">
                            {currentSubscription.subscription_plans?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${currentSubscription.subscription_plans?.price}/mo
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">Next billing date</h4>
                        </div>
                        <div>
                          {formatDate(currentSubscription.current_period_end)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                      <Button variant="outline" onClick={() => window.open('/subscription-plans', '_self')}>
                        Change Plan
                      </Button>
                      
                      <Button variant="destructive" onClick={() => {
                        // This would typically open a confirmation dialog
                        toast({
                          title: "Coming Soon",
                          description: "Subscription cancellation will be available soon",
                        });
                      }}>
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-amber-50 border border-amber-100 rounded-md p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">No Active Subscription</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Subscribe to a plan to access premium features
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {plans?.slice(0, 2).map((plan) => (
                        <SubscriptionPlanCard 
                          key={plan.id}
                          plan={plan}
                          isCurrentPlan={false}
                          subscribeToPlan={subscribeToPlan}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open('/subscription-plans', '_self')}
                      >
                        View All Plans
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your password to secure your account
                    </p>
                  </div>
                  <Button variant="outline" onClick={handlePasswordReset}>
                    Reset Password
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium mb-1 text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all your data
                    </p>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      // This would typically open a confirmation dialog
                      toast({
                        title: "Coming Soon",
                        description: "Account deletion will be available soon",
                      });
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfile;
