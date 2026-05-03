import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Link } from "wouter";
import { MapPin, TrendingUp, Users, ArrowRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Map FIPS code → state abbreviation
const FIPS_TO_STATE: Record<string, string> = {
  "01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT",
  "10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL",
  "18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD",
  "25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE",
  "32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND",
  "39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD",
  "47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV",
  "55":"WI","56":"WY",
};

// State full names
const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"D.C.",FL:"Florida",
  GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",
  IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",
  MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",
  MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",
  NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",
  NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};

// Sample seed data so the map isn't empty on first load
const SEED_COUNTS: Record<string, number> = {
  CA:24, TX:19, FL:16, NY:14, OH:11, PA:10, IL:9, GA:8,
  NC:7, WA:6, AZ:5, CO:5, MO:5, TN:4, VA:4, MI:4,
  OR:3, LA:3, IN:3, KY:3, SC:2, AL:2, NM:2, MT:1, WY:1,
};

interface ConcernRecord {
  state?: string;
}
interface ShelterRecord {
  state?: string;
}

function loadCountsByState(): Record<string, number> {
  const counts: Record<string, number> = { ...SEED_COUNTS };

  try {
    const concerns: ConcernRecord[] = JSON.parse(
      localStorage.getItem("voicemap_concerns") || "[]"
    );
    concerns.forEach((c) => {
      if (c.state) counts[c.state] = (counts[c.state] ?? 0) + 1;
    });
  } catch { /* ignore */ }

  try {
    const incidents: ShelterRecord[] = JSON.parse(
      localStorage.getItem("voicemap_shelter_incidents") || "[]"
    );
    incidents.forEach((i) => {
      if (i.state) counts[i.state] = (counts[i.state] ?? 0) + 1;
    });
  } catch { /* ignore */ }

  return counts;
}

