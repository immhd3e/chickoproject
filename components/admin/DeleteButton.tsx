"use client";

export default function DeleteButton({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: number;
  label: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`«${label}» حذف شود؟ این کار برگشت‌پذیر نیست.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50">
        حذف
      </button>
    </form>
  );
}