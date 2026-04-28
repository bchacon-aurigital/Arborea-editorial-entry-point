export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "",
    url: "https://",
    logo: "https:///logo.png",
    description: "",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "",
      contactType: "customer service",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      "https://facebook.com/",
      "https://instagram.com/",
      "https://twitter.com/",
      "https://linkedin.com/company/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "",
    url: "https://",
    potentialAction: {
      "@type": "SearchAction",
      target: "https:///search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Descomentar si es un negocio local
  // const localBusinessSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "LocalBusiness",
  //   name: "",
  //   image: "https:///og-image.jpg",
  //   address: {
  //     "@type": "PostalAddress",
  //     streetAddress: "",
  //     addressLocality: "",
  //     addressRegion: "",
  //     postalCode: "",
  //     addressCountry: "",
  //   },
  //   telephone: "",
  //   openingHoursSpecification: [
  //     {
  //       "@type": "OpeningHoursSpecification",
  //       dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  //       opens: "09:00",
  //       closes: "18:00",
  //     },
  //   ],
  // };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
