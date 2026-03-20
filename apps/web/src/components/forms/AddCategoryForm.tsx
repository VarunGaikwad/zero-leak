import { useState, useMemo } from "react";
import { axiosInstance } from "../../lib";
import * as LucideIcons from "lucide-react";

const POPULAR_ICONS = [
  "ShoppingCart", "Train", "Tv", "UtensilsCrossed", "HeartPulse", 
  "Coffee", "ShoppingBag", "TrendingUp", "Zap", "Home", 
  "Plane", "BookOpen", "Dumbbell", "Gift", "Car", "Wifi", 
  "Wallet", "Tag", "Music", "Video", "Camera", "Smartphone", 
  "Laptop", "Cpu", "Gamepad2", "Headphones", "Ghost", "Sticker",
  "Pencil", "Eraser", "Brush", "Palette", "Shirt", "User",
  "Users", "Baby", "Dog", "Cat", "Fish", "Leaf"
];

const CATEGORY_COLORS = [
  "bg-black", "bg-slate-500", "bg-gray-500", "bg-zinc-500", "bg-red-500", 
  "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", 
  "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", "bg-blue-500", 
  "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500", 
  "bg-rose-500"
];

export default function AddCategoryForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "Expense" as "Expense" | "Income",
    icon: "Tag",
    color: "bg-black",
  });

  const filteredIcons = useMemo(() => {
    if (!search) {
      return POPULAR_ICONS.map(name => ({
        name,
        Icon: (LucideIcons as any)[name] as React.ElementType
      })).filter(i => !!i.Icon);
    }

    const term = search.toLowerCase();
    return Object.entries(LucideIcons)
      .filter(([name, Icon]) => 
        name.toLowerCase().includes(term) && 
        /^[A-Z]/.test(name) && 
        typeof Icon === "object" && 
        Icon !== null &&
        (Icon as any).$$typeof === (typeof Symbol === 'function' && Symbol.for ? Symbol.for('react.forward_ref') : 1)
      )
      .slice(0, 100) // Limit search results for performance
      .map(([name, Icon]) => ({
        name,
        Icon: Icon as React.ElementType
      }));
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    try {
      await axiosInstance.post("/api/v1/categories", {
        ...formData,
        numberOfTransaction: 0,
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        {/* Type Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "Expense" })}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              formData.type === "Expense" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "Income" })}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              formData.type === "Income" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Income
          </button>
        </div>

        {/* Title & Color Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b py-3">
            <div className={`p-2 rounded-lg text-white transition-colors ${formData.color}`}>
              <LucideIcons.Tag size={20} />
            </div>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black"
              required
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Choose Color</span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x h-12">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`shrink-0 size-8 rounded-full transition-all cursor-pointer snap-start border-2 ${
                    formData.color === c ? "border-black scale-110 shadow-md" : "border-transparent opacity-80"
                  } ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Icon Selection Search & Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Icon</span>
            <div className="relative flex items-center">
               <LucideIcons.Search size={14} className="absolute left-2 text-gray-300" />
               <input 
                 type="text" 
                 placeholder="Search icon..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-7 pr-3 py-1 bg-gray-50 rounded-full text-xs focus:ring-1 focus:ring-black outline-none w-32 transition-all focus:w-48"
               />
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-none">
            {filteredIcons.length > 0 ? (
              filteredIcons.map(({ name, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: name })}
                  title={name}
                  className={`flex items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${
                    formData.icon === name ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))
            ) : (
              <div className="col-span-6 py-8 text-center text-gray-400 text-sm italic">
                No matching icons found
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.title}
        className="w-full bg-black text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200"
      >
        {loading ? (
          <span className="animate-pulse">Saving...</span>
        ) : (
          <>
            <LucideIcons.Check size={20} />
            <span>Create Category</span>
          </>
        )}
      </button>
    </form>
  );
}
