import { TransactionItem } from "@zeroleak/package/web/components";
import { HOME_PAGE_MOCK_DATA } from "@zeroleak/package/web/constant";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

function getDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function groupByDate(transactions: typeof HOME_PAGE_MOCK_DATA.TRANSACTION) {
  const groups: Record<string, typeof HOME_PAGE_MOCK_DATA.TRANSACTION> = {};

  for (const tx of transactions) {
    const label = getDateLabel(new Date(tx.datetime));
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  }

  return groups;
}

function getMonthRange(transactions: typeof HOME_PAGE_MOCK_DATA.TRANSACTION) {
  const now = new Date();
  const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 9, 1);

  const oldestTx = transactions.reduce((min, tx) => {
    const d = new Date(tx.datetime);
    return d < min ? d : min;
  }, now);

  const start = oldestTx < nineMonthsAgo ? oldestTx : nineMonthsAgo;

  const latest = transactions.reduce((max, tx) => {
    const d = new Date(tx.datetime);
    return d > max ? d : max;
  }, now);

  const end = new Date(latest.getFullYear(), 11, 31);

  const months: { month: number; year: number }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

  while (cursor <= end) {
    months.push({ month: cursor.getMonth(), year: cursor.getFullYear() });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Transaction() {
  const months = getMonthRange(HOME_PAGE_MOCK_DATA.TRANSACTION);
  const now = new Date();

  const [selected, setSelected] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const leftSpacerRef = useRef<HTMLDivElement>(null);
  const rightSpacerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const half = scrollRef.current.offsetWidth / 2;
    if (leftSpacerRef.current) leftSpacerRef.current.style.width = `${half}px`;
    if (rightSpacerRef.current)
      rightSpacerRef.current.style.width = `${half}px`;
  }, []);

  useEffect(() => {
    if (!scrollRef.current || !selectedRef.current) return;
    const container = scrollRef.current;
    const item = selectedRef.current;

    const containerCenter = container.offsetWidth / 2;
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;

    const isInitial =
      selected.month === now.getMonth() && selected.year === now.getFullYear();

    container.scrollTo({
      left: itemCenter - containerCenter,
      behavior: isInitial ? "instant" : "smooth",
    });
  }, [selected]);

  const filteredTransactions = HOME_PAGE_MOCK_DATA.TRANSACTION.filter((tx) => {
    const d = new Date(tx.datetime);
    return d.getMonth() === selected.month && d.getFullYear() === selected.year;
  });

  const totalExpense = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netWorth = totalIncome - totalExpense;

  const grouped = groupByDate(filteredTransactions);

  return (
    <div className="w-full relative min-h-screen pb-20">
      {/* Sticky header area */}
      <div className="sticky -top-4 -mx-4 -mt-4 px-4 pt-4 bg-white z-10 pb-4 border-b">
        <div className="font-semibold text-2xl mb-4">Transactions</div>
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] snap-x snap-mandatory"
        >
          <div ref={leftSpacerRef} className="shrink-0" />

          {months.map(({ month, year }) => {
            const isSelected = selected.month === month && selected.year === year;
            const isCurrentMonth =
              now.getMonth() === month && now.getFullYear() === year;

            return (
              <button
                key={`${year}-${month}`}
                ref={isSelected ? selectedRef : null}
                onClick={() => setSelected({ month, year })}
                className={`snap-center shrink-0 w-16 flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSelected ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <span className="text-sm font-medium">{MONTH_NAMES[month]}</span>
                <span
                  className={`text-xs ${isSelected ? "text-white/70" : "text-gray-400"}`}
                >
                  {isCurrentMonth ? "●" : now.getFullYear() !== year ? year : ""}
                </span>
              </button>
            );
          })}

          <div ref={rightSpacerRef} className="shrink-0" />
        </div>
      </div>

      {/* Stats container */}
      <div className="border rounded-2xl p-4 flex items-center mt-6 shadow-sm">
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-xs text-gray-400">Expense</span>
          <span className="text-sm font-semibold text-red-400">
            ¥{totalExpense.toLocaleString()}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-xs text-gray-400">Income</span>
          <span className="text-sm font-semibold text-green-400">
            ¥{totalIncome.toLocaleString()}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-xs text-gray-400">Net</span>
          <span
            className={`text-sm font-semibold ${netWorth >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            ¥{netWorth.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex flex-col gap-6 mt-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-12 flex flex-col items-center gap-2">
            <span className="text-4xl text-gray-200">∅</span>
            No transactions for this month
          </div>
        ) : (
          Object.entries(grouped).map(([label, transactions]) => (
            <div key={label} className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">
                {label}
              </span>
              <div className="flex flex-col gap-3">
                {transactions.map((tx) => (
                  <TransactionItem key={tx.title} {...tx} />
                ))}
              </div>
              <div className="h-px w-full bg-gray-100 mt-2" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
