import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import type { Offer } from "@/lib/types";

const DIMS = ["R", "I", "A", "S", "E", "C"] as const;

export function OfferFields({ value }: { value?: Offer }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Parceiro">
          <Input name="provider" required defaultValue={value?.provider} />
        </Field>
        <Field label="Título">
          <Input name="title" required defaultValue={value?.title} />
        </Field>
      </div>
      <Field
        label="Link de afiliado"
        hint="Usado no redirecionamento /go/:id. Somente http(s)."
      >
        <Input
          name="trackingUrl"
          type="url"
          required
          defaultValue={value?.trackingUrl}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo">
          <Select
            name="kind"
            defaultValue={value?.kind ?? "livre"}
            options={[
              { value: "livre", label: "Curso livre" },
              { value: "tecnico", label: "Técnico" },
              { value: "graduacao_ead", label: "Graduação EAD" },
            ]}
          />
        </Field>
        <Field label="Idade mínima">
          <Input
            name="minAge"
            type="number"
            min={0}
            max={120}
            required
            defaultValue={value?.minAge ?? 12}
          />
        </Field>
      </div>
      <fieldset>
        <legend className="mb-1.5 text-xs font-bold text-strong">
          Dimensões RIASEC alvo
        </legend>
        <div className="flex flex-wrap gap-4">
          {DIMS.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="dims"
                value={d}
                defaultChecked={value?.dims.includes(d)}
                className="size-4 accent-[var(--lake-700)]"
              />
              {d}
            </label>
          ))}
        </div>
      </fieldset>
      <Field
        label="Slugs de ocupações"
        hint="Separados por vírgula ou linha. Vazio = vale para qualquer ocupação."
      >
        <Textarea
          name="careerSlugs"
          rows={3}
          className="font-mono text-xs"
          defaultValue={value?.careerSlugs.join("\n") ?? ""}
        />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold text-strong">
        <input
          type="checkbox"
          name="active"
          defaultChecked={value?.active ?? true}
          className="size-4 accent-[var(--lake-700)]"
        />
        Ativa (aparece nas recomendações)
      </label>
    </>
  );
}
