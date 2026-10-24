import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export class AdminAuthError extends Error {
  constructor(public readonly reason: "unauthenticated" | "forbidden") {
    super(reason);
  }
}

const isAdminRole = (role: unknown) => role === "admin";

/**
 * Data Access Layer: toda page, server action e chamada à API passa por aqui.
 * `auth()` valida a assinatura do token de sessão do Clerk a cada request; o
 * proxy.ts é só uma checagem otimista e nunca substitui esta.
 *
 * `fresh: true` (usado em mutações) consulta o usuário no Clerk em vez de
 * confiar no claim do token, para que a revogação do role valha na hora.
 */
export async function getAdmin({ fresh = false } = {}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new AdminAuthError("unauthenticated");

  let role = (sessionClaims?.metadata as { role?: unknown } | undefined)?.role;
  if (fresh || role === undefined) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    role = user.publicMetadata?.role;
  }
  if (!isAdminRole(role)) throw new AdminAuthError("forbidden");
  return { userId };
}

/** Para pages/layouts: redireciona em vez de lançar. */
export async function requireAdmin(opts?: { fresh?: boolean }) {
  try {
    return await getAdmin(opts);
  } catch (e) {
    if (e instanceof AdminAuthError) {
      redirect(e.reason === "forbidden" ? "/forbidden" : "/sign-in");
    }
    throw e;
  }
}
