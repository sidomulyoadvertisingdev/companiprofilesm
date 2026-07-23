import { useState, useEffect, useRef } from "react";
import {
  FiCheck, FiCopy, FiUser, FiMail, FiPhone,
  FiMapPin, FiLock, FiEye, FiEyeOff, FiLogOut, FiArrowLeft, FiTag,
} from "react-icons/fi";

function TurnstileWidget({ siteKey, onVerify }) {
  const ref = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;

    const renderWidget = () => {
      if (window.turnstile && ref.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onVerify,
          theme: "dark",
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch {}
        widgetId.current = null;
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={ref} className="flex justify-center" />;
}

export default function MarketplaceClaim({ turnstileSiteKey = "" }) {
  const [step, setStep] = useState("register");
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("mp_result");
    const t = localStorage.getItem("mp_token");
    if (r) { setStep("result"); return; }
    if (t) { setStep("claiming"); return; }
  }, []);

  const goRegister = () => setStep("register");
  const goLogin = () => setStep("login");
  const goResult = () => setStep("result");
  const goClaiming = () => setStep("claiming");
  const goVerify = (email) => { setPendingEmail(email); setStep("verify"); };

  if (step === "result") return <ResultStep />;
  if (step === "claiming") return <ClaimingStep onDone={goResult} onFallback={goRegister} />;
  if (step === "verify") return <EmailVerifyStep email={pendingEmail} onVerified={goClaiming} onBack={goRegister} />;
  if (step === "login") return <LoginStep onDone={goClaiming} onRegister={goRegister} turnstileSiteKey={turnstileSiteKey} />;
  return <RegisterStep onVerified={goVerify} onLogin={goLogin} turnstileSiteKey={turnstileSiteKey} />;
}

/* ── Register ── */

function RegisterStep({ onVerified, onLogin, turnstileSiteKey }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locStatus, setLocStatus] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("ok");
      },
      () => { setLocStatus("denied"); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const regRes = await fetch("/api/marketplace/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, latitude: location.lat, longitude: location.lng, turnstileToken }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) { setError(regData.message); setLoading(false); return; }

      setPhase("send-email");
      const verifyRes = await fetch("/api/marketplace/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: form.email, turnstileToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) { setError(verifyData.message); setLoading(false); return; }

      onVerified(form.email);
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
        <div className="relative"><FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Nama Lengkap" value={form.name} onChange={set("name")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
        <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" placeholder="Email" value={form.email} onChange={set("email")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
        <div className="relative"><FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="tel" placeholder="Nomor Handphone" value={form.phone} onChange={set("phone")} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
        <div className="relative"><FiMapPin className="absolute left-4 top-3.5 text-slate-500" /><textarea placeholder="Alamat Lengkap" value={form.address} onChange={set("address")} rows={2} className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" /></div>

        {locStatus === "ok" && <p className="text-xs text-green-400 flex items-center gap-1"><FiMapPin /> Lokasi GPS berhasil dideteksi</p>}
        {locStatus === "denied" && <p className="text-xs text-yellow-400 flex items-center gap-1"><FiMapPin /> Izin lokasi ditolak (opsional)</p>}
        {locStatus === "loading" && <p className="text-xs text-blue-400 flex items-center gap-1"><FiMapPin /> Mendeteksi lokasi...</p>}

        <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={set("password")} required className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPw ? <FiEyeOff /> : <FiEye />}</button></div>

        {phase && <p className="text-xs text-blue-400 text-center">Mengirim kode verifikasi...</p>}
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        {turnstileSiteKey && (
          <div className="py-2">
            <TurnstileWidget siteKey={turnstileSiteKey} onVerify={setTurnstileToken} />
          </div>
        )}

        <button type="submit" disabled={loading || (turnstileSiteKey && !turnstileToken)} className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 disabled:opacity-50">
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-4">
        Sudah punya akun? <button onClick={onLogin} className="text-blue-400 hover:underline">Login</button>
      </p>
    </div>
  );
}

/* ── Email Verification ── */

function EmailVerifyStep({ email, onVerified, onBack }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.trim().length !== 6) { setError("Kode harus 6 digit"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/marketplace/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      if (data.token) localStorage.setItem("mp_token", data.token);
      if (data.user) localStorage.setItem("mp_user", JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => onVerified(), 1200);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/marketplace/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message);
      else setResendCooldown(60);
    } catch {
      setError("Gagal mengirim ulang");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition">
        <FiArrowLeft /> Kembali
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <FiMail className="text-2xl text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Verifikasi Email</h2>
        <p className="text-slate-400 text-sm">Kode verifikasi 6 digit telah dikirim ke</p>
        <p className="text-white text-sm font-medium mt-1">{email}</p>
      </div>

      {success ? (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
            <FiCheck className="text-3xl text-green-400" />
          </div>
          <p className="text-green-400 font-medium">Email berhasil diverifikasi!</p>
          <p className="text-slate-400 text-sm">Menyiapkan kode redeem Anda...</p>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex justify-center gap-2">
            {[0,1,2,3,4,5].map((i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  const newCode = code.split("");
                  newCode[i] = val;
                  setCode(newCode.join("").slice(0, 6));
                  if (val && e.target.nextElementSibling) e.target.nextElementSibling.focus();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !code[i] && e.target.previousElementSibling) {
                    e.target.previousElementSibling.focus();
                  }
                }}
                className="w-12 h-14 text-center text-xl font-mono font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button type="submit" disabled={loading || code.trim().length !== 6} className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 disabled:opacity-50">
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>
      )}

      {!success && (
        <p className="text-center text-xs text-slate-500 mt-4">
          Tidak menerima kode?{" "}
          {resendCooldown > 0 ? (
            <span className="text-slate-600">Kirim ulang dalam {resendCooldown}s</span>
          ) : (
            <button onClick={handleResend} disabled={resending} className="text-blue-400 hover:underline">
              {resending ? "Mengirim..." : "Kirim Ulang"}
            </button>
          )}
        </p>
      )}
    </div>
  );
}

