import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  source: z.string().trim().max(60).default("website"),
  propertyId: z.string().uuid().nullable().default(null),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const propertyFiltersSchema = z.object({
  listingType: z.enum(["buy", "rent", "commercial", "all"]).optional(),
  status: z.enum(["for_sale", "pending", "sold", "for_rent", "rented", "all"]).optional(),
  query: z.string().trim().max(120).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  beds: z.number().int().min(0).max(10).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  featuredOnly: z.boolean().optional(),
});

export const propertyInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  description: z.string().trim().max(4000).default(""),
  price: z.number().nonnegative(),
  status: z.enum(["for_sale", "pending", "sold", "for_rent", "rented"]),
  listing_type: z.enum(["buy", "rent", "commercial"]),
  address: z.string().trim().max(200).default(""),
  city: z.string().trim().max(100).default(""),
  state: z.string().trim().max(40).default(""),
  zip: z.string().trim().max(20).default(""),
  beds: z.number().int().min(0).max(30),
  baths: z.number().min(0).max(30),
  sqft: z.number().int().min(0).max(200000),
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),
  images: z.array(z.string().url().max(600)).max(12).default([]),
  features: z.array(z.string().trim().max(80)).max(20).default([]),
  is_featured: z.boolean().default(false),
  is_archived: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

export const faqInputSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(2000),
  category: z.string().trim().max(60).default("General"),
  sort_order: z.number().int().min(0).max(999).default(0),
  is_published: z.boolean().default(true),
});

export const caseStudyInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(3).max(200),
  address: z.string().trim().max(200).default(""),
  summary: z.string().trim().max(600).default(""),
  story: z.string().trim().max(4000).default(""),
  client_name: z.string().trim().max(120).nullable().default(null),
  days_on_market: z.number().int().min(0).max(3650).nullable().default(null),
  percent_of_asking: z.number().min(0).max(300).nullable().default(null),
  sale_price: z.number().min(0).nullable().default(null),
  image_url: z.string().url().max(600).nullable().default(null),
  is_published: z.boolean().default(true),
});

export const settingsInputSchema = z.object({
  ga4_measurement_id: z.string().trim().max(40).nullable().default(null),
  maps_api_key: z.string().trim().max(200).nullable().default(null),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  email: z.string().trim().email().max(255),
  office_address: z.string().trim().max(300),
  office_hours: z.string().trim().max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
