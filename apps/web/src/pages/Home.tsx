import { ListPlus } from "lucide-react";
import { useState } from "react";
import {
  BankAccount,
  BudgetItem,
  TransactionItem,
  StatGrid,
} from "@zeroleak/package/web/components";
import { HOME_PAGE_MOCK_DATA } from "@zeroleak/package/web/constant";

type Filter = "all" | "expense" | "income";

function getDateLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
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

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTransactions = HOME_PAGE_MOCK_DATA.TRANSACTION.filter((tx) => {
    if (filter === "expense") return tx.amount < 0;
    if (filter === "income") return tx.amount > 0;
    return true;
  });

  const grouped = groupByDate(filteredTransactions);

  const totalExpense = HOME_PAGE_MOCK_DATA.TRANSACTION.filter(
    (tx) => tx.amount < 0,
  ).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalIncome = HOME_PAGE_MOCK_DATA.TRANSACTION.filter(
    (tx) => tx.amount > 0,
  ).reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="w-full space-y-5">
      <div className="font-semibold text-2xl">Home</div>

      {/* Accounts — horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {HOME_PAGE_MOCK_DATA.ACCOUNT.map((options) => (
          <BankAccount key={options.title} {...options} />
        ))}
        <button className="border border-dashed rounded-xl py-3 px-5 min-w-32 shrink-0 snap-start flex flex-col items-center justify-center gap-1 cursor-pointer">
          <ListPlus size={20} />
          <div className="text-xs">Add Account</div>
        </button>
      </div>

      {/* Budgets — horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {HOME_PAGE_MOCK_DATA.BUDGET.map((options) => (
          <BudgetItem key={options.title} {...options} />
        ))}
        <button className="border border-dashed rounded-xl py-3 px-5 min-w-48 shrink-0 snap-start flex flex-col items-center justify-center gap-1 cursor-pointer">
          <ListPlus size={20} />
          <div className="text-xs">Add Budget</div>
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 md:items-start">
        {/* Stats — fixed, doesn't stretch with transactions */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
          <StatGrid
            title="Expense"
            color="text-red-400"
            amount={totalExpense}
            totalTransaction={
              HOME_PAGE_MOCK_DATA.TRANSACTION.filter((tx) => tx.amount < 0)
                .length
            }
          />
          <StatGrid
            title="Income"
            color="text-green-400"
            amount={totalIncome}
            totalTransaction={
              HOME_PAGE_MOCK_DATA.TRANSACTION.filter((tx) => tx.amount > 0)
                .length
            }
          />
          <StatGrid
            title="Net Worth"
            amount={totalIncome - totalExpense}
            totalTransaction={HOME_PAGE_MOCK_DATA.TRANSACTION.length}
            className="col-span-2"
          />
        </div>

        {/* Filter + Grouped Transactions */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="inline-flex border rounded-xl p-1 gap-1 w-full">
            {(["all", "expense", "income"] as Filter[]).map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`w-1/3 px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize cursor-pointer ${
                  filter === option
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="w-full flex flex-col gap-4">
            {Object.entries(grouped).map(([label, transactions]) => (
              <div key={label} className="flex flex-col gap-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {label}
                </span>
                {transactions.map((options) => (
                  <TransactionItem {...options} key={options.title} />
                ))}
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <div className="text-sm text-gray-400 text-center py-6">
                No transactions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
