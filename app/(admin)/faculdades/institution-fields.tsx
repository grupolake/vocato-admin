import { Field, Input } from "@/components/ui/fields";
import type { Institution } from "@/lib/types";

export function InstitutionFields({ value }: { value?: Institution }) {
  return (
    <>
      <Field label="Nome">
        <Input name="name" required defaultValue={value?.name} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Sigla">
          <Input name="acronym" defaultValue={value?.acronym ?? ""} />
        </Field>
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
      <label className="flex items-center gap-2 text-sm font-semibold text-strong">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={value?.isPublic}
          className="size-4 accent-[var(--lake-700)]"
        />
        Instituição pública
      </label>
    </>
  );
}
