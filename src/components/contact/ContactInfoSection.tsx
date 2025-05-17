
import React from "react";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { ContactInfoCard } from "./ContactInfoCard";

export const ContactInfoSection = () => {
  const contactInfo = [
    {
      icon: PhoneCall,
      title: "Call Us",
      details: ["+1 (800) 123-4567", "Mon-Fri 9AM-6PM EST"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@aidoctornotes.com", "support@aidoctornotes.com"]
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Med Tech Drive", "Boston, MA 02115"]
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      {contactInfo.map((item, index) => (
        <ContactInfoCard
          key={index}
          icon={item.icon}
          title={item.title}
          details={item.details}
        />
      ))}
    </div>
  );
};
