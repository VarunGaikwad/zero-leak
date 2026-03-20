import { useState } from "react";
import AppContext from "./context";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawerWithData = (item: any) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        editingItem,
        setEditingItem,
        openDrawerWithData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
