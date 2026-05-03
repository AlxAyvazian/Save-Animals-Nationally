import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Users, Map as MapIcon, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const categoryData = [
    { name: "Neglect", count: 120 },
    { name: "Shelter Condition", count: 85 },
    { name: "Abandonment", count: 65 },
    { name: "Online Content", count: 40 },
    { name: "Other", count: 20 },
  ];

  const urgencyData = [
    { name: "High", value: 45, color: "#f97316" },
    { name: "Medium", value: 150, color: "#eab308" },
    { name: "Low", value: 52, color: "#22c55e" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">National Dashboard</h1>
            <p className="text-white/60">Public concern summary across jurisdictions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3 mb-2 text-white/60">
              <Activity className="w-5 h-5 text-primary" /> Total Concerns
            </div>
            <div className="text-3xl font-bold text-white">247</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3 mb-2 text-white/60">
              <MapIcon className="w-5 h-5 text-accent" /> States Represented
            </div>
            <div className="text-3xl font-bold text-white">31</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3 mb-2 text-white/60">
              <AlertTriangle className="w-5 h-5 text-orange-400" /> Needing Follow-up
            </div>
            <div className="text-3xl font-bold text-white">18</div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-3 mb-2 text-white/60">
              <Users className="w-5 h-5 text-primary" /> Active Agencies
            </div>
            <div className="text-3xl font-bold text-white">142</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6">Concerns by Category</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Urgency Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={urgencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {urgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Urgency</th>
                </tr>
              </thead>
              <tbody className="text-white/80">
                <tr className="border-b border-white/5">
                  <td className="py-4">Oct 24, 2024</td>
                  <td>Dallas, TX</td>
                  <td>Shelter Condition</td>
                  <td><StatusBadge level="high" /></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4">Oct 23, 2024</td>
                  <td>Portland, OR</td>
                  <td>Neglect</td>
                  <td><StatusBadge level="medium" /></td>
                </tr>
                <tr>
                  <td className="py-4">Oct 23, 2024</td>
                  <td>Miami, FL</td>
                  <td>Abandonment</td>
                  <td><StatusBadge level="urgent" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
