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

  // Stable device ID via fingerprint (no permission needed). Falls back to cookie.
  let fingerprintId = null;
  function getVisitorId() {
    if (fingerprintId) return fingerprintId;
    return getCookieId();
  }

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
      pageUrl: location.pathname + location.search,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      locale: navigator.language || "",
      screenWidth: screen.width,
      screenHeight: screen.height,
      ...data,
    };
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

  track("pageview");

  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    track("click", {
      elementTarget: el.getAttribute("data-track") || el.tagName.toLowerCase(),
      elementText: (el.textContent || "").trim().slice(0, 100),
    });
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        fetch("/api/analytics/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        }).catch(() => {});
      },
      function () {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 600000 }
    );
  }
})();
