import { useState } from "react";
import { FiMapPin, FiNavigation, FiTarget, FiAlertCircle } from "react-icons/fi";

const STORE_COORDS = { lat: -7.3329, lng: 110.5048 };

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

  function handleCheckDistance() {
    if (!navigator.geolocation) {
      setError("Browser Anda tidak mendukung geolokasi.");
      setState("error");
      return;
    }

    setState("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const d = haversine(
          pos.coords.latitude,
          pos.coords.longitude,
          STORE_COORDS.lat,
          STORE_COORDS.lng
        );
        setDistance(d);
        setState("success");
      },
      (err) => {
        let msg = "Tidak dapat mengakses lokasi.";
        if (err.code === 1) msg = "Izin lokasi ditolak. Silakan izinkan akses lokasi.";
        else if (err.code === 2) msg = "Lokasi tidak tersedia.";
        else if (err.code === 3) msg = "Waktu permintaan lokasi habis.";
        setError(msg);
        setState("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <section className="py-24 bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <FiTarget className="text-2xl text-[#1d1d1f]" />
            <h2 className="text-2xl font-semibold">
              Cek Jarak ke Percetakan Terdekat
            </h2>
          </div>
          <p className="text-[#6e6e73] mb-8">
            Klik tombol di bawah untuk mengecek jarak dari lokasi Anda ke
            Sidomulyo Advertising di Jl. Kartini No.108, Salatiga.
          </p>

          <button
            onClick={handleCheckDistance}
            disabled={state === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] text-white px-8 py-4 text-sm font-medium hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiNavigation />
            {state === "loading"
              ? "Mendeteksi lokasi..."
              : "Cek Jarak dari Lokasi Saya"}
          </button>

          {state === "success" && distance !== null && (
            <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-lg font-medium text-green-800 flex items-center gap-2">
                <FiMapPin className="text-green-600" />
                Jarak: {distance < 1
                  ? `${Math.round(distance * 1000)} meter`
                  : `${distance.toFixed(1)} km`}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {distance < 1
                  ? "Anda sangat dekat! Silakan mampir ke lokasi kami."
                  : distance < 10
                    ? "Cukup dekat! Silakan kunjungi atau hubungi kami."
                    : "Kami siap melayani Anda via WhatsApp untuk pemesanan jarak jauh."}
              </p>
            </div>
          )}

          {state === "error" && error && (
            <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-200">
              <p className="text-red-800 flex items-center gap-2">
                <FiAlertCircle className="text-red-600" />
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
