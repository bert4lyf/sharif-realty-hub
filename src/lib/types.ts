import type { Database } from "@/integrations/supabase/types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type CaseStudy = Database["public"]["Tables"]["case_studies"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type AppRole = Database["public"]["Enums"]["app_role"];
export type PropertyStatus = Database["public"]["Enums"]["property_status"];
export type ListingType = Database["public"]["Enums"]["listing_type"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];

export type PublicSettings = {
  ga4_measurement_id: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  office_address: string;
  office_hours: string;
  latitude: number;
  longitude: number;
};

export type PropertyFilters = {
  listingType?: ListingType | "all";
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  status?: PropertyStatus | "all";
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
  featuredOnly?: boolean;
};
