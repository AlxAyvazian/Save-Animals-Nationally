import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  BookOpen, Copy, Download, CheckCircle2, ChevronDown,
  Activity, Archive, FileText, Layers, Plus
} from "lucide-react";

const LS_CONCERNS    = "voicemap_concerns";
const LS_AGENCY      = "voicemap_agency_contacts";
const LS_EVIDENCE    = "voicemap_evidence_vault";

interface StoredConcern {
  id?: string;
  date?: string;
  location?: string;
  animalType?: string;
  incidentType?: string;
  description?: string;
  status?: string;
}

interface AgencyContact {
  id: string;
  concernLabel: string;
  agency: string;
  agencyType: string;
  dateFiled: string;
  method: string;
  caseNumber: string;
  deadlineDays: number;
  status: string;
  notes: string;
  responseDate: string;
}

interface EvidenceItem {
  id: string;
  caseLabel: string;
  type: string;
  title: string;
  description: string;
  dateCapture: string;
  location: string;
  source: string;
  tags: string[];
  chain: string;
  addedAt: string;
}

interface CaseBundle {
  label: string;
  concern?: StoredConcern;
  agencies: AgencyContact[];
  evidence: EvidenceItem[];
}

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch { return []; }
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function buildCaseBundles(): CaseBundle[] {
  const concerns = load<StoredConcern>(LS_CONCERNS);
  const agencies = load<AgencyContact>(LS_AGENCY);
  const evidence = load<EvidenceItem>(LS_EVIDENCE);

  const labels = new Set<string>();

  const concernLabels = concerns.map((c, i) =>
    c.description ? c.description.slice(0, 60) : `Concern #${i + 1}`
  );
  concernLabels.forEach((l) => labels.add(l));
  agencies.forEach((a) => labels.add(a.concernLabel));
  evidence.forEach((e) => labels.add(e.caseLabel));

  return [...labels].map((label, idx) => ({
    label,
    concern: concerns[idx],
    agencies: agencies.filter((a) => a.concernLabel === label),
    evidence: evidence.filter((e) => e.caseLabel === label),
  }));
}

function buildCaseFile(bundle: CaseBundle): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const { label, concern, agencies, evidence } = bundle;
  const overdueAgencies = agencies.filter((a) => {
    if (a.status === "Responded" || a.status === "Resolved") return false;
    return daysSince(a.dateFiled) > a.deadlineDays;
  });

  return `ANIMAL PROTECTION CASE FILE
Generated: ${today}
Source: VoiceMap National Animal Protection Portal

${"═".repeat(60)}
CASE: ${label}
${"═".repeat(60)}

OVERVIEW
Documented concern: ${label}
${concern?.date ? `Date first documented: ${concern.date}` : ""}
${concern?.location ? `Location: ${concern.location}` : ""}
${concern?.animalType ? `Animal type: ${concern.animalType}` : ""}
${concern?.incidentType ? `Incident type: ${concern.incidentType}` : ""}
${concern?.status ? `Current status: ${concern.status}` : ""}
Agency contacts on file: ${agencies.length}
Evidence items logged: ${evidence.length}
Overdue non-responses: ${overdueAgencies.length}

${agencies.length > 0 ? `${"─".repeat(50)}
AGENCY CONTACTS (${agencies.length} total)
${"─".repeat(50)}

${agencies.map((a, i) => `${i + 1}. ${a.agency} (${a.agencyType})
   Filed: ${a.dateFiled} via ${a.method}
   Case/Ref: ${a.caseNumber || "None provided"}
   Status: ${a.status}
   Expected response: ${a.deadlineDays} days
   Days elapsed: ${daysSince(a.dateFiled)}
   ${a.status !== "Responded" && a.status !== "Resolved" && daysSince(a.dateFiled) > a.deadlineDays ? `*** OVERDUE by ${daysSince(a.dateFiled) - a.deadlineDays} days — escalation warranted ***` : ""}
   ${a.responseDate ? `Response received: ${a.responseDate}` : ""}
   Notes: ${a.notes || "None"}
`).join("\n")}` : "No agency contacts logged for this case.\n"}

${evidence.length > 0 ? `${"─".repeat(50)}
EVIDENCE LOG (${evidence.length} items)
${"─".repeat(50)}

