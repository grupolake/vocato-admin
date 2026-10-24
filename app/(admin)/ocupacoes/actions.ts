"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { run } from "@/lib/action";
import { api } from "@/lib/api";

const score = z.coerce.number().min(0).max(100);
const nullable = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));

const json = (label: string) =>
  z
    .string()
    .trim()
    .transform((v, ctx) => {
      try {
        const parsed: unknown = JSON.parse(v);
        if (parsed === null) throw new Error("null");
        return parsed;
      } catch {
        ctx.addIssue({ code: "custom", message: `${label}: JSON inválido` });
        return z.NEVER;
      }
    });

const CareerSchema = z.object({
  slug: z.string().trim(),
  nameM: z.string().trim().min(2),
  nameF: z.string().trim().min(2),
  nameEn: nullable,
  onetSocCode: nullable,
  cboCode: nullable,
  level: z.enum(["tecnico", "graduacao", "pos"]),
  r: score,
  i: score,
  a: score,
  s: score,
  e: score,
  c: score,
  code: z.string().trim().toUpperCase(),
  description: z.string().trim().min(1),
  dailyTasks: json("Tarefas do dia a dia"),
  paths: json("Caminhos"),
  salaryJunior: z.string().trim().min(1),
  salaryPleno: z.string().trim().min(1),
  salarySenior: z.string().trim().min(1),
  salarySource: z.string().trim().min(1),
  published: z.boolean(),
});

function parse(fd: FormData) {
  const raw = Object.fromEntries(fd.entries());
  return CareerSchema.safeParse({ ...raw, published: raw.published === "on" });
}

const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Dados inválidos.";

export async function createCareer(fd: FormData) {
  const parsed = parse(fd);
  if (!parsed.success) return { ok: false as const, error: firstIssue(parsed.error) };
  const res = await run(() =>
    api.send<{ id: string }>("POST", "/admin/careers", parsed.data),
  );
  if (!res.ok) return res;
  revalidatePath("/ocupacoes");
  redirect(`/ocupacoes/${res.data.id}`);
}

export async function updateCareer(id: string, fd: FormData) {
  const parsed = parse(fd);
  if (!parsed.success) return { ok: false as const, error: firstIssue(parsed.error) };
  const res = await run(() =>
    api.send("PATCH", `/admin/careers/${id}`, parsed.data),
  );
  if (res.ok) revalidatePath("/ocupacoes");
  return res;
}

export async function togglePublished(id: string, published: boolean) {
  const res = await run(() =>
    api.send("PATCH", `/admin/careers/${id}`, { published }),
  );
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/ocupacoes");
  revalidatePath(`/ocupacoes/${id}`);
}

export async function deleteCareer(id: string) {
  const res = await run(() => api.send("DELETE", `/admin/careers/${id}`));
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/ocupacoes");
  redirect("/ocupacoes");
}

// ---------- Vínculos ocupação ↔ curso ----------

export async function addPattern(id: string, fd: FormData) {
  const pattern = z.string().trim().min(2).safeParse(fd.get("coursePattern"));
  if (!pattern.success) return { ok: false as const, error: "Padrão muito curto." };
  const res = await run(() =>
    api.send("POST", `/admin/careers/${id}/course-patterns`, {
      coursePattern: pattern.data,
    }),
  );
  if (res.ok) revalidatePath(`/ocupacoes/${id}`);
  return res;
}

export async function removePattern(id: string, coursePattern: string) {
  const res = await run(() =>
    api.send("DELETE", `/admin/careers/${id}/course-patterns`, { coursePattern }),
  );
  if (!res.ok) throw new Error(res.error);
  revalidatePath(`/ocupacoes/${id}`);
}

export interface PatternPreview {
  total: number;
  sample: { id: number; name: string; institution: { name: string } }[];
}

export async function previewPattern(pattern: string) {
  if (pattern.trim().length < 2) return { ok: false as const, error: "Digite ao menos 2 letras." };
  return run(() =>
    api.get<PatternPreview>("/admin/course-patterns/preview", { pattern }),
  );
}
