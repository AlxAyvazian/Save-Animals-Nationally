import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import {
  Phone, Globe, Mail, Search, ExternalLink,
  Shield, Scale, Heart, Zap, BookOpen, Building2
} from "lucide-react";

type ResourceCategory =
  | "Emergency Hotlines"
  | "Federal Reporting"
  | "Legal Aid"
  | "National Organizations"
  | "Low-Cost Vet Assistance"
  | "Anonymous Tip Lines"
  | "Advocacy & Media";

interface Resource {
  name: string;
  category: ResourceCategory;
  description: string;
  phone?: string;
  website?: string;
  email?: string;
  availability?: string;
  notes?: string;
  urgent?: boolean;
}

const CATEGORY_ICONS: Record<ResourceCategory, React.ReactNode> = {
  "Emergency Hotlines":     <Phone className="w-4 h-4" />,
  "Federal Reporting":      <Building2 className="w-4 h-4" />,
  "Legal Aid":              <Scale className="w-4 h-4" />,
  "National Organizations": <Globe className="w-4 h-4" />,
  "Low-Cost Vet Assistance": <Heart className="w-4 h-4" />,
  "Anonymous Tip Lines":    <Shield className="w-4 h-4" />,
  "Advocacy & Media":       <Zap className="w-4 h-4" />,
};

const CATEGORY_COLOR: Record<ResourceCategory, string> = {
  "Emergency Hotlines":     "bg-white/12 text-white/80 border-white/20",
  "Federal Reporting":      "bg-[#970CDA]/12 text-[#c060ff] border-[#970CDA]/25",
  "Legal Aid":              "bg-[#47CC5E]/12 text-[#47CC5E] border-[#47CC5E]/25",
  "National Organizations": "bg-[#47CC5E]/8 text-[#47CC5E]/80 border-[#47CC5E]/18",
  "Low-Cost Vet Assistance": "bg-[#47CC5E]/12 text-[#47CC5E] border-[#47CC5E]/25",
  "Anonymous Tip Lines":    "bg-[#970CDA]/12 text-[#c060ff] border-[#970CDA]/25",
  "Advocacy & Media":       "bg-white/8 text-white/60 border-white/14",
};

