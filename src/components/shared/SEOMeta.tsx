
import React from "react";
import { Helmet } from "react-helmet";

interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: Record<string, any>[];
  noindex?: boolean;
}

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description,
  keywords,
  canonical = window.location.href,
  ogType = "website",
  ogImage = "/og-image.png",
  twitterCard = "summary_large_image",
  structuredData = [],
  noindex = false,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Social Media Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org markup for Google */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
