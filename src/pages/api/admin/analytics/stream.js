import { getSessionAdmin, SESSION_COOKIE } from "../../../../lib/auth.js";
import { getAnalyticsSnapshot } from "../../../../lib/analytics.js";

export const prerender = false;

// How often the server checks the DB for changes. Only pushes to the client
// when something actually changed, so the browser never polls on its own.
const POLL_MS = Number(process.env.SSE_INTERVAL_MS || 4000);

export async function GET({ url, cookies, request }) {
  const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
  if (!admin) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const range = url.searchParams.get("range") || "30d";

  const body = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      // We stream via the raw Node response when available; Astro's Web
      // ReadableStream is used here and the adapter writes it through.
      const writer = controller;
      const push = (event, data) => writer.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      // Initial snapshot immediately so the UI fills without a manual fetch.
      try {
        const snap = await getAnalyticsSnapshot(range);
        push("snapshot", snap);
        var lastSignature = JSON.stringify([snap.maxEventId, snap.summary.totalVisits, snap.summary.totalClicks]);
        var lastMaxId = snap.maxEventId;
      } catch (err) {
        push("error", { message: err.message });
        writer.close();
        return;
      }

      const interval = setInterval(async () => {
        try {
          const snap = await getAnalyticsSnapshot(range);
          const sig = JSON.stringify([snap.maxEventId, snap.summary.totalVisits, snap.summary.totalClicks]);
          if (sig === lastSignature) return; // nothing changed, skip

          const newEvents = snap.maxEventId > lastMaxId
            ? await fetchNewEvents(lastMaxId)
            : [];

          push("snapshot", snap);
          if (newEvents.length) push("events", newEvents);
          lastSignature = sig;
          lastMaxId = snap.maxEventId;
        } catch {
          // swallow transient DB errors; next tick will retry
        }
      }, POLL_MS);

      const onAbort = () => {
        clearInterval(interval);
        try { writer.close(); } catch { /* already closed */ }
      };
      request.signal.addEventListener("abort", onAbort);

      // Heartbeat keeps proxies from buffering/closing the idle connection.
      const heartbeat = setInterval(() => {
        try { writer.enqueue(encoder.encode(`: ping\n\n`)); } catch { /* closed */ }
      }, 25000);
      request.signal.addEventListener("abort", () => clearInterval(heartbeat));
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function fetchNewEvents(afterId) {
  const db = (await import("../../../../lib/db.js")).default;
  const [rows] = await db.execute(
    `SELECT id, visitor_id, event_type, page_url, element_target, element_text, city, region, country, device_type, browser, os, created_at
     FROM analytics_events WHERE id > ? ORDER BY id ASC LIMIT 50`, [afterId]
  );
  return rows;
}
