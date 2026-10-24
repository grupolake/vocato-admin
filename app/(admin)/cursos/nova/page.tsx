import { ActionForm } from "@/components/ui/action-form";
import { Field, Input } from "@/components/ui/fields";
import { PageHeader, Panel } from "@/components/ui/layout";
import { requireAdmin } from "@/lib/auth";
import { createCourse } from "../actions";
import { CourseFields } from "../course-fields";

export default async function NewCoursePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader eyebrow="Cursos" title="Novo curso" />
      <Panel className="max-w-2xl">
        <ActionForm action={createCourse} submitLabel="Criar curso">
          <Field label="ID e-MEC" hint="Código do curso no e-MEC (não é gerado automaticamente).">
            <Input name="id" type="number" min={1} required />
          </Field>
          <CourseFields />
        </ActionForm>
      </Panel>
    </>
  );
}
