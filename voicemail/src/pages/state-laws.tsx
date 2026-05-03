import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { STATE_LAWS } from "@/data/state-laws";
import { Scale, Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, ExternalLink, Shield } from "lucide-react";

const FILTERS = ["All States", "Felony (1st offense)", "Mandatory Reporting", "Hot Car Law", "Farm Animals Covered"];

export default function StateLaws() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All States");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "maxYears" | "maxFine">("name");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATE_LAWS
      .filter((s) => {
        const matchSearch = !q || s.name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
        const matchFilter =
          filter === "All States" ||
          (filter === "Felony (1st offense)" && s.firstOffense === "Felony") ||
          (filter === "Mandatory Reporting" && s.mandatoryReporting) ||
          (filter === "Hot Car Law" && s.hotCarLaw) ||
          (filter === "Farm Animals Covered" && s.farmAnimals);
        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sortBy === "maxYears") return b.maxYears - a.maxYears;
        if (sortBy === "maxFine") return b.maxFine - a.maxFine;
        return a.name.localeCompare(b.name);
      });
  }, [search, filter, sortBy]);

  const felonyCount = STATE_LAWS.filter((s) => s.firstOffense === "Felony").length;
  const hotCarCount = STATE_LAWS.filter((s) => s.hotCarLaw).length;
  const mandatoryCount = STATE_LAWS.filter((s) => s.mandatoryReporting).length;
  const farmCount = STATE_LAWS.filter((s) => s.farmAnimals).length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Scale className="w-3.5 h-3.5" />
            State Animal Cruelty Law Guide
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Know the Law.<br />
            <span className="text-[#47CC5E]">Use It.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Animal cruelty statutes for all 50 states — penalties, felony thresholds, farm animal coverage, mandatory reporting, and hot car rescue laws.
          </p>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { value: felonyCount, label: "States: Felony 1st Offense", color: "text-[#47CC5E]" },
            { value: hotCarCount, label: "States: Hot Car Rescue Law", color: "text-[#970CDA]" },
            { value: mandatoryCount, label: "States: Mandatory Reporting", color: "text-[#c060ff]" },
            { value: farmCount, label: "States: Farm Animals Covered", color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`kz-stat-number text-4xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search states…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/6 border border-white/12 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#970CDA]/60 transition-all cursor-pointer"
          >
            {FILTERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "maxYears" | "maxFine")}
            className="appearance-none bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#970CDA]/60 transition-all cursor-pointer"
          >
            <option value="name">Sort: A–Z</option>
            <option value="maxYears">Sort: Max Prison</option>
            <option value="maxFine">Sort: Max Fine</option>
          </select>
        </div>

        <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">{filtered.length} states</p>

        {/* State cards */}
        <div className="flex flex-col gap-2">
          {filtered.map((law) => {
            const isOpen = expanded === law.state;
            return (
              <div
                key={law.state}
                className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/16 transition-all"
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                  onClick={() => setExpanded(isOpen ? null : law.state)}
                >
                  {/* State abbr badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${
                    law.firstOffense === "Felony" ? "bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff]" : "bg-orange-500/15 border border-orange-500/30 text-orange-300"
                  }`}>
                    {law.state}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-white font-black text-base">{law.name}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        law.firstOffense === "Felony"
                          ? "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30"
                          : "bg-orange-500/15 text-orange-300 border-orange-500/30"
                      }`}>
                        {law.firstOffense === "Felony" ? `Felony 1st` : "Misdemeanor 1st"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <span className="text-white/40 text-xs font-bold">{law.statute}</span>
                      <span className="text-white/40 text-xs">Up to {law.maxYears} yrs</span>
                      {law.maxFine > 0 && <span className="text-white/40 text-xs">${law.maxFine.toLocaleString()} max fine</span>}
                    </div>
                  </div>

                  {/* Quick indicators */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    {law.hotCarLaw && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/25">Hot Car</span>
                    )}
                    {law.mandatoryReporting && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#970CDA]/15 text-[#c060ff] border border-[#970CDA]/25">Mand. Report</span>
                    )}
                    {law.farmAnimals && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/15 text-orange-300 border border-orange-500/25">Farm ✓</span>
                    )}
                  </div>

                  <div className="text-white/30 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/8 pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "First Offense", value: `${law.firstOffense} (${law.felonyClass})`, ok: law.firstOffense === "Felony" },
                        { label: "Max Prison", value: `${law.maxYears} years`, ok: law.maxYears >= 3 },
                        { label: "Max Fine", value: law.maxFine > 0 ? `$${law.maxFine.toLocaleString()}` : "Not specified", ok: law.maxFine >= 5000 },
                        { label: "Statute", value: law.statute, ok: true },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/4 rounded-xl p-3">
                          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-1">{item.label}</p>
                          <p className={`font-black text-sm ${item.ok ? "text-[#47CC5E]" : "text-orange-300"}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { label: "Hot Car Rescue Law", active: law.hotCarLaw },
                        { label: "Mandatory Reporting", active: law.mandatoryReporting },
                        { label: "Farm Animals Covered", active: law.farmAnimals },
                      ].map((badge) => (
                        <div key={badge.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${
                          badge.active ? "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30" : "bg-white/5 text-white/35 border-white/12"
                        }`}>
                          {badge.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {badge.label}
                        </div>
                      ))}
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed mb-4">{law.notes}</p>

                    <a
                      href={law.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff] text-xs font-black hover:bg-[#970CDA]/30 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Contact {law.name} Governor
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-white/25 text-xs mt-8 leading-relaxed text-center max-w-2xl mx-auto">
          This guide is for informational purposes only. Laws change — always verify current statutes with official state sources before taking legal action. Not legal advice.
        </p>
      </main>
    </div>
  );
}
