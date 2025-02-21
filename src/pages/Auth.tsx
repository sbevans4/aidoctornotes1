import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ChevronDown, Check, Building2 } from "lucide-react";
import { PaymentForm } from "@/components/PaymentForm";
import { useSubscription } from "@/hooks/useSubscription";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReferral } from "@/hooks/useReferral";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label, Input } from "@/components/ui/input";

export default function Auth() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { plans, isLoading } = useSubscription();
  const { applyReferral } = useReferral();
  const [referralCode, setReferralCode] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  const standardPlans = plans?.filter(plan => plan.name !== "Enterprise") || [];
  const transcriptionPlans = standardPlans.filter(plan => plan.type === "transcription").slice(0, 3);
  const aiNotesPlans = standardPlans.filter(plan => plan.type === "ai_notes").slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Medical Documentation Assistant</h2>
          <p className="mt-2 text-gray-600">Streamline your clinical documentation with AI</p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Transcription Plans</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {transcriptionPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-6 flex flex-col ${plan.name === 'Pro' ? 'border-2 border-primary relative' : ''}`}
                >
                  {plan.name === 'Pro' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {(plan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full mt-auto"
                    variant={plan.name === 'Pro' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    {plan.name === 'Trial' ? 'Start Trial' : 'Get Started'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">AI-Assisted Notes Plans</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {aiNotesPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`p-6 flex flex-col ${plan.name === 'Pro' ? 'border-2 border-primary relative' : ''}`}
                >
                  {plan.name === 'Pro' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {(plan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full mt-auto"
                    variant={plan.name === 'Pro' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    {plan.name === 'Trial' ? 'Start Trial' : 'Get Started'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/enterprise")}
            >
              <Building2 className="h-4 w-4" />
              Looking for Enterprise plans?
            </Button>
          </div>
        </div>

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

        <div className="text-center">
          <p className="text-sm text-gray-600">
            14-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>

      <Dialog open={!!selectedPlanId} onOpenChange={() => setSelectedPlanId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            {selectedPlanId && (
              <>
                <PaymentForm
                  planId={selectedPlanId}
                  onSuccess={() => {
                    if (referralCode) {
                      applyReferral.mutate(referralCode);
                    }
                    setSelectedPlanId(null);
                    navigate("/medical-documentation");
                  }}
                  onCancel={() => setSelectedPlanId(null)}
                />
                <div className="mt-4">
                  <Label htmlFor="referralCode">Have a referral code?</Label>
                  <Input
                    id="referralCode"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
