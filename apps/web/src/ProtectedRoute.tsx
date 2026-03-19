import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { axiosInstance } from "./lib";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    debugger;
    axiosInstance
      .get("/api/v1/me")
      .then(() => setAuthed(true))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) return <p>Loading...</p>;
  if (!authed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
