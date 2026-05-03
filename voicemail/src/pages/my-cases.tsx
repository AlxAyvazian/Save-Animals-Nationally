import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import { Link } from "wouter";
import {
  FolderOpen, Clock, Archive, FileText, Zap, Activity,
  AlertTriangle, CheckCircle2, ChevronRight, ArrowRight,
  Plus, BarChart2, Shield
} from "lucide-react";

interface Concern {
  id: string;
  date: string;
  type: string;
  location: string;
  status: string;
  description?: string;
}

interface AgencyEntry {
  id: string;
  caseRef?: string;
  concernId?: string;
  agencyName: string;
  contactDate: string;
  agencyType?: string;
  status?: string;
  deadlineDays?: number;
}

interface EvidenceFolder {
  id: string;
  caseRef?: string;
  caseTitle?: string;
  concernId?: string;
  items?: unknown[];
}

interface ActionPlan {
  id: string;
  caseRef?: string;
  concernId?: string;
  createdAt?: string;
  completedSteps?: string[];
}

function loadJSON<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function daysSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineDays(agencyType?: string): number {
  const map: Record<string, number> = {
    federal: 20,
    state: 14,
    local: 7,
    shelter: 5,
  };
  return map[agencyType ?? "local"] ?? 10;
}

interface CaseRollup {
  concernId: string;
  concern: Concern;
  agencies: AgencyEntry[];
  evidenceFolders: EvidenceFolder[];
  actionPlan: ActionPlan | null;
  overdueAgencies: AgencyEntry[];
  pendingAgencies: AgencyEntry[];
  evidenceItemCount: number;
  actionPlanProgress: number;
}

