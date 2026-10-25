import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Notice, PageHeader, Panel } from "@/components/ui/layout";
import { DataTable } from "@/components/ui/table";
import { AdminAuthError } from "@/lib/auth";
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

type Result<T> = { ok: true; data: T } | { ok: false; label: string };

/** Falha de uma chamada vira dado, não derruba o resto do painel. */
async function load<T>(label: string, call: Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await call };
  } catch (e) {
    if (e instanceof AdminAuthError) throw e;
    return { ok: false, label };
  }
}

export default async function DashboardPage() {
  const [orders, careers, courses, institutions, versions] = await Promise.all([
    load("orders", api.get<OrdersPage>("/admin/orders", { page: 1, pageSize: 5 })),
    load("ocupações", api.get<Page<CareerRow>>("/admin/careers", one)),
    load("cursos", api.get<Page<Course>>("/admin/courses", one)),
    load("faculdades", api.get<Page<Institution>>("/admin/institutions", one)),
    load("questionários", api.get<QuestionnaireVersion[]>("/admin/questionnaire")),
  ]);
  const failed = [orders, careers, courses, institutions, versions].flatMap(
    (r) => (r.ok ? [] : [r.label]),
  );

  const active = versions.ok
    ? versions.data.find((v) => v.status === "active")
    : undefined;
  const paid = orders.ok
    ? orders.data.totals.find((t) => t.status === "paid")
    : undefined;

  const tiles = [
    {
      href: "/orders",
      label: "Orders pagas",
      value: orders.ok ? (paid?.count ?? 0) : "—",
      sub: orders.ok ? brl(paid?.amountCents ?? 0) : undefined,
    },
    { href: "/ocupacoes", label: "Ocupações", value: careers.ok ? careers.data.total : "—" },
    { href: "/cursos", label: "Cursos", value: courses.ok ? courses.data.total : "—" },
    {
      href: "/faculdades",
      label: "Faculdades",
      value: institutions.ok ? institutions.data.total : "—",
    },
    {
      href: "/questionarios",
      label: "Questionário ativo",
      value: versions.ok ? (active?.key ?? "nenhum") : "—",
      sub: active ? `${active.questions.length} perguntas` : undefined,
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Painel" title="Visão geral" />
      {failed.length > 0 && (
        <div className="mb-4">
          <Notice tone="warning">
            Não foi possível carregar: {failed.join(", ")}. Verifique o
            vocato-api e recarregue a página.
          </Notice>
        </div>
      )}
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
        {orders.ok ? (
          <DataTable
            rows={orders.data.items}
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
        ) : (
          <p className="text-sm text-muted">Orders indisponíveis no momento.</p>
        )}
      </Panel>
    </>
  );
}
