import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import { AlertTriangle, ChevronDown, ChevronUp, Copy, Download, CheckCircle2, ExternalLink, ShieldAlert, CheckSquare, Square } from "lucide-react";

const WARNING_SIGNS = [
  {
    category: "Property Indicators",
    items: [
      "Heavy fencing, chained dogs, or makeshift kennels hidden from public view",
      "Treadmills, spring poles, bite sleeves, or heavily padded training equipment",
      "Multiple dogs with cropped ears, scarred muzzles, or bite wounds",
      "Night-time activity, loud dog fighting noises, or frequent vehicle traffic at odd hours",
      "Large amounts of animal medications, vitamins, syringes, or wound supplies",
    ],
  },
  {
    category: "Animal Indicators",
    items: [
      "Dogs with scars around face, chest, legs, and ears",
      "Isolation of dogs in separate pens with no normal pet socialization",
      "Underweight or dehydrated animals kept in poor conditions",
      "Dogs showing extreme fear, reactivity, or repeated injuries",
      "Puppies or young dogs used as bait or training animals",
    ],
  },
  {
    category: "Organized Crime Indicators",
    items: [
      "Gambling references, cash-only transactions, or coded language about 'scratch' and 'match'",
      "Use of multiple phones, burner numbers, or encrypted messaging",
      "Vehicles arriving from multiple states for short periods",
      "Signs of other crimes such as weapons, narcotics, or stolen property",
      "Known members with prior cruelty or weapons arrests",
    ],
  },
];

const REPORTING_STEPS = [
  {
    num: "01",
    title: "Call local law enforcement immediately",
    body: "Dogfighting is a felony in all 50 states and often part of broader criminal activity. If you witness an active fight, call 911. If the activity is ongoing but not immediate, call your local police or sheriff and request an animal cruelty investigator.",
    action: "Provide the exact address, time, and why you believe dogfighting is occurring.",
  },
  {
    num: "02",
    title: "Contact the HSUS and local animal control",
    body: "The Humane Society of the United States maintains a national animal fighting response team. Local animal control can often provide backup, seizure logistics, and evidence preservation support.",
    action: "File a tip with HSUS and request a written case number from animal control.",
    url: "https://www.humanesociety.org/resources/report-animal-fighting",
  },
  {
    num: "03",
    title: "Preserve evidence without confronting suspects",
    body: "Do not trespass or confront anyone. From a public place, document dates, times, vehicles, and visible conditions. Photos or video from public property can be critical if collected safely and legally.",
    action: "Record only what is visible from a public street or other lawful vantage point.",
  },
  {
    num: "04",
    title: "Report federal nexus indicators",
    body: "If there is evidence of organized interstate activity, weapons, gambling, or trafficking, ask law enforcement to coordinate with the FBI. Dogfighting often overlaps with other federal crimes.",
    action: "Mention any weapons, gambling, or out-of-state transport you observed.",
  },
  {
    num: "05",
    title: "Request seizure and post-seizure care planning",
    body: "If animals are seized, they need veterinary triage, evidence logs, and long-term foster or shelter placements. Ask about emergency housing, veterinary partners, and chain of custody procedures.",
    action: "Advocate for immediate veterinary assessment and safe placement for seized animals.",
  },
];

const STATE_LAWS = [
  { state: "All 50 States", note: "Dogfighting is illegal in every state and under federal law. Most states classify participation, possession of fighting animals, and promotion of fights as felonies." },
  { state: "Federal", note: "7 U.S.C. § 2156 prohibits animal fighting ventures. Related federal crimes may include gambling, weapons, and interstate transport violations." },
  { state: "Georgia", note: "Known for strong felony penalties and broad prohibitions on possession, training, or attendance at fights." },
  { state: "Texas", note: "Dogfighting offenses can be charged as felonies; possession of fighting equipment or animals is also criminalized." },
  { state: "Florida", note: "Participation, promotion, and attendance can be charged; animal cruelty task forces often assist." },
  { state: "New York", note: "Organized animal fighting is treated as felony cruelty and can support broader organized-crime investigations." },
];

interface CheckedState { [k: string]: boolean }
const CHECKLIST = [
  { id: "d1", text: "Exact location, date, and time recorded" },
  { id: "d2", text: "Vehicles, plates, and known participants documented" },
  { id: "d3", text: "Publicly visible photos or video captured safely" },
  { id: "d4", text: "911 or police report filed" },
  { id: "d5", text: "HSUS or animal fighting tip line contacted" },
  { id: "d6", text: "Animal control or cruelty investigator notified" },
  { id: "d7", text: "Evidence stored in VoiceMap Evidence Vault" },
  { id: "d8", text: "Witness names and contact information preserved" },
];

