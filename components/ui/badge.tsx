const TONES = {
  neutral: "bg-tile text-secondary",
  positive: "bg-[var(--positive-100)] text-positive",
  negative: "bg-[var(--negative-100)] text-negative",
  warning: "bg-[var(--warning-100)] text-warning",
  info: "bg-[var(--info-100)] text-info",
  brand: "bg-[var(--lake-100)] text-[var(--lake-700)]",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-3 text-xs font-bold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
