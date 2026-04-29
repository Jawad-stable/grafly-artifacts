import type { CSSProperties } from "react";

type DecoProps = {
  className?: string;
  style?: CSSProperties;
};

export function Sparkle({
  className,
  style,
  color = "#E3ED43",
}: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
  );
}

export function Squiggle({
  className,
  style,
  color = "#21263F",
  width = 200,
  height = 32,
}: DecoProps & { color?: string; width?: number; height?: number }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d={`M2 ${height / 2} Q ${width * 0.1} 2, ${width * 0.2} ${height / 2} T ${width * 0.4} ${height / 2} T ${width * 0.6} ${height / 2} T ${width * 0.8} ${height / 2} T ${width - 2} ${height / 2}`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({
  className,
  style,
  color = "#00A4FA",
}: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" fill={color}>
      <path d="M44.7,-58.5C58.5,-50.4,70.7,-37.7,75.6,-22.6C80.5,-7.5,78.1,9.9,71.6,25.4C65.1,40.9,54.5,54.4,40.7,62.5C26.9,70.6,10,73.2,-6.4,71.4C-22.8,69.5,-38.6,63.2,-49.6,52.5C-60.6,41.8,-66.7,26.7,-69.4,10.5C-72.1,-5.7,-71.4,-23,-63.4,-35.7C-55.4,-48.4,-40.1,-56.5,-25.6,-63.6C-11.1,-70.7,2.6,-76.7,16.5,-74.5C30.4,-72.3,44.5,-61.9,44.7,-58.5Z" transform="translate(100 100)" />
    </svg>
  );
}

export function Star4({
  className,
  style,
  color = "#FF7BD0",
}: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 C12 8 16 12 24 12 C16 12 12 16 12 24 C12 16 8 12 0 12 C8 12 12 8 12 0 Z" />
    </svg>
  );
}

export function DotPattern({
  className,
  style,
  color = "#00A4FA",
}: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="none">
      <circle cx="10" cy="10" r="3" fill={color} />
      <circle cx="30" cy="10" r="3" fill={color} />
      <circle cx="50" cy="10" r="3" fill={color} />
      <circle cx="70" cy="10" r="3" fill={color} />
      <circle cx="90" cy="10" r="3" fill={color} />
      <circle cx="10" cy="30" r="3" fill={color} />
      <circle cx="30" cy="30" r="3" fill={color} />
      <circle cx="50" cy="30" r="3" fill={color} />
      <circle cx="70" cy="30" r="3" fill={color} />
      <circle cx="90" cy="30" r="3" fill={color} />
      <circle cx="10" cy="50" r="3" fill={color} />
      <circle cx="30" cy="50" r="3" fill={color} />
      <circle cx="50" cy="50" r="3" fill={color} />
      <circle cx="70" cy="50" r="3" fill={color} />
      <circle cx="90" cy="50" r="3" fill={color} />
      <circle cx="10" cy="70" r="3" fill={color} />
      <circle cx="30" cy="70" r="3" fill={color} />
      <circle cx="50" cy="70" r="3" fill={color} />
      <circle cx="70" cy="70" r="3" fill={color} />
      <circle cx="90" cy="70" r="3" fill={color} />
      <circle cx="10" cy="90" r="3" fill={color} />
      <circle cx="30" cy="90" r="3" fill={color} />
      <circle cx="50" cy="90" r="3" fill={color} />
      <circle cx="70" cy="90" r="3" fill={color} />
      <circle cx="90" cy="90" r="3" fill={color} />
    </svg>
  );
}

export function PageHeader({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="absolute top-[5vh] left-[6vw] flex items-center gap-[1vw]">
      <div className="flex items-center justify-center w-[3vw] h-[3vw] rounded-full bg-ink text-cream font-display font-black text-[1.3vw]">
        {index}
      </div>
      <div className="font-display font-bold text-[1.3vw] tracking-[0.35em] uppercase text-ink/70">
        {label}
      </div>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  const base = import.meta.env.BASE_URL;
  return (
    <img
      src={`${base}brand/wordmark_primary.png`}
      crossOrigin="anonymous"
      alt="Grafly"
      className={className}
    />
  );
}
