import db from "../../../lib/db.js";
import nodemailer from "nodemailer";

export const prerender = false;

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

function renderTemplate(template, user, site, siteUrl) {
  const logoSrc = resolveUrl(siteUrl, template.logo_url || site.logo);
  const accent = template.accent_color || "#2563eb";

  return `
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

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:linear-gradient(135deg,${accent}dd,${accent});padding:36px 32px;text-align:center;">
                    ${logoSrc ? `<img src="${logoSrc}" alt="${site.name}" style="height:48px;margin:0 auto 12px;display:block;border-radius:8px;" />` : ""}
                    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">${template.header_text || site.name}</h1>
                    ${template.description ? `<p style="color:rgba(255,255,255,0.75);font-size:13px;margin:8px 0 0;">${template.description}</p>` : ""}
                  </td>
                </tr>
              </table>

              ${template.banner_image ? `
              <!-- Banner -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0;">
                    <img src="${resolveUrl(siteUrl, template.banner_image)}" alt="Banner" style="width:100%;display:block;" />
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:36px 32px;text-align:center;">
                    <p style="color:#cbd5e1;font-size:15px;margin:0 0 6px;">Halo <strong style="color:#f1f5f9;">${user.name || "User"}</strong>,</p>
                    <div style="color:#94a3b8;font-size:14px;line-height:1.7;margin:12px 0 28px;text-align:left;">
                      ${template.body_html || ""}
                    </div>

                    ${template.button_text && template.button_url ? `
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
                      <tr>
                        <td style="background:${accent};border-radius:12px;">
                          <a href="${resolveUrl(siteUrl, template.button_url)}" target="_blank" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
                            ${template.button_text} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    ` : ""}
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              ${template.footer_text ? `
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0 32px;">
                    <div style="border-top:1px solid rgba(255,255,255,0.06);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 32px 28px;text-align:center;">
                    <p style="color:#64748b;font-size:12px;margin:0;line-height:1.6;">${template.footer_text}</p>
                  </td>
                </tr>
              </table>
              ` : ""}

            </td>
          </tr>
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

export async function POST({ request }) {
  const { templateId, recipientFilter, customEmails, subject, headerText, logoUrl, description, bodyHtml, footerText, accentColor, buttonText, buttonUrl } = await request.json();
  const siteUrl = getSiteUrl(request);

  if (!subject || !bodyHtml) {
    return new Response(JSON.stringify({ message: "Subject dan body wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch site config
  const [siteRows] = await db.execute("SELECT * FROM site_config WHERE id = 1");
  const sr = siteRows[0] || {};
  const site = {
    name: sr.name || "Sidomulyo Advertising",
    logo: sr.logo || "",
  };

  // Build template object
  const template = {
    header_text: headerText || "",
    logo_url: logoUrl || "",
    description: description || "",
    body_html: bodyHtml || "",
    footer_text: footerText || "",
    accent_color: accentColor || "#2563eb",
    button_text: buttonText || "",
    button_url: buttonUrl || "",
  };

  // Get recipients
  let recipients = [];
  if (customEmails && customEmails.length > 0) {
    // Custom email list
    recipients = customEmails.map((e) => ({ name: "", email: e }));
  } else {
    // From marketplace_users based on filter
    let query = "SELECT name, email FROM marketplace_users WHERE 1=1";
    const params = [];
    if (recipientFilter === "verified") {
      query += " AND verified = 1";
    } else if (recipientFilter === "unverified") {
      query += " AND verified = 0";
    } else if (recipientFilter === "banned") {
      query += " AND banned = 1";
    }
    // recipientFilter === "all" or undefined = no extra filter
    const [users] = await db.execute(query, params);
    recipients = users;
  }

  if (recipients.length === 0) {
    return new Response(JSON.stringify({ message: "Tidak ada penerima yang ditemukan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Send emails
  const transporter = getTransporter();
  let sent = 0;
  let failed = 0;

  for (const r of recipients) {
    if (!r.email) continue;
    try {
      await transporter.sendMail({
        from: `"${site.name}" <${process.env.SMTP_USER}>`,
        to: r.email,
        subject,
        html: renderTemplate(template, r, site, siteUrl),
      });
      sent++;
    } catch (err) {
      console.error(`[broadcast] failed to ${r.email}:`, err.message);
      failed++;
    }
  }

  // Save to broadcast log
  await db.execute(
    `INSERT INTO email_broadcast_logs (template_id, subject, recipient_filter, recipient_count, sent_count, failed_count)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [templateId || null, subject, recipientFilter || "all", recipients.length, sent, failed]
  );

  return new Response(JSON.stringify({
    message: `Berhasil mengirim ${sent} email${failed > 0 ? `, ${failed} gagal` : ""}`,
    sent,
    failed,
    total: recipients.length,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
