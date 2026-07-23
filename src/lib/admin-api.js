// Helper fetch untuk mutasi (admin). Cookie session otomatis terkirim
// karena same-origin. Melempar Error bila response tidak ok.
async function send(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || `Request gagal (${res.status})`);
  }
  return res.json();
}

export const post = (path, body) => send("POST", path, body);
export const put = (path, body) => send("PUT", path, body);
export const del = (path, body) => send("DELETE", path, body);

export async function upload(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.message || `Upload gagal (${res.status})`);
  }
  return res.json();
}
