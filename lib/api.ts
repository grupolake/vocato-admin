import "server-only";
import type { z } from "zod";
import { getAdmin } from "./auth";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface Options<T extends z.ZodType> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  schema?: T;
  /** Mutações exigem confirmação do role direto no Clerk. */
  fresh?: boolean;
}

function baseUrl() {
  const url = process.env.VOCATO_API_URL;
  const key = process.env.ADMIN_API_KEY;
  if (!url || !key) throw new Error("VOCATO_API_URL / ADMIN_API_KEY not set");
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * Único ponto de saída para o vocato-api. A chave admin nunca chega ao
 * browser e cada chamada reverifica a sessão Clerk.
 */
export async function adminFetch<T extends z.ZodType = z.ZodUnknown>(
  path: string,
  opts: Options<T> = {},
): Promise<z.infer<T>> {
  const method = opts.method ?? "GET";
  await getAdmin({ fresh: opts.fresh ?? method !== "GET" });
  const { url, key } = baseUrl();

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const res = await fetch(`${url}${path}${qs.size ? `?${qs}` : ""}`, {
    method,
    cache: "no-store",
    headers: {
      "x-admin-key": key,
      ...(opts.body !== undefined && { "content-type": "application/json" }),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg =
      (data as { message?: unknown } | null)?.message ?? res.statusText;
    throw new ApiError(
      res.status,
      typeof msg === "string" ? msg : JSON.stringify(msg),
      data,
    );
  }
  return (opts.schema ? opts.schema.parse(data) : data) as z.infer<T>;
}

export const api = {
  get: <T>(path: string, query?: Query) =>
    adminFetch(path, { query }) as Promise<T>,
  send: <T = unknown>(
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
  ) => adminFetch(path, { method, body }) as Promise<T>,
};
