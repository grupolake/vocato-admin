import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import type { Career } from "@/lib/types";

const DIMS = ["r", "i", "a", "s", "e", "c"] as const;
const pretty = (v: unknown) => JSON.stringify(v ?? [], null, 2);

export function CareerFields({ value }: { value?: Career }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" hint="kebab-case, único (ex.: engenheiro-de-software)">
          <Input name="slug" required defaultValue={value?.slug} />
        </Field>
        <Field label="Nível">
          <Select
            name="level"
            defaultValue={value?.level ?? "graduacao"}
            options={[
              { value: "tecnico", label: "Técnico" },
              { value: "graduacao", label: "Graduação" },
              { value: "pos", label: "Pós" },
            ]}
          />
        </Field>
        <Field label="Nome (masculino)">
          <Input name="nameM" required defaultValue={value?.nameM} />
        </Field>
        <Field label="Nome (feminino)">
          <Input name="nameF" required defaultValue={value?.nameF} />
        </Field>
        <Field label="Nome em inglês" hint="Usado no prompt da IA de decisão.">
          <Input name="nameEn" defaultValue={value?.nameEn ?? ""} />
        </Field>
        <Field label="Código O*NET (SOC)">
          <Input name="onetSocCode" defaultValue={value?.onetSocCode ?? ""} />
        </Field>
        <Field label="Código CBO">
          <Input name="cboCode" defaultValue={value?.cboCode ?? ""} />
        </Field>
        <Field label="Código Holland" hint="3 letras RIASEC (ex.: IRC)">
          <Input
            name="code"
            required
            maxLength={3}
            pattern="[RIASECriasec]{3}"
            defaultValue={value?.code}
            className="font-mono uppercase"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {DIMS.map((d) => (
          <Field key={d} label={d.toUpperCase()}>
            <Input
              name={d}
              type="number"
              step="0.01"
              min={0}
              max={100}
              required
              defaultValue={value?.[d] ?? 0}
              className="font-mono"
            />
          </Field>
        ))}
      </div>

      <Field label="Descrição">
        <Textarea name="description" rows={4} required defaultValue={value?.description} />
      </Field>
      <Field label="Tarefas do dia a dia (JSON)">
        <Textarea
          name="dailyTasks"
          rows={6}
          required
          className="font-mono text-xs"
          defaultValue={pretty(value?.dailyTasks)}
        />
      </Field>
      <Field label="Caminhos (JSON)">
        <Textarea
          name="paths"
          rows={6}
          required
          className="font-mono text-xs"
          defaultValue={pretty(value?.paths)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Salário júnior">
          <Input name="salaryJunior" required defaultValue={value?.salaryJunior} />
        </Field>
        <Field label="Salário pleno">
          <Input name="salaryPleno" required defaultValue={value?.salaryPleno} />
        </Field>
        <Field label="Salário sênior">
          <Input name="salarySenior" required defaultValue={value?.salarySenior} />
        </Field>
        <Field label="Fonte do salário">
          <Input
            name="salarySource"
            required
            defaultValue={value?.salarySource ?? "manual_estimate"}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-strong">
        <input
          type="checkbox"
          name="published"
          defaultChecked={value?.published}
          className="size-4 accent-[var(--lake-700)]"
        />
        Publicada (visível para os usuários)
      </label>
    </>
  );
}
