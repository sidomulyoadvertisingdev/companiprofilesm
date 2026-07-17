import { getSite, getServices } from "../../lib/queries.js";

export const prerender = false;

function cleanHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function buildSystemPrompt() {
  let ctx = "";
  try {
    const [site, services] = await Promise.all([getSite(), getServices()]);
    if (site) {
      ctx += `Nama perusahaan: ${site.name || "Sidomulyo Advertising"}\n`;
      ctx += `Tagline: ${site.tagline || ""}\n`;
      ctx += `Deskripsi: ${site.description || ""}\n`;
      if (site.address) {
        const a = site.address;
        ctx += `Alamat: ${[a.street, a.city, a.region, a.country].filter(Boolean).join(", ")}\n`;
      }
      ctx += `Telepon: ${site.phoneDisplay || site.phone || ""}\n`;
      ctx += `Email: ${site.email || ""}\n`;
      ctx += `Jam operasional: ${site.operationalHours || ""}\n`;
      const wa = (site.social || []).find((s) => /wa\.me|whatsapp/i.test(s.url || s.link || ""));
      if (wa) ctx += `WhatsApp: ${wa.url || wa.link}\n`;
      if (Array.isArray(site.serviceArea) && site.serviceArea.length) {
        ctx += `Area layanan: ${site.serviceArea.join(", ")}\n`;
      }
    }
    if (services && services.length) {
      ctx += `\nLayanan/Produk utama:\n`;
      for (const s of services) {
        ctx += `- ${s.title}: ${cleanHtml(s.shortDesc || s.longDesc || "")}${s.features?.length ? " (Fitur: " + s.features.join(", ") + ")" : ""}\n`;
      }
    }
  } catch {
    ctx = "";
  }
  return `Kamu adalah Hani, customer service dari Sidomulyo Advertising, sebuah bisnis advertising, percetakan, dan branding di Salatiga, Indonesia. Tugasmu membantu pengunjung menjawab pertanyaan seputar produk, layanan, pemesanan, dan informasi kontak dengan ramah layaknya staf CS sungguhan.

Berikut adalah informasi perusahaan dan layanan yang boleh kamu gunakan sebagai referensi:
---
${ctx}
---

Aturan penting:
- Jawab SELALU dalam Bahasa Indonesia yang ramah, singkat, dan natural — seperti staf customer service asli sedang mengobrol. JANGAN sebut diri kamu sebagai "AI", "bot", "asisten virtual", atau "kecerdasan buatan". Panggil diri kamu "Hani".
- Gunakan HANYA informasi di atas. Jika pertanyaan di luar informasi tersebut (misal harga pasti, ketersediaan spesifik, atau hal teknis di luar layanan), jangan menebak angka dan jangan memberi jawaban mengandung angka yang tidak ada di referensi.
- Untuk pertanyaan pemesanan, jelaskan langkah umum: pilih layanan, hubungi tim via WhatsApp/telepon, konsultasikan kebutuhan, lalu produksi.
- Jangan pernah meminta data pribadi sensitif (password, kartu kredit, dll).
- JIKA dan HANYA JIKA kamu benar-benar tidak bisa membantu atau pertanyaannya butuh penanganan tim (misal negosiasi harga, jadwal produksi spesifik, keluhan), akhiri jawaban dengan token persis: [BUTUH_CS] (tanpa teks lain di belakangnya). Token ini akan memunculkan tombol hubungi CS. Untuk pertanyaan yang bisa kamu jawab dari referensi, JANGAN tambahkan token tersebut.`;
}

async function callLLM(messages) {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return { reply: "Maaf, layanan sedang tidak tersedia. Silakan hubungi CS kami langsung via WhatsApp untuk pemesanan.", configured: false };
  }

  if (provider === "gemini") {
    const model = process.env.AI_MODEL || "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
      signal: AbortSignal.timeout(20000),
    });
    const d = await res.json();
    if (!res.ok) {
      console.error("[chat] Gemini error", res.status, JSON.stringify(d).slice(0, 300));
    }
    return { reply: d?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "Maaf, saya tidak bisa menjawab saat ini.", configured: true };
  }

  // Default: OpenAI-compatible chat completions
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const base = process.env.AI_BASE_URL || "https://api.openai.com/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 600 }),
    signal: AbortSignal.timeout(20000),
  });
  const d = await res.json();
  if (!res.ok) {
    console.error("[chat] OpenAI error", res.status, JSON.stringify(d).slice(0, 300));
  }
  return { reply: d?.choices?.[0]?.message?.content || "Maaf, saya tidak bisa menjawab saat ini.", configured: true };
}

export async function POST({ request }) {
  try {
    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ message: "Pesan kosong" }), { status: 400 });
    }

    const system = await buildSystemPrompt();
    const safe = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const full = [{ role: "system", content: system }, ...safe];
    const { reply, configured } = await callLLM(full);
    const handoff = !configured || reply.includes("[BUTUH_CS]");

    return new Response(JSON.stringify({ reply, handoff }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ reply: "Maaf, terjadi gangguan. Silakan hubungi kami via WhatsApp atau telepon.", handoff: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