/* ── Claiming (auto-claim kode redeem) ── */

function ClaimingStep({ onDone, onFallback }) {
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const claim = async () => {
      const token = localStorage.getItem("mp_token");
      if (!token) { onFallback(); return; }

      try {
        const res = await fetch("/api/marketplace/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.message || "Gagal mengambil kode redeem");
          return;
        }

        localStorage.setItem("mp_result", JSON.stringify(data));
        onDone();
      } catch {
        if (!cancelled) setError("Gagal menghubungi server");
      }
    };

    claim();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center space-y-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400">Coba Lagi</button>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
      <p className="text-slate-400 text-sm">Menyiapkan kode redeem Anda...</p>
    </div>
  );
}

/* ── Login ── */

function LoginStep({ onDone, onRegister, turnstileSiteKey }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNeedsVerification(false);
    try {
      const loginRes = await fetch("/api/marketplace/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, turnstileToken }),
      });
      const loginData = await loginRes.json();

      if (loginRes.status === 403 && loginData.needsVerification) {
        setNeedsVerification(true);
        setLoading(false);
        return;
      }

      if (!loginRes.ok) { setError(loginData.message); setLoading(false); return; }
      localStorage.setItem("mp_token", loginData.token);
      localStorage.setItem("mp_user", JSON.stringify(loginData.user));

      onDone();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
          <FiMail className="text-2xl text-yellow-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Email Belum Diverifikasi</h2>
        <p className="text-slate-400 text-sm">Silakan cek inbox email Anda untuk kode verifikasi.</p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={() => setNeedsVerification(false)} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition">Kembali</button>
          <button onClick={onRegister} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 transition">Daftar Baru</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Login</h2>
        <p className="text-slate-400 text-sm">Masuk untuk melihat kode redeem Anda</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative"><FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
        <div className="relative"><FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPw ? <FiEyeOff /> : <FiEye />}</button></div>

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        {turnstileSiteKey && (
          <div className="py-2">
            <TurnstileWidget siteKey={turnstileSiteKey} onVerify={setTurnstileToken} />
          </div>
        )}

        <button type="submit" disabled={loading || (turnstileSiteKey && !turnstileToken)} className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 disabled:opacity-50">
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
      <p className="text-center text-xs text-slate-500 mt-4">
        Belum punya akun? <button onClick={onRegister} className="text-blue-400 hover:underline">Daftar</button>
      </p>
    </div>
  );
}

/* ── Result ── */

function ResultStep() {
  const [copied, setCopied] = useState(false);
  const result = (() => { try { return JSON.parse(localStorage.getItem("mp_result") || "{}"); } catch { return {}; } })();

  const handleDone = () => {
    localStorage.removeItem("mp_token");
    localStorage.removeItem("mp_user");
    localStorage.removeItem("mp_result");
    window.location.href = "/marketplace";
  };

  if (!result || !result.code) {
    return (
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center space-y-4">
        <p className="text-slate-400 text-sm">Tidak ada data redeem.</p>
        <button onClick={handleDone} className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400">Kembali</button>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-6 text-center space-y-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 animate-fade-in">
        <FiCheck className="text-green-400" />
        <span className="text-xs font-medium text-green-300 uppercase">Selamat!</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight animate-fade-in">Kode Redeem Anda</h2>

      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm animate-fade-in">
        {result.image && <img src={result.image} alt={result.product} className="w-full h-48 object-cover" />}
        <div className="p-6 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase">{result.category}</span>
          <h3 className="text-xl font-bold text-white">{result.product}</h3>
          <div className="text-5xl font-bold text-blue-400">{result.discount_percent}% <span className="text-lg text-slate-400 font-normal">OFF</span></div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 space-y-3 animate-fade-in">
        <p className="text-yellow-300 text-sm font-semibold">Penting! Simpan kode ini baik-baik</p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono font-bold text-blue-400 text-2xl tracking-wider">{result.code}</span>
          <button onClick={() => { navigator.clipboard.writeText(result.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition">
            {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
          </button>
        </div>
        <p className="text-xs text-yellow-200/60">Kode ini bersifat pribadi, jangan bagikan ke siapapun.</p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 text-left space-y-3 animate-fade-in">
        <h4 className="text-sm font-semibold text-blue-300">Cara Menggunakan:</h4>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <FiCheck className="text-blue-400 mt-0.5 shrink-0" />
            <span>Kode ini akan berlaku saat <strong className="text-white">marketplace Sidomulyo resmi diluncurkan</strong>.</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-blue-400 mt-0.5 shrink-0" />
            <span>Login menggunakan <strong className="text-white">email yang sudah didaftarkan</strong> untuk mengklaim diskon.</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="text-blue-400 mt-0.5 shrink-0" />
            <span>Tunjukkan kode ini ke kasir saat mengunjungi <strong className="text-white">Sidomulyo Advertising & Printing</strong>.</span>
          </li>
        </ul>
      </div>

      <button onClick={handleDone} className="w-full py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 animate-fade-in transition">
        Selesai
      </button>
    </div>
  );
}
