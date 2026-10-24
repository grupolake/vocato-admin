export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

/** searchParams podem vir como string | string[]; pegamos o primeiro valor. */
export const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export const pageNumber = (v: string | string[] | undefined) =>
  Math.max(1, Number.parseInt(first(v) ?? "1", 10) || 1);
