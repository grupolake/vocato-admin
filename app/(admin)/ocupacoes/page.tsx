import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/fields";
import { FilterForm } from "@/components/ui/filter-form";
import { PageHeader } from "@/components/ui/layout";
import { Pagination } from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { dateTime, first, pageNumber } from "@/lib/format";
import type { CareerRow, Page } from "@/lib/types";

export default async function CareersPage({
  searchParams,
}: PageProps<"/ocupacoes">) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    level: first(sp.level),
    published: first(sp.published),
  };
  const data = await api.get<Page<CareerRow>>("/admin/careers", {
    ...filters,
    page: pageNumber(sp.page),
    pageSize: 20,
  });

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Ocupações"
        actions={<LinkButton href="/ocupacoes/nova">Nova ocupação</LinkButton>}
      />
      <FilterForm resetHref="/ocupacoes">
        <Field label="Busca">
          <Input name="q" defaultValue={filters.q} placeholder="nome ou slug" />
        </Field>
        <Field label="Nível">
          <Select
            name="level"
            defaultValue={filters.level ?? ""}
            placeholder="Todos"
            options={[
              { value: "tecnico", label: "Técnico" },
              { value: "graduacao", label: "Graduação" },
              { value: "pos", label: "Pós" },
            ]}
          />
        </Field>
        <Field label="Status">
          <Select
            name="published"
            defaultValue={filters.published ?? ""}
            placeholder="Todas"
            options={[
              { value: "true", label: "Publicadas" },
              { value: "false", label: "Rascunhos" },
            ]}
          />
        </Field>
      </FilterForm>
      <DataTable
        rows={data.items}
        rowKey={(c) => c.id}
        columns={[
          {
            header: "Ocupação",
            cell: (c) => (
              <Link href={`/ocupacoes/${c.id}`} className="font-semibold">
                {c.nameM}
                <span className="block font-mono text-xs font-normal text-muted">
                  {c.slug}
                </span>
              </Link>
            ),
          },
          { header: "Nível", cell: (c) => c.level },
          {
            header: "Holland",
            cell: (c) => <span className="lf-figure font-semibold">{c.code}</span>,
          },
          {
            header: "Cursos vinculados",
            cell: (c) => <span className="lf-figure">{c._count.courseMaps}</span>,
          },
          {
            header: "Status",
            cell: (c) => (
              <Badge tone={c.published ? "positive" : "neutral"}>
                {c.published ? "publicada" : "rascunho"}
              </Badge>
            ),
          },
          {
            header: "Atualizada",
            cell: (c) => <span className="lf-figure">{dateTime(c.updatedAt)}</span>,
          },
        ]}
      />
      <Pagination
        basePath="/ocupacoes"
        params={filters}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
      />
    </>
  );
}
