
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
            <h3 className="text-xl font-bold">Pay-As-You-Go</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Only $0.50 per minute</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">No monthly commitment</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">High-quality transcription</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Trial Plan</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Only $9.99 per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Basic features included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Try before committing</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">AI-Powered Summaries</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Concise meeting summaries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Key insights extraction</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-600">Improved decision-making</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
