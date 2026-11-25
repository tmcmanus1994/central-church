import { site } from "@/lib/site";

/**
 * Christmas Toy Store 2026 — the copy and links behind /toy-store and the
 * homepage spotlight. Numbers come from the office; update here and both
 * places change.
 */
export const toyStore = {
  year: 2026,
  date: "Saturday, December 12",
  /** The full flyer — event card and link previews. */
  image: "/photos/toy-store-2026.webp",
  /** The photo half of the flyer, no text — hero and homepage spotlight,
   *  where the words are set in type beside it. */
  photo: "/photos/toy-store-2026-photo.webp",
  imageAlt:
    "A volunteer and a girl in a Santa hat wrapping gifts at Central's Christmas Toy Store",

  seoTitle: "Christmas Toy Store 2026",
  seoDescription:
    "Central Church's Christmas Toy Store is Saturday, Dec 12. Help us give 1,620 gifts to 189 families and 616 children. Give, donate gifts or volunteer.",

  hero: {
    eyebrow: "Saturday, December 12 · Central Church of Christ",
    headline: "Christmas Toy Store",
    subhead:
      "This Christmas, 189 families and 616 children from our community will shop our Toy Store. Help us give 1,620 gifts so every family we serve has something to open on Christmas morning.",
  },

  links: {
    give: { label: "Give through Pushpay", href: site.giveUrl },
    gifts: {
      label: "Sign up to give gifts",
      href: "https://www.signupgenius.com/go/10C0549AAA82DA57-centrals#/",
    },
    volunteer: {
      label: "Volunteer",
      // The office's Breeze volunteer form, from the weekly email.
      href: "https://links.breezechms.com/ls/click?upn=u001.I1QWnEUjRQZmeILWJHEKPU4O4vzzz8eV-2BGcq3KM7D2Uewf1tcPqQEO5kTANtgBiKcof2i6S4swlmyp7YpmkU8a8aTZrWWn-2BHRSns07lRzds-3Dmbca_Ku09AMy-2B3ZRmoeP2WV7CZI-2BJM-2Fi0nwKLi1tQUOIAw-2FicUOU25O2ryf-2BhNjP62rjZtVnPWhsN-2Fuuz253MmgKCBmJ-2Bo5Anxrrkp38s9EOcNI4C1R9lsjGsHoB4K8YIBUsHS6B-2Fb8l7nZNOJ3zW4uyktezVXvl-2BTdcV0JLzLv-2BvG-2Fjw-2FywPlN-2BazpaderA6rOCYT4JtOZa24wQcMdR7QR02dtG-2BIgtpVgMff6QNzfAGPGlY9XKbv2kqM-2FTPoU6kupLt-2FfQYJ9Hm6JPnMhamG6jIwXrMdp7l9fh1xcVTiHx-2FpCgv-2FDO1Djaei2GWjSr4RfYS",
    },
  },

  numbers: [
    { value: "73 families, 270 children", detail: "shopping 7 AM to 12 PM" },
    { value: "116 families, 346 children", detail: "waitlist shopping, 1 to 3 PM" },
    { value: "1,620 gifts", detail: "our donation goal to serve every family" },
    { value: "100+ volunteers", detail: "needed to set up and serve" },
  ],

  ways: [
    {
      title: "Give funds",
      body: "Donate through Pushpay and help us reach 1,620 gifts.",
      link: "give",
    },
    {
      title: "Give gifts",
      body: "Sign up to give gifts for the Toy Store. The sign-up lists what's needed and where to bring it.",
      link: "gifts",
    },
    {
      title: "Volunteer",
      body: "We need more than 100 volunteers. Help set up the store December 7 to 11, or serve families on Saturday, December 12.",
      link: "volunteer",
    },
  ] as const,

  details: [
    { label: "Toy Store", value: "Saturday, December 12, 7 AM to 12 PM" },
    { label: "Waitlist shopping", value: "Saturday, December 12, 1 to 3 PM" },
    { label: "Volunteer setup", value: "Monday, December 7 to Friday, December 11" },
    { label: "Where", value: "Central Church Gym / Family Life Center" },
  ],

  closing: "Thank you for helping us love our neighbors well this Christmas.",
};
