import { useContext } from "react";
import { AppContext } from "../model";

export default function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <Provider>");
  return context;
}
