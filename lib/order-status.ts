export const ORDER_STATUSES = ["new", "confirmed", "production", "delivered", "canceled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: "جدید",
  confirmed: "تأیید شد",
  production: "در حال ساخت",
  delivered: "تحویل شد",
  canceled: "لغو شد",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  production: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  canceled: "bg-stone-200 text-stone-600",
};