"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { run } from "@/lib/action";
import { api } from "@/lib/api";
import type { QuestionnaireVersion } from "@/lib/types";

const text = z.string().trim();
const DimSchema = z.enum(["R", "I", "A", "S", "E", "C"]);

const QuestionSchema = z.object({
  dim: DimSchema,
  block: z.coerce.number().int().min(1).max(5),
  textEn: text.min(3, "Texto em inglês muito curto"),
  textPtBr: text
    .transform((v) => (v === "" ? null : v))
    .pipe(z.string().min(3, "Tradução muito curta").nullable()),
});

const refresh = (key: string) => {
  revalidatePath("/questionarios");
  revalidatePath(`/questionarios/${key}`);
};

export async function createVersion(fd: FormData) {
  const parsed = z
    .object({
      key: text.min(1, "Informe a chave"),
      cloneFrom: text.transform((v) => v || undefined),
    })
    .safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const res = await run(() =>
    api.send("POST", "/admin/questionnaire", parsed.data),
  );
  if (!res.ok) return res;
  revalidatePath("/questionarios");
  redirect(`/questionarios/${parsed.data.key}`);
}

export async function activateVersion(key: string) {
  const res = await run(() =>
    api.send("POST", `/admin/questionnaire/${key}/activate`),
  );
  if (!res.ok) throw new Error(res.error);
  refresh(key);
}

export async function retireVersion(key: string) {
  const res = await run(() =>
    api.send("POST", `/admin/questionnaire/${key}/retire`),
  );
  if (!res.ok) throw new Error(res.error);
  refresh(key);
}

export async function deleteVersion(key: string) {
  const res = await run(() => api.send("DELETE", `/admin/questionnaire/${key}`));
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/questionarios");
  redirect("/questionarios");
}

export async function addQuestion(key: string, fd: FormData) {
  const parsed = QuestionSchema.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const res = await run(() =>
    api.send("POST", `/admin/questionnaire/${key}/questions`, parsed.data),
  );
  if (res.ok) refresh(key);
  return res;
}

export async function updateQuestion(key: string, order: number, fd: FormData) {
  const parsed = QuestionSchema.safeParse(Object.fromEntries(fd.entries()));
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const res = await run(() =>
    api.send(
      "PATCH",
      `/admin/questionnaire/${key}/questions/${order}`,
      parsed.data,
    ),
  );
  if (res.ok) refresh(key);
  return res;
}

export async function deleteQuestion(key: string, order: number) {
  const res = await run(() =>
    api.send("DELETE", `/admin/questionnaire/${key}/questions/${order}`),
  );
  if (!res.ok) throw new Error(res.error);
  refresh(key);
}

/** Troca a pergunta de posição com a vizinha (-1 sobe, +1 desce). */
export async function moveQuestion(key: string, order: number, dir: -1 | 1) {
  const res = await run(async () => {
    const version = await api.get<QuestionnaireVersion>(
      `/admin/questionnaire/${key}`,
    );
    const orders = version.questions.map((q) => q.order);
    const i = orders.indexOf(order);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= orders.length) return;
    [orders[i], orders[j]] = [orders[j], orders[i]];
    await api.send("PUT", `/admin/questionnaire/${key}/questions/order`, {
      orders,
    });
  });
  if (!res.ok) throw new Error(res.error);
  refresh(key);
}
