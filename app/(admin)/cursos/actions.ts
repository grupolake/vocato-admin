"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { run } from "@/lib/action";
import { api } from "@/lib/api";

const optional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v));

const CourseSchema = z.object({
  institutionId: z.coerce.number().int().positive("Informe a faculdade"),
  name: z.string().trim().min(2, "Informe o nome"),
  degree: z.string().trim().min(2, "Informe o grau"),
  modality: z.string().trim().min(2, "Informe a modalidade"),
  uf: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v.toUpperCase()))
    .pipe(z.string().length(2).nullable()),
  city: optional,
});

const parse = (fd: FormData) =>
  CourseSchema.parse({
    institutionId: fd.get("institutionId"),
    name: fd.get("name"),
    degree: fd.get("degree"),
    modality: fd.get("modality"),
    uf: fd.get("uf") ?? "",
    city: fd.get("city") ?? "",
  });

export async function createCourse(fd: FormData) {
  const id = z.coerce.number().int().positive().safeParse(fd.get("id"));
  if (!id.success) return { ok: false as const, error: "ID e-MEC inválido." };
  const res = await run(() =>
    api.send("POST", "/admin/courses", { id: id.data, ...parse(fd) }),
  );
  if (!res.ok) return res;
  revalidatePath("/cursos");
  redirect(`/cursos/${id.data}`);
}

export async function updateCourse(id: number, fd: FormData) {
  const res = await run(() =>
    api.send("PATCH", `/admin/courses/${id}`, parse(fd)),
  );
  if (res.ok) revalidatePath("/cursos");
  return res;
}

export async function deleteCourse(id: number) {
  const res = await run(() => api.send("DELETE", `/admin/courses/${id}`));
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/cursos");
  redirect("/cursos");
}
