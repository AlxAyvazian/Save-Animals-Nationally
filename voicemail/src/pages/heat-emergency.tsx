import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Thermometer, AlertTriangle, Clock, Copy, Download,
  CheckCircle2, Phone, ChevronDown, ChevronUp, Zap
} from "lucide-react";

const TEMP_DATA = [
  { outside: "70°F (21°C)", tenMin: "89°F", thirtyMin: "104°F", sixtyMin: "113°F" },
  { outside: "75°F (24°C)", tenMin: "94°F", thirtyMin: "109°F", sixtyMin: "120°F" },
  { outside: "80°F (27°C)", tenMin: "99°F", thirtyMin: "114°F", sixtyMin: "123°F" },
  { outside: "85°F (29°C)", tenMin: "104°F", thirtyMin: "119°F", sixtyMin: "128°F" },
  { outside: "90°F (32°C)", tenMin: "109°F", thirtyMin: "124°F", sixtyMin: "133°F" },
  { outside: "95°F (35°C)", tenMin: "114°F", thirtyMin: "129°F", sixtyMin: "138°F" },
];

const HEAT_SIGNS = [
  "Panting heavily or frantically",
  "Excessive drooling",
  "Bright red or pale gums",
  "Lethargy or collapse",
  "Staggering or loss of coordination",
  "Vomiting or diarrhea",
  "Glazed eyes or loss of consciousness",
];

const COLD_SIGNS = [
  "Shivering or trembling",
  "Whimpering or unusual vocalizations",
  "Slowed movement or reluctance to move",
  "Curled body posture (conserving heat)",
  "Pale or blue-tinged skin or gums",
  "Lethargy or unresponsiveness",
];

type WindowLaw = "Yes" | "Limited" | "No info";

interface StateLaw {
  state: string;
  code: string;
  canBreakWindow: WindowLaw;
  note: string;
  hotCarLaw: boolean;
}

