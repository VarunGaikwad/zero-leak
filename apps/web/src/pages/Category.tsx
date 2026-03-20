import { CategoryItem } from "@zeroleak/package/web/components";
import { axiosInstance } from "../lib";
import { useEffect, useState } from "react";
import { ListPlus } from "lucide-react";

export default function Category() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center py-20">
        <p className="text-zinc-500 animate-pulse font-medium">
          Loading categories...
        </p>
      </div>
    );
  }
  return (
    <div className="w-full space-y-5">
      <h1 className="font-semibold text-2xl">Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map(function (options) {
          return (
            <CategoryItem
              key={options.id ?? options.title}
              {...options}
              onDelete={async () => {
                if (window.confirm(`Delete category "${options.title}"?`)) {
                  await axiosInstance.delete(`/api/v1/categories/${options.id}`);
                  setCategories((prev) =>
                    prev.filter((c) => c.id !== options.id),
                  );
                }
              }}
            />
          );
        })}
        <button className="border border-dashed rounded-xl py-6 px-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <ListPlus size={24} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-500">
            Add Category
          </span>
        </button>
      </div>
    </div>
  );
}
