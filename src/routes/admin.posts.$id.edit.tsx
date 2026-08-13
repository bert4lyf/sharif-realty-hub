import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { PostForm } from "@/components/admin/post-form";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/posts/$id/edit")({
  component: EditPostPage,
});

function EditPostPage() {
  const { id } = useParams({ from: "/admin/posts/$id/edit" });
  const { posts, updatePost } = useAdmin();
  const navigate = useNavigate();
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return (
      <>
        <AdminPageHeader title="Post not found" description="This post may have been deleted." />
        <button
          type="button"
          className="text-sm font-semibold text-accent hover:underline"
          onClick={() => void navigate({ to: "/admin/dashboard" })}
        >
          Back to All Posts
        </button>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="Edit Property" description={post.address || post.title} />
      <PostForm
        post={post}
        onSubmit={(draft) => {
          updatePost(post.id, draft);
          toast.success("Property updated");
          void navigate({ to: "/admin/dashboard" });
        }}
        onCancel={() => void navigate({ to: "/admin/dashboard" })}
      />
    </>
  );
}
