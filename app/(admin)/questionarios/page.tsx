import Link from "next/link";
import { ActionForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/fields";
import { PageHeader, Panel } from "@/components/ui/layout";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { dateTime } from "@/lib/format";
import type { QuestionnaireVersion } from "@/lib/types";
import { createVersion } from "./actions";

const TONE = { active: "positive", draft: "warning", retired: "neutral" } as const;

export default async function QuestionnairesPage() {
  const versions = await api.get<QuestionnaireVersion[]>("/admin/questionnaire");

  return (
    <>
      <PageHeader eyebrow="Curadoria" title="Questionários" />
      <DataTable
        rows={versions}
        rowKey={(v) => v.key}
        columns={[
          {
            header: "Versão",
            cell: (v) => (
              <Link href={`/questionarios/${v.key}`} className="font-mono font-semibold">
                {v.key}
              </Link>
            ),
          },
          {
            header: "Status",
            cell: (v) => <Badge tone={TONE[v.status]}>{v.status}</Badge>,
          },
          {
            header: "Perguntas",
            cell: (v) => (
              <Link
                href={`/questionarios/${v.key}`}
                className="lf-figure font-semibold underline-offset-2 hover:underline"
              >
                {v.questions.length}
              </Link>
            ),
          },
          {
            header: "Sem tradução",
            cell: (v) => (
              <span className="lf-figure">
                {v.questions.filter((q) => !q.textPtBr?.trim()).length}
              </span>
            ),
          },
          {
            header: "Criada em",
            cell: (v) => <span className="lf-figure">{dateTime(v.createdAt)}</span>,
          },
          {
            header: "Ativada em",
            cell: (v) => <span className="lf-figure">{dateTime(v.activatedAt)}</span>,
          },
          {
            header: "",
            cell: (v) => (
              <LinkButton href={`/questionarios/${v.key}`} variant="outline" size="sm">
                Ver perguntas
              </LinkButton>
            ),
          },
        ]}
      />
      <Panel title="Nova versão (rascunho)" className="mt-8 max-w-xl">
        <ActionForm action={createVersion} submitLabel="Criar rascunho">
          <Field label="Chave" hint="Ex.: vocato-v4">
            <Input name="key" required pattern="[A-Za-z0-9][A-Za-z0-9._-]*" />
          </Field>
          <Field label="Clonar de" hint="Copia todas as perguntas da versão escolhida.">
            <Select
              name="cloneFrom"
              placeholder="Começar vazio"
              options={versions.map((v) => ({
                value: v.key,
                label: `${v.key} (${v.status})`,
              }))}
            />
          </Field>
        </ActionForm>
      </Panel>
    </>
  );
}
