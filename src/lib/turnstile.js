const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set, skipping verification");
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip || "",
      }),
    });

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification failed:", err.message);
    return false;
  }
}
