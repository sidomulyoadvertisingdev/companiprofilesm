(function () {
  if (typeof window === "undefined") return;

  const COOKIE = "sb_vid";
  function getVisitorId() {
    const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"));
    if (match) return match[1];
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
    document.cookie = COOKIE + "=" + id + ";path=/;max-age=" + 60 * 60 * 24 * 30 + ";SameSite=Lax;Secure";
    return id;
  }

  function track(type, data) {
    const body = {
      visitorId: getVisitorId(),
      eventType: type,
      pageUrl: location.pathname + location.search,
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
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 }
    );
  }
})();
