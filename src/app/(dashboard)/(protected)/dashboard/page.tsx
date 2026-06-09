"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Clock,
  Activity,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface Stats {
  totalLeads: number;
  qualifiedLeads: number;
  disqualifiedLeads: number;
  qualificationRate: number;
  projectedRevenue: number;
  revenueSource: "offer" | "budgets";
  avgCallMinutes: number;
  offerPrice: number | null;
  closeRate: number;
  averageScore: number;
  changes: {
    totalLeads: number;
    qualifiedLeads: number;
    disqualifiedLeads: number;
    qualificationRate: number;
    averageScore: number;
    projectedRevenue: number;
  };
  series: {
    total: number[];
    qualified: number[];
    disqualified: number[];
    rate: number[];
    score: number[];
  };
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string;
  aiScore: number | null;
  status: string;
  source: string | null;
  createdAt: string;
}

type MetricKey = "timeSaved" | "qualifiedLeads" | "closeProbability" | "projectedRevenue";
type ValueKind = "currency" | "count" | "percent" | "hours";

const METRIC_LABELS: Record<MetricKey, string> = {
  timeSaved: "Time Saved",
  qualifiedLeads: "Qualified Leads",
  closeProbability: "Close Probability",
  projectedRevenue: "Projected Revenue",
};

const PERIODS = ["7D", "30D", "90D", "1Y"] as const;
type Period = (typeof PERIODS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────
function ChangePill({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs ${
        positive ? "text-emerald-400" : "text-rose-400"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}
      {Math.abs(value).toFixed(0)}%
    </span>
  );
}

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  let n;
  if (norm <= 1) n = 1;
  else if (norm <= 2) n = 2;
  else if (norm <= 5) n = 5;
  else n = 10;
  return n * mag;
}

