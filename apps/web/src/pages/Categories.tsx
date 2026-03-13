import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import SlidePanel from "../components/SlidePanel";
import type { Category, OutletContext } from "@zeroleak/types";
import { inputClass, labelClass } from "@zeroleak/ui";

const PRESET_COLORS = [
  "#10b981",
  "#3b82f6",
  "#22c55e",
  "#ec4899",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#e879f9",
  "#64748b",
];

type CategoryForm = {
  name: string;
  color: string;
  iconName: string;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  color: "#10b981",
  iconName: "Tag",
};

// Get all valid lucide icon names
const ALL_ICON_NAMES = Object.keys(LucideIcons).filter(
  (key) =>
    key[0] === key[0].toUpperCase() &&
    key !== "default" &&
    key !== "createLucideIcon" &&
    !key.startsWith("Lucide") &&
    !key.endsWith("Icon"),
);

function DynamicIcon({
  name,
  size = 20,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}

export default function Categories() {
  const { categories, setCategories } = useOutletContext<OutletContext>();

  const [panelOpen, setPanelOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryForm, string>>
  >({});
  const [iconSearch, setIconSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filteredIcons = useMemo(() => {
    const q = iconSearch.toLowerCase();
    return ALL_ICON_NAMES.filter((name) =>
      name.toLowerCase().includes(q),
    ).slice(0, 48);
  }, [iconSearch]);

  function handleAdd() {
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setPanelOpen(true);
  }

  function handleEdit(cat: Category) {
    setEditingCategory(cat);
    setForm({ name: cat.name, color: cat.color, iconName: cat.iconName });
    setErrors({});
    setPanelOpen(true);
  }

  function handleClose() {
    setPanelOpen(false);
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIconSearch("");
  }

  function validate(): boolean {
    const e: Partial<Record<keyof CategoryForm, string>> = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.iconName) e.iconName = "Select an icon";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...form, id: c.id } : c,
        ),
      );
    } else {
      setCategories((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    handleClose();
  }

  function handleDelete(id: number) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-violet-500/15 border border-violet-500/30 text-violet-400
            text-sm font-medium hover:bg-violet-500/25 transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex flex-col items-center justify-center gap-3 p-6
              rounded-2xl border border-white/10 bg-white/5
              transition-all duration-200 hover:bg-white/10"
          >
            {/* Icon */}
            <div
              className="p-3 rounded-xl"
              style={{
                background: `${cat.color}20`,
                border: `1px solid ${cat.color}40`,
              }}
            >
              <DynamicIcon name={cat.iconName} size={22} color={cat.color} />
            </div>

            <span className="text-sm font-medium text-white">{cat.name}</span>

            {/* Action buttons — hover pe dikhein */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(cat)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <Pencil size={12} />
              </button>
              {deleteConfirmId === cat.id ? (
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 rounded-lg bg-red-500/30 hover:bg-red-500/50 text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(cat.id)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slide Panel */}
      <SlidePanel
        open={panelOpen}
        title={editingCategory ? "Edit Category" : "Add Category"}
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
              {editingCategory ? "Update" : "Save"}
            </button>
          </>
        }
      >
        {/* Name */}
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            placeholder="e.g. Entertainment"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Color */}
        <div>
          <label className={labelClass}>Color</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className={`w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110
                  ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1535]" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
          {/* Custom hex */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-8 h-8 rounded-lg shrink-0"
              style={{ background: form.color }}
            />
            <input
              type="text"
              placeholder="#10b981"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              className={inputClass}
            />
            <input
              type="color"
              value={form.color}
              onChange={(e) =>
                setForm((f) => ({ ...f, color: e.target.value }))
              }
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
          </div>
        </div>

        {/* Icon search */}
        <div>
          <label className={labelClass}>Icon</label>
          <div className="relative mb-2">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search icons..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/10 border border-white/15
                text-white text-sm placeholder:text-white/30 outline-none focus:border-white/25 transition-colors"
            />
          </div>
          {errors.iconName && (
            <p className="text-red-400 text-xs mb-2">{errors.iconName}</p>
          )}
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {filteredIcons.map((name) => (
              <button
                key={name}
                onClick={() => setForm((f) => ({ ...f, iconName: name }))}
                title={name}
                className={`p-2 rounded-lg flex items-center justify-center cursor-pointer transition-all
                  ${
                    form.iconName === name
                      ? "bg-white/20 ring-1 ring-white/40"
                      : "hover:bg-white/10"
                  }`}
              >
                <DynamicIcon
                  name={name}
                  size={16}
                  color={
                    form.iconName === name
                      ? form.color
                      : "rgba(255,255,255,0.5)"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className={labelClass}>Preview</label>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: `${form.color}20`,
                border: `1px solid ${form.color}40`,
              }}
            >
              <DynamicIcon name={form.iconName} size={20} color={form.color} />
            </div>
            <span className="text-sm font-medium text-white">
              {form.name || "Category name"}
            </span>
          </div>
        </div>
      </SlidePanel>
    </div>
  );
}
