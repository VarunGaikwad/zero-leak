import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import SlidePanel from "../components/SlidePanel";
import {
  type OutletContext,
  type CategoryBudget,
  type MonthlyBudget,
  type BudgetPeriod,
  formatAmount,
} from "@zeroleak/types";

import {
  inputClass,
  labelClass,
  selectClass,
  buttonPrimary,
} from "@zeroleak/ui";

const DEFAULT_MONTHLY: MonthlyBudget = { limit: 50000, period: "monthly" };


const DEFAULT_CAT_BUDGETS: CategoryBudget[] = [
  { id: 1, category: "Food", limit: 8000, period: "monthly" },
  { id: 2, category: "Transport", limit: 3000, period: "monthly" },
  { id: 3, category: "Shopping", limit: 5000, period: "monthly" },
  { id: 4, category: "Utilities", limit: 4000, period: "monthly" },
];

function ProgressBar({
  used,
  limit,
  color,
}: {
  used: number;
  limit: number;
  color: string;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isOver = used > limit;
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: isOver ? "#ef4444" : color,
        }}
      />
    </div>
  );
}

export default function Budget() {
  const { transactions, categories } = useOutletContext<OutletContext>();

  const [monthlyBudget, setMonthlyBudget] =
    useState<MonthlyBudget>(DEFAULT_MONTHLY);
  const [catBudgets, setCatBudgets] =
    useState<CategoryBudget[]>(DEFAULT_CAT_BUDGETS);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"monthly" | "category">("monthly");
  const [editingCat, setEditingCat] = useState<CategoryBudget | null>(null);
  const [catForm, setCatForm] = useState<Omit<CategoryBudget, "id">>({
    category: categories[0]?.name || "Food",
    limit: 0,
    period: "monthly",
  });
  const [monthlyForm, setMonthlyForm] =
    useState<MonthlyBudget>(DEFAULT_MONTHLY);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // current month ka spend
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthlySpend = useMemo(() => {
    return transactions
      .filter((t) => t.type === "out" && t.datetime.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentMonth]);

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "out" && t.datetime.startsWith(currentMonth))
      .forEach((t) => {
        map[t.category] = (map[t.category] ?? 0) + t.amount;
      });
    return map;
  }, [transactions, currentMonth]);

  function openMonthlyPanel() {
    setMonthlyForm({ ...monthlyBudget });
    setPanelMode("monthly");
    setErrors({});
    setPanelOpen(true);
  }

  function openAddCatPanel() {
    setEditingCat(null);
    setCatForm({
      category: categories[0]?.name || "Food",
      limit: 0,
      period: "monthly",
    });
    setPanelMode("category");
    setErrors({});
    setPanelOpen(true);
  }

  function openEditCatPanel(cat: CategoryBudget) {
    setEditingCat(cat);
    setCatForm({
      category: cat.category,
      limit: cat.limit,
      period: cat.period,
    });
    setPanelMode("category");
    setErrors({});
    setPanelOpen(true);
  }

  function handleClose() {
    setPanelOpen(false);
    setEditingCat(null);
    setErrors({});
  }

  function handleSubmit() {
    const e: Record<string, string> = {};
    if (panelMode === "monthly") {
      if (!monthlyForm.limit || monthlyForm.limit <= 0)
        e.limit = "Enter valid amount";
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      setMonthlyBudget(monthlyForm);
    } else {
      if (!catForm.limit || catForm.limit <= 0) e.limit = "Enter valid amount";
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
      if (editingCat) {
        setCatBudgets((prev) =>
          prev.map((c) =>
            c.id === editingCat.id ? { ...catForm, id: c.id } : c,
          ),
        );
      } else {
        setCatBudgets((prev) => [...prev, { ...catForm, id: Date.now() }]);
      }
    }
    handleClose();
  }

  function handleDelete(id: number) {
    setCatBudgets((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  }

  const monthlyPct =
    monthlyBudget.limit > 0
      ? Math.min((monthlySpend / monthlyBudget.limit) * 100, 100)
      : 0;
  const monthlyOver = monthlySpend > monthlyBudget.limit;

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Budget Card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">
              Monthly Budget
            </p>
            <p className="text-white/50 text-xs mt-0.5">
              {now.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={openMonthlyPanel}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50
              hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <Pencil size={14} />
          </button>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <span
              className={`text-2xl font-bold ${monthlyOver ? "text-red-400" : "text-white"}`}
            >
              {formatAmount(monthlySpend)}
            </span>
            <span className="text-white/40 text-sm ml-2">
              of {formatAmount(monthlyBudget.limit)}
            </span>
          </div>
          <span
            className={`text-sm font-medium ${monthlyOver ? "text-red-400" : "text-emerald-400"}`}
          >
            {monthlyOver
              ? `${formatAmount(monthlySpend - monthlyBudget.limit)} over`
              : `${formatAmount(monthlyBudget.limit - monthlySpend)} left`}
          </span>
        </div>

        <ProgressBar
          used={monthlySpend}
          limit={monthlyBudget.limit}
          color="#8b5cf6"
        />
        <p className="text-white/30 text-xs mt-2">
          {monthlyPct.toFixed(0)}% used
        </p>
      </div>

      {/* Category Budgets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-white/70">Category Budgets</p>
          <button onClick={openAddCatPanel} className={buttonPrimary}>
            <Plus size={14} />
            Add budget
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {catBudgets.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed border-white/15 p-8
              text-center text-white/30 text-sm"
            >
              No category budgets set
            </div>
          ) : (
            catBudgets.map((cb) => {
              const spent = categorySpend[cb.category] ?? 0;
              const over = spent > cb.limit;
              const cat = categories.find((c) => c.name === cb.category);
              const color = cat?.color || "#8b5cf6";
              return (
                <div
                  key={cb.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          background: `${color}20`,
                          color: color,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        {cb.category}
                      </span>
                      <span className="text-white/30 text-xs">{cb.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${over ? "text-red-400" : "text-white/70"}`}
                      >
                        {formatAmount(spent)}
                        <span className="text-white/30 font-normal">
                          {" "}
                          / {formatAmount(cb.limit)}
                        </span>
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditCatPanel(cb)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20
                            text-white/60 hover:text-white transition-colors cursor-pointer"
                        >
                          <Pencil size={12} />
                        </button>
                        {deleteConfirmId === cb.id ? (
                          <button
                            onClick={() => handleDelete(cb.id)}
                            className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50
                              text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(cb.id)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20
                              text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <ProgressBar used={spent} limit={cb.limit} color={color} />
                  <p className="text-white/30 text-xs mt-1.5">
                    {cb.limit > 0
                      ? Math.min((spent / cb.limit) * 100, 100).toFixed(0)
                      : 0}
                    % used
                    {over && (
                      <span className="text-red-400 ml-2">• Over budget!</span>
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SlidePanel */}
      <SlidePanel
        open={panelOpen}
        title={
          panelMode === "monthly"
            ? "Edit Monthly Budget"
            : editingCat
              ? "Edit Category Budget"
              : "Add Category Budget"
        }
        subtitle="Set your spending limit"
        onClose={handleClose}
        footer={
          <>
            <button
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60
                hover:text-white hover:bg-white/5 text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30
                text-violet-400 hover:bg-violet-500/30 text-sm font-medium transition-colors cursor-pointer"
            >
              {panelMode === "monthly"
                ? "Update"
                : editingCat
                  ? "Update"
                  : "Save"}
            </button>
          </>
        }
      >
        {panelMode === "category" && (
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={catForm.category}
              onChange={(e) =>
                setCatForm((f) => ({ ...f, category: e.target.value }))
              }
              className={selectClass}
              style={{ colorScheme: "dark" }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#1a1535]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass}>Budget Limit (₹)</label>
          <input
            type="number"
            placeholder="0"
            min={0}
            value={
              panelMode === "monthly"
                ? monthlyForm.limit || ""
                : catForm.limit || ""
            }
            onChange={(e) => {
              const val = Number(e.target.value);
              if (panelMode === "monthly")
                setMonthlyForm((f) => ({ ...f, limit: val }));
              else setCatForm((f) => ({ ...f, limit: val }));
            }}
            className={inputClass}
          />
          {errors.limit && (
            <p className="text-red-400 text-xs mt-1">{errors.limit}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Period</label>
          <div className="flex rounded-xl overflow-hidden border border-white/15">
            {(["monthly", "yearly"] as BudgetPeriod[]).map((p) => {
              const current =
                panelMode === "monthly" ? monthlyForm.period : catForm.period;
              return (
                <button
                  key={p}
                  onClick={() => {
                    if (panelMode === "monthly")
                      setMonthlyForm((f) => ({ ...f, period: p }));
                    else setCatForm((f) => ({ ...f, period: p }));
                  }}
                  className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer capitalize
                    ${
                      current === p
                        ? "bg-violet-500/20 text-violet-400"
                        : "text-white/40 hover:text-white/70"
                    }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </SlidePanel>
    </div>
  );
}



