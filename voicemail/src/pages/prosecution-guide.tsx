import { useState, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Scale, CheckSquare, Square, Copy, Download, CheckCircle2,
  ChevronDown, ChevronUp, FileText, Users, Briefcase, AlertTriangle
} from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  detail?: string;
}

interface CheckSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: CheckItem[];
}

const PRE_TRIAL_CHECKLIST: CheckSection[] = [
  {
    title: "Evidence Package",
    icon: <Briefcase className="w-4 h-4" />,
    color: "text-[#47CC5E]",
    items: [
      { id: "e1", label: "All photographs and videos organized chronologically", detail: "Date/time metadata intact, each file labeled with date, time, and location." },
      { id: "e2", label: "Chain of Custody document completed and signed", detail: "Document who collected, transferred, and stored each piece of evidence. Use VoiceMap Evidence Vault to generate this." },
      { id: "e3", label: "Veterinary forensic evaluation obtained", detail: "A licensed vet's written assessment linking injuries to alleged abuse carries significant weight with prosecutors and judges." },
      { id: "e4", label: "Physical evidence preserved properly", detail: "Physical items (collars, containers, instruments) stored in sealed evidence bags with labels and chain of custody tags." },
      { id: "e5", label: "Social media evidence documented with URL and screenshot", detail: "Use a screen recording tool to capture video posts. Archive.org can preserve web pages. Metadata from posts can be subpoenaed." },
      { id: "e6", label: "Surveillance footage requested and preserved", detail: "Contact businesses/residences near the incident for footage. Footage is typically overwritten in 30 days — act immediately." },
    ],
  },
  {
    title: "Witness Preparation",
    icon: <Users className="w-4 h-4" />,
    color: "text-[#c060ff]",
    items: [
      { id: "w1", label: "All eyewitness names, contact info, and statements collected", detail: "Written statements are stronger than verbal. Use VoiceMap Witness Statement Builder." },
      { id: "w2", label: "Each witness has reviewed their written statement for accuracy", detail: "Inconsistencies between written statements and in-court testimony are exploited by defense attorneys." },
      { id: "w3", label: "Expert witnesses identified (vet, forensic expert, behaviorist)", detail: "Expert testimony is often decisive in cruelty cases. Contact ALDF for expert witness referrals." },
      { id: "w4", label: "Witnesses briefed on courtroom procedure", detail: "Many civilian witnesses have never testified. Walk them through what to expect: oath, examination, cross-examination." },
      { id: "w5", label: "Witness availability confirmed for trial date", detail: "Witnesses who cannot appear may be able to provide video testimony — confirm with the prosecutor." },
    ],
  },
  {
    title: "Working With the Prosecutor",
    icon: <Scale className="w-4 h-4" />,
    color: "text-[#47CC5E]",
    items: [
      { id: "p1", label: "Case summary delivered to prosecutor before first meeting", detail: "A well-organized case summary shows professionalism and makes the prosecutor's job easier. Use VoiceMap Case Summary Generator." },
      { id: "p2", label: "All evidence listed with brief descriptions provided to ADA", detail: "Prosecutors need an itemized evidence list to organize their case. Provide one even if not asked." },
      { id: "p3", label: "Prior incidents and agency non-response documented for pattern argument", detail: "Pattern evidence is critical for felony charges and sentencing recommendations." },
      { id: "p4", label: "Request meeting with prosecutor before trial to review case", detail: "Ask once — do not pester. Confirm you have additional evidence available if needed." },
      { id: "p5", label: "Prosecutor has contact info for all witnesses and experts", detail: "Ensure the prosecutor can reach every witness directly. Do not be the sole intermediary." },
      { id: "p6", label: "Requested updates on charges, plea negotiations, and trial date", detail: "As a victim advocate you may have standing to be notified of hearings. Check with the DA's victim-witness advocate office." },
    ],
  },
  {
    title: "Victim Impact & Sentencing",
    icon: <FileText className="w-4 h-4" />,
    color: "text-[#c060ff]",
    items: [
      { id: "v1", label: "Victim impact statement written and reviewed by prosecutor", detail: "Most states allow victim impact statements in animal cruelty cases. Check your state's rules with the prosecutor." },
      { id: "v2", label: "Requested maximum penalty and specific conditions in sentencing", detail: "Recommend: prohibition from owning animals, psychological counseling, community service at a shelter, restitution for vet bills." },
      { id: "v3", label: "Prepared to address the court if permitted", detail: "Contact the prosecutor to confirm whether victim advocates may address the court at sentencing." },
      { id: "v4", label: "Post-conviction monitoring plan in place", detail: "Convictions with animal ownership bans require monitoring. Plan to alert authorities if the convicted party acquires animals." },
    ],
  },
];

