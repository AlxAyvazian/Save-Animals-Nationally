import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  ShieldAlert, Clock, Copy, Download, CheckCircle2,
  ChevronDown, ChevronUp, ExternalLink, AlertTriangle, Search
} from "lucide-react";

const HOUR24_STEPS = [
  {
    time: "Within 1 Hour",
    title: "File a police report immediately",
    body: "Pet theft is a crime in all 50 states. Call your local non-emergency police line (or 911 if the theft was witnessed). Request a case number. Without a police report, shelters and rescues have no legal basis to hold the animal.",
    action: "Call local police non-emergency line. Request a case number. Specify: 'theft of personal property' (your pet).",
    urgent: true,
  },
  {
    time: "Within 1 Hour",
    title: "Scan every microchip registry",
    body: "Check AAHA Universal Pet Microchip Lookup, PetMicrochipLookup.org, and Found Animals Registry. If your pet was found and scanned, their data may already be in a database. Some thieves sell pets to research labs — registries flag institutional microchip scans.",
    action: "Go to www.petmicrochiplookup.org and enter your chip number immediately.",
    urgent: true,
  },
  {
    time: "Within 2 Hours",
    title: "Post to all neighborhood and lost pet platforms",
    body: "Nextdoor, Ring/Neighbors app, Facebook Lost & Found Animals groups, Craigslist (Pets Lost & Found), PawBoost, Fidofinder. Include a clear photo, your phone number, the police report case number, and a note that this is an alleged theft.",
    action: "Use a photo taken within the last 6 months. Include any distinctive markings.",
  },
  {
    time: "Within 2 Hours",
    title: "Contact all shelters within 50 miles",
    body: "Call every shelter within 50 miles. Give them your pet's microchip number, your police report case number, and a physical description. Ask to be called if any animal matching the description is brought in. Thieves often surrender animals to shelters.",
    action: "Call, don't just submit online. Ask to speak with an intake coordinator. Give your police report case number.",
  },
  {
    time: "Within 4 Hours",
    title: "Review all available security footage",
    body: "Ask neighbors, businesses, and HOAs about security cameras near the theft location. Footage is typically overwritten in 30–72 hours. If you identify a suspect vehicle or person, provide this to police immediately with the timestamp.",
    action: "Knock on doors within a 2-block radius. Ask businesses for their camera contact person.",
  },
  {
    time: "Day 1",
    title: "Post flyers — physical and digital",
    body: "Print flyers with a large photo, 'STOLEN' (not 'LOST'), your contact number, police report number, and reward amount if applicable. Post within a 5-mile radius at vet offices, pet stores, groomers, dog parks, and shelters.",
    action: "Do NOT post your home address on flyers. Use a phone number only.",
  },
];

const REGISTRIES = [
  { name: "AAHA Universal Pet Microchip Lookup", url: "https://www.petmicrochiplookup.org", desc: "Searches all major microchip registries in one search." },
  { name: "PetMicrochipLookup.org", url: "https://www.petmicrochiplookup.org", desc: "Universal lookup tool — AAHA-supported." },
  { name: "Found Animals Registry", url: "https://www.foundanimals.org/microchip-registry/", desc: "Free microchip registration. If registered here, found animal reports are sent to you." },
  { name: "AKC Reunite", url: "https://www.akcreunite.org", desc: "AKC's microchip registry with 24/7 monitoring." },
  { name: "HomeAgain", url: "https://www.homeagain.com", desc: "Major national microchip registry." },
  { name: "24PetWatch", url: "https://www.24petwatch.com", desc: "24/7 lost pet reporting and microchip registry." },
];

const SEARCH_PLATFORMS = [
  { name: "PawBoost", url: "https://www.pawboost.com", desc: "Largest lost/found pet social network. Posts auto-distributed to local Facebook groups." },
  { name: "Nextdoor", url: "https://nextdoor.com", desc: "Neighborhood platform — critical for local reach. Post in your neighborhood and adjacent ones." },
  { name: "Fidofinder", url: "https://www.fidofinder.com", desc: "National lost/found pet database with email alerts to shelter staff." },
  { name: "Ring Neighbors App", url: "https://ring.com/neighbors", desc: "Share security footage and alerts through the Ring/Neighbors network." },
  { name: "Petfinder Lost Pet", url: "https://www.petfinder.com/lost-and-found/", desc: "Post to Petfinder's lost pet board — visible to shelter staff across the country." },
  { name: "Missing Pet Partnership", url: "https://missingpetpartnership.org", desc: "Evidence-based lost pet recovery guides and professional lost pet search resources." },
];

