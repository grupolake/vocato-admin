import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import { brl, dateTime } from "@/lib/format";
import type { Order, PaymentEvent } from "@/lib/types";
import { STATUS_TONE } from "@/lib/order-status";

export default async function OrderDetailPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const order = await api
    .get<Order & { events: PaymentEvent[] }>(`/admin/orders/${id}`)
    .catch((e: unknown) => {
      if (e instanceof ApiError && (e.status === 404 || e.status === 400)) {
        notFound();
      }
      throw e;
    });

  const rows: [string, React.ReactNode][] = [
    ["Pagador", `${order.payerName} · ${order.payerEmail}`],
    ["Valor", brl(order.amountCents)],
    ["Método", order.method],
    ["Gateway", order.gateway],
    ["Referência", order.gatewayRef ?? "—"],
    ["Payment ID", order.paymentId ?? "—"],
    ["Detalhe do status", order.statusDetail ?? "—"],
    ["Criada em", dateTime(order.createdAt)],
    ["Expira em", dateTime(order.expiresAt)],
    ["Paga em", dateTime(order.paidAt)],
    ["Assessment", order.assessmentId],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Orders"
        title={`Order ${order.id.slice(0, 8)}`}
        actions={<Badge tone={STATUS_TONE[order.status]}>{order.status}</Badge>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Dados">
          <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-[14.5px]">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd className="lf-figure break-all text-strong">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title={`Eventos de pagamento (${order.events.length})`}>
          {order.events.length === 0 && (
            <p className="text-muted">Nenhum evento registrado.</p>
          )}
          <ul className="flex flex-col gap-3">
            {order.events.map((ev) => (
              <li key={ev.id} className="rounded-[12px] bg-sunken p-3">
                <p className="text-sm font-bold text-strong">
                  {ev.type}{" "}
                  <span className="lf-figure font-normal text-muted">
                    {dateTime(ev.createdAt)}
                  </span>
                </p>
                <pre className="mt-2 max-h-48 overflow-auto font-mono text-xs">
                  {JSON.stringify(ev.payload, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <p className="mt-6">
        <Link href="/orders">← Voltar</Link>
      </p>
    </>
  );
}
