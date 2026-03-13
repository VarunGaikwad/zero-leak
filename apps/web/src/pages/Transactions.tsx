import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import {
  type TransactionType,
  type OutletContext,
  formatAmount,
  formatDate,
} from "@zeroleak/types";
import {
  selectClass,
  buttonPrimary,
  cardClass,
  tableHeaderClass,
  thClass,
  iconInputClass,
} from "@zeroleak/ui";


export default function Transactions() {
  const { onAdd, onEdit, transactions, categories } =
    useOutletContext<OutletContext>();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");

  const filterCategories = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories],
  );

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchCategory && matchType;
    });
  }, [transactions, search, categoryFilter, typeFilter]);


  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={iconInputClass}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={selectClass}
          style={{ colorScheme: "dark" }}
        >
          {filterCategories.map((c) => (
            <option key={c} value={c} className="bg-[#1a1730]">
              {c}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "all" | TransactionType)
          }
          className={selectClass}
          style={{ colorScheme: "dark" }}
        >
          <option value="all" className="bg-[#1a1730]">
            All types
          </option>
          <option value="in" className="bg-[#1a1730]">
            Income
          </option>
          <option value="out" className="bg-[#1a1730]">
            Expense
          </option>
        </select>

        <button onClick={onAdd} className={buttonPrimary}>
          <Plus size={14} />
          Add transaction
        </button>
      </div>

      {/* Table */}
      <div className={cardClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className={tableHeaderClass}>
              <th className={thClass}>Date</th>
              <th className={thClass}>Description</th>
              <th className={thClass}>Category</th>
              <th className={thClass}>Type</th>
              <th className="text-right px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-white/30 text-sm"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((t) => {
                const cat = categories.find((c) => c.name === t.category);
                const color = cat?.color || "#64748b";
                return (
                  <tr
                    key={t.id}
                    onClick={() => onEdit(t)}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-white/50">
                      {formatDate(t.datetime)}
                    </td>
                    <td className="px-4 py-3 text-white">{t.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                          borderColor: `${color}30`,
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {t.type === "in" ? "Income" : "Expense"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${t.type === "in" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {t.type === "in" ? "+" : "-"}
                      {formatAmount(t.amount)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
