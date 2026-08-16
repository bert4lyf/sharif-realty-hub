/**
 * Official Sharif Realty media, served from the live wp-content uploads path.
 * Do not swap these for stock or generated imagery.
 */
export const MEDIA_BASE = "https://sharifrealty.com/wp-content/uploads";

export const OFFICIAL_MEDIA = {
  logo: `${MEDIA_BASE}/2025/05/SHARIF-REALTY-LOGO.png`,
  agent: `${MEDIA_BASE}/2025/05/image-2-1.png`,
  hero: `${MEDIA_BASE}/2025/05/16-thendara.jpg`,
  heroAlt: `${MEDIA_BASE}/2025/05/IMG_4535.jpg`,
  madera: [`${MEDIA_BASE}/2026/01/1-3.png`],
  farmington: [
    `${MEDIA_BASE}/2026/01/1-2.png`,
    `${MEDIA_BASE}/2026/01/2-2.png`,
    `${MEDIA_BASE}/2026/01/3-2.png`,
    `${MEDIA_BASE}/2026/01/4-2.png`,
    `${MEDIA_BASE}/2026/01/5-2.png`,
  ],
  northMain: [
    `${MEDIA_BASE}/2026/01/1-1.png`,
    `${MEDIA_BASE}/2026/01/2-1.png`,
    `${MEDIA_BASE}/2026/01/3-1.png`,
    `${MEDIA_BASE}/2026/01/4-1.png`,
    `${MEDIA_BASE}/2026/01/5-1.png`,
  ],
  avon: [
    `${MEDIA_BASE}/2026/01/1.png`,
    `${MEDIA_BASE}/2026/01/2.png`,
    `${MEDIA_BASE}/2026/01/3.png`,
    `${MEDIA_BASE}/2026/01/4.png`,
    `${MEDIA_BASE}/2026/01/5.png`,
  ],
} as const;

export const MEDIA_LIBRARY: { url: string; label: string }[] = [
  { url: OFFICIAL_MEDIA.logo, label: "Sharif Realty logo" },
  { url: OFFICIAL_MEDIA.agent, label: "Majeed Sharif" },
  { url: OFFICIAL_MEDIA.hero, label: "16 Thendara exterior" },
  { url: OFFICIAL_MEDIA.heroAlt, label: "Listing photo IMG_4535" },
  ...OFFICIAL_MEDIA.madera.map((url, i) => ({ url, label: `102 Madera Dr — photo ${i + 1}` })),
  ...OFFICIAL_MEDIA.farmington.map((url, i) => ({ url, label: `500 Farmington Ave — photo ${i + 1}` })),
  ...OFFICIAL_MEDIA.northMain.map((url, i) => ({ url, label: `3105 N Main St — photo ${i + 1}` })),
  ...OFFICIAL_MEDIA.avon.map((url, i) => ({ url, label: `71 Avon Ave — photo ${i + 1}` })),
];
