import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, BookOpen, AlertTriangle } from "lucide-react";

export default function Resources() {
  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Resources & Safety</h1>
          <p className="text-xl text-white/70">Guidelines for responsible documentation and advocacy.</p>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-white">Responsible Documentation Guidelines</h2>
            </div>
            <div className="prose prose-invert max-w-none text-white/80">
              <p>When documenting alleged concerns, strict adherence to the law is vital for the evidence to be usable and to protect yourself.</p>
              <ul>
                <li>Remain on public property or areas open to the general public.</li>
                <li>Do not trespass, cross fences, or enter private land without permission.</li>
                <li>Document facts objectively (dates, times, counts) rather than making emotional claims.</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-semibold text-white">What NOT to Do</h2>
            </div>
            <div className="prose prose-invert max-w-none text-white/80">
              <ul className="text-red-200">
                <li><strong>Never</strong> trespass or break laws to gather evidence.</li>
                <li><strong>Never</strong> confront individuals or escalate volatile situations.</li>
                <li><strong>Never</strong> post defamatory statements or accusations of crimes online before investigations occur.</li>
                <li><strong>Never</strong> steal or "rescue" animals illegally.</li>
              </ul>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-white">Emergency vs Non-Emergency</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <h3 className="font-semibold text-red-400 mb-2">Emergency (Call 911 / Local PD)</h3>
                <ul className="text-sm text-white/70 space-y-1 list-disc pl-4">
                  <li>Active, ongoing violence against an animal</li>
                  <li>Animal in a hot car in distress</li>
                  <li>Severe, life-threatening injury needing immediate intervention</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <h3 className="font-semibold text-yellow-400 mb-2">Non-Emergency (Report)</h3>
                <ul className="text-sm text-white/70 space-y-1 list-disc pl-4">
                  <li>Ongoing neglect (no food/water over time)</li>
                  <li>Shelter conditions and overcrowding</li>
                  <li>Suspected hoarding situations</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
