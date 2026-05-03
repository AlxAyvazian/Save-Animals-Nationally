import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Shield, Eye, CheckSquare, Square, AlertTriangle,
  ChevronDown, ChevronUp, ExternalLink, Lock
} from "lucide-react";

interface CheckedState { [k: string]: boolean }

const SAFETY_LEVELS = [
  {
    level: "Standard",
    label: "Standard Report (No ID Concerns)",
    desc: "Filing directly through official channels with your name. Appropriate when no retaliation risk is present.",
    steps: [
      "File directly through the agency's official website or phone line",
      "Provide your name and contact information for follow-up",
      "Keep a copy of your report confirmation number",
      "You will be the documented reporter — your information may be included in FOIA requests from the subject",
    ],
    risk: "low",
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/10 border-[#47CC5E]/25",
  },
  {
    level: "Intermediate",
    label: "Reduced-ID Report (Some Concern)",
    desc: "Filing through official channels while minimizing personal information. Your identity may still be discoverable through investigation.",
    steps: [
      "Request that your name be withheld where agency policy allows",
      "Use a Google Voice number or Google account created from a new session for callback",
      "File from a device not connected to your home Wi-Fi",
      "Do not reference personal details that would identify you (your neighbor's dog, your workplace, etc.)",
      "Many agencies have 'anonymous tip' options that remove reporter information from records",
    ],
    risk: "medium",
    color: "text-white/70",
    bg: "bg-white/10 border-white/20",
  },
  {
    level: "Anonymous",
    label: "Fully Anonymous Report",
    desc: "Filing with maximum identity protection. Appropriate when retaliation risk is high or the subject has a history of intimidation.",
    steps: [
      "Use public Wi-Fi (library, coffee shop) never your home or cellular network",
      "Use an incognito/private browser window — not your regular browser with saved logins",
      "Create a throwaway email account (ProtonMail) from the public network before filing",
      "Submit to Crime Stoppers or HSUS tip lines that explicitly accept anonymous submissions",
      "Use a VPN on a device that is not registered to you if possible",
      "Do not take photos or video on a phone registered to you — use a disposable camera or unregistered device",
      "Do not discuss what you are filing with others who could be subpoenaed",
    ],
    risk: "high",
    color: "text-[#c060ff]",
    bg: "bg-[#970CDA]/10 border-[#970CDA]/25",
  },
];

const LEGAL_PROTECTIONS = [
  {
    title: "Whistleblower Protections",
    body: "Federal and state whistleblower laws protect reporters who disclose violations of law in good faith. Protections vary significantly by state. The Animal Legal Defense Fund can advise on your state's specific protections.",
    applicable: "Public employees, contractors with federal agencies, reporters disclosing government violations",
  },
  {
    title: "Crime Stoppers Confidentiality",
    body: "Tips submitted through Crime Stoppers programs are legally protected from disclosure in most states. Crime Stoppers tip lines are operated independently of law enforcement and do not share your identity with agencies.",
    applicable: "All tip types — strongest for criminal activity (fighting, cruelty, theft)",
  },
  {
    title: "Anonymous Reporting to Federal Agencies",
    body: "USDA, FBI, and EPA accept anonymous tips through their online portals. Anonymous submissions may be less actionable than identified reports (agencies cannot follow up), but they are fully legally protected.",
    applicable: "USDA APHIS violations, animal fighting, federal-nexus cases",
  },
  {
    title: "First Amendment Protections",
    body: "Peacefully advocating for animal welfare, including photographing visible conditions from public property and contacting elected officials, is generally protected by the First Amendment. ALDF can advise if you receive a legal threat.",
    applicable: "Public advocacy, petitioning, reporting to legislators or media",
  },
  {
    title: "'Ag-Gag' Laws — Know Your State",
    body: "Some states have 'ag-gag' laws that criminalize recording agricultural operations without consent. These laws have been challenged in court, and several have been struck down. Check your state before recording on agricultural property.",
    applicable: "Livestock and agricultural operations",
    warning: true,
  },
];

const ANONYMOUS_CHANNELS = [
  { name: "HSUS Animal Fighting Tip Line", url: "https://www.humanesociety.org/resources/report-animal-fighting", phone: "877-645-5847", desc: "100% anonymous. Staffed by HSUS investigators. Not law enforcement — your information is not shared.", anon: true },
  { name: "Crime Stoppers USA", url: "https://www.crimestoppers.org", phone: "800-222-8477", desc: "Anonymous tips with legal confidentiality protection in most states. Some chapters offer rewards.", anon: true },
  { name: "FBI Tips (Online)", url: "https://tips.fbi.gov", phone: null, desc: "Online submissions can be made anonymously. Use a throwaway email and public Wi-Fi for maximum protection.", anon: true },
  { name: "USDA APHIS Online Tip Portal", url: "https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare", phone: null, desc: "Online form allows anonymous submission. For USDA-licensed facilities.", anon: true },
  { name: "ProtonMail (Anonymous Email)", url: "https://proton.me", phone: null, desc: "End-to-end encrypted email. Create from public Wi-Fi for maximum anonymity.", anon: false },
  { name: "Signal (Anonymous Messaging)", url: "https://signal.org", phone: null, desc: "Encrypted messaging. Use for communicating with journalists or ALDF attorneys confidentially.", anon: false },
];

const SAFETY_CHECKLIST: { id: string; text: string; level: "all" | "medium" | "high" }[] = [
  { id: "s1", text: "I am using a device not connected to my home network", level: "medium" },
  { id: "s2", text: "I am using an incognito / private browser window", level: "medium" },
  { id: "s3", text: "I have not logged into any personal accounts on this browser session", level: "medium" },
  { id: "s4", text: "I am using a throwaway email address (ProtonMail or similar)", level: "high" },
  { id: "s5", text: "I have not included identifying personal details in my report", level: "all" },
  { id: "s6", text: "I have not shared my intent to file with others who could be subpoenaed", level: "high" },
  { id: "s7", text: "My photos or videos were taken from public property or with consent", level: "all" },
  { id: "s8", text: "I have not referenced my relationship to the subject (neighbor, coworker, etc.)", level: "medium" },
  { id: "s9", text: "I am using a channel that explicitly accepts anonymous reports", level: "high" },
  { id: "s10", text: "I understand that anonymous reports may limit the agency's ability to follow up with me", level: "all" },
];

const AG_GAG_STATES = [
  { state: "Alabama", status: "Law passed", note: "Agricultural facilities" },
  { state: "Arkansas", status: "Law passed", note: "Agricultural facilities" },
  { state: "Iowa", status: "Struck down", note: "Federal court struck down ag-gag law in 2021" },
  { state: "Kansas", status: "Law passed", note: "Agricultural facilities" },
  { state: "Missouri", status: "Struck down", note: "8th Circuit struck down in 2021" },
  { state: "Montana", status: "Law passed", note: "Agricultural facilities" },
  { state: "North Carolina", status: "Struck down", note: "Federal court struck down in 2020" },
  { state: "North Dakota", status: "Law passed", note: "Agricultural facilities" },
  { state: "Utah", status: "Law passed", note: "Agricultural facilities" },
  { state: "Wyoming", status: "Struck down", note: "Federal court struck down in 2018" },
];

export default function AnonymousTips() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [filterLevel, setFilterLevel] = useState<"all" | "medium" | "high">("all");
  const [openLaw, setOpenLaw] = useState<string | null>(null);
  const [showAgGag, setShowAgGag] = useState(false);

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const filteredChecklist = SAFETY_CHECKLIST.filter(
    (i) => filterLevel === "all" || i.level === filterLevel || i.level === "all"
  );

  const checkedCount = filteredChecklist.filter((i) => checked[i.id]).length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/35 bg-[#970CDA]/8 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Shield className="w-3.5 h-3.5" />
            Anonymous Reporting Safety
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Report Safely.<br />
            <span className="text-[#47CC5E]">Know Your Protections.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Fear of retaliation prevents many people from reporting animal welfare concerns. A practical guide to the three levels of reporting safety, your legal protections, and the channels that protect your identity.
          </p>
        </div>

        {/* Safety level cards */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Choose Your Safety Level</p>
          <div className="grid md:grid-cols-3 gap-4">
            {SAFETY_LEVELS.map((level) => (
              <div key={level.level} className={`rounded-2xl p-5 border ${level.bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className={`w-4 h-4 ${level.color}`} />
                  <span className={`text-xs font-black uppercase tracking-wider ${level.color}`}>{level.level}</span>
                </div>
                <p className="text-white font-black text-sm mb-2">{level.label}</p>
                <p className="text-white/50 text-xs mb-4 leading-relaxed">{level.desc}</p>
                <div className="flex flex-col gap-2">
                  {level.steps.map((step, i) => (
                    <div key={i} className="flex gap-2">
                      <span className={`text-xs font-black shrink-0 ${level.color}`}>{i + 1}.</span>
                      <p className="text-white/60 text-xs leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety checklist */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-white font-black text-sm">Pre-Submission Safety Checklist</p>
              <p className="text-white/35 text-xs mt-0.5">{checkedCount}/{filteredChecklist.length} items confirmed</p>
            </div>
            <div className="flex gap-1.5">
              {(["all", "medium", "high"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setFilterLevel(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all ${
                    filterLevel === l
                      ? "bg-[#970CDA]/20 border-[#970CDA]/40 text-[#c060ff]"
                      : "bg-white/5 border-white/10 text-white/35 hover:text-white"
                  }`}
                >
                  {l === "all" ? "All Reports" : l === "medium" ? "Reduced ID" : "Anonymous"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {filteredChecklist.map((item) => (
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

        {/* Anonymous channels */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Channels That Accept Anonymous Reports</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {ANONYMOUS_CHANNELS.map((c) => (
              <div key={c.name} className="bg-white/4 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-white font-black text-sm flex-1">{c.name}</p>
                  {c.anon && (
                    <span className="px-2 py-0.5 rounded-full bg-[#47CC5E]/15 border border-[#47CC5E]/30 text-[#47CC5E] text-xs font-black">Anonymous</span>
                  )}
                </div>
                <p className="text-white/50 text-xs mb-3 leading-relaxed">{c.desc}</p>
                <div className="flex flex-wrap gap-3">
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                      <ExternalLink className="w-3 h-3" /> Open
                    </a>
                  )}
                  {c.phone && (
                    <span className="text-white/45 text-xs font-bold">{c.phone}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal protections */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Your Legal Protections</p>
          <div className="flex flex-col gap-2">
            {LEGAL_PROTECTIONS.map((law) => {
              const isOpen = openLaw === law.title;
              return (
                <div key={law.title} className={`rounded-2xl border overflow-hidden ${law.warning ? "border-[#970CDA]/20 bg-[#970CDA]/6" : "border-white/10 bg-white/4"}`}>
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenLaw(isOpen ? null : law.title)}>
                    <div className="flex items-center gap-2">
                      {law.warning && <AlertTriangle className="w-4 h-4 text-[#c060ff]" />}
                      <p className="text-white font-black text-sm">{law.title}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-4 pt-3">
                      <p className="text-white/60 text-sm leading-relaxed mb-2">{law.body}</p>
                      <p className="text-white/35 text-xs"><span className="text-white/50 font-bold">Applies to:</span> {law.applicable}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ag-gag laws */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowAgGag((v) => !v)}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#c060ff]" />
                <p className="text-white font-black text-base">Ag-Gag Laws — States to Know</p>
              </div>
              <p className="text-white/40 text-sm">Know before recording on agricultural property</p>
            </div>
            {showAgGag ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showAgGag && (
            <div className="border-t border-white/8 px-5 pb-5 pt-3">
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Ag-gag laws criminalize recording at agricultural facilities without consent. Several have been struck down as unconstitutional, but some remain in force. Always check current status with ALDF before recording on agricultural property.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {AG_GAG_STATES.map((s) => (
                  <div key={s.state} className="flex gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
                    <span className="text-white/60 font-black text-xs w-24 shrink-0">{s.state}</span>
                    <span className={`text-xs font-bold shrink-0 ${s.status === "Struck down" ? "text-[#47CC5E]" : "text-[#c060ff]"}`}>{s.status}</span>
                    <p className="text-white/35 text-xs leading-snug">{s.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/25 text-xs mt-3">Consult ALDF (aldf.org) for current legal status before recording on any agricultural property.</p>
            </div>
          )}
        </div>

        {/* If you receive a legal threat */}
        <div className="bg-[#47CC5E]/8 border border-[#47CC5E]/18 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#47CC5E]" />
            <p className="text-white font-black text-sm">If you receive a legal threat after filing a report</p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Legal threats (cease-and-desist letters, threats of lawsuit) in response to good-faith animal welfare reports are often unfounded SLAPP suits designed to silence you. Do not respond without legal counsel.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="https://aldf.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Contact ALDF
            </a>
            <a href="https://www.rcfp.org/resources/anti-slapp-statutes/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/8 border border-white/14 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Anti-SLAPP Resources
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
