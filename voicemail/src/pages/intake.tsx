import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const intakeSchema = z.object({
  animalType: z.string().min(1, "Required"),
  numberOfAnimals: z.coerce.number().min(1, "Required"),
  state: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  locationDescription: z.string().min(1, "Required"),
  dateTimeObserved: z.string().min(1, "Required"),
  environment: z.string().min(1, "Required"),
  urgencyLevel: z.string().min(1, "Required"),
  description: z.string().min(10, "Provide more details"),
  agenciesContacted: z.string().optional(),
  anonymous: z.boolean().default(false),
  consent: z.boolean().refine(val => val === true, "You must consent to submit")
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

export default function Intake() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      animalType: "",
      numberOfAnimals: 1,
      state: "",
      city: "",
      locationDescription: "",
      dateTimeObserved: new Date().toISOString().slice(0, 16),
      environment: "",
      urgencyLevel: "",
      description: "",
      agenciesContacted: "",
      anonymous: false,
      consent: false
    },
    mode: "onChange"
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["animalType", "numberOfAnimals", "state", "city", "locationDescription"];
    if (step === 2) fieldsToValidate = ["dateTimeObserved", "environment", "urgencyLevel"];
    if (step === 3) fieldsToValidate = ["description", "agenciesContacted"];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => Math.min(s + 1, 4));
    }
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = (data: IntakeFormValues) => {
    const concerns = JSON.parse(localStorage.getItem("voicemap_concerns") || "[]");
    const newConcern = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "pending",
      ...data
    };
    localStorage.setItem("voicemap_concerns", JSON.stringify([newConcern, ...concerns]));
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="mb-8 mt-4">
            <h1 className="text-3xl font-bold text-white mb-2">National Concern Intake</h1>
            <p className="text-white/60">Document an alleged incident securely. We do not make legal determinations.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Step 1: Location</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="animalType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Animal Type</FormLabel>
                          <FormControl>
                            <Input className="bg-white/5 border-white/20 text-white placeholder:text-white/40" placeholder="e.g. Dog, Cat, Horse" {...field} data-testid="input-animal-type" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfAnimals"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Number of Animals</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-white/5 border-white/20 text-white" {...field} data-testid="input-number-animals" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-state">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">City</FormLabel>
                          <FormControl>
                            <Input className="bg-white/5 border-white/20 text-white" {...field} data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="locationDescription"
                      render={({ field }) => (
                        <FormItem className="col-span-2 space-y-2">
                          <FormLabel className="text-white/80">Location Description</FormLabel>
                          <FormControl>
                            <Textarea className="bg-white/5 border-white/20 text-white placeholder:text-white/40" placeholder="Specific details about where the animal is located..." {...field} data-testid="textarea-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Step 2: Incident Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="dateTimeObserved"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Date/Time Observed</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" className="bg-white/5 border-white/20 text-white" {...field} data-testid="input-datetime" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="environment"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Environment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-environment">
                                <SelectValue placeholder="Select Environment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Street / Public Area</SelectItem>
                              <SelectItem value="private">Private Property (Visible)</SelectItem>
                              <SelectItem value="facility">Shelter / Facility</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="online">Online / Social Media</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="urgencyLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-urgency">
                                <SelectValue placeholder="Select Urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="urgent">Immediate Danger</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Step 3: Description & Evidence</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Description of Concern</FormLabel>
                          <FormControl>
                            <Textarea className="bg-white/5 border-white/20 text-white h-32" placeholder="Factual description of what was observed..." {...field} data-testid="textarea-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="agenciesContacted"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-white/80">Agencies Contacted</FormLabel>
                          <FormControl>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="Who have you already reported this to?" {...field} data-testid="input-agencies" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="anonymous"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-white/10 rounded-xl bg-white/5">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-white/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              data-testid="checkbox-anonymous"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white/80 cursor-pointer">Submit anonymously</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Step 4: Consent & Submission</h2>
                  
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive-foreground">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-xl">⚠️</span> Important Disclaimer
                    </h3>
                    <p className="text-sm">
                      This tool is informational. We do not make legal determinations. 
                      Always contact appropriate authorities for emergencies. False reports 
                      may be subject to legal penalties.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-white/10 rounded-xl bg-white/5">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 border-white/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            data-testid="checkbox-consent"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-relaxed">
                          <FormLabel className="text-white/80 cursor-pointer text-sm">
                            I attest that the information provided is accurate to the best of my knowledge. 
                            I understand this platform does not dispatch emergency services and supports 
                            responsible documentation, not public shaming.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <GlowButton 
                  type="button"
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={step === 1}
                  className={step === 1 ? "opacity-0 pointer-events-none" : ""}
                  data-testid="button-prev"
                >
                  Back
                </GlowButton>
                
                {step < 4 ? (
                  <GlowButton type="button" onClick={handleNext} data-testid="button-next">Next Step</GlowButton>
                ) : (
                  <GlowButton type="submit" data-testid="button-submit">Submit Concern</GlowButton>
                )}
              </div>
            </form>
          </Form>
        </GlassCard>
      </main>
    </div>
  );
}
