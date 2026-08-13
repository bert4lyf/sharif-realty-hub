import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page Not Found | Sharif Realty" },
      {
        name: "description",
        content:
          "The page you requested is no longer available. Search active Sharif Realty listings across Miami and South Florida.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Page Not Found | Sharif Realty" },
      {
        property: "og:description",
        content: "Search active Sharif Realty listings across Miami and South Florida.",
      },
    ],
  }),
  component: NotFound,
});
