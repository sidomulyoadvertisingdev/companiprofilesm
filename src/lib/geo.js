const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

export async function lookupIP(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { city: "", region: "", country: "", latitude: null, longitude: null };
  }
  const cached = cache.get(ip);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon`, {
      signal: AbortSignal.timeout(3000),
    });
    const d = await res.json();
    if (d.status === "success") {
      const data = {
        city: d.city || "",
        region: d.regionName || "",
        country: d.country || "",
        latitude: d.lat || null,
        longitude: d.lon || null,
      };
      cache.set(ip, { data, ts: Date.now() });
      return data;
    }
  } catch (e) { void e; }
  return { city: "", region: "", country: "", latitude: null, longitude: null };
}

export function getClientIP(request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = request.headers.get("x-real-ip");
  if (xr) return xr;
  return "127.0.0.1";
}
