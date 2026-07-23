import db from "../../../lib/db.js";
import nodemailer from "nodemailer";
import { createHash } from "crypto";
import { verifyTurnstile } from "../../../lib/turnstile.js";
import { rateLimit } from "../../../lib/rate-limiter.js";

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
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -1px rgba(0,0,0,0.03);">

          <!-- Top Border -->
          <tr>
            <td style="height:4px;background-color:#2563eb;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 16px;text-align:center;">
              <h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0;line-height:1.3;">${site.name}</h1>
              <p style="color:#64748b;font-size:14px;margin:8px 0 0;line-height:1.5;">Verifikasi Akun Marketplace</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;background-color:#ffffff;">
              <p style="color:#0f172a;font-size:15px;margin:0 0 16px;font-weight:600;">Halo ${name || "User"},</p>
              <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 24px;">
                Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran akun marketplace Anda.
              </p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
                <tr>
                  <td style="background-color:#f8fafc;border:2px dashed #3b82f6;border-radius:12px;padding:24px 20px;text-align:center;">
                    <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;font-weight:600;">Kode Verifikasi</p>
                    <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2563eb;font-family:'Courier New',Courier,monospace;display:inline-block;">${code}</span>
                  </td>
                </tr>
              </table>

              <p style="color:#64748b;font-size:12px;margin:20px 0 0;text-align:center;">Kode ini kedaluwarsa dalam <strong style="color:#1e293b;">10 menit</strong>.</p>
            </td>
          </tr>

          <!-- CTA Button -->
          ${siteUrl ? `
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#2563eb;border-radius:8px;">
                    <a href="${siteUrl}/marketplace" target="_blank" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
                      Buka Marketplace &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ""}

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:32px;text-align:center;">
              <!-- Logo at the bottom -->
              ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:36px;margin:0 auto 16px;display:block;" />` : ""}

              <p style="color:#0f172a;font-size:13px;font-weight:700;margin:0 0 6px;">${site.name}</p>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:12px;">
                <tr>
                  <td style="text-align:center;color:#64748b;font-size:11px;line-height:1.5;">
                    ${addressParts ? `<p style="margin:0 0 4px;">&#128205; ${addressParts}</p>` : ""}
                    ${site.phone ? `<p style="margin:0 0 4px;">&#128222; ${site.phone}</p>` : ""}
                    ${site.email ? `<p style="margin:0 0 4px;">&#9993; ${site.email}</p>` : ""}
                    ${site.operationalHours ? `<p style="margin:0 0 4px;">&#128336; ${site.operationalHours}</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8;font-size:10px;margin:24px 0 0;">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
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
    const addressParts = [site.addressStreet, site.addressCity, site.addressRegion].filter(Boolean).join(", ");

    html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -1px rgba(0,0,0,0.03);">

          <!-- Banner / Top Border -->
          ${tpl.banner_image ? `
          <tr>
            <td style="padding:0;">
              <img src="${resolveUrl(siteUrl, tpl.banner_image)}" alt="Banner" style="width:100%;max-width:100%;display:block;border-top-left-radius:12px;border-top-right-radius:12px;" />
            </td>
          </tr>
          ` : `
          <tr>
            <td style="height:4px;background-color:${accent};"></td>
          </tr>
          `}

          <!-- Header Title & Description -->
          ${(tpl.header_text || tpl.description) ? `
          <tr>
            <td style="padding:32px 32px 16px;text-align:center;">
              ${tpl.header_text ? `<h1 style="color:#0f172a;font-size:24px;font-weight:700;margin:0;line-height:1.3;">${tpl.header_text}</h1>` : ""}
              ${tpl.description ? `<p style="color:#64748b;font-size:14px;margin:8px 0 0;line-height:1.5;">${tpl.description}</p>` : ""}
            </td>
          </tr>
          ` : ""}

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;background-color:#ffffff;">
              <p style="color:#0f172a;font-size:15px;margin:0 0 16px;font-weight:600;">Halo ${name || "User"},</p>
              <div style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 24px;">
                ${bodyWithCode}
              </div>

              ${tpl.button_text && tpl.button_url ? `
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px auto 0;">
                <tr>
                  <td style="background-color:${accent};border-radius:8px;">
                    <a href="${resolveUrl(siteUrl, tpl.button_url)}" target="_blank" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
                      ${tpl.button_text} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:32px;text-align:center;">
              <!-- Logo at the bottom -->
              ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:36px;margin:0 auto 16px;display:block;" />` : ""}

              <p style="color:#0f172a;font-size:13px;font-weight:700;margin:0 0 6px;">${site.name}</p>

              ${tpl.footer_text ? `<p style="color:#64748b;font-size:11px;margin:0 0 16px;line-height:1.6;">${tpl.footer_text}</p>` : ""}

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:12px;">
                <tr>
                  <td style="text-align:center;color:#64748b;font-size:11px;line-height:1.5;">
                    ${addressParts ? `<p style="margin:0 0 4px;">&#128205; ${addressParts}</p>` : ""}
                    ${site.phone ? `<p style="margin:0 0 4px;">&#128222; ${site.phone}</p>` : ""}
                    ${site.email ? `<p style="margin:0 0 4px;">&#9993; ${site.email}</p>` : ""}
                    ${site.operationalHours ? `<p style="margin:0 0 4px;">&#128336; ${site.operationalHours}</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8;font-size:10px;margin:24px 0 0;">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
            </td>
          </tr>

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
  const body = await request.json();
  const { action, email, code, turnstileToken } = body;
  const siteUrl = getSiteUrl(request);
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";

  if (action === "send") {
    if (!email) {
      return new Response(JSON.stringify({ message: "Email wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { allowed, resetTime } = await rateLimit(`otp-send:${clientIp}`, 3, 2 * 60 * 1000);
    if (!allowed) {
      const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(JSON.stringify({ message: `Terlalu banyak permintaan verifikasi, coba lagi dalam ${secondsLeft} detik` }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(secondsLeft),
        },
      });
    }

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

    const { allowed, resetTime } = await rateLimit(`otp-verify:${clientIp}`, 5, 2 * 60 * 1000);
    if (!allowed) {
      const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(JSON.stringify({ message: `Terlalu banyak kegagalan verifikasi, coba lagi dalam ${secondsLeft} detik` }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(secondsLeft),
        },
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
