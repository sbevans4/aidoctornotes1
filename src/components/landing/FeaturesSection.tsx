
import { Check } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Features that Make a Difference
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Standard Plan</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">200 minutes/month transcription</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Full summary + key highlights</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Up to 20 SOAP notes/month</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Professional Plan</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">500 minutes/month transcription</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Direct EHR integration</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Priority support</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Enterprise Plan</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Unlimited team transcription</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Custom code libraries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Dedicated account manager</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
