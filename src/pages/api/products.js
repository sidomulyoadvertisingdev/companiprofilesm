import db from "../../lib/db.js";

export const prerender = false;

function slugify(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

async function rows() {
  const [r] = await db.execute(
    "SELECT id, slug, title, category, price_text, image, short_desc, long_desc, `order` FROM products ORDER BY `order` ASC, id ASC"
  );
  return r.map((x) => ({
    id: x.id, slug: x.slug, title: x.title, category: x.category,
    priceText: x.price_text, image: x.image, shortDesc: x.short_desc, longDesc: x.long_desc, order: x.order,
  }));
}

export async function GET() {
  try {
    return new Response(JSON.stringify({ data: await rows() }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[products] GET failed:", err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST({ request }) {
  try {
    let b;
    try {
      b = await request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Body bukan JSON yang valid" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const title = (b.title || "").toString().trim();
    if (!title) {
      return new Response(JSON.stringify({ message: "Judul produk wajib diisi" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const slug = slugify(b.slug) || slugify(title);
    if (!slug) {
      return new Response(JSON.stringify({ message: "Slug tidak valid (isi judul terlebih dahulu)" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Cegah duplikat slug (UNIQUE) yang memicu 500.
    const [[existing]] = await db.execute("SELECT id FROM products WHERE slug = ?", [slug]);
    if (existing) {
      return new Response(JSON.stringify({ message: `Slug "${slug}" sudah dipakai, gunakan slug lain` }), {
        status: 409, headers: { "Content-Type": "application/json" },
      });
    }

    const [result] = await db.execute(
      "INSERT INTO products (slug, title, category, price_text, image, short_desc, long_desc, `order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [slug, title, b.category || "", b.priceText || "", b.image || "", b.shortDesc || "", b.longDesc || "", b.order || 0]
    );
    const all = await rows();
    return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
      status: 201, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[products] POST failed:", err.message);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
