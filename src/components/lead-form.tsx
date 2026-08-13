import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/public.functions";
import { leadSchema } from "@/lib/schemas";
import { track } from "@/lib/analytics";

type Props = {
  source?: string;
  propertyId?: string | null;
  defaultMessage?: string;
  compact?: boolean;
};

export function LeadForm({ source = "website", propertyId = null, defaultMessage = "", compact }: Props) {
  const submit = useServerFn(submitLead);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = leadSchema.safeParse({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      source,
      propertyId,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setPending(true);
    try {
      const result = await submit({ data: parsed.data });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      track("lead_submit", { source });
      await navigate({ to: "/thank-you" });
    } catch {
      toast.error("Something went wrong. Please call us instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor="lead-name">Full name</Label>
          <Input id="lead-name" name="name" maxLength={100} autoComplete="name" required />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lead-email">Email</Label>
          <Input
            id="lead-email"
            name="email"
            type="email"
            maxLength={255}
            autoComplete="email"
            required
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-phone">Phone (optional)</Label>
        <Input id="lead-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="lead-message">How can we help?</Label>
        <Textarea
          id="lead-message"
          name="message"
          rows={4}
          maxLength={1500}
          defaultValue={defaultMessage}
          placeholder="Tell us about the property, timeline, or neighborhood you have in mind."
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <Button type="submit" disabled={pending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {pending ? "Sending…" : "Request Information"}
      </Button>
      <p className="text-xs text-muted-foreground">
        We reply within 15 minutes during business hours. Your details are never sold or shared.
      </p>
    </form>
  );
}
