export const prerender = false;

const nav = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Catalog", path: "/catalog" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export async function GET() {
  return new Response(JSON.stringify({ data: nav }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
