
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Users, MessageSquare } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, inquiryType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send data to your backend
      // This is a mock success for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: "We've received your message and will respond shortly.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | ConvoNotes Genius</title>
        <meta name="description" content="Have questions about our AI medical documentation platform? Contact our team for information about features, pricing, or to schedule a demo." />
        <meta property="og:title" content="Contact Us | ConvoNotes Genius" />
        <meta property="og:description" content="Have questions about our AI medical documentation platform? Contact our team for information about features, pricing, or to schedule a demo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/contact" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact Us | ConvoNotes Genius",
              "description": "Have questions about our AI medical documentation platform? Contact our team for information about features, pricing, or to schedule a demo.",
              "url": "https://aidoctornotes.com/contact",
              "mainEntity": {
                "@type": "Organization",
                "name": "ConvoNotes Genius",
                "telephone": "+18005551234",
                "email": "info@aidoctornotes.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "123 Health Tech Plaza, Suite 400",
                  "addressLocality": "San Francisco",
                  "addressRegion": "CA",
                  "postalCode": "94105",
                  "addressCountry": "US"
                }
              }
            }
          `}
        </script>
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Contact Header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600">
              Have questions about our AI medical documentation solution? Our team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <div className="bg-medical-primary text-white rounded-lg p-6 h-full">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <a href="mailto:info@aidoctornotes.com" className="text-white/80 hover:text-white">
                        info@aidoctornotes.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <a href="tel:+18005551234" className="text-white/80 hover:text-white">
                        (800) 555-1234
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-medium">Office Location</h3>
                      <address className="text-white/80 not-italic">
                        123 Health Tech Plaza<br />
                        Suite 400<br />
                        San Francisco, CA 94105
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Users className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-medium">Enterprise Sales</h3>
                      <a href="mailto:enterprise@aidoctornotes.com" className="text-white/80 hover:text-white">
                        enterprise@aidoctornotes.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 shrink-0" />
                    <div>
                      <h3 className="font-medium">Support</h3>
                      <a href="mailto:support@aidoctornotes.com" className="text-white/80 hover:text-white">
                        support@aidoctornotes.com
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-white/20">
                  <h3 className="font-medium mb-3">Business Hours</h3>
                  <p className="text-white/80">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="inquiryType" className="block text-sm font-medium">
                        Inquiry Type
                      </label>
                      <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                        <SelectTrigger id="inquiryType">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Information</SelectItem>
                          <SelectItem value="demo">Request a Demo</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="enterprise">Enterprise Inquiry</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-medical-primary hover:bg-medical-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </div>
              </form>
              
              {/* Additional Contact Info */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Other Ways to Connect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Schedule a Demo</h4>
                    <p className="text-gray-600 mb-3">
                      See our platform in action with a personalized demo tailored to your practice needs.
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = "/enterprise"}>
                      Request Demo
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">View Documentation</h4>
                    <p className="text-gray-600 mb-3">
                      Find answers in our comprehensive documentation and knowledge base.
                    </p>
                    <Button variant="outline" onClick={() => window.open("/docs", "_blank")}>
                      Visit Knowledge Base
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            <iframe
              title="Office Location Map"
              className="w-full h-80 rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1034212816567!2d-122.39568382354304!3d37.78991451202424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580627b1a7b83%3A0x8f6efde49be056e7!2s123%20Health%20Tech%20Plaza%20(fictional)%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1653010230418!5m2!1sen!2sus"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
