import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { AUTHORITIES, AUTHORITY_TYPES, US_STATES, TYPE_COLORS, type AuthorityType } from "@/data/authorities";
import { Search, ExternalLink, Phone, ChevronDown, ChevronUp, Globe, Filter } from "lucide-react";
import { useSearch } from "wouter";

export default function AuthorityDirectory() {
  const searchStr = useSearch();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<AuthorityType | "All">("All");
  const [selectedState, setSelectedState] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchStr);
    const stateParam = params.get("state");
    if (stateParam) setSelectedState(stateParam);
  }, [searchStr]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return AUTHORITIES.filter((a) => {
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.accepts.some((x) => x.toLowerCase().includes(q));
      const matchType = selectedType === "All" || a.type === selectedType;
      const matchState = selectedState === "All" || a.state === selectedState;
      return matchSearch && matchType && matchState;
    });
  }, [search, selectedType, selectedState]);

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <Globe className="w-3.5 h-3.5" />
            Authority Directory
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Who to Contact.<br />
            <span className="text-[#47CC5E]">Where to Report.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            {AUTHORITIES.length} agencies across federal, state, and national levels — searchable by name, state, agency type, or accepted concern category.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search agencies, concerns, states…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/6 border border-white/12 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 focus:bg-white/8 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as AuthorityType | "All")}
              className="appearance-none bg-white/6 border border-white/12 rounded-xl pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:border-[#970CDA]/60 transition-all cursor-pointer"
            >
              <option value="All">All Types</option>
              {AUTHORITY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none bg-white/6 border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#970CDA]/60 transition-all cursor-pointer pr-8"
            >
              <option value="All">All States</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-5">
          {filtered.length} {filtered.length === 1 ? "agency" : "agencies"} found
        </p>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg">No agencies match your filters.</p>
              <p className="text-sm mt-1">Try broadening your search or clearing filters.</p>
            </div>
          )}

          {filtered.map((a) => {
            const isOpen = expandedId === a.id;
            return (
              <div
                key={a.id}
                className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/18 transition-all"
              >
                <button
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                  onClick={() => setExpandedId(isOpen ? null : a.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${TYPE_COLORS[a.type]}`}>
                        {a.type}
                      </span>
                      <span className="text-white/35 text-xs font-bold">{a.state}</span>
                    </div>
                    <h3 className="text-white font-bold text-base leading-snug pr-4">{a.name}</h3>
                    {!isOpen && (
                      <p className="text-white/45 text-sm mt-1 line-clamp-1">{a.description}</p>
                    )}
                  </div>
                  <div className="shrink-0 mt-1 text-white/30">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/8">
                    <p className="text-white/65 text-sm leading-relaxed mt-4 mb-4">{a.description}</p>

                    <div className="mb-4">
                      <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-2">Accepts Complaints About</p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.accepts.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 rounded-lg bg-white/6 border border-white/10 text-white/70 text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {a.phone && (
                        <a
                          href={`tel:${a.phone.replace(/[^+\d]/g, "")}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E]/15 border border-[#47CC5E]/30 text-[#47CC5E] text-xs font-black hover:bg-[#47CC5E]/25 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {a.phone}
                        </a>
                      )}
                      {a.website && (
                        <a
                          href={a.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA]/15 border border-[#970CDA]/30 text-[#c060ff] text-xs font-black hover:bg-[#970CDA]/25 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Official Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
