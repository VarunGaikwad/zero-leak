import { Trash2 } from "lucide-react";
import { getStartAndEndOfMonthUTC } from "../helper";

export default function BudgetItem({
  title: titleProp,
  spendAmount,
  totalAmount,
  spent,
  limit,
  category,
  currency = "¥",
  onDelete,
}: {
  title?: string;
  spendAmount?: number;
  totalAmount?: number;
  spent?: number;
  limit?: number;
  category?: { id: string; title: string; color?: string }[];
  currency?: string;
  onDelete?: () => void;
}) {
  const currentSpent = spent ?? spendAmount ?? 0;
  const currentLimit = limit ?? totalAmount ?? 1; // Avoid division by zero
  const title =
    titleProp || category?.map((c) => c.title).join(", ") || "Untitled Budget";

  const { firstOfMonth, lastOfMonth, currentMonth } =
    getStartAndEndOfMonthUTC();

  const now = new Date().getDate();
  const todayNeedle =
    ((now - firstOfMonth) / (lastOfMonth - firstOfMonth)) * 100;
  const progressNeedle = Math.min((currentSpent / currentLimit) * 100, 100);
  const isOverspent = currentSpent > currentLimit;

  return (
    <div className="border rounded-xl py-3 px-5 shrink-0 snap-start min-w-48 flex flex-col gap-2 bg-white shadow-sm overflow-hidden relative group">
      <div className="flex justify-between items-start gap-2">
        <p className="font-semibold text-sm text-gray-700 truncate flex-1">{title}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          title="Delete budget"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-bold text-xl flex items-baseline gap-1">
          <span className="text-sm font-medium text-gray-400">{currency}</span>
          {currentSpent.toLocaleString()}
        </p>
        <p
          className={`text-xs font-medium ${isOverspent ? "text-red-500" : "text-gray-400"}`}
        >
          {isOverspent
            ? `${(currentSpent - currentLimit).toLocaleString()} overspent of ${currentLimit.toLocaleString()}`
            : `${(currentLimit - currentSpent).toLocaleString()} left of ${currentLimit.toLocaleString()}`}
        </p>
      </div>
      <div className="relative h-2 w-full border rounded-full overflow-hidden">
        <div
          className={`absolute rounded-full left-0 top-0 h-full transition-all ${isOverspent ? "bg-red-400" : "bg-black/75"}`}
          style={{ width: `${progressNeedle}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full z-10 ${progressNeedle < todayNeedle ? "bg-black" : "bg-black/50"}`}
          style={{ left: `${Math.min(todayNeedle, 99)}%` }}
          title="Today"
        />
      </div>
      <div className="flex justify-between text-xs">
        <span>
          {currentMonth} {firstOfMonth}
        </span>
        <span>
          {currentMonth} {lastOfMonth}
        </span>
      </div>
    </div>
  );
}