${evidence.map((e, i) => `${i + 1}. [${e.type.toUpperCase()}] ${e.title}
   Date captured: ${e.dateCapture}
   Location: ${e.location || "Not specified"}
   Source: ${e.source || "Reporter's own collection"}
   Tags: ${e.tags.length > 0 ? e.tags.join(", ") : "None"}
   Chain of custody: ${e.chain || "Captured directly by reporting party"}
   Description: ${e.description}
`).join("\n")}` : "No evidence items logged for this case.\n"}

${overdueAgencies.length > 0 ? `${"─".repeat(50)}
ESCALATION GROUNDS
${"─".repeat(50)}
The following agencies have not responded within their standard deadline:

${overdueAgencies.map((a) => `• ${a.agency} (${a.agencyType}) — contacted ${a.dateFiled}, overdue by ${daysSince(a.dateFiled) - a.deadlineDays} days
`).join("")}
Non-response by an agency with statutory obligations to investigate constitutes
a documented institutional failure and provides grounds for escalation to the
next level of authority or referral to legislative offices and media contacts.
` : ""}

LEGAL NOTICE
All incidents described in this case file are alleged concerns that require
independent investigation by appropriate authorities. This document is compiled
by a private party in good faith. It does not constitute legal determination.

Generated by VoiceMap National Animal Protection Portal`;
}

const DEMO_BUNDLE: CaseBundle = {
  label: "Multiple dogs chained without water at 123 Oak St",
  concern: {
    date: "2026-04-14",
    location: "123 Oak St, Houston TX",
    animalType: "Dogs",
    incidentType: "Neglect / Inadequate Care",
    description: "Multiple dogs chained without water at 123 Oak St",
    status: "Under investigation",
  },
  agencies: [
    { id: "d1", concernLabel: "Multiple dogs chained without water at 123 Oak St", agency: "Houston Animal Control", agencyType: "Animal Control", dateFiled: "2026-04-15", method: "Phone", caseNumber: "AC-2026-4421", deadlineDays: 3, status: "No Response", notes: "Spoke with dispatcher. No officer dispatched.", responseDate: "" },
    { id: "d2", concernLabel: "Multiple dogs chained without water at 123 Oak St", agency: "Harris County Sheriff", agencyType: "Sheriff / Police", dateFiled: "2026-04-20", method: "Online Form", caseNumber: "", deadlineDays: 5, status: "Awaiting", notes: "Filed online. No confirmation received.", responseDate: "" },
    { id: "d3", concernLabel: "Multiple dogs chained without water at 123 Oak St", agency: "HSUS Investigations", agencyType: "HSUS / ASPCA", dateFiled: "2026-04-25", method: "Email", caseNumber: "", deadlineDays: 7, status: "Responded", notes: "Confirmed receipt and forwarded to field team.", responseDate: "2026-04-28" },
  ],
  evidence: [
    { id: "e1", caseLabel: "Multiple dogs chained without water at 123 Oak St", type: "Photo", title: "3 dogs chained — no water bowls visible", description: "Photograph from public sidewalk. Three dogs chained with less than 4 feet of movement. No water. Extreme heat.", dateCapture: "2026-04-14", location: "123 Oak St, Houston TX", source: "Reporter's own phone camera", tags: ["neglect", "water", "heat"], chain: "Original on device. Copy submitted with AC complaint.", addedAt: "2026-04-14T15:32:00Z" },
    { id: "e2", caseLabel: "Multiple dogs chained without water at 123 Oak St", type: "Video", title: "90-second video — dogs in heat, visible distress", description: "Video showing dogs panting heavily. Address spoken aloud at start. No shade reachable.", dateCapture: "2026-04-14", location: "123 Oak St, Houston TX", source: "Reporter's phone", tags: ["video", "distress", "heat"], chain: "Original on device. Backup in cloud. Submitted to HSUS.", addedAt: "2026-04-14T15:35:00Z" },
    { id: "e3", caseLabel: "Multiple dogs chained without water at 123 Oak St", type: "Correspondence", title: "Houston AC complaint confirmation email", description: "Email from Houston AC acknowledging complaint. Case number AC-2026-4421 assigned.", dateCapture: "2026-04-15", location: "N/A (digital)", source: "Houston AC automated system", tags: ["AC", "confirmation"], chain: "Printed and saved as PDF.", addedAt: "2026-04-15T09:12:00Z" },
  ],
};

