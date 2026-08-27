/**
 * Official Sharif Realty media, served directly from local public assets.
 */
export const MEDIA_BASE = "/wp-content/uploads";

export const OFFICIAL_MEDIA = {
  logo: `${MEDIA_BASE}/SHARIF-REALTY-LOGO.png`,
  logoAlt: `${MEDIA_BASE}/image-2-1.png`,
  agent: `${MEDIA_BASE}/Sharif-Photo.jpg`,
  agentAlt: `${MEDIA_BASE}/2025/05/Sharif-Photo.jpg`,
  hero: `${MEDIA_BASE}/16-thendara.jpg`,
  heroAlt: `${MEDIA_BASE}/IMG_4535.jpg`,
  rent: `${MEDIA_BASE}/rent.png`,
  forSale: `${MEDIA_BASE}/for-sale.png`,
  newHouse: `${MEDIA_BASE}/new-house.png`,
  client1: `${MEDIA_BASE}/Client.png`,
  client2: `${MEDIA_BASE}/Client2.png`,
  stars: `${MEDIA_BASE}/Group-15227.png`,
  waterbury: `${MEDIA_BASE}/image-16.png`,
  commercial: `${MEDIA_BASE}/IMG_4535.jpg`,
  thendara: `${MEDIA_BASE}/16-thendara.jpg`,
  slider1: `${MEDIA_BASE}/30905-1-scaled.png`,
  slider2: `${MEDIA_BASE}/30905-1-1-scaled.png`,
  slider3: `${MEDIA_BASE}/image-14-scaled.png`,
} as const;

export const MEDIA_LIBRARY: { url: string; label: string }[] = [
  { url: OFFICIAL_MEDIA.logo, label: "Sharif Realty Group Logo" },
  { url: OFFICIAL_MEDIA.agent, label: "Majeed Sharif - Principal Broker" },
  { url: OFFICIAL_MEDIA.hero, label: "16 Thendara Exterior" },
  { url: OFFICIAL_MEDIA.heroAlt, label: "North Main St Commercial" },
  { url: OFFICIAL_MEDIA.waterbury, label: "Waterbury Connecticut Estate" },
];
