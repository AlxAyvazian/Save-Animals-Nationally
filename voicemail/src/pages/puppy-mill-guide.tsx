import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Building2, Copy, Download, CheckCircle2, ExternalLink,
  ChevronDown, ChevronUp, CheckSquare, Square, Search
} from "lucide-react";

const WARNING_SIGNS = [
  { category: "At the Facility / Online", signs: [
    "Always multiple breeds available — puppies ready immediately with no waitlist",
    "Refuses to let you see where the parents live or the breeding area",
    "Prices seem unusually low for the breed",
    "Puppies available year-round in large quantities",
    "Pets can be purchased without a home visit or application",
    "Puppies sold through pet stores, flea markets, or third-party websites",
    "Online listings with stock photos or photos that don't match the described dogs",
  ]},
  { category: "The Animals", signs: [
    "Puppies younger than 8 weeks old offered for sale",
    "Animals appear fearful, shy, or unresponsive to human contact",
    "Discharge from eyes or nose, coughing, sneezing",
    "Thin body condition, visible ribs",
    "Skin conditions, parasites, or poor coat quality",
    "No veterinary health certificate provided",
    "Parents not available to be seen or appear in poor condition",
  ]},
  { category: "The Business", signs: [
    "No USDA license number displayed (required for breeders selling to pet stores or with 5+ breeding females selling retail)",
    "Unable or unwilling to provide USDA license number on request",
    "No state kennel license (required in most states)",
    "No health guarantee or contract offered",
    "Requests cash only or payment before viewing the animal",
    "High-pressure sales tactics — 'this puppy won't last long'",
  ]},
];

const STEPS_TO_FILE = [
  {
    step: "01",
    title: "Look up the breeder in the USDA APHIS database",
    detail: "The USDA maintains a public database of all licensed breeders, dealers, and exhibitors. Before filing, search for the breeder to determine if they are USDA-licensed and review their inspection history.",
    action: "Search the USDA APHIS database at publicreports.aphis.usda.gov",
    url: "https://publicreports.aphis.usda.gov/s/",
  },
  {
    step: "02",
    title: "Document your observations with dates and details",
    detail: "USDA complaints must be specific. Describe exactly what you observed, when, and how. Include the breeder's name, address, and USDA license number if known. General descriptions are often insufficient for investigators to act.",
    action: "Use VoiceMap Intake and Evidence Vault to build your documentation package.",
  },
  {
    step: "03",
    title: "File a formal complaint with USDA APHIS Animal Care",
    detail: "USDA APHIS Animal Care regulates breeders under the Animal Welfare Act. File online through their complaint portal or call 844-820-2234. Specify the facility's license number, the observed violations, and dates of observation.",
    action: "File at aphis.usda.gov or call 844-820-2234.",
    url: "https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare/SA_Contact_APHIS_Animal_Care",
  },
  {
    step: "04",
    title: "File a complaint with your state's department of agriculture",
    detail: "State-level kennel licensing is separate from USDA licensing. File with your state agriculture department simultaneously. States can act faster than federal agencies and have independent inspection authority.",
    action: "Search '[Your State] kennel license complaint' to find the relevant state agency.",
  },
  {
    step: "05",
    title: "Request inspection records via FOIA",
    detail: "USDA APHIS inspection reports are public records. Request all inspection records for the breeder's license number via FOIA. Repeat violations and cited non-compliances create a documented history for escalation.",
    action: "Use VoiceMap FOIA Generator to build your request. Address to USDA APHIS.",
    url: "/foia",
  },
  {
    step: "06",
    title: "Report to the Humane Society and ASPCA",
    detail: "HSUS and ASPCA maintain investigative databases and can pressure USDA to act on facilities with documented complaint histories. Multiple complaints from different sources accelerate federal action.",
    action: "File at humanesociety.org and aspca.org/animal-cruelty",
  },
];

