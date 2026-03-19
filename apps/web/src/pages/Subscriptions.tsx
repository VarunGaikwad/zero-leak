import { MOCK_SUBSCRIPTIONS } from "@zeroleak/package/web/constant";
import { ChevronDown, Repeat2 } from "lucide-react";
import { useState } from "react";

type TabType = "monthly" | "yearly" | "total";

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

  const totalDisplay = MOCK_SUBSCRIPTIONS.reduce((sum, sub) => {
    return sum + getAmountForTab(sub.amount, sub.repeatUnit, activeTab);
  }, 0);

  const tabLabel =
    activeTab === "monthly"
      ? "Monthly"
      : activeTab === "yearly"
        ? "Yearly"
        : "Total";

  return (
    <div className="w-full space-y-5 mx-auto flex flex-col h-full">
      <h1 className="font-semibold text-2xl">Subscriptions</h1>
      <div className="flex-1 h-full mx-auto min-w-3xl">
        <div className="flex flex-col items-center gap-2.5">
          <div className="font-semibold flex items-center text-xl">
            ${totalDisplay.toLocaleString()}
          </div>
          <p className="text-sm">{tabLabel} Subscriptions</p>
          <div className="flex gap-5 text-xs text-white">
            {(["monthly", "yearly", "total"] as TabType[]).map((tab) => (
              <button
                key={tab}
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

        <div className="space-y-10 mx-10 mt-6">
          {MOCK_SUBSCRIPTIONS.sort(
            (a, b) => a.upcomingPayDate.getTime() - b.upcomingPayDate.getTime(),
          ).map((sub) => {
            const IconComponent = sub.icon;
            const displayAmount = getAmountForTab(
              sub.amount,
              sub.repeatUnit,
              activeTab,
            );

            return (
              <div key={sub.id}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    {formatRelativeDate(sub.upcomingPayDate)}
                  </h2>
                  <div className="flex flex-col items-end text-sm">
                    <div className="flex gap-2 items-center">
                      <Repeat2 className="size-5" />
                      {sub.repeatNumber}{" "}
                      {repeatUnitLabel[sub.repeatUnit] ?? sub.repeatUnit}
                    </div>
                    <p>
                      ${activeTab === "total" ? sub.amount : displayAmount} /{" "}
                      {sub.repeatUnit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="p-2.5 bg-black rounded-full">
                    <IconComponent className="size-8 text-white" />
                  </div>
                  <div className="flex-1 font-medium">{sub.name}</div>
                  <div className="flex items-center gap-3">
                    {sub.upcomingPayDate >= new Date() && (
                      <span className="text-sm">Pay?</span>
                    )}
                    <button className="flex items-center gap-1 font-semibold hover:bg-black/10 px-2 py-1 rounded-lg transition-colors">
                      <ChevronDown className="size-4" />$
                      {activeTab === "total" ? sub.amount : displayAmount}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const repeatUnitLabel: Record<string, string> = {
  day: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
};
