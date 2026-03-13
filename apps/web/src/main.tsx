import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./Dashboard.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PATHS } from "@zeroleak/types";
import {
  Alerts,
  Budget,
  Categories,
  Goals,
  Home,
  Reports,
  Settings,
  Transactions,
} from "./pages";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.home} element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path={PATHS.transactions} element={<Transactions />} />
          <Route path={PATHS.categories} element={<Categories />} />
          <Route path={PATHS.goals} element={<Goals />} />
          <Route path={PATHS.budget} element={<Budget />} />
          <Route path={PATHS.reports} element={<Reports />} />
          <Route path={PATHS.alerts} element={<Alerts />} />
          <Route path={PATHS.settings} element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
