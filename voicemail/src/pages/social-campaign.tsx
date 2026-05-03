import { useState } from "react";
import { TOOLS_ITEMS } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import { Megaphone, Copy, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const CAMPAIGN_PHASES = [
  {
    phase: "Phase 1",
    title: "Document & Verify (Days 1–3)",
    desc: "Before going public, verify all facts. A retracted claim destroys credibility. Gather evidence, confirm dates, identify the agency of jurisdiction.",
    steps: [
      "Compile all documentation: photos, dates, agency responses (or lack thereof)",
      "Confirm the responsible agency and their complaint status",
      "Identify elected officials with oversight (city council, county supervisor)",
      "Find 2–3 local journalists who cover animal welfare or local government",
      "Do NOT post until you can answer: who, what, when, where, and what was done about it",
    ],
  },
  {
    phase: "Phase 2",
    title: "Activate Your Network (Days 3–5)",
    desc: "Seed the story with trusted advocates and local groups before going broad. Early shares from credible accounts establish legitimacy.",
    steps: [
      "Share with local rescue groups, shelters, and advocate networks first",
      "Ask them to share before the public launch — coordinated first-hour activity signals relevance to algorithms",
      "Identify local Facebook groups (neighborhood, pet, lost/found) where the post will be relevant",
      "Brief anyone who will be publicly commenting — consistent, calm, factual language",
      "Create a simple fact sheet document to share with anyone who asks questions",
    ],
  },
  {
    phase: "Phase 3",
    title: "Publish & Tag (Day 5+)",
    desc: "Post across all platforms simultaneously. Tag officials and agencies directly — it creates accountability and alerts them publicly.",
    steps: [
      "Post on Facebook, Instagram, Twitter/X, and Nextdoor at the same time",
      "Tag the responsible agency, the mayor/supervisor, and local news outlets",
      "Use a consistent hashtag across all platforms (see generator below)",
      "Pin a comment with your full documentation link (VoiceMap case export)",
      "Respond to all comments within 4 hours of posting — engagement drives reach",
    ],
  },
  {
    phase: "Phase 4",
    title: "Escalate & Sustain (Week 2+)",
    desc: "Most campaigns stall after the first post. Sustained, strategic repetition — not a single viral post — achieves results.",
    steps: [
      "Post an update every 3–5 days regardless of whether anything has changed",
      "'No response after 10 days' is itself newsworthy — document the silence",
      "Email the story to local TV news stations — animal welfare with video performs well in local news",
      "Ask your city councilmember to submit a formal inquiry to the agency",
      "Submit to HSUS, ASPCA, and ALDF social media teams if it is a high-impact case",
    ],
  },
];

const POST_TEMPLATES = {
  facebook: (form: PostForm) =>
    `A reported animal welfare concern at ${form.location || "[Location]"} requires investigation.

${form.situation || "[Brief description of the situation]"}

On ${form.reportDate || "[Date]"}, a formal complaint was filed with ${form.agency || "[Agency Name]"}. As of today, ${form.daysSince || "[X]"} days have passed with no documented inspection.

We are asking ${form.agency || "[Agency Name]"} to confirm that an inspection has been scheduled.

📋 Documentation available at: [VoiceMap Case Link]
📧 Contact ${form.agency || "[Agency]"}: ${form.agencyContact || "[Agency email or phone]"}

${form.hashtags || "#AnimalWelfare #[YourCity]"}`,

  twitter: (form: PostForm) =>
    `A reported animal welfare concern at ${form.location || "[Location]"} was filed with ${form.agency || "@[Agency]"} on ${form.reportDate || "[date]"}. ${form.daysSince || "X"} days — no inspection documented.

${form.hashtags || "#AnimalWelfare"} ${form.officialHandle || "@[Mayor or Official]"}`,

  email: (form: PostForm) =>
    `Subject: Request for Inspection Status — Animal Welfare Concern Filed ${form.reportDate || "[Date]"}

Dear ${form.agency || "[Agency Name]"},

On ${form.reportDate || "[Date]"}, a formal animal welfare complaint was filed regarding the situation at ${form.location || "[Location]"}. A case number of ${form.caseNum || "[Case Number or 'unassigned']"} was ${form.caseNum ? "assigned" : "not provided"}.

As of today, ${form.daysSince || "[X]"} days have passed. We are requesting:

1. Confirmation that an inspection has been scheduled
2. The expected inspection date
3. The name of the assigned investigator

This inquiry is being shared with elected officials and community stakeholders. We expect a response within 5 business days.

${form.situation ? `Summary of reported concern: ${form.situation}` : ""}

Respectfully,
[Your Name]
[Your Organization, if applicable]
[Phone / Email]`,
};

type PostForm = {
  location: string; situation: string; agency: string; agencyContact: string;
  officialHandle: string; reportDate: string; caseNum: string; daysSince: string;
  hashtags: string;
};

const HASHTAG_KEYWORDS = [
  "AnimalWelfare", "AnimalProtection", "ReportAnimalCruelty",
  "AnimalsNeedVoices", "SpeakUpForAnimals", "AnimalAdvocacy",
];

export default function SocialCampaign() {
  const [openPhase, setOpenPhase] = useState<string | null>("Phase 1");
  const [activeTemplate, setActiveTemplate] = useState<"facebook" | "twitter" | "email">("facebook");
  const [form, setForm] = useState<PostForm>({
    location: "", situation: "", agency: "", agencyContact: "",
    officialHandle: "", reportDate: new Date().toISOString().split("T")[0],
    caseNum: "", daysSince: "", hashtags: "#AnimalWelfare",
  });
  const [copied, setCopied] = useState<string | null>(null);

  const templates = {
    facebook: POST_TEMPLATES.facebook(form),
    twitter: POST_TEMPLATES.twitter(form),
    email: POST_TEMPLATES.email(form),
  };

  const copyTemplate = async (key: "facebook" | "twitter" | "email") => {
    await navigator.clipboard.writeText(templates[key]);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const addHashtag = (tag: string) => {
    const current = form.hashtags;
    const newTag = `#${tag}`;
    if (!current.includes(newTag)) {
      setForm((f) => ({ ...f, hashtags: `${current} ${newTag}`.trim() }));
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} baseColor="white" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/30 bg-[#47CC5E]/8 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <Megaphone className="w-3.5 h-3.5" />
            Social Media Campaign Builder
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Turn Documentation<br />
            <span className="text-[#47CC5E]">Into Public Pressure.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            A strategic 4-phase campaign guide for animal welfare advocates — with platform-specific post templates, hashtag builder, and official contact tools.
          </p>
        </div>

        {/* Phase guide */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Campaign Strategy — 4 Phases</p>
          <div className="flex flex-col gap-3">
            {CAMPAIGN_PHASES.map((p) => {
              const isOpen = openPhase === p.phase;
              return (
                <div key={p.phase} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden">
                  <button className="w-full px-5 py-4 flex items-center justify-between text-left" onClick={() => setOpenPhase(isOpen ? null : p.phase)}>
                    <div className="flex items-center gap-3">
                      <span className="text-[#47CC5E] text-xs font-black uppercase tracking-wider">{p.phase}</span>
                      <p className="text-white font-black text-sm">{p.title}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 pb-4 pt-3">
                      <p className="text-white/55 text-sm leading-relaxed mb-3">{p.desc}</p>
                      <div className="flex flex-col gap-2">
                        {p.steps.map((step, i) => (
                          <div key={i} className="flex gap-2.5">
                            <span className="text-[#47CC5E] font-black text-xs shrink-0">{i + 1}.</span>
                            <p className="text-white/60 text-sm leading-snug">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Case details form */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-6">
          <p className="text-white font-black text-sm mb-4">Your Case Details — Fill in to customize templates</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {([
              ["location", "Location of concern"],
              ["agency", "Responsible agency"],
              ["agencyContact", "Agency phone or email"],
              ["officialHandle", "Elected official (name or @handle)"],
              ["reportDate", "Date complaint was filed"],
              ["caseNum", "Case number (if assigned)"],
              ["daysSince", "Days since filing"],
            ] as [keyof PostForm, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                <input
                  type="text"
                  className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#47CC5E]/50 transition-all"
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">Brief situation description (1–2 sentences)</label>
              <textarea
                rows={2}
                className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#47CC5E]/50 transition-all resize-none"
                value={form.situation}
                onChange={(e) => setForm((f) => ({ ...f, situation: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-white/45 text-xs font-black uppercase tracking-widest mb-1.5">Hashtags</label>
              <input
                type="text"
                className="w-full bg-white/6 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#47CC5E]/50 transition-all mb-2"
                value={form.hashtags}
                onChange={(e) => setForm((f) => ({ ...f, hashtags: e.target.value }))}
              />
              <div className="flex flex-wrap gap-1.5">
                {HASHTAG_KEYWORDS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addHashtag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                      form.hashtags.includes(`#${tag}`)
                        ? "bg-[#47CC5E]/15 border-[#47CC5E]/30 text-[#47CC5E]"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Post templates */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Post Templates</p>
          <div className="flex gap-2 mb-4">
            {(["facebook", "twitter", "email"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTemplate(t)}
                className={`px-4 py-2 rounded-full text-xs font-black border transition-all capitalize ${
                  activeTemplate === t
                    ? "bg-[#47CC5E]/15 border-[#47CC5E]/30 text-[#47CC5E]"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {t === "twitter" ? "Twitter / X" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-4 font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap min-h-32 mb-3">
            {templates[activeTemplate]}
          </div>
          <button
            onClick={() => copyTemplate(activeTemplate)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
          >
            {copied === activeTemplate ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied === activeTemplate ? "Copied!" : `Copy ${activeTemplate === "twitter" ? "Twitter/X" : activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)} Post`}
          </button>
        </div>

        {/* Platform notes */}
        <div className="mb-6">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Platform Strategy Notes</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { platform: "Facebook", tip: "Longer posts perform better in animal welfare groups. Tag rescue networks and shelters. 7–9pm posts get the most reach.", best: "Groups & sharing" },
              { platform: "Twitter / X", tip: "Tag official accounts directly. Short, factual, documentable. Thread with evidence. Reply to your own post with documentation link.", best: "Official pressure" },
              { platform: "Nextdoor", tip: "Highest local engagement. Start in your own neighborhood then share to adjacent ones. Avoids algorithmic filtering.", best: "Local reach" },
              { platform: "Instagram", tip: "Photos and video drive reach. Stories with swipe-up links. Reels of before/after conditions can go viral.", best: "Visual evidence" },
            ].map((p) => (
              <div key={p.platform} className="bg-white/4 border border-white/10 rounded-2xl p-4">
                <p className="text-white font-black text-sm mb-1">{p.platform}</p>
                <span className="px-2 py-0.5 rounded-full bg-[#47CC5E]/10 border border-[#47CC5E]/20 text-[#47CC5E] text-xs font-bold mb-3 inline-block">{p.best}</span>
                <p className="text-white/50 text-xs leading-relaxed">{p.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media outreach */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Escalating to Local Media</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "What makes a story newsworthy", body: "Documented inaction by a named agency. A timeline showing days without response. Video or photos of conditions. A clear 'ask' — schedule an inspection, release records." },
              { title: "How to pitch a journalist", body: "One paragraph. State the problem, the evidence, and what you want. Attach 3 photos maximum. Include the agency's contact information. Don't use the word 'abuse' — use 'alleged welfare violations' or 'reported concerns requiring investigation'." },
              { title: "Use VoiceMap Media Directory", body: "VoiceMap has a searchable directory of local TV, radio, and newspaper animal welfare reporters. Find yours and send a direct pitch with your case documentation link.", link: "/media-contacts", linkText: "Open Media Directory" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E] mt-1.5 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/45 text-xs leading-relaxed">{item.body}</p>
                  {item.link && (
                    <a href={item.link} className="flex items-center gap-1.5 mt-2 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors">
                      <ExternalLink className="w-3 h-3" /> {item.linkText}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
