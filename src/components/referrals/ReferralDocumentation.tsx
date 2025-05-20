
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileDown, Gift, Users, DollarSign, Mail, Link, AlertTriangle } from "lucide-react";

export const ReferralDocumentation: React.FC = () => {
  const handleDownloadGuide = () => {
    // In a real implementation, this would generate a PDF or download a pre-generated file
    alert("In a production environment, this would download a PDF guide.");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">How the Referral Program Works</h2>
        <p className="text-gray-600">
          Our referral program is designed to reward you for bringing new users to AIDoctorNotes.
          Learn how to maximize your rewards below.
        </p>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={handleDownloadGuide}
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Complete Guide
          </Button>
        </div>
      </div>

      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-blue-600" />
            <CardTitle>Referral Benefits</CardTitle>
          </div>
          <CardDescription>What you and your colleagues receive</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-green-100 rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Your Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-baseline">
                  <span className="text-green-600 font-bold">•</span>
                  <span>$10 off your next bill for each successful referral</span>
                </li>
                <li className="flex gap-2 items-baseline">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Earn up to 10 referral bonuses per month ($100 total)</span>
                </li>
                <li className="flex gap-2 items-baseline">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Credits automatically applied to your next invoice</span>
                </li>
              </ul>
            </div>

            <div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Your Colleague's Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-baseline">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>20% discount on their first 3 months of subscription</span>
                </li>
                <li className="flex gap-2 items-baseline">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Full access to all features of their chosen plan</span>
                </li>
                <li className="flex gap-2 items-baseline">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Ability to participate in the referral program themselves</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Refer Colleagues</CardTitle>
          <CardDescription>Two simple ways to invite colleagues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-lg p-5">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                Option 1: Send Email Invitation
              </h3>
              <ol className="space-y-4 ml-4">
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">1.</span>
                  Navigate to the "Referral Program" tab in your dashboard
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">2.</span>
                  Enter your colleague's email address in the invitation form
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">3.</span>
                  Click "Send Invitation" and we'll send them an email with your referral code
                </li>
              </ol>
            </div>

            <div className="border rounded-lg p-5">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Link className="h-5 w-5 text-indigo-600" />
                Option 2: Share Your Referral Link
              </h3>
              <ol className="space-y-4 ml-4">
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">1.</span>
                  Click "Copy Referral Link" in your dashboard
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">2.</span>
                  Share the link via messaging apps, social media, or email
                </li>
                <li className="relative pl-6">
                  <span className="absolute left-0 font-bold">3.</span>
                  When colleagues click your link and sign up, they'll be connected to your account
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions about our referral program</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>When do I receive my referral credit?</AccordionTrigger>
              <AccordionContent>
                <p>
                  You receive your $10 credit once your referred colleague signs up for a paid subscription plan. 
                  The credit is automatically applied to your next billing cycle. If your credits exceed your 
                  subscription amount, the remaining balance will roll over to future months.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is there a limit to how many colleagues I can refer?</AccordionTrigger>
              <AccordionContent>
                <p>
                  You can refer as many colleagues as you'd like, but there's a daily limit of 10 invitations 
                  to prevent spam. You can earn up to 10 referral bonuses per month ($100 total). 
                  This limit resets at the beginning of each month.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How long does the referral link remain valid?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Your referral links and codes never expire, but the 20% discount offer for your colleagues 
                  is valid for 30 days after they receive the invitation. After that, they can still use your 
                  referral link to sign up, but the discount may no longer apply.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I refer myself using another email address?</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-md border border-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="text-amber-800">
                    No. Self-referrals are strictly prohibited and will result in the forfeit of any referral credits. 
                    Our system has measures to detect self-referrals based on IP addresses, payment methods, and other factors.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How can I track my referral status?</AccordionTrigger>
              <AccordionContent>
                <p>
                  You can track all your referrals in the Analytics tab of the Referral Dashboard. 
                  This includes pending invitations, completed signups, and successful conversions that resulted in credits. 
                  You can also see your total earnings and conversion rate.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Program Terms</CardTitle>
          <CardDescription>Important policies and guidelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Eligibility</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must have an active AIDoctorNotes subscription to receive referral credits</li>
              <li>Referrals must be unique individuals with their own accounts and payment methods</li>
              <li>Self-referrals and fraudulent referrals are prohibited and will result in forfeiture of credits</li>
            </ul>

            <h3 className="font-semibold">Credit Application</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Credits are applied automatically to your next billing cycle</li>
              <li>Referral credits cannot be exchanged for cash or other rewards</li>
              <li>Credits expire after 12 months if not used</li>
            </ul>

            <h3 className="font-semibold">Program Changes</h3>
            <p className="text-sm text-gray-600">
              AIDoctorNotes reserves the right to modify or terminate the referral program at any time. 
              Any earned credits will be honored regardless of program changes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
