export const SITE = {
  name: "Sharif Realty",
  owner: "Majeed Sharif",
  tagline: "Find Your Ideal Property with Sharif Realty",
  phone: "+1 (305) 555-0142",
  phoneHref: "tel:+13055550142",
  whatsapp: "13055550142",
  email: "hello@sharifrealty.com",
  address: {
    street: "1200 Brickell Ave, Suite 900",
    city: "Miami",
    region: "FL",
    postalCode: "33131",
  },
  geo: { lat: 25.7617, lng: -80.1918 },
  hours: "Mon–Fri 9:00–19:00 · Sat 10:00–16:00",
  areaServed: [
    "Miami",
    "Miami Beach",
    "Coral Gables",
    "Coconut Grove",
    "Key Biscayne",
    "Brickell",
    "Palmetto Bay",
    "Aventura",
  ],
} as const;

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`;

export const whatsappHref = (message = "Hi Sharif Realty, I'd like to talk about a property.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const directionsHref = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

export const mapEmbedSrc = (lat: number, lng: number, span = 0.008) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - span}%2C${lat - span / 2}%2C${lng + span}%2C${lat + span / 2}&layer=mapnik&marker=${lat}%2C${lng}`;
