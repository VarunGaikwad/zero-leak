import { useState } from "react";
import { axiosInstance } from "../../lib";
import { Landmark, Wallet, CreditCard, Banknote, Check } from "lucide-react";
import { CURRENCY } from "@zeroleak/package/web/constant";

const ACCOUNT_TYPES = ["Bank", "Cash", "IC Card", "E-Wallet", "Investment", "Loan"];

export default function AddAccountForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    balance: "",
    currency: CURRENCY[0],
    type: ACCOUNT_TYPES[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.balance) return;

    setLoading(true);
    try {
      await axiosInstance.post("/api/v1/accounts", {
        ...formData,
        balance: parseFloat(formData.balance),
        totalTransaction: 0,
      });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Bank": return <Landmark size={20} />;
      case "Cash": return <Banknote size={20} />;
      case "IC Card": return <CreditCard size={20} />;
      case "E-Wallet": return <Wallet size={20} />;
      default: return <Landmark size={20} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        {/* Balance Input - Big and Center */}
        <div className="flex flex-col items-center py-2">
          <span className="text-gray-400 text-sm font-medium mb-1">Initial Balance</span>
          <div className="flex items-center text-4xl font-bold">
            <span className="mr-2 text-gray-400">{formData.currency}</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="w-44 text-center bg-transparent border-none focus:outline-none placeholder-gray-200"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Currency Grid Selection */}
        <div className="space-y-3">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Source Currency</span>
          <div className="grid grid-cols-6 gap-2">
            {CURRENCY.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({ ...formData, currency: c })}
                className={`py-3 rounded-2xl text-lg font-bold transition-all cursor-pointer ${
                  formData.currency === c ? "bg-black text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Account Name */}
        <div className="flex items-center gap-4 border-b py-3">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Landmark size={20} />
          </div>
          <input
            type="text"
            placeholder="Account Name (e.g. MUFG Bank)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none font-medium text-black"
            required
          />
        </div>

        {/* Account Type Selection */}
        <div className="space-y-3">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Account Type</span>
          <div className="grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type })}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                  formData.type === type ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                }`}
              >
                {getIcon(type)}
                <span className="text-sm font-medium">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.title || !formData.balance}
        className="w-full bg-black text-white py-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-200"
      >
        {loading ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <Check size={20} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
}
