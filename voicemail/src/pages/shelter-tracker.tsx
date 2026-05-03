import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import {
  Building2, Plus, Copy, CheckCircle2, Trash2, Filter,
  FileText, AlertTriangle, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const CONCERN_TYPES = [
  "Overcrowding / Over-capacity",
  "Insufficient food or water",
  "Denied or delayed veterinary care",
  "Premature / suspected unlawful euthanasia",
  "Unsanitary or unsafe conditions",
  "Staff misconduct or mistreatment",
  "Failure to hold required stray period",
  "Inadequate quarantine procedures",
  "Lack of enrichment / severe confinement",
  "Inadequate response to reported concerns",
  "Other"
];

const incidentSchema = z.object({
  shelterName: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  dateObserved: z.string().min(1, "Required"),
  concernType: z.string().min(1, "Required"),
  description: z.string().min(10, "Please provide more detail"),
  evidenceNotes: z.string().optional(),
  agenciesNotified: z.string().optional(),
  status: z.string().min(1, "Required"),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

interface ShelterIncident extends IncidentFormValues {
  id: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  documenting: { label: "Documenting", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> },
  reported: { label: "Reported", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", icon: <FileText className="w-3 h-3" /> },
  under_review: { label: "Under Review", color: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: <AlertTriangle className="w-3 h-3" /> },
  resolved: { label: "Resolved", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: <CheckCircle className="w-3 h-3" /> },
  dismissed: { label: "Dismissed", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: <XCircle className="w-3 h-3" /> },
};

const LS_KEY = "voicemap_shelter_incidents";

function loadIncidents(): ShelterIncident[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveIncidents(incidents: ShelterIncident[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(incidents));
}

function generateComplaintLetter(incident: ShelterIncident): string {
  const date = new Date(incident.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `[Your Name]
[Your Address]
[City, State ZIP]
[Date: ${date}]

Re: Formal Concern – Reported Animal Welfare Issues at ${incident.shelterName}

To Whom It May Concern:

I am writing to formally document a reported animal welfare concern at ${incident.shelterName}, located in ${incident.city}, ${incident.state}. This letter is submitted in the interest of public transparency and responsible advocacy, and does not constitute a legal determination of wrongdoing.

REPORTED CONCERN TYPE: ${incident.concernType}

DATE CONCERN OBSERVED: ${new Date(incident.dateObserved).toLocaleDateString()}

DESCRIPTION OF ALLEGED INCIDENT:
${incident.description}

${incident.evidenceNotes ? `EVIDENCE NOTES:\n${incident.evidenceNotes}\n\n` : ""}${incident.agenciesNotified ? `AGENCIES/PARTIES ALREADY NOTIFIED:\n${incident.agenciesNotified}\n\n` : ""}I respectfully request that this concern be investigated by the appropriate oversight authority. I understand that allegations require proper investigation before any determination can be made, and I support a thorough and fair review process.

I am available to provide further information if needed and can be reached at [your contact information].

Thank you for your attention to this matter. Animal welfare is a community responsibility, and I believe transparency and accountability are essential to ensuring the humane treatment of animals in public care.

Respectfully,
[Your Signature]
[Your Printed Name]
[Date]

---
This letter was generated using VoiceMap National: Animal Protection Portal.
This document is informational only. VoiceMap does not make legal determinations.`;
}

export default function ShelterTracker() {
  const [incidents, setIncidents] = useState<ShelterIncident[]>(loadIncidents);
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<ShelterIncident | null>(null);
  const [letterModal, setLetterModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    saveIncidents(incidents);
  }, [incidents]);

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      shelterName: "",
      city: "",
      state: "",
      dateObserved: new Date().toISOString().slice(0, 10),
      concernType: "",
      description: "",
      evidenceNotes: "",
      agenciesNotified: "",
      status: "documenting",
    }
  });

  const onSubmit = (data: IncidentFormValues) => {
    const newIncident: ShelterIncident = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setIncidents(prev => [newIncident, ...prev]);
    form.reset();
    setShowForm(false);
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  const updateStatus = (id: string, status: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleCopyLetter = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = incidents.filter(i => {
    const statusOk = filterStatus === "all" || i.status === filterStatus;
    const stateOk = filterState === "all" || i.state === filterState;
    return statusOk && stateOk;
  });

  const statsByType: Record<string, number> = {};
  incidents.forEach(i => {
    statsByType[i.concernType] = (statsByType[i.concernType] || 0) + 1;
  });
  const topConcern = Object.entries(statsByType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const statusCounts: Record<string, number> = {};
  incidents.forEach(i => { statusCounts[i.status] = (statusCounts[i.status] || 0) + 1; });

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            Shelter Accountability Tracker
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Shelter Concern Tracker</h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Document alleged welfare concerns at shelters and facilities over time. Track patterns, manage follow-ups, and generate formal complaint letters. This tool supports responsible accountability — not public shaming.
          </p>
          <p className="text-sm text-white/40 mt-3 italic">
            This tool is informational. We do not make legal determinations. All concerns are alleged until investigated.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
          {[
            { label: "Total Incidents", value: incidents.length, color: "text-cyan-400" },
            { label: "Documenting", value: statusCounts["documenting"] || 0, color: "text-yellow-400" },
            { label: "Under Review", value: statusCounts["under_review"] || 0, color: "text-violet-400" },
            { label: "Resolved", value: statusCounts["resolved"] || 0, color: "text-green-400" },
          ].map(s => (
            <GlassCard key={s.label} className="text-center py-4 px-3">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Actions + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between max-w-4xl mx-auto mb-6">
          <div className="flex gap-2 flex-wrap">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white w-44" data-testid="filter-status">
                <Filter className="w-4 h-4 mr-2 text-white/50" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white w-40" data-testid="filter-state">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <GlowButton onClick={() => setShowForm(true)} data-testid="btn-add-incident">
            <Plus className="w-4 h-4 mr-2" />
            Log New Incident
          </GlowButton>
        </div>

        {/* Incident List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filtered.length === 0 && (
            <GlassCard className="text-center py-16">
              <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">No incidents logged yet.</p>
              <p className="text-white/30 text-sm mt-2">Click "Log New Incident" to start tracking shelter concerns.</p>
            </GlassCard>
          )}

          {filtered.map(incident => {
            const sc = STATUS_CONFIG[incident.status] || STATUS_CONFIG["documenting"];
            const isExpanded = expandedId === incident.id;
            return (
              <GlassCard key={incident.id} className="p-0 overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-start justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                  data-testid={`incident-row-${incident.id}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-white truncate">{incident.shelterName}</span>
                        <span className="text-white/40 text-sm">{incident.city}, {incident.state}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${sc.color}`}>
                          {sc.icon}{sc.label}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm truncate">{incident.concernType}</p>
                      <p className="text-white/30 text-xs mt-0.5">
                        Observed: {new Date(incident.dateObserved).toLocaleDateString()} · Logged: {new Date(incident.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Description</p>
                      <p className="text-white/80 text-sm leading-relaxed">{incident.description}</p>
                    </div>
                    {incident.evidenceNotes && (
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Evidence Notes</p>
                        <p className="text-white/70 text-sm">{incident.evidenceNotes}</p>
                      </div>
                    )}
                    {incident.agenciesNotified && (
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Agencies Notified</p>
                        <p className="text-white/70 text-sm">{incident.agenciesNotified}</p>
                      </div>
                    )}

                    {/* Status update + actions */}
                    <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-white/10">
                      <span className="text-white/50 text-sm">Update status:</span>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <button
                          key={k}
                          onClick={() => updateStatus(incident.id, k)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                            incident.status === k
                              ? v.color + " ring-1 ring-white/30"
                              : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                          }`}
                          data-testid={`status-btn-${k}-${incident.id}`}
                        >
                          {v.icon}{v.label}
                        </button>
                      ))}

                      <div className="ml-auto flex gap-2">
                        <GlowButton
                          variant="outline"
                          className="text-sm px-3 py-1.5"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setLetterModal(true);
                          }}
                          data-testid={`btn-generate-letter-${incident.id}`}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          Generate Letter
                        </GlowButton>
                        <button
                          onClick={() => deleteIncident(incident.id)}
                          className="p-2 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
                          title="Delete incident"
                          data-testid={`btn-delete-${incident.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </main>

      {/* Add Incident Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto bg-[#0a0f1e]/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-400" />
              Log Shelter Concern
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Document an alleged welfare concern at a shelter or animal control facility. All fields marked * are required.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="shelterName" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-white/80">Shelter / Facility Name *</FormLabel>
                    <FormControl>
                      <Input className="bg-white/5 border-white/20 text-white placeholder:text-white/30" placeholder="e.g. Riverside County Animal Services" {...field} data-testid="input-shelter-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">City *</FormLabel>
                    <FormControl>
                      <Input className="bg-white/5 border-white/20 text-white" placeholder="City" {...field} data-testid="input-shelter-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">State *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-shelter-state">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="dateObserved" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Date Observed *</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-white/5 border-white/20 text-white" {...field} data-testid="input-date-observed" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Initial Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-incident-status">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="concernType" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-white/80">Type of Reported Concern *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-concern-type">
                          <SelectValue placeholder="Select concern type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONCERN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-white/80">Description of Alleged Concern *</FormLabel>
                    <FormControl>
                      <Textarea className="bg-white/5 border-white/20 text-white h-28 placeholder:text-white/30" placeholder="Describe what was observed, factually and without accusatory language..." {...field} data-testid="textarea-incident-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="evidenceNotes" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-white/80">Evidence Notes <span className="text-white/30">(optional)</span></FormLabel>
                    <FormControl>
                      <Textarea className="bg-white/5 border-white/20 text-white h-20 placeholder:text-white/30" placeholder="Photos, videos, witness names, documents on file..." {...field} data-testid="textarea-evidence-notes" />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="agenciesNotified" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-white/80">Agencies / Parties Notified <span className="text-white/30">(optional)</span></FormLabel>
                    <FormControl>
                      <Input className="bg-white/5 border-white/20 text-white placeholder:text-white/30" placeholder="e.g. State AG Office, Local Humane Society" {...field} data-testid="input-agencies-notified" />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

              <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-yellow-300/70 text-xs">
                By submitting, you attest this information is accurate to the best of your knowledge. This does not dispatch services or constitute a legal filing.
              </div>

              <div className="flex gap-3 pt-2">
                <GlowButton type="submit" className="flex-1" data-testid="btn-submit-incident">
                  Log Incident
                </GlowButton>
                <GlowButton type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </GlowButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Complaint Letter Modal */}
      <Dialog open={letterModal} onOpenChange={setLetterModal}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto bg-[#0a0f1e]/95 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Formal Concern Letter
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Review, customize, and copy this responsible advocacy letter.
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  className="bg-black/30 border-white/10 text-white/80 font-mono text-xs min-h-[420px] resize-none"
                  readOnly
                  value={generateComplaintLetter(selectedIncident)}
                  data-testid="letter-output"
                />
                <button
                  onClick={() => handleCopyLetter(generateComplaintLetter(selectedIncident))}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                  title="Copy to clipboard"
                  data-testid="btn-copy-letter"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <p className="text-white/30 text-xs">
                Replace placeholder text in brackets before sending. This letter supports responsible documentation, not public accusation.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
