import { ActionForm } from "@/components/ui/action-form";
import { Field, Input } from "@/components/ui/fields";
import { PageHeader, Panel } from "@/components/ui/layout";
import { requireAdmin } from "@/lib/auth";
import { createInstitution } from "../actions";
import { InstitutionFields } from "../institution-fields";

export default async function NewInstitutionPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader eyebrow="Faculdades" title="Nova faculdade" />
      <Panel className="max-w-2xl">
        <ActionForm action={createInstitution} submitLabel="Criar faculdade">
          <Field label="ID e-MEC" hint="Código da instituição no e-MEC (não é gerado automaticamente).">
            <Input name="id" type="number" min={1} required />
          </Field>
          <InstitutionFields />
        </ActionForm>
      </Panel>
    </>
  );
}
