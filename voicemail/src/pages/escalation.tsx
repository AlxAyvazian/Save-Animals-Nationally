import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { TrendingUp, CheckCircle2, Clock, ChevronDown, ChevronUp, Copy, Plus, Trash2, AlertCircle } from "lucide-react";

const LS_KEY = "voicemap_escalation_chains";

type ResponseStatus = "pending" | "responded" | "no_response" | "escalated";

interface EscalationLevel {
  id: string;
  label: string;
  agency: string;
  why: string;
  letterTemplate: (c: Chain) => string;
  deadline: string;
}

interface ChainLevel {
  levelId: string;
  contactedDate?: string;
  responseDate?: string;
  status: ResponseStatus;
  notes: string;
  caseNumber?: string;
}

interface Chain {
  id: string;
  title: string;
  state: string;
  concernType: string;
  incidentDate: string;
  location: string;
  animalType: string;
  createdAt: string;
  levels: ChainLevel[];
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const LEVELS: EscalationLevel[] = [
  {
    id: "L1",
    label: "Level 1",
    agency: "Local Animal Control / Humane Law Enforcement",
    why: "First and fastest response. Local AC has direct jurisdiction, can physically investigate and seize animals. Required first step before most escalation chains are taken seriously.",
    deadline: "72 hours for acknowledgment; 7 days for investigation start",
    letterTemplate: (c) => `To: Animal Control Director / Chief Animal Control Officer
Re: Formal Complaint — ${c.concernType}
Location: ${c.location}, ${c.state}
Incident Date: ${c.incidentDate}
Animal(s): ${c.animalType}

I am writing to formally report an alleged incident of ${c.concernType.toLowerCase()} involving ${c.animalType} at ${c.location} on or around ${c.incidentDate}. 

I respectfully request that you:
1. Dispatch an officer to investigate the above location within 24 hours
2. Provide me with a case number and the name of the assigned officer
3. Confirm in writing that an investigation has been opened

If no investigation is initiated within 72 hours, I will escalate this complaint to your county sheriff, state attorney general, and the appropriate state department of agriculture.

Respectfully,
[Your Name]
[Contact Information]`,
  },
  {
    id: "L2",
    label: "Level 2",
    agency: "County Sheriff / District Attorney",
    why: "When local animal control has failed to respond or dismissed the complaint. The Sheriff has broader law enforcement authority and the DA can pursue criminal charges independently of AC.",
    deadline: "5 business days for response to criminal complaint referral",
    letterTemplate: (c) => `To: Sheriff [Name] / District Attorney [Name]
County of [County], ${c.state}
Re: Referral of Animal Cruelty Complaint — Case Escalation

I am writing to escalate a reported animal cruelty complaint that has not been adequately addressed by local animal control.

Original Complaint: ${c.concernType} involving ${c.animalType} at ${c.location}, ${c.state} on ${c.incidentDate}.

Local AC Case #: [Insert case number or "No case opened"]
Date Reported to AC: [Date]
Response Received: [Summary or "None"]

I believe this matter warrants criminal investigation under [State] Penal Code § [applicable statute]. I respectfully request that your office:
1. Open an independent investigation into this matter
2. Review the adequacy of the local animal control response
3. Consider prosecution if evidence supports criminal charges

All documented evidence is available upon request.

Respectfully,
[Your Name]`,
  },
  {
    id: "L3",
    label: "Level 3",
    agency: `State Department of Agriculture / Attorney General`,
    why: "State-level oversight with power to compel local agencies to act, investigate systemic failures, and impose penalties on licensed facilities. The AG can prosecute cases across county lines.",
    deadline: "10 business days per most state public records and complaint laws",
    letterTemplate: (c) => `To: ${c.state} Attorney General / Department of Agriculture — Animal Welfare Division
Re: Escalated Animal Cruelty Complaint — Failure of Local Response

This letter constitutes a formal escalated complaint regarding alleged ${c.concernType.toLowerCase()} involving ${c.animalType} at ${c.location}, ${c.state}, on ${c.incidentDate}.

I have previously reported this matter to:
• Local Animal Control — [Date] — Response: [Status]
• County Sheriff / DA — [Date if applicable] — Response: [Status]

Despite these reports, no adequate investigation has been conducted. I am requesting that your office:
1. Exercise state-level oversight to compel investigation of this matter
2. Investigate whether local animal control has fulfilled its statutory duties
3. Provide me with a response and case number within 10 business days

Attached / available: documentation, photographs, case numbers, and dates of all prior reports.

Sincerely,
[Your Name]
[Contact Information]`,
  },
  {
    id: "L4",
    label: "Level 4",
    agency: "Federal Agencies (USDA APHIS / FBI)",
    why: "When licensed facilities (breeders, labs, zoos), interstate transport, dogfighting rings, or documented law enforcement failure is involved. Federal jurisdiction supersedes state law in many cases.",
    deadline: "USDA APHIS: 30 days; FBI: acknowledgment within 14 days",
    letterTemplate: (c) => `To: USDA APHIS Animal Care / FBI Animal Cruelty Unit
Re: Federal Animal Welfare Complaint

I am submitting a formal complaint to federal authorities regarding alleged ${c.concernType.toLowerCase()} involving ${c.animalType} at ${c.location}, ${c.state}.

This matter has been escalated through local and state channels without resolution:
• Local AC: [Date, outcome]
• County/State: [Date, outcome]

[If licensed facility]: This facility appears to operate under a USDA/APHIS license, bringing it within federal Animal Welfare Act jurisdiction.

[If interstate]: Evidence suggests interstate transport or commerce may be involved, invoking federal jurisdiction under the AWA and Lacey Act.

I request that federal investigators review this matter. All documentation is available upon request.

Respectfully,
[Your Name]`,
  },
  {
    id: "L5",
    label: "Level 5",
    agency: "Elected Officials (State Legislature / Congress)",
    why: "Legislators can request agency investigations, compel public testimony, and amend laws. A constituent's documented case with VoiceMap's report packet is credible and carries political weight.",
    deadline: "Most offices respond within 5–10 business days to constituent inquiries",
    letterTemplate: (c) => `To: [State Representative/Senator/U.S. Rep Name]
Re: Constituent Request for Legislative Intervention — Animal Cruelty Case

Dear [Representative Name],

I am a constituent writing to request your assistance in escalating an animal welfare complaint that has not been adequately addressed through normal channels.

Incident: Alleged ${c.concernType.toLowerCase()} involving ${c.animalType} at ${c.location}, ${c.state}, on ${c.incidentDate}.

This matter has been reported to local animal control, the county sheriff, and the state department of agriculture without satisfactory response. [Summary of prior attempts]

I am asking that your office:
1. Request a status report from [relevant agency] regarding this matter
2. Inquire whether the agency followed its statutory obligations
3. Consider whether legislative action is needed to address enforcement gaps

I have thorough documentation of this matter available upon request, including timestamped reports, photographs, and a documented escalation history.

Thank you for your service to our community.

Sincerely,
[Your Name]
[Address]`,
  },
  {
    id: "L6",
    label: "Level 6",
    agency: "Investigative Media / Press",
    why: "Local TV investigative units and newspapers have legal tools citizens don't — they can doorstep officials, file their own records requests, and create public accountability. A documented case is their raw material.",
    deadline: "Response varies; follow up after 1 week",
    letterTemplate: (c) => `To: Investigative Reporter / News Tip Desk
Re: Animal Cruelty Story Tip — Documented Multi-Level Escalation

I am reaching out to share a documented animal welfare case that I believe warrants investigative coverage.

Summary: Alleged ${c.concernType.toLowerCase()} involving ${c.animalType} at ${c.location}, ${c.state}, beginning ${c.incidentDate}.

What makes this newsworthy:
• This case has been reported to [list of agencies] with inadequate response
• A documented pattern of non-enforcement exists (records available)
• Animals may remain at risk due to systemic failure

I have compiled a complete evidence packet including: timestamped documentation, photographs, copies of all official complaints filed, and responses (or lack thereof) received.

I am available to speak confidentially. All documentation will be provided upon request.

[Your Name — or indicate "anonymous tip"]
[Contact if willing to share]`,
  },
];

const STATUS_STYLES: Record<ResponseStatus, string> = {
  pending: "bg-white/8 text-white/50 border-white/15",
  responded: "bg-[#47CC5E]/20 text-[#47CC5E] border-[#47CC5E]/35",
  no_response: "bg-red-500/15 text-red-400 border-red-500/30",
  escalated: "bg-[#970CDA]/20 text-[#c060ff] border-[#970CDA]/35",
};

const STATUS_LABELS: Record<ResponseStatus, string> = {
  pending: "Pending",
  responded: "Responded",
  no_response: "No Response",
  escalated: "Escalated",
};

function newChain(): Chain {
  const id = Date.now().toString();
  return {
    id,
    title: "",
    state: "",
    concernType: "",
    incidentDate: "",
    location: "",
    animalType: "",
    createdAt: new Date().toLocaleDateString(),
    levels: LEVELS.map((l) => ({ levelId: l.id, status: "pending", notes: "" })),
  };
}

function loadChains(): Chain[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function saveChains(chains: Chain[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(chains));
}

export default function Escalation() {
  const [chains, setChains] = useState<Chain[]>(() => loadChains());
  const [activeChain, setActiveChain] = useState<string | null>(null);
  const [openLevel, setOpenLevel] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<Partial<Chain>>({});

  useEffect(() => { saveChains(chains); }, [chains]);

  const updateChain = (id: string, updates: Partial<Chain>) => {
    setChains((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  };

  const updateLevel = (chainId: string, levelId: string, updates: Partial<ChainLevel>) => {
    setChains((prev) => prev.map((c) => {
      if (c.id !== chainId) return c;
      return { ...c, levels: c.levels.map((l) => l.levelId === levelId ? { ...l, ...updates } : l) };
    }));
  };

  const deleteChain = (id: string) => {
    setChains((prev) => prev.filter((c) => c.id !== id));
    if (activeChain === id) setActiveChain(null);
  };

  const copyLetter = async (chainId: string, levelId: string) => {
    const chain = chains.find((c) => c.id === chainId);
    const level = LEVELS.find((l) => l.id === levelId);
    if (!chain || !level) return;
    const text = level.letterTemplate(chain);
    await navigator.clipboard.writeText(text);
    setCopiedId(levelId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const createChain = () => {
    if (!newForm.title || !newForm.concernType) return;
    const chain: Chain = { ...newChain(), ...(newForm as Partial<Chain>) };
    setChains((prev) => [chain, ...prev]);
    setActiveChain(chain.id);
    setCreating(false);
    setNewForm({});
  };

  const inputCls = "w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all";

  const selected = chains.find((c) => c.id === activeChain);

  const levelProgress = (chain: Chain) => {
    const done = chain.levels.filter((l) => l.status === "responded" || l.status === "escalated").length;
    return { done, total: LEVELS.length };
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <TrendingUp className="w-3.5 h-3.5" />
            Escalation Chain Builder
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Systematically Force<br />
            <span className="text-[#47CC5E]">a Response.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Build a 6-level escalation chain for every case. Track contacts, responses, and deadlines. Generate the right letter for each level. Never let a case get buried.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chain list */}
          <div className="lg:w-72 flex flex-col gap-3">
            <button
              onClick={() => setCreating(true)}
              className="w-full px-4 py-3 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-sm uppercase tracking-wider hover:bg-[#5adb70] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Escalation Chain
            </button>

            {creating && (
              <div className="bg-white/6 border border-[#970CDA]/40 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-white/50 text-xs font-black uppercase tracking-widest">New Chain</p>
                <input className={inputCls} placeholder="Case title *" value={newForm.title ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))} />
                <input className={inputCls} placeholder="Concern type *" value={newForm.concernType ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, concernType: e.target.value }))} />
                <input className={inputCls} placeholder="Animal type" value={newForm.animalType ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, animalType: e.target.value }))} />
                <input className={inputCls} placeholder="Location / address" value={newForm.location ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, location: e.target.value }))} />
                <select className={inputCls} value={newForm.state ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, state: e.target.value }))}>
                  <option value="">State</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="date" className={inputCls} value={newForm.incidentDate ?? ""} onChange={(e) => setNewForm((p) => ({ ...p, incidentDate: e.target.value }))} />
                <div className="flex gap-2">
                  <button onClick={createChain} className="flex-1 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">Create</button>
                  <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-full bg-white/8 text-white/50 font-bold text-xs hover:bg-white/14 transition-all">Cancel</button>
                </div>
              </div>
            )}

            {chains.length === 0 && !creating && (
              <div className="text-center py-8 text-white/30 text-sm">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No chains yet. Create one above.
              </div>
            )}

            {chains.map((chain) => {
              const { done, total } = levelProgress(chain);
              const isActive = activeChain === chain.id;
              return (
                <button
                  key={chain.id}
                  onClick={() => setActiveChain(isActive ? null : chain.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all ${isActive ? "bg-[#970CDA]/20 border-[#970CDA]/40" : "bg-white/4 border-white/10 hover:bg-white/7"}`}
                >
                  <p className={`font-black text-sm truncate ${isActive ? "text-white" : "text-white/80"}`}>{chain.title || "Untitled"}</p>
                  <p className="text-white/35 text-xs mt-0.5 truncate">{chain.concernType} — {chain.state}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#47CC5E] rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
                    </div>
                    <span className="text-white/30 text-xs font-bold">{done}/{total}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chain detail */}
          <div className="flex-1">
            {!selected ? (
              <div className="flex items-center justify-center h-64 text-white/20 text-center">
                <div>
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-bold">Select a chain or create a new one</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Chain header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-white font-black text-2xl">{selected.title}</h2>
                    <p className="text-white/45 text-sm mt-1">{selected.concernType} · {selected.animalType} · {selected.location}, {selected.state} · {selected.incidentDate}</p>
                  </div>
                  <button
                    onClick={() => deleteChain(selected.id)}
                    className="p-2 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Levels */}
                <div className="flex flex-col gap-3">
                  {LEVELS.map((level, i) => {
                    const chainLevel = selected.levels.find((l) => l.levelId === level.id) || { levelId: level.id, status: "pending" as ResponseStatus, notes: "" };
                    const isOpen = openLevel === level.id;
                    const prevDone = i === 0 || selected.levels.slice(0, i).some((l) => l.status === "responded" || l.status === "escalated");

                    return (
                      <div key={level.id} className={`rounded-2xl border overflow-hidden transition-all ${
                        chainLevel.status === "responded" ? "border-[#47CC5E]/40 bg-[#47CC5E]/8" :
                        chainLevel.status === "no_response" ? "border-red-500/40 bg-red-500/8" :
                        chainLevel.status === "escalated" ? "border-[#970CDA]/40 bg-[#970CDA]/8" :
                        "border-white/10 bg-white/4"
                      }`}>
                        <button
                          className="w-full flex items-center gap-4 px-5 py-4 text-left"
                          onClick={() => setOpenLevel(isOpen ? null : level.id)}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${
                            chainLevel.status === "responded" ? "bg-[#47CC5E] text-[#0A1439]" :
                            chainLevel.status === "no_response" ? "bg-red-500 text-white" :
                            chainLevel.status === "escalated" ? "bg-[#970CDA] text-white" :
                            "bg-white/10 text-white/50"
                          }`}>
                            {chainLevel.status === "responded" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white/40 text-xs font-black uppercase tracking-widest">{level.label}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${STATUS_STYLES[chainLevel.status]}`}>
                                {STATUS_LABELS[chainLevel.status]}
                              </span>
                              {chainLevel.caseNumber && (
                                <span className="text-white/30 text-xs">Case #{chainLevel.caseNumber}</span>
                              )}
                            </div>
                            <p className="text-white font-bold text-sm mt-0.5">{level.agency}</p>
                          </div>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 border-t border-white/8 pt-4 flex flex-col gap-4">
                            <p className="text-white/55 text-sm leading-relaxed">{level.why}</p>
                            <div className="flex items-center gap-2 text-[#47CC5E] text-xs font-bold">
                              <Clock className="w-3.5 h-3.5" />
                              Response deadline: {level.deadline}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-white/35 text-xs font-black uppercase tracking-widest mb-1.5">Date Contacted</label>
                                <input
                                  type="date"
                                  className={inputCls}
                                  value={chainLevel.contactedDate ?? ""}
                                  onChange={(e) => updateLevel(selected.id, level.id, { contactedDate: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-white/35 text-xs font-black uppercase tracking-widest mb-1.5">Response Date</label>
                                <input
                                  type="date"
                                  className={inputCls}
                                  value={chainLevel.responseDate ?? ""}
                                  onChange={(e) => updateLevel(selected.id, level.id, { responseDate: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-white/35 text-xs font-black uppercase tracking-widest mb-1.5">Case / Reference #</label>
                                <input
                                  className={inputCls}
                                  placeholder="Optional"
                                  value={chainLevel.caseNumber ?? ""}
                                  onChange={(e) => updateLevel(selected.id, level.id, { caseNumber: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-white/35 text-xs font-black uppercase tracking-widest mb-1.5">Status</label>
                                <select
                                  className={inputCls}
                                  value={chainLevel.status}
                                  onChange={(e) => updateLevel(selected.id, level.id, { status: e.target.value as ResponseStatus })}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="responded">Responded</option>
                                  <option value="no_response">No Response</option>
                                  <option value="escalated">Escalated to Next</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-white/35 text-xs font-black uppercase tracking-widest mb-1.5">Notes</label>
                                <textarea
                                  className={`${inputCls} resize-none h-16`}
                                  placeholder="Officer names, case numbers, what was said, next steps…"
                                  value={chainLevel.notes ?? ""}
                                  onChange={(e) => updateLevel(selected.id, level.id, { notes: e.target.value })}
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => copyLetter(selected.id, level.id)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff] text-xs font-black hover:bg-[#970CDA]/30 transition-all w-fit"
                            >
                              {copiedId === level.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              {copiedId === level.id ? "Copied!" : `Copy ${level.label} Letter Template`}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
