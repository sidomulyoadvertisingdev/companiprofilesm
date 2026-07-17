import db from "../../lib/db.js";

export const prerender = false;

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SDM-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET() {
  const [rows] = await db.execute(
    "SELECT id, phone, code, redeemed, redeemed_at, created_at FROM marketplace_codes ORDER BY created_at DESC"
  );
  return new Response(JSON.stringify({ data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const { phone } = await request.json();

  if (!phone || phone.trim().length < 8) {
    return new Response(JSON.stringify({ message: "Nomor handphone tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cleanPhone = phone.replace(/\D/g, "");

  const [[existing]] = await db.execute(
    "SELECT code FROM marketplace_codes WHERE phone = ?",
    [cleanPhone]
  );
  if (existing) {
    return new Response(JSON.stringify({ code: existing.code, message: "Anda sudah memiliki kode" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  let code;
  let tries = 0;
  do {
    code = generateCode();
    tries++;
  } while (tries < 10);

  await db.execute(
    "INSERT INTO marketplace_codes (phone, code) VALUES (?, ?)",
    [cleanPhone, code]
  );

  return new Response(JSON.stringify({ code, message: "Kode redeem berhasil dibuat!" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
