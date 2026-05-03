import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  AlertTriangle, CheckCircle2, Clock, Copy, Download, Plus, X,
  ChevronDown, ChevronUp, FileText, Bell, Activity
} from "lucide-react";

const LS_KEY = "voicemap_agency_contacts";
const LS_CONCERNS = "voicemap_concerns";

type AgencyType =
  | "Animal Control"
  | "Sheriff / Police"
  | "State AG"
  | "USDA APHIS"
  | "FBI"
  | "HSUS / ASPCA"
  | "State Legislature"
  | "Other";

type ContactMethod = "Phone" | "Email" | "Online Form" | "Certified Mail" | "In Person";
type ContactStatus = "Awaiting" | "Responded" | "No Response" | "Escalated" | "Resolved";

interface AgencyContact {
  id: string;
  concernLabel: string;
  agency: string;
  agencyType: AgencyType;
  dateFiled: string;
  method: ContactMethod;
  caseNumber: string;
  deadlineDays: number;
  status: ContactStatus;
  notes: string;
  responseDate: string;
}

const AGENCY_DEFAULTS: Record<AgencyType, { deadlineDays: number; why: string }> = {
  "Animal Control":       { deadlineDays: 3,  why: "AC should acknowledge and dispatch within 72 hours for cruelty reports." },
  "Sheriff / Police":     { deadlineDays: 5,  why: "Law enforcement should follow up within 5 business days for documented cruelty." },
  "State AG":             { deadlineDays: 30, why: "State AGs typically have 30 days to acknowledge formal complaints." },
  "USDA APHIS":           { deadlineDays: 30, why: "APHIS responds within 30 days to formal complaints about licensed facilities." },
  "FBI":                  { deadlineDays: 14, why: "FBI tip acknowledgment typically within 14 days." },
  "HSUS / ASPCA":         { deadlineDays: 7,  why: "Humane organizations usually respond to documented tips within a week." },
  "State Legislature":    { deadlineDays: 14, why: "Legislative offices typically respond to constituent contacts within 2 weeks." },
  "Other":                { deadlineDays: 14, why: "General follow-up expected within 14 days." },
};

const STATUS_STYLE: Record<ContactStatus, string> = {
  Awaiting:     "bg-white/10 text-white/60 border-white/20",
  Responded:    "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30",
  "No Response": "bg-[#970CDA]/15 text-[#c060ff] border-[#970CDA]/35",
  Escalated:    "bg-[#970CDA]/20 text-[#c060ff] border-[#970CDA]/50",
  Resolved:     "bg-white/6 text-white/35 border-white/10",
};

const METHODS: ContactMethod[] = ["Phone", "Email", "Online Form", "Certified Mail", "In Person"];
const AGENCY_TYPES: AgencyType[] = [
  "Animal Control", "Sheriff / Police", "State AG",
  "USDA APHIS", "FBI", "HSUS / ASPCA", "State Legislature", "Other",
];

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function deadlineStatus(contact: AgencyContact): "overdue" | "warning" | "ok" {
  if (contact.status === "Responded" || contact.status === "Resolved") return "ok";
  const elapsed = daysSince(contact.dateFiled);
  if (elapsed > contact.deadlineDays) return "overdue";
  if (elapsed >= contact.deadlineDays * 0.75) return "warning";
  return "ok";
}

function loadContacts(): AgencyContact[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AgencyContact[];
  } catch { return []; }
}

function saveContacts(contacts: AgencyContact[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(contacts));
}

function loadConcernLabels(): string[] {
  try {
    const raw = localStorage.getItem(LS_CONCERNS);
    if (!raw) return [];
    const arr = JSON.parse(raw) as { description?: string; location?: string; date?: string }[];
    return arr.map((c, i) => c.description ? c.description.slice(0, 50) : `Concern #${i + 1}`);
  } catch { return []; }
}

