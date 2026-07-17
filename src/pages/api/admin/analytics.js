import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import { getAnalyticsSnapshot } from "../../../lib/analytics.js";

export const prerender = false;

export async function GET({ url, cookies }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const range = url.searchParams.get("range") || "30d";
    const snapshot = await getAnalyticsSnapshot(range);
    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
