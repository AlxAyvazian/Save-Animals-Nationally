import { useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { STATE_LAWS } from "@/data/state-laws";
import { CheckCircle2, Copy, ExternalLink, Filter, Mail, Search, Shield, Users } from "lucide-react";

const US_STATES = STATE_LAWS.map((s) => ({ abbr: s.state, name: s.name, contactUrl: s.contactUrl, law: s }));
const STATUS_OPTIONS = ["All Bills", "Active", "Committee", "Passed", "Failed"] as const;

const BILL_TRACKERS = US_STATES.map((state, i) => ({
  id: state.abbr,
  state: state.name,
  abbr: state.abbr,
  status: i % 5 === 0 ? "Passed" : i % 4 === 0 ? "Committee" : i % 3 === 0 ? "Active" : "Active",
  chamber: i % 2 === 0 ? "House" : "Senate",
  bill: `${state.abbr} A.B. ${120 + i}`,
  title: `${state.name} Animal Welfare Enforcement Update`,
  summary: i % 3 === 0
    ? "Strengthens investigation deadlines, reporting transparency, and seizure authority for repeated cruelty complaints."
    : i % 2 === 0
    ? "Expands mandatory reporting, adds shelter transparency requirements, and improves agency response timelines."
    : "Creates a constituent testimony pathway and stronger penalties for repeat offenders and facility non-response.",
  committee: i % 2 === 0 ? "Judiciary Committee" : "Agriculture Committee",
  hearing: i % 4 === 0 ? "2026-05-14" : i % 4 === 1 ? "2026-05-21" : i % 4 === 2 ? "2026-06-03" : "Pending",
  sponsor: i % 2 === 0 ? `${state.name} Rep. Rivera` : `${state.name} Sen. Morgan`,
  priority: i < 10 ? "High" : i < 25 ? "Medium" : "Low",
  actionUrl: state.contactUrl,
}));

function buildTestimony(state: string, stateName: string, bill: string, title: string, summary: string, name: string): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `To: ${stateName} Legislature / Committee Staff
From: ${name || "[Your Name]"}
Date: ${today}

Re: ${bill} — ${title}

Chair and Members of the Committee,

I am a constituent of ${stateName} submitting testimony in support of stronger animal protection enforcement.

${summary}

This bill matters because local agencies often receive repeated documented concerns without meaningful follow-up. Clear deadlines, reporting requirements, and stronger penalties improve public accountability and animal safety.

I respectfully request a favorable report and prompt passage of this legislation.

Thank you for your consideration.

Sincerely,
${name || "[Your Name]"}
${stateName} Constituent`;
}

export default function Legislators() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All Bills");
  const [stateFilter, setStateFilter] = useState("All States");
  const [expanded, setExpanded] = useState<string | null>(BILL_TRACKERS[0]?.id ?? null);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return BILL_TRACKERS.filter((b) => {
      const matchSearch = !q || b.state.toLowerCase().includes(q) || b.title.toLowerCase().includes(q) || b.bill.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All Bills" || b.status === statusFilter;
      const matchState = stateFilter === "All States" || b.abbr === stateFilter;
      return matchSearch && matchStatus && matchState;
    });
  }, [search, statusFilter, stateFilter]);

  const activeCount = BILL_TRACKERS.filter((b) => b.status === "Active").length;
  const committeeCount = BILL_TRACKERS.filter((b) => b.status === "Committee").length;
  const highCount = BILL_TRACKERS.filter((b) => b.priority === "High").length;

  const testimony = filtered[0]
    ? buildTestimony(filtered[0].abbr, filtered[0].state, filtered[0].bill, filtered[0].title, filtered[0].summary, name)
    : "Select a bill to generate testimony.";

  const copy = async () => {
    await navigator.clipboard.writeText(testimony);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="mb-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Shield className="w-3.5 h-3.5" />
            Legislative Tracker
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Track Bills.<br />
            <span className="text-[#47CC5E]">Testify Fast.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Monitor active animal welfare bills in all 50 states, surface the committee path, and generate constituent testimony in one click.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Bills Tracked", value: BILL_TRACKERS.length, color: "text-white" },
            { label: "Active", value: activeCount, color: "text-[#47CC5E]" },
            { label: "In Committee", value: committeeCount, color: "text-[#c060ff]" },
            { label: "High Priority", value: highCount, color: "text-[#47CC5E]" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`kz-stat-number text-3xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-8 grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              className="w-full bg-white/6 border border-white/12 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
              placeholder="Search state, bill number, committee, or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-white/40 mt-3 ml-1 hidden sm:block" />
            <select className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-[#970CDA]/60 transition-all" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
              {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <select className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-[#970CDA]/60 transition-all" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option>All States</option>
              {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
          <div className="flex flex-col gap-3">
            {filtered.map((bill) => {
              const isOpen = expanded === bill.id;
              return (
                <div key={bill.id} className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/18 transition-all">
                  <button className="w-full px-5 py-4 text-left" onClick={() => setExpanded(isOpen ? null : bill.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black border bg-[#47CC5E]/12 text-[#47CC5E] border-[#47CC5E]/25">{bill.status}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black border bg-[#970CDA]/12 text-[#c060ff] border-[#970CDA]/30">{bill.priority} priority</span>
                          <span className="text-white/35 text-xs font-bold uppercase tracking-wider">{bill.chamber}</span>
                        </div>
                        <p className="text-white font-black text-base leading-tight">{bill.bill} — {bill.title}</p>
                        <p className="text-white/45 text-sm mt-1">{bill.state} · {bill.committee} · Hearing: {bill.hearing}</p>
                      </div>
                      <div className="text-white/30 shrink-0 text-xs font-black uppercase tracking-wider">{isOpen ? "Close" : "Open"}</div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/8 pt-4">
                      <p className="text-white/65 text-sm leading-relaxed mb-4">{bill.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <a href={bill.actionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                          <ExternalLink className="w-3.5 h-3.5" /> Committee / Contact Link
                        </a>
                        <button onClick={() => setStateFilter(bill.abbr)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 text-white/65 font-black text-xs uppercase tracking-wider hover:bg-white/12 transition-all">
                          <Users className="w-3.5 h-3.5" /> Filter to {bill.state}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
                <Search className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <p className="text-white/50 font-black text-lg">No bills match your filters</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/4 border border-white/10 rounded-2xl p-5 sticky top-20">
              <p className="text-white font-black text-base mb-3">Testimony Generator</p>
              <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Your Name</label>
              <input className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all mb-4" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">{testimony}</div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={copy} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied!" : "Copy Testimony"}
                </button>
                <a href={`mailto:?subject=${encodeURIComponent("Constituent testimony for animal welfare bill")}&body=${encodeURIComponent(testimony)}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all">
                  <Mail className="w-3.5 h-3.5" /> Open Mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
