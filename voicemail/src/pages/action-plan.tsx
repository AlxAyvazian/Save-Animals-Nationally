import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Zap, CheckCircle2, Clock, ChevronRight, Copy, Download,
  AlertTriangle, ArrowRight, Circle
} from "lucide-react";

const LS_KEY = "voicemap_action_plans";

type IncidentType =
  | "Neglect / Inadequate Care"
  | "Abandonment"
  | "Physical Abuse"
  | "Animal Fighting"
  | "Hoarding"
  | "Dangerous Conditions (Heat/Cold)"
  | "Shelter / Facility Concerns";

type Jurisdiction = "Urban (large city)" | "Suburban" | "Rural / Agricultural";
type StepStatus = "pending" | "done" | "skipped";

interface ActionStep {
  day: number;
  dayLabel: string;
  title: string;
  actions: string[];
  expectedResponse: string;
  ifNoResponse: string;
  tier: "initial" | "escalate" | "sustained";
  tools: { label: string; href: string }[];
}

interface ActionPlan {
  id: string;
  caseLabel: string;
  incidentType: IncidentType;
  jurisdiction: Jurisdiction;
  startDate: string;
  progress: Record<string, StepStatus>;
}

function loadPlans(): ActionPlan[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as ActionPlan[]) : [];
  } catch { return []; }
}

function savePlans(plans: ActionPlan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(plans));
}

const TIER_STYLE: Record<ActionStep["tier"], { bar: string; badge: string; label: string }> = {
  initial:   { bar: "bg-[#47CC5E]", badge: "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30", label: "Initial Action" },
  escalate:  { bar: "bg-[#970CDA]", badge: "bg-[#970CDA]/15 text-[#c060ff] border-[#970CDA]/30", label: "Escalation" },
  sustained: { bar: "bg-white/25",  badge: "bg-white/8 text-white/55 border-white/15",           label: "Sustained Pressure" },
};