export default function MyCases() {
  const [filter, setFilter] = useState<"all" | "active" | "overdue">("all");

  const { rollups, orphanAgencies, totals } = useMemo(() => {
    const concerns = loadJSON<Concern>("voicemap_concerns");
    const agencies = loadJSON<AgencyEntry>("voicemap_agency_contacts");
    const folders = loadJSON<EvidenceFolder>("voicemap_evidence_vault");
    const plans = loadJSON<ActionPlan>("voicemap_action_plans");

    const rollups: CaseRollup[] = concerns.map((c) => {
      const caseAgencies = agencies.filter(
        (a) => a.concernId === c.id || a.caseRef === c.id
      );
      const caseFolders = folders.filter(
        (f) => f.concernId === c.id || f.caseRef === c.id
      );
      const casePlan = plans.find(
        (p) => p.concernId === c.id || p.caseRef === c.id
      ) ?? null;

      const overdueAgencies = caseAgencies.filter((a) => {
        if (a.status === "responded" || a.status === "closed") return false;
        const deadline = a.deadlineDays ?? getDeadlineDays(a.agencyType);
        return daysSince(a.contactDate) > deadline;
      });

      const pendingAgencies = caseAgencies.filter((a) => {
        if (a.status === "responded" || a.status === "closed") return false;
        const deadline = a.deadlineDays ?? getDeadlineDays(a.agencyType);
        return daysSince(a.contactDate) <= deadline;
      });

      const evidenceItemCount = caseFolders.reduce(
        (sum, f) => sum + (Array.isArray(f.items) ? f.items.length : 0),
        0
      );

      const actionPlanProgress =
        casePlan && Array.isArray(casePlan.completedSteps)
          ? casePlan.completedSteps.length
          : 0;

      return {
        concernId: c.id,
        concern: c,
        agencies: caseAgencies,
        evidenceFolders: caseFolders,
        actionPlan: casePlan,
        overdueAgencies,
        pendingAgencies,
        evidenceItemCount,
        actionPlanProgress,
      };
    });

    const linkedConcernIds = new Set(concerns.map((c) => c.id));
    const orphanAgencies = agencies.filter(
      (a) =>
        !a.concernId ||
        (!linkedConcernIds.has(a.concernId) && !linkedConcernIds.has(a.caseRef ?? ""))
    );

    const totals = {
      cases: concerns.length,
      agencies: agencies.length,
      overdue: rollups.reduce((s, r) => s + r.overdueAgencies.length, 0),
      evidenceItems: rollups.reduce((s, r) => s + r.evidenceItemCount, 0),
      activePlans: plans.length,
    };

    return { rollups, orphanAgencies, totals };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "overdue") return rollups.filter((r) => r.overdueAgencies.length > 0);
    if (filter === "active") return rollups.filter((r) => r.pendingAgencies.length > 0 || r.concern.status !== "closed");
    return rollups;
  }, [rollups, filter]);

  const isEmpty = rollups.length === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <FolderOpen className="w-3.5 h-3.5" />
            My Cases
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            All Your Cases.<br />
            <span className="text-[#970CDA]">One View.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Every documented concern, agency contact, evidence folder, and action plan — organized by case so nothing falls through the cracks.
          </p>
        </div>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats band */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              {[
                { label: "Open Cases", value: totals.cases, icon: <FolderOpen className="w-4 h-4" />, color: "text-white" },
                { label: "Agency Contacts", value: totals.agencies, icon: <Activity className="w-4 h-4" />, color: "text-[#47CC5E]" },
                { label: "Overdue Responses", value: totals.overdue, icon: <Clock className="w-4 h-4" />, color: totals.overdue > 0 ? "text-[#c060ff]" : "text-white/40" },
                { label: "Evidence Items", value: totals.evidenceItems, icon: <Archive className="w-4 h-4" />, color: "text-[#47CC5E]" },
                { label: "Action Plans", value: totals.activePlans, icon: <Zap className="w-4 h-4" />, color: "text-[#c060ff]" },
              ].map((s) => (
                <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
                  <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                  <div className={`kz-stat-number text-3xl mb-0.5 ${s.color}`}>{s.value}</div>
                  <div className="text-white/35 text-xs font-bold leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Overdue banner */}
            {totals.overdue > 0 && (
              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#970CDA]/10 border border-[#970CDA]/25 mb-6">
                <AlertTriangle className="w-5 h-5 text-[#c060ff] shrink-0" />
                <div className="flex-1">
                  <p className="text-[#c060ff] font-black text-sm">
                    {totals.overdue} agency response{totals.overdue > 1 ? "s" : ""} overdue
                  </p>
                  <p className="text-white/45 text-xs mt-0.5">
                    Non-responses past the statutory window qualify for an escalation letter. Review the cases flagged below.
                  </p>
                </div>
                <Link href="/agency-tracker">
                  <button className="px-4 py-2 rounded-full bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff] font-black text-xs uppercase tracking-wider hover:bg-[#970CDA]/30 transition-all shrink-0 flex items-center gap-1.5">
                    View Tracker <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {(["all", "active", "overdue"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all uppercase tracking-wider ${
                    filter === f
                      ? "bg-[#970CDA]/20 border-[#970CDA]/40 text-[#c060ff]"
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {f === "all" ? `All Cases (${rollups.length})` : f === "overdue" ? `Overdue (${rollups.filter((r) => r.overdueAgencies.length > 0).length})` : `Active (${rollups.filter((r) => r.pendingAgencies.length > 0).length})`}
                </button>
              ))}
            </div>

            {/* Case cards */}
            <div className="flex flex-col gap-4 mb-8">
              {filtered.length === 0 ? (
                <div className="text-center py-12 bg-white/3 border border-white/8 rounded-2xl">
                  <p className="text-white/35 font-black">No cases match this filter</p>
                </div>
              ) : (
                filtered.map((r) => <CaseCard key={r.concernId} rollup={r} />)
              )}
            </div>

            {/* Orphan agency contacts */}
            {orphanAgencies.length > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-6">
                <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-3">
                  Agency Contacts Without a Linked Case ({orphanAgencies.length})
                </p>
                <div className="flex flex-col gap-2">
                  {orphanAgencies.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 px-3 py-2 bg-white/3 border border-white/8 rounded-xl">
                      <Activity className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      <p className="text-white/55 text-xs flex-1">{a.agencyName}</p>
                      <p className="text-white/30 text-xs">{new Date(a.contactDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {orphanAgencies.length > 5 && (
                    <p className="text-white/25 text-xs pl-3">+{orphanAgencies.length - 5} more in Agency Tracker</p>
                  )}
                </div>
                <Link href="/agency-tracker">
                  <button className="mt-3 text-[#47CC5E] text-xs font-black uppercase tracking-wider hover:text-[#5adb70] transition-colors flex items-center gap-1.5">
                    Manage in Agency Tracker <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Quick-action bar */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Quick Actions</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { href: "/intake", label: "Document New Concern", icon: <Plus className="w-4 h-4" />, color: "bg-[#47CC5E] text-[#0A1439]" },
              { href: "/agency-tracker", label: "Log Agency Contact", icon: <Activity className="w-4 h-4" />, color: "bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff]" },
              { href: "/evidence-vault", label: "Add Evidence", icon: <Archive className="w-4 h-4" />, color: "bg-white/8 border border-white/14 text-white/70" },
            ].map((a) => (
              <Link key={a.href} href={a.href}>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:opacity-90 ${a.color}`}>
                  {a.icon} {a.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function CaseCard({ rollup: r }: { rollup: CaseRollup }) {
  const [expanded, setExpanded] = useState(false);
  const hasOverdue = r.overdueAgencies.length > 0;
  const daysSinceDoc = daysSince(r.concern.date);

  return (
    <div className={`bg-white/4 border rounded-2xl overflow-hidden transition-all ${hasOverdue ? "border-[#970CDA]/25" : "border-white/10"}`}>
      {/* Header */}
      <button className="w-full px-5 py-4 flex items-start gap-4 text-left" onClick={() => setExpanded((v) => !v)}>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${hasOverdue ? "bg-[#970CDA]/15 border-[#970CDA]/30 text-[#c060ff]" : "bg-[#47CC5E]/10 border-[#47CC5E]/25 text-[#47CC5E]"}`}>
          <FolderOpen className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-white font-black text-sm leading-snug">
              {r.concern.type || "Reported Concern"} — {r.concern.location || "Location not specified"}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              {hasOverdue && (
                <span className="px-2 py-0.5 rounded-full bg-[#970CDA]/15 border border-[#970CDA]/30 text-[#c060ff] text-xs font-black">
                  {r.overdueAgencies.length} Overdue
                </span>
              )}
              {expanded ? <ChevronRight className="w-4 h-4 text-white/30 rotate-90" /> : <ChevronRight className="w-4 h-4 text-white/30" />}
            </div>
          </div>

          {/* Mini stat row */}
          <div className="flex flex-wrap gap-3">
            <span className="text-white/35 text-xs">
              <Clock className="w-3 h-3 inline mr-1" />
              Day {daysSinceDoc}
            </span>
            {r.agencies.length > 0 && (
              <span className="text-white/35 text-xs">
                <Activity className="w-3 h-3 inline mr-1" />
                {r.agencies.length} agency contact{r.agencies.length !== 1 ? "s" : ""}
              </span>
            )}
            {r.evidenceItemCount > 0 && (
              <span className="text-white/35 text-xs">
                <Archive className="w-3 h-3 inline mr-1" />
                {r.evidenceItemCount} evidence item{r.evidenceItemCount !== 1 ? "s" : ""}
              </span>
            )}
            {r.actionPlan && (
              <span className="text-[#c060ff]/70 text-xs">
                <Zap className="w-3 h-3 inline mr-1" />
                Action plan active
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-white/8 px-5 py-4">
          {r.concern.description && (
            <p className="text-white/50 text-sm leading-relaxed mb-4">{r.concern.description}</p>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {/* Agency status */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-3">
              <p className="text-white/35 text-xs font-black uppercase tracking-wider mb-2">Agency Contacts</p>
              {r.agencies.length === 0 ? (
                <p className="text-white/30 text-xs">No agencies logged for this case.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {r.agencies.map((a) => {
                    const deadline = a.deadlineDays ?? getDeadlineDays(a.agencyType);
                    const elapsed = daysSince(a.contactDate);
                    const isOverdue = elapsed > deadline && a.status !== "responded" && a.status !== "closed";
                    return (
                      <div key={a.id} className="flex items-center gap-2">
                        {isOverdue
                          ? <AlertTriangle className="w-3 h-3 text-[#c060ff] shrink-0" />
                          : <CheckCircle2 className="w-3 h-3 text-[#47CC5E] shrink-0" />
                        }
                        <span className="text-white/60 text-xs flex-1 truncate">{a.agencyName}</span>
                        {isOverdue && <span className="text-[#c060ff] text-xs font-bold">Overdue</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Evidence summary */}
            <div className="bg-white/3 border border-white/8 rounded-xl p-3">
              <p className="text-white/35 text-xs font-black uppercase tracking-wider mb-2">Evidence</p>
              {r.evidenceFolders.length === 0 ? (
                <p className="text-white/30 text-xs">No evidence folders linked to this case.</p>
              ) : (
                <div>
                  <p className="text-white/60 text-xs">{r.evidenceFolders.length} folder{r.evidenceFolders.length !== 1 ? "s" : ""}, {r.evidenceItemCount} total item{r.evidenceItemCount !== 1 ? "s" : ""}</p>
                  {r.evidenceFolders.map((f) => (
                    <div key={f.id} className="flex items-center gap-1.5 mt-1.5">
                      <Archive className="w-3 h-3 text-white/30 shrink-0" />
                      <span className="text-white/45 text-xs truncate">{f.caseTitle || "Untitled Folder"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action plan progress */}
          {r.actionPlan && (
            <div className="bg-white/3 border border-white/8 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/35 text-xs font-black uppercase tracking-wider">Action Plan</p>
                <span className="text-[#c060ff] text-xs font-black">{r.actionPlanProgress} step{r.actionPlanProgress !== 1 ? "s" : ""} completed</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#970CDA] to-[#47CC5E] transition-all"
                  style={{ width: `${Math.min(100, (r.actionPlanProgress / 10) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Link href="/case-summary">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#970CDA]/15 border border-[#970CDA]/30 text-[#c060ff] font-black text-xs uppercase tracking-wider hover:bg-[#970CDA]/25 transition-all">
                <FileText className="w-3.5 h-3.5" /> View Case File
              </button>
            </Link>
            {!r.actionPlan && (
              <Link href="/action-plan">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#47CC5E]/15 border border-[#47CC5E]/30 text-[#47CC5E] font-black text-xs uppercase tracking-wider hover:bg-[#47CC5E]/25 transition-all">
                  <Zap className="w-3.5 h-3.5" /> Create Action Plan
                </button>
              </Link>
            )}
            {r.overdueAgencies.length > 0 && (
              <Link href="/agency-tracker">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/8 border border-white/14 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all">
                  <Activity className="w-3.5 h-3.5" /> Agency Tracker
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-[#970CDA]/10 border border-[#970CDA]/20 flex items-center justify-center mx-auto mb-6">
        <FolderOpen className="w-7 h-7 text-[#c060ff]" />
      </div>
      <h2 className="text-white font-black text-2xl mb-3">No cases yet</h2>
      <p className="text-white/45 text-base max-w-sm mx-auto mb-8 leading-relaxed">
        Once you document a concern, your cases will appear here — with all linked agency contacts, evidence, and action plans in one view.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/intake">
          <button className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-sm uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_24px_rgba(71,204,94,0.5)] transition-all">
            <Plus className="w-4 h-4" /> Document a Concern
          </button>
        </Link>
        <Link href="/agency-tracker">
          <button className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#970CDA] text-white font-black text-sm uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
            <Activity className="w-4 h-4" /> Log Agency Contact
          </button>
        </Link>
      </div>

      {/* Workflow teaser */}
      <div className="mt-12 max-w-2xl mx-auto">
        <p className="text-white/25 text-xs font-black uppercase tracking-widest mb-5">Once you start, this dashboard shows</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: <BarChart2 className="w-4 h-4" />, label: "Case Status Overview", desc: "Every open concern with day count and status" },
            { icon: <Clock className="w-4 h-4" />, label: "Overdue Responses", desc: "Agencies past their response window flagged instantly" },
            { icon: <Shield className="w-4 h-4" />, label: "Evidence & Plans", desc: "Linked folders and action plan progress per case" },
          ].map((item) => (
            <div key={item.label} className="bg-white/3 border border-white/8 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center mx-auto mb-2 text-white/40">
                {item.icon}
              </div>
              <p className="text-white/45 font-black text-xs mb-1">{item.label}</p>
              <p className="text-white/25 text-xs leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
