import { useState } from "react";
import AppContext from "./context";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [appData, setAppData] = useState({});
  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
}
