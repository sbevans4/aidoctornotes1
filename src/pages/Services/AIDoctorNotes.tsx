
import React from "react";
import { Helmet } from "react-helmet";

const AIDoctorNotes = () => {
  return (
    <>
      <Helmet>
        <title>AI Doctor Notes | AIDoctorNotes</title>
        <meta name="description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:title" content="AI Doctor Notes | AIDoctorNotes" />
        <meta property="og:description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-doctor-notes" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AIDoctorNotes AI Doctor Notes",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds."
            }
          `}
        </script>
      </Helmet>

      <div className="pt-20">
        <section className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">AI Doctor Notes</h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-10">
            Convert medical conversations into structured clinical documentation in seconds. Save hours on paperwork daily.
          </p>
          
          {/* Placeholder for actual content */}
          <div className="bg-gray-100 p-10 rounded-lg text-center">
            <p>Doctor Notes Content</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIDoctorNotes;
