import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Phone, FileText, ShieldAlert, AlertTriangle, CheckCircle2, Clock, ChevronDown, ChevronUp, ExternalLink, Siren } from "lucide-react";

const HOTLINES = [
  { name: "ASPCA Animal Poison Control", number: "1-888-426-4435", note: "24/7 — fee may apply" },
  { name: "HSUS Animal Cruelty Tip Line", number: "1-866-720-2676", note: "Mon–Fri 9am–5pm ET" },
  { name: "FBI Tip Line (felony cruelty)", number: "1-800-CALL-FBI", note: "Interstate / federal crimes" },
  { name: "USDA APHIS Animal Care", number: "1-844-820-2234", note: "Licensed facility cruelty" },
  { name: "National Emergency (all states)", number: "911", note: "Immediate danger to life" },
];

const TIERS = [
  {
    id: "immediate",
    level: "TIER 1",
    label: "Immediate Danger",
    sublabel: "Animal's life is at risk RIGHT NOW",
    color: "border-white/10 bg-white/5",
    badge: "bg-white/10 text-white",
    dot: "bg-[#47CC5E]",
    steps: [
      {
        step: "1",
        title: "Call 911 first",
        detail: "If you see an animal locked in a hot car, being actively beaten, or in life-threatening peril — emergency dispatch can send law enforcement with authority to act immediately. Give exact location, vehicle description or suspect description.",
      },
      {
        step: "2",
        title: "Do NOT put yourself in danger",
        detail: "Do not physically confront an abuser or enter private property. Stay visible, keep a safe distance, and act as a credible witness. Your safety is critical — a witness who survives can testify; an injured rescuer cannot.",
      },
      {
        step: "3",
        title: "Document continuously — photo, video, audio",
        detail: "Record from where you are standing. Capture: the animal's condition, surroundings, any visible injuries, the date/time (some phones auto-embed this), and the location. Say the address aloud on video. Do not stop recording until law enforcement arrives.",
      },
      {
        step: "4",
        title: "Call your local animal control",
        detail: "Animal Control has legal jurisdiction to enter properties, seize animals, and file charges. Give them your name, exact address, and what you are observing in real time. Ask for a case number before hanging up.",
      },
      {
        step: "5",
        title: "Get officer badge numbers & case number",
        detail: "When law enforcement arrives, note the responding officers' names and badge numbers. Obtain the incident/case number. This is essential for follow-up if the case is dropped or not pursued aggressively.",
      },
      {
        step: "6",
        title: "Document your own report in VoiceMap",
        detail: "File a formal report in the Intake tool so there is a verifiable timestamped record independent of official channels. This becomes crucial for escalation if the initial response is inadequate.",
      },
    ],
  },
  {
    id: "urgent",
    level: "TIER 2",
    label: "Urgent — Hours Matter",
    sublabel: "Neglect, starvation, exposure, or abandonment",
    color: "border-white/10 bg-white/5",
    badge: "bg-white/10 text-white",
    dot: "bg-[#47CC5E]",
    steps: [
      {
        step: "1",
        title: "Document everything before contacting anyone",
        detail: "Before you make a single call, photograph and video the animal from multiple angles. Capture the environment (no food, no water, inadequate shelter, extreme weather). Note the date, time, and GPS location. Evidence collected before authorities arrive is often the strongest.",
      },
      {
        step: "2",
        title: "File with local animal control — in writing",
        detail: "Call AND follow up with a written complaint (email or certified mail). Phone calls are often undocumented. Written complaints create a paper trail, trigger a legal obligation to respond, and make non-response visible for escalation.",
      },
      {
        step: "3",
        title: "Identify the correct jurisdiction",
        detail: "Use VoiceMap's Jurisdiction Helper to determine whether this is a municipal, county, state, or federal matter. Filing with the wrong agency wastes critical time and can give abusers cover. Different animals (livestock vs. companion animals vs. wildlife) have different enforcement chains.",
      },
      {
        step: "4",
        title: "Set a 72-hour follow-up deadline",
        detail: "If you receive no confirmation of investigation within 72 hours, escalate to the next level. Document the lack of response — it is itself evidence of systemic failure that becomes part of the escalation record.",
      },
      {
        step: "5",
        title: "Contact a rescue or humane society",
        detail: "While official channels process, contact local rescues who may be able to intervene faster or provide emergency foster placement. Use VoiceMap's Stray Tools → Foster Network Blast to reach rescue networks immediately.",
      },
    ],
  },
  {
    id: "ongoing",
    level: "TIER 3",
    label: "Ongoing / Systemic",
    sublabel: "Repeated cruelty, high-kill shelters, facility patterns",
    color: "border-white/10 bg-white/5",
    badge: "bg-white/10 text-white",
    dot: "bg-[#47CC5E]",
    steps: [
      {
        step: "1",
        title: "Build a timeline of documented incidents",
        detail: "Use VoiceMap's Dashboard to connect multiple incidents at the same location or by the same actor. Pattern documentation is the most powerful tool for compelling prosecutorial action — a single incident is easily dismissed; a documented pattern is not.",
      },
      {
        step: "2",
        title: "File a FOIA / public records request",
        detail: "Request euthanasia records, intake statistics, complaint history, and inspection reports from shelters and animal control agencies. Use VoiceMap's FOIA Generator to create a legally sound request letter. Agencies are legally required to respond.",
      },
      {
        step: "3",
        title: "Build your escalation chain",
        detail: "Escalate systematically: local AC → county sheriff → state AG → USDA APHIS / FBI → elected officials → media. Use VoiceMap's Escalation Chain Builder to track every level, date of contact, and response status.",
      },
      {
        step: "4",
        title: "Contact your state legislators",
        detail: "State legislators can compel agency action, request investigations, and introduce legislation. A documented report from a constituent carries significant weight. Use VoiceMap's Advocacy Toolkit to generate letters to your representatives.",
      },
      {
        step: "5",
        title: "Engage investigative media",
        detail: "Local TV investigative units and newspapers have legal powers (public records requests, doorstep journalism) that citizens do not. A credible documented case — with VoiceMap's timestamped report packet — gives journalists the hard evidence they need to publish.",
      },
    ],
  },
];

