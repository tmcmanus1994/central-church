/**
 * Sitewide facts. NAP consistency matters for local SEO — every rendering of
 * name, address, phone, and service times pulls from here and only here.
 */
export const site = {
  name: "Central Church of Christ",
  shortName: "Central",
  tagline: "Following Jesus Together",
  url: "https://arcentralchurch.org",
  address: {
    street: "823 W 6th St",
    city: "Little Rock",
    state: "AR",
    zip: "72201",
  },
  phone: "(501) 374-2039",
  phoneHref: "tel:+15013742039",
  email: "office@arcentralchurch.org",
  giveUrl: "https://pushpay.com/g/arcentralchurch",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Central+Church+of+Christ+823+W+6th+St+Little+Rock+AR+72201",
  socials: {
    instagram: "https://www.instagram.com/lrcentralchurch",
    facebook: "https://www.facebook.com/CentralChurchLittleRock",
    youtube: "https://www.youtube.com/@CentralChurchLR",
  },
  serviceTimes: [
    { label: "Sunday Bible Classes", short: "Bible Classes", when: "9:15 AM" },
    { label: "Sunday Worship", short: "Worship", when: "10:15 AM" },
    {
      label: "Spanish Worship",
      short: "Adoración en Español",
      when: "1:30 PM",
    },
    {
      label: "Wednesday Classes",
      short: "Wednesday Classes",
      when: "6:30 PM",
    },
  ],
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