function generateSteps(incident: IncidentType, jurisdiction: Jurisdiction): ActionStep[] {
  const isRural = jurisdiction === "Rural / Agricultural";
  const isFighting = incident === "Animal Fighting";
  const isHoarding = incident === "Hoarding";
  const isAbuse = incident === "Physical Abuse";
  const isHeat = incident === "Dangerous Conditions (Heat/Cold)";
  const isShelter = incident === "Shelter / Facility Concerns";

  const steps: ActionStep[] = [];

  // Day 1
  steps.push({
    day: 1, dayLabel: "Day 1 — Document Everything",
    title: "Photograph, video, and write down everything",
    actions: [
      "Photograph or video all conditions from a public vantage point. Date and time-stamp every file.",
      "Write a detailed description: animal count, species, visible conditions, weather, presence of food/water/shelter.",
      "Note the exact address and nearest cross-street. Speak the address aloud in any video.",
      "Save originals to at least two locations (device + cloud).",
    ],
    expectedResponse: "You now have a documented baseline. This is your evidence, and its value only increases over time.",
    ifNoResponse: "Nothing to escalate yet — this step is about you. Do it thoroughly.",
    tier: "initial",
    tools: [{ label: "Evidence Vault", href: "/evidence-vault" }, { label: "Document Concern", href: "/intake" }],
  });

  // Day 1-2: First agency contact
  if (isHeat) {
    steps.push({
      day: 1, dayLabel: "Day 1 — Emergency: Call Animal Control Immediately",
      title: "This is a time-sensitive emergency — call, do not just file online",
      actions: [
        "Call your local animal control dispatcher directly. Say: an animal is in a life-threatening situation due to heat/cold exposure.",
        "If animal control does not answer or cannot respond: call non-emergency police line.",
        "If animal is in a locked vehicle in extreme heat: call 911 and remain on scene.",
        "Log your call: time, who you spoke with, what they said.",
      ],
      expectedResponse: "Emergency dispatch within hours. If conditions are life-threatening, law enforcement can act without a warrant in most states.",
      ifNoResponse: "If no response within 2-3 hours and animal is in distress: document via video and call again. Escalate to sheriff immediately.",
      tier: "initial",
      tools: [{ label: "Authority Directory", href: "/authority-directory" }, { label: "Agency Tracker", href: "/agency-tracker" }],
    });
  } else {
    steps.push({
      day: 1, dayLabel: isAbuse || isFighting ? "Day 1 — File with Law Enforcement & Animal Control" : "Day 1-2 — File Your First Report",
      title: isAbuse || isFighting
        ? "Animal abuse and fighting are criminal offenses — contact police, not just animal control"
        : "Contact your local Animal Control or humane authority",
      actions: [
        ...(isAbuse || isFighting
          ? [
              "Call your local police non-emergency line and report animal abuse/fighting. This is a criminal matter, not just a civil one.",
              "Also contact Animal Control — they may assist law enforcement.",
              isFighting ? "Contact HSUS Fighting Taskforce: 1-877-645-5847 (anonymous tipline)." : "",
            ].filter(Boolean)
          : [
              isRural
                ? "In rural areas, animal control may be limited — contact the county sheriff's office as your first point of contact."
                : "Call your local Animal Control or SPCA. Look up the direct line — do not rely solely on online forms.",
              "File a formal complaint by phone AND in writing (email or online form). Ask for a case number.",
              "State that you have photographic/video evidence and are prepared to share it.",
            ]),
        "Log the contact: date, time, who you spoke with, case number if given, their estimated response time.",
      ],
      expectedResponse: isAbuse || isFighting
        ? "Law enforcement should open a case. Animal control should conduct an inspection within 24-48 hours for cruelty reports."
        : "Animal Control should acknowledge within 24-72 hours and schedule an inspection.",
      ifNoResponse: isAbuse || isFighting
        ? "If police decline to open a case: request supervisor, document refusal, and contact your DA's office."
        : "If no acknowledgment within 72 hours: go to Step 3 (Sheriff contact) immediately.",
      tier: "initial",
      tools: [{ label: "Authority Directory", href: "/authority-directory" }, { label: "Agency Tracker", href: "/agency-tracker" }],
    });
  }

  // Day 3-5: Follow up
  steps.push({
    day: 3, dayLabel: "Day 3-5 — Follow Up & Document Their Response",
    title: "Call back and document whether they responded",
    actions: [
      "Call Animal Control again. Reference your case number. Ask: has an officer visited the location?",
      "If conditions are unchanged: take a second set of photos/video to document continued neglect.",
      isShelter
        ? "For shelter concerns: file a formal complaint with your state Department of Agriculture or Department of Health (which oversees shelters in most states)."
        : "If AC says they inspected and found no violation: request a copy of the inspection report in writing.",
      "Update your Agency Tracker with their response (or non-response).",
    ],
    expectedResponse: "If they responded: you have an official record. If they did not: you now have documented non-response, which is grounds for escalation.",
    ifNoResponse: "Non-response within 72 hours of a documented animal welfare report is itself a reportable failure. Move to Day 7 steps.",
    tier: "initial",
    tools: [{ label: "Agency Tracker", href: "/agency-tracker" }, { label: "Evidence Vault", href: "/evidence-vault" }],
  });

  // Day 7: Sheriff / escalate first line
  steps.push({
    day: 7, dayLabel: "Day 7 — Escalate to Sheriff or State Humane Officer",
    title: isRural
      ? "In rural areas, state humane investigators have jurisdiction where AC does not"
      : "Contact Sheriff's Office if Animal Control has not acted",
    actions: [
      isRural
        ? "Contact your state's Department of Agriculture or state humane investigator. In many states, they have authority over rural animal welfare cases that local AC lacks."
        : "Contact your county Sheriff's Office. State that Animal Control has not responded to a documented case (reference your case number).",
      "Send a written summary of the case: dates of contact, responses received, evidence in hand.",
      "CC: your city council member or county commissioner on this email. Politicians accelerate agency action.",
      isHoarding
        ? "Hoarding cases often require multi-agency coordination. Contact your county health department in addition to AC and sheriff."
        : "",
      "Update your Agency Tracker.",
    ].filter(Boolean),
    expectedResponse: "Sheriff contact often triggers AC action. Politicians being CC'd almost always accelerates response.",
    ifNoResponse: "If Sheriff does not respond in 5 days: contact State AG and humane organizations (HSUS, ASPCA) simultaneously.",
    tier: "escalate",
    tools: [{ label: "Authority Directory", href: "/authority-directory" }, { label: "Agency Tracker", href: "/agency-tracker" }],
  });

  // Day 14: State AG + humane orgs
  steps.push({
    day: 14, dayLabel: "Day 14 — File with State AG and HSUS/ASPCA",
    title: "Two simultaneous tracks: official legal pressure + humane organization support",
    actions: [
      "File a formal complaint with your State Attorney General's office. Most states have an animal cruelty complaint form online. Attach your evidence log.",
      "Submit a tip to HSUS Investigations (humanesociety.org) and/or ASPCA (aspca.org). Include your full case file.",
      isFighting ? "File an anonymous tip with the HSUS Animal Fighting Taskforce: 1-877-645-5847." : "",
      "File a FOIA request for all Animal Control inspection records related to the property address. Use VoiceMap's FOIA Generator.",
      "Update Case Summary with all new contacts.",
    ].filter(Boolean),
    expectedResponse: "HSUS/ASPCA investigators sometimes conduct their own parallel investigations. State AG filings create formal legal accountability.",
    ifNoResponse: "HSUS may not respond to every tip — their priority queue is case severity. Follow up after 7 days.",
    tier: "escalate",
    tools: [{ label: "FOIA Generator", href: "/foia" }, { label: "Case Summary", href: "/case-summary" }],
  });

  // Day 21-30: Media
  steps.push({
    day: 21, dayLabel: "Day 21-30 — Alert Media",
    title: "A documented case with multiple non-responsive agencies is a news story",
    actions: [
      "Identify your most appropriate media contacts: local TV newsdesk investigative reporter, or animal welfare media (The Dodo, Animal Wellness Magazine).",
      "Write a one-page media tip: summary of concern, agencies contacted, dates, responses received (or not), evidence available.",
      "Attach your Case File document (from Case Summary generator).",
      "Offer to provide photos and video to the reporter. Most investigative pieces begin with an advocate who has already documented the story.",
      isShelter ? "For shelter stories: shelter statistics from public records (FOIA) make the most compelling media pitches." : "",
    ].filter(Boolean),
    expectedResponse: "Media attention is the most powerful catalyst for government action. Even one published story typically triggers immediate agency response.",
    ifNoResponse: "If your local media is unresponsive, try regional and national outlets. Animal welfare stories have strong public interest.",
    tier: "escalate",
    tools: [{ label: "Media Directory", href: "/media-contacts" }, { label: "Case Summary", href: "/case-summary" }],
  });

  // Day 30+: Legislators
  steps.push({
    day: 30, dayLabel: "Day 30 — Contact Your State Legislators",
    title: "Constituent pressure on legislators creates systemic change",
    actions: [
      "Contact your state representative and state senator. Reference documented agency failures by name and date.",
      "Ask them to: (1) inquire about the specific case with the relevant agency, (2) co-sponsor or support pending animal welfare legislation.",
      "Use VoiceMap's Legislative Tracker to find active bills in your state and include them in your letter.",
      "Generate formal constituent testimony using the Legislative Tracker's Testimony Generator.",
      "If your US Representative has jurisdiction: contact their office as well. Federal agencies (USDA APHIS) respond to Congressional inquiries.",
    ],
    expectedResponse: "Legislators can directly inquire with agencies, which creates far more accountability than citizen complaints alone.",
    ifNoResponse: "If your legislator does not respond within 14 days: contact their office again, and consider reaching out to a legislator from an adjacent district.",
    tier: "sustained",
    tools: [{ label: "Legislative Tracker", href: "/legislators" }, { label: "Case Summary", href: "/case-summary" }],
  });

  // Day 60+: USDA / FBI
  if (!isShelter) {
    steps.push({
      day: 60, dayLabel: "Day 60+ — Federal Escalation",
      title: "USDA APHIS and FBI have jurisdiction over certain animal welfare violations",
      actions: [
        isFighting
          ? "Animal fighting is a federal felony. File a formal report with the FBI (tips.fbi.gov) and USDA APHIS Animal Care."
          : "If the facility holds a USDA license (breeding facility, research, transport): file a formal complaint with USDA APHIS Animal Care.",
        "Contact your US Representative's constituent services office. Request a formal inquiry to USDA APHIS or FBI.",
        "Compile your complete case history — every contact, every non-response — and submit it as a comprehensive federal complaint.",
        "Consider connecting with a national animal law attorney (Animal Legal Defense Fund offers referrals: aldf.org).",
      ],
      expectedResponse: "Federal action moves slowly but creates lasting accountability. A federal inquiry typically triggers state and local responses.",
      ifNoResponse: "Federal agencies prioritize cases with clear jurisdiction and documented prior state/local non-response. Your full case file makes this viable.",
      tier: "sustained",
      tools: [{ label: "Case Summary", href: "/case-summary" }, { label: "Agency Tracker", href: "/agency-tracker" }],
    });
  }

  return steps;
}

