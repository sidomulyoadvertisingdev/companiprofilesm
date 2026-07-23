import db from "../../../lib/db.js";
import nodemailer from "nodemailer";
import { createHash } from "crypto";
import { verifyTurnstile } from "../../../lib/turnstile.js";

export const prerender = false;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function getSiteUrl(request) {
  let siteUrl = process.env.SITE_URL;

  if (!siteUrl) {
    const reqUrl = new URL(request.url);
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || reqUrl.host;
    const cleanHost = host.split(":")[0];
    const isLocal = cleanHost === "localhost" || cleanHost === "127.0.0.1" || cleanHost === "::1" || cleanHost === "";

    if (isLocal) {
      if (import.meta.env.PROD || process.env.NODE_ENV === "production") {
        siteUrl = "https://sidomulyoproject.com";
      } else {
        siteUrl = `${reqUrl.protocol}//${reqUrl.host}`;
      }
    } else {
      const proto = request.headers.get("x-forwarded-proto") || "https";
      siteUrl = `${proto}://${host}`;
    }
  }

  if (siteUrl && siteUrl.endsWith("/")) {
    siteUrl = siteUrl.slice(0, -1);
  }

  return siteUrl;
}

function resolveUrl(baseUrl, path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

async function getSiteConfig() {
  const [rows] = await db.execute("SELECT * FROM site_config WHERE id = 1");
  const r = rows[0];
  if (!r) return {};
  return {
    name: r.name || "Sidomulyo Advertising",
    logo: r.logo || "",
    phone: r.phone_display || r.phone || "",
    email: r.email || "",
    addressStreet: r.address_street || "",
    addressCity: r.address_city || "",
    addressRegion: r.address_region || "",
    operationalHours: r.operational_hours || "",
  };
}

function verificationEmailHTML(code, name, site, siteUrl) {
  const logoSrc = resolveUrl(siteUrl, site.logo);
  const addressParts = [site.addressStreet, site.addressCity, site.addressRegion].filter(Boolean).join(", ");

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">

          <!-- Card -->
          <tr>
            <td style="background:#1e293b;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);box-shadow:0 8px 32px rgba(0,0,0,0.4);">

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(135deg,#1e40af 0%,#2563eb 50%,#3b82f6 100%);padding:36px 32px;text-align:center;">
                    ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:48px;margin:0 auto 12px;display:block;border-radius:8px;" />` : ""}
                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;letter-spacing:-0.3px;">${site.name}</h1>
                    <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;font-weight:400;">Verifikasi Akun Marketplace</p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 32px 8px;text-align:center;">
                    <p style="color:#cbd5e1;font-size:15px;margin:0 0 6px;">Halo <strong style="color:#f1f5f9;">${name || "User"}</strong>,</p>
                    <p style="color:#94a3b8;font-size:14px;margin:0 0 28px;line-height:1.6;">
                      Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran akun marketplace Anda.
                    </p>

                    <!-- Code Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background:linear-gradient(135deg,#1e293b,#0f172a);border:2px dashed #3b82f6;border-radius:14px;padding:24px 20px;text-align:center;">
                          <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-weight:600;">Kode Verifikasi</p>
                          <span style="font-size:40px;font-weight:800;letter-spacing:14px;color:#60a5fa;font-family:'Courier New',Courier,monospace;display:inline-block;">${code}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#64748b;font-size:12px;margin:20px 0 0;">Kode ini kedaluwarsa dalam <strong style="color:#94a3b8;">10 menit</strong>.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              ${siteUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:8px 32px 32px;text-align:center;">
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:12px;">
                          <a href="${siteUrl}/marketplace" target="_blank" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                            Buka Marketplace &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0 32px;">
                    <div style="border-top:1px solid rgba(255,255,255,0.06);"></div>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:24px 32px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="text-align:center;">
                          ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:28px;margin:0 auto 12px;display:block;opacity:0.7;border-radius:4px;" />` : ""}
                          <p style="color:#475569;font-size:12px;margin:0 0 10px;font-weight:600;">${site.name}</p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="text-align:center;">
                                ${addressParts ? `<p style="color:#64748b;font-size:11px;margin:0 0 4px;line-height:1.5;">&#128205; ${addressParts}</p>` : ""}
                                ${site.phone ? `<p style="color:#64748b;font-size:11px;margin:0 0 4px;">&#128222; ${site.phone}</p>` : ""}
                                ${site.email ? `<p style="color:#64748b;font-size:11px;margin:0 0 4px;">&#9993; ${site.email}</p>` : ""}
                                ${site.operationalHours ? `<p style="color:#64748b;font-size:11px;margin:0 0 4px;">&#128336; ${site.operationalHours}</p>` : ""}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td style="padding:16px 0;text-align:center;">
              <p style="color:#475569;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendVerificationEmail(email, code, name, siteUrl) {
  const site = await getSiteConfig();
  if (!siteUrl) siteUrl = "";

  // Try to fetch verification template from DB
  const [tplRows] = await db.execute(
    'SELECT * FROM email_templates WHERE type = "verification" AND is_active = 1 ORDER BY id DESC LIMIT 1'
  );
  const tpl = tplRows[0];

  let html;
  let subject;

  if (tpl) {
    // Use custom template from admin, inject code into body_html
    const logoSrc = resolveUrl(siteUrl, tpl.logo_url || site.logo);
    const accent = tpl.accent_color || "#2563eb";
    const bodyWithCode = (tpl.body_html || "").replace(/\{\{code\}\}/g, code).replace(/\{\{name\}\}/g, name || "User");

    html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">
          <tr>
            <td style="background:#1e293b;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);box-shadow:0 8px 32px rgba(0,0,0,0.4);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(135deg,${accent}dd,${accent});padding:36px 32px;text-align:center;">
                    ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:48px;margin:0 auto 12px;display:block;border-radius:8px;" />` : ""}
                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">${tpl.header_text || site.name}</h1>
                    ${tpl.description ? `<p style="color:rgba(255,255,255,0.75);font-size:13px;margin:8px 0 0;">${tpl.description}</p>` : ""}
                  </td>
                </tr>
              </table>

              ${tpl.banner_image ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0;">
                    <img src="${resolveUrl(siteUrl, tpl.banner_image)}" alt="Banner" style="width:100%;display:block;" />
                  </td>
                </tr>
              </table>
              ` : ""}

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 32px;text-align:center;">
                    <div style="color:#94a3b8;font-size:14px;line-height:1.7;text-align:left;">${bodyWithCode}</div>
                  </td>
                </tr>
              </table>
              ${tpl.footer_text ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding:0 32px;"><div style="border-top:1px solid rgba(255,255,255,0.06);"></div></td></tr>
                <tr><td style="padding:20px 32px 28px;text-align:center;"><p style="color:#64748b;font-size:12px;margin:0;line-height:1.6;">${tpl.footer_text}</p></td></tr>
              </table>` : ""}
            </td>
          </tr>
          <tr><td style="padding:16px 0;text-align:center;"><p style="color:#475569;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    subject = tpl.subject || `Kode Verifikasi Marketplace - ${site.name}`;
  } else {
    // Fallback: use built-in template
    html = verificationEmailHTML(code, name, site, siteUrl);
    subject = `Kode Verifikasi Marketplace - ${site.name}`;
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${site.name}" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
}

export async function POST({ request }) {
  const { action, email, code, turnstileToken } = await request.json();
  const siteUrl = getSiteUrl(request);

  if (action === "send") {
    if (!email) {
      return new Response(JSON.stringify({ message: "Email wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
    const turnstileOk = await verifyTurnstile(turnstileToken, clientIp);
    if (!turnstileOk) {
      return new Response(JSON.stringify({ message: "Verifikasi keamanan gagal, silakan coba lagi" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [[user]] = await db.execute(
      "SELECT id, name, verified FROM marketplace_users WHERE email = ?",
      [email]
    );
    if (!user) {
      return new Response(JSON.stringify({ message: "Email tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (user.verified) {
      return new Response(JSON.stringify({ message: "Email sudah terverifikasi", verified: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const verificationCode = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.execute(
      "INSERT INTO marketplace_email_verifications (user_id, code, expires_at) VALUES (?, ?, ?)",
      [user.id, verificationCode, expiresAt]
    );

    try {
      await sendVerificationEmail(email, verificationCode, user.name, siteUrl);
    } catch (err) {
      console.error("[verify-email] send failed:", err.message);
      return new Response(JSON.stringify({ message: "Gagal mengirim email verifikasi, coba lagi" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Kode verifikasi telah dikirim ke email Anda" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (action === "verify") {
    if (!email || !code) {
      return new Response(JSON.stringify({ message: "Email dan kode wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [[user]] = await db.execute(
      "SELECT id, name, email, phone, address FROM marketplace_users WHERE email = ?",
      [email]
    );
    if (!user) {
      return new Response(JSON.stringify({ message: "Email tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [[verification]] = await db.execute(
      "SELECT id FROM marketplace_email_verifications WHERE user_id = ? AND code = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1",
      [user.id, code.trim()]
    );
    if (!verification) {
      return new Response(JSON.stringify({ message: "Kode verifikasi tidak valid atau sudah kedaluwarsa" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.execute(
      "UPDATE marketplace_email_verifications SET used = 1 WHERE id = ?",
      [verification.id]
    );
    await db.execute(
      "UPDATE marketplace_users SET verified = 1 WHERE id = ?",
      [user.id]
    );

    // Create session token so user can proceed to spin immediately
    const token = createHash("sha256")
      .update(`${user.id}-${Date.now()}-${Math.random()}`)
      .digest("hex");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.execute(
      "INSERT INTO marketplace_sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
      [token, user.id, expires]
    );

    return new Response(JSON.stringify({
      message: "Email berhasil diverifikasi",
      verified: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address },
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Action tidak valid" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
