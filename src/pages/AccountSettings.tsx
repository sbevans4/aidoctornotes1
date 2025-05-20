
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, KeyRound, MousePointer2, Bell } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import PersonalizationSettings from "@/components/PersonalizationSettings";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountSettings() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailSummary: true,
    newFeatures: true,
    securityAlerts: true,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const onChangePassword = async (values: PasswordFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: values.currentPassword,
      });
      
      if (signInError) {
        form.setError("currentPassword", { 
          message: "Current password is incorrect" 
        });
        throw new Error("Current password is incorrect");
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (error) throw error;
      
      form.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      if (!error.message.includes("Current password is incorrect")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update password. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // In a real app, you'd call a server function to delete the account
      // For now, we'll just sign the user out
      toast({
        title: "Account deletion requested",
        description: "A request to delete your account has been submitted. Our team will process this soon.",
      });
      
      // Sign out the user
      await signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to request account deletion. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
    
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Account Settings | AIDoctorNotes</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="password">
              <KeyRound className="h-4 w-4 mr-2" />
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="personalization">
              <MousePointer2 className="h-4 w-4 mr-2" />
              Personalization
            </TabsTrigger>
            <TabsTrigger value="account">
              <LogOut className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onChangePassword)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            Password must be at least 8 characters with one number and one special character.
                          </p>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage your notification settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Weekly Email Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your documentation activity.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailSummary}
                    onCheckedChange={() => handleNotificationChange('emailSummary')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Feature Announcements</h4>
                    <p className="text-sm text-muted-foreground">
                      Be the first to know about new features and improvements.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.newFeatures}
                    onCheckedChange={() => handleNotificationChange('newFeatures')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Security Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified about important security-related activity.
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={() => handleNotificationChange('securityAlerts')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="personalization">
            <PersonalizationSettings />
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign out from your account on this device.
                  </p>
                  <Button variant="outline" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
