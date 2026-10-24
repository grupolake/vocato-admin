import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel } from "@/components/ui/layout";
import { DataTable } from "@/components/ui/table";
import { api } from "@/lib/api";
import { brl, dateTime } from "@/lib/format";
import { STATUS_TONE } from "@/lib/order-status";
import type {
  CareerRow,
  Course,
  Institution,
  OrdersPage,
  Page,
  QuestionnaireVersion,
} from "@/lib/types";

const one = { page: 1, pageSize: 1 };

export default async function DashboardPage() {
  const [orders, careers, courses, institutions, versions] = await Promise.all([
    api.get<OrdersPage>("/admin/orders", { page: 1, pageSize: 5 }),
    api.get<Page<CareerRow>>("/admin/careers", one),
    api.get<Page<Course>>("/admin/courses", one),
    api.get<Page<Institution>>("/admin/institutions", one),
    api.get<QuestionnaireVersion[]>("/admin/questionnaire"),
  ]);
  const active = versions.find((v) => v.status === "active");
  const paid = orders.totals.find((t) => t.status === "paid");

  const tiles = [
    { href: "/orders", label: "Orders pagas", value: paid?.count ?? 0, sub: brl(paid?.amountCents ?? 0) },
    { href: "/ocupacoes", label: "Ocupações", value: careers.total },
    { href: "/cursos", label: "Cursos", value: courses.total },
    { href: "/faculdades", label: "Faculdades", value: institutions.total },
    {
      href: "/questionarios",
      label: "Questionário ativo",
      value: active?.key ?? "nenhum",
      sub: active ? `${active.questions.length} perguntas` : undefined,
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Painel" title="Visão geral" />
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-[20px] bg-tile p-4 no-underline hover:bg-[var(--ink-200)]"
          >
            <p className="lf-eyebrow">{t.label}</p>
            <p className="lf-figure mt-2 text-2xl font-semibold text-strong">
              {t.value}
            </p>
            {t.sub && <p className="lf-figure text-sm text-secondary">{t.sub}</p>}
          </Link>
        ))}
      </div>
      <Panel title="Últimas orders">
        <DataTable
          rows={orders.items}
          rowKey={(o) => o.id}
          columns={[
            { header: "Criada em", cell: (o) => dateTime(o.createdAt) },
            {
              header: "Pagador",
              cell: (o) => <Link href={`/orders/${o.id}`}>{o.payerEmail}</Link>,
            },
            { header: "Valor", cell: (o) => brl(o.amountCents) },
            {
              header: "Status",
              cell: (o) => <Badge tone={STATUS_TONE[o.status]}>{o.status}</Badge>,
            },
          ]}
        />
      </Panel>
    </>
  );
}