const STATE_LAWS_NOTES = [
  { state: "All 50 States", note: "Pet theft is a crime in all 50 US states — classified as theft of personal property. Felony threshold varies by state (typically based on the animal's assessed value)." },
  { state: "California", note: "Penal Code § 487 — Grand theft if value over $950. Pet theft can be charged as grand theft if the pet's assessed value exceeds this threshold." },
  { state: "New York", note: "Penal Code § 155.05 — Classified as larceny. NY has specific provisions for theft of companion animals." },
  { state: "Texas", note: "Penal Code § 31.03 — Theft. Felony if value exceeds $2,500. Documented breeding animals, show animals, or microchipped registered pets often exceed this threshold." },
  { state: "Florida", note: "FS § 812.014 — Theft. Third-degree felony if value over $750. Keep vet records showing the animal's assessed value." },
  { state: "Illinois", note: "720 ILCS 5/16-1 — Theft. Class 4 felony if value over $500. Illinois has strong companion animal protections." },
];

function buildPoliceReport(form: {
  animalName: string; species: string; breed: string; color: string;
  chipId: string; dateMissing: string; location: string;
  lastSeen: string; suspectDesc: string; witnessInfo: string;
}): string {
  return `PET THEFT REPORT
Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Source: VoiceMap National Animal Protection Portal

ANIMAL DESCRIPTION
Name: ${form.animalName}
Species: ${form.species}
Breed: ${form.breed}
Color/Markings: ${form.color}
Microchip ID: ${form.chipId || "Unknown"}

INCIDENT DETAILS
Date/Time Animal Last Seen: ${form.dateMissing}
Last Known Location: ${form.location}
Circumstances of Disappearance: ${form.lastSeen}

SUSPECT / WITNESS INFORMATION
Suspect Description: ${form.suspectDesc || "Unknown"}
Witness Information: ${form.witnessInfo || "None"}

REQUESTED ACTIONS
1. Issue a police report case number for theft of personal property
2. Distribute description to all shelters in [County/City] county
3. Alert any vehicle involved to traffic camera systems if applicable
4. Document report for future insurance or legal claims

OWNER CERTIFICATION
I certify that this animal is my registered companion animal. I have/will provide:
[ ] Microchip registration documentation
[ ] Veterinary records
[ ] Purchase or adoption records
[ ] Photographs

Contact: [Your Name] | [Your Phone Number]
Case Reference: [Assigned Case Number]

Generated by VoiceMap National Animal Protection Portal`;
}

