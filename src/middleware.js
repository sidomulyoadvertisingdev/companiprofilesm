import { defineMiddleware } from "astro/middleware";
import { getSessionAdmin, SESSION_COOKIE } from "./lib/auth.js";
import { initSchema } from "./lib/schema.js";

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  schemaReady = true; // guard against concurrent double-init
  try {
    await initSchema();
  } catch (err) {
    schemaReady = false; // allow retry on next request if it failed
    console.error("[schema] init failed:", err.message);
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, request, locals } = context;
  const path = url.pathname;

  await ensureSchema();

  const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
  locals.admin = admin;

  // Protect admin pages (except the login page)
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!admin) return redirect("/admin/login");
  }

  // Protect mutating API endpoints (anything except GET) except auth routes, analytics, and the public chat bot
  if (path.startsWith("/api")) {
    const isWrite = ["POST", "PUT", "DELETE"].includes(request.method);
    const isAuthRoute = path.startsWith("/api/auth");
    const isAnalyticsRoute = path.startsWith("/api/analytics");
    const isChatRoute = path.startsWith("/api/chat");
    const isContactRoute = path.startsWith("/api/contact");
    const isUploadRoute = path.startsWith("/api/upload");
    const isMarketplacePublic = path.startsWith("/api/marketplace");
    if (isWrite && !isAuthRoute && !isAnalyticsRoute && !isChatRoute && !isContactRoute && !isUploadRoute && !isMarketplacePublic && !admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
