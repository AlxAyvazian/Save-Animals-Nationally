import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {
  Heart, AlertCircle, Clock, Mail, Megaphone,
  Copy, CheckCircle2, Users, MapPin, Phone
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ToolId =
  | "high-kill-alert"
  | "euthanasia-letter"
  | "tnr-request"
  | "foster-blast"
  | "stray-rescue-resources"
  | "lost-found-post"
  | null;

interface FormState {
  shelterName: string;
  animalName: string;
  animalId: string;
  animalType: string;
  breed: string;
  deadline: string;
  city: string;
  state: string;
  rescueName: string;
  contactEmail: string;
  neighborhoodDesc: string;
  numberOfStrays: string;
  tnrStatus: string;
  extraDetails: string;
}

const INITIAL_FORM: FormState = {
  shelterName: "",
  animalName: "",
  animalId: "",
  animalType: "",
  breed: "",
  deadline: "",
  city: "",
  state: "",
  rescueName: "",
  contactEmail: "",
  neighborhoodDesc: "",
  numberOfStrays: "",
  tnrStatus: "",
  extraDetails: "",
};

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const TOOLS = [
  {
    id: "high-kill-alert" as ToolId,
    title: "High-Kill Shelter Alert",
    description: "Generate an urgent public-awareness post for an animal at imminent risk of euthanasia at a high-intake shelter.",
    icon: <AlertCircle className="w-6 h-6 text-red-400" />,
    badge: "Urgent",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  {
    id: "euthanasia-letter" as ToolId,
    title: "Euthanasia Concern Letter",
    description: "Draft a formal letter requesting reconsideration of a scheduled euthanasia, to send to shelter management or oversight bodies.",
    icon: <Clock className="w-6 h-6 text-orange-400" />,
    badge: "Formal",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    id: "tnr-request" as ToolId,
    title: "TNR Program Request",
    description: "Build a formal letter requesting your city or county implement a Trap-Neuter-Return program for community cats.",
    icon: <MapPin className="w-6 h-6 text-cyan-400" />,
    badge: "Policy",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "foster-blast" as ToolId,
    title: "Emergency Foster Network Email",
    description: "Generate an urgent outreach email to local rescue networks requesting emergency foster homes for at-risk animals.",
    icon: <Mail className="w-6 h-6 text-violet-400" />,
    badge: "Outreach",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
  {
    id: "stray-rescue-resources" as ToolId,
    title: "Stray Animal Resource Guide",
    description: "Generate a printable guide for community members on what to do when they find a stray animal — who to call, how to safely help.",
    icon: <Heart className="w-6 h-6 text-pink-400" />,
    badge: "Education",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
  {
    id: "lost-found-post" as ToolId,
    title: "Lost / Found Animal Post",
    description: "Create a responsible, detailed lost or found animal post for NextDoor, Facebook, and community boards.",
    icon: <Megaphone className="w-6 h-6 text-yellow-400" />,
    badge: "Community",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
];

function generateOutput(toolId: ToolId, f: FormState): string {
  const shelter = f.shelterName || "[Shelter Name]";
  const animal = f.animalName || "[Animal Name/ID]";
  const animalId = f.animalId || "[ID#]";
  const breed = f.breed ? `${f.breed} ` : "";
  const type = f.animalType || "animal";
  const deadline = f.deadline ? new Date(f.deadline).toLocaleDateString() : "[DATE]";
  const city = f.city || "[City]";
  const state = f.state || "[State]";
  const extra = f.extraDetails ? `\n\nAdditional details: ${f.extraDetails}` : "";

  switch (toolId) {
    case "high-kill-alert":
      return `URGENT — PLEASE SHARE

A ${breed}${type} named ${animal} (ID: ${animalId}) is reportedly at ${shelter} in ${city}, ${state} and may be at risk of euthanasia as early as ${deadline}.

This ${type} reportedly needs an approved rescue, foster, or adopter to step forward immediately.

HOW YOU CAN HELP:
• Approved rescues: Contact the shelter directly to pull this ${type}
• Fosters: Reach out to a local rescue organization who can coordinate
• Adopters: Visit the shelter and ask specifically for ${animal} (ID: ${animalId})
• Share: Every share could reach someone who can help

CONTACT: ${shelter} — please call during business hours and ask specifically for ${animal} by their ID number.

Please only share with responsible wording. Do not harass shelter staff. This is a public awareness notice, not an accusation.

#AnimalRescue #${state}Animals #UrgentRescue #FosterNeeded`;

    case "euthanasia-letter":
      return `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

Re: Formal Request for Reconsideration — ${animal} (${animalId}), ${shelter}

Dear ${shelter} Director and Animal Services Oversight,

I am writing to respectfully request reconsideration of the scheduled euthanasia of ${animal} (Animal ID: ${animalId}), a ${breed}${type} currently in your care, reportedly scheduled for ${deadline}.

I am a concerned community member who believes every reasonable effort should be made to explore alternatives before euthanasia is carried out for non-medical, non-behavioral reasons.

I respectfully request that your agency consider the following:

1. Extend the hold period by 72 additional hours to allow rescue organizations to coordinate transport
2. List the animal on all available digital platforms (Petfinder, PetHarbor, Adopt-A-Pet) before the deadline
3. Notify local rescue networks and breed-specific rescues of this animal's availability
4. Confirm this animal has been medically assessed and behaviorally evaluated

I understand that shelters face resource constraints and I do not presume to have full knowledge of this case. However, I respectfully ask for a documented response confirming the basis for the scheduled euthanasia and what alternatives were explored.${extra}

I am happy to assist with rescue coordination if given a window of time. I can be reached at [your contact information].

Thank you for your consideration and for the difficult work your staff performs every day.

Respectfully,
[Your Signature]
[Your Printed Name]

---
This letter supports responsible advocacy. VoiceMap does not make legal determinations.`;

    case "tnr-request":
      return `[Your Name]
[Your Address]
${city}, ${state}
[Date]

Re: Formal Request to Establish a Trap-Neuter-Return (TNR) Program in ${city}, ${state}

Dear Mayor, City Council, and Animal Services Director,

I am writing as a concerned resident to formally request that the City of ${city} implement or expand a Trap-Neuter-Return (TNR) program for community cats.

WHY TNR IS EFFECTIVE:
• Evidence-based research demonstrates TNR stabilizes and humanely reduces feral cat colonies over time
• TNR costs significantly less per cat than trap-and-euthanize programs, saving municipal resources
• TNR programs have been adopted by over 400 U.S. municipalities with documented population reduction outcomes
• Vacated territories ("vacuum effect") documented with removal-only approaches makes TNR more sustainable long-term

CURRENT SITUATION IN ${city}:
There are an estimated ${f.numberOfStrays || "[N]"} community cats in our area. ${f.tnrStatus || "Current shelter capacity and response rates make it difficult to address the population through traditional intake alone."}

REQUEST:
1. Establish a formal TNR policy recognizing TNR as a humane and effective management strategy
2. Partner with local rescue organizations to train and support community volunteers
3. Allocate a portion of animal services funding toward trap loan programs and low-cost spay/neuter access
4. Establish a community cat colony registration system${extra}

Several peer cities have successfully implemented this approach. I am happy to share resources, connect you with subject matter experts, or coordinate with local rescue volunteers.

Thank you for your leadership on this issue.

Respectfully,
[Your Signature]
[Your Printed Name]

---
This letter is for advocacy purposes. VoiceMap does not make legal determinations.`;

    case "foster-blast":
      return `SUBJECT: Urgent Foster Request — Animals at Risk at ${shelter} — Please Forward

Dear Rescue Network Partners,

I am reaching out urgently on behalf of animals currently at ${shelter} in ${city}, ${state} who are at risk due to capacity constraints.

We are specifically seeking emergency foster homes for:
• ${f.animalType || "Cats and dogs"} of all ages, especially those with limited time
• Animals who may benefit from a quieter recovery environment
• Potentially ${f.extraDetails || "any animals currently on the shelter's at-risk list"}

WHAT WE NEED:
Emergency fosters willing to provide temporary housing — even 1-2 weeks can make the difference between life and death for these animals.

No experience required. Supplies and support can often be arranged through rescue partners.

TO RESPOND OR COORDINATE:
${f.contactEmail ? `Contact: ${f.contactEmail}` : "Please reply to this email directly."}
Or contact ${shelter} at [shelter phone/email] to arrange an approved pull.

PLEASE FORWARD THIS TO YOUR FOSTER NETWORK.

Every person who shares or steps forward saves a life. We appreciate your partnership and compassion.

Thank you,
${f.rescueName || "[Your Name / Organization]"}

---
This is a community outreach message. We support responsible fostering through vetted rescue channels.`;

    case "stray-rescue-resources":
      return `STRAY ANIMAL RESOURCE GUIDE — ${city || "Your Community"}
Prepared for community distribution

---

IF YOU FIND A STRAY ANIMAL

STEP 1 — ASSESS SAFETY
• If the animal appears injured, aggressive, or in immediate danger: call local animal control or 911 (non-emergency line)
• Do not put yourself at risk. Stay calm and move slowly around frightened animals

STEP 2 — CHECK FOR ID
• Look for a collar and tag — call the owner directly if possible
• Post photos on Nextdoor, local Facebook lost pet groups, and Pawboost.com immediately

STEP 3 — REPORT AND DOCUMENT
• File a found animal report with your local animal shelter — this creates an official record
• Take clear photos: full body, face, any distinguishing markings
• Note exactly where and when you found the animal

STEP 4 — DECIDE NEXT STEPS
Option A — Surrender to Shelter: Contact your local animal services. Ask about hold period policies.
Option B — Foster while searching: Keep the animal safe while actively searching for owners
Option C — Place with a rescue: Contact local rescue organizations who may be able to assist

STRAY HOLD PERIODS (varies by state):
Most states require 3–7 business days before an animal can be adopted/euthanized. Ask your shelter about their specific hold period policy.

RESOURCES TO KNOW:
• PawBoost.com — lost & found pets database
• Petfinder.com — adopted pets listed nationally
• HelpingLostPets.com — geo-tagged lost pet mapping
• Local Facebook Groups — search "[Your City] Lost and Found Pets"

DO NOT:
• Do not keep a found animal for weeks without reporting — owners may be searching
• Do not attempt to approach clearly feral/aggressive animals
• Do not abandon found animals in a new location

FOR EMERGENCIES: Call 911 or your local non-emergency animal control line.

---
Printed courtesy of VoiceMap National: Animal Protection Portal
This guide is informational only. Always follow local laws and ordinances.`;

    case "lost-found-post":
      return `${f.animalId === "found" || !f.animalId ? "FOUND ANIMAL" : "LOST ANIMAL"} — PLEASE HELP REUNITE

Animal: ${breed}${type.charAt(0).toUpperCase() + type.slice(1)}
Name: ${animal}
Location: ${city}, ${state}
Area Found/Last Seen: ${f.neighborhoodDesc || "[Describe neighborhood / intersection / landmark]"}
Date: ${f.deadline || "[Date]"}

DESCRIPTION:
${f.extraDetails || "[Describe the animal: approximate age, size, color, markings, collar color, any distinctive features]"}

WHAT TO DO IF YOU HAVE INFORMATION:
• Reply to this post or message [your name]
• Call/text: [your phone number]
• Email: ${f.contactEmail || "[your email]"}

This animal has been reported to local animal control (report #[if applicable]).

If you find this animal: Please do not post the address publicly — contact me directly to verify ownership.

Please share — this post may reach the owner or someone who can help.

Thank you from the bottom of our hearts.

---
Please share responsibly. Do not approach the animal if it appears frightened or aggressive. Call animal control if you are unable to safely contain them.`;

    default:
      return "Select a tool and fill in the details above.";
  }
}

export default function StrayTools() {
  const [activeTool, setActiveTool] = useState<ToolId>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const output = generateOutput(activeTool, form);
  const activeMeta = TOOLS.find(t => t.id === activeTool);

  const handleOpen = (id: ToolId) => {
    setForm(INITIAL_FORM);
    setActiveTool(id);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Stray &amp; Euthanasia Prevention Tools
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Stray &amp; At-Risk Animal Tools</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Practical tools for advocates working to help stray animals, prevent unnecessary euthanasia, and build community awareness — responsibly.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TOOLS.map(tool => (
            <GlassCard key={tool.id} className="flex flex-col group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  {tool.icon}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
              <p className="text-white/55 text-sm mb-5 flex-1 leading-relaxed">{tool.description}</p>
              <GlowButton
                variant="outline"
                className="w-full text-sm"
                onClick={() => handleOpen(tool.id)}
                data-testid={`btn-open-${tool.id}`}
              >
                Open Builder
              </GlowButton>
            </GlassCard>
          ))}
        </div>

        {/* Info Banner */}
        <div className="max-w-5xl mx-auto mt-8">
          <GlassCard className="bg-white/3 border-white/10">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white/80 font-medium text-sm mb-1">Emergency Resources</p>
                <p className="text-white/50 text-sm">
                  For animals in immediate danger: call <strong className="text-white/70">911</strong> or your local non-emergency animal control line.
                  For humane law enforcement: contact your <strong className="text-white/70">state SPCA or Humane Law Enforcement division</strong>.
                  National Humane Law Enforcement directory: <strong className="text-white/70">humanesociety.org</strong>
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Tool Dialog */}
      <Dialog open={activeTool !== null} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto bg-[#0a0f1e]/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              {activeMeta?.icon}
              {activeMeta?.title}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Fill in the details below to generate your document. Customize the output before use.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Context-sensitive fields per tool */}
            {(activeTool === "high-kill-alert" || activeTool === "euthanasia-letter") && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">Shelter Name</Label>
                    <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="County Animal Shelter" value={form.shelterName} onChange={e => setForm(f => ({ ...f, shelterName: e.target.value }))} data-testid="tool-input-shelter" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">Animal Name / ID</Label>
                    <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="e.g. Buddy / #A1234" value={form.animalName} onChange={e => setForm(f => ({ ...f, animalName: e.target.value }))} data-testid="tool-input-animal-name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">Animal Type</Label>
                    <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="Dog, Cat..." value={form.animalType} onChange={e => setForm(f => ({ ...f, animalType: e.target.value }))} data-testid="tool-input-animal-type" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">Breed (optional)</Label>
                    <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="Labrador mix..." value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} data-testid="tool-input-breed" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">City</Label>
                    <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} data-testid="tool-input-city" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-white/70 text-sm">State</Label>
                    <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white text-sm" data-testid="tool-select-state">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-white/70 text-sm">Euthanasia Deadline Date</Label>
                    <Input type="date" className="bg-white/5 border-white/20 text-white text-sm" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} data-testid="tool-input-deadline" />
                  </div>
                </div>
              </>
            )}

            {activeTool === "tnr-request" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">City</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} data-testid="tool-input-city" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">State</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-sm" data-testid="tool-select-state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Estimated # of Strays</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="e.g. 50-100" value={form.numberOfStrays} onChange={e => setForm(f => ({ ...f, numberOfStrays: e.target.value }))} data-testid="tool-input-strays" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Current TNR Status</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="No program exists / limited..." value={form.tnrStatus} onChange={e => setForm(f => ({ ...f, tnrStatus: e.target.value }))} data-testid="tool-input-tnr-status" />
                </div>
              </div>
            )}

            {activeTool === "foster-blast" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Shelter Name</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.shelterName} onChange={e => setForm(f => ({ ...f, shelterName: e.target.value }))} data-testid="tool-input-shelter" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Animal Types Needed</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="Cats, small dogs, kittens..." value={form.animalType} onChange={e => setForm(f => ({ ...f, animalType: e.target.value }))} data-testid="tool-input-animal-type" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">City</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} data-testid="tool-input-city" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">State</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-sm" data-testid="tool-select-state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-white/70 text-sm">Your Org / Name</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.rescueName} onChange={e => setForm(f => ({ ...f, rescueName: e.target.value }))} data-testid="tool-input-rescue-name" />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-white/70 text-sm">Contact Email</Label>
                  <Input type="email" className="bg-white/5 border-white/20 text-white text-sm" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} data-testid="tool-input-email" />
                </div>
              </div>
            )}

            {activeTool === "stray-rescue-resources" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">City (for customization)</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} data-testid="tool-input-city" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">State</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-sm" data-testid="tool-select-state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {activeTool === "lost-found-post" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Animal Name</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="e.g. Max or Unknown" value={form.animalName} onChange={e => setForm(f => ({ ...f, animalName: e.target.value }))} data-testid="tool-input-animal-name" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Animal Type &amp; Breed</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="e.g. Orange tabby cat" value={form.animalType} onChange={e => setForm(f => ({ ...f, animalType: e.target.value }))} data-testid="tool-input-type" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Neighborhood / Location</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" placeholder="Near Oak St & 5th Ave" value={form.neighborhoodDesc} onChange={e => setForm(f => ({ ...f, neighborhoodDesc: e.target.value }))} data-testid="tool-input-neighborhood" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">Date Lost/Found</Label>
                  <Input type="date" className="bg-white/5 border-white/20 text-white text-sm" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} data-testid="tool-input-date" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">City</Label>
                  <Input className="bg-white/5 border-white/20 text-white text-sm" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} data-testid="tool-input-city" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/70 text-sm">State</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white text-sm" data-testid="tool-select-state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-white/70 text-sm">Contact Email (optional)</Label>
                  <Input type="email" className="bg-white/5 border-white/20 text-white text-sm" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} data-testid="tool-input-email" />
                </div>
              </div>
            )}

            {/* Extra details for all tools */}
            <div className="space-y-1.5">
              <Label className="text-white/70 text-sm">Additional Details <span className="text-white/30">(optional)</span></Label>
              <Textarea
                className="bg-white/5 border-white/20 text-white text-sm h-20 placeholder:text-white/30"
                placeholder="Any extra context to include in the generated text..."
                value={form.extraDetails}
                onChange={e => setForm(f => ({ ...f, extraDetails: e.target.value }))}
                data-testid="tool-textarea-extra"
              />
            </div>

            {/* Output */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-white/70 text-sm">Generated Output</Label>
                <button
                  onClick={() => handleCopy(output)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 text-xs transition-colors"
                  data-testid="btn-copy-tool-output"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <Textarea
                className="bg-black/30 border-white/10 text-white/75 font-mono text-xs min-h-[260px] resize-y"
                readOnly
                value={output}
                data-testid="tool-output-text"
              />
            </div>
            <p className="text-white/25 text-xs">
              Review and customize this text before sharing. Replace all bracketed placeholders. VoiceMap does not make legal determinations.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
