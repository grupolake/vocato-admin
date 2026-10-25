import { ActionForm } from "@/components/ui/action-form";
import { PageHeader, Panel } from "@/components/ui/layout";
import { requireAdmin } from "@/lib/auth";
import { createCoupon } from "../actions";
import { CouponFields } from "../coupon-fields";

export default async function NewCouponPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader eyebrow="Marketing" title="Novo Cupom" />
      <Panel className="max-w-2xl">
        <ActionForm action={createCoupon} submitLabel="Criar cupom">
          <CouponFields />
        </ActionForm>
      </Panel>
    </>
  );
}

