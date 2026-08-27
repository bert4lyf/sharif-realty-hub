import { useState } from "react";
import { Calendar, CheckCircle2, Clock, MapPin, Sparkles, User, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdmin } from "@/lib/admin-store";
import { toast } from "sonner";

const TIME_SLOTS = [
  "10:00 AM - 11:30 AM",
  "12:00 PM - 1:30 PM",
  "2:00 PM - 3:30 PM",
  "4:00 PM - 5:30 PM",
  "6:00 PM - 7:30 PM (Sunset Tour)",
];

export function ScheduleTourModal({
  open,
  onOpenChange,
  propertyTitle,
  propertyAddress,
  propertyImage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyTitle?: string | undefined;
  propertyAddress?: string | undefined;
  propertyImage?: string | undefined;
}) {
  const { addLead } = useAdmin();
  const [tourType, setTourType] = useState<"in_person" | "video">("in_person");
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[2]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter your name and email.");
      return;
    }

    addLead({
      name,
      email,
      phone: phone || "(Not provided)",
      property: propertyTitle || "General Luxury Portfolio Tour",
      message: `[TOUR REQUEST - ${tourType === "in_person" ? "In-Person VIP Tour" : "Live Video Walkthrough"}] Date: ${selectedDate} | Time Slot: ${selectedSlot} | Notes: ${notes || "None"}`,
      status: "New",
      agent: "Majeed Sharif",
    });

    setSubmitted(true);
    toast.success("Private tour requested! Majeed Sharif will contact you within 15 minutes.");
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setNotes("");
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl border-border bg-card p-0 sm:max-w-2xl overflow-hidden shadow-2xl">
        <div className="relative bg-slate-deep px-6 py-6 text-slate-deep-foreground">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="eyebrow font-semibold tracking-wider">Sharif Realty VIP Services</span>
          </div>
          <DialogTitle className="mt-2 font-display text-2xl sm:text-3xl text-white">
            Schedule a Private Tour
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-slate-deep-foreground/80">
            Experience the craftsmanship and setting with a dedicated showing led by Majeed Sharif.
          </DialogDescription>

          {propertyTitle && (
            <div className="mt-4 flex items-center gap-3 rounded-md bg-white/10 p-2.5 backdrop-blur-sm">
              {propertyImage && (
                <img
                  src={propertyImage}
                  alt={propertyTitle}
                  className="h-12 w-16 rounded object-cover border border-white/20"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{propertyTitle}</p>
                {propertyAddress && (
                  <p className="flex items-center gap-1 text-xs text-white/70">
                    <MapPin className="size-3 text-accent" />
                    <span className="truncate">{propertyAddress}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/20 text-accent">
              <CheckCircle2 className="size-10" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Tour Reservation Requested
            </h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Thank you, <strong className="text-foreground">{name}</strong>. We have registered your{" "}
              {tourType === "in_person" ? "in-person showing" : "video walkthrough"} for{" "}
              <strong className="text-foreground">{selectedDate}</strong> at{" "}
              <strong className="text-foreground">{selectedSlot}</strong>.
            </p>
            <div className="rounded-lg bg-muted/60 p-4 text-xs text-muted-foreground text-left space-y-1">
              <p className="font-semibold text-foreground">What happens next?</p>
              <p>1. Majeed Sharif's private desk will call/text you within 15 minutes to confirm access gates and entry codes.</p>
              <p>2. A calendar invitation with address and parking instructions will be emailed to {email}.</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Tour Type Selector */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Tour Format
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType("in_person")}
                  className={`flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold transition-all ${
                    tourType === "in_person"
                      ? "border-accent bg-accent/10 text-accent-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <User className="size-4 text-accent" />
                  In-Person Private Showing
                </button>
                <button
                  type="button"
                  onClick={() => setTourType("video")}
                  className={`flex items-center justify-center gap-2 rounded-md border p-3 text-sm font-semibold transition-all ${
                    tourType === "video"
                      ? "border-accent bg-accent/10 text-accent-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  <Video className="size-4 text-accent" />
                  Live FaceTime / Video Tour
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tour-date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Date
                </Label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="tour-date"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tour-time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Time Slot
                </Label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    id="tour-time"
                    aria-label="Preferred Time Slot"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tour-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </Label>
                <Input
                  id="tour-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Sterling"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tour-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </Label>
                <Input
                  id="tour-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tour-phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Direct Phone / Mobile
                </Label>
                <Input
                  id="tour-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(203) 555-0100"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tour-notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Special Notes / Accessibility
                </Label>
                <Input
                  id="tour-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. bringing architect"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-accent text-accent-foreground font-bold uppercase tracking-widest hover:bg-accent/90">
              Confirm VIP Tour Request
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
