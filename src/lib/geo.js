const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

export async function lookupIP(ip) {
  if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
    return { city: "", region: "", country: "", latitude: null, longitude: null };
  }
  const cached = cache.get(ip);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const providers = [
    `https://api.bigdatacloud.net/data/ip-geolocation-client?ip=${encodeURIComponent(ip)}&localityLanguage=id`,
    `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
  ];

  for (const url of providers) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const d = await res.json();
      if (d.error || d.status === "fail" || d.status === 403) continue;
      const data = {
        city: d.city || d.locality || "",
        region: d.region || d.principalSubdivision || "",
        country: d.country_name || d.countryName || "",
        latitude: d.latitude ?? d.lat ?? null,
        longitude: d.longitude ?? d.lon ?? null,
      };
      if (!data.city && !data.region && !data.country) continue;
      cache.set(ip, { data, ts: Date.now() });
      return data;
    } catch {
      /* try next provider */
    }
  }
  return { city: "", region: "", country: "", latitude: null, longitude: null };
}

export function getClientIP(request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const xr = request.headers.get("x-real-ip");
  if (xr) return xr;
  return "127.0.0.1";
}

// Reverse-geocode GPS coordinates to an accurate city/region/country.
// Uses BigDataCloud's free client API (no API key required). Returns the
// same shape as lookupIP so callers can treat both uniformly.
export async function reverseGeocode(latitude, longitude) {
  if (latitude == null || longitude == null) {
    return { city: "", region: "", country: "", latitude, longitude };
  }
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const d = await res.json();
    return {
      city: d.city || d.locality || "",
      region: d.principalSubdivision || d.principalSubdivisionCode || "",
      country: d.countryName || "",
      latitude,
      longitude,
    };
  } catch {
    return { city: "", region: "", country: "", latitude, longitude };
  }
}
