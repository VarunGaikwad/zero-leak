import { createContext } from "react";

export interface AppContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  openDrawerWithData: (item: any) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
