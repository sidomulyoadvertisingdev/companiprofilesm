import db from "../src/lib/db.js";

const templates = [
  {
    name: "Verifikasi Akun Marketplace",
    type: "verification",
    subject: "Kode Verifikasi Marketplace - Sidomulyo Advertising",
    header_text: "Verifikasi Akun Anda",
    logo_url: "",
    description: "Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran akun marketplace Anda.",
    body_html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:20px 0;">
  <tr>
    <td style="background-color:#f8fafc;border:2px dashed #3b82f6;border-radius:12px;padding:24px 20px;text-align:center;">
      <p style="color:#000000;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Kode Verifikasi</p>
      <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2563eb;font-family:'Courier New',Courier,monospace;display:inline-block;">{{code}}</span>
    </td>
  </tr>
</table>
<p style="color:#000000;font-size:12px;margin:16px 0 0;text-align:center;">Kode ini kedaluwarsa dalam <strong style="color:#000000;">10 menit</strong>.</p>
`,
    footer_text: "Jika Anda tidak meminta verifikasi ini, abaikan email ini.",
    accent_color: "#2563eb",
    button_text: "Buka Marketplace",
    button_url: "/marketplace",
    banner_image: "",
    is_active: true,
  },
  {
    name: "Promo Spesial - Diskon Besar",
    type: "marketing",
    subject: "Promo Spesial! Diskon Besar untuk Kamu",
    header_text: "Promo Spesial!",
    logo_url: "",
    description: "Jangan lewatkan penawaran terbatas dari Sidomulyo Advertising.",
    body_html: `
<p style="color:#000000;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Hanya untuk kamu yang sudah terdaftar di marketplace kami!</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
  <tr>
    <td style="background-color:#f8fafc;border-radius:12px;padding:24px;text-align:center;border:1px solid #e2e8f0;">
      <p style="color:#2563eb;font-size:48px;font-weight:800;margin:0;">50%</p>
      <p style="color:#000000;font-size:14px;margin:4px 0 0;font-weight:600;">DISKON untuk layanan tertentu</p>
    </td>
  </tr>
</table>
<p style="color:#000000;font-size:14px;font-weight:600;margin:0 0 8px;">Syarat & Ketentuan:</p>
<ul style="color:#000000;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
  <li>Berlaku hingga akhir bulan ini</li>
  <li>Hanya untuk pengguna marketplace terverifikasi</li>
  <li>Tidak dapat digabung dengan promo lain</li>
</ul>
`,
    footer_text: "Promo ini berlaku terbatas. Kunjungi Sidomulyo Advertising untuk informasi lebih lanjut.",
    accent_color: "#f59e0b",
    button_text: "Klaim Promo Sekarang",
    button_url: "/marketplace",
    banner_image: "",
    is_active: true,
  },
  {
    name: "Selamat Datang di Marketplace",
    type: "notification",
    subject: "Selamat Datang di Marketplace Sidomulyo!",
    header_text: "Selamat Datang!",
    logo_url: "",
    description: "Akun marketplace kamu sudah aktif.",
    body_html: `
<p style="color:#000000;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Kamu sudah resmi menjadi bagian dari marketplace kami!</p>
<p style="color:#000000;font-size:14px;margin:0 0 16px;line-height:1.7;">
  Dengan akun marketplace ini, kamu bisa:
</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
  <tr>
    <td style="padding:8px 0;color:#000000;font-size:13px;">
      <span style="color:#10b981;font-weight:700;margin-right:8px;">&#10003;</span> Klaim kode redeem diskon eksklusif
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;color:#000000;font-size:13px;">
      <span style="color:#10b981;font-weight:700;margin-right:8px;">&#10003;</span> Dapatkan promo khusus member
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;color:#000000;font-size:13px;">
      <span style="color:#10b981;font-weight:700;margin-right:8px;">&#10003;</span> Akses layanan Sidomulyo Advertising & Printing
    </td>
  </tr>
</table>
<p style="color:#000000;font-size:12px;margin:0;text-align:center;">Simpan email ini untuk referensi kamu.</p>
`,
    footer_text: "Terima kasih sudah bergabung dengan marketplace Sidomulyo Advertising.",
    accent_color: "#10b981",
    button_text: "Jelajahi Marketplace",
    button_url: "/marketplace",
    banner_image: "",
    is_active: true,
  },
  {
    name: "Pemberitahuan Penting",
    type: "notification",
    subject: "Pemberitahuan Penting dari Sidomulyo Advertising",
    header_text: "Pemberitahuan Penting",
    logo_url: "",
    description: "Informasi terbaru dari Sidomulyo Advertising untuk kamu.",
    body_html: `
<p style="color:#000000;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Ada info penting yang perlu kamu tahu!</p>
<p style="color:#000000;font-size:14px;margin:0 0 16px;line-height:1.7;">
  Tulis pesan pemberitahuan kamu di sini. Kamu bisa mengedit konten ini sesuai kebutuhan — misalnya info perubahan jam operasional, pemeliharaan sistem, atau pengumuman lainnya.
</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
  <tr>
    <td style="background-color:#fffbeb;border-radius:12px;padding:16px 20px;border-left:4px solid #f59e0b;border-top:1px solid #fef3c7;border-right:1px solid #fef3c7;border-bottom:1px solid #fef3c7;">
      <p style="color:#d97706;font-size:12px;font-weight:700;margin:0 0 4px;">PENTING</p>
      <p style="color:#b45309;font-size:13px;margin:0;line-height:1.6;">Ganti teks ini dengan informasi pemberitahuan kamu.</p>
    </td>
  </tr>
</table>
`,
    footer_text: "Untuk pertanyaan lebih lanjut, hubungi kami melalui WhatsApp atau kunjungi langsung Sidomulyo Advertising.",
    accent_color: "#ef4444",
    button_text: "",
    button_url: "",
    banner_image: "",
    is_active: true,
  },
];

async function run() {
  console.log("Reseeding templates with clean light-theme versions...");
  try {
    // Clear the existing templates
    await db.execute("DELETE FROM email_templates");
    console.log("✓ Cleared email_templates table.");

    // Seed clean templates
    for (const t of templates) {
      await db.execute(
        `INSERT INTO email_templates (name, type, subject, header_text, logo_url, description, body_html, footer_text, accent_color, button_text, button_url, banner_image, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.name, t.type, t.subject, t.header_text, t.logo_url, t.description, t.body_html.trim(), t.footer_text, t.accent_color, t.button_text, t.button_url, t.banner_image, t.is_active ? 1 : 0]
      );
      console.log(`✓ Seeded template: "${t.name}"`);
    }

    console.log("Reseed complete!");
  } catch (err) {
    console.error("Error during reseed:", err.message);
  } finally {
    await db.end();
  }
}

run();
