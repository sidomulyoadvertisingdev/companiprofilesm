import { useState, useEffect } from "react";
import {
  FiCheck, FiCopy, FiUser, FiMail, FiPhone,
  FiMapPin, FiLock, FiEye, FiEyeOff, FiTag, FiLogOut,
} from "react-icons/fi";

export default function MarketplaceClaim() {
  const [step, setStep] = useState("register");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("mp_result");
    const t = localStorage.getItem("mp_token");
    if (r) { setStep("result"); return; }
    if (t) { setStep("redeem"); return; }
    const p = localStorage.getItem("mp_phone");
    if (p) setPhone(p);
  }, []);

  const goRegister = () => setStep("register");
  const goLogin = () => setStep("login");
  const goRedeem = () => setStep("redeem");
  const goResult = () => setStep("result");

  if (step === "result") return <ResultStep onTukarLagi={goRedeem} />;
  if (step === "redeem") return <RedeemStep onDone={goResult} onLogout={goRegister} />;
  if (step === "login") return <LoginStep phone={phone} onDone={goRedeem} onRegister={goRegister} />;
  return <RegisterStep phone={phone} onDone={goRedeem} onLogin={goLogin} />;
}

/* ── Register → auto-login → auto-redeem → show result ── */

function RegisterStep({ phone, onDone, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", phone: phone || "", address: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(""); // "", "login", "redeem"

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Register
      const regRes = await fetch("/api/marketplace/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const regData = await regRes.json();
      if (!regRes.ok) { setError(regData.message); setLoading(false); return; }

      // 2. Auto-login
      setPhase("login");
      const loginRes = await fetch("/api/marketplace/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) { setError("Login otomatis gagal: " + loginData.message); setLoading(false); return; }
      localStorage.setItem("mp_token", loginData.token);
      localStorage.setItem("mp_user", JSON.stringify(loginData.user));

      // 3. Auto-generate code
      const codeRes = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginData.token}` },
        body: JSON.stringify({ phone: form.phone }),
      });
      const codeData = await codeRes.json();
      if (!codeRes.ok) { setError("Gagal generate kode: " + codeData.message); setLoading(false); return; }
      const code = codeData.code;
      localStorage.setItem("mp_code_hint", code);

      // 4. Auto-redeem
      setPhase("redeem");
      const redeemRes = await fetch("/api/marketplace/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginData.token}` },
        body: JSON.stringify({ code }),
      });
      const redeemData = await redeemRes.json();
      if (!redeemRes.ok) { setError("Gagal redeem: " + redeemData.message); setLoading(false); return; }

      localStorage.setItem("mp_result", JSON.stringify(redeemData));
      onDone();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
      setPhase("");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Buat Akun</h2>
        <p className="text-slate-400 text-sm">Daftar untuk mendapatkan kode redeem diskon</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Nama Lengkap" value={form.name} onChange={set("name")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /></div>
        <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" placeholder="Email" value={form.email} onChange={set("email")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /></div>
        <div className="relative"><FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="tel" placeholder="Nomor Handphone" value={form.phone} onChange={set("phone")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /></div>
        <div className="relative"><FiMapPin className="absolute left-4 top-3.5 text-slate-500" /><textarea placeholder="Alamat Lengkap" value={form.address} onChange={set("address")} rows={2} className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none" /></div>
        <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={set("password")} required className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPw ? <FiEyeOff /> : <FiEye />}</button></div>

        {phase && (
          <p className="text-xs text-orange-400 text-center">
            {phase === "login" && "Sedang login otomatis..."}
            {phase === "redeem" && "Sedang memproses redeem..."}
          </p>
        )}
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 disabled:opacity-50">
          {loading ? "Memproses..." : "Daftar & Klaim Redeem"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-4">
        Sudah punya akun?{" "}
        <button onClick={onLogin} className="text-orange-400 hover:underline">Login</button>
      </p>
    </div>
  );
}

/* ── Login → auto-redeem → show result ── */

