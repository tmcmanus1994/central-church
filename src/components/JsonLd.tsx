import { site } from "@/lib/site";

/**
 * Church/LocalBusiness structured data with service times — rendered on every
 * page from the root layout, per the build constraints.
 */
export function ChurchJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: site.name,
    alternateName: "Central Church Little Rock",
    slogan: site.tagline,
    url: site.url,
    telephone: "+1-501-374-2039",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.7434,
      longitude: -92.2809,
    },
    sameAs: [
      site.socials.instagram,
      site.socials.facebook,
      site.socials.youtube,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:15",
        closes: "14:30",
        description:
          "Bible Classes 9:15 AM · Worship 10:15 AM · Spanish Worship 1:30 PM",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "18:30",
        closes: "19:30",
        description: "Wednesday Classes 6:30 PM",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
