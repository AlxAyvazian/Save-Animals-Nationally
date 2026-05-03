interface PawPrintProps {
  className?: string;
  size?: number;
  opacity?: number;
  rotate?: number;
  color?: string;
}

export function PawPrint({ className = "", size = 40, opacity = 0.12, rotate = 0, color = "white" }: PawPrintProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      className={className}
      style={{ opacity, transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
    >
      {/* Toe pads */}
      <ellipse cx="25" cy="22" rx="11" ry="14" />
      <ellipse cx="50" cy="14" rx="11" ry="14" />
      <ellipse cx="75" cy="22" rx="11" ry="14" />
      <ellipse cx="85" cy="46" rx="9" ry="12" />
      {/* Main pad */}
      <ellipse cx="50" cy="72" rx="28" ry="24" />
    </svg>
  );
}

/** Scattered decorative paw prints for section backgrounds */
export function PawPrintScatter({ count = 6, baseColor = "white" }: { count?: number; baseColor?: string }) {
  const prints = [
    { x: "8%",  y: "12%", size: 32, opacity: 0.06, rotate: -20 },
    { x: "88%", y: "8%",  size: 24, opacity: 0.08, rotate: 30 },
    { x: "15%", y: "78%", size: 44, opacity: 0.05, rotate: 15 },
    { x: "92%", y: "60%", size: 28, opacity: 0.07, rotate: -10 },
    { x: "50%", y: "5%",  size: 20, opacity: 0.05, rotate: 45 },
    { x: "72%", y: "85%", size: 36, opacity: 0.06, rotate: -35 },
    { x: "35%", y: "92%", size: 22, opacity: 0.07, rotate: 20 },
    { x: "5%",  y: "45%", size: 18, opacity: 0.06, rotate: -50 },
  ].slice(0, count);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {prints.map((p, i) => (
        <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
          <PawPrint size={p.size} opacity={p.opacity} rotate={p.rotate} color={baseColor} />
        </div>
      ))}
    </div>
  );
}

/** A single inline paw print icon for UI use */
export function PawIcon({ size = 18, className = "", color = "currentColor" }: { size?: number; className?: string; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill={color}
      className={className}
    >
      <ellipse cx="25" cy="22" rx="11" ry="14" />
      <ellipse cx="50" cy="14" rx="11" ry="14" />
      <ellipse cx="75" cy="22" rx="11" ry="14" />
      <ellipse cx="85" cy="46" rx="9" ry="12" />
      <ellipse cx="50" cy="72" rx="28" ry="24" />
    </svg>
  );
}
