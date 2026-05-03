import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { Building, ShieldAlert, Phone, Globe } from "lucide-react";

export default function Jurisdiction() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Jurisdiction Helper</h1>
          <p className="text-xl text-white/70">Identify the correct agency to contact for your concern.</p>
        </div>

        <GlassCard className="mb-8">
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-lg font-medium text-white mb-2">1. Is the animal in immediate danger?</h3>
              <div className="flex gap-4">
                <GlowButton variant="outline" className="flex-1">Yes, immediate danger</GlowButton>
                <GlowButton variant="outline" className="flex-1">No, chronic/ongoing</GlowButton>
              </div>
            </div>
            
            {/* Hardcoded results view for design task */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Suggested Agencies</h2>
              
              <div className="grid gap-4">
                <GlassCard className="flex items-start gap-4 bg-white/[0.02]">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-lg">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">Local Law Enforcement (911)</h4>
                    <p className="text-white/60 text-sm mt-1 mb-3">For immediate, life-threatening emergencies only.</p>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-start gap-4 bg-white/[0.02]">
                  <div className="p-3 bg-primary/20 text-primary rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">County Animal Services</h4>
                    <p className="text-white/60 text-sm mt-1 mb-3">Primary jurisdiction for welfare checks, stray management, and basic ordinance enforcement.</p>
                    <GlowButton variant="outline" className="text-sm px-4 py-2">Find Local Agency</GlowButton>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-start gap-4 bg-white/[0.02]">
                  <div className="p-3 bg-accent/20 text-accent rounded-lg">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">State Department of Agriculture</h4>
                    <p className="text-white/60 text-sm mt-1 mb-3">For concerns regarding commercial breeding facilities, transport, or agricultural animals.</p>
                    <GlowButton variant="outline" className="text-sm px-4 py-2">View State Directory</GlowButton>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
