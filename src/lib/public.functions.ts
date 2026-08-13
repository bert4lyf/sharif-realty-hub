import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPublicSupabase } from "./supabase-public.server";
import { leadSchema, propertyFiltersSchema } from "./schemas";

export const listProperties = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => propertyFiltersSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = getPublicSupabase();
    let query = supabase.from("properties").select("*").eq("is_archived", false);

    if (data.listingType && data.listingType !== "all")
      query = query.eq("listing_type", data.listingType);
    if (data.status && data.status !== "all") query = query.eq("status", data.status);
    if (data.featuredOnly) query = query.eq("is_featured", true);
    if (typeof data.minPrice === "number") query = query.gte("price", data.minPrice);
    if (typeof data.maxPrice === "number") query = query.lte("price", data.maxPrice);
    if (typeof data.beds === "number" && data.beds > 0) query = query.gte("beds", data.beds);
    if (data.query) {
      const term = `%${data.query.replace(/[%,]/g, "")}%`;
      query = query.or(
        `title.ilike.${term},address.ilike.${term},city.ilike.${term},zip.ilike.${term}`,
      );
    }

    if (data.sort === "price_asc") query = query.order("price", { ascending: true });
    else if (data.sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    const { data: rows, error } = await query.limit(data.limit ?? 60);
    if (error) throw new Error(error.message);
    return { properties: rows ?? [] };
  });

export const getProperty = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = getPublicSupabase();
    const isUuid = /^[0-9a-f-]{36}$/i.test(data.id);
    const { data: rows, error } = await supabase
      .from("properties")
      .select("*")
      .eq(isUuid ? "id" : "slug", data.id)
      .eq("is_archived", false)
      .limit(1);
    if (error) throw new Error(error.message);
    const property = rows?.[0] ?? null;
    if (!property) return { property: null, related: [] };

    const { data: related } = await supabase
      .from("properties")
      .select("*")
      .eq("is_archived", false)
      .eq("listing_type", property.listing_type)
      .neq("id", property.id)
      .limit(3);

    return { property, related: related ?? [] };
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { reviews: data ?? [] };
});

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return { faqs: data ?? [] };
});

export const listCaseStudies = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { caseStudies: data ?? [] };
});

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getPublicSupabase();
  const { data } = await supabase
    .from("site_settings")
    .select(
      "ga4_measurement_id, phone, whatsapp, email, office_address, office_hours, latitude, longitude",
    )
    .eq("id", 1)
    .maybeSingle();
  return { settings: data ?? null };
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = getPublicSupabase();
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      source: data.source,
      property_id: data.propertyId ?? null,
    });
    if (error) {
      console.error("lead insert failed", error.message);
      return { ok: false as const, error: "We could not save your request. Please call us." };
    }
    return { ok: true as const };
  });
