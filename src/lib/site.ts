export const SITE = {
  name: "Sharif Realty Group LLC",
  shortName: "Sharif Realty",
  owner: "Majeed Sharif",
  tagline: "Your Trusted Connecticut Real Estate Partner",
  heroSubline:
    "Specializing in Waterbury, Berlin, Wolcott, and Surrounding Areas.",
  phone: "(203) 802-8099",
  phoneHref: "tel:+12038028099",
  phoneAlt: "(617) 480-5246",
  phoneAltHref: "tel:+16174805246",
  whatsapp: "12038028099",
  email: "SharifRealty19@gmail.com",
  address: {
    street: "500 Farmington Ave",
    city: "Waterbury",
    region: "CT",
    postalCode: "06710",
  },
  locations: [
    "Waterbury, CT 06704",
    "Berlin, CT 06037",
    "Wolcott, CT",
  ],
  zipsServed: ["06704", "06710", "06037"],
  geo: { lat: 41.5582, lng: -73.0515 },
  hours: "Mon–Fri 9:00–19:00 · Sat 10:00–16:00",
  experience: "35+ years in residential, commercial and business real estate",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
  },
  areaServed: [
    "Waterbury",
    "Berlin",
    "Wolcott",
    "Southington",
    "Bucks Hill",
    "West End District",
    "Bunker Hill",
    "East Southington",
  ],
} as const;

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

export const whatsappHref = (
  message = "Hi Majeed, I'd like to talk about a Connecticut property.",
) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const directionsHref = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

export const mapEmbedSrc = (lat: number, lng: number, span = 0.008) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - span}%2C${lat - span / 2}%2C${lng + span}%2C${lat + span / 2}&layer=mapnik&marker=${lat}%2C${lng}`;
