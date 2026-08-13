import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappHref } from "@/lib/site";
import { track } from "@/lib/analytics";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-3 divide-x divide-border">
        <a
          href={SITE.phoneHref}
          onClick={() => track("call_click", { location: "sticky_bar" })}
          className="flex flex-col items-center gap-1 py-3 text-xs font-semibold text-foreground"
        >
          <Phone className="size-5 text-accent" aria-hidden="true" />
          Call Now
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => track("whatsapp_click", { location: "sticky_bar" })}
          className="flex flex-col items-center gap-1 py-3 text-xs font-semibold text-foreground"
        >
          <MessageCircle className="size-5 text-accent" aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href="#request-info"
          onClick={() => track("book_viewing_click", { location: "sticky_bar" })}
          className="flex flex-col items-center gap-1 py-3 text-xs font-semibold text-foreground"
        >
          <CalendarCheck className="size-5 text-accent" aria-hidden="true" />
          Book Viewing
        </a>
      </div>
    </div>
  );
}
