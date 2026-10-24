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

const InstitutionSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome"),
  acronym: optional,
  uf: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v.toUpperCase()))
    .pipe(z.string().length(2).nullable()),
  city: optional,
  isPublic: z.boolean(),
});

const parse = (fd: FormData) =>
  InstitutionSchema.parse({
    name: fd.get("name"),
    acronym: fd.get("acronym") ?? "",
    uf: fd.get("uf") ?? "",
    city: fd.get("city") ?? "",
    isPublic: fd.get("isPublic") === "on",
  });

export async function createInstitution(fd: FormData) {
  const id = z.coerce.number().int().positive().safeParse(fd.get("id"));
  if (!id.success) return { ok: false as const, error: "ID e-MEC inválido." };
  const res = await run(() =>
    api.send("POST", "/admin/institutions", { id: id.data, ...parse(fd) }),
  );
  if (!res.ok) return res;
  revalidatePath("/faculdades");
  redirect(`/faculdades/${id.data}`);
}

export async function updateInstitution(id: number, fd: FormData) {
  const res = await run(() =>
    api.send("PATCH", `/admin/institutions/${id}`, parse(fd)),
  );
  if (res.ok) revalidatePath("/faculdades");
  return res;
}

export async function deleteInstitution(id: number) {
  const res = await run(() => api.send("DELETE", `/admin/institutions/${id}`));
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/faculdades");
  redirect("/faculdades");
}
