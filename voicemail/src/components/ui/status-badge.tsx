import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type UrgencyLevel = "urgent" | "high" | "medium" | "low";

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  level: UrgencyLevel;
  children?: React.ReactNode;
}

export function StatusBadge({ level, className, children, ...props }: StatusBadgeProps) {
  const styles = {
    urgent: "bg-destructive/20 text-destructive border-destructive/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.4)]",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.4)]",
    low: "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
  };

  const labels = {
    urgent: "Immediate Danger",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
        styles[level],
        className
      )}
      {...props}
    >
      {children || labels[level]}
    </span>
  );
}
