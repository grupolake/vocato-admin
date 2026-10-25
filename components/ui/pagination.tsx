import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

/** Janela de páginas: 1 … 4 [5] 6 … 20 (null = reticências). */
function pageWindow(page: number, pages: number): (number | null)[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

const BASE =
  "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border px-3 text-[13px] font-bold no-underline";
const ENABLED = `${BASE} border-line bg-card text-strong hover:bg-sunken`;
const CURRENT = `${BASE} border-transparent bg-brand text-white`;
const DISABLED = `${BASE} cursor-not-allowed border-line-subtle bg-card text-muted opacity-60`;

/** Paginação por URL (sem JS): preserva os demais filtros da busca. */
export function Pagination({
  basePath,
  params,
  page,
  pageSize,
  total,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  pageSize: number;
  total: number;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    qs.set("page", String(p));
    return `${basePath}?${qs}`;
  };

  const step = (target: number, enabled: boolean, label: string, content: React.ReactNode) =>
    enabled ? (
      <Link className={ENABLED} href={href(target)} aria-label={label} title={label}>
        {content}
      </Link>
    ) : (
      <span className={DISABLED} aria-disabled="true" aria-label={label} title={label}>
        {content}
      </span>
    );

  return (
    <nav
      aria-label="Paginação"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-secondary"
    >
      <span className="lf-figure">
        {total} {total === 1 ? "registro" : "registros"} · página {current}/{pages}
      </span>
      <span className="flex flex-wrap items-center gap-1.5">
        {step(1, current > 1, "Primeira página", <ChevronsLeft className="size-4" />)}
        {step(
          current - 1,
          current > 1,
          "Página anterior",
          <>
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Anterior</span>
          </>,
        )}
        {pageWindow(current, pages).map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} aria-hidden className="px-1 text-muted">
              …
            </span>
          ) : p === current ? (
            <span key={p} className={CURRENT} aria-current="page">
              {p}
            </span>
          ) : (
            <Link key={p} className={ENABLED} href={href(p)} aria-label={`Página ${p}`}>
              {p}
            </Link>
          ),
        )}
        {step(
          current + 1,
          current < pages,
          "Próxima página",
          <>
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="size-4" />
          </>,
        )}
        {step(pages, current < pages, "Última página", <ChevronsRight className="size-4" />)}
      </span>
    </nav>
  );
}
