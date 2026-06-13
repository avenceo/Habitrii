// Habitrii — Cloudflare Turnstile Verification Endpoint
// Control 2.4: CAPTCHA on the email gate
//
// Validates that a Turnstile token is genuine before forwarding the
// user's email to Audos. Bots cannot pass this check.
//
// Setup:
//   1. Go to: https://dash.cloudflare.com → Turnstile → Add site
//   2. Domain: habitrii.aven4life.com
//   3. Widget type: Managed (invisible to real users)
//   4. Copy Site Key  → add to Vercel env as: VITE_TURNSTILE_SITE_KEY  (public)
//   5. Copy Secret Key → add to Vercel env as: TURNSTILE_SECRET_KEY     (sensitive)
//   6. In App.jsx: import @marsidev/react-turnstile, render <Turnstile> on the email gate,
//      pass the token to this endpoint before submitting email to Audos.

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// CORS allowlist — same as api/chat.js
const ALLOWED_ORIGINS = [
  "https://habitrii.aven4life.com",
  "http://localhost:5173",
  "http://localhost:4173",
];

export default async function handler(req, res) {

  // ── CORS ──────────────────────────────────────────────────────────────────
  const origin = req.headers.origin ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error(JSON.stringify({
      level: "error", event: "turnstile_not_configured",
      path: "/api/verify", timestamp: new Date().toISOString(),
    }));
    return res.status(500).json({ error: "Verification service not configured" });
  }

  const { token, email } = req.body ?? {};

  // Validate inputs
  if (!token || typeof token !== "string" || token.length > 2048) {
    return res.status(400).json({ error: "Invalid request" });
  }
  if (!email || typeof email !== "string" || email.length > 254) {
    return res.status(400).json({ error: "Invalid request" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // ── Verify Turnstile token with Cloudflare ────────────────────────────────
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? "";

  const formData = new URLSearchParams();
  formData.append("secret",   secretKey);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  try {
    const cfRes = await fetch(TURNSTILE_VERIFY_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    formData.toString(),
    });

    const cfData = await cfRes.json();

    if (!cfData.success) {
      console.warn(JSON.stringify({
        level: "warn", event: "turnstile_failed",
        codes: cfData["error-codes"],
        path: "/api/verify", timestamp: new Date().toISOString(),
      }));
      return res.status(403).json({ error: "Verification failed. Please try again." });
    }

    // ── Token valid — forward email to Audos ───────────────────────────────
    // TODO: Replace this section with your actual Audos email-gate call.
    // The email has been verified as human-submitted at this point.
    // Example:
    //   const audosRes = await submitEmailToAudos(email);
    //   return res.status(200).json({ success: true, ...audosRes });

    console.log(JSON.stringify({
      level: "info", event: "turnstile_passed",
      path: "/api/verify", timestamp: new Date().toISOString(),
    }));

    return res.status(200).json({ success: true, verified: true });

  } catch (err) {
    console.error(JSON.stringify({
      level: "error", event: "turnstile_verify_threw",
      message: err.message,
      path: "/api/verify", timestamp: new Date().toISOString(),
    }));
    return res.status(500).json({ error: "Verification service error" });
  }
}
