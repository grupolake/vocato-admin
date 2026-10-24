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
import type { Institution, Page } from "@/lib/types";

export default async function InstitutionsPage({
  searchParams,
}: PageProps<"/faculdades">) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    uf: first(sp.uf)?.toUpperCase(),
    isPublic: first(sp.isPublic),
  };
  const data = await api.get<Page<Institution>>("/admin/institutions", {
    ...filters,
    page: pageNumber(sp.page),
    pageSize: 20,
  });

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Faculdades"
        actions={<LinkButton href="/faculdades/nova">Nova faculdade</LinkButton>}
      />
      <FilterForm resetHref="/faculdades">
        <Field label="Busca">
          <Input name="q" defaultValue={filters.q} placeholder="nome, sigla ou cidade" />
        </Field>
        <Field label="UF">
          <Input name="uf" maxLength={2} defaultValue={filters.uf} className="w-20 uppercase" />
        </Field>
        <Field label="Tipo">
          <Select
            name="isPublic"
            defaultValue={filters.isPublic ?? ""}
            placeholder="Todas"
            options={[
              { value: "true", label: "Públicas" },
              { value: "false", label: "Privadas" },
            ]}
          />
        </Field>
      </FilterForm>
      <DataTable
        rows={data.items}
        rowKey={(i) => i.id}
        columns={[
          {
            header: "e-MEC",
            cell: (i) => <span className="lf-figure">{i.id}</span>,
          },
          {
            header: "Nome",
            cell: (i) => (
              <Link href={`/faculdades/${i.id}`} className="font-semibold">
                {i.name}
                {i.acronym && (
                  <span className="ml-2 text-xs font-normal text-muted">
                    {i.acronym}
                  </span>
                )}
              </Link>
            ),
          },
          {
            header: "Local",
            cell: (i) => [i.city, i.uf].filter(Boolean).join(" / ") || "—",
          },
          {
            header: "Tipo",
            cell: (i) => (
              <Badge tone={i.isPublic ? "brand" : "neutral"}>
                {i.isPublic ? "pública" : "privada"}
              </Badge>
            ),
          },
          {
            header: "Cursos",
            cell: (i) => (
              <Link href={`/cursos?institutionId=${i.id}`} className="lf-figure">
                {i._count?.courses ?? 0}
              </Link>
            ),
          },
        ]}
      />
      <Pagination
        basePath="/faculdades"
        params={filters}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
      />
    </>
  );
}
