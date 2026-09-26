import { company } from "@/lib/content";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "WholesaleStore"],
    name: company.name,
    legalName: company.name,
    description: company.summary,
    url: company.website,
    email: company.email,
    telephone: company.whatsapp && !company.whatsapp.includes("X") ? `+${company.whatsapp}` : undefined,
    image: `${company.website}/images/logo.png`,
    logo: `${company.website}/images/logo.png`,
    vatID: company.gstn,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "C/o Suchii Group, 1st Floor, Nikita Pinacle, Opp. of Vivanta by Taj, Khanpara",
      addressLocality: "Guwahati",
      addressRegion: "Assam",
      postalCode: "781022",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.1158,
      longitude: 91.8258,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:30",
        closes: "18:30",
      },
    ],
    brand: [
      { "@type": "Brand", "name": "Adani Solar" },
      { "@type": "Brand", "name": "Waaree Energies" },
      { "@type": "Brand", "name": "Luminous" },
      { "@type": "Brand", "name": "Microtek" },
      { "@type": "Brand", "name": "Tata Power Solar" },
    ],
    areaServed: [
      { "@type": "City", name: "Guwahati" },
      { "@type": "AdministrativeArea", name: "Assam" },
      { "@type": "AdministrativeArea", name: "Meghalaya" },
      { "@type": "AdministrativeArea", name: "Arunachal Pradesh" },
      { "@type": "AdministrativeArea", name: "Northeast India" },
    ],
    knowsAbout: [
      "Solar in Guwahati",
      "Solar panel in Guwahati Assam",
      "Adani Solar panel distributor Guwahati",
      "Waaree Solar panels Guwahati",
      "Luminous solar inverter and battery dealer Guwahati",
      "Microtek solar inverters Guwahati",
      "Tata Power solar water pumps Assam",
      "Rooftop solar installation Guwahati",
      "PM Surya Ghar Muft Bijli Yojana Assam",
      "Commercial and residential solar systems",
      "Solar PV modules wholesale Guwahati",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
