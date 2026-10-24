import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/fields";
import { FilterForm } from "@/components/ui/filter-form";
import { PageHeader } from "@/components/ui/layout";
import { Pagination } from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { first, pageNumber } from "@/lib/format";
import type { Course, Page } from "@/lib/types";

export default async function CoursesPage({
  searchParams,
}: PageProps<"/cursos">) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    institutionId: first(sp.institutionId),
    uf: first(sp.uf)?.toUpperCase(),
    modality: first(sp.modality),
  };
  const data = await api.get<Page<Course>>("/admin/courses", {
    ...filters,
    page: pageNumber(sp.page),
    pageSize: 20,
  });

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Cursos"
        actions={<LinkButton href="/cursos/nova">Novo curso</LinkButton>}
      />
      <FilterForm resetHref="/cursos">
        <Field label="Busca">
          <Input name="q" defaultValue={filters.q} placeholder="nome do curso" />
        </Field>
        <Field label="Faculdade (ID e-MEC)">
          <Input
            name="institutionId"
            type="number"
            min={1}
            defaultValue={filters.institutionId}
            className="w-32"
          />
        </Field>
        <Field label="UF">
          <Input name="uf" maxLength={2} defaultValue={filters.uf} className="w-20 uppercase" />
        </Field>
        <Field label="Modalidade">
          <Input name="modality" defaultValue={filters.modality} placeholder="presencial, EAD..." />
        </Field>
      </FilterForm>
      <DataTable
        rows={data.items}
        rowKey={(i) => i.id}
        columns={[
          {
            header: "ID",
            cell: (i) => <span className="lf-figure">{i.id}</span>,
          },
          {
            header: "Curso",
            cell: (i) => (
              <Link href={`/cursos/${i.id}`} className="font-semibold">
                {i.name}
              </Link>
            ),
          },
          {
            header: "Faculdade",
            cell: (i) => (
              <Link href={`/faculdades/${i.institutionId}`}>
                {i.institution?.name ?? "—"}
              </Link>
            ),
          },
          {
            header: "Grau",
            cell: (i) => i.degree,
          },
          {
            header: "Modalidade",
            cell: (i) => i.modality,
          },
          {
            header: "Local",
            cell: (i) => [i.city, i.uf].filter(Boolean).join(" / ") || "—",
          },
        ]}
      />
      <Pagination
        basePath="/cursos"
        params={filters}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
      />
    </>
  );
}
