
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: (await supabase.auth.getUser()).data.user?.id,
            email,
            full_name: fullName,
            has_used_trial: false,
            purchase_date: null,
            refund_requested: false,
            refund_request_date: null
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/medical-documentation");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Start Your One-Time Trial"}
        </Button>
        <p className="text-sm text-gray-600 text-center mt-2">
          100% Money-Back Guarantee - Try Risk-Free
        </p>
      </form>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between">
            See Example Documentation
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Sample Conversation</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Doctor:</strong> "Hello Mrs. Smith, how are you feeling today?"</p>
                <p><strong>Patient:</strong> "Hi Doctor, I've been experiencing some shoulder pain for the past week, especially when reaching overhead."</p>
                <p><strong>Doctor:</strong> "Can you show me where it hurts the most? And does this movement cause pain?" *demonstrates shoulder abduction*</p>
                <p><strong>Patient:</strong> "Yes, right here *points to anterior shoulder* and that movement definitely increases the pain."</p>
                <p><strong>Doctor:</strong> "I'm going to perform some specific tests to evaluate your rotator cuff..."</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI-Generated SOAP Note</h3>
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
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
