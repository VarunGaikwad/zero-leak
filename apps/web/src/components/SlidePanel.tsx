import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function SlidePanel({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-96 z-30 flex flex-col
          bg-[#1a1535] border-l border-white/10
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ visibility: open ? "visible" : "hidden" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <h2 className="text-white font-semibold text-base">{title}</h2>
            {subtitle && (
              <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-5 px-6 py-6 overflow-y-auto flex-1">
          {children}
        </div>
        <div className="px-6 py-5 border-t border-white/10 flex gap-3">
          {footer}
        </div>
      </div>
    </>
  );
}