const RESOURCES: Resource[] = [
  // Emergency Hotlines
  {
    name: "ASPCA Animal Poison Control Center",
    category: "Emergency Hotlines",
    description: "24/7 emergency toxicology hotline for animals who have ingested potentially toxic substances. Staffed by veterinary toxicologists. Consultation fee may apply.",
    phone: "888-426-4435",
    website: "https://www.aspca.org/pet-care/animal-poison-control",
    availability: "24/7, 365 days",
    notes: "Consultation fee: $95. Keep the number saved in your phone.",
    urgent: true,
  },
  {
    name: "Pet Poison Helpline",
    category: "Emergency Hotlines",
    description: "24/7 animal poison control resource covering dogs, cats, birds, small animals. Alternative to ASPCA hotline.",
    phone: "855-764-7661",
    website: "https://www.petpoisonhelpline.com",
    availability: "24/7",
    notes: "Consultation fee applies. Have your vet's number ready.",
    urgent: true,
  },
  {
    name: "HSUS Animal Cruelty Hotline",
    category: "Emergency Hotlines",
    description: "Report alleged animal cruelty, fighting, or neglect to HSUS investigators. Tips forwarded to field investigators and law enforcement.",
    phone: "866-720-2676",
    website: "https://www.humanesociety.org/report-cruelty",
    availability: "Business hours; online 24/7",
    notes: "For immediate emergencies involving imminent danger, call 911 first.",
  },
  {
    name: "ASPCA Report Animal Cruelty",
    category: "Emergency Hotlines",
    description: "Report alleged animal cruelty to ASPCA investigators. Available online and by phone.",
    website: "https://www.aspca.org/animal-cruelty/report-animal-cruelty",
    availability: "Online 24/7",
  },

  // Federal Reporting
  {
    name: "USDA APHIS Animal Care — File a Complaint",
    category: "Federal Reporting",
    description: "File complaints about licensed facilities regulated under the Animal Welfare Act — research labs, commercial breeders, dealers, exhibitors, transporters. USDA-licensed entities are subject to federal inspection.",
    website: "https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare/SA_Contact_APHIS_Animal_Care",
    phone: "844-820-2234",
    availability: "Business hours",
    notes: "Covers USDA-licensed facilities. Use FOIA to request inspection reports for specific licensees.",
  },
  {
    name: "FBI Internet Crime Complaint Center (IC3)",
    category: "Federal Reporting",
    description: "File tips related to animal fighting rings, which are federal felonies under 7 U.S.C. § 2156. Can also be used for organized cruelty operations with interstate connections.",
    website: "https://www.ic3.gov",
    availability: "Online 24/7",
    notes: "For organized animal fighting operations. Include all documented evidence.",
  },
  {
    name: "Federal Bureau of Investigation (FBI) Tips",
    category: "Federal Reporting",
    description: "Submit tips about federal animal welfare crimes — animal fighting (federal felony), interstate transport of fighting animals, or operations with federal nexus.",
    website: "https://tips.fbi.gov",
    phone: "800-CALL-FBI",
    availability: "Online 24/7; phone during business hours",
    notes: "Animal fighting is a federal felony. Cases with documented evidence and prior state-level non-response are strongest candidates.",
  },
  {
    name: "USDA Office of Inspector General — Report Fraud",
    category: "Federal Reporting",
    description: "Report fraud, waste, abuse, or misconduct at USDA-supervised facilities, including failure to enforce Animal Welfare Act provisions by USDA inspectors.",
    website: "https://www.usda.gov/oig/hotline.htm",
    phone: "800-424-9121",
    availability: "Business hours",
    notes: "Use if you believe USDA inspectors are failing to act on documented violations.",
  },

  // Legal Aid
  {
    name: "Animal Legal Defense Fund (ALDF)",
    category: "Legal Aid",
    description: "The nation's leading animal protection legal organization. Provides attorney referrals, files lawsuits against animal abusers, and supports prosecutors. Free resources for advocates.",
    website: "https://aldf.org",
    email: "info@aldf.org",
    phone: "707-795-2533",
    availability: "Business hours",
    notes: "Use ALDF's attorney referral network to find local animal law attorneys. ALDF also offers free legal consultations for complex cases.",
  },
  {
    name: "Humane Society Legislative Fund — Legal Resources",
    category: "Legal Aid",
    description: "Political and legal advocacy arm of HSUS. Provides resources on state and federal animal welfare laws and can assist with legislative-level escalation.",
    website: "https://www.hslf.org",
    availability: "Online resources 24/7",
  },
  {
    name: "Lawyers for Animals (ABA Companion Animal Task Force)",
    category: "Legal Aid",
    description: "American Bar Association task force focused on companion animal legal issues. Find attorneys in your state who take animal law cases.",
    website: "https://www.americanbar.org/groups/animal_law/",
    availability: "Online directory",
    notes: "Use the ABA directory to find animal law attorneys by state.",
  },
  {
    name: "Nonhuman Rights Project",
    category: "Legal Aid",
    description: "Legal organization seeking personhood rights for cognitively complex animals. Relevant for cases involving chimpanzees, elephants, whales, and dolphins.",
    website: "https://www.nonhumanrights.org",
    availability: "Online",
  },

  // National Organizations
  {
    name: "Humane Society of the United States (HSUS)",
    category: "National Organizations",
    description: "Largest animal protection organization in the US. Conducts field investigations, supports law enforcement, lobbies for legislation, and coordinates national cruelty response.",
    website: "https://www.humanesociety.org",
    phone: "202-452-1100",
    availability: "Business hours",
    notes: "Submit documented cases through their online tip form. HSUS investigators work with law enforcement on complex cases.",
  },
  {
    name: "ASPCA (American Society for the Prevention of Cruelty to Animals)",
    category: "National Organizations",
    description: "Leading national humane organization. Conducts cruelty investigations, provides forensic expertise to prosecutors, and offers a national animal cruelty reporting portal.",
    website: "https://www.aspca.org",
    phone: "212-876-7700",
    availability: "Business hours",
    notes: "The ASPCA Humane Law Enforcement team operates primarily in NYC but partners nationally.",
  },
  {
    name: "Best Friends Animal Society",
    category: "National Organizations",
    description: "Major national organization focused on ending killing in shelters. Resources for shelter reform, foster networks, and spay/neuter programs.",
    website: "https://bestfriends.org",
    availability: "Online 24/7",
    notes: "Excellent resource for shelter-related concerns and No Kill advocacy.",
  },
  {
    name: "National Animal Care & Control Association (NACA)",
    category: "National Organizations",
    description: "Professional association for animal control officers. Contact NACA to report unprofessional or inadequate conduct by animal control agencies.",
    website: "https://www.nacanet.org",
    availability: "Online",
    notes: "Useful when filing complaints about animal control agency conduct or non-response.",
  },

  // Low-Cost Vet Assistance
  {
    name: "RedRover Relief — Emergency Financial Assistance",
    category: "Low-Cost Vet Assistance",
    description: "Emergency financial assistance grants for pet owners facing unexpected vet bills due to illness or injury. Also assists with domestic violence situations involving pets.",
    website: "https://redrover.org/relief/",
    availability: "Applications online",
    notes: "Apply online. Grants are competitive — apply as soon as a vet bill arises.",
  },
  {
    name: "The Pet Fund",
    category: "Low-Cost Vet Assistance",
    description: "Non-profit providing financial assistance to owners of companion animals who need veterinary care for non-basic, non-emergency conditions (cancer, heart disease, diabetes).",
    website: "https://www.thepetfund.com",
    availability: "Applications online",
  },
  {
    name: "Brown Dog Foundation",
    category: "Low-Cost Vet Assistance",
    description: "Financial assistance for pets diagnosed with serious illnesses who would otherwise be euthanized due to lack of funds. Focus on cancer and other life-threatening conditions.",
    website: "https://www.browndogfoundation.org",
    availability: "Applications online",
  },
  {
    name: "Frankie's Friends",
    category: "Low-Cost Vet Assistance",
    description: "Veterinary care grants for pets with serious illness whose owners cannot afford treatment. Partner veterinary hospitals nationwide.",
    website: "https://frankiesfriends.org",
    availability: "Applications online",
  },
  {
    name: "ASPCA Free Spay/Neuter Services",
    category: "Low-Cost Vet Assistance",
    description: "ASPCA's national database of low-cost and free spay/neuter programs by location. Updated regularly.",
    website: "https://www.aspca.org/pet-care/general-pet-care/low-cost-spayneuter-programs",
    availability: "Online directory 24/7",
  },
  {
    name: "Care Credit — Veterinary Financing",
    category: "Low-Cost Vet Assistance",
    description: "Healthcare credit card accepted at most veterinary offices. Offers deferred interest promotional financing for vet bills.",
    website: "https://www.carecredit.com/vetmed/",
    availability: "Applications online",
    notes: "Not a grant — this is a credit product. Helpful for managing large unexpected bills.",
  },

  // Anonymous Tip Lines
  {
    name: "HSUS Animal Fighting Taskforce Tip Line",
    category: "Anonymous Tip Lines",
    description: "Anonymous tip line specifically for reporting alleged animal fighting operations — dogfighting, cockfighting, hog-dog rodeos. Tips go directly to HSUS investigators working with law enforcement.",
    phone: "877-645-5847",
    website: "https://www.humanesociety.org/resources/report-animal-fighting",
    availability: "24/7",
    notes: "Completely anonymous. Animal fighting is a federal felony. Tip line staffed by investigators, not answering machines.",
    urgent: true,
  },
  {
    name: "Crime Stoppers USA — Anonymous Tips",
    category: "Anonymous Tip Lines",
    description: "National anonymous tip network. Local Crime Stoppers chapters can accept tips about animal cruelty and fighting operations. Some offer cash rewards.",
    website: "https://www.crimestoppers.org",
    phone: "800-222-8477",
    availability: "24/7",
    notes: "Local chapters vary. Search for your county's Crime Stoppers for the most relevant line.",
  },
  {
    name: "USDA APHIS Tip Line",
    category: "Anonymous Tip Lines",
    description: "Report suspected Animal Welfare Act violations — puppy mills, research labs, commercial exhibitors — anonymously to USDA APHIS.",
    website: "https://www.aphis.usda.gov/aphis/ourfocus/animalwelfare",
    phone: "844-820-2234",
    availability: "Business hours",
  },
  {
    name: "FBI Anonymous Tip Submission",
    category: "Anonymous Tip Lines",
    description: "Submit anonymous tips to the FBI regarding federal crimes including animal fighting, interstate animal trafficking, and organized cruelty.",
    website: "https://tips.fbi.gov",
    availability: "24/7 online",
    notes: "Do not use FBI for local/state cruelty cases. Use for operations with clear federal nexus.",
  },

  // Advocacy & Media
  {
    name: "The Dodo",
    category: "Advocacy & Media",
    description: "Major digital animal welfare media outlet. The Dodo publishes advocacy stories and investigative pieces with enormous reach (100M+ monthly readers). Strong interest in shelter reform and rescue stories.",
    website: "https://www.thedodo.com",
    email: "tips@thedodo.com",
    availability: "Online tips 24/7",
    notes: "Submit documented tip with photos/video. Include a clear story angle.",
  },
  {
    name: "Animal Wellness Magazine",
    category: "Advocacy & Media",
    description: "Print and digital animal wellness publication. Accepts tips and pitches about animal welfare issues, emerging legislation, and health research.",
    website: "https://www.animalwellnessmagazine.com",
    availability: "Online",
  },
  {
    name: "Dogs Naturally Magazine",
    category: "Advocacy & Media",
    description: "Large readership publication focused on holistic dog care and advocacy. Receptive to stories about shelter reform, legislation, and corporate accountability.",
    website: "https://www.dogsnaturallymagazine.com",
    availability: "Online",
  },
  {
    name: "National Public Radio (NPR) — Investigations",
    category: "Advocacy & Media",
    description: "NPR's investigations and features teams have covered animal welfare issues extensively. Documented cases with FOIA records and agency non-response are strong pitches.",
    website: "https://www.npr.org/about-npr/179876898/tips",
    availability: "Online tips 24/7",
  },
  {
    name: "ProPublica — Tip Line",
    category: "Advocacy & Media",
    description: "Major investigative journalism outlet. Has covered USDA enforcement failures and shelter accountability. Strong interest in documented institutional non-response.",
    website: "https://www.propublica.org/tips",
    availability: "Online 24/7; secure submission via SecureDrop",
    notes: "Best suited for systemic cases with documented government failure.",
  },
];

