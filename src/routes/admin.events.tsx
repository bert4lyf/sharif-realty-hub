import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  PlusCircle,
  Sparkles,
  Trash2,
  Users,
  Wine,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/lib/admin-store";
import type { OpenHouseEvent } from "@/lib/types";

export const Route = createFileRoute("/admin/events")({
  component: AdminEventsPage,
});

export function AdminEventsPage() {
  const { openHouses, createOpenHouse, deleteOpenHouse, posts } = useAdmin();
  const [isCreating, setIsCreating] = useState(false);

  // New Open House form state
  const [propertyId, setPropertyId] = useState(posts[0]?.id || "");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [startTime, setStartTime] = useState("1:00 PM");
  const [endTime, setEndTime] = useState("4:00 PM");
  const [hostAgent, setHostAgent] = useState("Majeed Sharif");
  const [refreshments, setRefreshments] = useState("Artisanal Champagne & Private Caviar Service");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const prop = posts.find((p) => p.id === propertyId) || posts[0];
    if (!prop) {
      toast.error("Please select a property.");
      return;
    }

    createOpenHouse({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: `${prop.address}, ${prop.city}, ${prop.state}`,
      propertyImage: prop.image || prop.images?.[0] || "",
      date,
      startTime,
      endTime,
      hostAgent,
      refreshments,
      rsvpCount: 0,
      status: "Upcoming",
    });

    setIsCreating(false);
    toast.success("Open house event scheduled!");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events & Open House Scheduler"
        description="Schedule VIP private broker opens, weekend open houses, and champagne sunset previews."
        action={
          !isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-[#2271b1] text-white hover:bg-[#135e96] shadow-sm"
            >
              <PlusCircle className="size-4 mr-1.5" /> Schedule New Open House
            </Button>
          )
        }
      />

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="size-4 text-blue-600" />
              Schedule New Open House Event
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-600">Select Estate *</Label>
              <select
                aria-label="Select Estate"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs shadow-sm font-medium"
              >
                {posts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.address}, {p.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-date" className="text-xs font-bold uppercase text-slate-600">
                Date *
              </Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="event-start" className="text-xs font-bold uppercase text-slate-600">
                Start Time
              </Label>
              <Input
                id="event-start"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 1:00 PM"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-end" className="text-xs font-bold uppercase text-slate-600">
                End Time
              </Label>
              <Input
                id="event-end"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 4:00 PM"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event-agent" className="text-xs font-bold uppercase text-slate-600">
                Host Broker
              </Label>
              <Input
                id="event-agent"
                value={hostAgent}
                onChange={(e) => setHostAgent(e.target.value)}
                placeholder="Majeed Sharif"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="event-refreshments" className="text-xs font-bold uppercase text-slate-600">
              Refreshments / Special Hospitality Notes
            </Label>
            <Input
              id="event-refreshments"
              value={refreshments}
              onChange={(e) => setRefreshments(e.target.value)}
              placeholder="e.g. Artisanal Wine Tasting & Sunset Preview"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="submit" className="bg-[#2271b1] text-white hover:bg-[#135e96]">
              Publish Open House Event
            </Button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="grid gap-6 sm:grid-cols-2">
        {openHouses.map((event) => (
          <div
            key={event.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img src={event.propertyImage} alt={event.propertyTitle} className="size-full object-cover" />
                <div className="absolute top-3 left-3 rounded bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow">
                  {event.status}
                </div>
                <div className="absolute bottom-3 right-3 rounded bg-black/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {event.rsvpCount} VIP RSVPs
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h4 className="font-display text-lg font-bold text-slate-900 line-clamp-1">
                  {event.propertyTitle}
                </h4>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="size-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{event.propertyAddress}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Date</span>
                    <p className="font-semibold text-slate-800">{event.date}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Time</span>
                    <p className="font-semibold text-slate-800">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p className="flex items-center gap-1 text-slate-500">
                    <Users className="size-3.5 text-blue-600" />
                    Host: <strong className="text-slate-800 ml-1">{event.hostAgent}</strong>
                  </p>
                  <p className="flex items-center gap-1 text-slate-500">
                    <Wine className="size-3.5 text-amber-600" />
                    <span className="italic">{event.refreshments}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4">
              <span className="text-xs font-mono text-slate-400">ID: {event.id}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove the open house event for "${event.propertyTitle}"?`)) {
                    deleteOpenHouse(event.id);
                    toast.success("Open house event removed.");
                  }
                }}
                className="h-7 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="size-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
