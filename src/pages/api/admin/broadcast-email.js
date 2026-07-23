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

function sanitizeBodyHtml(html) {
  if (!html) return "";
  return html
    .replace(/#f1f5f9/g, "#000000")
    .replace(/#cbd5e1/g, "#000000")
    .replace(/#94a3b8/g, "#000000")
    .replace(/#0f172a/g, "#000000")
    .replace(/#334155/g, "#000000")
    .replace(/#4b5563/g, "#000000")
    .replace(/#1e293b/g, "#f8fafc")
    .replace(/rgba\(255,\s*255,\s*255,\s*0\.0[86]\)/gi, "#e2e8f0")
    .replace(/#60a5fa/g, "#2563eb")
    .replace(/#34d399/g, "#10b981");
}

function renderTemplate(template, user, site, siteUrl) {
  const logoSrc = resolveUrl(siteUrl, template.logo_url || site.logo);
  const accent = template.accent_color || "#2563eb";
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

          <!-- Banner / Top Border -->
          ${template.banner_image ? `
          <tr>
            <td style="padding:0;">
              <img src="${resolveUrl(siteUrl, template.banner_image)}" alt="Banner" style="width:100%;max-width:100%;display:block;border-top-left-radius:12px;border-top-right-radius:12px;" />
            </td>
          </tr>
          ` : `
          <tr>
            <td style="height:4px;background-color:${accent};"></td>
          </tr>
          `}

          <!-- Header Title & Description -->
          ${(template.header_text || template.description) ? `
          <tr>
            <td style="padding:32px 32px 16px;text-align:center;">
              ${template.header_text ? `<h1 style="color:#000000;font-size:24px;font-weight:700;margin:0;line-height:1.3;">${template.header_text}</h1>` : ""}
              ${template.description ? `<p style="color:#000000;font-size:14px;margin:8px 0 0;line-height:1.5;">${template.description}</p>` : ""}
            </td>
          </tr>
          ` : ""}

          <!-- Body Content -->
          <tr>
            <td style="padding:32px;background-color:#ffffff;">
              <p style="color:#000000;font-size:15px;margin:0 0 16px;font-weight:600;">Halo ${user.name || "User"},</p>
              <div style="color:#000000;font-size:14px;line-height:1.6;margin:0 0 24px;">
                ${sanitizeBodyHtml(template.body_html)}
              </div>

              ${template.button_text && template.button_url ? `
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px auto 0;">
                <tr>
                  <td style="background-color:${accent};border-radius:8px;">
                    <a href="${resolveUrl(siteUrl, template.button_url)}" target="_blank" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">
                      ${template.button_text} &rarr;
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

              <p style="color:#000000;font-size:13px;font-weight:700;margin:0 0 6px;">${site.name}</p>

              ${template.footer_text ? `<p style="color:#000000;font-size:11px;margin:0 0 16px;line-height:1.6;">${template.footer_text}</p>` : ""}

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:12px;">
                <tr>
                  <td style="text-align:center;color:#000000;font-size:11px;line-height:1.5;">
                    ${addressParts ? `<p style="margin:0 0 4px;">&#128205; ${addressParts}</p>` : ""}
                    ${site.phone ? `<p style="margin:0 0 4px;">&#128222; ${site.phone}</p>` : ""}
                    ${site.email ? `<p style="margin:0 0 4px;">&#9993; ${site.email}</p>` : ""}
                    ${site.operationalHours ? `<p style="margin:0 0 4px;">&#128336; ${site.operationalHours}</p>` : ""}
                  </td>
                </tr>
              </table>

              <p style="color:#000000;font-size:10px;margin:24px 0 0;">&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p>
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
  const body = await request.json();
  const siteUrl = getSiteUrl(request);

  const {
    templateId,
    recipientFilter,
    customEmails,
    subject,
    headerText,
    logoUrl,
    bannerImage,
    description,
    bodyHtml,
    footerText,
    accentColor,
    buttonText,
    buttonUrl
  } = body;

  const finalSubject = subject || body.subject;
  const finalBodyHtml = bodyHtml || body.body_html;

  if (!finalSubject || !finalBodyHtml) {
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
    phone: sr.phone_display || sr.phone || "",
    email: sr.email || "",
    addressStreet: sr.address_street || "",
    addressCity: sr.address_city || "",
    addressRegion: sr.address_region || "",
    operationalHours: sr.operational_hours || "",
  };

  // Build template object
  const template = {
    header_text: headerText || body.header_text || "",
    logo_url: logoUrl || body.logo_url || "",
    banner_image: bannerImage || body.banner_image || "",
    description: description || body.description || "",
    body_html: finalBodyHtml || "",
    footer_text: footerText || body.footer_text || "",
    accent_color: accentColor || body.accent_color || "#2563eb",
    button_text: buttonText || body.button_text || "",
    button_url: buttonUrl || body.button_url || "",
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
