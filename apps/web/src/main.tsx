import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import Dashboard from "./Dashboard.tsx";
import {
  Home,
  Budget,
  Category,
  Transaction,
  Subscriptions,
  Accounts,
} from "./pages";
import Login from "./Login.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import { Provider } from "./model";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Provider>
                <Dashboard />
              </Provider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="budget" element={<Budget />} />
          <Route path="category" element={<Category />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="subscription" element={<Subscriptions />} />
          <Route path="account" element={<Accounts />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
