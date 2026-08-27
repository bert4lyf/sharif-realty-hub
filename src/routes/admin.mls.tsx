import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Database,
  Key,
  Layers,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/wp-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/mls")({
  component: AdminMlsPage,
});

const MLS_PROVIDERS = [
  "SmartMLS / Connecticut MLS (RESO API v2)",
  "Miami Association of REALTORS® (RETS/RESO)",
  "Bright MLS (Mid-Atlantic)",
  "Stellar MLS / Florida Regional",
];

export function AdminMlsPage() {
  const { mlsConfig, mlsLogs, updateMlsConfig, triggerMlsSync, posts } = useAdmin();
  const [isSyncing, setIsSyncing] = useState(false);
  const [providerName, setProviderName] = useState(mlsConfig.providerName);
  const [apiKey, setApiKey] = useState(mlsConfig.apiKey);
  const [feedUrl, setFeedUrl] = useState(mlsConfig.feedUrl);
  const [agentMlsId, setAgentMlsId] = useState(mlsConfig.agentMlsId);
  const [autoSync, setAutoSync] = useState(mlsConfig.autoSyncEnabled);

  async function handleManualSync() {
    setIsSyncing(true);
    try {
      await triggerMlsSync();
      toast.success("MLS synchronization completed successfully!");
    } catch {
      toast.error("MLS synchronization failed.");
    } finally {
      setIsSyncing(false);
    }
  }

  function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    updateMlsConfig({
      providerName,
      apiKey,
      feedUrl,
      agentMlsId,
      autoSyncEnabled: autoSync,
    });
    toast.success("MLS / RETS configuration saved!");
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="MLS Import & IDX Sync Engine"
        description="Configure automated RETS / RESO Web API synchronization, broker feed credentials, and live registry health."
        action={
          <Button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="bg-[#2271b1] text-white hover:bg-[#135e96] shadow-sm font-semibold"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isSyncing ? "animate-spin text-accent" : ""}`} />
            {isSyncing ? "Syncing MLS Records..." : "Trigger Manual Sync Now"}
          </Button>
        }
      />

      {/* Sync Health & Status Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Connection Status</span>
            <Server className="size-4 text-blue-600" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display text-xl font-bold text-slate-900">
              {mlsConfig.status} (RESO Web API)
            </span>
          </div>
          <p className="text-xs text-slate-500">Latency: 18ms · TLS 1.3 Encrypted</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Last Master Sync</span>
            <Clock className="size-4 text-emerald-600" />
          </div>
          <p className="font-display text-xl font-bold text-slate-900 pt-1">
            {mlsConfig.lastSyncAt || "Just now"}
          </p>
          <p className="text-xs text-emerald-600 font-semibold">
            ✓ Verified with CT State Board
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Synchronized Properties</span>
            <Database className="size-4 text-purple-600" />
          </div>
          <p className="font-display text-xl font-bold text-slate-900 pt-1">
            {posts.length} Active / 148 Total
          </p>
          <p className="text-xs text-slate-500">Auto-Polling Interval: Every 4 Hours</p>
        </div>
      </div>

      {/* MLS Provider & API Configuration Form */}
      <form
        onSubmit={handleSaveConfig}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="border-b border-slate-200 pb-4">
          <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="size-4 text-blue-600" />
            MLS / IDX Provider & Authentication Settings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your board's RETS or RESO Web API endpoint credentials.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-600">MLS Association / Board</Label>
            <select
              aria-label="MLS Association / Board"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-xs shadow-sm font-medium"
            >
              {MLS_PROVIDERS.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mls-agent-id" className="text-xs font-bold uppercase text-slate-600">
              Broker / Agent MLS Member ID
            </Label>
            <Input
              id="mls-agent-id"
              value={agentMlsId}
              onChange={(e) => setAgentMlsId(e.target.value)}
              placeholder="e.g. CT-AGENT-094182"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="mls-api-key" className="text-xs font-bold uppercase text-slate-600">
              RESO API Bearer Token / API Key
            </Label>
            <Input
              id="mls-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="mls_prod_live_..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mls-feed-url" className="text-xs font-bold uppercase text-slate-600">
              OData / RESO Web API Feed Endpoint
            </Label>
            <Input
              id="mls-feed-url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="https://api.smartmls.reso.org/v2/Property"
            />
          </div>
        </div>

        {/* Auto Sync Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold uppercase text-slate-800">
              Enable Automatic Background Sync (Every 4 Hours)
            </Label>
            <p className="text-xs text-slate-500">
              Automatically updates price adjustments, pending contracts, and new listings from MLS.
            </p>
          </div>
          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-[#2271b1] text-white hover:bg-[#135e96]">
            Save MLS Configuration
          </Button>
        </div>
      </form>

      {/* Sync Log Activity Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              MLS Sync Event History & Audit Logs
            </h3>
            <p className="text-xs text-slate-500">
              Record of all automated polls, manual triggers, and schema validations.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {mlsLogs.length} total synchronization events
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[750px] text-xs">
            <thead className="bg-slate-50 text-left uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Records Processed</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Audit Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {mlsLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 font-sans font-medium text-slate-800">{log.provider}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[10px] font-sans">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-sans">
                    {log.recordsProcessed} scanned ({log.recordsUpdated} updated)
                  </td>
                  <td className="px-4 py-3 text-slate-500">{log.durationMs}ms</td>
                  <td className="px-4 py-3 font-sans text-slate-600 max-w-xs truncate">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
