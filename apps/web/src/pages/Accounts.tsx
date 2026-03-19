import { MOCK_DATA } from "@zeroleak/package/web/constant";
import { ListPlus, Trash } from "lucide-react";

export default function Accounts() {
  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_DATA.ACCOUNT.map((acc) => (
          <div
            key={acc.title}
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
              <button className="p-2 rounded-lg hover:bg-black/5 transition-colors">
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
