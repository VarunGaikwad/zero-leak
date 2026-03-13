import { useState, useEffect } from "react";
import {
  MENU,
  type Transaction,
  type TransactionType,
  type TransactionForm,
  type Category,
  DEFAULT_CATEGORIES,
  getLocalDatetime,
  EMPTY_FORM,
  MOCK_TRANSACTIONS,
} from "@zeroleak/types";

import { inputClass, selectClass, labelClass } from "@zeroleak/ui";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import SlidePanel from "./components/SlidePanel";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentMenu = MENU.find((menu) => menu.path === location.pathname);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Persistence
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("zl_categories");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem("zl_categories", JSON.stringify(categories));
  }, [categories]);

  const dynamicCategoryNames = categories.map((c) => c.name);

  function handleAdd() {
    setEditingTransaction(null); // null = add mode
    setForm({
      ...EMPTY_FORM,
      category: dynamicCategoryNames[0] || "Food",
      datetime: getLocalDatetime(), // ← har baar fresh time
    });
    setPanelOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction); // data = edit mode
    setPanelOpen(true);
  }

  function handleClose() {
    setPanelOpen(false);
    setEditingTransaction(null);
    setForm({ ...EMPTY_FORM, datetime: getLocalDatetime() });
    setErrors({});
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...form, id: t.id } : t,
        ),
      );
    } else {
      setTransactions((prev) => [{ ...form, id: Date.now() }, ...prev]);
    }
    handleClose();
  }

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        datetime: editingTransaction.datetime,
        description: editingTransaction.description,
        category: editingTransaction.category,
        type: editingTransaction.type,
        amount: editingTransaction.amount,
      });
    } else {
      setForm(() => ({
        ...EMPTY_FORM,
        category: dynamicCategoryNames[0] || "Food",
      }));
    }

  }, [editingTransaction, categories]);

  const [form, setForm] = useState<TransactionForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionForm, string>>
  >({});

  function validate(): boolean {
    const e: Partial<Record<keyof TransactionForm, string>> = {};
    if (!form.description.trim()) e.description = "Description required";
    if (!form.amount || form.amount <= 0) e.amount = "Enter valid amount";
    if (!form.datetime) e.datetime = "Date required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="h-svh w-screen flex p-3 gap-3 relative overflow-hidden bg-deep-purple">
      {/* Blobs */}
      <div className="absolute w-72 h-72 rounded-full -top-10 -left-10 opacity-50 blur-[80px] bg-blob-purple" />
      <div className="absolute w-56 h-56 rounded-full bottom-0 right-20 opacity-50 blur-[80px] bg-blob-green" />

      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 p-4 rounded-3xl relative z-10 flex flex-col gap-6
        bg-glass backdrop-blur-xl border border-glass-border text-white"
      >
        <div className="text-xl font-extrabold tracking-tight">Zero Leak</div>
        <nav className="flex flex-col gap-1">
          {MENU.map(({ title, Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <div
                key={title}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${
                    isActive
                      ? "text-white bg-glass-active"
                      : "text-white/60 hover:text-white hover:bg-glass-hover"
                  }`}
              >
                {Icon && <Icon size={18} />}
                <span className="text-sm font-medium">{title}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main
        className="flex-1 p-6 rounded-3xl relative z-10 overflow-y-auto
        bg-glass backdrop-blur-xl border border-glass-border text-white"
      >
        <div className="mb-6">
          <h1 className="text-xl font-extrabold tracking-tight">
            {currentMenu?.title ?? "Dashboard"}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {currentMenu?.subtitle ?? "Overview & summary"}
          </p>
        </div>
        <Outlet
          context={{
            onAdd: handleAdd,
            onEdit: handleEdit,
            transactions,
            categories,
            setCategories,
          }}
        />
      </main>

      {/* SlidePanel — main ke bahar */}
      <SlidePanel
        open={panelOpen}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        subtitle="Fill in the details below"
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
              {editingTransaction ? "Update" : "Save"}
            </button>
          </>
        }
      >
        {/* Type toggle */}
        <div>
          <label className={labelClass}>Type</label>
          <div className="flex rounded-xl overflow-hidden border border-white/15">
            {(["out", "in"] as TransactionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer
                  ${
                    form.type === t
                      ? t === "in"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                      : "text-white/40 hover:text-white/70"
                  }`}
              >
                {t === "in" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={inputClass}
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input
            type="number"
            placeholder="0"
            min={0}
            value={form.amount || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount: Number(e.target.value) }))
            }
            className={inputClass}
          />
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className={selectClass}
            style={{ colorScheme: "dark" }}
          >
            {dynamicCategoryNames.map((c) => (
              <option key={c} value={c} className="bg-[#1a1535]">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Datetime */}
        <div>
          <label className={labelClass}>Date & Time</label>
          <input
            type="datetime-local"
            value={form.datetime}
            onChange={(e) =>
              setForm((f) => ({ ...f, datetime: e.target.value }))
            }
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
          {errors.datetime && (
            <p className="text-red-400 text-xs mt-1">{errors.datetime}</p>
          )}
        </div>
      </SlidePanel>
    </div>
  );

}
