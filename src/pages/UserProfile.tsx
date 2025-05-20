
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User as UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  practiceName: z.string().optional(),
  specialty: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UserProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || "",
      practiceName: profile?.practice_name || "",
      specialty: profile?.specialty || "",
    },
  });
  
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.full_name || "",
        practiceName: profile.practice_name || "",
        specialty: profile.specialty || "",
      });
    }
  }, [profile, form]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: values.fullName,
        practice_name: values.practiceName,
        specialty: values.specialty,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>User Profile | AIDoctorNotes</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal and practice information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="practiceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Woodland Medical Center" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Specialty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="emergency">Emergency Medicine</SelectItem>
                            <SelectItem value="family">Family Medicine</SelectItem>
                            <SelectItem value="internal">Internal Medicine</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and subscription status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-medium">{profile?.full_name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-muted-foreground">Account ID</Label>
                  <span className="text-sm font-mono">{user?.id?.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-muted-foreground">Account Created</Label>
                  <span className="text-sm">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-muted-foreground">Email Verified</Label>
                  <span className="text-sm">{user?.email_confirmed_at ? "Yes" : "No"}</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => refreshProfile()}>
                Refresh Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