const STATE_LAWS: StateLaw[] = [
  { state: "Alabama", code: "AL", canBreakWindow: "No info", note: "No specific hot car rescue law. Document and call 911.", hotCarLaw: false },
  { state: "Alaska", code: "AK", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Arizona", code: "AZ", canBreakWindow: "Yes", note: "ARS § 13-2910 allows officers and civilians to rescue animals. Must call 911 first and remain on scene.", hotCarLaw: true },
  { state: "Arkansas", code: "AR", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "California", code: "CA", canBreakWindow: "Yes", note: "CA Penal Code § 597.7 allows civilians to break window if animal is in danger. Must call 911 first.", hotCarLaw: true },
  { state: "Colorado", code: "CO", canBreakWindow: "Yes", note: "CRS § 18-9-201.5 allows rescue after calling 911. Must remain on scene.", hotCarLaw: true },
  { state: "Connecticut", code: "CT", canBreakWindow: "Yes", note: "CT Gen. Stat. § 22-366a protects civilians who rescue animals from hot vehicles. Must call 911 first.", hotCarLaw: true },
  { state: "Delaware", code: "DE", canBreakWindow: "Yes", note: "DE Code Title 3 § 7904 authorizes rescue from hot vehicles with notification.", hotCarLaw: true },
  { state: "Florida", code: "FL", canBreakWindow: "Yes", note: "FL Stat. § 768.139 protects rescuers from liability. Must call 911 and use minimal force.", hotCarLaw: true },
  { state: "Georgia", code: "GA", canBreakWindow: "No info", note: "No civilian rescue law. Call 911 or animal control immediately.", hotCarLaw: false },
  { state: "Hawaii", code: "HI", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Idaho", code: "ID", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Illinois", code: "IL", canBreakWindow: "Yes", note: "510 ILCS 70/3.03 allows officers and civilians with liability protection to rescue animals.", hotCarLaw: true },
  { state: "Indiana", code: "IN", canBreakWindow: "Yes", note: "IC 35-46-3-7 allows law enforcement to rescue animals; civilian rescuers protected with conditions.", hotCarLaw: true },
  { state: "Iowa", code: "IA", canBreakWindow: "Limited", note: "Authorized officers may rescue. Civilian law unclear — call 911 immediately.", hotCarLaw: false },
  { state: "Kansas", code: "KS", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "Kentucky", code: "KY", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Louisiana", code: "LA", canBreakWindow: "Yes", note: "LA RS § 14:102.1 allows rescue with liability protection. Must call 911 before breaking window.", hotCarLaw: true },
  { state: "Maine", code: "ME", canBreakWindow: "Yes", note: "ME Stat. Title 7 § 4017 protects civilian rescuers. Must call 911 first.", hotCarLaw: true },
  { state: "Maryland", code: "MD", canBreakWindow: "Limited", note: "Law enforcement authorized. Civilian rescue legal with notification. Use minimal force.", hotCarLaw: true },
  { state: "Massachusetts", code: "MA", canBreakWindow: "Yes", note: "MGL c. 272 § 80L allows rescue with liability protection. Must attempt to locate owner first.", hotCarLaw: true },
  { state: "Michigan", code: "MI", canBreakWindow: "Yes", note: "MCL § 750.50b allows civilians to rescue. Must call 911 before breaking window.", hotCarLaw: true },
  { state: "Minnesota", code: "MN", canBreakWindow: "Yes", note: "MN Stat. § 346.57 allows rescue with notification. Must remain on scene.", hotCarLaw: true },
  { state: "Mississippi", code: "MS", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Missouri", code: "MO", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911 immediately.", hotCarLaw: false },
  { state: "Montana", code: "MT", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Nebraska", code: "NE", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "Nevada", code: "NV", canBreakWindow: "Yes", note: "NRS § 574.195 allows rescue with notification. Liability protection applies.", hotCarLaw: true },
  { state: "New Hampshire", code: "NH", canBreakWindow: "Yes", note: "NH RSA § 644:8-aa allows rescue. Must call 911 or animal control first.", hotCarLaw: true },
  { state: "New Jersey", code: "NJ", canBreakWindow: "Yes", note: "NJ Stat. § 4:22-26 authorizes civilian rescue with liability protection.", hotCarLaw: true },
  { state: "New Mexico", code: "NM", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "New York", code: "NY", canBreakWindow: "Limited", note: "Law enforcement authorized. Civilian rescue: consult local ordinances. Call 911 first.", hotCarLaw: false },
  { state: "North Carolina", code: "NC", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "North Dakota", code: "ND", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Ohio", code: "OH", canBreakWindow: "Yes", note: "RC § 959.132 allows civilian rescue with notification. Must call 911 first.", hotCarLaw: true },
  { state: "Oklahoma", code: "OK", canBreakWindow: "Yes", note: "21 O.S. § 1685 authorizes civilian rescue. Must call 911 before breaking window.", hotCarLaw: true },
  { state: "Oregon", code: "OR", canBreakWindow: "Yes", note: "ORS § 167.345 authorizes rescue with liability protection. Must use minimal force.", hotCarLaw: true },
  { state: "Pennsylvania", code: "PA", canBreakWindow: "Limited", note: "Officers authorized. Civilian rescue in gray area — call 911 immediately.", hotCarLaw: false },
  { state: "Rhode Island", code: "RI", canBreakWindow: "Yes", note: "RI Gen. Laws § 4-1-36 allows rescue with notification and minimal force.", hotCarLaw: true },
  { state: "South Carolina", code: "SC", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "South Dakota", code: "SD", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Tennessee", code: "TN", canBreakWindow: "Yes", note: "TCA § 44-17-403 allows civilian rescue with liability protection. Must call 911 first.", hotCarLaw: true },
  { state: "Texas", code: "TX", canBreakWindow: "Yes", note: "TX Penal Code § 28.03 — breaking a window is normally criminal mischief, but health/safety defense applies. Call 911 first.", hotCarLaw: false },
  { state: "Utah", code: "UT", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "Vermont", code: "VT", canBreakWindow: "Yes", note: "13 VSA § 386 allows rescue with notification. Must use minimal force.", hotCarLaw: true },
  { state: "Virginia", code: "VA", canBreakWindow: "No info", note: "No specific civilian rescue law. Call 911.", hotCarLaw: false },
  { state: "Washington", code: "WA", canBreakWindow: "Yes", note: "RCW § 16.52.340 protects civilian rescuers. Must call 911 before breaking window.", hotCarLaw: true },
  { state: "West Virginia", code: "WV", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
  { state: "Wisconsin", code: "WI", canBreakWindow: "Yes", note: "WI Stat. § 175.47 allows rescue with liability protection. Must call 911 first.", hotCarLaw: true },
  { state: "Wyoming", code: "WY", canBreakWindow: "No info", note: "No specific hot car rescue law. Call 911.", hotCarLaw: false },
];

const WINDOW_COLOR: Record<WindowLaw, string> = {
  Yes: "bg-[#47CC5E]/15 text-[#47CC5E] border-[#47CC5E]/30",
  Limited: "bg-white/10 text-white/65 border-white/20",
  "No info": "bg-white/6 text-white/40 border-white/12",
};

function buildIncidentReport(form: {
  date: string; time: string; temp: string;
  location: string; vehicleDesc: string; animalDesc: string; notes: string;
}): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `HEAT / COLD EMERGENCY INCIDENT REPORT
Generated: ${today}
Source: VoiceMap National Animal Protection Portal — Heat/Cold Emergency Tool

INCIDENT DETAILS
Date of observation: ${form.date}
Time of observation: ${form.time}
Approximate outdoor temperature: ${form.temp}
Location: ${form.location}
Vehicle description: ${form.vehicleDesc}
Animal description: ${form.animalDesc}
Additional notes: ${form.notes || "None"}

ACTIONS TAKEN
[ ] Called 911
[ ] Called local Animal Control
[ ] Attempted to locate vehicle owner
[ ] Documented with photos/video
[ ] Remained on scene until authorities arrived

LEGAL NOTICE
This report documents a reported concern requiring investigation by appropriate
authorities. All details are based on the reporter's direct observation. This
document is intended for submission to law enforcement, animal control, and
other appropriate agencies.

Generated by VoiceMap National Animal Protection Portal`;
}

const STEPS = [
  { num: "1", title: "Call 911 immediately", body: "This is a potential emergency. Call 911 and tell them: animal in a vehicle, location, outdoor temperature, signs of distress. Stay on the line." },
  { num: "2", title: "Document everything", body: "Photograph or video the animal, the vehicle (license plate, make, model, color), and any posted windows displaying temperature. Note the exact time." },
  { num: "3", title: "Try to find the owner", body: "Go into nearby businesses and ask staff to announce the license plate. Many situations resolve without window entry. Do not leave the vehicle unattended." },
  { num: "4", title: "Know your state's law", body: "Use the state law guide below. In states with hot car laws, civilians can break a window — but only after calling 911 and using minimal force necessary." },
  { num: "5", title: "Stay on scene", body: "Remain at the vehicle until law enforcement or animal control arrives. Your presence as a witness is essential. Give your documentation to officers on arrival." },
  { num: "6", title: "Document the outcome", body: "Note what action was taken, which officer responded, the case number. File with Agency Tracker if no action is taken." },
];

export default function HeatEmergency() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedState, setSelectedState] = useState<StateLaw | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], time: "", temp: "85°F", location: "", vehicleDesc: "", animalDesc: "", notes: "" });
  const [copied, setCopied] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const dangerLevel = elapsed < 600 ? "moderate" : elapsed < 1800 ? "high" : "critical";
  const dangerColor = dangerLevel === "moderate" ? "text-white/70" : dangerLevel === "high" ? "text-[#c060ff]" : "text-[#c060ff]";

  const filteredStates = STATE_LAWS.filter((s) =>
    !stateSearch || s.state.toLowerCase().includes(stateSearch.toLowerCase()) || s.code.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const report = buildIncidentReport(form);

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
    a.download = `HeatEmergency_Report_${new Date().toISOString().split("T")[0]}.txt`;
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/8 text-white text-xs font-black uppercase tracking-widest mb-5">
            <Thermometer className="w-3.5 h-3.5" />
            Heat / Cold Emergency
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Animal in a Hot Car?<br />
            <span className="text-[#47CC5E]">Act in the Next 60 Seconds.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            A car at 85°F outside can reach 119°F inside in 30 minutes. On-scene guide, state-by-state window entry laws, and a quick incident report generator.
          </p>
        </div>

        {/* EMERGENCY BANNER */}
        <div className="flex flex-col sm:flex-row items-center gap-4 px-5 py-4 rounded-2xl bg-white/6 border border-white/18 mb-8">
          <div className="flex-1">
            <p className="text-white font-black text-lg mb-0.5">If an animal is in visible distress right now:</p>
            <p className="text-white/60 text-sm">Call 911 first. Document second. Break window only if authorized in your state and 911 has been notified.</p>
          </div>
          <a href="tel:911">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#080c1a] font-black text-sm uppercase tracking-wider hover:bg-white/90 transition-all shrink-0">
              <Phone className="w-4 h-4" /> Call 911 Now
            </button>
          </a>
        </div>

        {/* Timer + heat table side by side */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          {/* Stopwatch */}
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
            <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">On-Scene Timer</p>
            <div className="text-center">
              <div className="font-black text-white mb-2" style={{ fontSize: "clamp(3rem, 10vw, 5rem)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </div>
              {elapsed > 0 && (
                <p className={`text-sm font-black mb-3 ${dangerColor}`}>
                  {dangerLevel === "moderate" && "⏱ Conditions deteriorating. Awaiting response."}
                  {dangerLevel === "high" && "⚠ 10+ minutes elapsed. Escalate immediately."}
                  {dangerLevel === "critical" && "⚠ 30+ minutes elapsed — life-threatening. Demand immediate response."}
                </p>
              )}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setRunning((v) => !v)}
                  className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider transition-all ${
                    running
                      ? "bg-white/12 border border-white/20 text-white hover:bg-white/16"
                      : "bg-[#47CC5E] text-[#0A1439] hover:bg-[#5adb70]"
                  }`}
                >
                  {running ? "Pause" : elapsed > 0 ? "Resume" : "Start Timer"}
                </button>
                {elapsed > 0 && (
                  <button onClick={() => { setElapsed(0); setRunning(false); }} className="px-5 py-2.5 rounded-full bg-white/6 border border-white/12 text-white/50 font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                    Reset
                  </button>
                )}
              </div>
              {elapsed === 0 && (
                <p className="text-white/30 text-xs mt-3">Start the timer when you arrive on scene.<br />This documents elapsed time for your report.</p>
              )}
            </div>
          </div>

          {/* Heat table */}
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
            <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">Car Interior Temperature</p>
            <div className="overflow-hidden rounded-xl border border-white/8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8 bg-white/4">
                    <th className="text-left px-3 py-2.5 text-white/40 font-black uppercase tracking-wider">Outside</th>
                    <th className="text-center px-3 py-2.5 text-white/40 font-black uppercase tracking-wider">10 min</th>
                    <th className="text-center px-3 py-2.5 text-white/40 font-black uppercase tracking-wider">30 min</th>
                    <th className="text-center px-3 py-2.5 text-white/40 font-black uppercase tracking-wider">60 min</th>
                  </tr>
                </thead>
                <tbody>
                  {TEMP_DATA.map((row, i) => (
                    <tr key={row.outside} className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                      <td className="px-3 py-2 text-white/70 font-bold">{row.outside}</td>
                      <td className="px-3 py-2 text-center text-white/55">{row.tenMin}</td>
                      <td className="px-3 py-2 text-center text-[#c060ff] font-bold">{row.thirtyMin}</td>
                      <td className="px-3 py-2 text-center font-black text-[#c060ff]">{row.sixtyMin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-white/30 text-xs mt-2">A dog&#39;s body temperature above 104°F causes heat stroke. Above 107°F is often fatal.</p>
          </div>
        </div>

        {/* Step by step */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">What to do — step by step</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white/4 border border-white/10 rounded-2xl p-4 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#47CC5E]/15 border border-[#47CC5E]/30 flex items-center justify-center text-[#47CC5E] font-black text-sm shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="text-white font-black text-sm mb-1">{step.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distress signs */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-4 h-4 text-[#c060ff]" />
              <p className="text-white font-black text-sm">Signs of Heat Distress</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {HEAT_SIGNS.map((sign) => (
                <div key={sign} className="flex gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#c060ff] shrink-0 mt-0.5" />
                  <p className="text-white/65 text-xs">{sign}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/4 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="w-4 h-4 text-[#47CC5E]/70" />
              <p className="text-white font-black text-sm">Signs of Cold Distress</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {COLD_SIGNS.map((sign) => (
                <div key={sign} className="flex gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                  <p className="text-white/65 text-xs">{sign}</p>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-xs mt-3 pt-3 border-t border-white/8">
              In cold emergencies: do not rub frozen limbs. Warm the animal gradually with blankets and your body heat. Get to a vet immediately.
            </p>
          </div>
        </div>

        {/* State laws */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button
            className="w-full px-5 py-4 flex items-center justify-between text-left"
            onClick={() => setShowTable((v) => !v)}
          >
            <div>
              <p className="text-white font-black text-base">State Hot Car Laws — All 50 States</p>
              <p className="text-white/40 text-sm mt-0.5">
                {STATE_LAWS.filter((s) => s.canBreakWindow === "Yes").length} states allow civilian window entry ·
                {" "}{STATE_LAWS.filter((s) => s.hotCarLaw).length} have specific hot car laws
              </p>
            </div>
            {showTable ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
          </button>

          {showTable && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  className="bg-white/6 border border-white/12 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
                  placeholder="Search state..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                />
                <div className="flex gap-1.5 flex-wrap">
                  {(["Yes", "Limited", "No info"] as WindowLaw[]).map((v) => (
                    <span key={v} className={`px-2.5 py-1 rounded-full text-xs font-black border ${WINDOW_COLOR[v]}`}>
                      {v === "Yes" ? "Can break window" : v === "Limited" ? "Officers only" : "Call 911"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {filteredStates.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => setSelectedState(selectedState?.code === s.code ? null : s)}
                    className={`text-left rounded-xl border px-4 py-3 transition-all ${
                      selectedState?.code === s.code
                        ? "border-[#47CC5E]/30 bg-[#47CC5E]/8"
                        : "border-white/8 bg-white/3 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-black text-xs w-6">{s.code}</span>
                      <span className="text-white/70 font-bold text-xs flex-1">{s.state}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${WINDOW_COLOR[s.canBreakWindow]}`}>
                        {s.canBreakWindow === "Yes" ? "Can break window" : s.canBreakWindow === "Limited" ? "Officers only" : "No specific law"}
                      </span>
                    </div>
                    {selectedState?.code === s.code && (
                      <p className="text-white/60 text-xs mt-2 leading-relaxed">{s.note}</p>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-white/25 text-xs mt-3">Laws change. Always call 911 before breaking any window. This guide is for informational purposes — it is not legal advice.</p>
            </div>
          )}
        </div>

        {/* Quick incident report */}
        <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <button
            className="w-full px-5 py-4 flex items-center justify-between text-left"
            onClick={() => setShowForm((v) => !v)}
          >
            <div>
              <p className="text-white font-black text-base">Quick Incident Report</p>
              <p className="text-white/40 text-sm mt-0.5">Generate a formal report for law enforcement and agency submission</p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#47CC5E] shrink-0" />
              {showForm ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
            </div>
          </button>

          {showForm && (
            <div className="border-t border-white/8 px-5 pb-5 pt-4">
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {([
                  ["date", "Date", "date"],
                  ["time", "Time observed", "time"],
                  ["temp", "Outdoor temperature", "text"],
                  ["location", "Vehicle location (address or description)", "text"],
                  ["vehicleDesc", "Vehicle (make, model, color, plate)", "text"],
                  ["animalDesc", "Animal description", "text"],
                ] as [keyof typeof form, string, string][]).map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">{label}</label>
                    <input
                      type={type}
                      className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-white/50 text-xs font-black uppercase tracking-widest mb-1.5">Additional notes</label>
                  <textarea
                    rows={2}
                    className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all resize-none"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>
              <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-4 font-mono text-xs text-white/60 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto mb-3">
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

        {/* After rescue */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-4">After the rescue — what to do next</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Get the animal to a vet immediately", body: "Even if the animal appears to have recovered, heat stroke causes internal damage that is not always visible. A vet evaluation is essential." },
              { title: "File a report even if the animal was rescued", body: "If AC or law enforcement arrived and found the animal in distress, file a formal report for the record. Use the Agency Tracker to log their response." },
              { title: "Track the outcome", body: "If charges are not filed against the owner: log this in the Agency Tracker. Repeat offenders must have a documented history for prosecution to proceed." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#47CC5E] mt-2 shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