function buildReport(form: { location: string; participants: string; evidence: string; suspects: string; dateSeen: string }): string {
  return `FORMAL ANIMAL FIGHTING COMPLAINT\nDate: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n\nTO: [Law Enforcement / Animal Cruelty Unit]\nRE: Alleged dogfighting activity requiring investigation\n\nLOCATION\n${form.location || "[Address / property description]"}\n\nDATE OF OBSERVATION\n${form.dateSeen || "[Date]"}\n\nPARTICIPANTS / ACTIVITY OBSERVED\n${form.participants || "[Describe people, dogs, vehicles, noises, and activity observed]"}\n\nEVIDENCE\n${form.evidence || "[Describe photos, video, witness statements, or other evidence]"}\n\nSUSPECT INFORMATION\n${form.suspects || "[Names, vehicles, plates, social media handles, or aliases if known]"}\n\nREQUESTED ACTIONS\n1. Open a formal cruelty investigation\n2. Coordinate with the animal cruelty investigator, if available\n3. Preserve evidence and document all seized items\n4. Coordinate with federal authorities if interstate or gambling activity is present\n\nComplainant: [Your name or anonymous if permitted]\nContact: [Your phone / email]\n\nGenerated by VoiceMap National Animal Protection Portal`;
}

export default function DogfightingGuide() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [checked, setChecked] = useState<CheckedState>({});
  const [showLaws, setShowLaws] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ location: "", participants: "", evidence: "", suspects: "", dateSeen: new Date().toISOString().split("T")[0] });

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const report = buildReport(form);

  const copy = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Dogfighting_Report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="mb-6 relative">
          <PawPrintScatter count={5} baseColor="white" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c060ff]/35 bg-[#970CDA]/8 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Dogfighting Response Guide
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Organized Animal Fighting<br />
            <span className="text-[#47CC5E]">Requires Investigation.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Warning signs, reporting steps, state and federal law notes, and a complaint generator for suspected dogfighting or other animal fighting operations.
          </p>
        </div>

        <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/6 border border-white/18 mb-8">
          <AlertTriangle className="w-5 h-5 text-white/70 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-black text-sm">If you witness an active fight, call 911.</p>
            <p className="text-white/50 text-xs mt-0.5">Do not confront suspects or trespass. Preserve only what you can safely observe from public property.</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Warning Signs to Document</p>
          <div className="flex flex-col gap-3">
            {WARNING_SIGNS.map((section) => {
              const isOpen = openSection === section.category;
              return (
                <div key={section.category} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenSection(isOpen ? null : section.category)}>
                    <p className="text-white font-black text-sm">{section.category}</p>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
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

        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">How to Report</p>
          <div className="flex flex-col gap-3">
            {REPORTING_STEPS.map((step) => (
              <div key={step.num} className="flex gap-4 bg-white/4 border border-white/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-xl bg-[#970CDA]/12 border border-[#970CDA]/25 text-[#c060ff] font-black text-sm flex items-center justify-center shrink-0">{step.num}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm mb-1">{step.title}</p>
                  <p className="text-white/55 text-xs leading-relaxed mb-2">{step.body}</p>
                  <div className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#47CC5E]/30 shrink-0 mt-0.5 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E]" /></div>
                    <div className="flex-1">
                      <p className="text-[#47CC5E] text-xs font-bold leading-relaxed">{step.action}</p>
                      {step.url && (
                        <a href={step.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white/35 text-xs hover:text-white/60 transition-colors mt-1">
                          <ExternalLink className="w-3 h-3" /> Open resource
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-black text-sm">Evidence Checklist</p>
            <span className={`text-xs font-black ${checkedCount === CHECKLIST.length ? "text-[#47CC5E]" : "text-white/35"}`}>{checkedCount}/{CHECKLIST.length}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {CHECKLIST.map((item) => (
              <button key={item.id} className="flex items-start gap-2.5 text-left p-2.5 rounded-xl hover:bg-white/5 transition-all" onClick={() => toggle(item.id)}>
                {checked[item.id] ? <CheckSquare className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />}
                <p className={`text-xs leading-snug ${checked[item.id] ? "text-white/30 line-through" : "text-white/65"}`}>{item.text}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowLaws((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">State and Federal Notes</p>
              <p className="text-white/40 text-sm mt-0.5">Dogfighting is illegal in all 50 states and under federal law</p>
            </div>
            {showLaws ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showLaws && (
            <div className="border-t border-white/8 px-5 pb-5 pt-3 flex flex-col gap-2">
              {STATE_LAWS.map((s) => (
                <div key={s.state} className="flex gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-white/60 font-black text-xs w-24 shrink-0">{s.state}</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowForm((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">Complaint Generator</p>
              <p className="text-white/40 text-sm mt-0.5">Formatted report for law enforcement and animal cruelty units</p>
            </div>
            {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {(["location", "dateSeen", "participants", "suspects"] as (keyof typeof form)[]).map((key) => (
                  <div key={key} className={key === "participants" || key === "suspects" ? "sm:col-span-2" : ""}>
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{key}</label>
                    {key === "participants" || key === "suspects" ? (
                      <textarea rows={3} className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                    ) : (
                      <input type="text" className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">Evidence summary</label>
                  <textarea rows={3} className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none" value={form.evidence} onChange={(e) => setForm((f) => ({ ...f, evidence: e.target.value }))} />
                </div>
              </div>
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/55 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto mb-3">{report}</div>
              <div className="flex gap-2">
                <button onClick={copy} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Report"}
                </button>
                <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}