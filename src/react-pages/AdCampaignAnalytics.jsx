import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiUsers, FiEye, FiFileText, FiTrendingUp, FiExternalLink } from "react-icons/fi";
import { loadGoogleMaps } from "../lib/google-maps-client.js";

const number = (value) => Number(value || 0).toLocaleString("id-ID");

function Stat({ icon, label, value, hint }) {
  const Icon = icon;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Icon className="text-blue-700" /> {label}</div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function CampaignMap({ points, leadPoints, apiKey }) {
  const mapRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if ((!points.length && !leadPoints.length) || !apiKey || !mapRef.current) return;
    let cancelled = false;
    setError("");
    loadGoogleMaps(apiKey).then((maps) => {
      if (cancelled || !mapRef.current) return;
      const map = new maps.Map(mapRef.current, {
        center: { lat: -2.5, lng: 118 },
        zoom: 4,
        scrollwheel: false,
        mapTypeControl: false,
        streetViewControl: false,
      });
      const bounds = new maps.LatLngBounds();
      const infoWindow = new maps.InfoWindow();
      for (const point of points) {
        const lat = Number(point.latitude);
        const lng = Number(point.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
        const position = { lat, lng };
        const gps = point.location_source === "gps";
        const marker = new maps.Marker({
          map,
          position,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: gps ? "#2563eb" : "#94a3b8",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => {
          const content = document.createElement("div");
          content.style.cssText = "font-size:12px;min-width:140px;line-height:1.6";
          const title = document.createElement("strong");
          title.textContent = [point.city, point.region].filter(Boolean).join(", ") || "Lokasi pengunjung";
          content.append(title, document.createElement("br"));
          content.append(document.createTextNode(gps ? "GPS perangkat" : "Perkiraan lokasi IP"));
          infoWindow.setContent(content);
          infoWindow.open({ map, anchor: marker });
        });
        bounds.extend(position);
      }
      for (const lead of leadPoints) {
        const position = { lat: Number(lead.latitude), lng: Number(lead.longitude) };
        const marker = new maps.Marker({
          map,
          position,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#16a34a",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => {
          const content = document.createElement("div");
          content.style.cssText = "font-size:12px;min-width:160px;line-height:1.6";
          const title = document.createElement("strong");
          title.textContent = lead.name || "SPPG";
          content.append(title, document.createElement("br"));
          content.append(document.createTextNode(lead.address || "Alamat tidak tersedia"));
          infoWindow.setContent(content);
          infoWindow.open({ map, anchor: marker });
        });
        bounds.extend(position);
      }
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom() > 11) map.setZoom(11);
        });
      }
    }).catch(() => {
      if (!cancelled) setError("Google Maps belum dapat dimuat. Periksa konfigurasi API key.");
    });
    return () => { cancelled = true; };
  }, [points, leadPoints, apiKey]);

  if (!apiKey) return <div className="grid h-72 place-items-center rounded-xl bg-slate-100 px-4 text-center text-sm text-slate-500">GOOGLE_MAPS_API_KEY belum diatur di server.</div>;
  if (!points.length && !leadPoints.length) return <div className="grid h-72 place-items-center rounded-xl bg-slate-100 px-4 text-center text-sm text-slate-500">Belum ada koordinat pengunjung dari landing page ini.</div>;
  return (
    <div className="relative">
      <div ref={mapRef} className="h-72 w-full rounded-xl bg-slate-100" />
      {error && <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/90 px-4 text-center text-sm text-red-600">{error}</div>}
    </div>
  );
}

