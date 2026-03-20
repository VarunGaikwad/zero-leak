import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib";
import { Check, Wallet, Layers, Plus } from "lucide-react";

export default function AddBudgetForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    limit: "",
    selectedCategoryIds: [] as string[],
  });

  useEffect(() => {
    axiosInstance.get("/api/v1/categories")
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.includes(id)
        ? prev.selectedCategoryIds.filter(cid => cid !== id)
        : [...prev.selectedCategoryIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.limit || formData.selectedCategoryIds.length === 0) return;

    setLoading(true);
    try {
      // Map selected IDs back to category objects for the mock API expectations
      const subCategories = categories
        .filter(c => formData.selectedCategoryIds.includes(c.id))
        .map(c => ({ id: c.id, title: c.title, color: c.color }));

      await axiosInstance.post("/api/v1/budgets", {
        title: formData.title,
        limit: Number(formData.limit),
        category: subCategories,
        spent: 0,
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
        {/* Budget Limit Input */}
        <div className="flex flex-col items-center py-2">
          <span className="text-gray-400 text-sm font-medium mb-1">Monthly Limit</span>
          <div className="flex items-center text-4xl font-bold">
            <span className="mr-2 text-gray-400">¥</span>
            <input
              type="number"
              placeholder="0.00"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="w-44 text-center bg-transparent border-none focus:outline-none placeholder-gray-200"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Budget Title */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
            <Wallet size={20} />
          </div>
          <input
            type="text"
            placeholder="Budget Title (e.g. Health & Fitness)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black"
            required
          />
        </div>

        {/* Multi-Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Link Categories</span>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">
              {formData.selectedCategoryIds.length} Selected
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-none">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const isSelected = formData.selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer border ${
                      isSelected 
                        ? "bg-black text-white border-black shadow-md scale-[1.02]" 
                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/20" : (cat.color || "bg-gray-100")
                    }`}>
                      <Layers size={14} className={isSelected ? "text-white" : "text-gray-500"} />
                    </div>
                    <span className="flex-1 text-left font-medium">{cat.title}</span>
                    {isSelected ? (
                      <Check size={18} className="text-white" />
                    ) : (
                      <Plus size={18} className="text-gray-300" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm italic border-2 border-dashed rounded-2xl">
                No categories found. Create one first!
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.limit || formData.selectedCategoryIds.length === 0}
        className="w-full bg-black text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200"
      >
        {loading ? (
          <span className="animate-pulse">Saving...</span>
        ) : (
          <>
            <Wallet size={20} />
            <span>Create Budget</span>
          </>
        )}
      </button>
    </form>
  );
}
