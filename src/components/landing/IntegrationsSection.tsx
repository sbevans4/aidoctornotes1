
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const IntegrationsSection = () => {
  const integrations = [
    {
      name: "Epic",
      logo: "/epic-logo.svg",
      features: ["One-click export to Epic", "Patient record sync", "Custom templates"]
    },
    {
      name: "Cerner",
      logo: "/cerner-logo.svg",
      features: ["Seamless integration", "Real-time sync", "Customizable fields"]
    },
    {
      name: "Allscripts",
      logo: "/allscripts-logo.svg",
      features: ["Quick note transfer", "Patient matching", "Time-saving templates"]
    },
    {
      name: "NextGen",
      logo: "/nextgen-logo.svg",
      features: ["Easy configuration", "Fast implementation", "Built-in templates"]
    },
  ];
  
  return (
    <section className="py-16 bg-white" id="integrations">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Seamless EHR Integration</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform works with your existing systems, connecting smoothly with all major EHR providers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {integrations.map((integration, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="h-12 mb-4 flex items-center">
                <img src={integration.logo} alt={`${integration.name} logo`} className="h-full w-auto" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">{integration.name}</h3>
              
              <ul className="space-y-2 mb-6">
                {integration.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" size="sm" className="w-full">
                View Integration Details
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Don't see your EHR system? We can build a custom integration for your practice.</p>
          <Button variant="outline">Contact Our Integration Team</Button>
        </div>
      </div>
    </section>
  );
};
