import { cn } from "@/lib/utils";

export interface MandalaProps {
  /** Pixel size of the containing square. Default: 320 */
  size?: number;
  /** Base gold color (hex). Default: #d4af37 */
  color?: string;
  /** Outer-layer rotation duration in seconds. Default: 90 */
  duration?: number;
  /** Which corner the quarter-circle emerges from. Default: top-left */
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

const CORNER_TRANSFORM: Record<NonNullable<MandalaProps["corner"]>, string> = {
  "top-left":     "none",
  "top-right":    "scaleX(-1)",
  "bottom-left":  "scaleY(-1)",
  "bottom-right": "scale(-1)",
};

export function Mandala({
  size = 320,
  color = "#d4af37",
  duration = 120,
  corner = "top-left",
  className,
}: MandalaProps) {
  const uid = `mandala-${corner}`;

  return (
    <div
      className={cn("pointer-events-none select-none absolute", className)}
      style={{ width: size, height: size, transform: CORNER_TRANSFORM[corner] }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" viewBox="0 0 400 400" overflow="visible">
        <defs>
          <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`${uid}-haze`} cx="0%" cy="0%" r="80%">
            <stop offset="0%"   stopColor={color} stopOpacity="0.12" />
            <stop offset="60%"  stopColor={color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={color} stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Soft corner haze */}
        <circle cx={0} cy={0} r={390} fill={`url(#${uid}-haze)`} />

        {/* ── Layer 1: OUTER — slow clockwise ─────────────────────────── */}
        <g style={{ transformOrigin: "0 0", animation: `mandala-spin ${duration}s linear infinite` }}>

          <circle
            cx={0} cy={0} r={355}
            fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 14"
            style={{ animation: "mandala-shimmer 14s ease-in-out infinite, mandala-dash 70s linear infinite" }}
          />

          <circle
            cx={0} cy={0} r={305}
            fill="none" stroke={color} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="16 7"
            style={{ animation: "mandala-dash 28s linear infinite" }}
          />

          {/* Diamond markers — split shorthand to avoid animationDelay conflict */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const x = Math.cos(a) * 260;
            const y = Math.sin(a) * 260;
            return (
              <rect
                key={`dm-${i}`}
                x={x - 4} y={y - 4} width={8} height={8}
                fill={color}
                fillOpacity={i % 3 === 0 ? 0.55 : 0.28}
                transform={`rotate(45, ${x}, ${y})`}
                style={{
                  animationName: "mandala-twinkle",
                  animationDuration: `${6 + (i % 5) * 1}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 24) * 5}s`,
                }}
              />
            );
          })}

          <circle
            cx={0} cy={0} r={215}
            fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={1.5} strokeDasharray="8 8"
            style={{ animation: "mandala-dash-reverse 40s linear infinite" }}
          />

          {/* Outer dot constellation */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <circle
                key={`od-${i}`}
                cx={Math.cos(a) * 190}
                cy={Math.sin(a) * 190}
                r={i % 4 === 0 ? 3 : 1.8}
                fill={color}
                style={{
                  animationName: "mandala-twinkle",
                  animationDuration: `${5 + (i % 6) * 0.8}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 24) * 6}s`,
                }}
              />
            );
          })}
        </g>

        {/* ── Layer 2: MIDDLE — counter-clockwise ─────────────────────── */}
        <g style={{ transformOrigin: "0 0", animation: `mandala-spin-reverse ${duration * 0.68}s linear infinite` }}>

          <circle
            cx={0} cy={0} r={158}
            fill="none" stroke={color} strokeOpacity={0.5} strokeWidth={2.5} strokeDasharray="20 8"
            filter={`url(#${uid}-glow)`}
            style={{ animation: "mandala-dash-reverse 22s linear infinite" }}
          />

          <circle
            cx={0} cy={0} r={125}
            fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={1} strokeDasharray="6 5"
            style={{ animation: "mandala-dash 34s linear infinite" }}
          />

          {/* Triangle markers */}
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            const x = Math.cos(a) * 142;
            const y = Math.sin(a) * 142;
            return (
              <polygon
                key={`tri-${i}`}
                points="0,-5 4.5,4 -4.5,4"
                fill={color}
                fillOpacity={i % 3 === 0 ? 0.6 : 0.25}
                transform={`translate(${x},${y}) rotate(${(i / 18) * 360})`}
                style={{
                  animationName: "mandala-pulse",
                  animationDuration: `${7 + (i % 4) * 1.2}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 18) * 4}s`,
                }}
              />
            );
          })}

          {/* Middle dot ring */}
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return (
              <circle
                key={`md-${i}`}
                cx={Math.cos(a) * 108}
                cy={Math.sin(a) * 108}
                r={2.2}
                fill={color}
                style={{
                  animationName: "mandala-pulse",
                  animationDuration: `${8 + (i % 4) * 1.2}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 18) * 5}s`,
                }}
              />
            );
          })}
        </g>

        {/* ── Layer 3: INNER — fast clockwise ─────────────────────────── */}
        <g style={{ transformOrigin: "0 0", animation: `mandala-spin ${duration * 0.42}s linear infinite` }}>

          <circle
            cx={0} cy={0} r={92}
            fill="none" stroke={color} strokeOpacity={0.32} strokeWidth={1.5} strokeDasharray="10 5"
            style={{ animation: "mandala-dash-reverse 18s linear infinite" }}
          />

          {/* Lotus petals */}
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const px = Math.cos(a) * 72;
            const py = Math.sin(a) * 72;
            return (
              <ellipse
                key={`lp-${i}`}
                cx={px} cy={py} rx={13} ry={5}
                fill={color} fillOpacity={0.3}
                transform={`rotate(${(i / 10) * 360}, ${px}, ${py})`}
                style={{
                  animationName: "mandala-pulse",
                  animationDuration: `${7 + (i % 3) * 1.5}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 10) * 4.5}s`,
                }}
              />
            );
          })}

          <circle
            cx={0} cy={0} r={50}
            fill="none" stroke={color} strokeOpacity={0.55} strokeWidth={2} strokeDasharray="8 4"
            filter={`url(#${uid}-glow)`}
            style={{ animation: "mandala-dash 14s linear infinite" }}
          />

          {/* Center starburst dots */}
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <circle
                key={`cs-${i}`}
                cx={Math.cos(a) * 26}
                cy={Math.sin(a) * 26}
                r={2.5}
                fill={color}
                style={{
                  animationName: "mandala-twinkle",
                  animationDuration: `${5 + (i % 4) * 1}s`,
                  animationTimingFunction: "ease-in-out",
                  animationIterationCount: "infinite",
                  animationDelay: `${(i / 8) * 3}s`,
                }}
              />
            );
          })}
        </g>

        {/* ── Static shimmer rings ─────────────────────────────────────── */}
        <circle
          cx={0} cy={0} r={340}
          fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="1 12"
          style={{ animation: "mandala-shimmer 12s ease-in-out infinite, mandala-dash 60s linear infinite" }}
        />
        {/* Multi-animation with delay — use longhands to avoid shorthand conflict */}
        <circle
          cx={0} cy={0} r={172}
          fill="none" stroke={color} strokeWidth={1} strokeDasharray="1 8"
          style={{
            animationName: "mandala-shimmer, mandala-dash-reverse",
            animationDuration: "10s, 50s",
            animationTimingFunction: "ease-in-out, linear",
            animationIterationCount: "infinite, infinite",
            animationDelay: "4s, 4s",
          }}
        />
      </svg>
    </div>
  );
}
