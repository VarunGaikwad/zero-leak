import { ChevronDown, Repeat2, HelpCircle, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../lib";

type TabType = "monthly" | "yearly" | "total";

const repeatUnitLabel: Record<string, string> = {
  day: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
};

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
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getAmountForTab(
  amount: number,
  repeatUnit: string,
  tab: TabType,
): number {
  if (tab === "monthly") return repeatUnit === "year" ? amount / 12 : amount;
  if (tab === "yearly") return repeatUnit === "month" ? amount * 12 : amount;
  return amount; // total — as-is
}

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState<TabType>("monthly");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/subscriptions")
      .then((res) => setSubscriptions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort(
      (a, b) =>
        new Date(a.upcomingPayDate).getTime() -
        new Date(b.upcomingPayDate).getTime(),
    );
  }, [subscriptions]);

  const totalDisplay = useMemo(() => {
    return subscriptions.reduce((sum, sub) => {
      return sum + getAmountForTab(sub.amount, sub.repeatUnit, activeTab);
    }, 0);
  }, [subscriptions, activeTab]);

  const tabLabel =
    activeTab === "monthly"
      ? "Monthly"
      : activeTab === "yearly"
        ? "Yearly"
        : "Total";

  const getIcon = (name: string) => {
    return (Icons as any)[name] || HelpCircle;
  };

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <p className="text-zinc-500 animate-pulse font-medium">
          Loading subscriptions...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 mx-auto flex flex-col h-full">
      <h1 className="font-semibold text-2xl">Subscriptions</h1>
      <section className="flex-1 h-full mx-auto min-w-3xl">
        <div className="flex flex-col items-center gap-2.5">
          <strong className="font-semibold flex items-center text-xl">
            ${totalDisplay.toLocaleString()}
          </strong>
          <p className="text-sm">{tabLabel} Subscriptions</p>
          <div
            className="flex gap-5 text-xs text-white"
            role="tablist"
            aria-label="Subscription period"
          >
            {(["monthly", "yearly", "total"] as TabType[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-label={`View ${tab} subscriptions`}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer p-1.5 w-20 text-center rounded-3xl transition-colors capitalize ${
                  activeTab === tab
                    ? "bg-black"
                    : "bg-black/50 hover:bg-black/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <ul className="space-y-10 mx-10 mt-6">
          {sortedSubscriptions.map((sub) => {
            const IconComponent = getIcon(sub.icon);
            const subDate = new Date(sub.upcomingPayDate);
            const displayAmount = getAmountForTab(
              sub.amount,
              sub.repeatUnit,
              activeTab,
            );

            return (
              <li key={sub.id}>
                <article>
                  <header className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">
                      {formatRelativeDate(subDate)}
                    </h2>
                    <div className="flex flex-col items-end text-sm">
                      <span className="flex gap-2 items-center">
                        <Repeat2 className="size-5" />
                        {sub.repeatNumber}{" "}
                        {repeatUnitLabel[sub.repeatUnit] ?? sub.repeatUnit}
                      </span>
                      <p>
                        ${activeTab === "total" ? sub.amount : displayAmount} /{" "}
                        {sub.repeatUnit}
                      </p>
                    </div>
                  </header>

                  <div className="flex items-center gap-5">
                    <div className="p-2.5 bg-black rounded-full">
                      <IconComponent className="size-8 text-white" />
                    </div>
                    <p className="flex-1 font-medium">{sub.name}</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={async () => {
                          if (window.confirm(`Delete subscription "${sub.name}"?`)) {
                            await axiosInstance.delete(`/api/v1/subscriptions/${sub.id}`);
                            setSubscriptions((prev) =>
                              prev.filter((s) => s.id !== sub.id),
                            );
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Delete subscription"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span className="flex items-center gap-3">
                        {subDate >= new Date() && (
                          <span className="text-sm">Pay?</span>
                        )}
                        <button className="flex items-center gap-1 font-semibold hover:bg-black/10 px-2 py-1 rounded-lg transition-colors">
                          <ChevronDown className="size-4" />$
                          {activeTab === "total" ? sub.amount : displayAmount}
                        </button>
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

