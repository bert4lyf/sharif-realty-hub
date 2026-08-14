import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/tags")({
  component: TagsPage,
});

function TagsPage() {
  const { posts } = useAdmin();
  const counts = new Map<string, number>();
  posts.forEach((post) => post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
  const tags = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <AdminPageHeader title="Tags" description="Free-form labels attached to property posts." />
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Tag</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Count</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(([tag, count]) => (
              <tr key={tag} className="border-t border-border">
                <td className="px-4 py-3 font-semibold text-foreground">{tag}</td>
                <td className="px-4 py-3 text-muted-foreground">{tag}</td>
                <td className="px-4 py-3">{count}</td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                  No tags yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
