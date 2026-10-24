import { ActionForm } from "@/components/ui/action-form";
import { PageHeader, Panel } from "@/components/ui/layout";
import { requireAdmin } from "@/lib/auth";
import { createOffer } from "../actions";
import { OfferFields } from "../offer-fields";

export default async function NewOfferPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader eyebrow="Ofertas" title="Nova oferta" />
      <Panel className="max-w-2xl">
        <ActionForm action={createOffer} submitLabel="Criar oferta">
          <OfferFields />
        </ActionForm>
      </Panel>
    </>
  );
}
