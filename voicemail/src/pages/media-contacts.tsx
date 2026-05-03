import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  MEDIA_CONTACTS,
  MEDIA_TYPES,
  STATE_NAMES,
  type MediaContact,
  type MediaType,
} from "@/data/media-contacts";
import {
  Tv,
  Newspaper,
  Globe,
  Radio,
  Heart,
  Search,
  ExternalLink,
  Mail,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from "lucide-react";

const TYPE_ICON: Record<MediaType, React.ReactNode> = {
  TV: <Tv className="w-4 h-4" />,
  Newspaper: <Newspaper className="w-4 h-4" />,
  Online: <Globe className="w-4 h-4" />,
  "Wire Service": <Radio className="w-4 h-4" />,
  "Animal Welfare Media": <Heart className="w-4 h-4" />,
};

const TYPE_COLOR: Record<MediaType, string> = {
  TV: "bg-[#970CDA]/15 text-[#c060ff] border-[#970CDA]/35",
  Newspaper: "bg-[#47CC5E]/12 text-[#47CC5E] border-[#47CC5E]/30",
  Online: "bg-white/10 text-white/70 border-white/20",
  "Wire Service": "bg-[#970CDA]/10 text-[#c060ff]/80 border-[#970CDA]/25",
  "Animal Welfare Media": "bg-[#47CC5E]/20 text-[#47CC5E] border-[#47CC5E]/40",
};

function buildPitchEmail(outlet: MediaContact, subject: string, summary: string, name: string): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scope = outlet.scope === "National" ? "national" : `${STATE_NAMES[outlet.scope] ?? outlet.scope}-area`;
  return `To: ${outlet.name}${outlet.tipEmail ? ` <${outlet.tipEmail}>` : ""}
Date: ${today}
Subject: Tip — ${subject || "[Brief description of the story]"}

Dear ${outlet.name} Investigative Team,

My name is ${name || "[Your Name]"} and I am reaching out with a documented animal welfare story that may be of significant public interest.

SUMMARY
${summary || "[Describe the incident, pattern, or failure you have documented. Be specific about location, dates, parties involved, and what makes this newsworthy.]"}

WHY THIS MATTERS
This is a ${scope} story involving [alleged animal cruelty / shelter conditions / agency non-response / enforcement failure] that has not been adequately addressed through normal channels. I have documented this concern using the VoiceMap National Animal Protection Portal, which generates timestamped, organized evidence packets.

WHAT I HAVE DOCUMENTED
• Timestamped photographic and/or video evidence
• Written incident reports with GPS locations and dates
• Correspondence with [agency/authority] showing non-response or inadequate action
• [Add any additional documentation you have]

I am prepared to provide my full documentation packet — including VoiceMap report exports, evidence files, and any official correspondence — to your team upon request.

This report is submitted in good faith. All incidents described are alleged and documented concerns that require proper investigation. I am not seeking personal attention — I am seeking accountability for the animals involved.

I am available for follow-up at any time.

Sincerely,
${name || "[Your Name]"}
${name ? "" : "[Your Contact Information]"}

---
This tip was generated using VoiceMap National Animal Protection Portal
Documentation packet available upon request`;
}

interface TipModalProps {
  outlet: MediaContact;
  onClose: () => void;
}