export default function AdCampaignAnalytics({ googleMapsApiKey, onOpenLeads }) {
  const [campaignId, setCampaignId] = useState("");
  const [range, setRange] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ range });
    if (campaignId) params.set("campaignId", campaignId);
    setLoading(true);
    setError("");
    fetch(`/api/admin/ad-campaign-analytics?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Analisa iklan gagal dimuat.");
        return result;
      })
      .then(setData)
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [campaignId, range]);

  const summary = data?.summary;
  const maxDaily = Math.max(1, ...(data?.daily || []).map((row) => row.visits));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analisa Iklan</h2>
          <p className="mt-1 text-sm text-slate-500">Kunjungan dan leads dari landing page promo yang dipilih.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Pilih campaign" value={campaignId || data?.campaign?.id || ""} onChange={(e) => setCampaignId(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
            {(data?.campaigns || []).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <select aria-label="Rentang analisa" value={range} onChange={(e) => setRange(e.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="7d">7 hari</option><option value="30d">30 hari</option><option value="90d">90 hari</option><option value="all">Semua waktu</option>
          </select>
        </div>
      </div>

      {loading && <p className="rounded-xl bg-white p-5 text-sm text-slate-500">Memuat analisa...</p>}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && !data?.campaign && <p className="rounded-xl bg-white p-5 text-sm text-slate-500">Belum ada campaign.</p>}
      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat icon={FiEye} label="Kunjungan" value={number(summary.visits)} hint="Tayangan landing page" />
            <Stat icon={FiUsers} label="Pengunjung" value={number(summary.visitors)} hint="Pengunjung unik" />
            <Stat icon={FiFileText} label="SPPG Mengisi Form" value={number(summary.leads)} hint="Leads campaign ini" />
            <Stat icon={FiTrendingUp} label="Rasio Leads" value={`${summary.conversion}%`} hint="Leads ÷ pengunjung unik" />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900">Peta Pengunjung Landing Page</h3>
                <a href={`/promo/${data.campaign.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Lihat landing page <FiExternalLink /></a>
              </div>
              <CampaignMap points={data.points || []} leadPoints={data.leadPoints || []} apiKey={googleMapsApiKey} />
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> GPS (izin lokasi)</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-400" /> IP (perkiraan)</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-600" /> SPPG mengisi form</span>
                <span>{number(data.points?.length)} pengunjung · {number(data.leadPoints?.length)} SPPG</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Asal Pengunjung</h3>
              {(data.cities || []).length ? data.cities.map((city, index) => (
                <div key={`${city.city}-${city.region}-${index}`} className="flex items-start justify-between gap-3 border-b border-slate-100 py-2.5 text-sm last:border-0">
                  <span className="flex items-start gap-2"><FiMapPin className="mt-0.5 shrink-0 text-blue-700" /> <span>{city.city}{city.region ? `, ${city.region}` : ""}</span></span>
                  <strong>{number(city.visitors)}</strong>
                </div>
              )) : <p className="text-sm text-slate-500">Belum ada data kota.</p>}
              <p className="mt-4 text-xs leading-relaxed text-slate-500">Lokasi IP hanya perkiraan. GPS tersedia setelah pengunjung memberi izin.</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">Kunjungan Harian</h3>
              {(data.daily || []).length ? (
                <div className="space-y-2.5">
                  {data.daily.map((day) => (
                    <div key={day.date} className="grid grid-cols-[75px_1fr_35px] items-center gap-2 text-xs">
                      <span className="text-slate-500">{new Date(`${day.date}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max((day.visits / maxDaily) * 100, 3)}%` }} /></div>
                      <strong className="text-right">{number(day.visits)}</strong>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500">Belum ada kunjungan.</p>}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2"><h3 className="font-bold text-slate-900">SPPG Terbaru</h3><button type="button" onClick={onOpenLeads} className="text-xs font-semibold text-blue-700">Lihat semua leads</button></div>
              {(data.recentLeads || []).length ? data.recentLeads.map((lead) => (
                <div key={lead.id} className="border-b border-slate-100 py-2.5 last:border-0">
                  <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{lead.address || lead.city || "Alamat belum tersedia"}</p>
                </div>
              )) : <p className="text-sm text-slate-500">Belum ada SPPG yang mengisi formulir.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
