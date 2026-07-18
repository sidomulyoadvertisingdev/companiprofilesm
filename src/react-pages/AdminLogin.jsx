import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@sidomulyo.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Login gagal");
      }
      window.location.href = "/admin";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-1">CMS Login</h1>
        <p className="text-sm text-[#6e6e73] mb-6">Sidomulyo Advertising & Printing</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
        )}

        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-1 text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-400 disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Login"}
        </button>


      </form>
    </div>
  );
}
