import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { register } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🔒 validasi frontend
    if (form.password !== form.password_confirmation) {
      setError("Password dan konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    try {
      const res = await register(form);

      // ✅ simpan token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registrasi gagal, silakan coba lagi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR MODE JOBS */}
      <Navbar mode="jobs" />

      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-md mx-auto px-6">

          <h1 className="text-2xl font-semibold mb-6">
            Daftar Akun
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              className="w-full border p-2 rounded"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password_confirmation"
              placeholder="Konfirmasi Password"
              className="w-full border p-2 rounded"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded
                         hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>

          </form>
        </div>
      </section>
    </>
  );
}
