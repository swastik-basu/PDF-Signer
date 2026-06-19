const STATUS_STYLES = {
  DRAFT: "bg-ink-100 text-ink-600",
  PENDING: "bg-amber-100 text-amber-800",
  AWAITING: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  SIGNED: "bg-emerald-100 text-emerald-800",
  DECLINED: "bg-red-100 text-red-800",
  EXPIRED: "bg-ink-100 text-ink-500",
};

export default function StatusBadge({ status }) {
  const key = (status || "DRAFT").toString().toUpperCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES.DRAFT;
  const label = key
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