function formatValue(value: number, kind: ValueKind): string {
  if (kind === "percent") return `${Math.round(value)}%`;
  if (kind === "hours") {
    if (value === 0) return "0h";
    if (value < 1) return `${Math.round(value * 60)}m`;
    return `${value % 1 === 0 ? value : value.toFixed(1)}h`;
  }
  if (kind === "currency") {
    if (value === 0) return "$0";
    if (Math.abs(value) >= 1_000_000) {
      const m = value / 1_000_000;
      return `$${m % 1 === 0 ? m : m.toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      const k = value / 1000;
      return `$${k % 1 === 0 ? k : k.toFixed(1)}k`;
    }
    return `$${Math.round(value)}`;
  }
  return `${Math.round(value)}`;
}

function fullValue(value: number, kind: ValueKind): string {
  if (kind === "percent") return `${Math.round(value)}%`;
  if (kind === "hours") {
    if (value === 0) return "0 hours";
    if (value < 1) return `${Math.round(value * 60)} minutes`;
    return `${value % 1 === 0 ? value : value.toFixed(1)} hours`;
  }
  if (kind === "currency") return `$${Math.round(value).toLocaleString()}`;
  return `${Math.round(value)}`;
}

// ─── Mini Sparkline ──────────────────────────────────────────────────
function MiniSpark({ data, active }: { data: number[]; active: boolean }) {
  const safe = data.length > 0 ? data : [0, 0];
  const max = Math.max(...safe, 1);
  const min = Math.min(...safe, 0);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const step = safe.length > 1 ? w / (safe.length - 1) : w;
  const pts = safe
    .map((v, i) => {
      const x = i * step;
      const y = h - 2 - ((v - min) / range) * (h - 4);
      return [x, y] as const;
    });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = line + ` L${(safe.length - 1) * step},${h} L0,${h} Z`;
  const gradId = `mini-${active ? "a" : "i"}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-6" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={active ? "#ffd87c" : "#71717a"}
            stopOpacity={active ? 0.35 : 0.2}
          />
          <stop
            offset="100%"
            stopColor={active ? "#ffd87c" : "#71717a"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={active ? "#ffd87c" : "#71717a"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Stat Card (clickable, drives chart metric) ──────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  sparkData,
  active,
  onClick,
  tooltip,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: number;
  sparkData: number[];
  active: boolean;
  onClick: () => void;
  tooltip: { title: string; body: string; formula?: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative w-full text-left rounded-2xl border bg-gradient-to-br from-[#0C0C0C] to-[#070707] p-5 transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd87c]/40 ${
        active
          ? "border-[#ffd87c]/40 shadow-[0_0_28px_-6px_rgba(210,172,71,0.30),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border-white/[0.06] hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]"
      }`}
    >
      {/* top edge highlight when active */}
      {active && (
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#ffd87c] to-transparent" />
      )}
      {/* subtle inner sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
              active
                ? "border border-[#ffd87c]/30 bg-[#ffd87c]/[0.08]"
                : "border border-white/[0.08] bg-white/[0.03] group-hover:bg-white/[0.05]"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-colors ${
                active ? "text-[#ffd87c]" : "text-gray-400"
              }`}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                role="button"
                tabIndex={0}
                aria-label={`What is ${label}?`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
                className="text-gray-600 hover:text-[#ffd87c] transition-colors cursor-help focus:outline-none focus-visible:text-[#ffd87c]"
              >
                <Info className="h-4 w-4" />
              </span>
            </TooltipTrigger>
            <TooltipPrimitive.Portal>
              <TooltipPrimitive.Content
                side="top"
                align="end"
                sideOffset={8}
                collisionPadding={16}
                avoidCollisions
                style={{
                  width: "280px",
                  minWidth: "280px",
                  maxWidth: "calc(100vw - 32px)",
                  zIndex: 9999,
                }}
                className="rounded-md bg-[#0d0d0d] text-gray-200 border border-white/10 px-3 py-2.5 text-xs shadow-[0_8px_24px_-6px_rgba(0,0,0,0.8)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <p className="font-semibold text-white text-[13px]">
                  {tooltip.title}
                </p>
                <p className="text-gray-400 mt-1 leading-relaxed whitespace-normal">
                  {tooltip.body}
                </p>
                {tooltip.formula && (
                  <p className="text-[11px] text-[#ffd87c]/90 mt-2 font-mono break-words whitespace-normal">
                    {tooltip.formula}
                  </p>
                )}
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          </Tooltip>
        </div>

        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={`text-3xl font-bold mt-1 tracking-tight tabular-nums transition-colors ${
            active ? "text-white" : "text-white/95"
          }`}
        >
          {value}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <ChangePill value={change} />
            <span className="text-[11px] text-gray-600">7d</span>
          </div>
          <div className="w-20">
            <MiniSpark data={sparkData} active={active} />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Revenue Chart with hover crosshair + tooltip ────────────────────
function RevenueChart({
  data,
  dates,
  kind,
}: {
  data: number[];
  dates: string[];
  kind: ValueKind;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const max = Math.max(...data, 0);
  const emptyFallback = kind === "currency" ? 10000 : kind === "count" ? 10 : kind === "hours" ? 4 : 100;
  const niceTop = kind === "percent" ? 100 : max > 0 ? niceMax(max) : emptyFallback;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => p * niceTop);

  const w = 900;
  const h = 200;
  const padL = 60;
  const padR = 20;
  const padT = 12;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const xStep = data.length > 1 ? innerW / (data.length - 1) : innerW;
  const points = data.map((v, i) => {
    const x = padL + i * xStep;
    const y = padT + innerH - (v / niceTop) * innerH;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaPath =
    points.length > 0
      ? linePath +
        ` L${padL + (data.length - 1) * xStep},${padT + innerH} L${padL},${padT + innerH} Z`
      : "";

  const last = points[points.length - 1];

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * w;
    if (relX < padL - 4 || relX > padL + innerW + 4) {
      setHoverIdx(null);
      return;
    }
    const idx = Math.round((relX - padL) / xStep);
    if (idx >= 0 && idx < data.length) setHoverIdx(idx);
    else setHoverIdx(null);
  }

  const hoverPoint = hoverIdx != null ? points[hoverIdx] : null;
  // Tooltip position in % of SVG box (used because SVG is responsive width)
  const tooltipLeftPct = hoverPoint ? (hoverPoint[0] / w) * 100 : 0;
  const tooltipTopPct = hoverPoint ? (hoverPoint[1] / h) * 100 : 0;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full select-none"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd87c" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#ffd87c" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffd87c" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd87c" />
            <stop offset="100%" stopColor="#ffd87c" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {ticks.map((tick) => {
          const y = padT + innerH - (tick / niceTop) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padL}
                x2={padL + innerW}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="2 4"
              />
              <text
                x={padL - 10}
                y={y + 4}
                fontSize="11"
                fill="#52525b"
                textAnchor="end"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {formatValue(tick, kind)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#goldArea)" />}
        {/* Line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#goldLine)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Last point: dotted line + dot (only when not hovering) */}
        {hoverIdx === null && last && data.length > 0 && (
          <>
            <line
              x1={last[0]}
              x2={last[0]}
              y1={padT}
              y2={padT + innerH}
              stroke="rgba(236,202,102,0.35)"
              strokeDasharray="3 3"
            />
            <circle
              cx={last[0]}
              cy={last[1]}
              r="5"
              fill="#ffd87c"
              stroke="#070707"
              strokeWidth="2"
            />
          </>
        )}

        {/* Hover crosshair */}
        {hoverPoint && (
          <>
            <line
              x1={hoverPoint[0]}
              x2={hoverPoint[0]}
              y1={padT}
              y2={padT + innerH}
              stroke="rgba(255,255,255,0.18)"
              strokeDasharray="3 3"
            />
            <circle
              cx={hoverPoint[0]}
              cy={hoverPoint[1]}
              r="6"
              fill="#ffd87c"
              stroke="#070707"
              strokeWidth="2"
            />
          </>
        )}

        {/* X labels */}
        {dates.map((d, i) => (
          <text
            key={i}
            x={padL + i * xStep}
            y={h - 8}
            fontSize="11"
            fill={hoverIdx === i ? "#ffd87c" : "#52525b"}
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {d}
          </text>
        ))}
      </svg>

      {/* Tooltip overlay (HTML for crisp text) */}
      {hoverIdx != null && hoverPoint && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${tooltipLeftPct}%`,
            top: `${tooltipTopPct}%`,
            transform: "translate(-50%, calc(-100% - 14px))",
          }}
        >
          <div className="rounded-lg border border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-md px-3 py-2 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.8)] min-w-[110px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-500">
              {dates[hoverIdx]}
            </div>
            <div className="text-sm font-semibold text-white tabular-nums mt-0.5">
              {fullValue(data[hoverIdx], kind)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  QUALIFIED: { dot: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400" },
  DISQUALIFIED: { dot: "bg-amber-500", badge: "bg-rose-500/15 text-rose-400" },
  PENDING: { dot: "bg-gray-500", badge: "bg-gray-500/15 text-gray-400" },
};

function LeadCard({ lead }: { lead: Lead }) {
  const initials = lead.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const styles = STATUS_STYLES[lead.status] ?? STATUS_STYLES.PENDING;

  return (
    <Link
      href={`/dashboard/leads/${lead.id}`}
      className="group relative block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0C0C0C] to-[#070707] p-5 transition-all hover:border-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/[0.06]">
                {initials}
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${styles.dot} border-2 border-[#070707]`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate group-hover:text-[#ffd87c] transition-colors">
                {lead.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{lead.email}</p>
            </div>
          </div>
          <span
            className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${styles.badge}`}
          >
            {lead.status}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] text-gray-500">Score</p>
            <p className="text-sm font-semibold text-white mt-1 tabular-nums">
              {lead.aiScore != null ? `${lead.aiScore}/10` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Budget</p>
            <p className="text-sm font-semibold text-white mt-1">
              {lead.budget || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Activity</p>
            <p className="text-sm font-semibold text-white mt-1">
              {relativeTime(lead.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Metric Dropdown ─────────────────────────────────────────────────
function MetricDropdown({
  metric,
  onChange,
}: {
  metric: MetricKey;
  onChange: (m: MetricKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.18] text-sm text-gray-200 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        {METRIC_LABELS[metric]}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-lg border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-md shadow-2xl overflow-hidden">
          {(Object.keys(METRIC_LABELS) as MetricKey[]).map((k) => (
            <button
              key={k}
              onClick={() => {
                onChange(k);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-white/[0.06] transition-colors ${
                k === metric ? "text-[#ffd87c]" : "text-gray-300"
              }`}
            >
              {METRIC_LABELS[k]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<MetricKey>("timeSaved");
  const [period, setPeriod] = useState<Period>("7D");

  async function loadData() {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch("/api/leads/stats"),
        fetch("/api/leads"),
      ]);

      // Treat both "no data yet" and "API hiccup" as empty state so a fresh
      // account doesn't see an angry red error banner before they've done
      // anything. Only show the banner for truly unexpected failures.
      const statsData = statsRes.ok ? await statsRes.json() : null;
      const leadsData = leadsRes.ok ? await leadsRes.json() : [];

      setStats(statsData);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const profileMissing = stats?.offerPrice == null;

  const dateLabels = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) =>
      format(subDays(today, 6 - i), "MMM d")
    );
  }, []);

  const rangeLabel = useMemo(() => {
    const today = new Date();
    const start = subDays(today, 6);
    return `${format(start, "MMM d")} – ${format(today, "MMM d, yyyy")}`;
  }, []);

  // Derived series per metric
  const seriesByMetric = useMemo<Record<MetricKey, { series: number[]; kind: ValueKind }>>(
    () => {
      if (!stats) {
        return {
          timeSaved: { series: [0, 0, 0, 0, 0, 0, 0], kind: "hours" },
          qualifiedLeads: { series: [0, 0, 0, 0, 0, 0, 0], kind: "count" },
          closeProbability: { series: [0, 0, 0, 0, 0, 0, 0], kind: "percent" },
          projectedRevenue: { series: [0, 0, 0, 0, 0, 0, 0], kind: "currency" },
        };
      }
      const offer = stats.offerPrice ?? 0;
      const close = stats.closeRate / 100;
      const minutes = stats.avgCallMinutes;
      const avgBudget =
        stats.qualifiedLeads > 0 ? stats.projectedRevenue / stats.qualifiedLeads : 0;
      return {
        timeSaved: {
          series: stats.series.disqualified.map(
            (d) => Math.round(((d * minutes) / 60) * 10) / 10
          ),
          kind: "hours",
        },
        qualifiedLeads: { series: stats.series.qualified, kind: "count" },
        closeProbability: { series: stats.series.rate, kind: "percent" },
        projectedRevenue: {
          series: offer
            ? stats.series.qualified.map((q) => Math.round(q * offer * close))
            : stats.series.qualified.map((q) => Math.round(q * avgBudget)),
          kind: "currency",
        },
      };
    },
    [stats]
  );

  const disqualifiedCount = stats?.disqualifiedLeads ?? 0;
  const minutesPerCall = stats?.avgCallMinutes ?? 30;
  const timeSavedHours = Math.round((disqualifiedCount * minutesPerCall) / 60 * 10) / 10;

  const cardValues = useMemo<Record<MetricKey, string>>(
    () => ({
      timeSaved:
        timeSavedHours === 0
          ? "0h"
          : timeSavedHours < 1
          ? `${Math.round(disqualifiedCount * minutesPerCall)}m`
          : `${timeSavedHours}h`,
      qualifiedLeads: (stats?.qualifiedLeads ?? 0).toString(),
      closeProbability: `${stats?.qualificationRate ?? 0}%`,
      projectedRevenue: `$${(stats?.projectedRevenue ?? 0).toLocaleString()}`,
    }),
    [timeSavedHours, disqualifiedCount, minutesPerCall, stats]
  );

  const chartHeader = useMemo(() => {
    const totalForMetric = seriesByMetric[metric].series.reduce((a, b) => a + b, 0);
    if (metric === "closeProbability") return cardValues[metric];
    if (metric === "timeSaved") return cardValues[metric];
    if (metric === "qualifiedLeads") return cardValues[metric];
    return cardValues[metric];
  }, [metric, seriesByMetric, cardValues]);

  // ─── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0d0d0d] via-[#070707] to-[#050503] min-h-full">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Revenue Intelligence Dashboard
          </h1>
          <p className="text-gray-500">Loading your dashboard…</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6"
            >
              <div className="h-24 bg-white/[0.03] animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] h-[320px] animate-pulse" />
      </div>
    );
  }

  const changes = stats?.changes ?? {
    totalLeads: 0,
    qualifiedLeads: 0,
    disqualifiedLeads: 0,
    qualificationRate: 0,
    averageScore: 0,
    projectedRevenue: 0,
  };

  const cardChange: Record<MetricKey, number> = {
    timeSaved: changes.disqualifiedLeads,
    qualifiedLeads: changes.qualifiedLeads,
    closeProbability: changes.qualificationRate,
    projectedRevenue: changes.projectedRevenue,
  };

  const cardIcons: Record<MetricKey, typeof Users> = {
    timeSaved: Clock,
    qualifiedLeads: UserCheck,
    closeProbability: TrendingUp,
    projectedRevenue: DollarSign,
  };

  const orderedMetrics: MetricKey[] = [
    "timeSaved",
    "qualifiedLeads",
    "closeProbability",
    "projectedRevenue",
  ];

  const cardTooltip: Record<
    MetricKey,
    { title: string; body: string; formula?: string }
  > = {
    timeSaved: {
      title: "Time Saved",
      body: "Hours you didn't waste on calls with leads who clearly weren't a fit. Every lead the AI filters out as DISQUALIFIED is a sales call you didn't have to take — and that's the whole point of the form.",
      formula: `= disqualified leads × ${minutesPerCall} min/call`,
    },
    qualifiedLeads: {
      title: "Qualified Leads",
      body: "Leads who passed your scoring threshold and are worth getting on a call with. The AI scores every submission 0–10 based on their answers vs. the rules you set in the Form Builder.",
      formula: "= leads with status QUALIFIED",
    },
    closeProbability: {
      title: "Close Probability",
      body: "What % of all submitted leads end up qualified. A healthy form lands around 30–70%. Too low → your questions are too strict (or your ad traffic is junk). Too high → you're letting weak leads through.",
      formula: "= qualified ÷ total leads",
    },
    projectedRevenue: {
      title: "Projected Revenue",
      body:
        stats?.revenueSource === "offer"
          ? `Expected revenue from this period's qualified leads, based on your offer price and close rate from your Business Profile.`
          : "Estimated revenue from this period's qualified leads, summed from the budget ranges they entered on the form. Set an offer price in your Business Profile for a sharper estimate.",
      formula:
        stats?.revenueSource === "offer"
          ? `= qualified × $${stats?.offerPrice?.toLocaleString()} × ${stats?.closeRate}%`
          : "= sum of qualified-lead budgets",
    },
  };

  return (
    <TooltipProvider delayDuration={150}>
    <div className="space-y-8 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0d0d0d] via-[#070707] to-[#050503] min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Revenue Intelligence Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lead qualification system for high-ticket businesses.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.18] text-sm text-gray-200 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <Calendar className="h-4 w-4 text-gray-400" />
          {rangeLabel}
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {profileMissing && !error && (
        <Link
          href="/dashboard/business"
          className="block rounded-xl border border-[#ffd87c]/30 bg-[#ffd87c]/[0.06] px-4 py-3 text-sm hover:bg-[#ffd87c]/[0.10] transition-colors"
        >
          <span className="text-[#ffd87c] font-medium">Set your offer price</span>
          <span className="text-gray-400">
            {" "}
            in your Business Profile so Projected Revenue reflects your actual
            business. →
          </span>
        </Link>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="text-xs font-medium text-rose-200 hover:text-white border border-rose-500/40 rounded-md px-2 py-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards — clickable to drive chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderedMetrics.map((k) => (
          <StatCard
            key={k}
            icon={cardIcons[k]}
            label={METRIC_LABELS[k]}
            value={cardValues[k]}
            change={cardChange[k]}
            sparkData={seriesByMetric[k].series}
            active={metric === k}
            onClick={() => setMetric(k)}
            tooltip={cardTooltip[k]}
          />
        ))}
      </div>

      {/* Revenue Pipeline Chart */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#0C0C0C] to-[#070707] p-5 overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#ffd87c]" />
                <h2 className="text-base font-semibold text-white">Revenue Pipeline</h2>
              </div>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight tabular-nums">
                {chartHeader}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {METRIC_LABELS[metric]} · last 7 days · hover to inspect
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MetricDropdown metric={metric} onChange={setMetric} />
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 h-8 text-xs font-medium rounded-md transition-all ${
                      period === p
                        ? "bg-gradient-to-b from-white/[0.10] to-white/[0.04] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0_10px_-2px_rgba(236,202,102,0.15)]"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <RevenueChart
              data={seriesByMetric[metric].series}
              dates={dateLabels}
              kind={seriesByMetric[metric].kind}
            />
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Leads</h2>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            View all leads
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-12 text-center">
            <Users className="h-10 w-10 text-gray-700 mx-auto mb-3" />
            <h3 className="text-base font-medium text-white">No leads yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share your form link to start receiving leads.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.slice(0, 3).map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