function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/4 border border-white/10 rounded-2xl px-4 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <div className="text-white font-black text-xl leading-none">{value}</div>
        <div className="text-white/40 text-xs font-bold mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function CaseBundleCard({
  bundle,
  selected,
  onSelect,
}: {
  bundle: CaseBundle;
  selected: boolean;
  onSelect: () => void;
}) {
  const overdue = bundle.agencies.filter((a) => {
    if (a.status === "Responded" || a.status === "Resolved") return false;
    return daysSince(a.dateFiled) > a.deadlineDays;
  }).length;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border px-5 py-4 transition-all ${
        selected
          ? "border-[#47CC5E]/50 bg-[#47CC5E]/8"
          : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 transition-all ${
          selected ? "border-[#47CC5E] bg-[#47CC5E]" : "border-white/30"
        }`} />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-snug mb-1.5">{bundle.label}</p>
          <div className="flex flex-wrap gap-2">
            {bundle.agencies.length > 0 && (
              <span className="text-white/40 text-xs font-bold">{bundle.agencies.length} agency filing{bundle.agencies.length !== 1 ? "s" : ""}</span>
            )}
            {bundle.evidence.length > 0 && (
              <span className="text-white/40 text-xs font-bold">{bundle.evidence.length} evidence item{bundle.evidence.length !== 1 ? "s" : ""}</span>
            )}
            {overdue > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#970CDA]/15 text-[#c060ff] border border-[#970CDA]/25 text-xs font-black">
                {overdue} overdue
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CaseSummary() {
  const [useDemo, setUseDemo] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const liveBundles = useMemo(() => buildCaseBundles(), []);
  const bundles = useDemo ? [DEMO_BUNDLE] : liveBundles;

  const selectedBundle = bundles.find((b) => b.label === selectedLabel) ?? bundles[0] ?? null;
  const caseFile = selectedBundle ? buildCaseFile(selectedBundle) : null;

  const totalAgencies = bundles.reduce((s, b) => s + b.agencies.length, 0);
  const totalEvidence = bundles.reduce((s, b) => s + b.evidence.length, 0);
  const totalOverdue = bundles.reduce((s, b) => {
    return s + b.agencies.filter((a) => {
      if (a.status === "Responded" || a.status === "Resolved") return false;
      return daysSince(a.dateFiled) > a.deadlineDays;
    }).length;
  }, 0);

  const copy = async () => {
    if (!caseFile) return;
    await navigator.clipboard.writeText(caseFile);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    if (!caseFile || !selectedBundle) return;
    const slug = selectedBundle.label.slice(0, 40).replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const blob = new Blob([caseFile], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CaseFile_${slug}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const all = bundles.map((b) => buildCaseFile(b)).join("\n\n" + "█".repeat(60) + "\n\n");
    const blob = new Blob([all], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `All_Cases_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = bundles.length === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Case Summary Generator
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Everything in One File.<br />
            <span className="text-[#47CC5E]">Ready to Submit Anywhere.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Pulls together every documented concern, agency contact, and evidence item into a single, professionally formatted Case File — ready for agencies, attorneys, legislators, or media.
          </p>
        </div>

        {/* Stats band */}
        {!isEmpty && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatPill icon={<Layers className="w-4 h-4 text-[#47CC5E]" />} label="Cases on File" value={bundles.length} color="bg-[#47CC5E]/12 border border-[#47CC5E]/25" />
            <StatPill icon={<Activity className="w-4 h-4 text-white/50" />} label="Agency Contacts" value={totalAgencies} color="bg-white/8 border border-white/15" />
            <StatPill icon={<Archive className="w-4 h-4 text-[#c060ff]" />} label="Evidence Items" value={totalEvidence} color="bg-[#970CDA]/10 border border-[#970CDA]/20" />
            <StatPill icon={<FileText className="w-4 h-4 text-[#c060ff]" />} label="Overdue Non-Responses" value={totalOverdue} color={totalOverdue > 0 ? "bg-[#970CDA]/15 border border-[#970CDA]/30" : "bg-white/5 border border-white/10"} />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <button
            onClick={() => setUseDemo((v) => !v)}
            className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${
              useDemo
                ? "bg-[#970CDA]/20 border-[#970CDA]/40 text-[#c060ff] hover:bg-[#970CDA]/30"
                : "bg-white/6 border-white/12 text-white/60 hover:bg-white/10"
            }`}
          >
            {useDemo ? "Exit Demo" : "Load Demo Data"}
          </button>
          {bundles.length > 1 && (
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download All Cases
            </button>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <p className="text-white/50 font-black text-lg">No cases on file yet</p>
            <p className="text-white/30 text-sm mt-2 max-w-sm mx-auto">
              This tool automatically reads data from your Concern Documentation, Agency Tracker, and Evidence Vault. Start by documenting a concern.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-6 max-w-lg mx-auto">
              {[
                { label: "Document a Concern", href: "/intake", icon: <Plus className="w-3.5 h-3.5" /> },
                { label: "Log an Agency Contact", href: "/agency-tracker", icon: <Activity className="w-3.5 h-3.5" /> },
                { label: "Add Evidence", href: "/evidence-vault", icon: <Archive className="w-3.5 h-3.5" /> },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <button
                onClick={() => setUseDemo(true)}
                className="px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white/70 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all"
              >
                See Demo Case File
              </button>
            </div>
          </div>
        )}

        {/* Two-column layout when there's data */}
        {!isEmpty && (
          <div className="grid md:grid-cols-[300px,1fr] gap-6">
            {/* Case selector */}
            <div className="flex flex-col gap-2">
              <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-2">Select a Case</p>
              {bundles.map((b) => (
                <CaseBundleCard
                  key={b.label}
                  bundle={b}
                  selected={selectedBundle?.label === b.label}
                  onSelect={() => setSelectedLabel(b.label)}
                />
              ))}
            </div>

            {/* Case file preview */}
            {selectedBundle && caseFile && (
              <div className="flex flex-col gap-4">
                {/* Summary bar */}
                <div className="bg-white/4 border border-white/10 rounded-2xl px-5 py-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                    <p className="text-white font-black text-base leading-snug flex-1 min-w-0 truncate">{selectedBundle.label}</p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={copy}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={download}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-white/45 text-xs font-bold">{selectedBundle.agencies.length} agency contacts</span>
                    <span className="text-white/45 text-xs font-bold">{selectedBundle.evidence.length} evidence items</span>
                    {selectedBundle.agencies.filter((a) => {
                      if (a.status === "Responded" || a.status === "Resolved") return false;
                      return daysSince(a.dateFiled) > a.deadlineDays;
                    }).length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#970CDA]/15 text-[#c060ff] border border-[#970CDA]/25 text-xs font-black">
                        Escalation grounds documented
                      </span>
                    )}
                  </div>
                </div>

                {/* Full / preview toggle */}
                <div className="flex items-center justify-between">
                  <p className="text-white/30 text-xs font-black uppercase tracking-widest">Case File Document</p>
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
                    {showAll ? "Collapse" : "Expand Full"}
                  </button>
                </div>

                <div
                  className={`bg-[#0a0f1e] border border-white/10 rounded-2xl p-5 font-mono text-xs text-white/65 leading-relaxed whitespace-pre-wrap overflow-y-auto transition-all ${
                    showAll ? "max-h-none" : "max-h-[480px]"
                  }`}
                >
                  {caseFile}
                </div>

                {/* Use this file section */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Where to submit this case file</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Agency Escalations", body: "Attach to all follow-up letters and calls. When an agency denies receipt, this file proves you contacted them." },
                      { label: "FOIA Requests", body: "Include as an exhibit with any FOIA request. It provides context and increases the specificity of your public records request." },
                      { label: "Legislative Contacts", body: "Send with letters to state legislators and your US Representative. Documented cases are far more effective than general complaints." },
                      { label: "Media Contacts", body: "Attach to tips sent to investigative reporters. A documented case file turns an anonymous tip into a story with receipts." },
                      { label: "Humane Organizations", body: "HSUS, ASPCA, and local SPCAs respond faster to tips with documented evidence and prior agency contacts on file." },
                      { label: "Legal Proceedings", body: "If charges are filed, this case file establishes a documented timeline that can be turned over to a prosecutor or attorney." },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E] mt-2 shrink-0" />
                        <div>
                          <p className="text-white font-bold text-sm mb-0.5">{item.label}</p>
                          <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
