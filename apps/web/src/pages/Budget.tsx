import { BudgetItem } from "@zeroleak/package/web/components";
import { MOCK_DATA } from "@zeroleak/package/web/constant";
import { ListPlus } from "lucide-react";
export default function Budget() {
  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Budget</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_DATA.BUDGET.map(function (options) {
          return <BudgetItem key={options.title} {...options} />;
        })}
        <button className="border border-dashed rounded-xl py-6 px-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <ListPlus size={24} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Add Budget</span>
        </button>
      </div>
    </div>
  );
}