export default function PetTheft() {
  const [showLaws, setShowLaws] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    animalName: "", species: "Dog", breed: "", color: "",
    chipId: "", dateMissing: new Date().toISOString().split("T")[0],
    location: "", lastSeen: "", suspectDesc: "", witnessInfo: "",
  });
  const [copied, setCopied] = useState(false);

  const report = buildPoliceReport(form);

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
    a.download = `PetTheft_Report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-6 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/8 text-white text-xs font-black uppercase tracking-widest mb-5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Pet Theft &amp; Recovery
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Your Pet Was Stolen.<br />
            <span className="text-[#47CC5E]">Act Fast. Here&apos;s How.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Pet theft recovery success drops sharply after 24 hours. A step-by-step first-response guide, microchip registry checklist, platform list, and police report generator.
          </p>
        </div>

        {/* Urgent notice */}
        <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-white/6 border border-white/18 mb-8">
          <AlertTriangle className="w-5 h-5 text-white/80 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-black text-sm">Pet theft is a crime. File a police report today.</p>
            <p className="text-white/50 text-xs mt-0.5">Without a police report, shelters cannot legally hold your animal for you, and microchip disputes cannot be resolved in your favor. Do this before anything else.</p>
          </div>
        </div>

        {/* 24-hour timeline */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">First 24 Hours — What to Do</p>
          <div className="flex flex-col gap-3">
            {HOUR24_STEPS.map((step, i) => (
              <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${step.urgent ? "bg-white/6 border-white/18" : "bg-white/3 border-white/8"}`}>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${step.urgent ? "bg-white/12 text-white" : "bg-white/6 text-white/50"}`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs font-black leading-tight text-center ${step.urgent ? "text-[#47CC5E]" : "text-white/30"}`} style={{ writingMode: "horizontal-tb" }}>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-black text-sm">{step.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${step.urgent ? "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30" : "bg-white/6 text-white/30 border-white/10"}`}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed mb-2">{step.body}</p>
                  <div className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <Clock className="w-3.5 h-3.5 text-[#47CC5E] shrink-0 mt-0.5" />
                    <p className="text-[#47CC5E] text-xs font-bold leading-relaxed">{step.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Microchip registries */}
        <div className="mb-6">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Microchip Registries to Check</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REGISTRIES.map((r) => (
              <div key={r.name} className="bg-white/4 border border-white/10 rounded-2xl p-4">
                <p className="text-white font-black text-sm mb-1">{r.name}</p>
                <p className="text-white/45 text-xs mb-3 leading-snug">{r.desc}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                  <ExternalLink className="w-3 h-3" /> Check Registry
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Search platforms */}
        <div className="mb-6">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Where to Post</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SEARCH_PLATFORMS.map((p) => (
              <div key={p.name} className="bg-white/4 border border-white/10 rounded-2xl p-4">
                <p className="text-white font-black text-sm mb-1">{p.name}</p>
                <p className="text-white/45 text-xs mb-3 leading-snug">{p.desc}</p>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                  <ExternalLink className="w-3 h-3" /> Open Platform
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* State laws */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowLaws((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">Pet Theft Laws — State Notes</p>
              <p className="text-white/40 text-sm mt-0.5">Pet theft is a crime in all 50 states. Felony thresholds vary.</p>
            </div>
            {showLaws ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>
          {showLaws && (
            <div className="border-t border-white/8 px-5 pb-5 pt-3 flex flex-col gap-2">
              {STATE_LAWS_NOTES.map((s) => (
                <div key={s.state} className="flex gap-3 px-3 py-2.5 bg-white/3 border border-white/6 rounded-xl">
                  <span className="text-[#47CC5E] font-black text-xs w-20 shrink-0">{s.state}</span>
                  <p className="text-white/55 text-xs leading-relaxed">{s.note}</p>
                </div>
              ))}
              <p className="text-white/25 text-xs mt-2">This is general information only. Consult an attorney for case-specific legal advice.</p>
            </div>
          )}
        </div>

        {/* Police report generator */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setShowForm((v) => !v)}>
            <div>
              <p className="text-white font-black text-base">Police Report Generator</p>
              <p className="text-white/40 text-sm mt-0.5">Generate a formatted theft report document for law enforcement</p>
            </div>
            {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
          </button>

          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  ["animalName", "Animal's Name", "text"],
                  ["species", "Species", "text"],
                  ["breed", "Breed", "text"],
                  ["color", "Color / Distinctive Markings", "text"],
                  ["chipId", "Microchip ID (if known)", "text"],
                  ["dateMissing", "Date Last Seen", "date"],
                  ["location", "Location where stolen", "text"],
                ] as [keyof typeof form, string, string][]).map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <input
                      type={type}
                      className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                {([
                  ["lastSeen", "Circumstances of disappearance"],
                  ["suspectDesc", "Suspect description (if known)"],
                  ["witnessInfo", "Witness information"],
                ] as [keyof typeof form, string][]).map(([key, label]) => (
                  <div key={key} className="sm:col-span-2">
                    <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <textarea
                      rows={2}
                      className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/55 leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto mb-3">
                {report}
              </div>
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

        {/* If not recovered */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">If the animal is not recovered after 2 weeks</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Expand your search radius", body: "Animals sold to buyers are often relocated 50–200 miles away. Expand social media posts and flyer distribution to neighboring counties and states." },
              { title: "Check online resale listings", body: "Monitor Craigslist, Facebook Marketplace, and OfferUp for animals matching your pet's description. Stolen animals are often listed for sale within 48 hours." },
              { title: "Contact your state attorney general", body: "If local law enforcement is not pursuing the case, file a complaint with your state AG's office. Organized pet theft rings are prosecuted at the state level." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E] mt-2 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/45 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
