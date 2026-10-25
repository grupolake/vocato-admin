"use client";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/layout";

/**
 * Fronteira de erro das páginas do painel: o layout (menu, header) continua
 * de pé e só a área de conteúdo mostra a falha.
 */
export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Notice tone="negative">
        Não foi possível carregar esta página. Verifique se o vocato-api está
        no ar e tente novamente.
        {error.digest && (
          <span className="lf-figure mt-1 block text-xs font-normal">
            Referência: {error.digest}
          </span>
        )}
      </Notice>
      <Button type="button" variant="outline" onClick={() => retry()}>
        Tentar novamente
      </Button>
    </div>
  );
}
