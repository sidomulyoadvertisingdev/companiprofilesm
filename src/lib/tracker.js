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

  // Lightweight stable fingerprint (avoids async external loading).
  function getFingerprint() {
    try {
      const parts = [
        navigator.userAgent,
        navigator.language,
        String(screen.width) + "x" + String(screen.height),
        String(new Date().getTimezoneOffset()),
        String(navigator.hardwareConcurrency || 0),
        (navigator.platform || ""),
      ];
      const str = parts.join("|");
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return "fp_" + (hash >>> 0).toString(16);
    } catch {
      return "";
    }
  }

  // Capture campaign from /lp/[slug] path or UTM params.
  function getCampaignContext() {
    const ctx = { campaign: "", utmSource: "", utmMedium: "", utmCampaign: "" };
    const params = new URLSearchParams(location.search);
    ctx.utmSource = params.get("utm_source") || "";
    ctx.utmMedium = params.get("utm_medium") || "";
    ctx.utmCampaign = params.get("utm_campaign") || "";
    const lpMatch = location.pathname.match(/^\/lp\/([^/]+)/);
    if (lpMatch) {
      ctx.campaign = lpMatch[1];
    } else if (ctx.utmCampaign) {
      ctx.campaign = ctx.utmCampaign;
    }
    return ctx;
  }

  const fingerprint = getFingerprint();
  const campaignCtx = getCampaignContext();
  const clientMeta = {
    fingerprint,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    locale: navigator.language || "",
    ...campaignCtx,
  };

  const startTime = Date.now();

  function track(type, data) {
    const body = {
      visitorId: getVisitorId(),
      eventType: type,
      pageUrl: location.pathname + location.search,
      screenWidth: screen.width,
      screenHeight: screen.height,
      ...clientMeta,
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

  // Scroll depth (throttled, fires at 25/50/75/100% thresholds).
  const scrollFired = new Set();
  let scrollTick = false;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      scrollTick = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      const thresholds = [25, 50, 75, 100];
      for (const t of thresholds) {
        if (pct >= t && !scrollFired.has(t)) {
          scrollFired.add(t);
          track("scroll", { elementTarget: "scroll-depth", elementText: String(t) });
        }
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Form submit tracking.
  document.addEventListener("submit", function (e) {
    const form = e.target.closest("form[data-track-form]");
    if (!form) return;
    track("click", {
      elementTarget: "form-submit",
      elementText: form.getAttribute("data-track-form") || "form",
      formSubmitted: 1,
    });
  });

  // Time on page (send before unload).
  function sendDuration() {
    const duration = Date.now() - startTime;
    track("pageview", { durationMs: duration, elementTarget: "page-duration" });
  }
  window.addEventListener("pagehide", sendDuration);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") sendDuration();
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
