
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { validateEmail, validatePassword, isNetworkError, formatAuthError } from "@/utils/formValidation";

// Enhanced schema with password validation
const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(val => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine(val => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with enhanced validation
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Focus full name input on mount
  useEffect(() => {
    if (fullNameInputRef.current) {
      fullNameInputRef.current.focus();
    }
  }, []);

  const handleSignUp = async (values: SignUpFormValues) => {
    setLoading(true);
    setNetworkError(null);
    
    try {
      // Email validation
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.valid) {
        form.setError("email", { message: emailValidation.message });
        setLoading(false);
        return;
      }
      
      // Password validation 
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.valid) {
        form.setError("password", { message: passwordValidation.message });
        setLoading(false);
        return;
      }

      const { error: signUpError, data } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });

      if (signUpError) throw signUpError;

      // Create profile if user is created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: values.email,
              full_name: values.fullName,
              has_used_trial: false,
              purchase_date: null,
              refund_requested: false,
              refund_request_date: null
            }
          ]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/auth/verify");
    } catch (error: any) {
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else if (error.message && error.message.includes("already registered")) {
        form.setError("email", { message: "Email already registered. Please sign in instead." });
      } else {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: formatAuthError(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setLoading(true);
    setNetworkError(null);
    
    try {
      const testEmail = "dr.note.tester@example.com";
      const testPassword = "DrSupportTrial2025!";
      const testFullName = "DR Note Tester";
      
      // Try to sign in first to check if user exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      // If sign in fails due to user not found, create the user
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              full_name: testFullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: testEmail,
                full_name: testFullName,
                has_used_trial: false,
                purchase_date: null,
                refund_requested: false,
                refund_request_date: null
              }
            ]);

          if (profileError) throw profileError;
        }
        
        // Sign in after creating account
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (secondSignInError) throw secondSignInError;
      }
      
      toast({
        title: "Test account accessed",
        description: "You're now signed in as DR Note Tester",
      });
      
      navigate("/medical-documentation");
    } catch (error: any) {
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else {
        toast({
          variant: "destructive",
          title: "Demo Access Failed",
          description: formatAuthError(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {networkError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>{networkError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4" aria-label="Sign up form">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    disabled={loading}
                    aria-required="true"
                    ref={fullNameInputRef}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="text-xs text-muted-foreground">
                  Password must be at least 8 characters with one number and one special character.
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Creating Account...
              </>
            ) : (
              "Start Your One-Time Trial"
            )}
          </Button>
          <p className="text-sm text-gray-600 text-center mt-2">
            100% Money-Back Guarantee - Try Risk-Free
          </p>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleTestSignIn} 
        disabled={loading}
        aria-label="Access demo account"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Loading...
          </>
        ) : (
          "Demo Account Access"
        )}
      </Button>

      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            aria-expanded={isOpen}
            aria-controls="example-documentation-content"
          >
            See Example Documentation
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4" id="example-documentation-content">
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Example 1: Orthopedic Case</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Doctor:</strong> "Hello Mrs. Smith, how are you feeling today?"</p>
                <p><strong>Patient:</strong> "Hi Doctor, I've been experiencing some shoulder pain for the past week, especially when reaching overhead."</p>
                <p><strong>Doctor:</strong> "Can you show me where it hurts the most? And does this movement cause pain?" *demonstrates shoulder abduction*</p>
                <p><strong>Patient:</strong> "Yes, right here *points to anterior shoulder* and that movement definitely increases the pain."</p>
                <p><strong>Doctor:</strong> "I'm going to perform some specific tests to evaluate your rotator cuff..."</p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">AI-Generated SOAP Note <span className="text-green-600">(Generated in 12 seconds)</span></h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Procedure Codes:</strong> 99213, 29826</p>
                  <p><strong>Subjective:</strong> Patient presents with one-week history of right shoulder pain, particularly notable during overhead movements. Pain is described as moderate (6/10) and worsens with activity. No previous trauma reported.</p>
                  <p><strong>Objective:</strong> Examination reveals tenderness over the anterior shoulder. Positive impingement signs with Hawkins and Neer tests. ROM limited: Forward flexion 150°, Abduction 140°, External rotation 60°. Strength testing shows mild weakness in supraspinatus (4/5).</p>
                  <p><strong>Assessment:</strong> Right shoulder impingement syndrome with possible rotator cuff tendinitis. Findings consistent with subacromial bursitis.</p>
                  <p><strong>Plan:</strong> 
                    1. Arthroscopic subacromial decompression scheduled (CPT: 29826)
                    2. Pre-operative PT evaluation
                    3. NSAIDs for pain management
                    4. Follow-up in 1 week for pre-op evaluation
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-2">Example 2: Dental Case</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Dentist:</strong> "What brings you in today?"</p>
                <p><strong>Patient:</strong> "I was eating Jordan almonds yesterday and I heard a crack in my tooth. It doesn't hurt at all, but I can feel the broken part with my tongue."</p>
                <p><strong>Dentist:</strong> "Let me take a look. Which tooth was it?"</p>
                <p><strong>Patient:</strong> "It's this one here, upper right back tooth."</p>
                <p><strong>Dentist:</strong> "I see the fracture. Let me check the extent of the damage..."</p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">AI-Generated SOAP Note <span className="text-green-600">(Generated in 8 seconds)</span></h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Procedure Codes:</strong> D2750, D2950</p>
                  <p><strong>Subjective:</strong> Patient reports cracking tooth #3 while eating Jordan almonds yesterday. Denies pain or sensitivity. No previous trauma to the area. No hot/cold sensitivity reported.</p>
                  <p><strong>Objective:</strong> Clinical examination reveals fractured palatal cusp on tooth #3, extending subgingivally. No apparent pulpal exposure. Tooth is responsive to cold testing, with normal response. Percussion testing negative. Periodontal probing depths WNL. Radiographic examination shows no periapical pathology.</p>
                  <p><strong>Assessment:</strong> Fractured palatal cusp tooth #3, requiring crown build-up and full coverage restoration. Pulpal status: vital. Periodontal status: healthy.</p>
                  <p><strong>Plan:</strong> 
                    1. Core build-up (D2950)
                    2. PFM crown (D2750)
                    3. Schedule patient for 2-hour appointment
                    4. Patient advised on temporary food precautions
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