const ALL_CATEGORIES = [
  "Emergency Hotlines", "Federal Reporting", "Legal Aid",
  "National Organizations", "Low-Cost Vet Assistance",
  "Anonymous Tip Lines", "Advocacy & Media",
] as ResourceCategory[];

export default function NationalResources() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return RESOURCES.filter((r) => {
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.notes ?? "").toLowerCase().includes(q);
      const matchCat = activeCategory === "All" || r.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const byCategory = useMemo(() => {
    const map: Partial<Record<ResourceCategory, Resource[]>> = {};
    for (const r of filtered) {
      map[r.category] = [...(map[r.category] ?? []), r];
    }
    return map;
  }, [filtered]);

  const urgentCount = RESOURCES.filter((r) => r.urgent).length;

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            National Resource Directory
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Every Number.<br />
            <span className="text-[#47CC5E]">Every Portal. Every Org.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            {RESOURCES.length} verified national resources — emergency hotlines, federal reporting portals, legal aid, anonymous tip lines, low-cost vet assistance, and advocacy media contacts. All in one place.
          </p>
        </div>

        {/* Urgent resources */}
        <div className="mb-8">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest mb-3">Need help right now</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {RESOURCES.filter((r) => r.urgent).map((r) => (
              <div key={r.name} className="bg-white/5 border border-white/18 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white/70">
                  {CATEGORY_ICONS[r.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm leading-snug">{r.name}</p>
                  {r.phone && (
                    <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 mt-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#47CC5E]" />
                      <span className="text-[#47CC5E] font-black text-sm">{r.phone}</span>
                    </a>
                  )}
                  {r.availability && <p className="text-white/35 text-xs mt-0.5">{r.availability}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Resources", value: RESOURCES.length },
            { label: "Emergency Hotlines", value: RESOURCES.filter((r) => r.urgent).length },
            { label: "Federal Portals", value: RESOURCES.filter((r) => r.category === "Federal Reporting").length },
            { label: "Legal Aid Orgs", value: RESOURCES.filter((r) => r.category === "Legal Aid").length },
          ].map((s) => (
            <div key={s.label} className="bg-white/4 border border-white/10 rounded-2xl p-4 text-center">
              <div className="kz-stat-number text-3xl text-white mb-1">{s.value}</div>
              <div className="text-white/40 text-xs font-bold leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              className="w-full bg-white/6 border border-white/12 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
              placeholder="Search resources by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => setActiveCategory("All")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all ${
              activeCategory === "All"
                ? "bg-[#970CDA]/20 border-[#970CDA]/40 text-[#c060ff]"
                : "bg-white/5 border-white/10 text-white/45 hover:bg-white/8 hover:text-white"
            }`}
          >
            All ({RESOURCES.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition-all ${
                  activeCategory === cat
                    ? "bg-[#970CDA]/20 border-[#970CDA]/40 text-[#c060ff]"
                    : "bg-white/5 border-white/10 text-white/45 hover:bg-white/8 hover:text-white"
                }`}
              >
                {CATEGORY_ICONS[cat]}
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-white/30 text-xs font-black uppercase tracking-widest mb-4">
          {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>

        {/* Resource sections by category */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/3 border border-white/8 rounded-2xl">
            <Search className="w-10 h-10 mx-auto mb-3 text-white/20" />
            <p className="text-white/50 font-black">No resources match your search</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {ALL_CATEGORIES.filter((cat) => byCategory[cat]?.length).map((cat) => {
              const catResources = byCategory[cat] ?? [];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${CATEGORY_COLOR[cat]}`}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <h2 className="text-white font-black text-lg">{cat}</h2>
                    <span className="text-white/30 text-xs font-bold">{catResources.length}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {catResources.map((r) => (
                      <ResourceCard key={r.name} resource={r} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/8">
          <BookOpen className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
          <p className="text-white/35 text-xs leading-relaxed">
            This directory is maintained for public information purposes. Resource availability, phone numbers, and services may change. Always verify contact information directly with the organization.
            For emergencies involving immediate danger to an animal or person, call 911 first.
          </p>
        </div>
      </main>
    </div>
  );
}

function ResourceCard({ resource: r }: { resource: Resource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white/4 border rounded-2xl overflow-hidden hover:border-white/16 transition-all ${r.urgent ? "border-white/18" : "border-white/10"}`}>
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-white font-black text-sm leading-snug">{r.name}</p>
              {r.urgent && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/20 text-xs font-black shrink-0">Urgent</span>
              )}
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap gap-3 mb-2">
              {r.phone && (
                <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 text-[#47CC5E] font-black text-xs hover:text-[#5adb70] transition-colors">
                  <Phone className="w-3 h-3" /> {r.phone}
                </a>
              )}
              {r.website && (
                <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-white/50 font-bold text-xs hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Website
                </a>
              )}
              {r.email && (
                <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 text-white/50 font-bold text-xs hover:text-white transition-colors">
                  <Mail className="w-3 h-3" /> {r.email}
                </a>
              )}
            </div>

            {r.availability && (
              <p className="text-white/35 text-xs mb-2">{r.availability}</p>
            )}

            <p className={`text-white/60 text-xs leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
              {r.description}
            </p>

            {r.notes && expanded && (
              <p className="text-white/40 text-xs mt-2 leading-relaxed italic">{r.notes}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      </div>
    </div>
  );
}