const DEMO_CONTACTS: AgencyContact[] = [
  { id: "d1", concernLabel: "Multiple dogs chained without water at 123 Oak St", agency: "Houston Animal Control", agencyType: "Animal Control", dateFiled: "2026-04-15", method: "Phone", caseNumber: "AC-2026-4421", deadlineDays: 3, status: "No Response", notes: "Spoke with dispatcher. Case number given. No officer dispatched after 18 days.", responseDate: "" },
  { id: "d2", concernLabel: "Multiple dogs chained without water at 123 Oak St", agency: "Harris County Sheriff", agencyType: "Sheriff / Police", dateFiled: "2026-04-20", method: "Online Form", caseNumber: "", deadlineDays: 5, status: "Awaiting", notes: "Filed online form. No confirmation email received.", responseDate: "" },
  { id: "d3", concernLabel: "Unsafe shelter conditions at Riverside County Shelter", agency: "CA Dept of Food & Agriculture", agencyType: "State AG", dateFiled: "2026-03-10", method: "Certified Mail", caseNumber: "CDFA-2026-8812", deadlineDays: 30, status: "Responded", notes: "Letter received April 9 stating investigation initiated.", responseDate: "2026-04-09" },
  { id: "d4", concernLabel: "Unsafe shelter conditions at Riverside County Shelter", agency: "USDA APHIS Animal Care", agencyType: "USDA APHIS", dateFiled: "2026-04-01", method: "Email", caseNumber: "", deadlineDays: 30, status: "Awaiting", notes: "", responseDate: "" },
  { id: "d5", concernLabel: "Starvation reported at 550 Farm Road, Lubbock TX", agency: "Texas Dept of Agriculture", agencyType: "Other", dateFiled: "2026-04-05", method: "Email", caseNumber: "", deadlineDays: 14, status: "No Response", notes: "27 days elapsed. No response.", responseDate: "" },
  { id: "d6", concernLabel: "Starvation reported at 550 Farm Road, Lubbock TX", agency: "HSUS Investigations", agencyType: "HSUS / ASPCA", dateFiled: "2026-04-18", method: "Email", caseNumber: "", deadlineDays: 7, status: "Escalated", notes: "HSUS confirmed receipt and forwarded to field team.", responseDate: "" },
];

function buildNonResponseRecord(contacts: AgencyContact[]): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const nonResponders = contacts.filter((c) => deadlineStatus(c) === "overdue");
  if (nonResponders.length === 0) return "No overdue non-responses detected in current records.";

  const byConcern: Record<string, AgencyContact[]> = {};
  for (const c of nonResponders) {
    byConcern[c.concernLabel] = [...(byConcern[c.concernLabel] ?? []), c];
  }

  return `NON-RESPONSE RECORD
Generated: ${today}
Source: VoiceMap National Animal Protection Portal — Agency Response Tracker

SUMMARY
This document records formal contacts made to government agencies and organizations
regarding documented animal welfare concerns, where no response was received within
the agency's standard response deadline. Non-response by an agency with statutory
obligations to investigate constitutes a documented institutional failure and
provides grounds for escalation to the next level of authority.

Overdue contacts documented: ${nonResponders.length}
Affected concerns: ${Object.keys(byConcern).length}

${Object.entries(byConcern).map(([concern, cs]) => `
CONCERN: ${concern}

${cs.map((c) => `  Agency: ${c.agency} (${c.agencyType})
  Contact method: ${c.method}
  Date filed: ${c.dateFiled}
  Case/ref number: ${c.caseNumber || "None provided"}
  Expected response within: ${c.deadlineDays} days
  Days elapsed: ${daysSince(c.dateFiled)}
  Status: ${c.status}
  Notes: ${c.notes || "None"}
`).join("")}`).join("\n---\n")}

RECOMMENDED NEXT STEPS
• For Animal Control non-response: Contact county sheriff and state AG.
• For State AG non-response: Contact state legislature and USDA APHIS.
• For USDA APHIS non-response: Contact your US Representative and request a
  formal Congressional inquiry into agency non-action.
• File this record alongside all future escalation letters and media tips.
• Attach full VoiceMap report packets for each documented concern.

All incidents described are alleged concerns requiring investigation by
appropriate authorities.

Generated by VoiceMap National Animal Protection Portal`;
}

interface AddModalProps {
  concerns: string[];
  onSave: (c: AgencyContact) => void;
  onClose: () => void;
}

