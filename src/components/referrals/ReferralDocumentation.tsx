
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Users, Link, Mail, AlertTriangle, FileCheck, ArrowRight } from "lucide-react";

export const ReferralDocumentation: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold mb-4">How Our Referral Program Works</h2>
        <p className="text-gray-700 mb-6">
          Our referral program rewards you for sharing AIDoctorNotes with your colleagues and professional network. Here's everything you need to know.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">1. Send Invitations</h3>
              <p className="text-sm text-gray-600 text-center">
                Send referrals via email or share your unique referral link with colleagues.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileCheck className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">2. They Subscribe</h3>
              <p className="text-sm text-gray-600 text-center">
                When your referral signs up and becomes a paying subscriber.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CircleDollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-center mb-2">3. You Get Rewarded</h3>
              <p className="text-sm text-gray-600 text-center">
                Earn $10 credit for each successful referral, automatically applied to your next bill.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Referral Methods</CardTitle>
            <CardDescription>Two easy ways to refer colleagues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="shrink-0 bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Email Invitation</h3>
                <p className="text-gray-600 text-sm">
                  Enter your colleague's email address to send them a personal invitation with your referral code automatically included.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="shrink-0 bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                <Link className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Referral Link</h3>
                <p className="text-gray-600 text-sm">
                  Copy your personal referral link and share it through messaging apps, social media, or in person.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">How much can I earn from referrals?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You earn $10 for each successful referral. There's no limit to how many colleagues you can refer, so your earning potential is unlimited.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">When do I receive my referral credit?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Referral credits are applied automatically to your next billing cycle after your referral becomes a paid subscriber.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">What happens if my referral doesn't sign up immediately?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your referral link remains valid for 30 days. As long as they sign up within that period, you'll receive credit for the referral.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-lg">What do my referred colleagues get?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Your referred colleagues receive a special 10% discount on their first 3 months of subscription.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li>Referrals must be new users who have not previously held an account.</li>
              <li>Credits can only be applied to active subscriptions and cannot be redeemed for cash.</li>
              <li>We reserve the right to refuse rewards for suspected fraudulent activity.</li>
              <li>Terms and conditions of the referral program are subject to change with notice.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
