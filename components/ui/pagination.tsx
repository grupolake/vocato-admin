import Link from "next/link";

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
  const href = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
    qs.set("page", String(p));
    return `${basePath}?${qs}`;
  };
  const link =
    "inline-flex h-9 items-center rounded-full border border-line bg-card px-4 text-[13px] font-bold text-strong no-underline hover:bg-sunken";
  return (
    <nav className="mt-4 flex items-center justify-between text-sm text-secondary">
      <span className="lf-figure">
        {total} {total === 1 ? "registro" : "registros"} · página {page}/{pages}
      </span>
      <span className="flex gap-2">
        {page > 1 && (
          <Link className={link} href={href(page - 1)}>
            Anterior
          </Link>
        )}
        {page < pages && (
          <Link className={link} href={href(page + 1)}>
            Próxima
          </Link>
        )}
      </span>
    </nav>
  );
}
