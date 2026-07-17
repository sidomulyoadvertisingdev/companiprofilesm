import db from "../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [[services]] = await db.execute("SELECT COUNT(*) c FROM services");
  const [[portfolio]] = await db.execute("SELECT COUNT(*) c FROM portfolio");
  const [[partners]] = await db.execute("SELECT COUNT(*) c FROM partners");
  const data = [
    { id: 1, label: "Layanan", value: services.c, suffix: "+" },
    { id: 2, label: "Proyek Selesai", value: portfolio.c, suffix: "+" },
    { id: 3, label: "Mitra & Klien", value: partners.c, suffix: "+" },
    { id: 4, label: "Kota Terjangkau", value: 15, suffix: "+" },
  ];
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
