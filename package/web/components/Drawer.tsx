import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "92vh" }}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />
        
        <div className="px-6 pb-10 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white py-2 z-10">
            <h2 className="text-xl font-bold text-black">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
