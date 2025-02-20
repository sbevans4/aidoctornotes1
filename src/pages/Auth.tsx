
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Auth() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Medical Documentation Assistant</h2>
          <p className="mt-2 text-gray-600">Streamline your clinical documentation with AI</p>
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

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/medical-documentation")} 
            className="w-full"
          >
            Try It Now
          </Button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Start your free trial today - No credit card required
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
