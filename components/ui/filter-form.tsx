import { buttonClass } from "./button";

/** Filtros via GET: a URL é a fonte de verdade (compartilhável, sem estado). */
export function FilterForm({
  children,
  resetHref,
}: {
  children: React.ReactNode;
  resetHref: string;
}) {
  return (
    <form
      method="get"
      className="mb-5 flex flex-wrap items-end gap-3 rounded-[24px] border border-line-subtle bg-card p-4"
    >
      {children}
      <button type="submit" className={buttonClass("brand")}>
        Filtrar
      </button>
      <a href={resetHref} className={buttonClass("outline")}>
        Limpar
      </a>
    </form>
  );
}
