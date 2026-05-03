import { AnimatedBackgroundOrbs } from "@/components/animated-orbs";
import { Navigation } from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlowButton } from "@/components/ui/glow-button";
import { FileText, MessageSquare, Megaphone, Share2, Copy, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Advocacy() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: "",
    topic: "",
    dateRange: "",
  });

  const tools = [
    {
      id: "foia",
      title: "Public Records Request",
      description: "Generate a FOIA or state-equivalent request for animal control records.",
      icon: <FileText className="w-6 h-6 text-primary" />
    },
    {
      id: "comment",
      title: "City Council Comment",
      description: "Structure a formal, factual public comment for local government meetings.",
      icon: <MessageSquare className="w-6 h-6 text-accent" />
    },
    {
      id: "tip",
      title: "Media Tip Builder",
      description: "Draft a responsible, fact-based tip for local investigative journalists.",
      icon: <Megaphone className="w-6 h-6 text-primary" />
    },
    {
      id: "social",
      title: "Social Post Generator",
      description: "Create safe, non-defamatory awareness posts about systemic issues.",
      icon: <Share2 className="w-6 h-6 text-accent" />
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGeneratedText = () => {
    switch (activeModal) {
      case "foia":
        return `Under the [State] Public Records Law, I am requesting an opportunity to inspect or obtain copies of public records regarding ${formData.topic || "[TOPIC]"}. 
I would like to request records from ${formData.dateRange || "[DATE RANGE]"}. 
Please provide these records electronically. If there are any fees for searching or copying these records, please inform me.`;
      case "comment":
        return `Good evening City Council members. My name is [NAME] and I am a resident of [CITY]. I am here tonight to speak about ${formData.topic || "[ISSUE]"}. 
Data shows a concerning pattern of reported incidents at ${formData.agencyName || "[LOCATION]"}. We ask the council to consider allocating resources to address this systemic issue.`;
      default:
        return "Generated text will appear here...";
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative pt-16">
      <AnimatedBackgroundOrbs />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Advocacy Toolkit</h1>
          <p className="text-xl text-white/70">Tools to help you elevate systemic issues responsibly and legally.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <GlassCard key={tool.id} className="flex flex-col h-full group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
              </div>
              <p className="text-white/60 mb-6 flex-1">{tool.description}</p>
              <GlowButton 
                variant="outline" 
                className="w-full mt-auto"
                onClick={() => setActiveModal(tool.id)}
                data-testid={`btn-open-${tool.id}`}
              >
                Open Builder
              </GlowButton>
            </GlassCard>
          ))}
        </div>
      </main>

      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="sm:max-w-[600px] glass-panel border-white/10 bg-[#0a0f1e]/95 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {tools.find(t => t.id === activeModal)?.title}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Fill out the details below to generate your document.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-white/80">Target Agency/Location</Label>
              <Input 
                className="bg-white/5 border-white/20 text-white" 
                placeholder="e.g. County Animal Services"
                value={formData.agencyName}
                onChange={e => setFormData(f => ({ ...f, agencyName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white/80">Issue / Topic</Label>
              <Input 
                className="bg-white/5 border-white/20 text-white" 
                placeholder="e.g. Stray animal response times"
                value={formData.topic}
                onChange={e => setFormData(f => ({ ...f, topic: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white/80">Date Range (if applicable)</Label>
              <Input 
                className="bg-white/5 border-white/20 text-white" 
                placeholder="e.g. Jan 2023 - Present"
                value={formData.dateRange}
                onChange={e => setFormData(f => ({ ...f, dateRange: e.target.value }))}
              />
            </div>

            <div className="mt-6 relative">
              <Label className="text-white/80 mb-2 block">Generated Output</Label>
              <div className="relative">
                <Textarea 
                  className="bg-black/30 border-white/10 text-white/90 min-h-[200px] font-mono text-sm resize-none pr-12"
                  readOnly
                  value={getGeneratedText()}
                />
                <button 
                  onClick={() => handleCopy(getGeneratedText())}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white"
                  title="Copy to clipboard"
                  data-testid="btn-copy-output"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
