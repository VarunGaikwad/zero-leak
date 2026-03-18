import { ArrowDown, ArrowUp, NotepadText, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { CATEGORY_ICON } from "../constant";

export default function TransactionItem({
  title,
  category,
  note,
  amount,
}: {
  title: string;
  category: { title: string; isMain: boolean }[];
  note: string;
  amount: number;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const Icon = CATEGORY_ICON.find(
    ({ title }) => title === category.find(({ isMain }) => isMain)?.title,
  )?.Icon as LucideIcon;

  return (
    <div className="flex gap-5 items-center">
      <div className="bg-black p-2 rounded-full">
        <Icon className="size-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-black font-medium truncate">{title}</div>
        <div className="text-xs flex gap-1 mt-0.5">
          {category.map(({ title }) => (
            <span
              key={title}
              className="inline-block rounded-md bg-black text-white px-2.5 py-0.5"
            >
              {title}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {note && (
          <div
            className="relative"
            onMouseEnter={() => setPopoverOpen(true)}
            onMouseLeave={() => setPopoverOpen(false)}
          >
            <NotepadText className="size-5 cursor-pointer text-black" />
            {popoverOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs rounded-xl px-3 py-2 shadow-lg z-50">
                {note}
                <div className="absolute top-full right-3 border-4 border-transparent border-t-black" />
              </div>
            )}
          </div>
        )}
        <div
          className={`flex items-center ${amount >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {amount >= 0 ? (
            <ArrowUp className="size-5" />
          ) : (
            <ArrowDown className="size-5" />
          )}
          <span className="font-semibold">${Math.abs(amount)}</span>
        </div>
      </div>
    </div>
  );
}
