import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { PawPrintScatter } from "@/components/paw-prints";
import { Heart, CheckSquare, Square, ExternalLink, ChevronDown, ChevronUp, Search } from "lucide-react";

type Reason =
  | "Financial / Vet Bills"
  | "Housing / Moving"
  | "Behavioral Issues"
  | "Allergies / Health"
  | "New Baby"
  | "Time / Lifestyle"
  | "Lost Home / Crisis"
  | "Too Many Animals";

interface Resource {
  name: string;
  description: string;
  website?: string;
  phone?: string;
  notes?: string;
}

interface ReasonSection {
  reason: Reason;
  headline: string;
  subtext: string;
  resources: Resource[];
  beforeYouSurrender: string[];
}

const SECTIONS: ReasonSection[] = [
  {
    reason: "Financial / Vet Bills",
    headline: "Financial help exists — and more than you think.",
    subtext: "Unexpected vet bills are the number-one surrender trigger. Multiple national programs provide emergency grants, payment plans, and free care.",
    beforeYouSurrender: [
      "Ask your vet about a payment plan — most will work with long-term clients",
      "Ask your vet about CareCredit or Scratchpay financing",
      "Search petfoodstamps.org for food assistance in your county",
      "Contact local shelters — many have emergency vet assistance funds",
      "Check if your local humane society has a KeepPet fund",
    ],
    resources: [
      {
        name: "RedRover Relief",
        description: "Emergency financial assistance grants for unexpected vet expenses. Apply online — grants are awarded to owner-pet pairs in genuine financial crisis.",
        website: "https://redrover.org/relief/",
        notes: "Apply early — grant funds are limited. Have your vet's name and diagnosis ready.",
      },
      {
        name: "The Pet Fund",
        description: "Grants for non-emergency but serious conditions (cancer, diabetes, heart disease) when owners cannot afford specialist care.",
        website: "https://www.thepetfund.com",
      },
      {
        name: "Brown Dog Foundation",
        description: "Grants for pets facing euthanasia due to owner finances. Focus on cancer and other life-threatening diagnoses.",
        website: "https://www.browndogfoundation.org",
      },
      {
        name: "Frankie's Friends",
        description: "Grants for seriously ill pets at partner veterinary hospitals. No geographic restriction.",
        website: "https://frankiesfriends.org",
      },
      {
        name: "ASPCA Free/Low-Cost Spay & Neuter",
        description: "Reduces long-term costs by finding free or reduced-cost spay/neuter programs near you.",
        website: "https://www.aspca.org/pet-care/general-pet-care/low-cost-spayneuter-programs",
      },
      {
        name: "Humane Society Pet Food Assistance",
        description: "Many local HSUS affiliates operate pet food banks. Contact your local humane society to ask.",
        website: "https://www.humanesociety.org/resources/find-local-shelter-pet-food-assistance",
      },
    ],
  },
  {
    reason: "Housing / Moving",
    headline: "Housing restrictions are a leading cause — but they aren't always final.",
    subtext: "Moving to a no-pet property, or facing eviction, doesn't always mean surrender. There are negotiation strategies and temporary options.",
    beforeYouSurrender: [
      "Negotiate with the landlord — offer a pet deposit and references",
      "Get a letter from your vet documenting the pet's temperament and spayed/neutered status",
      "Check if the property qualifies as an emotional support animal (ESA) accommodation",
      "Ask friends or family for temporary fostering while you find housing",
      "Search rentals specifically on Pets Welcome or Rent.com pet filter",
    ],
    resources: [
      {
        name: "HUD Fair Housing — Assistance Animals",
        description: "If your pet qualifies as an emotional support animal (with documentation from a mental health provider), landlords may be required to allow them under Fair Housing Act.",
        website: "https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals",
        notes: "Requires documentation from a licensed mental health professional. Free template letters are available.",
      },
      {
        name: "Pets Welcome Rentals",
        description: "Searchable database of pet-friendly rentals across the US.",
        website: "https://www.petswelcome.com",
      },
      {
        name: "National Coalition for the Homeless — Pets",
        description: "Resources for pet owners experiencing homelessness or housing crisis. Pet-friendly shelter directory.",
        website: "https://nationalhomeless.org/about-homelessness/pets/",
      },
      {
        name: "RedRover Safe Escape (DV + Pets)",
        description: "For domestic violence survivors: emergency pet fostering so owners can safely leave without having to surrender their animal.",
        website: "https://redrover.org/relief/safe-escape/",
      },
    ],
  },
  {
    reason: "Behavioral Issues",
    headline: "Most behavioral issues have solutions — and they're cheaper than you think.",
    subtext: "Aggression, destructive behavior, anxiety, and house-training problems are the second leading surrender reason. Most are fixable with the right guidance.",
    beforeYouSurrender: [
      "Request a free consultation with a certified trainer (CPDT-KA) before giving up",
      "Ask your vet about anxiety medications — they can be transformative for fearful dogs",
      "Try a 30-day behavioral management plan before making a final decision",
      "Contact your local shelter's behavior team — many offer free advice",
      "Consider a foster-to-adopt program that transitions the animal to a specialized home",
    ],
    resources: [
      {
        name: "Association of Professional Dog Trainers (APDT)",
        description: "Find certified trainers in your area. Many offer sliding-scale fees or payment plans.",
        website: "https://apdt.com/trainer-search/",
      },
      {
        name: "ASPCA Virtual Pet Behaviorist",
        description: "Free online behavioral guidance for common issues: aggression, anxiety, house-training, destructive behavior.",
        website: "https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues",
      },
      {
        name: "Fear Free Pets — Find a Professional",
        description: "Directory of Fear Free certified veterinary and behavior professionals.",
        website: "https://fearfreepets.com/fear-free-certified-professionals/",
      },
      {
        name: "Best Friends Animal Society — Behavior Resources",
        description: "Free behavior guides and training resources. Best Friends also offers behavior support for pets at risk of surrender.",
        website: "https://resources.bestfriends.org",
      },
    ],
  },
  {
    reason: "Allergies / Health",
    headline: "Allergies are real — but there are options before rehoming.",
    subtext: "Many people surrender pets due to allergies. Medical consultation, allergy management, and reduced-allergen environments often allow families to keep their pets.",
    beforeYouSurrender: [
      "Consult an allergist — allergy shots (immunotherapy) can desensitize you to pet allergens",
      "Keep the pet out of the bedroom — reducing exposure dramatically reduces symptoms for many people",
      "Use HEPA air purifiers in shared spaces",
      "Bathe the pet weekly — reduces dander significantly",
      "Ask whether a lower-allergen breed alternative is an option if you're getting a new pet",
    ],
    resources: [
      {
        name: "American Academy of Allergy, Asthma & Immunology",
        description: "Find board-certified allergists who can test and treat pet allergies. Immunotherapy has a high success rate.",
        website: "https://www.aaaai.org/tools-for-the-public/allergy,-asthma-immunology-glossary/pet-allergy-defined",
      },
      {
        name: "ASPCA — Pet Allergies Guide",
        description: "Practical steps for managing pet allergies while keeping your animal.",
        website: "https://www.aspca.org/pet-care/general-pet-care/pets-and-allergies",
      },
    ],
  },
  {
    reason: "New Baby",
    headline: "Pets and babies can thrive together with preparation.",
    subtext: "Fear about pet-baby safety is one of the most common surrender triggers — and one of the most preventable. Preparation and training make an enormous difference.",
    beforeYouSurrender: [
      "Start desensitization training before the baby arrives — practice baby sounds, smells, and schedule changes",
      "Establish dog-free zones (nursery) months before birth so the rule is already normalized",
      "Consult a certified animal behaviorist if you have specific concerns",
      "Never leave infants and pets unattended — supervision eliminates nearly all risk",
      "Introduce baby smells (blankets, clothing) to the pet before bringing baby home",
    ],
    resources: [
      {
        name: "Family Paws Parent Education",
        description: "Specialized programs for expectant families and new parents on integrating dogs and babies safely.",
        website: "https://www.familypaws.com",
        notes: "Offers both virtual and in-person consultations.",
      },
      {
        name: "ASPCA New Baby Preparation Guide",
        description: "Step-by-step guide for preparing your pet for a new baby.",
        website: "https://www.aspca.org/pet-care/dog-care/dogs-and-babies",
      },
    ],
  },
  {
    reason: "Time / Lifestyle",
    headline: "A lifestyle change doesn't always mean giving up your pet.",
    subtext: "New jobs, long hours, travel, or illness can make pet care feel impossible. There are support structures that can bridge the gap.",
    beforeYouSurrender: [
      "Consider doggy daycare for high-energy dogs — many are surprisingly affordable",
      "Ask a neighbor, friend, or family member to help with walks or check-ins",
      "Hire a pet sitter or dog walker — apps like Rover offer competitive pricing",
      "Consider a temporary foster arrangement — many rescues will hold a pet for 30-90 days",
      "Look into in-home pet care services through your employer's EAP program",
    ],
    resources: [
      {
        name: "Rover — Dog Walkers & Pet Sitters",
        description: "Local pet walkers, sitters, and daycare in your area. Background-checked sitters available nationwide.",
        website: "https://www.rover.com",
      },
      {
        name: "Wag! — On-Demand Dog Walking",
        description: "On-demand dog walking in most major US cities.",
        website: "https://wagwalking.com",
      },
      {
        name: "PAWS — Pets Are Wonderful Support",
        description: "For elderly, disabled, or ill owners: volunteer-based pet care services including vet transport, food delivery, and dog walking.",
        website: "https://www.pawsdc.org",
        notes: "Primarily serves DC area, but similar programs exist nationwide — search 'pet care for seniors [your city]'.",
      },
    ],
  },
  {
    reason: "Lost Home / Crisis",
    headline: "In a housing or personal crisis, temporary foster is often possible.",
    subtext: "When someone loses their home, escapes domestic violence, or faces a health emergency, surrender often feels like the only option. It usually isn't.",
    beforeYouSurrender: [
      "Contact local rescues about emergency foster — many have crisis programs",
      "Contact your county shelter's social services team about temporary boarding",
      "Ask friends, family, or church communities about temporary foster",
      "Contact national DV hotline if safety is a concern — pet safety plans exist",
    ],
    resources: [
      {
        name: "RedRover Safe Escape — Domestic Violence",
        description: "Connects domestic violence survivors with emergency pet foster placement so they can leave safely without surrendering their pet.",
        website: "https://redrover.org/relief/safe-escape/",
        notes: "Free service. Contact through RedRover's website.",
      },
      {
        name: "National DV Hotline — Safety Planning for Pets",
        description: "Guidance on including pets in domestic violence safety plans.",
        website: "https://www.thehotline.org/resources/pets-and-domestic-violence/",
        phone: "800-799-7233",
      },
      {
        name: "Pet Pantry Warehouse",
        description: "Free pet food distribution for families in crisis nationwide.",
        website: "https://petpantrywarehouse.org",
      },
    ],
  },
  {
    reason: "Too Many Animals",
    headline: "Overpopulation concerns are real — spay/neuter is the solution.",
    subtext: "If you're struggling with an unplanned litter or too many animals, spay/neuter and rehoming through rescue channels (not abandonment) are the responsible paths.",
    beforeYouSurrender: [
      "Contact breed-specific rescues — they have better placement rates and more suitable homes",
      "Post in local rescue Facebook groups before going to a shelter",
      "Contact foster-based rescues who can hold animals while finding appropriate homes",
      "Reach out to local TNR organizations for feral/community cats",
    ],
    resources: [
      {
        name: "Petfinder — Rehoming Tool",
        description: "Post animals available for adoption directly to Petfinder without going through a shelter.",
        website: "https://www.petfinder.com",
      },
      {
        name: "ASPCA Free Spay & Neuter Locator",
        description: "Find free or low-cost spay/neuter near you to prevent future litters.",
        website: "https://www.aspca.org/pet-care/general-pet-care/low-cost-spayneuter-programs",
      },
      {
        name: "Alley Cat Allies — TNR Resources",
        description: "For community cats: TNR (Trap-Neuter-Return) program resources and local contact directory.",
        website: "https://www.alleycat.org/resources/how-to-do-tnr/",
      },
      {
        name: "AKC Rescue Network",
        description: "Breed-specific rescue network — find the right rescue for your breed.",
        website: "https://www.akc.org/akc-rescue-network/",
      },
    ],
  },
];