function buildPlanText(plan: ActionPlan, steps: ActionStep[]): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `ACTION PLAN
Generated: ${today}
Source: VoiceMap National Animal Protection Portal — Action Plan Generator

Case: ${plan.caseLabel}
Incident type: ${plan.incidentType}
Jurisdiction: ${plan.jurisdiction}
Plan start date: ${plan.startDate}

${"═".repeat(60)}

${steps.map((step) => `${step.dayLabel.toUpperCase()}
${step.title}

Actions:
${step.actions.map((a) => `  • ${a}`).join("\n")}

Expected response: ${step.expectedResponse}
If no response: ${step.ifNoResponse}

${"─".repeat(40)}
`).join("\n")}

DISCLAIMER
This action plan is a general advocacy guide based on common escalation procedures.
It does not constitute legal advice. All incidents described are alleged concerns
requiring investigation. Consult an animal law attorney for complex or dangerous situations.

Generated by VoiceMap National Animal Protection Portal`;
}

const INCIDENT_TYPES: IncidentType[] = [
  "Neglect / Inadequate Care", "Abandonment", "Physical Abuse",
  "Animal Fighting", "Hoarding", "Dangerous Conditions (Heat/Cold)", "Shelter / Facility Concerns",
];

const JURISDICTIONS: Jurisdiction[] = ["Urban (large city)", "Suburban", "Rural / Agricultural"];

