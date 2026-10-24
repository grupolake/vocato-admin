"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/fields";
import { Notice } from "@/components/ui/layout";
import {
  addPattern,
  previewPattern,
  removePattern,
  type PatternPreview,
} from "./actions";

export function PatternManager({
  careerId,
  patterns,
}: {
  careerId: string;
  patterns: string[];
}) {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<PatternPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onPreview = () =>
    start(async () => {
      setError(null);
      const res = await previewPattern(value);
      if (res.ok) setPreview(res.data);
      else setError(res.error);
    });

  const onAdd = () =>
    start(async () => {
      setError(null);
      const fd = new FormData();
      fd.set("coursePattern", value);
      const res = await addPattern(careerId, fd);
      if (res.ok) {
        setValue("");
        setPreview(null);
      } else setError(res.error);
    });

  const onRemove = (p: string) =>
    start(async () => {
      if (!confirm(`Remover o padrão "${p}"?`)) return;
      try {
        await removePattern(careerId, p);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao remover.");
      }
    });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-secondary">
        Cada padrão casa por trecho do nome normalizado do curso (sem acento,
        minúsculo). Use <span className="font-mono">engenharia de software</span>{" "}
        para pegar todos os cursos que contenham esse texto.
      </p>
      <ul className="flex flex-wrap gap-2">
        {patterns.length === 0 && (
          <li className="text-muted">Nenhum curso vinculado.</li>
        )}
        {patterns.map((p) => (
          <li
            key={p}
            className="flex items-center gap-2 rounded-full bg-[var(--lake-50)] py-1 pl-4 pr-1 text-sm font-semibold text-[var(--lake-700)]"
          >
            {p}
            <button
              type="button"
              aria-label={`Remover ${p}`}
              disabled={pending}
              onClick={() => onRemove(p)}
              className="size-7 rounded-full text-base hover:bg-[var(--lake-100)]"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="novo padrão de curso"
          className="max-w-sm"
        />
        <Button variant="outline" disabled={pending || value.trim().length < 2} onClick={onPreview}>
          Pré-visualizar
        </Button>
        <Button disabled={pending || value.trim().length < 2} onClick={onAdd}>
          Vincular
        </Button>
      </div>
      {error && <Notice tone="negative">{error}</Notice>}
      {preview && (
        <div className="rounded-[12px] bg-sunken p-4">
          <p className="text-sm font-bold text-strong">
            {preview.total} cursos casam com este padrão
          </p>
          <ul className="mt-2 max-h-56 overflow-auto text-sm text-secondary">
            {preview.sample.map((c) => (
              <li key={c.id}>
                {c.name} · <span className="text-muted">{c.institution.name}</span>
              </li>
            ))}
          </ul>
          {preview.total > preview.sample.length && (
            <p className="mt-2 text-xs text-muted">
              Mostrando {preview.sample.length} de {preview.total}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
