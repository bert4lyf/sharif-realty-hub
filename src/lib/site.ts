export const SITE = {
  name: "Sharif Realty Group LLC",
  shortName: "Sharif Realty",
  url: "https://sharifrealty.com",
  owner: "Majeed Sharif",
  tagline: "Real Estate & Business Sales in Connecticut & Massachusetts",
  heroSubline:
    "With over 35 years of experience in residential, commercial, and business real estate.",
  phone: "(203) 802-8099",
  phoneHref: "tel:+12038028099",
  phoneDisplay: "203 802 8099",
  whatsapp: "12038028099",
  email: "SharifRealty19@gmail.com",
  address: {
    street: "3125 North Main St",
    city: "Waterbury",
    region: "CT",
    postalCode: "06704",
  },
  locations: [
    "Waterbury, CT 06704",
    "Berlin, CT 06037",
    "Southington, CT",
    "East Hartford, CT",
    "Stamford, CT",
    "Hartford, CT",
  ],
  zipsServed: ["06704", "06710", "06037", "06103", "06902"],
  geo: { lat: 41.5835, lng: -73.0368 },
  hours: "Mon-Fri: 9:00 AM - 6:00 PM",
  experience: "35+ years in residential, commercial, and business real estate",
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    twitter: "https://twitter.com/",
  },
  licenses: {
    ct: "RES.0792184",
    ma: "9563211",
  },
  areaServed: [
    "Waterbury",
    "Berlin",
    "Southington",
    "East Hartford",
    "Hartford",
    "Stamford",
    "Connecticut",
    "Massachusetts",
  ],
} as const;

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

export const whatsappHref = (
  message = "Hi Majeed, I would like to inquire about real estate opportunities with Sharif Realty.",
) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const directionsHref = (destination = FULL_ADDRESS) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

export const googleMapsUrl = (query = "3125 North Main St Waterbury Ct 06704") =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=m&z=14&output=embed&iwloc=near`;

export const mapEmbedSrc = (lat: number, lng: number) =>
  `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=14&output=embed&iwloc=near`;
