import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", to: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
      <ol className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-1 px-4 py-3 text-xs text-muted-foreground sm:px-6">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-medium text-foreground">
                  {crumb.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