const STATE_LICENSING_NOTES = [
  { state: "California", note: "Retail Pet Store ban (AB 485) — stores can only sell rescue animals. Breeders must be licensed by CDFA." },
  { state: "New York", note: "Puppy mills ban — retailers must source from shelters/rescues. State licensing required." },
  { state: "Illinois", note: "Breeders with 5+ breeding females must be USDA licensed. State IDOA licensing also required." },
  { state: "Texas", note: "Texas Department of Agriculture licenses commercial breeders. License publicly searchable." },
  { state: "Missouri", note: "Has more USDA-licensed dog breeders than any other state. Known as 'puppy mill capital'. Prop B (2010) established care standards." },
  { state: "Pennsylvania", note: "Dog Law Bureau licenses kennels. PA has one of the stricter state kennel inspection programs." },
  { state: "Ohio", note: "Ohio Department of Agriculture licenses kennels. Inspection records publicly available." },
  { state: "All states", note: "Most states have kennel licensing requirements separate from USDA. Search '[State] Department of Agriculture kennel license' for your state's program." },
];

interface CheckedState { [k: string]: boolean }
const CHECKLIST_ITEMS = [
  { id: "c1", text: "Breeder name, address, and contact information documented" },
  { id: "c2", text: "USDA license number searched and recorded (if applicable)" },
  { id: "c3", text: "Inspection history reviewed via USDA public reports database" },
  { id: "c4", text: "Specific violations documented with dates and observations" },
  { id: "c5", text: "Photos or video evidence collected (from public property or with consent)" },
  { id: "c6", text: "State licensing database checked" },
  { id: "c7", text: "USDA APHIS complaint filed with case number obtained" },
  { id: "c8", text: "State agriculture department complaint filed" },
  { id: "c9", text: "FOIA request submitted for inspection records" },
  { id: "c10", text: "HSUS and ASPCA tip submitted" },
];

function buildComplaintLetter(form: { breederName: string; address: string; licenseNum: string; violations: string; dates: string; priorComplaints: string }): string {
  return `FORMAL COMPLAINT — ALLEGED ANIMAL WELFARE ACT VIOLATIONS
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

TO: USDA APHIS Animal Care
    Investigative Enforcement Services
RE: Alleged violations at USDA-licensed facility

FACILITY INFORMATION
Breeder / Dealer Name: ${form.breederName || "[Name]"}
Address: ${form.address || "[Address]"}
USDA License Number: ${form.licenseNum || "[License # or 'Unknown']"}

ALLEGED VIOLATIONS
${form.violations || "[Describe specific observed conditions and violations with reference to Animal Welfare Act regulations]"}

DATES OF OBSERVATION
${form.dates || "[Dates when violations were observed]"}

PRIOR COMPLAINTS
${form.priorComplaints || "No prior complaints known to this reporter."}

REQUESTED ACTIONS
1. Open a formal case file for this facility
2. Conduct an unannounced inspection within 30 days
3. Provide written notification of inspection findings and any citations issued
4. Escalate to Investigative Enforcement Services if violations are confirmed
5. Consider license suspension or revocation for repeat violations

ENCLOSED DOCUMENTATION
[ ] Photographs / video (available upon request)
[ ] Veterinary assessment (if obtained)
[ ] Witness statements (if obtained)
[ ] USDA prior inspection records (via FOIA)

I understand that this complaint will be maintained on file and that the facility's license status may be affected by documented violations. I am available to provide additional documentation.

Complainant: [Your Name or Anonymous]
Contact: [Your Phone / Email — optional]

Generated by VoiceMap National Animal Protection Portal`;
}

