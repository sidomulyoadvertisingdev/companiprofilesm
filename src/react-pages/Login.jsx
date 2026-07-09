import { useState } from "react";
import { login } from "../api/auth";

export default function Login() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const from = params?.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = from;
    } catch (err) {
      alert("Email atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        <input
          type="email"
          className="w-full border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-3">
          Login
        </button>

        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <a href="/register" className="underline">
            Daftar
          </a>
        </p>
      </form>
    </div>
  );
}
