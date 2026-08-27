import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { PropertyEditor } from "@/components/admin/property-editor";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/posts/new")({
  component: NewPropertyPage,
});

function NewPropertyPage() {
  const { createPost } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Property Listing"
        description="WpEstate CRM · Publish high-resolution luxury listings and off-market opportunities."
      />
      <PropertyEditor
        onSave={async (values) => {
          createPost(values);
          void navigate({ to: "/admin/dashboard" });
        }}
        onCancel={() => void navigate({ to: "/admin/dashboard" })}
      />
    </div>
  );
}
