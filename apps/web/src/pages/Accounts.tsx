import { axiosInstance } from "../lib";
import { useEffect, useState } from "react";
import { ListPlus, Trash } from "lucide-react";

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/accounts")
      .then((res) => setAccounts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-20">
        <p className="text-zinc-500 animate-pulse font-medium">
          Loading accounts...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id ?? acc.title}
            className="flex items-stretch rounded-2xl border border-black/10 overflow-hidden"
          >
            <div className="w-1.5 shrink-0 bg-black" />
            <div className="flex flex-1 items-center gap-4 px-4 py-4">
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{acc.title}</p>
                <p className="text-lg font-bold">
                  {acc.balance < 0 ? "-" : ""}
                  {acc.currency}
                  {Math.abs(acc.balance).toLocaleString()}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="bg-black text-white px-3 py-0.5 rounded-full text-xs">
                    {acc.type}
                  </span>
                  <span className="text-black/50">
                    {acc.totalTransaction} transactions
                  </span>
                </div>
              </div>
              <button 
                onClick={async () => {
                  if (window.confirm(`Are you sure you want to delete "${acc.title}"?`)) {
                    await axiosInstance.delete(`/api/v1/accounts/${acc.id}`);
                    setAccounts(prev => prev.filter(a => a.id !== acc.id));
                  }
                }}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        ))}

        <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/20 py-6 px-5 hover:bg-black/5 transition-colors cursor-pointer">
          <ListPlus size={24} className="text-black/30" />
          <span className="text-sm font-medium text-black/40">Add Account</span>
        </button>
      </div>
    </div>
  );
}