const BEFORE_SURRENDER_CHECKLIST = [
  { id: "b1", text: "I have talked to my vet about this situation" },
  { id: "b2", text: "I have looked into at least one financial assistance program" },
  { id: "b3", text: "I have contacted a certified trainer (if behavioral)" },
  { id: "b4", text: "I have asked friends / family about temporary fostering" },
  { id: "b5", text: "I have searched for breed-specific rescue as an alternative to a shelter" },
  { id: "b6", text: "I have checked with local humane society about surrender prevention resources" },
  { id: "b7", text: "I have given myself at least 30 days to try alternatives" },
  { id: "b8", text: "I understand that open-intake shelters may euthanize before placement" },
];

export default function SurrenderPrevention() {
  const [activeReason, setActiveReason] = useState<Reason | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const filtered = useMemo(() => {
    if (!search) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.reason.toLowerCase().includes(q) ||
        s.headline.toLowerCase().includes(q) ||
        s.resources.some((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    );
  }, [search]);

  const activeSection = SECTIONS.find((s) => s.reason === activeReason);

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8 relative">
          <PawPrintScatter count={5} className="opacity-20" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#47CC5E]/40 bg-[#47CC5E]/10 text-[#47CC5E] text-xs font-black uppercase tracking-widest mb-5">
            <Heart className="w-3.5 h-3.5" />
            Surrender Prevention Guide
          </div>
          <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight mb-3">
            Before You Give<br />
            <span className="text-[#47CC5E]">Up Your Pet.</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Surrender is permanent for many animals. Before you make that decision, explore every available alternative — organized by the specific reason you are considering it.
          </p>
        </div>

        {/* Checklist band */}
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-black text-sm">Before-Surrender Checklist</p>
            <span className={`text-xs font-black ${checkedCount === BEFORE_SURRENDER_CHECKLIST.length ? "text-[#47CC5E]" : "text-white/35"}`}>
              {checkedCount} / {BEFORE_SURRENDER_CHECKLIST.length} completed
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {BEFORE_SURRENDER_CHECKLIST.map((item) => (
              <button
                key={item.id}
                className="flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-white/5 transition-all"
                onClick={() => toggle(item.id)}
              >
                {checked[item.id]
                  ? <CheckSquare className="w-4 h-4 text-[#47CC5E] shrink-0" />
                  : <Square className="w-4 h-4 text-white/25 shrink-0" />
                }
                <span className={`text-sm ${checked[item.id] ? "text-white/35 line-through" : "text-white/70"}`}>{item.text}</span>
              </button>
            ))}
          </div>
          {checkedCount < BEFORE_SURRENDER_CHECKLIST.length && (
            <p className="text-white/30 text-xs mt-3">
              Most animals surrendered after completing this checklist find a solution. Take your time.
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            className="w-full bg-white/5 border border-white/12 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#970CDA]/60 transition-all"
            placeholder="Search by situation — 'vet bills', 'moving', 'behavior'..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Reason buttons */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <button
            onClick={() => setActiveReason(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all ${
              activeReason === null
                ? "bg-[#47CC5E]/20 border-[#47CC5E]/40 text-[#47CC5E]"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
            }`}
          >
            All Situations
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s.reason}
              onClick={() => setActiveReason(s.reason === activeReason ? null : s.reason)}
              className={`px-3 py-1.5 rounded-full text-xs font-black border transition-all ${
                activeReason === s.reason
                  ? "bg-[#47CC5E]/20 border-[#47CC5E]/40 text-[#47CC5E]"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              {s.reason}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          {(activeReason ? filtered.filter((s) => s.reason === activeReason) : filtered).map((section) => (
            <SectionCard key={section.reason} section={section} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 bg-[#47CC5E]/8 border border-[#47CC5E]/18 rounded-2xl px-5 py-4 flex gap-3">
          <Heart className="w-4 h-4 text-[#47CC5E] shrink-0 mt-0.5" />
          <p className="text-white/55 text-sm leading-relaxed">
            If you have exhausted every alternative and must rehome your pet, choose a breed-specific rescue or a
            foster-based rescue over an open-admission shelter. These organizations actively find homes before
            taking in animals, and have significantly higher placement success rates than high-volume facilities.
            <span className="text-[#47CC5E] font-bold"> Your animal deserves a considered transition.</span>
          </p>
        </div>
      </main>
    </div>
  );
}

function SectionCard({ section }: { section: ReasonSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-all">
      <button
        className="w-full px-5 py-4 flex items-start gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-9 h-9 rounded-xl bg-[#47CC5E]/10 border border-[#47CC5E]/25 flex items-center justify-center shrink-0 mt-0.5">
          <Heart className="w-4 h-4 text-[#47CC5E]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#47CC5E] text-xs font-black uppercase tracking-wider mb-1">{section.reason}</p>
          <p className="text-white font-black text-sm leading-snug">{section.headline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="text-white/25 text-xs">{section.resources.length} resources</span>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 px-5 pb-5 pt-4">
          <p className="text-white/55 text-sm leading-relaxed mb-5">{section.subtext}</p>

          {/* Before you surrender tips */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-5">
            <p className="text-white/35 text-xs font-black uppercase tracking-wider mb-3">Try these first</p>
            <div className="flex flex-col gap-2">
              {section.beforeYouSurrender.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#47CC5E] font-black text-xs shrink-0">{i + 1}.</span>
                  <p className="text-white/60 text-sm leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <p className="text-white/35 text-xs font-black uppercase tracking-wider mb-3">Organizations that can help</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {section.resources.map((r) => (
              <div key={r.name} className="bg-white/3 border border-white/8 rounded-xl p-4">
                <p className="text-white font-black text-sm mb-1.5">{r.name}</p>
                <p className="text-white/50 text-xs leading-relaxed mb-3">{r.description}</p>
                {r.notes && (
                  <p className="text-white/35 text-xs italic mb-3">{r.notes}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#47CC5E] text-xs font-black hover:text-[#5adb70] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Visit Website
                    </a>
                  )}
                  {r.phone && (
                    <a
                      href={`tel:${r.phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-1.5 text-white/50 text-xs font-bold hover:text-white transition-colors"
                    >
                      {r.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
