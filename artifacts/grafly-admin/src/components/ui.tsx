import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {children}
      {hint && <div className="text-xs text-muted-foreground/80">{hint}</div>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full h-9 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <TextInput type="number" {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full h-9 px-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
}

export function Btn({
  children,
  variant = "default",
  size = "md",
  ...rest
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "md";
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">) {
  const sizeCls = size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm";
  const variantCls =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : variant === "danger"
      ? "border border-destructive text-destructive hover:bg-destructive/10"
      : variant === "ghost"
      ? "hover:bg-accent text-foreground"
      : "border bg-background hover:bg-accent";
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1 rounded-md font-medium disabled:opacity-50 ${sizeCls} ${variantCls} ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card border rounded-lg ${className}`}>{children}</div>;
}

export function SectionHeader({
  title,
  right,
}: {
  title: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

export function ColorSwatchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 rounded-md border bg-background cursor-pointer"
      />
      <TextInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="font-mono"
      />
    </div>
  );
}
