import type { OrderStatus } from "./types";

export const STATUS_TONE: Record<
  OrderStatus,
  "positive" | "warning" | "negative" | "neutral"
> = {
  paid: "positive",
  pending: "warning",
  failed: "negative",
  expired: "neutral",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  expired: "Expirado",
};