const LEGAL_NOTES = [
  {
    title: "When you CAN remove an animal",
    items: [
      "In most states, you may break a car window to rescue an animal from a hot vehicle if you believe death or serious harm is imminent — but you MUST call 911 first, stay at the scene, and only use force necessary to free the animal.",
      "Some states have explicit Good Samaritan statutes granting civil/criminal immunity for good-faith rescues from hot vehicles.",
      "If a law enforcement officer or animal control officer is present and directs you to assist — you may act under their authority.",
    ],
  },
  {
    title: "When you CANNOT remove an animal",
    items: [
      "You generally cannot enter private property without consent or a warrant, even if you believe an animal is suffering. Doing so may expose you to trespassing charges and could compromise any resulting criminal case.",
      "You cannot take an animal from its owner solely on your judgment that conditions are inadequate — that is the role of licensed animal control officers.",
      "Exception: If a law enforcement officer orders you to assist with a rescue, you are acting under their authority.",
    ],
  },
];

const EVIDENCE_CHECKLIST = [
  "Video with audio narrating what you observe",
  "Still photos from multiple angles",
  "Wide shot showing environment / context",
  "Close-up of injuries, body condition, wounds",
  "Food and water situation (empty bowls, none present)",
  "Shelter conditions (weather exposure, filth)",
  "GPS location or written address spoken aloud on video",
  "Date and time (phone timestamp or spoken on video)",
  "License plate or vehicle description (if relevant)",
  "Witness contact info (other bystanders)",
  "Your own name and phone number noted in footage",
];

export default function Emergency() {
  const [openTier, setOpenTier] = useState<string>("immediate");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [openLegal, setOpenLegal] = useState<string | null>(null);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="mb-8 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
          <Siren className="w-8 h-8 text-[#47CC5E] shrink-0 animate-pulse" />
          <div>
            <p className="text-white font-black text-base uppercase tracking-wider">Animal in Immediate Danger?</p>
            <p className="text-white/70 text-sm mt-0.5">Call <strong className="text-white">911</strong> first — then use this guide. Every second counts.</p>
          </div>
          <a
            href="tel:911"
            className="ml-auto shrink-0 px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-white font-black text-sm uppercase tracking-wider hover:bg-white/15 transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call 911
          </a>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-white/5 text-white/70 text-xs font-black uppercase tracking-widest mb-5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Emergency Response Protocol
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Act Fast.<br />
            <span className="text-[#47CC5E]">Act Right.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Step-by-step actions organized by urgency. Know your legal rights, what to document, and exactly who to call.
          </p>
        </div>

        <div className="mb-10">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-3">Emergency Hotlines</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {HOTLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#47CC5E]/15 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#47CC5E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-bold truncate">{h.name}</p>
                  <p className="text-[#47CC5E] text-xs font-black">{h.number}</p>
                </div>
                <span className="text-white/25 text-xs shrink-0 text-right">{h.note}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Response Tiers — Select Your Situation</p>
          <div className="flex flex-col gap-3">
            {TIERS.map((tier) => {
              const isOpen = openTier === tier.id;
              return (
                <div key={tier.id} className={`rounded-2xl border overflow-hidden ${tier.color}`}>
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenTier(isOpen ? "" : tier.id)}
                  >
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest shrink-0 ${tier.badge}`}>
                      {tier.level}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-black text-base">{tier.label}</p>
                      <p className="text-white/50 text-xs">{tier.sublabel}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/10">
                      {tier.steps.map((s) => (
                        <div key={s.step} className="flex gap-4 pt-4">
                          <div className="w-8 h-8 rounded-lg bg-[#47CC5E]/15 flex items-center justify-center text-[#47CC5E] font-black shrink-0">{s.step}</div>
                          <div>
                            <p className="text-white font-bold mb-1">{s.title}</p>
                            <p className="text-white/60 text-sm leading-relaxed">{s.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {LEGAL_NOTES.map((group) => {
            const isOpen = openLegal === group.title;
            return (
              <div key={group.title} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                <button className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left" onClick={() => setOpenLegal(isOpen ? null : group.title)}>
                  <div>
                    <p className="text-white font-black text-base">{group.title}</p>
                    <p className="text-white/45 text-xs mt-1">Legal boundaries for safe action</p>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/8 pt-4">
                    <ul className="space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm text-white/65 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-white font-black text-base">Evidence Checklist</p>
              <p className="text-white/45 text-sm mt-1">Check off what you’ve captured before escalating</p>
            </div>
            <FileText className="w-5 h-5 text-[#47CC5E]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {EVIDENCE_CHECKLIST.map((item) => {
              const active = checked.has(item);
              return (
                <button key={item} onClick={() => toggle(item)} className={`flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all ${active ? "bg-[#47CC5E]/12 border-[#47CC5E]/30" : "bg-white/4 border-white/10 hover:bg-white/6"}`}>
                  <span className={`w-4 h-4 rounded mt-0.5 shrink-0 ${active ? "bg-[#47CC5E]" : "border border-white/25"}`}></span>
                  <span className={`text-sm leading-relaxed ${active ? "text-white" : "text-white/70"}`}>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
