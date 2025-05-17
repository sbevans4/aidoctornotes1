
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // In a real application, you would send this data to your backend
      console.log("Form data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <>
      <Helmet>
        <title>Contact Us | ConvoNotes Genius</title>
        <meta name="description" content="Get in touch with our team for questions about AI medical documentation, pricing, demo requests, or technical support." />
        <meta property="og:title" content="Contact Us | ConvoNotes Genius" />
        <meta property="og:description" content="Get in touch with our team for questions about AI medical documentation, pricing, demo requests, or technical support." />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about our AI documentation solutions? Our team is here to help.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-bold mb-3">{item.title}</h3>
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Medical Practice or Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inquiry Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="demo">Request a Demo</SelectItem>
                            <SelectItem value="pricing">Pricing Information</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your inquiry..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          We typically respond within 24 business hours.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
