(function () {
  if (typeof window === "undefined") return;

  const COOKIE = "sb_vid";

  function getCookieId() {
    const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"));
    if (match) return match[1];
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
    document.cookie = COOKIE + "=" + id + ";path=/;max-age=" + 60 * 60 * 24 * 30 + ";SameSite=Lax;Secure";
    return id;
  }

  // Keep the visitor id stable even when fingerprint loading finishes after
  // the first pageview or location request.
  let fingerprintId = null;
  const visitorId = getCookieId();
  function getVisitorId() {
    return visitorId;
  }

  const promoMatch = location.pathname.match(/^\/promo\/([^/]+)/);
  const campaignSlug = promoMatch ? decodeURIComponent(promoMatch[1]) : "";
  const pageUrl = location.pathname + location.search;
  const utm = new URLSearchParams(location.search);

  async function initFingerprint() {
    try {
      const fp = await import("https://openfpcdn.io/fingerprintjs/v4");
      const agent = await fp.load();
      const result = await agent.get();
      fingerprintId = result.visitorId;
    } catch {
      /* keep cookie fallback */
    }
  }
  initFingerprint();

  function track(type, data) {
    const body = {
      visitorId: getVisitorId(),
      fingerprint: fingerprintId,
      eventType: type,
      pageUrl,
      campaign: campaignSlug,
      utmSource: utm.get("utm_source") || "",
      utmMedium: utm.get("utm_medium") || "",
      utmCampaign: utm.get("utm_campaign") || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      locale: navigator.language || "",
      screenWidth: screen.width,
      screenHeight: screen.height,
      ...data,
    };
    if (campaignSlug && type === "pageview") {
      return fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    }
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {});
    }
  }

  const pageviewReady = track("pageview");

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    track("click", {
      elementTarget: el.getAttribute("data-track") || el.tagName.toLowerCase(),
      elementText: (el.textContent || "").trim().slice(0, 100),
    });
  });

  window.sidomulyoTrackLocation = function (latitude, longitude) {
    return Promise.resolve(pageviewReady).then(() => fetch("/api/analytics/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), pageUrl, latitude, longitude }),
    })).catch(() => {});
  };

  function requestLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        window.sidomulyoTrackLocation(pos.coords.latitude, pos.coords.longitude);
      },
      function () {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 }
    );
  }

  if (campaignSlug) {
    // The promo form owns the permission prompt. Reuse permission if granted.
    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: "geolocation" }).then((permission) => {
        if (permission.state === "granted") requestLocation();
      }).catch(() => {});
    }
  } else {
    requestLocation();
  }
})();
