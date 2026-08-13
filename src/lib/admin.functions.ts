import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  caseStudyInputSchema,
  faqInputSchema,
  propertyInputSchema,
  settingsInputSchema,
} from "./schemas";

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role);
    return {
      userId: context.userId,
      email: (context.claims as { email?: string }).email ?? null,
      roles,
      isSuperAdmin: roles.includes("super_admin"),
      isAdmin: roles.includes("admin") || roles.includes("super_admin"),
      isStaff: roles.length > 0,
    };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [properties, leads, reviews, faqs, caseStudies, settings, staff] = await Promise.all([
      context.supabase.from("properties").select("*").order("created_at", { ascending: false }),
      context.supabase.from("leads").select("*").order("created_at", { ascending: false }),
      context.supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      context.supabase.from("faqs").select("*").order("sort_order", { ascending: true }),
      context.supabase.from("case_studies").select("*").order("created_at", { ascending: false }),
      context.supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      context.supabase.from("profiles").select("id, full_name, phone"),
    ]);

    const { data: roleRows } = await context.supabase.from("user_roles").select("user_id, role");

    return {
      properties: properties.data ?? [],
      leads: leads.data ?? [],
      reviews: reviews.data ?? [],
      faqs: faqs.data ?? [],
      caseStudies: caseStudies.data ?? [],
      settings: settings.data ?? null,
      staff: staff.data ?? [],
      roles: roleRows ?? [],
    };
  });

export const saveProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => propertyInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const result = id
      ? await context.supabase.from("properties").update(values).eq("id", id)
      : await context.supabase.from("properties").insert(values);
    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  });

export const setPropertyFlags = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        is_featured: z.boolean().optional(),
        is_archived: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const { error } = await context.supabase.from("properties").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["new", "contacted", "in_contract", "closed"]).optional(),
        assigned_to: z.string().uuid().nullable().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const { error } = await context.supabase.from("leads").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setReviewApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), is_approved: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("reviews")
      .update({ is_approved: data.is_approved })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => faqInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const result = id
      ? await context.supabase.from("faqs").update(values).eq("id", id)
      : await context.supabase.from("faqs").insert(values);
    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveCaseStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => caseStudyInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const result = id
      ? await context.supabase.from("case_studies").update(values).eq("id", id)
      : await context.supabase.from("case_studies").insert(values);
    if (result.error) throw new Error(result.error.message);
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => settingsInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("site_settings").update(data).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["super_admin", "admin", "agent"]),
        grant: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    if (data.grant) {
      const { error } = await context.supabase
        .from("user_roles")
        .insert({ user_id: data.userId, role: data.role });
      if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
