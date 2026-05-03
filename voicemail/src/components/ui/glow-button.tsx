import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "green" | "secondary" | "outline" | "purple";
}

export function GlowButton({
  children,
  className,
  variant = "primary",
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-7 py-3 overflow-hidden font-bold tracking-wide text-sm transition-all duration-200 ease-out rounded-full group",
        variant === "primary" && [
          "bg-[#970CDA] text-white border border-[#b040f0]/40",
          "hover:bg-[#aa20ef] hover:shadow-[0_0_28px_rgba(151,12,218,0.55)]",
          "active:scale-[0.97]"
        ],
        variant === "green" && [
          "bg-[#47CC5E] text-[#0A1439] border border-[#47CC5E]/60",
          "hover:bg-[#5adb70] hover:shadow-[0_0_28px_rgba(71,204,94,0.55)]",
          "active:scale-[0.97]"
        ],
        variant === "secondary" && [
          "bg-white/10 text-white border border-white/15",
          "hover:bg-white/18 hover:border-white/30",
          "active:scale-[0.97]"
        ],
        variant === "outline" && [
          "bg-transparent text-[#47CC5E] border-2 border-[#47CC5E]/60",
          "hover:border-[#47CC5E] hover:shadow-[0_0_18px_rgba(71,204,94,0.35)]",
          "active:scale-[0.97]"
        ],
        variant === "purple" && [
          "bg-transparent text-[#c060ff] border-2 border-[#970CDA]/60",
          "hover:border-[#970CDA] hover:shadow-[0_0_18px_rgba(151,12,218,0.35)]",
          "active:scale-[0.97]"
        ],
        className
      )}
      {...props}
    >
      <span className="relative font-bold">{children}</span>
    </button>
  );
}
