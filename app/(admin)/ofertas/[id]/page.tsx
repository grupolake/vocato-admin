import { notFound } from "next/navigation";
import { ActionForm, ConfirmForm } from "@/components/ui/action-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice, PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import type { Offer } from "@/lib/types";
import { deleteOffer, toggleOffer, updateOffer } from "../actions";
import { OfferFields } from "../offer-fields";

export default async function OfferPage({ params }: PageProps<"/ofertas/[id]">) {
  const { id } = await params;
  const offer = await api.get<Offer>(`/admin/offers/${id}`).catch((e: unknown) => {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) {
      notFound();
    }
    throw e;
  });
  const clicks = offer._count?.clicks ?? 0;

  return (
    <>
      <PageHeader
        eyebrow={`${clicks} cliques`}
        title={offer.title}
        actions={
          <>
            <Badge tone={offer.active ? "positive" : "neutral"}>
              {offer.active ? "ativa" : "inativa"}
            </Badge>
            <form action={toggleOffer.bind(null, id, !offer.active)}>
              <Button type="submit" variant="outline" size="sm">
                {offer.active ? "Desativar" : "Ativar"}
              </Button>
            </form>
          </>
        }
      />
      <div className="grid max-w-2xl gap-6">
        <Panel title="Dados">
          <ActionForm action={updateOffer.bind(null, id)}>
            <OfferFields value={offer} />
          </ActionForm>
        </Panel>
        <Panel title="Zona de perigo">
          {clicks > 0 ? (
            <Notice tone="warning">
              Esta oferta tem {clicks} cliques registrados e não pode ser
              excluída. Desative-a para tirá-la das recomendações.
            </Notice>
          ) : (
            <ConfirmForm action={deleteOffer.bind(null, id)} />
          )}
        </Panel>
      </div>
    </>
  );
}
