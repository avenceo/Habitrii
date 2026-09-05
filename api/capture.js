// ════════════════════════════════════════════════════════════════════════════
// api/capture.js — Vercel Serverless Function
// Email capture: CORS → rate limit → input validation → CAPTCHA → Mailchimp
//
// Required environment variables (set in Vercel project settings):
//   MAILCHIMP_API_KEY       – your Mailchimp API key (e.g. abc123…-us12)
//   MAILCHIMP_LIST_ID       – audience/list ID to subscribe to
//   MAILCHIMP_SERVER_PREFIX – data center prefix, e.g. "us12"
//   TURNSTILE_SECRET_KEY    – Cloudflare Turnstile secret key
//
// Money Mirror (Sept 2026): optional `tags` (string[], ≤5, each [a-z0-9-]{1,50})
// and `source` (log-only) are accepted and stamped on the Mailchimp member so
// Money Mirror / blog leads can be segmented for lifecycle email. Tags are
// auto-created by Mailchimp. Callers sending only { email, captchaToken }
// are unaffected.
// ════════════════════════════════════════════════════════════════════════════

// ── STEP 1: CORS HARDENING ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://habitrii.aven4life.com",
  "https://staging.habitrii.aven4life.com",
  "http://localhost:5173",
];

// ── STEP 2: RATE LIMITING ─────────────────────────────────────────────────
// In-memory map — resets on cold start. For production, replace with
// @upstash/ratelimit + Redis for persistence across function instances.
const rateLimitMap = new Map(); // ip → { count, resetAt }
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── STEP 6: STRUCTURED LOGGING PATTERN ────────────────────────────────────
// Every log entry is valid JSON. Email address is NEVER logged.
function log(event, ip, extra = {}) {
  console.log(JSON.stringify({ event, ip, timestamp: new Date().toISOString(), ...extra }));
}

// Tag allow-list — lowercase alphanumerics and hyphens only, so nothing
// user-controlled reaches Mailchimp unsanitized.
const TAG_RE = /^[a-z0-9-]{1,50}$/;
const MAX_TAGS = 5;

export default async function handler(req, res) {

  // ── STEP 1: CORS ──────────────────────────────────────────────────────────
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    // Unknown or missing origin — block immediately
    return res.status(403).end();
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // ── STEP 2: RATE LIMITING ─────────────────────────────────────────────────
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (!checkRateLimit(ip)) {
    log("rate_limit_exceeded", ip);
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ error: "Too many requests" });
  }

  // ── STEP 3: INPUT VALIDATION ──────────────────────────────────────────────
  let email, captchaToken, tags, source;
  try {
    ({ email, captchaToken, tags, source } = req.body ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }

  // Strip HTML tags to prevent stored XSS
  if (typeof email === "string") {
    email = email.replace(/<[^>]*>/g, "").trim();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !email ||
    typeof email !== "string" ||
    email.length > 254 ||
    !emailRegex.test(email)
  ) {
    // Never specify which check failed — generic error only
    return res.status(400).json({ error: "Invalid request" });
  }

  if (!captchaToken || typeof captchaToken !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  }

  // Optional tags/source — anything failing the allow-list is silently dropped
  const safeTags = Array.isArray(tags)
    ? tags.filter((t) => typeof t === "string" && TAG_RE.test(t)).slice(0, MAX_TAGS)
    : [];
  const safeSource = typeof source === "string" ? source.slice(0, 40) : "app";

  // ── STEP 4: CAPTCHA VERIFICATION ──────────────────────────────────────────
  let turnstileData;
  try {
    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
          remoteip: ip,
        }),
      }
    );
    turnstileData = await turnstileRes.json();
  } catch (err) {
    log("captcha_fetch_error", ip, { message: err.message });
    return res.status(503).json({ error: "Capture failed" });
  }

  if (!turnstileData.success) {
    log("captcha_failed", ip);
    return res.status(403).json({ error: "Invalid request" });
  }

  // ── STEP 5: MAILCHIMP SUBSCRIPTION ────────────────────────────────────────
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX } =
    process.env;

  // Basic auth: "anystring:<API_KEY>" base64-encoded — no new npm deps needed
  const authHeader = `Basic ${Buffer.from(
    `anystring:${MAILCHIMP_API_KEY}`
  ).toString("base64")}`;
  const mcBase = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}`;

  try {
    const mcPayload = { email_address: email, status: "subscribed" };
    if (safeTags.length) mcPayload.tags = safeTags;

    const mcRes = await fetch(`${mcBase}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(mcPayload),
    });

    const mcData = await mcRes.json();

    // "Member Exists" (400 with title "Member Exists") is not an error
    if (!mcRes.ok && mcData.title !== "Member Exists") {
      log("mailchimp_error", ip, { status: mcRes.status, source: safeSource });
      // Never expose Mailchimp details to the client
      return res.status(500).json({ error: "Capture failed" });
    }

    // Existing member: still apply the new tags so segmentation stays accurate
    if (!mcRes.ok && safeTags.length) {
      try {
        const { createHash } = await import("crypto");
        const subscriberHash = createHash("md5").update(email.toLowerCase()).digest("hex");
        await fetch(`${mcBase}/members/${subscriberHash}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: authHeader },
          body: JSON.stringify({ tags: safeTags.map((name) => ({ name, status: "active" })) }),
        });
      } catch (tagErr) {
        log("mailchimp_tag_error", ip, { message: tagErr.message });
      }
    }

    // ── STEP 6: LOG SUCCESS ─────────────────────────────────────────────────
    log("capture_success", ip, { source: safeSource, tags: safeTags.length });
    return res.status(200).json({ ok: true });

  } catch (err) {
    log("mailchimp_exception", ip, { message: err.message });
    return res.status(500).json({ error: "Capture failed" });
  }
}
