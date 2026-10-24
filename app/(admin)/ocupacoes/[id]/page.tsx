import { notFound } from "next/navigation";
import { ActionForm, ConfirmForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import type { Career } from "@/lib/types";
import { deleteCareer, togglePublished, updateCareer } from "../actions";
import { CareerFields } from "../career-fields";
import { PatternManager } from "../pattern-manager";

export default async function CareerPage({
  params,
}: PageProps<"/ocupacoes/[id]">) {
  const { id } = await params;
  const career = await api
    .get<Career>(`/admin/careers/${id}`)
    .catch((e: unknown) => {
      if (e instanceof ApiError && (e.status === 404 || e.status === 400)) {
        notFound();
      }
      throw e;
    });

  return (
    <>
      <PageHeader
        eyebrow={career.slug}
        title={career.nameM}
        actions={
          <>
            <Badge tone={career.published ? "positive" : "neutral"}>
              {career.published ? "publicada" : "rascunho"}
            </Badge>
            <form action={togglePublished.bind(null, id, !career.published)}>
              <Button type="submit" variant="outline" size="sm">
                {career.published ? "Despublicar" : "Publicar"}
              </Button>
            </form>
          </>
        }
      />
      <div className="grid max-w-4xl gap-6">
        <Panel title="Cursos vinculados">
          <PatternManager
            careerId={id}
            patterns={career.courseMaps.map((m) => m.coursePattern)}
          />
        </Panel>
        <Panel title="Dados">
          <ActionForm action={updateCareer.bind(null, id)}>
            <CareerFields value={career} />
          </ActionForm>
        </Panel>
        <Panel title="Zona de perigo">
          <ConfirmForm
            action={deleteCareer.bind(null, id)}
            message="Excluir esta ocupação e seus vínculos de curso?"
          />
        </Panel>
      </div>
    </>
  );
}
