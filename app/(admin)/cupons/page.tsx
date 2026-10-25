import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterForm } from "@/components/ui/filter-form";
import { Field, Input, Select } from "@/components/ui/fields";
import { PageHeader } from "@/components/ui/layout";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { brl, first } from "@/lib/format";
import type { Coupon } from "@/lib/types";
import { Plus } from "lucide-react";

const KIND_LABEL: Record<string, string> = {
  influencer: "Influenciador",
  campaign: "Campanha",
  special: "Especial / VIP",
  support: "Suporte",
};

export default async function CouponsPage({ searchParams }: PageProps<"/cupons">) {
  const sp = await searchParams;
  const filters = {
    kind: first(sp.kind),
    active: first(sp.active),
    search: first(sp.search),
  };

  const coupons = await api.get<Coupon[]>("/admin/coupons", filters);

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.active).length;
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <PageHeader eyebrow="Marketing & Parcerias" title="Cupons de Desconto" />
        <Link href="/cupons/nova">
          <Button className="flex items-center gap-1.5">
            <Plus size={16} />
            Novo Cupom
          </Button>
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Total de Cupons</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">{totalCoupons}</p>
          <span className="text-xs text-secondary">{activeCoupons} ativos</span>
        </div>

        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Cupons Ativos</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">{activeCoupons}</p>
          <span className="text-xs text-positive font-semibold">Disponíveis no checkout</span>
        </div>

        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Total de Usos</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">{totalUses}</p>
          <span className="text-xs text-secondary">Utilizações registradas</span>
        </div>
      </div>

      {/* Filtros */}
      <FilterForm resetHref="/cupons">
        <Field label="Buscar código / influencer">
          <Input name="search" defaultValue={filters.search} placeholder="PROMO10, lucas..." />
        </Field>
        <Field label="Tipo">
          <Select
            name="kind"
            defaultValue={filters.kind ?? ""}
            placeholder="Todos"
            options={[
              { value: "campaign", label: "Campanha" },
              { value: "influencer", label: "Influenciador" },
              { value: "special", label: "Especial / VIP" },
              { value: "support", label: "Suporte" },
            ]}
          />
        </Field>
        <Field label="Status">
          <Select
            name="active"
            defaultValue={filters.active ?? ""}
            placeholder="Todos"
            options={[
              { value: "true", label: "Ativo" },
              { value: "false", label: "Inativo" },
            ]}
          />
        </Field>
      </FilterForm>

      {/* Tabela de Cupons */}
      <DataTable
        rows={coupons}
        rowKey={(c) => c.id}
        columns={[
          {
            header: "Código",
            cell: (c) => (
              <div className="flex flex-col">
                <Link href={`/cupons/${c.id}`} className="font-bold text-base hover:underline text-brand">
                  {c.code}
                </Link>
                {c.description && <span className="text-xs text-muted truncate max-w-xs">{c.description}</span>}
              </div>
            ),
          },
          {
            header: "Desconto",
            cell: (c) => {
              if (c.discountType === "vip_free") {
                return <Badge tone="positive">100% Grátis (VIP)</Badge>;
              }
              if (c.discountType === "percentage") {
                return <Badge tone="neutral">{c.discountValue}% OFF</Badge>;
              }
              return <Badge tone="neutral">{brl(c.discountValue)} OFF</Badge>;
            },
          },
          {
            header: "Tipo",
            cell: (c) => <span className="text-xs font-medium">{KIND_LABEL[c.kind] ?? c.kind}</span>,
          },
          {
            header: "Influenciador / Comissão",
            cell: (c) =>
              c.influencerName ? (
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-strong">{c.influencerName}</span>
                  {c.commissionPct > 0 && (
                    <span className="text-[11px] text-muted">{c.commissionPct}% comissão</span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-muted">—</span>
              ),
          },
          {
            header: "Utilizações",
            cell: (c) => (
              <span className="lf-figure text-sm">
                {c.usedCount}
                {c.maxUses ? ` / ${c.maxUses}` : " / ∞"}
              </span>
            ),
          },
          {
            header: "Status",
            cell: (c) => (
              <Badge tone={c.active ? "positive" : "neutral"}>
                {c.active ? "Ativo" : "Inativo"}
              </Badge>
            ),
          },
          {
            header: "Ações",
            cell: (c) => (
              <Link href={`/cupons/${c.id}`} className="text-xs font-bold text-brand hover:underline">
                Gerenciar ›
              </Link>
            ),
          },
        ]}
      />
    </>
  );
}