const TESTIMONY_TEMPLATES = [
  {
    id: "impact",
    label: "Victim Impact Statement",
    description: "A formal statement for the court record at sentencing, describing the impact of the alleged cruelty.",
    template: `VICTIM IMPACT STATEMENT
Submitted to: [Court Name], [County], [State]
Case Number: [Case Number]
Defendant: [Defendant Name]
Date: [Date]

Your Honor,

I am submitting this statement as a concerned citizen who directly documented the alleged harm to [Animal Name / description of animal] on [Date of incident].

WHAT I WITNESSED
On [date], at [location], I observed the following, which I am reporting as a matter of public concern requiring the Court's consideration: [Describe what you observed using factual, careful language — avoid emotional characterizations; stick to observable facts].

DOCUMENTED IMPACT
The reported condition of the animal indicated: [Injuries documented / distress observed / condition noted by vet]. [Reference any veterinary assessments].

PRIOR DOCUMENTATION
This case involved: [number of prior reports / agency contacts / timeline of non-response]. Documentation was maintained throughout and is available to the Court upon request.

SENTENCING RECOMMENDATION
With respect, I request the Court consider the following conditions as part of any sentence:
- Prohibition from owning or residing with animals for a specified period or lifetime
- Mandatory psychological evaluation and counseling
- Restitution to cover veterinary care costs
- Community service at a licensed animal welfare organization

I believe these conditions reflect both accountability and the goal of preventing future harm to animals.

Respectfully submitted,
[Your Name]
[Your Contact Information — optional]`,
  },
  {
    id: "eyewitness",
    label: "Eyewitness Testimony Outline",
    description: "A structured outline to organize your direct observation testimony for court.",
    template: `EYEWITNESS TESTIMONY OUTLINE
Prepared for: [Case Name / Number]
Witness Name: [Your Name]
Testimony Date: [Date]
Court: [Court Name], [County], [State]

OVERVIEW
I am [name], and I am appearing today to describe my direct observations related to the reported welfare concerns involving [animal / species / name if known] on [date(s)].

ESTABLISHING PRESENCE
On [date] at approximately [time], I was at [location] when I observed [description of how you came to witness the incident — be specific about your vantage point and distance].

WHAT I OBSERVED (Chronological)
1. [First observation — describe factually]
2. [Second observation]
3. [Additional observations]

DOCUMENTATION I TOOK
- [Number] photographs taken at [time]
- [Video footage description]
- Written notes made at [time]
- These items have been preserved and provided to [prosecutor / agency]

FOLLOW-UP ACTIONS
Following my observations, I: [Describe exactly what you did — called 911, contacted animal control, etc.]

I am prepared to provide any additional documentation to the Court upon request.`,
  },
  {
    id: "character",
    label: "Pattern of Conduct Statement",
    description: "Documents a repeated pattern of alleged concern to support felony-level charges or repeat offender arguments.",
    template: `PATTERN OF CONDUCT DOCUMENTATION
Submitted To: [Prosecutor Name], [Office]
Case: [Case Name / Number]
Prepared by: [Your Name / Organization]
Date: [Date]

PURPOSE
This document provides a chronological summary of multiple reported concerns and agency contacts related to [location / facility / individual] to support the argument that the alleged conduct represents a pattern, not an isolated incident.

INCIDENT CHRONOLOGY

[Incident 1]
Date: [Date]
Reported to: [Agency]
Summary: [Brief factual description]
Agency response: [What happened]

[Incident 2]
Date: [Date]
Reported to: [Agency]
Summary: [Brief factual description]
Agency response: [What happened]

[Add additional incidents as needed]

NON-RESPONSE RECORD
The following agencies received reports and either did not respond within the statutory timeframe or did not take documented action: [List agencies, dates contacted, and response received].

CONCLUSION
The above timeline documents [X] reported concerns over [timeframe], establishing a pattern that this office may wish to present to the Court in support of enhanced charges or sentencing recommendations.

All underlying documentation (photographs, agency correspondence, witness statements, veterinary reports) is available for the Court's review.

Respectfully,
[Your Name]
[Contact Information]`,
  },
];

