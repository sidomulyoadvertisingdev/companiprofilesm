import { defineMiddleware } from "astro/middleware";
import { getSessionAdmin, SESSION_COOKIE } from "./lib/auth.js";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, request, locals } = context;
  const path = url.pathname;

  const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
  locals.admin = admin;

  // Protect admin pages (except the login page)
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!admin) return redirect("/admin/login");
  }

  // Protect mutating API endpoints (anything except GET) except auth routes
  if (path.startsWith("/api")) {
    const isWrite = ["POST", "PUT", "DELETE"].includes(request.method);
    const isAuthRoute = path.startsWith("/api/auth");
    if (isWrite && !isAuthRoute && !admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
