import { formatPrice, toFa } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "@/lib/order-status";
import { listOrders } from "@/lib/store";
import { updateOrderStatus } from "./actions";

export const instant = false;

const fmt = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" });

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-900">سفارش‌ها</h1>
      <p className="mt-1 text-sm text-stone-500">{toFa(orders.length)} سفارش</p>

      {orders.length === 0 ? (
        <p className="mt-16 text-center text-stone-500">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <details key={o.id} className="group rounded-2xl border border-stone-200 bg-white" open={o.status === "new"}>
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-bold text-stone-900">
                    {o.code} <span className="mr-2 font-normal text-stone-600">{o.name}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">{fmt.format(new Date(o.createdAt))}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-stone-900">{formatPrice(o.total)}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLOR[o.status]}`}>
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </div>
              </summary>

              <div className="grid gap-6 border-t border-stone-100 p-5 lg:grid-cols-2">
                <div className="space-y-2 text-sm">
                  <p><span className="text-stone-500">موبایل: </span><a href={`tel:${o.phone}`} dir="ltr" className="font-medium text-amber-700">{o.phone}</a></p>
                  <p><span className="text-stone-500">شهر: </span>{o.city}</p>
                  <p><span className="text-stone-500">آدرس: </span>{o.address}</p>
                  {o.postalCode && <p><span className="text-stone-500">کد پستی: </span><span dir="ltr">{o.postalCode}</span></p>}
                  {o.note && <p><span className="text-stone-500">توضیحات: </span>{o.note}</p>}
                </div>

                <div>
                  <table className="w-full text-sm">
                    <thead className="text-stone-500">
                      <tr>
                        <th className="pb-2 text-right font-medium">محصول</th>
                        <th className="pb-2 text-center font-medium">تعداد</th>
                        <th className="pb-2 text-left font-medium">قیمت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {o.items.map((i) => (
                        <tr key={i.id} className="border-t border-stone-100">
                          <td className="py-2">{i.title}</td>
                          <td className="py-2 text-center">{toFa(i.qty)}</td>
                          <td className="py-2 text-left">{formatPrice(i.price * i.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <form action={updateOrderStatus} className="mt-5 flex items-center gap-2">
                    <input type="hidden" name="id" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="h-10 flex-1 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-amber-600"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                    <button type="submit" className="h-10 rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-amber-700">
                      ثبت وضعیت
                    </button>
                  </form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}