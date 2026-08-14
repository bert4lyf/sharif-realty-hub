import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHARIF_MEDIA_BASE } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <AdminPageHeader title="Settings" description="General configuration for the Sharif Realty site." />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Settings saved");
        }}
        className="max-w-2xl space-y-4 rounded-sm border border-border bg-card p-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="s-title">Site title</Label>
          <Input id="s-title" defaultValue="Sharif Realty" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-tagline">Tagline</Label>
          <Input id="s-tagline" defaultValue="Off market deals and luxury listings" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-email">Admin email</Label>
          <Input id="s-email" type="email" defaultValue="admin@gmail.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-media">Media base URL</Label>
          <Input id="s-media" defaultValue={SHARIF_MEDIA_BASE} />
        </div>
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Save changes
        </Button>
      </form>
    </>
  );
}
