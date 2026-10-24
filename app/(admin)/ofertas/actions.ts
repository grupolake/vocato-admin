"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { run } from "@/lib/action";
import { api } from "@/lib/api";

const OfferSchema = z.object({
  provider: z.string().trim().min(2, "Informe o parceiro"),
  title: z.string().trim().min(2, "Informe o título"),
  trackingUrl: z
    .url("Link inválido")
    .refine((u) => /^https?:\/\//i.test(u), "O link deve ser http(s)"),
  kind: z.enum(["livre", "tecnico", "graduacao_ead"]),
  minAge: z.coerce.number().int().min(0).max(120),
  dims: z.array(z.enum(["R", "I", "A", "S", "E", "C"])),
  careerSlugs: z.array(z.string()),
  active: z.boolean(),
});

function parse(fd: FormData) {
  return OfferSchema.safeParse({
    provider: fd.get("provider"),
    title: fd.get("title"),
    trackingUrl: fd.get("trackingUrl"),
    kind: fd.get("kind"),
    minAge: fd.get("minAge"),
    dims: fd.getAll("dims"),
    careerSlugs: String(fd.get("careerSlugs") ?? "")
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean),
    active: fd.get("active") === "on",
  });
}

export async function createOffer(fd: FormData) {
  const parsed = parse(fd);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const res = await run(() =>
    api.send<{ id: string }>("POST", "/admin/offers", parsed.data),
  );
  if (!res.ok) return res;
  revalidatePath("/ofertas");
  redirect(`/ofertas/${res.data.id}`);
}

export async function updateOffer(id: string, fd: FormData) {
  const parsed = parse(fd);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }
  const res = await run(() =>
    api.send("PATCH", `/admin/offers/${id}`, parsed.data),
  );
  if (res.ok) revalidatePath("/ofertas");
  return res;
}

export async function toggleOffer(id: string, active: boolean) {
  const res = await run(() =>
    api.send("PATCH", `/admin/offers/${id}`, { active }),
  );
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/ofertas");
  revalidatePath(`/ofertas/${id}`);
}

export async function deleteOffer(id: string) {
  const res = await run(() => api.send("DELETE", `/admin/offers/${id}`));
  if (!res.ok) throw new Error(res.error);
  revalidatePath("/ofertas");
  redirect("/ofertas");
}
