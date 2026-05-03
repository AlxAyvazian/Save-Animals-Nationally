import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  AlertTriangle, ChevronDown, ChevronUp, Copy, Download,
  CheckCircle2, CheckSquare, Square, ExternalLink, BookOpen
} from "lucide-react";

const WARNING_SIGNS = [
  { category: "The Animals", signs: [
    "Large numbers of animals (20+ in a single home is a common threshold)",
    "Emaciation, visible ribs, protruding hip bones",
    "Untreated wounds, abscesses, or injuries",
    "Animals living in their own waste with no clean areas",
    "Overwhelmingly strong odor from outside the property",
    "Animals showing signs of respiratory illness (discharge, labored breathing)",
    "Dead animals present on the property",
  ]},
  { category: "The Residence", signs: [
    "Overwhelming smell of ammonia or feces detectable at the street",
    "Windows covered, minimal visible activity",
    "Extreme accumulation of clutter or debris visible through windows or in yard",
    "Large numbers of animal feces in yard without cleanup",
    "Dead vegetation or lawns destroyed by animals",
    "Neighbors report ongoing odor or sounds of distressed animals",
  ]},
  { category: "The Person", signs: [
    "Claims to 'rescue' animals but cannot describe their care routine",
    "Refuses entry to veterinarians, inspectors, or family members",
    "Claims all animals are 'healthy' despite visible evidence otherwise",
    "Has had prior animal control contact at previous addresses",
    "Collects animals repeatedly after removals",
    "Socially isolated; animals are described as the sole relationship priority",
  ]},
];

const AGENCY_CONTACTS = [
  { agency: "Animal Control / Humane Law Enforcement", note: "Primary responder. File a formal written complaint (not just a call) so there is a paper trail. Request a case number." },
  { agency: "Local Health Department", note: "Hoarding situations typically violate public health codes. Health department inspectors have different (sometimes broader) entry authority than animal control." },
  { agency: "Code Enforcement / Zoning", note: "Many jurisdictions limit the number of animals per household. Code enforcement can inspect and cite property violations." },
  { agency: "Adult Protective Services (APS)", note: "Self-neglect often accompanies animal hoarding. If the person appears to be neglecting their own basic needs, APS has concurrent jurisdiction." },
  { agency: "State Veterinarian / State Ag Department", note: "For large-scale livestock or agricultural cases, the state veterinarian has authority to mandate care standards and can act independently of local animal control." },
  { agency: "FBI / USDA (if licensed facility)", note: "If the property is a licensed breeder, exhibitor, or research facility regulated by USDA, USDA APHIS has federal inspection authority." },
];

interface CheckedState { [k: string]: boolean }

const DOCUMENTATION_CHECKLIST = [
  { id: "d1", text: "Number of animals observed (estimate by type)" },
  { id: "d2", text: "Specific visible health conditions documented (describe, don't diagnose)" },
  { id: "d3", text: "Odor noted (describe strength and distance detectable)" },
  { id: "d4", text: "Photos or video taken (exterior only if entry not authorized)" },
  { id: "d5", text: "Date and time of each observation logged" },
  { id: "d6", text: "Neighbor or witness names and statements collected" },
  { id: "d7", text: "Prior animal control visits or citations researched (via FOIA)" },
  { id: "d8", text: "Prior addresses of the individual researched for pattern" },
];

const AFTER_REMOVAL = [
  {
    title: "Animals seized — what happens next",
    body: "After a seizure, animals are typically held as evidence. They cannot be adopted until the case is resolved. Contact the holding facility to offer to foster or sponsor medical care costs — this speeds up the process and saves lives.",
  },
  {
    title: "Recidivism is extremely common",
    body: "Studies show 60–100% of animal hoarders re-accumulate animals within 2 years if no behavioral intervention occurs. Document any post-conviction acquisition of animals and report immediately to the probation officer or district attorney.",
  },
  {
    title: "Mental health referral is part of the solution",
    body: "Animal hoarding is classified as a mental health disorder. While this does not excuse the harm caused to animals, effective prosecution includes mental health assessment and mandatory treatment — not just fines or surrender orders alone.",
  },
  {
    title: "Requesting lifetime ban and monitoring",
    body: "At sentencing, request a lifetime animal ownership ban with mandatory monitoring. Without monitoring, this is essentially unenforceable. Ask who will be responsible for monitoring compliance — the probation officer, animal control, or a community volunteer.",
  },
];

function buildComplaintLetter(form: { name: string; address: string; animalCount: string; observations: string; priorReports: string }): string {
  return `FORMAL ANIMAL WELFARE COMPLAINT — SUSPECTED HOARDING
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

TO: [Agency Name]
RE: Alleged animal welfare concern at ${form.address || "[Address]"}

I am filing this formal written complaint regarding an alleged animal hoarding situation at the above address. I am requesting a documented case number and a formal inspection response.

REPORTED INDIVIDUAL / PROPERTY
Address: ${form.address || "[Not specified]"}
Person of concern (if known): ${form.name || "[Not specified]"}
Estimated number of animals observed: ${form.animalCount || "[Not specified]"}

SPECIFIC OBSERVATIONS
${form.observations || "[Describe specific conditions: dates, times, what was seen/smelled, animal conditions observed]"}

PRIOR AGENCY CONTACT
${form.priorReports || "No prior reports known to the complainant."}

REQUESTED ACTIONS
1. Open a formal case file and assign a case number
2. Conduct an unannounced inspection of the property
3. Coordinate with [Local Health Department / Code Enforcement / APS] as appropriate
4. Provide written notification of inspection results and any citations issued

I am available to provide photographs, additional statements, or witness contact information upon request.

This complaint is filed as a matter of public concern for the welfare of the animals at this address. I understand that all documentation will be maintained on file and that this situation requires investigation.

Complainant:
[Your Name — or "Anonymous if permitted"]
[Your Contact Information — optional]

This complaint was generated by VoiceMap National Animal Protection Portal.`;
}

