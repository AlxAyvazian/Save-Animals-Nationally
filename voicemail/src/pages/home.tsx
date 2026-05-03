import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter, PawPrint } from "@/components/paw-prints";
import { Link } from "wouter";
import {
  ArrowRight, FileSearch, MapPin, Printer, TrendingUp, ShieldCheck,
  Heart, Building2, Activity, Archive, BookOpen, Zap, FileText,
  Globe, ChevronRight
} from "lucide-react";

const STATS = [
  { number: "247", label: "Concerns Documented" },
  { number: "50", label: "States Covered" },
  { number: "29+", label: "Advocacy Tools" },
  { number: "100%", label: "Free to Use" },
];

const CORE_FEATURES = [
  {
    title: "Document Evidence",
    description: "Record alleged incidents with precise location, timeline, and evidence notes. Structured, responsible documentation.",
    icon: <FileSearch className="w-7 h-7" />,
    color: "text-[#970CDA]",
    bg: "bg-[#970CDA]/15 border border-[#970CDA]/30",
    href: "/intake",
  },
  {
    title: "Identify Jurisdiction",
    description: "Interactive questionnaire determines which local, state, or federal agencies handle your specific concern.",
    icon: <MapPin className="w-7 h-7" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/12 border border-[#47CC5E]/25",
    href: "/jurisdiction",
  },
  {
    title: "Generate Reports",
    description: "One-click report packets with agency letters, email templates, media tips, and formal complaint drafts.",
    icon: <Printer className="w-7 h-7" />,
    color: "text-[#970CDA]",
    bg: "bg-[#970CDA]/15 border border-[#970CDA]/30",
    href: "/report-packet",
  },
  {
    title: "Stray & At-Risk Tools",
    description: "High-kill shelter alerts, euthanasia concern letters, TNR program requests, and emergency foster network outreach.",
    icon: <Heart className="w-7 h-7" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/12 border border-[#47CC5E]/25",
    href: "/stray-tools",
  },
  {
    title: "Detect Patterns",
    description: "Automatically surface repeated locations, animal types, and incident clusters — and generate systemic concern reports.",
    icon: <TrendingUp className="w-7 h-7" />,
    color: "text-[#970CDA]",
    bg: "bg-[#970CDA]/15 border border-[#970CDA]/30",
    href: "/pattern-detector",
  },
  {
    title: "Shelter Accountability",
    description: "Track alleged welfare concerns at specific shelters over time, manage follow-ups, and generate formal complaint letters.",
    icon: <Building2 className="w-7 h-7" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/12 border border-[#47CC5E]/25",
    href: "/shelter-tracker",
  },
];

const NEW_FEATURES = [
  {
    label: "NEW",
    title: "Pet Theft & Recovery",
    description: "24-hour first-response timeline, all 6 national microchip registries, platform list, and police report generator for alleged pet theft.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/10 border-[#47CC5E]/25",
    href: "/pet-theft",
  },
  {
    label: "NEW",
    title: "Hoarding Response Guide",
    description: "Warning signs, 8-item documentation checklist, multi-agency escalation guide, complaint letter generator, and post-seizure advocacy tips.",
    icon: <BookOpen className="w-6 h-6" />,
    color: "text-[#c060ff]",
    bg: "bg-[#970CDA]/10 border-[#970CDA]/25",
    href: "/hoarding-response",
  },
  {
    label: "NEW",
    title: "Anonymous Reporting Safety",
    description: "Three reporting safety levels, legal protection guide, ag-gag state tracker, anonymous channel directory, and pre-submission safety checklist.",
    icon: <Archive className="w-6 h-6" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/10 border-[#47CC5E]/25",
    href: "/anonymous-tips",
  },
  {
    label: "NEW",
    title: "Puppy Mill Complaints",
    description: "USDA APHIS complaint walkthrough, breeder database lookup guide, state licensing notes, and USDA complaint letter generator.",
    icon: <Building2 className="w-6 h-6" />,
    color: "text-[#c060ff]",
    bg: "bg-[#970CDA]/10 border-[#970CDA]/25",
    href: "/puppy-mill-guide",
  },
  {
    label: "NEW",
    title: "Social Media Campaign",
    description: "4-phase campaign strategy, platform-specific post templates with hashtag builder, official tagging guide, and media outreach tips.",
    icon: <Zap className="w-6 h-6" />,
    color: "text-[#47CC5E]",
    bg: "bg-[#47CC5E]/10 border-[#47CC5E]/25",
    href: "/social-campaign",
  },
  {
    label: "NEW",
    title: "Media Contact Directory",
    description: "65 national and regional media outlets — TV newsdesks, investigative reporters, animal welfare press — with tip email generator.",
    icon: <Globe className="w-6 h-6" />,
    color: "text-[#c060ff]",
    bg: "bg-[#970CDA]/10 border-[#970CDA]/25",
    href: "/media-contacts",
  },
];

const WORKFLOW_STEPS = [
  { step: "01", label: "Document", desc: "Log the concern with evidence", href: "/intake", color: "text-[#47CC5E]" },
  { step: "02", label: "File", desc: "Contact the right agencies", href: "/agency-tracker", color: "text-white/60" },
  { step: "03", label: "Track", desc: "Monitor responses & deadlines", href: "/agency-tracker", color: "text-white/60" },
  { step: "04", label: "Escalate", desc: "Media, legislators, federal", href: "/action-plan", color: "text-white/60" },
  { step: "05", label: "Submit", desc: "Unified case file anywhere", href: "/case-summary", color: "text-[#970CDA]" },
];

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      <AnimatedBackgroundOrbs />
      <Navigation />

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center pt-16 overflow-hidden">
        <PawPrintScatter count={8} baseColor="white" />
        <div className="absolute top-1/4 left-[-60px] pointer-events-none">
          <PawPrint size={180} opacity={0.04} rotate={25} color="#970CDA" />
        </div>
        <div className="absolute bottom-1/4 right-[-60px] pointer-events-none">
          <PawPrint size={200} opacity={0.04} rotate={-15} color="#47CC5E" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-8 relative">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47CC5E] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47CC5E]" />
          </span>
          National Public Interest Portal
        </div>

        <h1 className="font-black text-white leading-[0.92] tracking-tight mb-6 relative"
          style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}>
          A National<br />
          <span className="text-[#970CDA]">Voice</span> for<br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)" }}
          >
            Animals.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed mb-10 font-medium relative">
          Document concerns, organize evidence, and help animal welfare issues reach the right people — responsibly, legally, and effectively.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 relative">
          <Link href="/intake">
            <button className="px-8 py-4 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-sm uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_32px_rgba(71,204,94,0.6)] transition-all active:scale-95 flex items-center gap-2">
              Document a Concern <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/action-plan">
            <button className="px-8 py-4 rounded-full bg-[#970CDA] text-white font-black text-sm uppercase tracking-wider hover:bg-[#aa20ef] hover:shadow-[0_0_32px_rgba(151,12,218,0.6)] transition-all active:scale-95 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Get My Action Plan
            </button>
          </Link>
          <Link href="/stray-tools">
            <button className="px-8 py-4 rounded-full bg-white/8 text-white/80 border border-white/15 font-bold text-sm uppercase tracking-wider hover:bg-white/14 hover:text-white transition-all active:scale-95">
              Stray &amp; At-Risk Tools
            </button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/60" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Scroll</span>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="relative bg-[#970CDA]/20 border-y border-[#970CDA]/30 py-10 px-4 overflow-hidden">
        <PawPrintScatter count={4} baseColor="#970CDA" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="kz-stat-number text-5xl md:text-6xl text-white mb-1">{s.number}</div>
              <div className="text-white/55 text-xs font-bold uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WORKFLOW STEPS ─── */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-3">The Full Escalation Pipeline</p>
            <h2 className="font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              From Documentation to<br />
              <span className="text-[#970CDA]">Accountable Action.</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-0 overflow-hidden rounded-2xl border border-white/10">
            {WORKFLOW_STEPS.map((w, idx) => (
              <Link key={w.step} href={w.href} className="flex-1">
                <div className="group relative h-full flex flex-col items-center text-center px-4 py-5 bg-white/3 hover:bg-white/6 border-r border-white/8 last:border-r-0 transition-all cursor-pointer sm:border-r sm:border-b-0 border-b">
                  <span className={`text-xs font-black uppercase tracking-widest mb-2 ${w.color}`}>{w.step}</span>
                  <p className="text-white font-black text-sm mb-1">{w.label}</p>
                  <p className="text-white/40 text-xs leading-snug">{w.desc}</p>
                  {idx < WORKFLOW_STEPS.length - 1 && (
                    <ChevronRight className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 text-white/20 z-10" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW FEATURES BAND ─── */}
      <section className="relative py-16 px-4 overflow-hidden bg-[#47CC5E]/5 border-y border-[#47CC5E]/12">
        <PawPrintScatter count={4} baseColor="#47CC5E" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <p className="text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-3">Recently Added</p>
            <h2 className="font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              New tools.<br />
              <span className="text-[#47CC5E]">Bigger impact.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEW_FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <div className="group flex flex-col gap-3 p-5 rounded-2xl bg-white/4 border border-white/10 hover:bg-white/7 hover:border-white/20 transition-all cursor-pointer h-full">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.bg} ${f.color}`}>
                      {f.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#47CC5E]/15 text-[#47CC5E] border border-[#47CC5E]/30 text-xs font-black">{f.label}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white mb-1 group-hover:text-white transition-colors">{f.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.description}</p>
                  </div>
                  <div className={`mt-auto text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORE FEATURES ─── */}
      <section className="relative py-24 px-4 overflow-hidden">
        <PawPrintScatter count={5} baseColor="#47CC5E" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-3">Core Tools</p>
            <h2 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight">
              Every tool you need.<br />
              <span className="text-[#970CDA]">None you don't.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORE_FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white/4 border border-white/10 hover:bg-white/7 hover:border-white/20 transition-all cursor-pointer h-full">
                  <div className={`w-13 h-13 rounded-xl flex items-center justify-center ${f.bg} ${f.color} shrink-0`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-1.5 group-hover:text-white transition-colors">{f.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{f.description}</p>
                  </div>
                  <div className={`mt-auto text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Open Tool <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MISSION BAND ─── */}
      <section className="relative bg-[#47CC5E]/10 border-y border-[#47CC5E]/20 py-20 px-4 overflow-hidden">
        <PawPrintScatter count={4} baseColor="#47CC5E" />
        <div className="max-w-4xl mx-auto text-center relative">
          <ShieldCheck className="w-12 h-12 text-[#47CC5E] mx-auto mb-6" />
          <h2 className="font-black text-white text-3xl md:text-4xl leading-tight tracking-tight mb-5">
            Responsible Documentation.<br />
            <span className="text-[#47CC5E]">Not Public Shaming.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            VoiceMap uses careful language throughout — <em className="text-white/80">alleged</em>, <em className="text-white/80">reported</em>, <em className="text-white/80">requires investigation</em>. We support accountability through proper channels, never vigilantism.
          </p>
          <Link href="/resources">
            <button className="px-7 py-3 rounded-full border-2 border-[#47CC5E]/50 text-[#47CC5E] font-black text-sm uppercase tracking-wider hover:border-[#47CC5E] hover:shadow-[0_0_20px_rgba(71,204,94,0.3)] transition-all">
              Read Our Guidelines
            </button>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <PawPrintScatter count={6} baseColor="white" />
        <div className="max-w-2xl mx-auto relative">
          <p className="text-[#970CDA] text-xs font-black uppercase tracking-widest mb-4">Start Here</p>
          <h2 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-6">
            Ready to make your<br />
            <span className="text-[#47CC5E]">voice heard?</span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/intake">
              <button className="px-8 py-4 rounded-full bg-[#47CC5E] text-[#0A1439] font-black text-sm uppercase tracking-wider hover:bg-[#5adb70] hover:shadow-[0_0_32px_rgba(71,204,94,0.6)] transition-all active:scale-95 flex items-center gap-2">
                Document a Concern <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/action-plan">
              <button className="px-8 py-4 rounded-full bg-[#970CDA] text-white font-black text-sm uppercase tracking-wider hover:bg-[#aa20ef] hover:shadow-[0_0_32px_rgba(151,12,218,0.6)] transition-all active:scale-95 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Get My Action Plan
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
