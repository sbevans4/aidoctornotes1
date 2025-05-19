
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeHelp, Gift, Link, Mail, DollarSign, Users } from "lucide-react";

export const ReferralGuide: React.FC = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <BadgeHelp className="h-6 w-6 text-blue-500" />
          <CardTitle>Referral Program Guide</CardTitle>
        </div>
        <CardDescription>
          Learn how our referral program works and how to get the most out of it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how-it-works">
            <AccordionTrigger>How the Referral Program Works</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our referral program rewards you for bringing colleagues to 
                  ConvoNotes Genius. For each new user who signs up using your 
                  referral code and subscribes to a paid plan, you'll receive:
                </p>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <DollarSign className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">$10 Credit</h4>
                    <p className="text-sm text-gray-600">
                      Applied automatically to your next billing cycle
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Your referral also benefits your colleague, who will receive 
                  a 20% discount on their first 3 months of subscription.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="how-to-refer">
            <AccordionTrigger>How to Refer Colleagues</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  There are two easy ways to refer your colleagues:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-blue-700 text-xs font-bold mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email Invitation
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter your colleague's email address in the "Send an Invitation" 
                        form, and we'll send them a personalized invitation with your 
                        referral code automatically included.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 h-6 w-6 flex items-center justify-center text-blue-700 text-xs font-bold mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        <Link className="h-4 w-4 text-blue-500" />
                        Share Your Link
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Copy your unique referral link and share it directly with 
                        colleagues via messaging apps, social media, or any 
                        other platform. When they click the link and sign up, 
                        they'll automatically be connected to your referral.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rewards">
            <AccordionTrigger>Tracking Your Rewards</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You can track the status of your referrals and rewards in the Analytics tab. Here's what different statuses mean:
                </p>
                
                <ul className="space-y-2 pl-5 list-disc text-gray-700">
                  <li><span className="font-semibold">Pending</span>: Your colleague has received the invitation but hasn't signed up yet</li>
                  <li><span className="font-semibold">Completed</span>: Your colleague has created an account using your referral code</li>
                  <li><span className="font-semibold">Successful Conversion</span>: Your colleague has subscribed to a paid plan, qualifying you for the $10 credit</li>
                </ul>
                
                <p className="text-gray-700">
                  Credits are automatically applied to your next billing cycle. If your credits exceed your subscription amount, the remainder will roll over to future months.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="limitations">
            <AccordionTrigger>Program Limitations & Terms</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <h4 className="font-medium">Rate Limits:</h4>
                <p className="text-sm text-gray-700">
                  To maintain program quality, there is a limit of 20 referral invitations per day.
                </p>
                
                <h4 className="font-medium">Eligibility:</h4>
                <ul className="space-y-1 pl-5 list-disc text-sm text-gray-700">
                  <li>You must have an active subscription to receive referral credits</li>
                  <li>Referrals must be unique individuals with their own accounts</li>
                  <li>Self-referrals are not eligible for rewards</li>
                  <li>Referred users must maintain their subscription for at least 30 days for the referral to qualify</li>
                </ul>
                
                <h4 className="font-medium">Program Changes:</h4>
                <p className="text-sm text-gray-700">
                  ConvoNotes Genius reserves the right to modify or terminate the referral program at any time. 
                  Any earned rewards will be honored regardless of program changes.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="tips">
            <AccordionTrigger>Tips for Successful Referrals</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Here are some tips to improve your referral success rate:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center">
                      <Gift className="h-4 w-4 mr-2" />
                      Personalize Your Message
                    </h4>
                    <p className="text-sm text-gray-600">
                      When sharing your referral link, include a personal note explaining 
                      why you find ConvoNotes Genius valuable for your practice.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Target Relevant Colleagues
                    </h4>
                    <p className="text-sm text-gray-600">
                      Focus on referring colleagues who would genuinely benefit from 
                      our therapy notes solutions rather than sending to everyone.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  Remember that providing an honest, authentic recommendation based on 
                  your experience will be most effective in converting referrals.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
