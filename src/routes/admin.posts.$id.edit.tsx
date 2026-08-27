import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { PropertyEditor } from "@/components/admin/property-editor";
import { useAdmin } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  component: EditPropertyPage,
});

function EditPropertyPage() {
  const { id } = Route.useParams();
  const { posts, updatePost } = useAdmin();
  const navigate = useNavigate();

  const property = posts.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-4">
        <h2 className="font-display text-xl font-bold">Property Not Found</h2>
        <p className="text-sm text-slate-500">The property you are trying to edit does not exist or was removed.</p>
        <Button onClick={() => void navigate({ to: "/admin/dashboard" })}>Return to Properties</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Property: ${property.title}`}
        description={`WpEstate CRM · ID: ${property.id} · MLS #${property.mlsId || "N/A"}`}
      />
      <PropertyEditor
        property={property}
        onSave={async (values) => {
          updatePost(property.id, values);
          void navigate({ to: "/admin/dashboard" });
        }}
        onCancel={() => void navigate({ to: "/admin/dashboard" })}
      />
    </div>
  );
}
