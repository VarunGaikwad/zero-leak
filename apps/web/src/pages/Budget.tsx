import { BudgetItem } from "@zeroleak/package/web/components";
import { axiosInstance } from "../lib";
import { ListPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Budget() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/budgets")
      .then((res) => {
        setBudgets(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full py-10 text-center">
        <p className="text-zinc-500 animate-pulse">Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Budget</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map(function (curr) {
          return (
            <BudgetItem
              key={curr.id ?? curr.title}
              {...curr}
              onDelete={async () => {
                if (window.confirm(`Delete budget "${curr.title || "this budget"}"?`)) {
                  await axiosInstance.delete(`/api/v1/budgets/${curr.id}`);
                  setBudgets((prev) => prev.filter((b) => b.id !== curr.id));
                }
              }}
            />
          );
        })}
        <button className="border border-dashed rounded-xl py-6 px-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <ListPlus size={24} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Add Budget</span>
        </button>
      </div>
    </div>
  );
}