export default function PuppyMillGuide() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showStateLaws, setShowStateLaws] = useState(false);
  const [form, setForm] = useState({ breederName: "", address: "", licenseNum: "", violations: "", dates: "", priorComplaints: "" });
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
    a.download = `PuppyMill_Complaint_${new Date().toISOString().split("T")[0]}.txt`;
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/35 bg-[#970CDA]/8 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Building2 className="w-3.5 h-3.5" />
            Puppy Mill &amp; Breeder Complaints
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Reporting Commercial<br />
            <span className="text-[#47CC5E]">Breeding Concerns.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            USDA-licensed commercial breeders are regulated under the Animal Welfare Act. This guide covers how to identify alleged violations, navigate the USDA APHIS complaint process, and file simultaneously with state agencies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          {[
            { stat: "10,000+", label: "USDA-licensed breeders", desc: "Active commercial breeders regulated under the Animal Welfare Act" },
            { stat: "AWA", label: "Federal governing law", desc: "Animal Welfare Act — enforced by USDA APHIS Animal Care division" },
            { stat: "2 routes", label: "Federal + state", desc: "File with USDA APHIS and your state agriculture department simultaneously" },
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
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Warning Signs — What to Document</p>
          <div className="flex flex-col gap-3">
            {WARNING_SIGNS.map((section) => {
              const isOpen = openSection === section.category;
              return (
                <div key={section.category} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenSection(isOpen ? null : section.category)}>
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
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c060ff] shrink-0 mt-1.5" />
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

        {/* Step by step */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">How to File — Step by Step</p>
          <div className="flex flex-col gap-3">
            {STEPS_TO_FILE.map((step) => (
              <div key={step.step} className="flex gap-4 bg-white/4 border border-white/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-xl bg-[#970CDA]/12 border border-[#970CDA]/25 text-[#c060ff] font-black text-sm flex items-center justify-center shrink-0">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm mb-1">{step.title}</p>
                  <p className="text-white/55 text-xs leading-relaxed mb-2">{step.detail}</p>
                  <div className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <Search className="w-3.5 h-3.5 text-[#47CC5E] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[#47CC5E] text-xs font-bold leading-relaxed">{step.action}</p>
                      {step.url && step.url.startsWith("http") && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/35 text-xs hover:text-white/60 transition-colors mt-1">
                          <ExternalLink className="w-3 h-3" /> Open link
                        </a>
                      )}
                      {step.url && step.url.startsWith("/") && (
                        <a href={step.url} className="flex items-center gap-1 text-white/35 text-xs hover:text-white/60 transition-colors mt-1">
                          <ExternalLink className="w-3 h-3" /> Open tool
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
            <p className="text-white font-black text-sm">Filing Checklist</p>
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
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowStateLaws((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">State Licensing Notes</p>
              <p className="text-white/40 text-sm mt-0.5">Key states with active puppy mill regulations</p>
            </div>
            {showStateLaws ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showStateLaws && (
            <div className="border-t border-white/8 px-5 pb-5 pt-3 flex flex-col gap-2">
              {STATE_LICENSING_NOTES.map((s) => (
                <div key={s.state} className="flex gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-white/60 font-black text-xs w-20 shrink-0">{s.state}</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaint letter generator */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowForm((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">USDA APHIS Complaint Letter Generator</p>
              <p className="text-white/40 text-sm mt-0.5">Formatted complaint letter for federal and state submission</p>
            </div>
            {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  ["breederName", "Breeder / Facility Name"],
                  ["address", "Facility Address"],
                  ["licenseNum", "USDA License Number (if known)"],
                  ["dates", "Dates of Observation"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
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
                  ["violations", "Specific alleged violations (Animal Welfare Act standards)"],
                  ["priorComplaints", "Prior complaints or inspection violations (if known)"],
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

        {/* USDA links */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Key Resources</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "USDA APHIS Public Reports (Breeder Search)", url: "https://publicreports.aphis.usda.gov/s/", desc: "Search all USDA-licensed breeders by name or license number. View inspection history." },
              { name: "USDA APHIS Animal Care Complaint", url: "https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare/SA_Contact_APHIS_Animal_Care", desc: "File a formal complaint against a USDA-licensed facility." },
              { name: "Breeders of Merit — AKC", url: "https://www.akc.org/breeder-programs/akc-breeders-of-merit-program/", desc: "AKC-approved breeders meet higher standards. Unlicensed operations selling AKC-registered dogs can be reported to AKC." },
              { name: "HSUS Puppy Mill Resources", url: "https://www.humanesociety.org/resources/puppy-mills-facts-and-figures", desc: "HSUS investigative resources and puppy mill tracker." },
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
