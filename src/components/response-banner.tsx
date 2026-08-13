import { Zap } from "lucide-react";

export function ResponseBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-foreground ${className}`}
    >
      <Zap className="size-4 shrink-0" aria-hidden="true" />
      <span>Response Guarantee: we respond to all inquiries within 15 minutes.</span>
    </div>
  );
}
