"use client";

import { useActionState } from "react";
import { Button } from "./button";
import { Notice } from "./layout";

type Result = { ok: true } | { ok: false; error: string };

/** Formulário que chama uma server action e mostra o erro da API, se houver. */
export function ActionForm({
  action,
  submitLabel = "Salvar",
  children,
  className = "flex flex-col gap-4",
}: {
  action: (formData: FormData) => Promise<Result>;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState<Result | null, FormData>(
    (_prev, fd) => action(fd),
    null,
  );
  return (
    <form action={formAction} className={className}>
      {children}
      {state && !state.ok && <Notice tone="negative">{state.error}</Notice>}
      {state?.ok && <Notice tone="positive">Salvo.</Notice>}
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/** Botão destrutivo com confirmação nativa. */
export function ConfirmForm({
  action,
  label = "Excluir",
  message = "Tem certeza? Esta ação não pode ser desfeita.",
}: {
  action: () => Promise<void>;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        {label}
      </Button>
    </form>
  );
}
