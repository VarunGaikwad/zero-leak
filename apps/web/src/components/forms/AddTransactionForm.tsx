import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib";
import { Calendar, Tag, FileText, Banknote, Check } from "lucide-react";

interface Category {
  id: string;
  title: string;
  icon: string;
}

interface Account {
  id: string;
  title: string;
  currency: string;
}

export default function AddTransactionForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess: () => void, 
  initialData?: any 
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    accountId: "",
    categoryId: "",
    type: "Expense" as "Expense" | "Income",
    note: "",
    datetime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, accRes] = await Promise.all([
        axiosInstance.get("/api/v1/categories"),
        axiosInstance.get("/api/v1/accounts")
      ]);
      setCategories(catRes.data);
      setAccounts(accRes.data);

      if (initialData) {
        // Find matching category ID from title/icon
        const cat = catRes.data.find((c: any) => 
          c.title === initialData.category?.[0]?.title
        );
        
        setFormData({
          title: initialData.title || "",
          amount: Math.abs(initialData.amount || 0).toString(),
          accountId: initialData.accountId || (accRes.data.length > 0 ? accRes.data[0].id : ""),
          categoryId: cat?.id || "",
          type: (initialData.amount || 0) >= 0 ? "Income" : "Expense",
          note: initialData.note || "",
          datetime: initialData.datetime ? new Date(initialData.datetime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        });
      } else if (accRes.data.length > 0) {
        setFormData(prev => ({ ...prev, accountId: accRes.data[0].id }));
      }
    };
    fetchData();
  }, [initialData]);

  const selectedAccount = accounts.find(a => a.id === formData.accountId);
  const currencySymbol = selectedAccount?.currency || "¥";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.categoryId || !formData.accountId) return;

    setLoading(true);
    try {
      const selectedCat = categories.find(c => c.id === formData.categoryId);
      const rawAmount = parseFloat(formData.amount);
      const payload = {
        title: formData.title,
        amount: formData.type === "Expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount),
        accountId: formData.accountId,
        category: [{ title: selectedCat?.title, isMain: true, icon: selectedCat?.icon }],
        note: formData.note,
        datetime: new Date(formData.datetime).toISOString(),
      };

      if (initialData?.id) {
        await axiosInstance.put(`/api/v1/transactions/${initialData.id}`, payload);
      } else {
        await axiosInstance.post("/api/v1/transactions", payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Account Selector */}
        <div className="space-y-2">
           <span className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Source Account</span>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
             {accounts.map(acc => (
               <button
                 key={acc.id}
                 type="button"
                 onClick={() => setFormData({ ...formData, accountId: acc.id })}
                 className={`shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                   formData.accountId === acc.id ? "bg-black text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                 }`}
               >
                 {acc.title} ({acc.currency})
               </button>
             ))}
           </div>
        </div>

        {/* Amount Input - Big and Center */}
        <div className="flex flex-col items-center py-2">
          <span className="text-gray-400 text-sm font-medium mb-1">Amount</span>
          <div className="flex items-center text-4xl font-bold">
            <span className="mr-1">{currencySymbol}</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-40 text-center bg-transparent border-none focus:outline-none placeholder-gray-200"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Banknote size={20} />
          </div>
          <input
            type="text"
            placeholder="What was it for?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black"
            required
          />
        </div>

        {/* Type Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mx-1">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "Expense", categoryId: "" })}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              formData.type === "Expense" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "Income", categoryId: "" })}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              formData.type === "Income" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Income
          </button>
        </div>

        {/* Category Picker - Grid of items */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest px-1">
            <Tag size={12} />
            <span>Category</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categories
              .filter((c: any) => c.type === formData.type)
              .map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all cursor-pointer ${
                    formData.categoryId === cat.id ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <span className="text-xs font-medium truncate w-full text-center">{cat.title}</span>
                </button>
              ))}
          </div>
          {categories.filter((c: any) => c.type === formData.type).length === 0 && (
             <p className="text-center text-xs text-gray-400 py-4 italic border-2 border-dashed border-gray-100 rounded-2xl">
               No {formData.type.toLowerCase()} categories found. Add one in Categories page.
             </p>
          )}
        </div>

        {/* Note */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <FileText size={20} />
          </div>
          <input
            type="text"
            placeholder="Add a note (optional)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-600"
          />
        </div>

        {/* Date */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Calendar size={20} />
          </div>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-600"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.title || !formData.amount || !formData.categoryId || !formData.accountId}
        className="w-full bg-black text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-pulse">{initialData ? "Updating..." : "Adding..."}</span>
        ) : (
          <>
            <Check size={20} />
            <span>{initialData ? "Update Transaction" : "Add Transaction"}</span>
          </>
        )}
      </button>
    </form>
  );
}