export default function HoardingResponse() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", animalCount: "", observations: "", priorReports: "" });
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
    a.download = `Hoarding_Complaint_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-6 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c060ff]/35 bg-[#970CDA]/8 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Animal Hoarding Response
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Recognizing and Reporting<br />
            <span className="text-[#47CC5E]">Animal Hoarding.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Warning signs, documentation checklist, multi-agency escalation guide, complaint letter generator, and post-seizure advocacy guidance for the most complex animal welfare cases.
          </p>
        </div>

        {/* Context band */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {[
            { stat: "250,000+", label: "Animals affected annually", desc: "Estimated animals suffering in US hoarding situations per year" },
            { stat: "60%+", label: "Recidivism rate", desc: "Hoarders who re-accumulate animals within 2 years without treatment" },
            { stat: "3+", label: "Agencies to notify", desc: "Animal control, health department, and APS all have jurisdiction in most cases" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4">
              <div className="kz-stat-number text-3xl text-white mb-0.5">{s.stat}</div>
              <p className="text-[#47CC5E] text-xs font-black mb-1">{s.label}</p>
              <p className="text-white/35 text-xs leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Warning signs */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Warning Signs to Document</p>
          <div className="flex flex-col gap-3">
            {WARNING_SIGNS.map((section) => {
              const isOpen = openSection === section.category;
              return (
                <div key={section.category} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenSection(isOpen ? null : section.category)}
                  >
                    <p className="text-white font-black text-sm">{section.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-xs">{section.signs.length} indicators</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-4 pt-3 flex flex-col gap-2">
                      {section.signs.map((sign, i) => (
                        <div key={i} className="flex gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#c060ff] shrink-0 mt-0.5" />
                          <p className="text-white/65 text-sm leading-snug">{sign}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Documentation checklist */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-black text-sm">Documentation Checklist</p>
            <span className={`text-xs font-black ${checkedCount === DOCUMENTATION_CHECKLIST.length ? "text-[#47CC5E]" : "text-white/35"}`}>
              {checkedCount} / {DOCUMENTATION_CHECKLIST.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {DOCUMENTATION_CHECKLIST.map((item) => (
              <button
                key={item.id}
                className="flex items-start gap-2.5 text-left p-2.5 rounded-xl hover:bg-white/5 transition-all"
                onClick={() => toggle(item.id)}
              >
                {checked[item.id]
                  ? <CheckSquare className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" />
                  : <Square className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
                }
                <p className={`text-xs leading-snug ${checked[item.id] ? "text-white/30 line-through" : "text-white/65"}`}>{item.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Agency contacts */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Agencies to Contact — and Why</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AGENCY_CONTACTS.map((a) => (
              <div key={a.agency} className="bg-white/4 border border-white/10 rounded-2xl p-4 flex gap-3">
                <div className="w-2 h-2 rounded-full bg-[#47CC5E] shrink-0 mt-1.5" />
                <div>
                  <p className="text-white font-black text-sm mb-1">{a.agency}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaint letter generator */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowForm((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">Formal Complaint Letter Generator</p>
              <p className="text-white/40 text-sm mt-0.5">Generate a written complaint for agency submission</p>
            </div>
            {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  ["name", "Person of concern (if known)", "text"],
                  ["address", "Property address", "text"],
                  ["animalCount", "Estimated number of animals", "text"],
                ] as [keyof typeof form, string, string][]).map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <input
                      type="text"
                      className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                {([
                  ["observations", "Specific observations (dates, conditions seen, odors)"],
                  ["priorReports", "Prior agency reports or contacts (if known)"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
                  <div key={key} className="sm:col-span-2">
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/55 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto mb-3">
                {letter}
              </div>
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

        {/* After seizure */}
        <div className="mb-6">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">After a Seizure — What Advocates Should Know</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {AFTER_REMOVAL.map((item) => (
              <div key={item.title} className="bg-white/4 border border-white/10 rounded-2xl p-4 flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c060ff] mt-2 shrink-0" />
                <div>
                  <p className="text-white font-black text-sm mb-1">{item.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">National Resources</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Hoarding of Animals Research Consortium (HARC)", url: "https://www.vet.tufts.edu/education/hoarding-of-animals-research-consortium-harc/", desc: "Tufts University research program — resources for communities, law enforcement, and mental health professionals responding to hoarding cases." },
              { name: "ASPCA — Animal Hoarding Resources", url: "https://www.aspca.org/animal-cruelty/hoarding", desc: "ASPCA investigative and prosecutorial resources for hoarding cases." },
              { name: "HSUS — Hoarding Cases", url: "https://www.humanesociety.org/resources/hoarding-animals", desc: "HSUS guidance for responding to suspected hoarding situations." },
              { name: "Animal Legal Defense Fund", url: "https://aldf.org/issue/animal-hoarding/", desc: "Legal resources and attorney referrals for complex hoarding prosecutions." },
            ].map((r) => (
              <div key={r.name} className="bg-white/3 border border-white/8 rounded-xl p-4">
                <p className="text-white font-black text-sm mb-1">{r.name}</p>
                <p className="text-white/45 text-xs mb-3 leading-snug">{r.desc}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                  <ExternalLink className="w-3 h-3" /> Visit Resource
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
