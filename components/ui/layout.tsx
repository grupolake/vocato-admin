export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="lf-eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-strong">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[24px] border border-line-subtle bg-card p-6 shadow-[var(--shadow-xs)] ${className}`}
    >
      {title && <h2 className="lf-eyebrow mb-4">{title}</h2>}
      {children}
    </section>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "negative" | "positive" | "warning";
  children: React.ReactNode;
}) {
  const t = {
    info: "bg-[var(--info-50)] text-info",
    negative: "bg-[var(--negative-50)] text-negative",
    positive: "bg-[var(--positive-50)] text-positive",
    warning: "bg-[var(--warning-50)] text-warning",
  }[tone];
  return (
    <div
      role="status"
      className={`rounded-[12px] px-4 py-3 text-sm font-medium ${t}`}
    >
      {children}
    </div>
  );
}
