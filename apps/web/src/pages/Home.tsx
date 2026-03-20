import { ListPlus, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  BankAccount,
  BudgetItem,
  TransactionItem,
  StatGrid,
} from "@zeroleak/package/web/components";
import { axiosInstance } from "../lib";

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

function groupByDate(transactions: any[]) {
  const groups: Record<string, any[]> = {};

  for (const tx of transactions) {
    const label = getDateLabel(new Date(tx.datetime));
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  }

  return groups;
}

function formatRelativeDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Home() {
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    accounts: any[];
    budgets: any[];
    subscriptions: any[];
    categories: any[];
    transactions: any[];
  }>({
    accounts: [],
    budgets: [],
    subscriptions: [],
    categories: [],
    transactions: [],
  });

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/api/v1/accounts"),
      axiosInstance.get("/api/v1/budgets"),
      axiosInstance.get("/api/v1/subscriptions"),
      axiosInstance.get("/api/v1/categories"),
      axiosInstance.get("/api/v1/transactions"),
    ])
      .then(([acc, bud, sub, cat, tx]) => {
        setData({
          accounts: acc.data,
          budgets: bud.data,
          subscriptions: sub.data,
          categories: cat.data,
          transactions: tx.data,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const upcomingSubscriptions = useMemo(() => {
    return [...data.subscriptions]
      .sort(
        (a, b) =>
          new Date(a.upcomingPayDate).getTime() -
          new Date(b.upcomingPayDate).getTime(),
      )
      .slice(0, 3);
  }, [data.subscriptions]);

  const monthlyTotal = useMemo(() => {
    return data.subscriptions.reduce((sum, sub) => {
      if (sub.repeatUnit === "month") return sum + sub.amount;
      if (sub.repeatUnit === "year") return sum + sub.amount / 12;
      if (sub.repeatUnit === "week") return sum + sub.amount * 4.33;
      if (sub.repeatUnit === "day") return sum + sub.amount * 30;
      return sum;
    }, 0);
  }, [data.subscriptions]);

  const stats = useMemo(() => {
    const totalExpense = data.transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const totalIncome = data.transactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalExpense,
      totalIncome,
      netWorth: totalIncome - totalExpense,
      expenseCount: data.transactions.filter((tx) => tx.amount < 0).length,
      incomeCount: data.transactions.filter((tx) => tx.amount > 0).length,
    };
  }, [data.transactions]);

  const filteredTransactions = useMemo(() => {
    return data.transactions.filter((tx) => {
      if (filter === "expense") return tx.amount < 0;
      if (filter === "income") return tx.amount > 0;
      return true;
    });
  }, [data.transactions, filter]);

  const grouped = useMemo(
    () => groupByDate(filteredTransactions),
    [filteredTransactions],
  );

  const getIcon = (name: string) => {
    return (Icons as any)[name] || HelpCircle;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-20">
        <p className="text-zinc-500 animate-pulse font-medium">
          Loading your data...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Home</h1>

      {/* Accounts — horizontal scroll */}
      <section>
        <h2 className="font-semibold text-sm mb-2">Accounts</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-2">
          {data.accounts.map((options) => (
            <BankAccount key={options.id ?? options.title} {...options} />
          ))}
          <button className="border border-dashed rounded-xl py-3 px-5 min-w-32 shrink-0 snap-start flex flex-col items-center justify-center gap-1 cursor-pointer">
            <ListPlus size={20} />
            <span className="text-xs">Add Account</span>
          </button>
        </div>
      </section>

      {/* Budgets — horizontal scroll */}
      <section>
        <h2 className="font-semibold text-sm mb-2">Budgets</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory px-2">
          {data.budgets.map((options) => (
            <BudgetItem key={options.id ?? options.title} {...options} />
          ))}
          <button className="border border-dashed rounded-xl py-3 px-5 min-w-48 shrink-0 snap-start flex flex-col items-center justify-center gap-1 cursor-pointer">
            <ListPlus size={20} />
            <span className="text-xs">Add Budget</span>
          </button>
        </div>
      </section>

      {/* Subscriptions — upcoming preview */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">Upcoming Subscriptions</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            ~${monthlyTotal.toFixed(0)} / mo
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {upcomingSubscriptions.map((sub) => {
            const IconComponent = getIcon(sub.icon);
            const subDate = new Date(sub.upcomingPayDate);
            const isPast = subDate < new Date();
            return (
              <div
                key={sub.id}
                className="flex items-center gap-3 border rounded-xl px-4 py-3"
              >
                <div className="p-2 bg-black rounded-full shrink-0">
                  <IconComponent className="size-4 text-white" />
                </div>
                <p className="flex-1 font-medium text-sm">{sub.name}</p>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isPast
                      ? "bg-gray-100 text-gray-400"
                      : "bg-black/5 text-black"
                  }`}
                >
                  {formatRelativeDate(subDate)}
                </span>
                <p className="text-sm font-semibold w-14 text-right">
                  ${sub.amount}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories — horizontal scroll of icon chips */}
      <section>
        <h2 className="font-semibold text-sm mb-2">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {data.categories.map(({ title, icon, id }) => {
            const IconComponent = getIcon(icon);
            return (
              <button
                key={id ?? title}
                className="flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer group"
              >
                <div className="size-12 rounded-full bg-black flex items-center justify-center group-hover:bg-black/80 transition-colors">
                  <IconComponent className="size-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 w-14 text-center truncate">
                  {title}
                </span>
              </button>
            );
          })}
          <button className="flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer group">
            <div className="size-12 rounded-full border border-dashed border-black/30 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
              <ListPlus className="size-5 text-black/40" />
            </div>
            <span className="text-xs text-gray-400 w-14 text-center">Add</span>
          </button>
        </div>
      </section>

      {/* Overview — Stats + Transactions */}
      <section>
        <h2 className="font-semibold text-sm mb-3">Overview</h2>
        <div className="flex flex-col md:flex-row w-full gap-4 md:items-start">
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
            <StatGrid
              title="Expense"
              color="text-red-400"
              amount={stats.totalExpense}
              totalTransaction={stats.expenseCount}
            />
            <StatGrid
              title="Income"
              color="text-green-400"
              amount={stats.totalIncome}
              totalTransaction={stats.incomeCount}
            />
            <StatGrid
              title="Net Worth"
              amount={stats.netWorth}
              totalTransaction={data.transactions.length}
              className="col-span-2"
            />
          </div>

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
                <section key={label} className="flex flex-col gap-2">
                  <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {label}
                  </h2>
                  {transactions.map((options) => (
                    <TransactionItem {...options} key={options.id ?? options.title} />
                  ))}
                </section>
              ))}

              {Object.keys(grouped).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No transactions
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

