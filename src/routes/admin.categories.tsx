import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { POST_CATEGORIES, useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

const DESCRIPTIONS: Record<string, string> = {
  Properties: "Every active listing on sharifrealty.com.",
  Featured: "Hand-picked listings promoted on the homepage.",
  "Off Market": "Pocket listings shared with the investor list first.",
  Commercial: "Retail, office and mixed-use inventory.",
  Rentals: "Long-term rental inventory.",
};

function CategoriesPage() {
  const { posts } = useAdmin();

  return (
    <>
      <AdminPageHeader title="Categories" description="Taxonomy used to group property posts." />
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Count</th>
            </tr>
          </thead>
          <tbody>
            {POST_CATEGORIES.map((category) => (
              <tr key={category} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-foreground">{category}</td>
                <td className="px-4 py-3 text-muted-foreground">{DESCRIPTIONS[category] ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category.toLowerCase().replace(/\s+/g, "-")}
                </td>
                <td className="px-4 py-3">{posts.filter((post) => post.category === category).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