const PROSECUTION_TIPS = [
  {
    title: "Do not contact the prosecutor more than once without an invitation",
    body: "Prosecutors carry enormous caseloads. A thorough case summary submitted before your first contact is far more effective than multiple follow-up calls. Let the evidence speak.",
  },
  {
    title: "Work with the victim-witness advocate in the DA's office",
    body: "Every district attorney's office has a victim-witness advocate. This person can tell you your rights as an advocate, keep you informed of hearing dates, and advise on victim impact statements.",
  },
  {
    title: "Expert veterinary testimony is often decisive",
    body: "Defense attorneys frequently argue an animal's condition was pre-existing or had another cause. A licensed vet or veterinary forensic specialist who can testify about the specific mechanism of injury is invaluable. Contact ALDF for expert witness referrals.",
  },
  {
    title: "Social media is admissible but must be properly documented",
    body: "Posts, videos, and photos on social media are admissible evidence but must be captured with full metadata. Use archive tools and ensure the URL, date, and poster information are documented at the time of capture. Platforms can delete content.",
  },
  {
    title: "Request specific sentencing conditions — not just a fine",
    body: "Fines are often inadequate deterrents. Push for: lifetime or long-term animal ownership bans, mandatory psychological evaluation, restitution to cover vet costs, and community service at a shelter. These conditions must be requested — they are rarely offered by default.",
  },
  {
    title: "Monitor compliance with animal ownership bans post-conviction",
    body: "A conviction with an ownership ban is only effective if it is enforced. Plan to check periodically whether the convicted individual acquires animals. If they do, report it to the probation officer or DA's office immediately — it is a probation violation.",
  },
];

type CheckedState = Record<string, boolean>;

