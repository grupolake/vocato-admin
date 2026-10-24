import { Field, Select, Textarea } from "@/components/ui/fields";
import type { Question } from "@/lib/types";

const DIMS = ["R", "I", "A", "S", "E", "C"].map((d) => ({ value: d, label: d }));
const BLOCKS = [1, 2, 3, 4, 5].map((b) => ({ value: String(b), label: `Bloco ${b}` }));

export function QuestionFields({ value }: { value?: Question }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[96px_120px_1fr_1fr]">
        <Field label="Dimensão">
          <Select name="dim" defaultValue={value?.dim ?? "R"} options={DIMS} />
        </Field>
        <Field label="Bloco">
          <Select
            name="block"
            defaultValue={String(value?.block ?? 1)}
            options={BLOCKS}
          />
        </Field>
        <Field label="Texto (EN)">
          <Textarea name="textEn" rows={2} required defaultValue={value?.textEn} />
        </Field>
        <Field label="Texto (PT-BR)">
          <Textarea name="textPtBr" rows={2} defaultValue={value?.textPtBr ?? ""} />
        </Field>
      </div>
    </>
  );
}
