import { useState } from "react";
import { TOOLS_ITEMS } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Stethoscope, Copy, Download, CheckCircle2, CheckSquare, Square,
  ChevronDown, ChevronUp, ExternalLink, AlertTriangle
} from "lucide-react";

const RECOGNIZING_ISSUES = [
  {
    category: "Injury Inconsistent with History",
    items: [
      "Wounds, fractures, or burns that don't match the owner's explanation",
      "Bilateral injuries (both eyes, both legs) are rarely accidental",
      "Multiple injuries at different stages of healing",
      "Pattern injuries suggesting a specific instrument or repeated contact",
      "Injuries in protected areas (underbelly, inner thighs) rarely caused by falls",
    ],
  },
  {
    category: "Veterinary Indicators",
    items: [
      "Vet documented injuries as 'inconsistent with reported history'",
      "X-rays showing healed fractures not previously reported",
      "Bruising in areas typically protected by fur (inner ears, gums, around eyes)",
      "Evidence of repeated untreated injuries",
      "Animal shows extreme fear of specific person (not strangers generally)",
    ],
  },
  {
    category: "Behavioral & Environmental",
    items: [
      "Animal flinches or cowers specifically near one person",
      "Extreme startle response, hiding, or unusual aggression",
      "Owner delays or avoids veterinary care for injured animal",
      "Owner provides multiple changing explanations for the same injury",
      "Neighbors or witnesses report sounds consistent with distress",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Request and preserve all veterinary records",
    body: "As the animal's owner or authorized party, request complete veterinary records including X-rays, lab work, intake notes, and the vet's written assessment. These records are critical evidence and cannot be obtained later without legal process if not requested promptly.",
    action: "Request records in writing (email) from every vet the animal has seen in the last 2 years. Confirm receipt.",
  },
  {
    num: "02",
    title: "Obtain a veterinary forensic assessment if possible",
    body: "Ask your veterinarian to document injuries using the language 'inconsistent with reported history' or 'suggestive of non-accidental injury.' This specific phrasing creates a legally documentable veterinary finding. Some large metro areas have veterinary forensic specialists.",
    action: "Ask: 'Can you document whether these injuries are consistent with the reported cause?' in writing.",
  },
  {
    num: "03",
    title: "File a formal animal cruelty report with law enforcement",
    body: "Veterinary evidence of non-accidental injury is sufficient probable cause in most states for animal cruelty investigation. File with both local law enforcement (animal cruelty is a crime) and animal control. Provide all veterinary documentation.",
    action: "File with local police AND animal control. Give them a copy of the vet records at the time of filing.",
  },
  {
    num: "04",
    title: "Contact your state veterinary board if a vet is involved",
    body: "If a licensed veterinarian performed a procedure that harmed an animal, or failed to report suspected cruelty as required by state law, file a complaint with your state's veterinary licensing board. Most states require vets to report suspected animal cruelty.",
    action: "Search '[State] Veterinary Medical Board complaint' to find your state board.",
  },
  {
    num: "05",
    title: "Consult the Animal Legal Defense Fund",
    body: "ALDF maintains a network of attorneys who handle civil cases involving animals. If the injury was severe or the animal died, civil liability may be possible in addition to criminal charges. ALDF also provides legal expertise to prosecutors handling cruelty cases.",
    action: "Contact ALDF at aldf.org — they can advise on legal options and connect you with attorneys.",
    url: "https://aldf.org",
  },
  {
    num: "06",
    title: "File with your state SPCA's law enforcement division",
    body: "Many state SPCAs maintain sworn animal cruelty officers with independent investigative authority. They can act separately from local animal control and often have stronger forensic capacity.",
    action: "Search '[State] SPCA law enforcement' or '[State] humane law enforcement officer' for your state.",
  },
];

const STATE_VET_REPORTING = [
  { state: "All 50 States", note: "Animal cruelty is a crime in all 50 states. Severity (misdemeanor vs. felony) varies by state and nature of injury." },
  { state: "California", note: "Penal Code § 597 — felony cruelty. Vets are mandated reporters of suspected animal cruelty under California law." },
  { state: "New York", note: "Agriculture & Markets Law § 353 — felony cruelty. NY vets are encouraged reporters; enhanced penalties for aggravated cruelty." },
  { state: "Texas", note: "Penal Code § 42.092 — felony for intentional, knowing, or reckless serious bodily injury. Vets are encouraged to report." },
  { state: "Florida", note: "FS § 828.12 — felony for intentional cruelty. Florida has a statewide animal cruelty hotline." },
  { state: "Illinois", note: "720 ILCS 5/12-35 — aggravated cruelty is a felony. IL vets are mandated reporters under the Humane Care for Animals Act." },
  { state: "Pennsylvania", note: "18 Pa.C.S. § 5511 — aggravated cruelty is a felony. PA has dedicated animal cruelty investigators in many counties." },
  { state: "Colorado", note: "C.R.S. § 18-9-202 — aggravated cruelty is a felony. Colorado Animal Cruelty Task Force assists with complex cases." },
];

const CHECKLIST_ITEMS = [
  { id: "v1", text: "All veterinary records requested in writing and copies obtained" },
  { id: "v2", text: "Veterinarian asked to document injury consistency in writing" },
  { id: "v3", text: "Photographs of all visible injuries taken with timestamps" },
  { id: "v4", text: "Written timeline of when injuries were first noticed" },
  { id: "v5", text: "Names and contact info of any witnesses documented" },
  { id: "v6", text: "Police report filed with copy of vet records attached" },
  { id: "v7", text: "Animal control complaint filed with case number obtained" },
  { id: "v8", text: "State SPCA law enforcement contacted" },
  { id: "v9", text: "ALDF consulted on legal options" },
  { id: "v10", text: "All documentation stored in VoiceMap Evidence Vault" },
];

type CheckedState = { [k: string]: boolean };

function buildComplaintLetter(form: { animalDesc: string; injuryDesc: string; vetName: string; vetFinding: string; suspectInfo: string; dateDiscovered: string }): string {
  return `FORMAL ANIMAL CRUELTY COMPLAINT — ALLEGED NON-ACCIDENTAL INJURY
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

TO: [Law Enforcement Agency / Animal Control]
RE: Alleged animal cruelty — non-accidental injury

ANIMAL DESCRIPTION
${form.animalDesc || "[Species, breed, age, color/markings, microchip ID if available]"}

INJURY DESCRIPTION
${form.injuryDesc || "[Describe the nature and location of injuries observed]"}

DATE INJURY DISCOVERED
${form.dateDiscovered || "[Date]"}

VETERINARY DOCUMENTATION
Treating Veterinarian: ${form.vetName || "[Vet name and clinic]"}
Veterinary Finding: ${form.vetFinding || "[Note if vet documented as 'inconsistent with reported history' or similar]"}

PERSON OF CONCERN
${form.suspectInfo || "[Name, relationship to animal, address if known]"}

REQUESTED ACTIONS
1. Open a formal animal cruelty investigation
2. Review attached veterinary documentation
3. Issue case number and advise on next steps
4. Coordinate with state SPCA law enforcement if needed

DOCUMENTATION ENCLOSED
[ ] Veterinary records (attached)
[ ] Photographs of injuries (attached)
[ ] Timeline of events (attached)

I am prepared to provide additional documentation or testimony as needed.

Complainant: [Your Name or Anonymous if permitted]
Contact: [Your phone / email]

Generated by VoiceMap National Animal Protection Portal`;
}

export default function VetAbuseGuide() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showLaws, setShowLaws] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ animalDesc: "", injuryDesc: "", vetName: "", vetFinding: "", suspectInfo: "", dateDiscovered: new Date().toISOString().split("T")[0] });
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const letter = buildComplaintLetter(form);

  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `AnimalCruelty_Complaint_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-6 relative">
          <PawPrintScatter count={5} baseColor="white" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/35 bg-[#970CDA]/8 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Stethoscope className="w-3.5 h-3.5" />
            Veterinary Injury Evidence Guide
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            When Injuries Tell<br />
            <span className="text-[#47CC5E]">A Different Story.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            A guide to recognizing alleged non-accidental injuries, preserving veterinary evidence, navigating the reporting process, and understanding your state&apos;s cruelty statutes.
          </p>
        </div>

        {/* Important framing */}
        <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/6 border border-white/18 mb-8">
          <AlertTriangle className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-black text-sm">Veterinary documentation is the foundation of successful prosecution.</p>
            <p className="text-white/50 text-xs mt-0.5">Cases with veterinary findings documented as "inconsistent with reported history" are significantly more likely to result in charges. Preserve records before anything else — they can be subpoenaed or overwritten.</p>
          </div>
        </div>

        {/* Recognizing signs */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Recognizing Potential Non-Accidental Injury</p>
          <div className="flex flex-col gap-3">
            {RECOGNIZING_ISSUES.map((section) => {
              const isOpen = openSection === section.category;
              return (
                <div key={section.category} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenSection(isOpen ? null : section.category)}>
                    <p className="text-white font-black text-sm">{section.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-xs">{section.items.length} indicators</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-4 pt-3 flex flex-col gap-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c060ff] shrink-0 mt-1.5" />
                          <p className="text-white/65 text-sm leading-snug">{item}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">What to Do — Step by Step</p>
          <div className="flex flex-col gap-3">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-4 bg-white/4 border border-white/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-xl bg-[#970CDA]/12 border border-[#970CDA]/25 text-[#c060ff] font-black text-sm flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm mb-1">{step.title}</p>
                  <p className="text-white/55 text-xs leading-relaxed mb-2">{step.body}</p>
                  <div className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#47CC5E]/30 shrink-0 mt-0.5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#47CC5E] text-xs font-bold leading-relaxed">{step.action}</p>
                      {step.url && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/35 text-xs hover:text-white/60 transition-colors mt-1">
                          <ExternalLink className="w-3 h-3" /> Open link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-black text-sm">Documentation Checklist</p>
            <span className={`text-xs font-black ${checkedCount === CHECKLIST_ITEMS.length ? "text-[#47CC5E]" : "text-white/35"}`}>
              {checkedCount}/{CHECKLIST_ITEMS.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHECKLIST_ITEMS.map((item) => (
              <button key={item.id} className="flex items-start gap-2.5 text-left p-2.5 rounded-xl hover:bg-white/5 transition-all" onClick={() => toggle(item.id)}>
                {checked[item.id] ? <CheckSquare className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />}
                <p className={`text-xs leading-snug ${checked[item.id] ? "text-white/30 line-through" : "text-white/65"}`}>{item.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* State laws */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowLaws((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">State Cruelty Laws — Key Notes</p>
              <p className="text-white/40 text-sm mt-0.5">Animal cruelty is a felony in all 50 states when involving serious bodily harm</p>
            </div>
            {showLaws ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showLaws && (
            <div className="border-t border-white/8 px-5 pb-5 pt-3 flex flex-col gap-2">
              {STATE_VET_REPORTING.map((s) => (
                <div key={s.state} className="flex gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-white/60 font-black text-xs w-24 shrink-0">{s.state}</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s.note}</p>
                </div>
              ))}
              <p className="text-white/25 text-xs mt-2">Consult ALDF (aldf.org) for the most current statutory language in your state.</p>
            </div>
          )}
        </div>

        {/* Complaint generator */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowForm((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">Cruelty Complaint Letter Generator</p>
              <p className="text-white/40 text-sm mt-0.5">Formal complaint letter for law enforcement and animal control</p>
            </div>
            {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  ["animalDesc", "Animal description"],
                  ["vetName", "Treating veterinarian & clinic"],
                  ["dateDiscovered", "Date injury discovered"],
                  ["suspectInfo", "Person of concern (if known)"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <input type="text" className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
                {([
                  ["injuryDesc", "Injury description"],
                  ["vetFinding", "Veterinary finding / assessment note"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
                  <div key={key} className="sm:col-span-2">
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <textarea rows={3} className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/55 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto mb-3">{letter}</div>
              <div className="flex gap-2">
                <button onClick={copy} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Letter"}
                </button>
                <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Key Resources</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Animal Legal Defense Fund", url: "https://aldf.org", desc: "Legal expertise, attorney referrals, and prosecution support for animal cruelty cases." },
              { name: "ASPCA — Report Animal Cruelty", url: "https://www.aspca.org/animal-cruelty/report-animal-cruelty", desc: "ASPCA investigative resources and state reporting guide." },
              { name: "Humane Society — Cruelty Investigations", url: "https://www.humanesociety.org/resources/report-animal-cruelty", desc: "HSUS investigative team tip line and resources for complex cruelty cases." },
              { name: "Tufts Animal Condition and Care (TACC)", url: "https://vet.tufts.edu/", desc: "Veterinary forensic expertise for documenting and assessing injury cases." },
            ].map((r) => (
              <div key={r.name} className="bg-white/3 border border-white/8 rounded-xl p-4">
                <p className="text-white font-black text-sm mb-1">{r.name}</p>
                <p className="text-white/45 text-xs mb-3 leading-snug">{r.desc}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                  <ExternalLink className="w-3 h-3" /> Open
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
