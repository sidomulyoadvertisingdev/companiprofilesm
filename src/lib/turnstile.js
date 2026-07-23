const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) {
    console.warn("[turnstile] TURNSTILE_SECRET not set, skipping verification");
    return true;
  }

  if (!token) {
    console.warn("[turnstile] No token provided");
    return false;
  }

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
    if (!data.success) {
      console.error("[turnstile] Verification failed:", JSON.stringify(data["error-codes"]));
    }
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] Request error:", err.message);
    return false;
  }
}
