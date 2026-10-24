import { ActionForm } from "@/components/ui/action-form";
import { PageHeader, Panel } from "@/components/ui/layout";
import { requireAdmin } from "@/lib/auth";
import { createCareer } from "../actions";
import { CareerFields } from "../career-fields";

export default async function NewCareerPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader eyebrow="Ocupações" title="Nova ocupação" />
      <Panel className="max-w-4xl">
        <ActionForm action={createCareer} submitLabel="Criar ocupação">
          <CareerFields />
        </ActionForm>
      </Panel>
    </>
  );
}
