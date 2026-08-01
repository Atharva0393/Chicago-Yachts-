import clsx from "clsx";

const styles: Record<string, string> = {
  pending: "bg-gold-400/15 text-gold-600",
  approved: "bg-sea-500/15 text-sea-500",
  paid: "bg-sea-500/15 text-sea-500",
  confirmed: "bg-sea-500/15 text-sea-500",
  completed: "bg-navy-900/8 text-navy-900/60",
  cancelled: "bg-red-500/10 text-red-500",
  refunded: "bg-red-500/10 text-red-500",
  disputed: "bg-orange-500/15 text-orange-600",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
        styles[status] ?? "bg-navy-900/8 text-navy-900/60"
      )}
    >
      {status}
    </span>
  );
}
