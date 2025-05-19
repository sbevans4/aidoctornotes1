
import React from "react";
import { Award } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Award className="h-5 w-5 text-amber-500" />
        <h3 className="text-2xl font-bold text-center">Trusted by Healthcare Professionals</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-gray-600 italic">"AIDoctorNotes saves me nearly 2 hours every day on documentation. The Professional plan is worth every penny."</p>
          <p className="font-semibold mt-3">Dr. Emily Chen</p>
          <p className="text-sm text-gray-500">Family Medicine</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-gray-600 italic">"The team accounts feature has transformed our clinic's workflow. We're all on the same page now."</p>
          <p className="font-semibold mt-3">Dr. James Wilson</p>
          <p className="text-sm text-gray-500">Internal Medicine</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p className="text-gray-600 italic">"Image analysis capabilities are game-changing for my dermatology practice. Highly recommend."</p>
          <p className="font-semibold mt-3">Dr. Sarah Lopez</p>
          <p className="text-sm text-gray-500">Dermatology</p>
        </div>
      </div>
    </div>
  );
};
