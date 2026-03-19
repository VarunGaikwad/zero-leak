import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./lib";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("/api/u/login", { password });
      navigate("/", { replace: true });
    } catch {
      setError("Wrong password");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm px-8 py-10 bg-zinc-900 rounded-2xl border border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6">
          Zero Leak
        </p>

        <h1 className="text-2xl font-medium text-white mb-1">Welcome back</h1>
        <p className="text-sm text-zinc-400 mb-8">
          Enter your password to continue
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoFocus
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-3"
        />

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          className="w-full bg-white text-zinc-900 rounded-lg py-2.5 text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </div>
    </div>
  );
}
