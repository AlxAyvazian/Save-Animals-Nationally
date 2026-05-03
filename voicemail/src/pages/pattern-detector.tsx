import { useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter, PawIcon } from "@/components/paw-prints";
import { TrendingUp, AlertTriangle, Download, Copy, CheckCircle2, MapPin, Calendar, Layers } from "lucide-react";

interface Concern {
  id: string;
  date: string;
  location?: string;
  animalType?: string;
  incidentType?: string;
  description?: string;
  status?: string;
}

interface Pattern {
  id: string;
  type: "location" | "animal" | "incident" | "time";
  label: string;
  count: number;
  severity: "High" | "Medium" | "Low";
  concerns: Concern[];
  summary: string;
}

function detectPatterns(concerns: Concern[]): Pattern[] {
  const patterns: Pattern[] = [];

  // Group by location
  const byLocation: Record<string, Concern[]> = {};
  for (const c of concerns) {
    const key = (c.location ?? "").trim().toLowerCase();
    if (key) {
      byLocation[key] = byLocation[key] ? [...byLocation[key], c] : [c];
    }
  }
  for (const [loc, cs] of Object.entries(byLocation)) {
    if (cs.length >= 2) {
      patterns.push({
        id: `loc-${loc}`,
        type: "location",
        label: cs[0].location ?? loc,
        count: cs.length,
        severity: cs.length >= 4 ? "High" : cs.length >= 3 ? "Medium" : "Low",
        concerns: cs,
        summary: `${cs.length} separate reported concerns have been documented at or near this location. Repeated incidents at a single address are a strong indicator of ongoing systemic abuse or neglect requiring investigation.`,
      });
    }
  }

  // Group by animal type
  const byAnimal: Record<string, Concern[]> = {};
  for (const c of concerns) {
    const key = (c.animalType ?? "").trim().toLowerCase();
    if (key) {
      byAnimal[key] = byAnimal[key] ? [...byAnimal[key], c] : [c];
    }
  }
  for (const [type, cs] of Object.entries(byAnimal)) {
    if (cs.length >= 3) {
      patterns.push({
        id: `animal-${type}`,
        type: "animal",
        label: cs[0].animalType ?? type,
        count: cs.length,
        severity: cs.length >= 6 ? "High" : cs.length >= 4 ? "Medium" : "Low",
        concerns: cs,
        summary: `${cs.length} documented concerns involve ${cs[0].animalType ?? type}. This cluster may indicate a species-specific enforcement gap, a problem operation targeting this animal type, or a systemic failure to protect this population.`,
      });
    }
  }

  // Group by incident type
  const byIncident: Record<string, Concern[]> = {};
  for (const c of concerns) {
    const key = (c.incidentType ?? "").trim().toLowerCase();
    if (key) {
      byIncident[key] = byIncident[key] ? [...byIncident[key], c] : [c];
    }
  }
  for (const [type, cs] of Object.entries(byIncident)) {
    if (cs.length >= 3) {
      patterns.push({
        id: `incident-${type}`,
        type: "incident",
        label: cs[0].incidentType ?? type,
        count: cs.length,
        severity: cs.length >= 5 ? "High" : cs.length >= 3 ? "Medium" : "Low",
        concerns: cs,
        summary: `${cs.length} concerns share the same alleged incident type: "${cs[0].incidentType ?? type}". A recurring pattern of the same type of harm — especially if spread across different locations — often points to an absence of deterrence or enforcement at the systemic level.`,
      });
    }
  }

  // Time clustering — concerns within same calendar month
  const byMonth: Record<string, Concern[]> = {};
  for (const c of concerns) {
    if (c.date) {
      const key = c.date.slice(0, 7); // YYYY-MM
      byMonth[key] = byMonth[key] ? [...byMonth[key], c] : [c];
    }
  }
  for (const [month, cs] of Object.entries(byMonth)) {
    if (cs.length >= 4) {
      const [y, m] = month.split("-");
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
      patterns.push({
        id: `time-${month}`,
        type: "time",
        label,
        count: cs.length,
        severity: cs.length >= 8 ? "High" : cs.length >= 5 ? "Medium" : "Low",
        concerns: cs,
        summary: `${cs.length} concerns were documented within ${label}. A spike in documented concerns within a single time period may indicate a triggering event (weather, facility change, policy shift) and strengthens the case for an immediate formal investigation request.`,
      });
    }
  }

  return patterns.sort((a, b) => b.count - a.count);
}

