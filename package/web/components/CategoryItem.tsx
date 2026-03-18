import { Trash2, type LucideIcon } from "lucide-react";

export default function CategoryItem({
  Icon,
  title,
  type,
  numberOfTransaction,
}: {
  title: string;
  Icon: LucideIcon;
  type: string;
  numberOfTransaction: number;
}) {
  return (
    <div className="border rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="size-12 rounded-full flex items-center justify-center bg-black shrink-0">
        <Icon className="text-white size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{title}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
          {type}
        </div>
        <div className="text-sm text-gray-400 mt-1 truncate">
          {numberOfTransaction} transaction{numberOfTransaction !== 1 && "s"}
        </div>
      </div>
      <button
        className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        title="Delete category"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
