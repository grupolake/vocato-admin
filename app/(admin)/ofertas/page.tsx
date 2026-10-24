import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/fields";
import { FilterForm } from "@/components/ui/filter-form";
import { PageHeader } from "@/components/ui/layout";
import { Pagination } from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { first, pageNumber } from "@/lib/format";
import type { Offer, Page } from "@/lib/types";

const KIND = {
  livre: "Curso livre",
  tecnico: "Técnico",
  graduacao_ead: "Graduação EAD",
} as const;

export default async function OffersPage({
  searchParams,
}: PageProps<"/ofertas">) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    kind: first(sp.kind),
    active: first(sp.active),
  };
  const data = await api.get<Page<Offer>>("/admin/offers", {
    ...filters,
    page: pageNumber(sp.page),
    pageSize: 20,
  });

  return (
    <>
      <PageHeader
        eyebrow="Monetização"
        title="Ofertas de afiliados"
        actions={<LinkButton href="/ofertas/nova">Nova oferta</LinkButton>}
      />
      <FilterForm resetHref="/ofertas">
        <Field label="Busca">
          <Input name="q" defaultValue={filters.q} placeholder="título ou parceiro" />
        </Field>
        <Field label="Tipo">
          <Select
            name="kind"
            defaultValue={filters.kind ?? ""}
            placeholder="Todos"
            options={Object.entries(KIND).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </Field>
        <Field label="Status">
          <Select
            name="active"
            defaultValue={filters.active ?? ""}
            placeholder="Todas"
            options={[
              { value: "true", label: "Ativas" },
              { value: "false", label: "Inativas" },
            ]}
          />
        </Field>
      </FilterForm>
      <DataTable
        rows={data.items}
        rowKey={(o) => o.id}
        columns={[
          {
            header: "Oferta",
            cell: (o) => (
              <Link href={`/ofertas/${o.id}`} className="font-semibold">
                {o.title}
                <span className="block text-xs font-normal text-muted">
                  {o.provider}
                </span>
              </Link>
            ),
          },
          { header: "Tipo", cell: (o) => KIND[o.kind] },
          {
            header: "Idade mín.",
            cell: (o) => <span className="lf-figure">{o.minAge}</span>,
          },
          {
            header: "Dimensões",
            cell: (o) => (
              <span className="font-mono">{o.dims.join(" ") || "—"}</span>
            ),
          },
          {
            header: "Cliques",
            cell: (o) => <span className="lf-figure">{o._count?.clicks ?? 0}</span>,
          },
          {
            header: "Status",
            cell: (o) => (
              <Badge tone={o.active ? "positive" : "neutral"}>
                {o.active ? "ativa" : "inativa"}
              </Badge>
            ),
          },
        ]}
      />
      <Pagination
        basePath="/ofertas"
        params={filters}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
      />
    </>
  );
}
