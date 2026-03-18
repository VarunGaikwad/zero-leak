import { CategoryItem } from "@zeroleak/package/web/components";
import { CATEGORY } from "@zeroleak/package/web/constant";
import { ListPlus } from "lucide-react";

export default function Category() {
  return (
    <div className="w-full space-y-5">
      <div className="font-semibold text-2xl">Category</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORY.map(function (options) {
          return <CategoryItem key={options.title} {...options} />;
        })}
        <button className="border border-dashed rounded-xl py-6 px-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <ListPlus size={24} className="text-gray-400" />
          <div className="text-sm font-medium text-gray-500">Add Category</div>
        </button>
      </div>
    </div>
  );
}