interface SetupFormProps {
  onGenerate: (label: string, incident: IncidentType, jurisdiction: Jurisdiction) => void;
}

function SetupForm({ onGenerate }: SetupFormProps) {
  const [caseLabel, setCaseLabel] = useState("");
  const [incident, setIncident] = useState<IncidentType>("Neglect / Inadequate Care");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("Suburban");

  const inputCls = "w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all";

  return (
    <div className="bg-white/4 border border-white/10 rounded-2xl p-6 max-w-xl">
      <p className="text-white font-black text-lg mb-1">Generate Your Action Plan</p>
      <p className="text-white/45 text-sm mb-5">Answer two questions. Get a personalized, time-sequenced escalation plan.</p>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Case Label (optional)</label>
          <input
            className={inputCls}
            placeholder="Brief description of your concern"
            value={caseLabel}
            onChange={(e) => setCaseLabel(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Incident Type</label>
          <select className={inputCls} value={incident} onChange={(e) => setIncident(e.target.value as IncidentType)}>
            {INCIDENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Your Jurisdiction</label>
          <div className="grid grid-cols-3 gap-2">
            {JURISDICTIONS.map((j) => (
              <button
                key={j}
                onClick={() => setJurisdiction(j)}
                className={`px-3 py-2.5 rounded-xl text-xs font-black border transition-all text-center ${
                  jurisdiction === j
                    ? "bg-[#47CC5E]/15 border-[#47CC5E]/40 text-[#47CC5E]"
                    : "bg-white/5 border-white/12 text-white/50 hover:bg-white/8 hover:text-white"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => onGenerate(caseLabel || `${incident} — ${new Date().toLocaleDateString()}`, incident, jurisdiction)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_14px_rgba(71,204,94,0.4)] transition-all"
        >
          <Zap className="w-3.5 h-3.5" /> Generate Plan
        </button>
      </div>
    </div>
  );
}

export default function ActionPlan() {
  const [plans, setPlans] = useState<ActionPlan[]>(loadPlans);
  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    const stored = loadPlans();
    return stored.length > 0 ? stored[0].id : null;
  });
  const [showSetup, setShowSetup] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePlan = plans.find((p) => p.id === activePlanId) ?? null;
  const steps = useMemo(
    () => (activePlan ? generateSteps(activePlan.incidentType, activePlan.jurisdiction) : []),
    [activePlan]
  );

  const generatePlan = (label: string, incident: IncidentType, jurisdiction: Jurisdiction) => {
    const plan: ActionPlan = {
      id: crypto.randomUUID(),
      caseLabel: label,
      incidentType: incident,
      jurisdiction,
      startDate: new Date().toISOString().split("T")[0],
      progress: {},
    };
    const updated = [plan, ...plans];
    setPlans(updated);
    savePlans(updated);
    setActivePlanId(plan.id);
    setShowSetup(false);
  };

  const toggleStep = (stepKey: string) => {
    if (!activePlan) return;
    const current = activePlan.progress[stepKey] ?? "pending";
    const next: StepStatus = current === "pending" ? "done" : current === "done" ? "skipped" : "pending";
    const updated = plans.map((p) =>
      p.id === activePlan.id ? { ...p, progress: { ...p.progress, [stepKey]: next } } : p
    );
    setPlans(updated);
    savePlans(updated);
  };

  const planText = activePlan && steps.length > 0 ? buildPlanText(activePlan, steps) : "";

  const copy = async () => {
    await navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const slug = (activePlan?.caseLabel ?? "plan").slice(0, 30).replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ActionPlan_${slug}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doneCount = activePlan ? Object.values(activePlan.progress).filter((v) => v === "done").length : 0;
  const pct = steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <Zap className="w-3.5 h-3.5" />
            Action Plan Generator
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Know Exactly What to Do.<br />
            <span className="text-[#47CC5E]">Step by Step. Day by Day.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Enter your incident type and jurisdiction. Get a personalized, time-sequenced escalation plan — from Day 1 documentation through federal escalation — with progress tracking and exportable text.
          </p>
        </div>

        {/* Plan selector bar + generate button */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => { setActivePlanId(p.id); setShowSetup(false); }}
                className={`px-4 py-2 rounded-full text-xs font-black border transition-all max-w-[200px] truncate ${
                  activePlanId === p.id
                    ? "bg-[#47CC5E]/15 border-[#47CC5E]/40 text-[#47CC5E]"
                    : "bg-white/5 border-white/12 text-white/50 hover:bg-white/8"
                }`}
              >
                {p.caseLabel.slice(0, 30)}{p.caseLabel.length > 30 ? "…" : ""}
              </button>
            ))}
            <button
              onClick={() => setShowSetup((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
            >
              <Zap className="w-3 h-3" /> {plans.length === 0 ? "Generate My Plan" : "New Plan"}
            </button>
          </div>
          {activePlan && (
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#47CC5E]" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={download} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          )}
        </div>

        {/* Setup form */}
        {(showSetup || plans.length === 0) && (
          <div className="mb-8">
            <SetupForm onGenerate={generatePlan} />
          </div>
        )}

        {/* Active plan */}
        {activePlan && steps.length > 0 && (
          <div className="flex flex-col gap-0">
            {/* Plan meta + progress */}
            <div className="bg-white/4 border border-white/10 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-white font-black text-base">{activePlan.caseLabel}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  {activePlan.incidentType} · {activePlan.jurisdiction} · Started {activePlan.startDate}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white font-black text-2xl">{doneCount}/{steps.length}</p>
                  <p className="text-white/40 text-xs">Steps complete</p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15"
                      fill="none"
                      stroke={pct === 100 ? "#47CC5E" : "#970CDA"}
                      strokeWidth="3"
                      strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-sm">{pct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-white/8" />

              <div className="flex flex-col gap-4">
                {steps.map((step, idx) => {
                  const key = `${step.day}-${idx}`;
                  const status = activePlan.progress[key] ?? "pending";
                  const tierStyle = TIER_STYLE[step.tier];

                  return (
                    <div key={key} className={`relative pl-14 transition-all ${status === "skipped" ? "opacity-40" : ""}`}>
                      {/* Node */}
                      <button
                        onClick={() => toggleStep(key)}
                        className={`absolute left-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                          status === "done"
                            ? "border-[#47CC5E] bg-[#47CC5E]"
                            : status === "skipped"
                            ? "border-white/20 bg-white/5"
                            : "border-white/30 bg-[#080c1a] hover:border-[#47CC5E]/60"
                        }`}
                      >
                        {status === "done" && <CheckCircle2 className="w-3 h-3 text-[#0A1439]" />}
                        {status === "pending" && <Circle className="w-2 h-2 text-white/20" />}
                      </button>

                      {/* Card */}
                      <div className={`rounded-2xl border overflow-hidden transition-all ${
                        status === "done" ? "border-[#47CC5E]/20 bg-[#47CC5E]/4" : "border-white/10 bg-white/3 hover:border-white/16"
                      }`}>
                        {/* Colored top bar */}
                        <div className={`h-1 ${tierStyle.bar}`} />
                        <div className="px-5 py-4">
                          {/* Header */}
                          <div className="flex items-start gap-3 flex-wrap mb-3">
                            <span className="text-white/35 text-xs font-black uppercase tracking-widest mt-0.5">{step.dayLabel.split("—")[0]}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${tierStyle.badge}`}>{tierStyle.label}</span>
                          </div>
                          <p className="text-white font-black text-base leading-snug mb-3">
                            {step.title}
                          </p>

                          {/* Actions */}
                          <div className="flex flex-col gap-1.5 mb-4">
                            {step.actions.map((action, aIdx) => (
                              <div key={aIdx} className="flex gap-2.5">
                                <ArrowRight className="w-3.5 h-3.5 text-[#47CC5E] shrink-0 mt-0.5" />
                                <p className="text-white/70 text-sm leading-relaxed">{action}</p>
                              </div>
                            ))}
                          </div>

                          {/* Expected response + if no response */}
                          <div className="grid sm:grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#47CC5E]/6 border border-[#47CC5E]/15 rounded-xl p-3">
                              <p className="text-[#47CC5E]/70 text-xs font-black uppercase tracking-wider mb-1">Expected</p>
                              <p className="text-white/65 text-xs leading-relaxed">{step.expectedResponse}</p>
                            </div>
                            <div className="bg-[#970CDA]/6 border border-[#970CDA]/15 rounded-xl p-3">
                              <p className="text-[#c060ff]/70 text-xs font-black uppercase tracking-wider mb-1">If No Response</p>
                              <p className="text-white/65 text-xs leading-relaxed">{step.ifNoResponse}</p>
                            </div>
                          </div>

                          {/* Tool links + mark done */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex flex-wrap gap-1.5">
                              {step.tools.map((t) => (
                                <a
                                  key={t.href}
                                  href={t.href}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/12 text-white/55 font-black text-xs hover:bg-white/10 hover:text-white transition-all"
                                >
                                  {t.label} <ChevronRight className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                            <button
                              onClick={() => toggleStep(key)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black border transition-all ${
                                status === "done"
                                  ? "bg-[#47CC5E]/15 border-[#47CC5E]/30 text-[#47CC5E]"
                                  : "bg-white/5 border-white/12 text-white/50 hover:bg-white/8 hover:text-white"
                              }`}
                            >
                              {status === "done" ? <><CheckCircle2 className="w-3.5 h-3.5" /> Done</> : <><Clock className="w-3.5 h-3.5" /> Mark Done</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion state */}
            {pct === 100 && (
              <div className="mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#47CC5E]/10 border border-[#47CC5E]/30">
                <CheckCircle2 className="w-6 h-6 text-[#47CC5E] shrink-0" />
                <div>
                  <p className="text-[#47CC5E] font-black text-base">All steps completed</p>
                  <p className="text-white/60 text-sm mt-0.5">You have completed a full escalation cycle for this case. If the concern is resolved, document the outcome. If not, consider consulting an animal law attorney (aldf.org).</p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8">
              <AlertTriangle className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
              <p className="text-white/35 text-xs leading-relaxed">
                This action plan provides general advocacy guidance only. It does not constitute legal advice.
                For dangerous situations involving physical abuse, animal fighting, or immediate threat to animals or people,
                contact law enforcement directly. All incidents are alleged concerns requiring investigation.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