function buildReport(patterns: Pattern[], total: number): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const highCount = patterns.filter(p => p.severity === "High").length;

  return `SYSTEMIC CONCERN PATTERN REPORT
Generated: ${today}
Source: VoiceMap National Animal Protection Portal (localStorage documentation)

SUMMARY
Total concerns in dataset: ${total}
Patterns detected: ${patterns.length}
High-severity patterns: ${highCount}

This report documents repeated, cross-referenced patterns identified within the reporter's documented concern history. Pattern detection across multiple documented incidents provides stronger grounds for formal escalation than any single report.

DETECTED PATTERNS
${patterns.map((p, i) => `
${i + 1}. ${p.type.toUpperCase()} PATTERN — ${p.severity.toUpperCase()} SEVERITY
Label: ${p.label}
Incident count: ${p.count}
Analysis: ${p.summary}
Documented dates: ${p.concerns.map(c => c.date ?? "unknown").join(", ")}
`).join("")}

RECOMMENDED ACTIONS
${highCount > 0 ? "• HIGH-SEVERITY patterns have been identified. Immediate escalation to state AG and USDA APHIS is recommended.\n" : ""}• Attach full VoiceMap report packets for each documented concern to this summary.
• File this pattern report alongside FOIA requests for inspection/complaint history at flagged locations.
• Present to elected officials as evidence of systemic non-response.
• Share with investigative media outlets covering animal welfare.

This report contains alleged patterns based on reported concerns. All incidents should be investigated by appropriate authorities before conclusions are drawn.

Generated by VoiceMap National Animal Protection Portal`;
}

const SEVERITY_STYLES: Record<string, string> = {
  High: "bg-[#970CDA]/20 text-[#c060ff] border-[#970CDA]/40",
  Medium: "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30",
  Low: "bg-white/8 text-white/60 border-white/15",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  location: <MapPin className="w-4 h-4" />,
  animal: <PawIcon size={16} />,
  incident: <AlertTriangle className="w-4 h-4" />,
  time: <Calendar className="w-4 h-4" />,
};

const DEMO_CONCERNS: Concern[] = [
  { id: "1", date: "2026-01-15", location: "123 Oak Street, Houston TX", animalType: "Dog", incidentType: "Neglect", description: "Multiple dogs chained without water in extreme heat", status: "reported" },
  { id: "2", date: "2026-01-28", location: "123 Oak Street, Houston TX", animalType: "Dog", incidentType: "Neglect", description: "Same property — dogs still without adequate shelter", status: "reported" },
  { id: "3", date: "2026-02-03", location: "123 Oak Street, Houston TX", animalType: "Dog", incidentType: "Physical abuse", description: "Witnessed striking of animal", status: "pending" },
  { id: "4", date: "2026-01-10", location: "Riverside County Shelter", animalType: "Cat", incidentType: "Unsafe shelter conditions", description: "Overcrowding observed", status: "reported" },
  { id: "5", date: "2026-01-18", location: "Riverside County Shelter", animalType: "Cat", incidentType: "Unsafe shelter conditions", description: "Follow-up — conditions unchanged", status: "pending" },
  { id: "6", date: "2026-01-22", location: "Riverside County Shelter", animalType: "Dog", incidentType: "Unsafe shelter conditions", description: "Dogs in flooded kennel", status: "pending" },
  { id: "7", date: "2026-02-01", location: "550 Farm Road, Lubbock TX", animalType: "Livestock", incidentType: "Starvation / dehydration", description: "Cattle with no visible water source", status: "reported" },
  { id: "8", date: "2026-02-14", location: "550 Farm Road, Lubbock TX", animalType: "Livestock", incidentType: "Starvation / dehydration", description: "Same property — emaciated animals", status: "pending" },
  { id: "9", date: "2026-01-05", location: "89 Pine Ave", animalType: "Dog", incidentType: "Neglect", description: "Emaciated dog, no shelter", status: "reported" },
  { id: "10", date: "2026-01-19", location: "200 W Main St", animalType: "Dog", incidentType: "Neglect", description: "Dog left outside in freezing temps", status: "reported" },
  { id: "11", date: "2026-01-25", location: "Hwy 90, mile marker 14", animalType: "Dog", incidentType: "Abandonment", description: "Abandoned dogs found", status: "reported" },
];

