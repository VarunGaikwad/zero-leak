import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib";
import { Calendar, Repeat, Check, Tv, CreditCard } from "lucide-react";

interface Account {
  id: string;
  title: string;
  currency: string;
}

export default function AddSubscriptionForm({ onSuccess }: { onSuccess: () => void }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    accountId: "",
    repeatNumber: "1",
    repeatUnit: "month",
    upcomingPayDate: new Date().toISOString().split('T')[0],
    icon: "Tv",
  });

  useEffect(() => {
    axiosInstance.get("/api/v1/accounts").then((res) => {
      setAccounts(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, accountId: res.data[0].id }));
      }
    });
  }, []);

  const selectedAccount = accounts.find(a => a.id === formData.accountId);
  const currencySymbol = selectedAccount?.currency || "$";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.accountId) return;

    setLoading(true);
    try {
      await axiosInstance.post("/api/v1/subscriptions", {
        ...formData,
        amount: parseFloat(formData.amount),
        repeatNumber: parseInt(formData.repeatNumber),
        upcomingPayDate: new Date(formData.upcomingPayDate).toISOString(),
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const icons = [
    { name: "Tv", Icon: Tv },
    { name: "CreditCard", Icon: CreditCard },
  ];

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

        {/* Amount Input */}
        <div className="flex flex-col items-center py-2">
          <span className="text-gray-400 text-sm font-medium mb-1">Pricing</span>
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

        {/* Name */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Tv size={20} />
          </div>
          <input
            type="text"
            placeholder="Subscription Name (e.g. Netflix)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black"
            required
          />
        </div>

        {/* Recurrence */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Repeat size={20} />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Every</span>
            <input
              type="number"
              value={formData.repeatNumber}
              onChange={(e) => setFormData({ ...formData, repeatNumber: e.target.value })}
              className="w-10 text-center font-bold bg-transparent border-none focus:outline-none text-black"
              required
            />
            <select
              value={formData.repeatUnit}
              onChange={(e) => setFormData({ ...formData, repeatUnit: e.target.value })}
              className="bg-transparent text-sm font-medium focus:outline-none text-gray-600 appearance-none pr-4"
              required
            >
              <option value="day">Day(s)</option>
              <option value="week">Week(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
          </div>
        </div>

        {/* Icons Picker */}
        <div className="space-y-3">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Icon</span>
          <div className="flex gap-3">
             {icons.map(({ name, Icon }) => (
               <button
                 key={name}
                 type="button"
                 onClick={() => setFormData({ ...formData, icon: name })}
                 className={`p-3 rounded-2xl transition-all ${
                   formData.icon === name ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-400"
                 }`}
               >
                 <Icon size={24} />
               </button>
             ))}
          </div>
        </div>

        {/* Next Billing Date */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <span className="text-gray-400 text-xs block">Upcoming Pay Date</span>
            <input
              type="date"
              value={formData.upcomingPayDate}
              onChange={(e) => setFormData({ ...formData, upcomingPayDate: e.target.value })}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-600 font-medium"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.name || !formData.amount || !formData.accountId}
        className="w-full bg-black text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200"
      >
        {loading ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <Check size={20} />
            <span>Add Subscription</span>
          </>
        )}
      </button>
    </form>
  );
}
