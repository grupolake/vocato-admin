import { notFound } from "next/navigation";
import { ActionForm, ConfirmForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice, PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import type { QuestionnaireVersion, Question } from "@/lib/types";
import {
  activateVersion,
  addQuestion,
  deleteQuestion,
  deleteVersion,
  moveQuestion,
  retireVersion,
  updateQuestion,
} from "../actions";
import { QuestionFields } from "../question-fields";

const TONE = { active: "positive", draft: "warning", retired: "neutral" } as const;
const LIKERT = ["Detesto", "Não gosto", "Não sei", "Gosto", "Adoro"];

export default async function QuestionnairePage({
  params,
}: PageProps<"/questionarios/[key]">) {
  const { key } = await params;
  const v = await api
    .get<QuestionnaireVersion>(`/admin/questionnaire/${key}`)
    .catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) notFound();
      throw e;
    });
  const draft = v.status === "draft";
  const errors = v.validation ?? [];

  // Lei de Miller (Chunking): Agrupa as perguntas por bloco (1 a 5)
  const blocksMap = new Map<number, Question[]>();
  for (const q of v.questions) {
    const list = blocksMap.get(q.block) ?? [];
    list.push(q);
    blocksMap.set(q.block, list);
  }
  const sortedBlocks = Array.from(blocksMap.keys()).sort((a, b) => a - b);

  return (
    <>
      <PageHeader
        eyebrow="Questionário"
        title={v.key}
        actions={
          <>
            <Badge tone={TONE[v.status]}>{v.status}</Badge>
            {draft && (
              <form action={activateVersion.bind(null, key)}>
                <Button type="submit" disabled={errors.length > 0}>
                  Ativar versão
                </Button>
              </form>
            )}
            {v.status === "active" && (
              <ConfirmForm
                action={retireVersion.bind(null, key)}
                label="Aposentar"
                message="Sem versão ativa o teste fica indisponível. Continuar?"
              />
            )}
          </>
        }
      />

      {!draft && (
        <div className="mb-4">
          <Notice>
            Versões {v.status === "active" ? "ativas" : "aposentadas"} são somente
            leitura. Clone em um rascunho para editar.
          </Notice>
        </div>
      )}
      {draft && errors.length > 0 && (
        <div className="mb-4 flex flex-col gap-1">
          <Notice tone="warning">
            Não dá para ativar ainda ({errors.length} pendência
            {errors.length > 1 ? "s" : ""}):
            <ul className="mt-1 list-disc pl-5">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Notice>
        </div>
      )}
      {draft && errors.length === 0 && (
        <div className="mb-4">
          <Notice tone="positive">Estrutura válida: pronto para ativar.</Notice>
        </div>
      )}

      <p className="mb-4 text-sm text-muted">
        Escala de resposta (fixa, não editável): {LIKERT.map((l, i) => `${i + 1} ${l}`).join(" · ")}
      </p>

      {/* Agrupamento em Blocos (Lei de Miller & Checkpoint Q24) */}
      <div className="flex flex-col gap-8">
        {sortedBlocks.map((blockNum) => {
          const blockQuestions = blocksMap.get(blockNum) ?? [];
          const isCheckpointBlock = blockNum === 2;

          return (
            <section key={blockNum} className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-tile border border-line-subtle">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-strong">
                    Bloco {blockNum}
                  </span>
                  <span className="text-xs text-secondary font-mono">
                    ({blockQuestions.length} perguntas)
                  </span>
                  {isCheckpointBlock && (
                    <Badge tone="positive">Checkpoint Fast Mode (24 Qs)</Badge>
                  )}
                </div>
                <span className="text-xs text-muted">
                  Perguntas #{blockQuestions[0]?.order} a #{blockQuestions[blockQuestions.length - 1]?.order}
                </span>
              </div>

              <ol className="flex flex-col gap-3">
                {blockQuestions.map((q) => {
                  const globalIdx = v.questions.findIndex((item) => item.id === q.id);
                  return (
                    <li
                      key={q.id}
                      className="rounded-[20px] border border-line-subtle bg-card p-4 shadow-xs"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="lf-eyebrow">
                          #{q.order} · {q.dim} · bloco {q.block}
                          {!q.textPtBr?.trim() && (
                            <span className="ml-2 text-warning font-semibold">sem tradução</span>
                          )}
                        </span>
                        {draft && (
                          <div className="flex items-center gap-2">
                            <form action={moveQuestion.bind(null, key, q.order, -1)}>
                              <Button type="submit" variant="outline" size="sm" disabled={globalIdx === 0}>
                                ↑
                              </Button>
                            </form>
                            <form action={moveQuestion.bind(null, key, q.order, 1)}>
                              <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                disabled={globalIdx === v.questions.length - 1}
                              >
                                ↓
                              </Button>
                            </form>
                            {/* Separador de segurança (Lei de Fitts: previne clique destrutivo acidental) */}
                            <div className="h-4 w-px bg-line-subtle mx-1" />
                            <ConfirmForm
                              action={deleteQuestion.bind(null, key, q.order)}
                              message={`Tem certeza que deseja excluir a pergunta #${q.order}?`}
                            />
                          </div>
                        )}
                      </div>
                      {draft ? (
                        <ActionForm action={updateQuestion.bind(null, key, q.order)}>
                          <QuestionFields value={q} />
                        </ActionForm>
                      ) : (
                        <div className="grid gap-1 text-[14.5px]">
                          <p className="text-muted text-xs">{q.textEn}</p>
                          <p className="text-strong font-medium">{q.textPtBr}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      {draft && (
        <>
          <Panel title="Adicionar pergunta" className="mt-8">
            <ActionForm action={addQuestion.bind(null, key)} submitLabel="Adicionar">
              <QuestionFields />
            </ActionForm>
          </Panel>
          {v._count?.assessments === 0 && (
            <Panel title="Zona de perigo" className="mt-6">
              <ConfirmForm
                action={deleteVersion.bind(null, key)}
                label="Excluir rascunho"
              />
            </Panel>
          )}
        </>
      )}
    </>
  );
}