export default function PatternDetector() {
  const [useDemo, setUseDemo] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const rawConcerns = useMemo<Concern[]>(() => {
    if (useDemo) return DEMO_CONCERNS;
    try {
      const stored = localStorage.getItem("voicemap_concerns");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [useDemo]);

  const patterns = useMemo(() => detectPatterns(rawConcerns), [rawConcerns]);
  const report = buildReport(patterns, rawConcerns.length);

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
    a.download = `Pattern_Report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highCount = patterns.filter(p => p.severity === "High").length;
  const medCount = patterns.filter(p => p.severity === "Medium").length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#970CDA]/40 bg-[#970CDA]/10 text-[#c060ff] text-xs font-black uppercase tracking-widest mb-5">
            <TrendingUp className="w-3.5 h-3.5" />
            Pattern Detector
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            One Incident Is Noise.<br />
            <span className="text-[#47CC5E]">A Pattern Is Evidence.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Automatically analyzes your documented concerns for repeated locations, animal types, incident patterns, and time clusters — then generates a formal systemic report for escalation.
          </p>
        </div>

        {/* Data source toggle */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white font-black text-base">
                {useDemo ? "Demo Dataset" : "Your Documented Concerns"}
              </p>
              <p className="text-white/45 text-sm mt-0.5">
                {useDemo
                  ? `${DEMO_CONCERNS.length} demo concerns loaded — showing example pattern analysis`
                  : rawConcerns.length > 0
                  ? `${rawConcerns.length} concerns found in your VoiceMap records`
                  : "No concerns found — try the demo dataset or document concerns in the Intake tool"}
              </p>
            </div>
            <button
              onClick={() => setUseDemo(v => !v)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                useDemo
                  ? "bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff] hover:bg-[#970CDA]/30"
                  : "bg-white/8 border border-white/15 text-white/70 hover:bg-white/12"
              }`}
            >
              {useDemo ? "Switch to My Data" : "Load Demo Data"}
            </button>
          </div>
        </div>

        {/* Pattern summary stats */}
        {patterns.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Patterns Detected", value: patterns.length, color: "text-white" },
              { label: "High Severity", value: highCount, color: "text-[#c060ff]" },
              { label: "Medium Severity", value: medCount, color: "text-[#47CC5E]" },
            ].map((s) => (
              <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
                <div className={`kz-stat-number text-4xl mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-white/40 text-xs font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Pattern cards */}
        {patterns.length === 0 ? (
          <div className="text-center py-20 bg-white/3 border border-white/8 rounded-2xl">
            <Layers className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <p className="text-white/50 font-black text-lg">No patterns detected yet</p>
            <p className="text-white/30 text-sm mt-2 max-w-sm mx-auto">
              {rawConcerns.length === 0
                ? "Document at least 2 concerns in the Intake tool, or load the demo to see how this works."
                : "Keep documenting — patterns surface when 2+ concerns share a location, animal type, or incident type."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-1">{patterns.length} patterns detected</p>
            {patterns.map((pattern) => {
              const isOpen = expanded === pattern.id;
              return (
                <div
                  key={pattern.id}
                  className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/16 transition-all"
                >
                  <button
                    className="w-full px-5 py-4 flex items-center gap-4 text-left"
                    onClick={() => setExpanded(isOpen ? null : pattern.id)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${SEVERITY_STYLES[pattern.severity]}`}>
                      {TYPE_ICON[pattern.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${SEVERITY_STYLES[pattern.severity]}`}>
                          {pattern.severity}
                        </span>
                        <span className="text-white/35 text-xs font-bold uppercase tracking-wider">{pattern.type} pattern</span>
                      </div>
                      <p className="text-white font-black text-base leading-tight">{pattern.label}</p>
                      <p className="text-white/45 text-xs mt-0.5">{pattern.count} documented concerns</p>
                    </div>
                    <div className="text-white/30 shrink-0">
                      {isOpen
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
                      }
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/8 pt-4">
                      <p className="text-white/65 text-sm leading-relaxed mb-4">{pattern.summary}</p>
                      <div className="flex flex-col gap-2">
                        <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-1">Included concerns</p>
                        {pattern.concerns.map((c, i) => (
                          <div key={c.id} className="flex gap-3 px-4 py-3 bg-white/4 rounded-xl border border-white/8">
                            <span className="text-[#47CC5E] font-black text-xs mt-0.5 shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/80 text-sm font-bold truncate">{c.description ?? "No description"}</p>
                              <p className="text-white/35 text-xs mt-0.5">{c.date} {c.location ? `· ${c.location}` : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Report export */}
        {patterns.length > 0 && (
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <p className="text-white font-black text-base">Systemic Concern Report</p>
                <p className="text-white/45 text-sm mt-0.5">Formatted for agency submission, FOIA attachments, and elected official letters</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-xs uppercase tracking-wider hover:bg-[#5adb70] transition-all"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={download}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#970CDA] text-white font-black text-xs uppercase tracking-wider hover:bg-[#aa20ef] transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
            <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/65 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {report}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