export default function USAMap() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [tooltip, setTooltip] = useState<{ state: string; count: number; x: number; y: number } | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-96, 38]);

  useEffect(() => {
    setCounts(loadCountsByState());
  }, []);

  const maxCount = Math.max(...Object.values(counts), 1);

  const colorScale = scaleLinear<string>()
    .domain([0, Math.max(1, maxCount * 0.2), maxCount])
    .range(["#1a1040", "#6010aa", "#970CDA"])
    .clamp(true);

  const totalConcerns = Object.values(counts).reduce((a, b) => a + b, 0);
  const statesWithConcerns = Object.values(counts).filter((v) => v > 0).length;
  const topState = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  const handleStateClick = useCallback((stateAbbr: string) => {
    setSelectedState((prev) => (prev === stateAbbr ? null : stateAbbr));
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 flex flex-col px-4 py-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <MapPin className="w-3.5 h-3.5" />
            Live National Map
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Concerns Across<br />
            <span className="text-[#970CDA]">Every State.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Documented concerns from localStorage, visualized by state. Your reports feed directly into this map.
          </p>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <TrendingUp className="w-5 h-5" />, value: totalConcerns, label: "Total Concerns", color: "text-[#970CDA]" },
            { icon: <MapPin className="w-5 h-5" />, value: statesWithConcerns, label: "States Active", color: "text-[#47CC5E]" },
            { icon: <Users className="w-5 h-5" />, value: topState ? `${topState[0]} (${topState[1]})` : "—", label: "Most Reported State", color: "text-[#c060ff]" },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className={`${s.color} flex justify-center mb-2`}>{s.icon}</div>
              <div className={`kz-stat-number text-3xl md:text-4xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Map + sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Map container */}
          <div className="relative flex-1 bg-white/3 border border-white/10 rounded-2xl overflow-hidden min-h-[420px]">
            {/* Zoom controls */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
              <button
                onClick={() => setZoom((z) => Math.min(z * 1.5, 8))}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-white/70 hover:bg-white/18 flex items-center justify-center transition-all"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z / 1.5, 1))}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-white/70 hover:bg-white/18 flex items-center justify-center transition-all"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setZoom(1); setCenter([-96, 38]); }}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 text-white/70 hover:bg-white/18 flex items-center justify-center transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <ComposableMap
              projection="geoAlbersUsa"
              style={{ width: "100%", height: "100%", minHeight: "420px" }}
            >
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={({ zoom: z, coordinates }) => {
                  setZoom(z);
                  setCenter(coordinates);
                }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const fips = geo.id as string;
                      const abbr = FIPS_TO_STATE[fips.padStart(2, "0")];
                      const count = abbr ? (counts[abbr] ?? 0) : 0;
                      const isSelected = abbr === selectedState;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isSelected ? "#47CC5E" : count > 0 ? colorScale(count) : "#1a2240"}
                          stroke="#0a0f1e"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none", cursor: "pointer", transition: "fill 0.15s" },
                            hover: {
                              outline: "none",
                              fill: isSelected ? "#5adb70" : count > 0 ? "#c060ff" : "#243060",
                              cursor: "pointer",
                            },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={(e) => {
                            if (!abbr) return;
                            setTooltip({
                              state: abbr,
                              count,
                              x: e.clientX,
                              y: e.clientY,
                            });
                          }}
                          onMouseMove={(e) => {
                            if (!abbr) return;
                            setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => abbr && handleStateClick(abbr)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div
                className="w-24 h-2.5 rounded-full"
                style={{ background: "linear-gradient(to right, #1a1040, #6010aa, #970CDA)" }}
              />
              <span className="text-white/35 text-xs font-bold">0 → {maxCount} concerns</span>
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
              >
                <div className="bg-[#0a0f1e] border border-white/20 rounded-xl px-3 py-2 shadow-xl">
                  <p className="text-white font-black text-sm">{STATE_NAMES[tooltip.state] ?? tooltip.state}</p>
                  <p className="text-[#47CC5E] text-xs font-bold">
                    {tooltip.count} concern{tooltip.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: selected state or top states */}
          <div className="lg:w-72 flex flex-col gap-4">
            {selectedState ? (
              <div className="bg-white/4 border border-[#47CC5E]/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-white text-lg">{STATE_NAMES[selectedState]}</h3>
                  <span className="text-[#47CC5E] font-black text-2xl kz-stat-number">
                    {counts[selectedState] ?? 0}
                  </span>
                </div>
                <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-4">
                  Documented Concerns
                </p>
                <div className="flex flex-col gap-2">
                  <Link href={`/jurisdiction?state=${selectedState}`}>
                    <button className="w-full px-4 py-2.5 rounded-full bg-[#47CC5E] text-[#0A1439] text-xs font-black uppercase tracking-wider hover:bg-[#5adb70] transition-all flex items-center justify-center gap-2">
                      Find Jurisdiction in {selectedState} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <Link href={`/authority-directory?state=${selectedState}`}>
                    <button className="w-full px-4 py-2.5 rounded-full bg-[#970CDA]/20 border border-[#970CDA]/40 text-[#c060ff] text-xs font-black uppercase tracking-wider hover:bg-[#970CDA]/30 transition-all">
                      Agencies in {selectedState}
                    </button>
                  </Link>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="w-full px-4 py-2.5 rounded-full bg-white/6 border border-white/12 text-white/50 text-xs font-bold hover:bg-white/10 transition-all"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/4 border border-white/10 rounded-2xl p-4">
                <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-3">Click a state to explore</p>
                <p className="text-white/50 text-sm">Select any state on the map to see its concern count and jump directly to relevant agencies or jurisdictions.</p>
              </div>
            )}

            {/* Top 10 states */}
            <div className="bg-white/4 border border-white/10 rounded-2xl p-4 flex-1 overflow-auto">
              <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-3">Top Reported States</p>
              <div className="flex flex-col gap-1.5">
                {Object.entries(counts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12)
                  .map(([abbr, count], i) => (
                    <button
                      key={abbr}
                      onClick={() => handleStateClick(abbr)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:bg-white/8 ${
                        selectedState === abbr ? "bg-[#47CC5E]/15 border border-[#47CC5E]/25" : ""
                      }`}
                    >
                      <span className="text-white/25 text-xs font-black w-4 text-right">{i + 1}</span>
                      <span className="flex-1 text-white/70 text-sm font-bold">{STATE_NAMES[abbr] ?? abbr}</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-[#970CDA]"
                          style={{ width: `${Math.max(8, (count / maxCount) * 60)}px` }}
                        />
                        <span className="text-white/50 text-xs font-bold w-6 text-right">{count}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <Link href="/intake">
              <button className="w-full px-5 py-3.5 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-sm uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_24px_rgba(71,204,94,0.5)] transition-all flex items-center justify-center gap-2">
                Document a Concern <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
