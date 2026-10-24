import { Field, Input } from "@/components/ui/fields";
import type { Course } from "@/lib/types";

export function CourseFields({ value }: { value?: Course }) {
  return (
    <>
      <Field label="Faculdade (ID e-MEC)">
        <Input
          name="institutionId"
          type="number"
          min={1}
          required
          defaultValue={value?.institutionId}
        />
      </Field>
      <Field label="Nome">
        <Input name="name" required defaultValue={value?.name} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Grau">
          <Input name="degree" required defaultValue={value?.degree} />
        </Field>
        <Field label="Modalidade">
          <Input name="modality" required defaultValue={value?.modality} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="UF">
          <Input
            name="uf"
            maxLength={2}
            defaultValue={value?.uf ?? ""}
            className="uppercase"
          />
        </Field>
        <Field label="Cidade">
          <Input name="city" defaultValue={value?.city ?? ""} />
        </Field>
      </div>
    </>
  );
}
