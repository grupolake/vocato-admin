import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm, ConfirmForm } from "@/components/ui/action-form";
import { Notice, PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import type { Institution } from "@/lib/types";
import { deleteInstitution, updateInstitution } from "../actions";
import { InstitutionFields } from "../institution-fields";

export default async function InstitutionPage({
  params,
}: PageProps<"/faculdades/[id]">) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const inst = await api
    .get<Institution>(`/admin/institutions/${id}`)
    .catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) notFound();
      throw e;
    });
  const courses = inst._count?.courses ?? 0;

  return (
    <>
      <PageHeader eyebrow={`e-MEC ${inst.id}`} title={inst.name} />
      <div className="grid max-w-2xl gap-6">
        <Panel title="Dados">
          <ActionForm action={updateInstitution.bind(null, id)}>
            <InstitutionFields value={inst} />
          </ActionForm>
        </Panel>
        <Panel title="Cursos">
          <Link href={`/cursos?institutionId=${id}`}>
            Ver os {courses} cursos desta faculdade
          </Link>
        </Panel>
        <Panel title="Zona de perigo">
          {courses > 0 ? (
            <Notice tone="warning">
              Remova ou mova os {courses} cursos antes de excluir a faculdade.
            </Notice>
          ) : (
            <ConfirmForm action={deleteInstitution.bind(null, id)} />
          )}
        </Panel>
      </div>
    </>
  );
}
