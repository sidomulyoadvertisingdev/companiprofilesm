import { useState } from "react";
import { FiPhone } from "react-icons/fi";

export default function MarketplaceForm() {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    localStorage.setItem("mp_phone", phone.trim());
    window.location.href = "/marketplace/claim";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 max-w-md mx-auto">
      <div className="relative w-full">
        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="tel"
          placeholder="Masukkan nomor handphone Anda"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full pl-11 pr-5 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
        />
      </div>

      <button
        type="submit"
        disabled={!phone.trim()}
        className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-400 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Klaim Kode Redeem
      </button>

      <p className="text-xs text-slate-500">
        Masukkan nomor handphone untuk mendapatkan kode redeem diskon.
      </p>
    </form>
  );
}