function AddModal({ concerns, onSave, onClose }: AddModalProps) {
  const [form, setForm] = useState<Omit<AgencyContact, "id">>({
    concernLabel: concerns[0] ?? "",
    agency: "",
    agencyType: "Animal Control",
    dateFiled: new Date().toISOString().split("T")[0],
    method: "Phone",
    caseNumber: "",
    deadlineDays: AGENCY_DEFAULTS["Animal Control"].deadlineDays,
    status: "Awaiting",
    notes: "",
    responseDate: "",
  });

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleAgencyType = (type: AgencyType) => {
    set("agencyType", type);
    set("deadlineDays", AGENCY_DEFAULTS[type].deadlineDays);
  };

  const canSave = form.agency.trim() && form.concernLabel && form.dateFiled;

  const inputCls =
    "w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#0c1228] border border-white/12 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8 shrink-0">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-0.5">New Agency Contact</p>
            <p className="text-white font-black text-lg">Log a Filing</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <div>
            <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Concern (optional label)</label>
            {concerns.length > 0 ? (
              <select className={inputCls} value={form.concernLabel} onChange={(e) => set("concernLabel", e.target.value)}>
                {concerns.map((c) => <option key={c}>{c}</option>)}
                <option value="[Manual Entry]">[Manual Entry]</option>
              </select>
            ) : (
              <input className={inputCls} placeholder="Brief concern description" value={form.concernLabel} onChange={(e) => set("concernLabel", e.target.value)} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Agency Name</label>
              <input className={inputCls} placeholder="e.g. Houston Animal Control" value={form.agency} onChange={(e) => set("agency", e.target.value)} />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Agency Type</label>
              <select className={inputCls} value={form.agencyType} onChange={(e) => handleAgencyType(e.target.value as AgencyType)}>
                {AGENCY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <p className="text-white/35 text-xs -mt-1">{AGENCY_DEFAULTS[form.agencyType].why}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Date Filed</label>
              <input type="date" className={inputCls} value={form.dateFiled} onChange={(e) => set("dateFiled", e.target.value)} />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Contact Method</label>
              <select className={inputCls} value={form.method} onChange={(e) => set("method", e.target.value as ContactMethod)}>
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Case / Reference #</label>
              <input className={inputCls} placeholder="If provided" value={form.caseNumber} onChange={(e) => set("caseNumber", e.target.value)} />
            </div>
            <div>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Response Deadline (days)</label>
              <input type="number" className={inputCls} value={form.deadlineDays} onChange={(e) => set("deadlineDays", Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Notes</label>
            <textarea rows={3} className={inputCls + " resize-none"} placeholder="Who you spoke with, what was said, what happened next…" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <div className="flex gap-3 pb-2">
            <button
              disabled={!canSave}
              onClick={() => { onSave({ ...form, id: crypto.randomUUID() }); onClose(); }}
              className="flex-1 px-5 py-3 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Contact
            </button>
            <button onClick={onClose} className="px-5 py-3 rounded-full bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgencyTracker() {
  const [contacts, setContacts] = useState<AgencyContact[]>(() => {
    const stored = loadContacts();
    return stored.length > 0 ? stored : [];
  });
  const [useDemo, setUseDemo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedConcern, setExpandedConcern] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  const concernLabels = useMemo(() => loadConcernLabels(), []);

  const activeContacts = useDemo ? DEMO_CONTACTS : contacts;

  const byConcern = useMemo(() => {
    const map: Record<string, AgencyContact[]> = {};
    for (const c of activeContacts) {
      map[c.concernLabel] = [...(map[c.concernLabel] ?? []), c];
    }
    return map;
  }, [activeContacts]);

  const overdueCount = activeContacts.filter((c) => deadlineStatus(c) === "overdue").length;
  const respondedCount = activeContacts.filter((c) => c.status === "Responded" || c.status === "Resolved").length;
  const awaitingCount = activeContacts.filter((c) => c.status === "Awaiting").length;

  const report = buildNonResponseRecord(activeContacts);

  const saveContact = (c: AgencyContact) => {
    const updated = [...contacts, c];
    setContacts(updated);
    saveContacts(updated);
    setUseDemo(false);
  };

  const updateStatus = (id: string, status: ContactStatus, responseDate?: string) => {
    const updated = (useDemo ? DEMO_CONTACTS : contacts).map((c) =>
      c.id === id ? { ...c, status, responseDate: responseDate ?? c.responseDate } : c
    );
    if (!useDemo) {
      setContacts(updated);
      saveContacts(updated);
    }
  };

  const deleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NonResponse_Record_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isEmpty = activeContacts.length === 0;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      {showModal && (
        <AddModal
          concerns={concernLabels.length > 0 ? concernLabels : ["[Enter concern description]"]}
          onSave={saveContact}
          onClose={() => setShowModal(false)}
        />
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <Activity className="w-3.5 h-3.5" />
            Agency Response Tracker
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Track Every Filing.<br />
            <span className="text-[#47CC5E]">Flag Every Silence.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Log every agency contact for every concern. Auto-track response deadlines, surface overdue non-responses, and generate a formal Non-Response Record for escalation.
          </p>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Filings", value: activeContacts.length, color: "text-white" },
            { label: "Awaiting Response", value: awaitingCount, color: "text-white/70" },
            { label: "Overdue", value: overdueCount, color: overdueCount > 0 ? "text-[#c060ff]" : "text-white/40" },
            { label: "Responded", value: respondedCount, color: "text-[#47CC5E]" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`kz-stat-number text-3xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Overdue alert */}
        {overdueCount > 0 && (
          <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-[#970CDA]/10 border border-[#970CDA]/30 mb-6">
            <Bell className="w-5 h-5 text-[#c060ff] shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <p className="text-[#c060ff] font-black text-sm uppercase tracking-wider mb-1">
                {overdueCount} Overdue Non-Response{overdueCount > 1 ? "s" : ""} Detected
              </p>
              <p className="text-white/60 text-sm">
                Agencies that have not responded past their standard deadline. These are grounds for immediate escalation.
                Generate a Non-Response Record below to document institutional failure.
              </p>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="shrink-0 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all"
            >
              Generate Record
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setShowModal(true); setUseDemo(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_14px_rgba(71,204,94,0.4)] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Log Agency Contact
            </button>
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
          </div>
          {overdueCount > 0 && (
            <button
              onClick={() => setShowReport((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              {showReport ? "Hide" : "View"} Non-Response Record
            </button>
          )}
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl mb-6">
            <Activity className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <p className="text-white/50 font-black text-lg">No agency contacts logged yet</p>
            <p className="text-white/30 text-sm mt-2 max-w-sm mx-auto">
              Every time you contact an agency, log it here. The tracker surfaces overdue non-responses and builds your escalation case automatically.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Log First Contact
              </button>
              <button
                onClick={() => setUseDemo(true)}
                className="px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white/70 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all"
              >
                See Demo
              </button>
            </div>
          </div>
        )}

        {/* Concern groups */}
        {!isEmpty && (
          <div className="flex flex-col gap-3 mb-8">
            {Object.entries(byConcern).map(([concern, cs]) => {
              const isOpen = expandedConcern === concern;
              const overdueHere = cs.filter((c) => deadlineStatus(c) === "overdue").length;
              const respondedHere = cs.filter((c) => c.status === "Responded" || c.status === "Resolved").length;

              return (
                <div key={concern} className={`rounded-2xl border overflow-hidden transition-all ${overdueHere > 0 ? "border-[#970CDA]/30 bg-[#970CDA]/5" : "border-white/10 bg-white/4"}`}>
                  <button
                    className="w-full px-5 py-4 flex items-start gap-4 text-left"
                    onClick={() => setExpandedConcern(isOpen ? null : concern)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        {overdueHere > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black border bg-[#970CDA]/15 text-[#c060ff] border-[#970CDA]/35">
                            {overdueHere} overdue
                          </span>
                        )}
                        {respondedHere > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black border bg-[#47CC5E]/12 text-[#47CC5E] border-[#47CC5E]/25">
                            {respondedHere} responded
                          </span>
                        )}
                        <span className="text-white/35 text-xs font-bold">{cs.length} filing{cs.length > 1 ? "s" : ""}</span>
                      </div>
                      <p className="text-white font-black text-base leading-snug">{concern}</p>
                    </div>
                    <div className="text-white/30 shrink-0 mt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/8 pt-4 flex flex-col gap-3">
                      {cs.map((c) => {
                        const ds = deadlineStatus(c);
                        const elapsed = daysSince(c.dateFiled);
                        const remaining = c.deadlineDays - elapsed;
                        return (
                          <div key={c.id} className={`rounded-xl border px-4 py-3 ${ds === "overdue" ? "bg-[#970CDA]/8 border-[#970CDA]/25" : ds === "warning" ? "bg-white/5 border-white/15" : "bg-white/4 border-white/10"}`}>
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${STATUS_STYLE[c.status]}`}>
                                    {c.status}
                                  </span>
                                  <span className="text-white/35 text-xs font-bold uppercase tracking-wider">{c.agencyType}</span>
                                  {c.caseNumber && <span className="text-white/35 text-xs">#{c.caseNumber}</span>}
                                </div>
                                <p className="text-white font-bold text-sm">{c.agency}</p>
                                <p className="text-white/40 text-xs mt-0.5">Filed {c.dateFiled} via {c.method} · {elapsed} days ago</p>
                                {c.status !== "Responded" && c.status !== "Resolved" && (
                                  <p className={`text-xs mt-0.5 font-bold ${ds === "overdue" ? "text-[#c060ff]" : ds === "warning" ? "text-white/60" : "text-white/35"}`}>
                                    {ds === "overdue"
                                      ? `⚠ Overdue by ${Math.abs(remaining)} days — escalation warranted`
                                      : ds === "warning"
                                      ? `Response due in ~${remaining} day${remaining !== 1 ? "s" : ""} — follow up soon`
                                      : `${remaining} day${remaining !== 1 ? "s" : ""} remaining`}
                                  </p>
                                )}
                                {c.responseDate && <p className="text-[#47CC5E] text-xs mt-0.5">Responded: {c.responseDate}</p>}
                                {c.notes && <p className="text-white/50 text-xs mt-1 leading-relaxed italic">{c.notes}</p>}
                              </div>
                              <div className="flex flex-col gap-1.5 shrink-0">
                                {(c.status === "Awaiting" || c.status === "No Response") && (
                                  <>
                                    <button
                                      onClick={() => updateStatus(c.id, "Responded", new Date().toISOString().split("T")[0])}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#47CC5E]/15 text-[#47CC5E] border border-[#47CC5E]/30 font-black text-xs hover:bg-[#47CC5E]/25 transition-all"
                                    >
                                      <CheckCircle2 className="w-3 h-3" /> Responded
                                    </button>
                                    <button
                                      onClick={() => updateStatus(c.id, "No Response")}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#970CDA]/10 text-[#c060ff] border border-[#970CDA]/25 font-black text-xs hover:bg-[#970CDA]/20 transition-all"
                                    >
                                      <Clock className="w-3 h-3" /> No Response
                                    </button>
                                    <button
                                      onClick={() => updateStatus(c.id, "Escalated")}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 text-white/60 border border-white/12 font-black text-xs hover:bg-white/10 transition-all"
                                    >
                                      <AlertTriangle className="w-3 h-3" /> Escalated
                                    </button>
                                  </>
                                )}
                                {!useDemo && (
                                  <button onClick={() => deleteContact(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white/20 font-black text-xs hover:text-white/50 transition-all">
                                    <X className="w-3 h-3" /> Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Non-response record */}
        {showReport && (
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <p className="text-white font-black text-base">Non-Response Record</p>
                <p className="text-white/45 text-sm mt-0.5">Formal document for escalation, FOIA attachments, and legislator letters</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={copy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={download} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
            <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/65 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {report}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Why this matters</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Plus className="w-4 h-4 text-[#47CC5E]" />, title: "Log every contact", body: "Phone calls disappear. Written records persist. Every agency contact logged here becomes part of your permanent escalation record." },
              { icon: <Clock className="w-4 h-4 text-[#c060ff]" />, title: "Deadlines are tracked automatically", body: "Each agency type has a standard response window. When they miss it, this tool flags it — giving you clear grounds to escalate." },
              { icon: <FileText className="w-4 h-4 text-[#47CC5E]" />, title: "Non-response is evidence", body: "When agencies fail to respond within their statutory window, that silence is documented. The Non-Response Record turns inaction into a formal, escalatable document." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
