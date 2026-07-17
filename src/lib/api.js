// ===========================================================================
// API CLIENT (browser / client islands)
// ---------------------------------------------------------------------------
// Digunakan saat komponen berjalan di browser. Fetch ke /api/* (same-origin).
// Untuk mutasi (POST/PUT/DELETE) dari admin dashboard, cookie session otomatis
// terkirim karena same-origin.
// ===========================================================================

async function getJSON(path) {
  const res = await fetch(path, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${path} -> ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export const getSite = () => getJSON("/api/site-config");
export const getServices = () => getJSON("/api/services");
export const getService = (slug) => getJSON(`/api/services/${slug}`);
export const getProducts = () => getJSON("/api/products");
export const getPortfolio = () => getJSON("/api/portfolio");
export const getPortfolioItem = (id) => getJSON(`/api/portfolio/${id}`);
export const getPartners = () => getJSON("/api/partners");
export const getTestimonials = () => getJSON("/api/testimonials");
export const getStats = () => getJSON("/api/stats");
export const getNav = () => getJSON("/api/nav");
export const getPosts = () => getJSON("/api/posts");
export const getPost = (id) => getJSON(`/api/posts/${id}`);