function LoginStep({ phone, onDone, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const loginRes = await fetch("/api/marketplace/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) { setError(loginData.message); setLoading(false); return; }
      localStorage.setItem("mp_token", loginData.token);
      localStorage.setItem("mp_user", JSON.stringify(loginData.user));

      // Generate code
      setPhase("redeem");
      const codeRes = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginData.token}` },
        body: JSON.stringify({ phone: loginData.user.phone || phone || "" }),
      });
      const codeData = await codeRes.json();
      if (!codeRes.ok) { setError("Gagal generate kode: " + codeData.message); setLoading(false); return; }
      const code = codeData.code;
      localStorage.setItem("mp_code_hint", code);

      // Auto-redeem
      const redeemRes = await fetch("/api/marketplace/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginData.token}` },
        body: JSON.stringify({ code }),
      });
      const redeemData = await redeemRes.json();
      if (!redeemRes.ok) { setError("Gagal redeem: " + redeemData.message); setLoading(false); return; }

      localStorage.setItem("mp_result", JSON.stringify(redeemData));
      onDone();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
      setPhase("");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Login</h2>
        <p className="text-slate-400 text-sm">Masuk untuk klaim redeem Anda</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /></div>
        <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPw ? <FiEyeOff /> : <FiEye />}</button></div>

        {phase && <p className="text-xs text-orange-400 text-center">Sedang memproses redeem...</p>}
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 disabled:opacity-50">
          {loading ? "Memproses..." : "Login & Klaim"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-4">
        Belum punya akun?{" "}
        <button onClick={onRegister} className="text-orange-400 hover:underline">Daftar</button>
      </p>
    </div>
  );
}

/* ── Redeem (manual code entry for logged-in users) ── */

function RedeemStep({ onDone, onLogout }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = (() => { try { return JSON.parse(localStorage.getItem("mp_user") || "{}"); } catch { return {}; } })();

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("mp_token");
      const res = await fetch("/api/marketplace/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { localStorage.clear(); onLogout(); return; }
        setError(data.message);
      } else {
        localStorage.setItem("mp_result", JSON.stringify(data));
        onDone();
      }
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mp_token");
    localStorage.removeItem("mp_user");
    localStorage.removeItem("mp_code_hint");
    localStorage.removeItem("mp_result");
    localStorage.removeItem("mp_phone");
    onLogout();
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-xs font-medium text-slate-300">Halo, {user.name || "User"}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Klaim Redeem</h2>
        <p className="text-slate-400 text-sm">Masukkan kode redeem untuk mendapatkan diskon</p>
      </div>
      <form onSubmit={handleRedeem} className="space-y-3">
        <div className="relative"><FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="SDM-A1B2C3" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/50 uppercase" /></div>
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        <button type="submit" disabled={loading || !code.trim()} className="w-full py-3.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 disabled:opacity-50">
          {loading ? "Memproses..." : "Redeem Sekarang"}
        </button>
      </form>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
        <span className="text-xs text-slate-500">{user.email}</span>
        <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"><FiLogOut /> Logout</button>
      </div>
    </div>
  );
}

/* ── Result ── */

function ResultStep({ onTukarLagi }) {
  const [copied, setCopied] = useState(false);
  const result = (() => { try { return JSON.parse(localStorage.getItem("mp_result") || "{}"); } catch { return {}; } })();

  const handleLogout = () => {
    localStorage.removeItem("mp_token");
    localStorage.removeItem("mp_user");
    localStorage.removeItem("mp_code_hint");
    localStorage.removeItem("mp_result");
    localStorage.removeItem("mp_phone");
    window.location.href = "/marketplace";
  };

  if (!result || !result.code) {
    return (
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center space-y-4">
        <p className="text-slate-400 text-sm">Tidak ada data redeem.</p>
        <button onClick={() => { localStorage.removeItem("mp_result"); onTukarLagi(); }} className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400">Kembali</button>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5">
        <FiCheck className="text-green-400" />
        <span className="text-xs font-medium text-green-300 uppercase">Selamat!</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Kamu Mendapatkan Diskon</h2>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
        {result.image && <img src={result.image} alt={result.product} className="w-full h-48 object-cover" />}
        <div className="p-6 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase">{result.category}</span>
          <h3 className="text-xl font-bold text-white">{result.product}</h3>
          <div className="text-5xl font-bold text-orange-400">{result.discount_percent}% <span className="text-lg text-slate-400 font-normal">OFF</span></div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-slate-400">Kode Redeem:</span>
        <span className="font-mono font-bold text-orange-400 text-lg">{result.code}</span>
        <button onClick={() => { navigator.clipboard.writeText(result.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition">
          {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
        </button>
      </div>

      <p className="text-sm text-slate-400 max-w-sm mx-auto">
        Tunjukkan kode ini ke kasir saat Anda mengunjungi Sidomulyo Advertising & Printing untuk klaim diskon.
      </p>

      <div className="flex justify-center gap-3 pt-2">
        <button onClick={() => { localStorage.removeItem("mp_result"); onTukarLagi(); }} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition">Tukar Lagi</button>
        <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition flex items-center gap-2"><FiLogOut /> Logout</button>
      </div>
    </div>
  );
}
