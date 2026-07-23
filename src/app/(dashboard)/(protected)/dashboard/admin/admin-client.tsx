"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Users,
  UserPlus,
  Loader2,
  Search,
  Settings2,
  X,
  Check,
  Copy,
  ShieldCheck,
  ArrowRight,
  Wand2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface Client {
  id: string;
  email: string;
  name: string | null;
  businessName: string | null;
  niche: string | null;
  plan: string | null;
  createdAt: string;
  leadCount: number;
  lastLeadAt: string | null;
  ghlConnected: boolean;
}

const inputCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";
const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wide text-white/60 mb-1.5";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof Users;
  accent: "gold" | "emerald" | "blue";
}) {
  const accents = {
    gold: "bg-[#ffd87c]/10 text-[#ffd87c]",
    emerald: "bg-emerald-500/12 text-emerald-300",
    blue: "bg-blue-500/12 text-blue-300",
  } as const;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-4 flex items-center gap-3.5">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-white tabular-nums">
          {value}
          {sub && <span className="text-white/40 text-sm font-normal"> {sub}</span>}
        </p>
      </div>
    </div>
  );
}

export function AdminClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/clients");
      const data = await res.json();
      if (res.ok) setClients(data.clients ?? []);
      else toast.error(data.error || "Failed to load clients");
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const connected = clients.filter((c) => c.ghlConnected).length;
    const leads = clients.reduce((s, c) => s + c.leadCount, 0);
    return { total: clients.length, connected, leads };
  }, [clients]);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (c.businessName || "").toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-7 pb-6 border-b border-white/[0.06] flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Clients</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#ffd87c] bg-[#ffd87c]/10 border border-[#ffd87c]/25 rounded-full px-2 py-0.5">
              <ShieldCheck className="h-3 w-3" /> Admin only
            </span>
          </div>
          <p className="text-sm text-white/60 mt-1">
            Every business under ReclaimedHQ. Only you can see this.
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-black text-sm font-semibold transition hover:opacity-90"
          style={{ background: "var(--lg-gold-gradient)" }}
        >
          <UserPlus className="h-4 w-4" /> Add client
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Total clients" value={stats.total} icon={Users} accent="gold" />
        <StatCard
          label="GoHighLevel connected"
          value={stats.connected}
          sub={`/ ${stats.total}`}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard label="Leads captured" value={stats.leads} icon={ArrowRight} accent="blue" />
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
        <div className="p-4 flex items-center justify-between gap-3 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">
            Client roster <span className="text-white/40 font-normal tabular-nums">· {clients.length}</span>
          </div>
          <div className="relative w-full max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              placeholder="Search clients"
              className={`${inputCls} pl-9`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white/40" />
            </div>
            <h3 className="text-base font-semibold text-white">No clients yet</h3>
            <p className="text-sm text-white/60 mt-1">
              {search ? "Try a different search." : "Add your first client to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.015] text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">Client</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">Plan</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">Leads</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">GoHighLevel</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">Last lead</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((c) => {
                  const label = c.businessName || c.name || c.email;
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
                            style={{ background: "var(--lg-gold-gradient)" }}
                          >
                            {initials(label)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-white text-sm truncate">{label}</div>
                            <div className="text-xs text-white/50 truncate">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#ffd87c] bg-[#ffd87c]/10 border border-[#ffd87c]/25">
                          {c.plan === "agency" ? "Agency" : c.plan || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/70 tabular-nums">{c.leadCount}</td>
                      <td className="px-5 py-3.5">
                        {c.ghlConnected ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-300 bg-emerald-500/12 border border-emerald-500/25">
                            <Check className="h-3 w-3" /> Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/25">
                            <X className="h-3 w-3" /> Not connected
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/60 whitespace-nowrap">
                        {c.lastLeadAt
                          ? formatDistanceToNowStrict(new Date(c.lastLeadAt), { addSuffix: true })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setManageId(c.id)}
                          className="inline-flex items-center gap-1.5 border border-white/10 hover:border-[#ffd87c]/30 hover:bg-[#ffd87c]/[0.06] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Settings2 className="h-3.5 w-3.5" /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addOpen && (
        <AddClientModal
          onClose={() => setAddOpen(false)}
          onCreated={() => load()}
        />
      )}
      {manageId && (
        <ManageDrawer
          clientId={manageId}
          onClose={() => setManageId(null)}
          onSaved={() => load()}
        />
      )}
    </div>
  );
}

function AddClientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<{ businessName: string; email: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function create() {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create client");
        return;
      }
      setResult({ businessName: data.businessName, email: data.email, tempPassword: data.tempPassword });
      onCreated();
    } catch {
      toast.error("Failed to create client");
    } finally {
      setCreating(false);
    }
  }

  function copyPw() {
    if (!result) return;
    navigator.clipboard?.writeText(result.tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Overlay onClose={onClose}>
      <div className="w-[min(440px,92vw)] rounded-2xl border border-white/[0.12] bg-[#111110] p-6">
        {!result ? (
          <>
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-semibold text-white">Add a client</h2>
              <CloseBtn onClose={onClose} />
            </div>
            <p className="text-sm text-white/60 mb-5">
              Creates their LeadGate account. They&apos;re marked as an agency client, so they&apos;re never asked to pay.
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Business name</label>
                <input className={inputCls} placeholder="Summit Dental Group" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Client email</label>
                <input className={inputCls} placeholder="owner@summitdental.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <p className="text-[11px] text-white/40 mt-1.5">Where they&apos;ll log in. You&apos;ll get a password to send them next.</p>
              </div>
              <button
                onClick={create}
                disabled={creating || !businessName.trim() || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-black text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--lg-gold-gradient)" }}
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Create client
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-13 w-13 rounded-full bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mb-3.5 p-3">
              <Check className="h-6 w-6 text-emerald-300" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1.5">Account created for {result.businessName}</h2>
            <p className="text-sm text-white/60 mb-4">Send them this password and your login link, and they&apos;re in.</p>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-[#ffd87c]/30 bg-[#ffd87c]/[0.06] px-4 py-3 mb-2">
              <code className="font-mono text-[15px] text-[#ffd87c] tracking-wide">{result.tempPassword}</code>
              <button onClick={copyPw} className="inline-flex items-center gap-1.5 border border-[#ffd87c]/30 text-[#ffd87c] hover:bg-[#ffd87c]/15 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition">
                {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
            <p className="text-[11px] text-white/40 mb-4">
              For {result.email}. Temporary — they can reset it after first login.
            </p>
            <button onClick={onClose} className="w-full h-11 rounded-xl text-black text-sm font-semibold transition hover:opacity-90" style={{ background: "var(--lg-gold-gradient)" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </Overlay>
  );
}

interface ClientDetail {
  id: string;
  email: string;
  businessName: string | null;
  ghlLocationId: string | null;
  ghlPipelineId: string | null;
  ghlQualifiedStageId: string | null;
  ghlNewLeadStageId: string | null;
  ghlBookingUrl: string | null;
  ghlPrivateTokenSet: boolean;
}
type Pipeline = { id: string; name: string; stages: { id: string; name: string }[] };

function ManageDrawer({
  clientId,
  onClose,
  onSaved,
}: {
  clientId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [detail, setDetail] = useState<ClientDetail | null>(null);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [f, setF] = useState({
    ghlLocationId: "",
    ghlPrivateToken: "",
    ghlPipelineId: "",
    ghlQualifiedStageId: "",
    ghlNewLeadStageId: "",
    ghlBookingUrl: "",
  });
  const [tokenSet, setTokenSet] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/clients/${clientId}`)
      .then((r) => r.json())
      .then((d: ClientDetail) => {
        setDetail(d);
        setTokenSet(d.ghlPrivateTokenSet);
        setF({
          ghlLocationId: d.ghlLocationId || "",
          ghlPrivateToken: "",
          ghlPipelineId: d.ghlPipelineId || "",
          ghlQualifiedStageId: d.ghlQualifiedStageId || "",
          ghlNewLeadStageId: d.ghlNewLeadStageId || "",
          ghlBookingUrl: d.ghlBookingUrl || "",
        });
      })
      .catch(() => toast.error("Failed to load client"));
  }, [clientId]);

  function set<K extends keyof typeof f>(k: K, v: string) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function detect() {
    setDetecting(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/ghl-detect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ghlLocationId: f.ghlLocationId,
          ghlPrivateToken: f.ghlPrivateToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Detection failed");
        return;
      }
      setPipelines(data.pipelines || []);
      const m = data.match || {};
      setF((prev) => ({
        ...prev,
        ghlPipelineId: m.pipelineId || prev.ghlPipelineId,
        ghlQualifiedStageId: m.qualifiedStageId || prev.ghlQualifiedStageId,
        ghlNewLeadStageId: m.newLeadStageId || prev.ghlNewLeadStageId,
      }));
      toast.success(m.pipelineName ? `Matched "${m.pipelineName}"` : "Pipelines loaded");
    } catch {
      toast.error("Couldn't reach GoHighLevel");
    } finally {
      setDetecting(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        ghlLocationId: f.ghlLocationId,
        ghlPipelineId: f.ghlPipelineId,
        ghlQualifiedStageId: f.ghlQualifiedStageId,
        ghlNewLeadStageId: f.ghlNewLeadStageId,
        ghlBookingUrl: f.ghlBookingUrl,
      };
      if (f.ghlPrivateToken.trim()) body.ghlPrivateToken = f.ghlPrivateToken.trim();
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success("Connection saved");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const selectedPipeline = pipelines.find((p) => p.id === f.ghlPipelineId);
  const label = detail?.businessName || detail?.email || "Client";

  return (
    <Overlay onClose={onClose} align="right">
      <div className="h-screen w-[min(440px,94vw)] overflow-y-auto bg-[#111110] border-l border-white/[0.12] p-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold text-black" style={{ background: "var(--lg-gold-gradient)" }}>
              {initials(label)}
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#ffd87c]">Manage client</div>
              <h2 className="text-base font-semibold text-white leading-tight">{label}</h2>
            </div>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        {!detail ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#ffd87c]" />
          </div>
        ) : (
          <>
            <div className="flex gap-2.5 items-start rounded-xl border border-[#ffd87c]/25 bg-[#ffd87c]/[0.06] px-3.5 py-3 my-4 text-xs text-white/70 leading-relaxed">
              <ShieldCheck className="h-4 w-4 text-[#ffd87c] flex-shrink-0 mt-0.5" />
              <span>You&apos;re editing on behalf of this client. They never see these fields — they just see their leads.</span>
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mt-5 mb-3">GoHighLevel connection</div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Location ID</label>
                <input className={inputCls} placeholder="ve9EPM428h8vShlRW1KT" value={f.ghlLocationId} onChange={(e) => set("ghlLocationId", e.target.value)} />
                <p className="text-[11px] text-white/40 mt-1.5">The string in the sub-account URL: /v2/location/…</p>
              </div>
              <div>
                <label className={labelCls}>Private integration token</label>
                <input
                  type="password"
                  autoComplete="off"
                  className={inputCls}
                  placeholder={tokenSet ? "•••••••••• saved" : "pit-xxxxxxxx-xxxx"}
                  value={f.ghlPrivateToken}
                  onChange={(e) => set("ghlPrivateToken", e.target.value)}
                />
                <p className="text-[11px] text-white/40 mt-1.5">
                  {tokenSet ? "Saved and encrypted. Paste a new one to replace it." : "Stored server-side, encrypted at rest."}
                </p>
              </div>

              <button
                onClick={detect}
                disabled={detecting || !f.ghlLocationId.trim() || (!tokenSet && !f.ghlPrivateToken.trim())}
                className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-[#ffd87c]/30 bg-[#ffd87c]/[0.06] text-[#ffd87c] text-sm font-semibold hover:bg-[#ffd87c]/[0.12] transition disabled:opacity-50"
              >
                {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Auto-detect pipeline &amp; stages
              </button>

              {pipelines.length > 0 ? (
                <>
                  <div>
                    <label className={labelCls}>Pipeline</label>
                    <select className={inputCls} value={f.ghlPipelineId} onChange={(e) => set("ghlPipelineId", e.target.value)}>
                      <option value="" className="bg-[#0d0d0d]">Select pipeline…</option>
                      {pipelines.map((p) => (
                        <option key={p.id} value={p.id} className="bg-[#0d0d0d]">{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Qualified → stage</label>
                      <select className={inputCls} value={f.ghlQualifiedStageId} onChange={(e) => set("ghlQualifiedStageId", e.target.value)}>
                        <option value="" className="bg-[#0d0d0d]">Select…</option>
                        {selectedPipeline?.stages.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#0d0d0d]">{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Disqualified → stage</label>
                      <select className={inputCls} value={f.ghlNewLeadStageId} onChange={(e) => set("ghlNewLeadStageId", e.target.value)}>
                        <option value="" className="bg-[#0d0d0d]">Select…</option>
                        {selectedPipeline?.stages.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#0d0d0d]">{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelCls}>Pipeline ID</label>
                    <input className={inputCls} placeholder="Auto-detect, or paste manually" value={f.ghlPipelineId} onChange={(e) => set("ghlPipelineId", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Qualified stage ID</label>
                      <input className={inputCls} placeholder="—" value={f.ghlQualifiedStageId} onChange={(e) => set("ghlQualifiedStageId", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>New lead stage ID</label>
                      <input className={inputCls} placeholder="—" value={f.ghlNewLeadStageId} onChange={(e) => set("ghlNewLeadStageId", e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className={labelCls}>Booking calendar URL</label>
                <input className={inputCls} placeholder="https://api.leadconnectorhq.com/widget/booking/…" value={f.ghlBookingUrl} onChange={(e) => set("ghlBookingUrl", e.target.value)} />
              </div>
            </div>

            <div className="mt-4 px-3.5 py-3 rounded-lg border border-white/[0.06] text-sm">
              <div className="text-white/40 text-[11px] uppercase tracking-wider font-semibold mb-1">Client login</div>
              <div className="text-white/70">{detail.email}</div>
            </div>
            <a
              href={`/form/${detail.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between mt-2.5 px-3.5 py-3 rounded-lg border border-white/[0.06] hover:border-[#ffd87c]/30 hover:bg-[#ffd87c]/[0.04] text-white/60 hover:text-white text-sm transition"
            >
              <span>Open their public lead form</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="flex gap-2.5 mt-5 pt-5 border-t border-white/[0.06]">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 h-10 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save connection
              </button>
              <button onClick={onClose} className="h-10 px-4 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 text-sm font-medium transition">
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
  align = "center",
}: {
  children: React.ReactNode;
  onClose: () => void;
  align?: "center" | "right";
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex ${
        align === "right" ? "justify-end" : "items-center justify-center p-4"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close"
      className="h-8 w-8 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition flex-shrink-0"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
