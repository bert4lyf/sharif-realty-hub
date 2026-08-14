import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NotFound() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-sm bg-accent text-accent-foreground">
          <Building2 className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-5xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-foreground">
          This address isn't on the market
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has moved or sold. Search our active listings instead.
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void navigate({ to: "/properties", search: term ? { q: term } : {} });
          }}
        >
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search by city, ZIP or address"
            aria-label="Search properties"
            maxLength={120}
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Search className="size-4" aria-hidden="true" />
            Search
          </Button>
        </form>
        <div className="mt-4">
          <Link to="/properties" className="text-sm font-semibold text-accent hover:underline">
            Browse all active listings →
          </Link>
        </div>
      </div>
    </div>
  );
}
