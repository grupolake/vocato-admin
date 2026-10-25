import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/ui/layout";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { brl, dateTime } from "@/lib/format";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/order-status";
import type { Coupon, CouponInfluencerMetrics, Order } from "@/lib/types";
import { updateCoupon, toggleCoupon } from "../actions";
import { CouponFields } from "../coupon-fields";
import { ArrowLeft, ExternalLink, Power } from "lucide-react";

export default async function CouponDetailPage({ params }: PageProps<"/cupons/[id]">) {
  await requireAdmin();
  const { id } = await params;

  let coupon: (Coupon & { metrics?: CouponInfluencerMetrics; orders?: Order[] }) | null = null;
  try {
    coupon = await api.get<Coupon & { metrics?: CouponInfluencerMetrics; orders?: Order[] }>(
      `/admin/coupons/${encodeURIComponent(id)}`
    );
  } catch {
    notFound();
  }

  if (!coupon) notFound();

  const updateWithId = updateCoupon.bind(null, coupon.id);
  const toggleWithId = toggleCoupon.bind(null, coupon.id);

  const affiliateLink = `https://vocatocareer.com.br/?ref=${coupon.code}`;
  const metrics = coupon.metrics;

  return (
    <>
      <div className="mb-4">
        <Link href="/cupons" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-strong">
          <ArrowLeft size={14} /> Voltar para lista de cupons
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <PageHeader
            eyebrow={`Cupom · ${coupon.kind}`}
            title={coupon.code}
          />
        </div>

        <div className="flex items-center gap-2">
          <form action={toggleWithId}>
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-1.5"
            >
              <Power size={14} className={coupon.active ? "text-positive" : "text-muted"} />
              {coupon.active ? "Desativar cupom" : "Ativar cupom"}
            </Button>
          </form>
        </div>
      </div>

      {/* Painel de Métricas do Influenciador / Campanha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Pedidos com este cupom</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">
            {metrics?.ordersCount ?? coupon.usedCount}
          </p>
          <span className="text-xs text-secondary">
            {metrics?.paidOrdersCount ?? 0} pagos confirmados
          </span>
        </div>

        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Receita Bruta Gerada</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">
            {brl(metrics?.grossRevenueCents ?? 0)}
          </p>
          <span className="text-xs text-positive font-semibold">Vendas atribuídas</span>
        </div>

        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Comissão Devida</span>
          <p className="lf-figure mt-2 text-2xl font-semibold text-strong">
            {brl(metrics?.commissionCents ?? 0)}
          </p>
          <span className="text-xs text-secondary">
            {coupon.commissionPct}% sobre pedidos pagos
          </span>
        </div>

        <div className="rounded-[20px] bg-tile p-4">
          <span className="text-xs font-bold text-muted uppercase">Status & Usos</span>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={coupon.active ? "positive" : "neutral"}>
              {coupon.active ? "Ativo" : "Inativo"}
            </Badge>
            <span className="text-sm font-semibold text-strong">
              {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : "usos"}
            </span>
          </div>
        </div>
      </div>

      {/* Link de Divulgação do Influenciador */}
      <Panel className="mb-6 p-4 bg-[var(--lake-50)] border-[var(--lake-100)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-[var(--lake-900)]">Link de Parceria / Influenciador</span>
            <span className="text-xs text-[var(--ink-700)] font-mono select-all">
              {affiliateLink}
            </span>
          </div>
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--lake-700)] hover:bg-[var(--lake-600)] text-white text-xs font-bold self-start sm:self-auto"
          >
            Testar link <ExternalLink size={12} />
          </a>
        </div>
      </Panel>

      {/* Formulário de Edição */}
      <Panel className="mb-8 max-w-3xl">
        <h3 className="text-base font-extrabold text-strong mb-4">Editar Configurações do Cupom</h3>
        <ActionForm action={updateWithId} submitLabel="Salvar alterações">
          <CouponFields coupon={coupon} />
        </ActionForm>
      </Panel>

      {/* Pedidos Recentes que usaram este cupom */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-strong">
            Pedidos que utilizaram este cupom ({coupon.orders?.length ?? 0})
          </h3>
          <Link
            href={`/orders?couponCode=${encodeURIComponent(coupon.code)}`}
            className="text-xs font-bold text-brand hover:underline"
          >
            Ver todos no Financeiro ›
          </Link>
        </div>

        {coupon.orders && coupon.orders.length > 0 ? (
          <DataTable
            rows={coupon.orders}
            rowKey={(o) => o.id}
            columns={[
              {
                header: "Data",
                cell: (o) => <span className="lf-figure text-xs">{dateTime(o.createdAt)}</span>,
              },
              {
                header: "Cliente",
                cell: (o) => (
                  <Link href={`/orders/${o.id}`} className="font-semibold text-xs hover:underline">
                    {o.payerName}
                    <span className="block text-[11px] text-muted">{o.payerEmail}</span>
                  </Link>
                ),
              },
              {
                header: "Valor Pago",
                cell: (o) => <span className="lf-figure font-semibold text-xs">{brl(o.amountCents)}</span>,
              },
              {
                header: "Status",
                cell: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status] ?? o.status}</Badge>,
              },
              {
                header: "Ações",
                cell: (o) => (
                  <Link href={`/orders/${o.id}`} className="text-xs text-brand hover:underline">
                    Ver pedido ›
                  </Link>
                ),
              },
            ]}
          />
        ) : (
          <p className="text-xs text-muted p-4 bg-tile rounded-xl">
            Nenhum pedido utilizou este cupom até o momento.
          </p>
        )}
      </div>
    </>
  );
}
