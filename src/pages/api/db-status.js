import db from "../../lib/db.js";

export const prerender = false;

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT 1 AS ok");
    return new Response(JSON.stringify({ status: "ok", db: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: "error", message: err.message, code: err.code }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
