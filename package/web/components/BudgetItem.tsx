import { getStartAndEndOfMonthUTC } from "../helper";

export default function BudgetItem({
  title,
  spendAmount,
  totalAmount,
  currency,
}: {
  title: string;
  spendAmount: number;
  totalAmount: number;
  currency: string;
}) {
  const { firstOfMonth, lastOfMonth, currentMonth } =
    getStartAndEndOfMonthUTC();

  const now = Date.now();
  const todayNeedle =
    ((now - firstOfMonth) / (lastOfMonth - firstOfMonth)) * 100;
  const progressNeedle = Math.min((spendAmount / totalAmount) * 100, 100);
  const isOverspent = spendAmount > totalAmount;

  return (
    <div className="border rounded-xl py-3 px-5 shrink-0 snap-start min-w-48 flex flex-col gap-2">
      <div className="font-semibold text-sm">{title}</div>
      <div className="font-bold text-lg">
        {currency}
        {spendAmount.toLocaleString()}{" "}
        <span
          className={`text-xs font-normal ${isOverspent ? "text-red-500" : ""}`}
        >
          {isOverspent
            ? `${(spendAmount - totalAmount).toLocaleString()} overspent of ${totalAmount.toLocaleString()}`
            : `${(totalAmount - spendAmount).toLocaleString()} left of ${totalAmount.toLocaleString()}`}
        </span>
      </div>
      <div className="relative h-2 w-full border rounded-full overflow-hidden">
        <div
          className={`absolute rounded-full left-0 top-0 h-full transition-all ${isOverspent ? "bg-red-400" : "bg-black/75"}`}
          style={{ width: `${progressNeedle}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full ${progressNeedle < todayNeedle ? "bg-black" : "bg-black/50"}`}
          style={{ left: `${Math.min(todayNeedle, 99)}%` }}
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
