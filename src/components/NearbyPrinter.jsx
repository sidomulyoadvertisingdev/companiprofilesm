import { useState } from "react";
import { FiMapPin, FiNavigation, FiTarget, FiAlertCircle, FiCheckCircle, FiExternalLink } from "react-icons/fi";

const STORE_COORDS = { lat: -7.3329, lng: 110.5048 };
const MAPS_ROUTE_URL = "https://www.google.com/maps/dir/?api=1&destination=-7.3329,110.5048";

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyPrinter() {
  const [state, setState] = useState("idle");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const [userCoords, setUserCoords] = useState(null);

  function handleCheckDistance() {
    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung geolokasi GPS.");
      setState("error");
      return;
    }

    setState("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserCoords({ lat: userLat, lng: userLng });

        const d = haversine(userLat, userLng, STORE_COORDS.lat, STORE_COORDS.lng);
        setDistance(d);
        setState("success");
      },
      (err) => {
        let msg = "Gagal mendeteksi lokasi otomatis.";
        if (err.code === 1) msg = "Izin lokasi GPS ditolak di browser Anda. Silakan aktifkan izin lokasi.";
        else if (err.code === 2) msg = "Sinyal GPS lokasi tidak tersedia saat ini.";
        else if (err.code === 3) msg = "Waktu permintaan geolokasi habis. Silakan coba lagi.";
        setError(msg);
        setState("error");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <section className="py-20 md:py-28 bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white dark:bg-white/[0.03] rounded-3xl p-8 md:p-12 border border-slate-200/80 dark:border-white/[0.08] shadow-xl text-center space-y-6">
          
          <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center text-2xl shadow-inner">
            <FiTarget />
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 dark:text-blue-500 mb-2 block">
              Deteksi Geolocation GPS Otomatis
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cek Jarak Real-Time dari Lokasi Anda
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto leading-relaxed">
              Gunakan GPS perangkat Anda untuk mengukur jarak fisik ke kantor pusat & workshop Sidomulyo Advertising (Jl. Kartini No.108, Salatiga).
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCheckDistance}
              disabled={state === "loading"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/25 transition disabled:opacity-50"
            >
              <FiNavigation className="text-base" />
              <span>{state === "loading" ? "Mendeteksi Koordinat GPS..." : "Deteksi Lokasi Saya Sekarang"}</span>
            </button>

            <a
              href={MAPS_ROUTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/20 hover:border-slate-400 bg-white/50 dark:bg-white/5 text-slate-800 dark:text-white px-7 py-4 text-xs font-semibold uppercase tracking-wider transition"
            >
              <span>Navigasi Google Maps</span>
              <FiExternalLink />
            </a>
          </div>

          {/* SUCCESS RESULT */}
          {state === "success" && distance !== null && (
            <div className="mt-8 p-6 md:p-8 bg-blue-50/80 dark:bg-blue-500/10 rounded-3xl border border-blue-200 dark:border-blue-500/20 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Status Deteksi GPS: Berhasil
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                  <FiCheckCircle /> Koordinat Terkunci
                </span>
              </div>

              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FiMapPin className="text-blue-600 shrink-0" />
                <span>Jarak ke Sidomulyo HQ: {distance < 1 ? `${Math.round(distance * 1000)} Meter` : `${distance.toFixed(2)} KM`}</span>
              </p>

              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {distance < 2
                  ? "📍 Lokasi Anda sangat dekat dengan workshop kami di Jl. Kartini No.108! Anda bisa langsung berkunjung atau tim kami siap melakukan survey ke tempat Anda."
                  : distance < 25
                  ? "🚗 Lokasi Anda dalam jangkauan layanan pengiriman & pemasangan langsung tim operasional Sidomulyo Advertising."
                  : "✈️ Lokasi Anda berada di luar area lokal Salatiga. Kami melayani pengiriman produk advertising & branding ke seluruh wilayah Indonesia!"}
              </p>
            </div>
          )}

          {/* ERROR RESULT */}
          {state === "error" && error && (
            <div className="mt-8 p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-200 dark:border-red-500/20 text-left flex items-start gap-3">
              <FiAlertCircle className="text-red-600 dark:text-red-400 text-xl shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 mb-1">Gagal Mendeteksi Izin GPS</h4>
                <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
