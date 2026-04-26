import type { CSSProperties } from "react";

type DecoProps = {
  className?: string;
  style?: CSSProperties;
};

export function Sparkle({ className, style, color = "#E3ED43" }: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
  );
}

export function Cursor({ className, style, color = "#21263F" }: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 28 32" fill="none">
      <path
        d="M3 2 L3 26 L9 21 L13 30 L17 28 L13 19 L22 19 Z"
        fill={color}
        stroke="#F7F4DC"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BezierPath({
  className,
  style,
  width = 220,
  height = 80,
  stroke = "#21263F",
}: DecoProps & { width?: number; height?: number; stroke?: string }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d={`M5 ${height - 10} Q ${width / 3} 5, ${width / 2} ${height / 2} T ${width - 5} 10`}
        stroke={stroke}
        strokeWidth="2.2"
        strokeDasharray="5 5"
        opacity="0.55"
      />
      <rect x={1} y={height - 14} width={8} height={8} fill="#FF7BD0" stroke={stroke} strokeWidth="1.4" />
      <rect x={width / 2 - 4} y={height / 2 - 4} width={8} height={8} fill="#E3ED43" stroke={stroke} strokeWidth="1.4" />
      <rect x={width - 9} y={6} width={8} height={8} fill="#00A4FA" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}

export function ColorSwatchTrio({ className, style }: DecoProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 60" fill="none">
      <rect x="2" y="6" width="22" height="48" rx="5" fill="#00A4FA" stroke="#21263F" strokeWidth="2" />
      <rect x="29" y="2" width="22" height="48" rx="5" fill="#E3ED43" stroke="#21263F" strokeWidth="2" />
      <rect x="56" y="8" width="22" height="48" rx="5" fill="#FF7BD0" stroke="#21263F" strokeWidth="2" />
    </svg>
  );
}

export function ColorWheel({ className, style }: DecoProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="cw1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7BD0" />
          <stop offset="50%" stopColor="#E3ED43" />
          <stop offset="100%" stopColor="#00A4FA" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#cw1)" stroke="#21263F" strokeWidth="3" />
      <circle cx="32" cy="32" r="10" fill="#F7F4DC" stroke="#21263F" strokeWidth="2" />
    </svg>
  );
}

export function Heart({ className, style, color = "#FF7BD0" }: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={color}>
      <path
        d="M12 21s-7-4.4-9.3-9.6C1 7.6 4 4 7.5 4 9.5 4 11 5.2 12 6.4 13 5.2 14.5 4 16.5 4 20 4 23 7.6 21.3 11.4 19 16.6 12 21 12 21z"
        stroke="#21263F"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GCube({ className, style, color = "#00A4FA" }: DecoProps & { color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none">
      <path d="M8 16 L32 4 L56 16 L32 28 Z" fill={color} stroke="#21263F" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M8 16 L8 44 L32 56 L32 28 Z" fill={color} fillOpacity="0.7" stroke="#21263F" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M56 16 L56 44 L32 56 L32 28 Z" fill={color} fillOpacity="0.5" stroke="#21263F" strokeWidth="2.4" strokeLinejoin="round" />
      <text
        x="32"
        y="22"
        textAnchor="middle"
        fontFamily="Teshrin, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#F7F4DC"
      >
        G
      </text>
    </svg>
  );
}

export function PenNib({ className, style }: DecoProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2 L26 14 L20 28 L12 28 L6 14 Z"
        fill="#F7F4DC"
        stroke="#21263F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="14" r="3" fill="#21263F" />
      <path d="M16 22 L16 30" stroke="#21263F" strokeWidth="2" />
    </svg>
  );
}

export function ChatBubble({
  className,
  style,
  text,
  bg = "#21263F",
  color = "#F7F4DC",
}: DecoProps & { text: string; bg?: string; color?: string }) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: bg,
        color,
        padding: "0.7vh 1.1vw",
        borderRadius: "999px",
        fontFamily: "Teshrin, sans-serif",
        fontWeight: 700,
        fontSize: "1.2vw",
        whiteSpace: "nowrap",
        boxShadow: "0 0.6vh 1.2vw rgba(33,38,63,0.14)",
      }}
    >
      {text}
    </div>
  );
}
