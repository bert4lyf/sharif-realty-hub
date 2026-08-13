import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { PostForm } from "@/components/admin/post-form";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/posts/new")({
  component: NewPostPage,
});

function NewPostPage() {
  const { createPost } = useAdmin();
  const navigate = useNavigate();

  return (
    <>
      <AdminPageHeader
        title="Add New Property"
        description="Create a property post with full listing details."
      />
      <PostForm
        onSubmit={(draft) => {
          createPost(draft);
          toast.success("Property published");
          void navigate({ to: "/admin/dashboard" });
        }}
        onCancel={() => void navigate({ to: "/admin/dashboard" })}
      />
    </>
  );
}
