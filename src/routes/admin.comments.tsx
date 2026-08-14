import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";

export const Route = createFileRoute("/admin/comments")({
  component: CommentsPage,
});

const COMMENTS = [
  {
    id: "c-1",
    author: "Dana Whitfield",
    post: "Off Market 4 bed 3 bath 1,724sqft 102 Madera Dr, Waterbury, CT 06704",
    body: "Is the basement finished? Great price for the area.",
    date: "2026-08-10",
    status: "Approved",
  },
  {
    id: "c-2",
    author: "Marcus Reed",
    post: "Featured 5 bed 4 bath 3,280sqft 18 Harbor View Ln, Stamford, CT 06902",
    body: "The harbor views in the gallery are stunning.",
    date: "2026-08-02",
    status: "Approved",
  },
  {
    id: "c-3",
    author: "Anon Investor",
    post: "Retail Storefront 2,600sqft 740 Main St, Hartford, CT 06103",
    body: "Send me the NNN terms please.",
    date: "2026-07-27",
    status: "Pending",
  },
];

function CommentsPage() {
  return (
    <>
      <AdminPageHeader title="Comments" description="Visitor comments left on property posts." />
      <div className="space-y-3">
        {COMMENTS.map((comment) => (
          <article key={comment.id} className="rounded-sm border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{comment.author}</p>
              <p className="text-xs text-muted-foreground">
                {comment.status} · {comment.date}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{comment.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">In reply to: {comment.post}</p>
          </article>
        ))}
      </div>
    </>
  );
}
