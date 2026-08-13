import { createFileRoute } from "@tanstack/react-router";
import { listProperties } from "@/lib/public.functions";

const STATIC_PATHS = [
  { path: "/", priority: "1.0" },
  { path: "/properties", priority: "0.9" },
  { path: "/case-studies", priority: "0.7" },
  { path: "/faqs", priority: "0.7" },
  { path: "/privacy-policy", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        let propertyPaths: { path: string; lastmod?: string }[] = [];
        try {
          const { properties } = await listProperties({ data: { limit: 100 } });
          propertyPaths = properties.map((property) => ({
            path: `/properties/${property.id}`,
            lastmod: property.updated_at ?? undefined,
          }));
        } catch {
          propertyPaths = [];
        }

        const urls = [
          ...STATIC_PATHS.map(
            (entry) =>
              `<url><loc>${origin}${entry.path}</loc><priority>${entry.priority}</priority></url>`,
          ),
          ...propertyPaths.map(
            (entry) =>
              `<url><loc>${origin}${entry.path}</loc>${
                entry.lastmod ? `<lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : ""
              }<priority>0.8</priority></url>`,
          ),
        ].join("");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