function TipModal({ outlet, onClose }: TipModalProps) {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const email = buildPitchEmail(outlet, subject, summary, name);

  const copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailto = outlet.tipEmail
    ? `mailto:${outlet.tipEmail}?subject=${encodeURIComponent(subject || "Tip — Animal Welfare Story")}&body=${encodeURIComponent(email)}`
    : null;

  const inputCls =
    "w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-[#0c1228] border border-white/12 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-white/8 shrink-0">
          <div>
            <p className="text-white/45 text-xs font-black uppercase tracking-widest mb-1">Generate Tip Email</p>
            <p className="text-white font-black text-lg leading-tight">{outlet.name}</p>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border mt-2 ${TYPE_COLOR[outlet.type]}`}>
              {TYPE_ICON[outlet.type]}
              {outlet.type}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all shrink-0 mt-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto flex-1">
          <div>
            <label className="text-white/55 text-xs font-black uppercase tracking-wider mb-2 block">Story Headline / Subject</label>
            <input
              type="text"
              className={inputCls}
              placeholder="e.g. Repeated animal neglect at 123 Oak St — agency non-response documented"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white/55 text-xs font-black uppercase tracking-wider mb-2 block">Case Summary</label>
            <textarea
              rows={5}
              className={inputCls + " resize-none"}
              placeholder="Describe what you witnessed or documented. Include dates, location, animals involved, what happened, who was contacted, and how they responded (or didn't)."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white/55 text-xs font-black uppercase tracking-wider mb-2 block">Your Name (optional)</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Remains in the email — omit if you prefer anonymous tip"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-2">Email Preview</p>
            <div className="bg-[#080c1a] border border-white/8 rounded-xl p-4 font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
              {email}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap pt-1 pb-2">
            <button
              onClick={copy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Email"}
            </button>
            {mailto && (
              <a href={mailto} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                <Mail className="w-3.5 h-3.5" /> Open in Mail App
              </a>
            )}
            {outlet.tipUrl && (
              <a
                href={outlet.tipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/8 border border-white/15 text-white/70 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Tip Page
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ contact, onTip }: { contact: MediaContact; onTip: (c: MediaContact) => void }) {
  const [expanded, setExpanded] = useState(false);
  const scopeLabel = contact.scope === "National" ? "National" : `${STATE_NAMES[contact.scope] ?? contact.scope}${contact.market ? ` · ${contact.market}` : ""}`;

  return (
    <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/18 transition-all">
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${TYPE_COLOR[contact.type]}`}>
            {TYPE_ICON[contact.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
              <p className="text-white font-black text-base leading-tight">{contact.name}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border shrink-0 ${TYPE_COLOR[contact.type]}`}>
                {contact.type}
              </span>
            </div>
            <p className="text-white/40 text-xs font-bold mb-2">{scopeLabel}</p>
            <p className="text-white/60 text-sm leading-relaxed">{contact.focus}</p>
          </div>
        </div>

        {/* Expanded notes */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-white/8">
            <p className="text-white/50 text-sm leading-relaxed">{contact.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => onTip(contact)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_14px_rgba(71,204,94,0.4)] transition-all"
          >
            <FileText className="w-3 h-3" /> Generate Tip Email
          </button>
          {contact.tipUrl && (
            <a
              href={contact.tipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
            >
              <ExternalLink className="w-3 h-3" /> Tip Page
            </a>
          )}
          {contact.tipEmail && (
            <a
              href={`mailto:${contact.tipEmail}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/6 border border-white/12 text-white/60 font-black text-xs uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
            >
              <Mail className="w-3 h-3" /> Email
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto flex items-center gap-1 px-3 py-2 rounded-full text-white/30 hover:text-white/60 text-xs font-bold transition-all"
          >
            Notes
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

const ALL_TYPES = ["All Types", ...MEDIA_TYPES] as const;
type TypeFilter = (typeof ALL_TYPES)[number];

export default function MediaContacts() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");
  const [scopeFilter, setScopeFilter] = useState("All");
  const [tipTarget, setTipTarget] = useState<MediaContact | null>(null);

  const stateOptions = useMemo(() => {
    const states = new Set(MEDIA_CONTACTS.map((c) => c.scope));
    return ["All", "National", ...Object.keys(STATE_NAMES).filter((k) => states.has(k)).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MEDIA_CONTACTS.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.focus.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q) ||
        (c.market ?? "").toLowerCase().includes(q) ||
        (STATE_NAMES[c.scope] ?? "").toLowerCase().includes(q);
      const matchType = typeFilter === "All Types" || c.type === typeFilter;
      const matchScope =
        scopeFilter === "All" ||
        (scopeFilter === "National" ? c.scope === "National" : c.scope === scopeFilter);
      return matchSearch && matchType && matchScope;
    });
  }, [search, typeFilter, scopeFilter]);

  const nationalCount = MEDIA_CONTACTS.filter((c) => c.scope === "National").length;
  const tvCount = MEDIA_CONTACTS.filter((c) => c.type === "TV").length;
  const animalMediaCount = MEDIA_CONTACTS.filter((c) => c.type === "Animal Welfare Media").length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      {tipTarget && <TipModal outlet={tipTarget} onClose={() => setTipTarget(null)} />}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Tv className="w-3.5 h-3.5" />
            Media Contact Directory
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Get Your Story<br />
            <span className="text-[#47CC5E]">In Front of Journalists.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Investigative journalists, TV newsdesks, and animal welfare media — sorted by region. Generate a professional tip email for any outlet in one click.
          </p>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Outlets", value: MEDIA_CONTACTS.length, color: "text-white" },
            { label: "National Coverage", value: nationalCount, color: "text-[#c060ff]" },
            { label: "TV Newsdesks", value: tvCount, color: "text-[#47CC5E]" },
            { label: "Animal Welfare Media", value: animalMediaCount, color: "text-[#47CC5E]" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`kz-stat-number text-3xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">How to use this directory</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { n: "1", title: "Find the right outlet", body: "Filter by your state or search by topic. National investigative desks for systemic patterns; local TV for immediate local impact." },
              { n: "2", title: "Generate a tip email", body: "Click the green Generate Tip Email button on any card. Fill in your case summary — it builds a professional, structured pitch journalists expect." },
              { n: "3", title: "Attach your VoiceMap packet", body: "Send your report export from the Report Packet tool alongside the pitch. Timestamped documentation is what converts a tip into a published story." },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#47CC5E]/15 text-[#47CC5E] font-black text-sm flex items-center justify-center shrink-0">
                  {step.n}
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by outlet name, state, focus area…"
              className="w-full bg-white/6 border border-white/12 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Type filters */}
            <div className="flex flex-wrap gap-1.5">
              {ALL_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                    typeFilter === t
                      ? "bg-[#970CDA]/25 border border-[#970CDA]/50 text-[#c060ff]"
                      : "bg-white/6 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t !== "All Types" && TYPE_ICON[t as MediaType]}
                  {t}
                </button>
              ))}
            </div>

            {/* State / scope filter */}
            <div className="ml-auto">
              <select
                className="bg-white/6 border border-white/12 rounded-xl px-4 py-2 text-sm text-white/70 focus:outline-none focus:border-[#970CDA]/60 transition-all"
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
              >
                <option value="All">All Regions</option>
                <option value="National">National Only</option>
                <optgroup label="By State">
                  {Object.entries(STATE_NAMES)
                    .filter(([abbr]) => MEDIA_CONTACTS.some((c) => c.scope === abbr))
                    .map(([abbr, name]) => (
                      <option key={abbr} value={abbr}>{name}</option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-4">
          {filtered.length} outlet{filtered.length !== 1 ? "s" : ""} matching filters
        </p>

        {/* National section */}
        {(scopeFilter === "All" || scopeFilter === "National") && (
          <>
            {filtered.filter((c) => c.scope === "National").length > 0 && (
              <div className="mb-8">
                <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> National Outlets
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {filtered
                    .filter((c) => c.scope === "National")
                    .map((c) => (
                      <ContactCard key={c.id} contact={c} onTip={setTipTarget} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Regional section */}
        {filtered.filter((c) => c.scope !== "National").length > 0 && (
          <div>
            <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tv className="w-3.5 h-3.5" /> Regional Outlets
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {filtered
                .filter((c) => c.scope !== "National")
                .sort((a, b) => {
                  const stateA = STATE_NAMES[a.scope] ?? a.scope;
                  const stateB = STATE_NAMES[b.scope] ?? b.scope;
                  if (stateA !== stateB) return stateA.localeCompare(stateB);
                  return a.name.localeCompare(b.name);
                })
                .map((c) => (
                  <ContactCard key={c.id} contact={c} onTip={setTipTarget} />
                ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
            <Search className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <p className="text-white/50 font-black text-lg">No outlets match your filters</p>
            <p className="text-white/30 text-sm mt-2">Try adjusting the type filter or clearing your search</p>
          </div>
        )}

        {/* Tips section */}
        <div className="mt-12 bg-white/3 border border-white/8 rounded-2xl p-6">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Tips for effective media outreach</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Lead with documentation", body: "Journalists need verifiable facts. Lead with what you can prove: dates, locations, photos, official correspondence. A VoiceMap report packet is your strongest asset." },
              { title: "Explain why now", body: "Give the story urgency. Is the animal still suffering? Is there a legislative hearing coming? Is this part of a larger trend? Timing matters." },
              { title: "Don't spam every outlet", body: "Journalists talk to each other. Pitch one outlet at a time, give them 5–7 days to respond, then move to the next. Exclusive tips get far more attention." },
              { title: "Match outlet to story type", body: "TV is best for visual, local stories. Newspapers for documented patterns. National wire services for stories with multi-state or federal angles. Animal welfare media for rescue and shelter stories." },
              { title: "Be responsive and credible", body: "If a journalist responds, be available, accurate, and honest about what you know vs. what you believe. Overclaiming kills stories. Under-documented claims get ignored." },
              { title: "Anonymous tips are accepted", body: "Most outlets accept anonymous tips. You don't need to be named in a story. If you have concerns about retaliation, say so in your tip and omit identifying details." },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E] mt-2 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm mb-1">{tip.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
