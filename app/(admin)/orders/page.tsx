import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FilterForm } from "@/components/ui/filter-form";
import { Field, Input, Select } from "@/components/ui/fields";
import { PageHeader } from "@/components/ui/layout";
import { Pagination } from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { brl, dateTime, first, pageNumber } from "@/lib/format";
import { STATUS_TONE, STATUS_LABEL } from "@/lib/order-status";
import type { OrdersPage } from "@/lib/types";

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  const sp = await searchParams;
  const filters = {
    status: first(sp.status),
    method: first(sp.method),
    gateway: first(sp.gateway),
    email: first(sp.email),
    couponCode: first(sp.couponCode),
    from: first(sp.from),
    to: first(sp.to),
  };
  const page = pageNumber(sp.page);
  const data = await api.get<OrdersPage>("/admin/orders", {
    ...filters,
    page,
    pageSize: 20,
  });

  return (
    <>
      <PageHeader eyebrow="Financeiro" title="Orders" />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {data.totals.map((t) => (
          <div key={t.status} className="rounded-[20px] bg-tile p-4">
            <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status] ?? t.status}</Badge>
            <p className="lf-figure mt-2 text-2xl font-semibold text-strong">
              {t.count}
            </p>
            <p className="lf-figure text-sm text-secondary">
              {brl(t.amountCents)}
            </p>
          </div>
        ))}
      </div>

      <FilterForm resetHref="/orders">
        <Field label="E-mail">
          <Input name="email" defaultValue={filters.email} placeholder="buscar…" />
        </Field>
        <Field label="Cupom">
          <Input name="couponCode" defaultValue={filters.couponCode} placeholder="ex: PROFISSAO10" />
        </Field>
        <Field label="Status">
          <Select
            name="status"
            defaultValue={filters.status ?? ""}
            placeholder="Todos"
            options={(["pending", "paid", "failed", "expired"] as const).map(
              (v) => ({ value: v, label: STATUS_LABEL[v] }),
            )}
          />
        </Field>
        <Field label="Método">
          <Select
            name="method"
            defaultValue={filters.method ?? ""}
            placeholder="Todos"
            options={[
              { value: "pix", label: "Pix" },
              { value: "credit_card", label: "Cartão de Crédito" },
            ]}
          />
        </Field>
        <Field label="Gateway">
          <Input name="gateway" defaultValue={filters.gateway} placeholder="mercadopago" />
        </Field>
        <Field label="De">
          <Input type="date" name="from" defaultValue={filters.from} />
        </Field>
        <Field label="Até">
          <Input type="date" name="to" defaultValue={filters.to} />
        </Field>
      </FilterForm>

      <DataTable
        rows={data.items}
        rowKey={(o) => o.id}
        columns={[
          {
            header: "Criada em",
            cell: (o) => <span className="lf-figure">{dateTime(o.createdAt)}</span>,
          },
          {
            header: "Pagador",
            cell: (o) => (
              <Link href={`/orders/${o.id}`} className="font-semibold">
                {o.payerName}
                <span className="block text-xs font-normal text-muted">
                  {o.payerEmail}
                </span>
              </Link>
            ),
          },
          { header: "Método", cell: (o) => o.method === "pix" ? "Pix" : "Cartão" },
          {
            header: "Cupom",
            cell: (o) =>
              o.couponCode ? (
                <Link href={`/cupons?search=${encodeURIComponent(o.couponCode)}`}>
                  <Badge tone="positive">{o.couponCode}</Badge>
                </Link>
              ) : (
                <span className="text-xs text-muted">—</span>
              ),
          },
          {
            header: "Valor",
            cell: (o) => (
              <div className="flex flex-col">
                <span className="lf-figure font-semibold">{brl(o.amountCents)}</span>
                {o.discountCents && o.discountCents > 0 ? (
                  <span className="text-[11px] text-muted line-through">
                    {brl(o.originalAmountCents || o.amountCents + o.discountCents)}
                  </span>
                ) : null}
              </div>
            ),
          },
          {
            header: "Status",
            cell: (o) => <Badge tone={STATUS_TONE[o.status]}>{STATUS_LABEL[o.status] ?? o.status}</Badge>,
          },
          { header: "Gateway", cell: (o) => o.gateway },
        ]}
      />
      <Pagination
        basePath="/orders"
        params={filters}
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
      />
    </>
  );
}
