import { Trash2, HelpCircle, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export default function CategoryItem({
  icon,
  Icon: IconProp,
  title,
  type,
  numberOfTransaction,
  onDelete,
  color,
}: {
  title: string;
  icon?: string;
  Icon?: LucideIcon;
  type: string;
  numberOfTransaction: number;
  onDelete?: () => void;
  color?: string; // e.g. "bg-orange-500"
}) {
  const ResolvedIcon = IconProp || (Icons as any)[icon as string] || HelpCircle;
  return (
    <div className="border rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className={`size-12 rounded-full flex items-center justify-center ${color || "bg-black"} shrink-0 shadow-sm`}>
        <ResolvedIcon className="text-white size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{title}</p>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
          {type}
        </p>
        <p className="text-sm text-gray-400 mt-1 truncate">
          {numberOfTransaction} transaction{numberOfTransaction !== 1 && "s"}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        title="Delete category"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
