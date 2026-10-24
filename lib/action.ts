import "server-only";
import { AdminAuthError } from "./auth";
import { ApiError } from "./api";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Converte erros esperados de uma server action em resultado serializável. */
export async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof AdminAuthError) return { ok: false, error: "Sem permissão." };
    if (e instanceof ApiError) return { ok: false, error: e.message };
    if (e instanceof Error && e.name === "ZodError") {
      return { ok: false, error: "Dados inválidos." };
    }
    throw e;
  }
}
