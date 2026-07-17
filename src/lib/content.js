// ===========================================================================
// CONTENT ABSTRACTION LAYER
// ---------------------------------------------------------------------------
// Satu-satunya pintu akses konten untuk komponen UI.
// - Di server (SSR, import.meta.env.SSR): baca langsung dari database via
//   src/lib/queries.js (tidak perlu HTTP round-trip).
// - Di browser (client island): fetch dari /api/* via src/lib/api.js.
// Vite akan tree-shake branch server dari bundle client, sehingga
// mysql2 tidak ikut masuk ke browser.
// ===========================================================================

export async function getSite() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getSite();
  return (await import("./api.js")).getSite();
}
export async function getServices() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getServices();
  return (await import("./api.js")).getServices();
}
export async function getService(slug) {
  if (import.meta.env.SSR) return (await import("./queries.js")).getService(slug);
  return (await import("./api.js")).getService(slug);
}
export async function getProducts() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getProducts();
  return (await import("./api.js")).getProducts();
}
export async function getPortfolio() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPortfolio();
  return (await import("./api.js")).getPortfolio();
}
export async function getPortfolioItem(id) {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPortfolioItem(id);
  return (await import("./api.js")).getPortfolioItem(id);
}
export async function getPartners() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPartners();
  return (await import("./api.js")).getPartners();
}
export async function getTestimonials() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getTestimonials();
  return (await import("./api.js")).getTestimonials();
}
export async function getStats() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getStats();
  return (await import("./api.js")).getStats();
}
export async function getNav() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getNav();
  return (await import("./api.js")).getNav();
}
export async function getPosts() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPosts();
  return (await import("./api.js")).getPosts();
}
export async function getPublishedPosts() {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPublishedPosts();
  return (await import("./api.js")).getPosts();
}
export async function getPost(id) {
  if (import.meta.env.SSR) return (await import("./queries.js")).getPost(id);
  return (await import("./api.js")).getPost(id);
}