export default function ProsecutionGuide() {
  const [checked, setChecked] = useState<CheckedState>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openTemplate, setOpenTemplate] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalItems = PRE_TRIAL_CHECKLIST.flatMap((s) => s.items).length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((checkedCount / totalItems) * 100);

  const copyTemplate = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const downloadTemplate = (label: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.replace(/\s+/g, "_")}_VoiceMap.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <Scale className="w-3.5 h-3.5" />
            Court & Prosecution Support
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            When the Case<br />
            <span className="text-[#47CC5E]">Goes to Court.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            A pre-trial readiness checklist, testimony templates, and step-by-step guidance for supporting prosecutors — so the evidence you documented translates into accountability.
          </p>
        </div>

        {/* Progress tracker */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-black text-sm">Pre-Trial Readiness</p>
            <p className="text-[#47CC5E] font-black text-sm">{checkedCount} / {totalItems} items complete</p>
          </div>
          <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#47CC5E] to-[#970CDA] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct === 100 && (
            <p className="text-[#47CC5E] font-black text-xs mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> All items checked — your evidence package is court-ready.
            </p>
          )}
          {pct > 0 && pct < 100 && (
            <p className="text-white/35 text-xs mt-2">{100 - pct}% remaining. Checklist is saved in your browser session.</p>
          )}
        </div>

        {/* Checklist */}
        <div className="mb-10">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Pre-Trial Checklist</p>
          <div className="flex flex-col gap-3">
            {PRE_TRIAL_CHECKLIST.map((section) => {
              const sectionChecked = section.items.filter((i) => checked[i.id]).length;
              const isOpen = openSection === section.title;
              return (
                <div key={section.title} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenSection(isOpen ? null : section.title)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={section.color}>{section.icon}</span>
                      <p className="text-white font-black text-sm">{section.title}</p>
                      <span className={`text-xs font-black ${sectionChecked === section.items.length ? "text-[#47CC5E]" : "text-white/30"}`}>
                        {sectionChecked}/{section.items.length}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/35" /> : <ChevronDown className="w-4 h-4 text-white/35" />}
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-4 pt-2 flex flex-col gap-2">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          className="flex items-start gap-3 text-left p-3 rounded-xl hover:bg-white/5 transition-all group"
                          onClick={() => toggle(item.id)}
                        >
                          {checked[item.id]
                            ? <CheckSquare className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" />
                            : <Square className="w-4 h-4 text-white/25 shrink-0 mt-0.5 group-hover:text-white/45" />
                          }
                          <div>
                            <p className={`text-sm font-bold leading-snug ${checked[item.id] ? "text-white/50 line-through" : "text-white/80"}`}>
                              {item.label}
                            </p>
                            {item.detail && (
                              <p className="text-white/35 text-xs leading-relaxed mt-1">{item.detail}</p>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimony templates */}
        <div className="mb-10">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Testimony Templates</p>
          <div className="flex flex-col gap-3">
            {TESTIMONY_TEMPLATES.map((t) => {
              const isOpen = openTemplate === t.id;
              return (
                <div key={t.id} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenTemplate(isOpen ? null : t.id)}
                  >
                    <div>
                      <p className="text-white font-black text-sm">{t.label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{t.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#c060ff] shrink-0" />
                      {isOpen ? <ChevronUp className="w-4 h-4 text-white/35" /> : <ChevronDown className="w-4 h-4 text-white/35" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-5 pt-4">
                      <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto mb-3">
                        {t.template}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyTemplate(t.id, t.template)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
                        >
                          {copiedId === t.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === t.id ? "Copied!" : "Copy Template"}
                        </button>
                        <button
                          onClick={() => downloadTemplate(t.label, t.template)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expert tips */}
        <div className="mb-10">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">What experienced advocates know</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROSECUTION_TIPS.map((tip) => (
              <div key={tip.title} className="bg-white/4 border border-white/10 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-black text-sm mb-1">{tip.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Prepare your case with these tools</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Case Summary Generator", href: "/case-summary", desc: "Compile all evidence into a single case file for the prosecutor" },
              { label: "Evidence Vault", href: "/evidence-vault", desc: "Organize evidence and generate a Chain of Custody document" },
              { label: "Agency Response Tracker", href: "/agency-tracker", desc: "Document all agency contacts and non-responses for pattern evidence" },
            ].map((tool) => (
              <a key={tool.href} href={tool.href} className="group flex flex-col gap-2 p-4 rounded-xl bg-white/4 border border-white/8 hover:border-white/16 hover:bg-white/6 transition-all">
                <p className="text-[#47CC5E] font-black text-sm group-hover:text-[#5adb70] transition-colors">{tool.label}</p>
                <p className="text-white/40 text-xs leading-snug">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 px-4 py-3 rounded-xl bg-white/3 border border-white/8 flex items-start gap-3">
          <Scale className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
          <p className="text-white/30 text-xs leading-relaxed">
            This guide is for informational purposes only and does not constitute legal advice. For legal counsel, contact the Animal Legal Defense Fund or consult an attorney licensed in your state. All case information should be reviewed by a licensed attorney before submission to a court.
          </p>
        </div>
      </main>
    </div>
  );
}
