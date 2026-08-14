import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";

export const Route = createFileRoute("/admin/pages")({
  component: PagesPage,
});

const PAGES = [
  { title: "Home", slug: "/", author: "Majeed", date: "2026-01-12", status: "Published" },
  { title: "Properties", slug: "/properties", author: "Majeed", date: "2026-01-12", status: "Published" },
  { title: "Case Studies", slug: "/case-studies", author: "Majeed", date: "2026-02-03", status: "Published" },
  { title: "FAQs", slug: "/faqs", author: "Majeed", date: "2026-02-03", status: "Published" },
  { title: "Thank You", slug: "/thank-you", author: "Majeed", date: "2026-02-14", status: "Published" },
  { title: "Privacy Policy", slug: "/privacy-policy", author: "Majeed", date: "2026-02-14", status: "Published" },
];

function PagesPage() {
  return (
    <>
      <AdminPageHeader title="Pages" description="Static site content published on sharifrealty.com." />
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Author</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {PAGES.map((page) => (
              <tr key={page.slug} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-foreground">{page.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{page.slug}</td>
                <td className="px-4 py-3">{page.author}</td>
                <td className="px-4 py-3">{page.status}</td>
                <td className="px-4 py-3 text-muted-foreground">{page.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
