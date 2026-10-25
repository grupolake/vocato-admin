"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function createCoupon(formData: FormData) {
  await requireAdmin({ fresh: true });

  const discountType = formData.get("discountType") as string;
  let discountValue = Number(formData.get("discountValue") || 0);

  // Se for desconto fixo em reais, converter para centavos
  if (discountType === "fixed_cents") {
    const rawReais = Number(formData.get("discountValueReais") || 0);
    if (rawReais > 0) discountValue = Math.round(rawReais * 100);
  }

  const rawMaxUses = formData.get("maxUses");
  const maxUses = rawMaxUses && Number(rawMaxUses) > 0 ? Number(rawMaxUses) : null;

  const rawStartsAt = formData.get("startsAt");
  const startsAt = rawStartsAt ? new Date(String(rawStartsAt)).toISOString() : null;

  const rawExpiresAt = formData.get("expiresAt");
  const expiresAt = rawExpiresAt ? new Date(String(rawExpiresAt)).toISOString() : null;

  const body = {
    code: String(formData.get("code") || "").trim().toUpperCase(),
    description: formData.get("description") ? String(formData.get("description")).trim() : null,
    discountType,
    discountValue,
    kind: formData.get("kind") as string,
    influencerName: formData.get("influencerName") ? String(formData.get("influencerName")).trim() : null,
    influencerEmail: formData.get("influencerEmail") ? String(formData.get("influencerEmail")).trim() : null,
    influencerSocial: formData.get("influencerSocial") ? String(formData.get("influencerSocial")).trim() : null,
    commissionPct: Number(formData.get("commissionPct") || 0),
    maxUses,
    startsAt,
    expiresAt,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  };

  try {
    const created = await api.send<{ id: string }>("POST", "/admin/coupons", body);
    revalidatePath("/cupons");
    redirect(`/cupons/${created.id}`);
  } catch (err) {
    if (err instanceof ApiError) return { ok: false as const, error: err.message };
    throw err;
  }
}

export async function updateCoupon(id: string, formData: FormData) {
  await requireAdmin({ fresh: true });

  const discountType = formData.get("discountType") as string;
  let discountValue = Number(formData.get("discountValue") || 0);

  if (discountType === "fixed_cents") {
    const rawReais = Number(formData.get("discountValueReais") || 0);
    if (rawReais > 0) discountValue = Math.round(rawReais * 100);
  }

  const rawMaxUses = formData.get("maxUses");
  const maxUses = rawMaxUses && Number(rawMaxUses) > 0 ? Number(rawMaxUses) : null;

  const rawStartsAt = formData.get("startsAt");
  const startsAt = rawStartsAt ? new Date(String(rawStartsAt)).toISOString() : null;

  const rawExpiresAt = formData.get("expiresAt");
  const expiresAt = rawExpiresAt ? new Date(String(rawExpiresAt)).toISOString() : null;

  const body = {
    code: String(formData.get("code") || "").trim().toUpperCase(),
    description: formData.get("description") ? String(formData.get("description")).trim() : null,
    discountType,
    discountValue,
    kind: formData.get("kind") as string,
    influencerName: formData.get("influencerName") ? String(formData.get("influencerName")).trim() : null,
    influencerEmail: formData.get("influencerEmail") ? String(formData.get("influencerEmail")).trim() : null,
    influencerSocial: formData.get("influencerSocial") ? String(formData.get("influencerSocial")).trim() : null,
    commissionPct: Number(formData.get("commissionPct") || 0),
    maxUses,
    startsAt,
    expiresAt,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  };

  try {
    await api.send("PATCH", `/admin/coupons/${encodeURIComponent(id)}`, body);
    revalidatePath("/cupons");
    revalidatePath(`/cupons/${id}`);
    return { ok: true as const };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false as const, error: err.message };
    throw err;
  }
}

export async function toggleCoupon(id: string) {
  await requireAdmin({ fresh: true });
  await api.send("PATCH", `/admin/coupons/${encodeURIComponent(id)}/toggle`);
  revalidatePath("/cupons");
  revalidatePath(`/cupons/${id}`);
}

