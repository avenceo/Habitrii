// SETUP: Run `npm install stripe` then redeploy to Vercel
// Required env vars — set in Vercel Dashboard → Settings → Environment Variables:
//   STRIPE_SECRET_KEY               — Stripe secret key (sk_live_... or sk_test_...)
//   STRIPE_GROWTH_PRICE_IDS         — comma-separated Stripe Price IDs for Growth tier
//   STRIPE_TRANSFORMATION_PRICE_IDS — comma-separated Stripe Price IDs for Transformation tier

// IMPORTANT: If a Stripe webhook endpoint (/api/webhook) is added in the future,
// it MUST verify the Stripe-Signature header using:
//   stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
// Never process a Stripe webhook without signature verification.
// See Control 3.1 in AVEN_LLC_Habitrii_Cybersecurity_Controls_Plan.

// ── STEP 1: CORS HARDENING ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://habitrii.aven4life.com",
  "http://localhost:5173",
];

// ── STEP 2: RATE LIMITING ─────────────────────────────────────────────────
// In-memory Map — resets on cold start.
// For production scale, replace with @upstash/ratelimit.
const rateLimitMap = new Map(); // ip → { count, windowStart }
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── STEP 5: STRUCTURED LOGGING ────────────────────────────────────────────
// Never log full email — log only the domain portion.
function log(event, extra = {}) {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...extra }));
}

module.exports = async function handler(req, res) {

  // ── STEP 1: CORS ──────────────────────────────────────────────────────────
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    log("cors_rejected", { origin: origin || "none", route: "/api/auth" });
    return res.status(403).end();
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
    log("rate_limit_hit", { ip, route: "/api/auth" });
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ tier: "foundation" });
  }

  // ── STEP 3: INPUT VALIDATION ──────────────────────────────────────────────
  // Fail open — invalid input returns foundation tier, never an error message.
  // This ensures no user is accidentally locked out due to a validation edge case.
  let rawEmail;
  try {
    rawEmail = req.body?.email;
  } catch {
    return res.status(400).json({ tier: "foundation" });
  }

  if (!rawEmail || typeof rawEmail !== "string" || !rawEmail.includes("@")) {
    return res.status(400).json({ tier: "foundation" });
  }

  const normalizedEmail = rawEmail.toLowerCase().trim();
  if (normalizedEmail.length > 254) {
    return res.status(400).json({ tier: "foundation" });
  }

  const emailDomain = normalizedEmail.split("@")[1] || "unknown";

  // ── STEP 4: STRIPE LOOKUP ─────────────────────────────────────────────────
  // All Stripe errors fail open → foundation tier. Never block a user on API error.
  let stripe;
  try {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    log("stripe_init_error", { message: err.message });
    log("auth_check", { emailDomain, tier: "foundation" });
    return res.status(200).json({ tier: "foundation" });
  }
    if (!stripe) return res.status(200).json({ tier: "foundation" });

  try {
    // 1. Look up customer by email
    const customers = await stripe.customers.list({ email: normalizedEmail, limit: 1 });
    if (!customers.data.length) {
      log("auth_check", { emailDomain, tier: "foundation" });
      return res.status(200).json({ tier: "foundation" });
    }

    const customer = customers.data[0];

    // 2. Look up active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 5,
    });

    if (!subscriptions.data.length) {
      log("auth_check", { emailDomain, tier: "foundation" });
      return res.status(200).json({ tier: "foundation" });
    }

    // 3. Parse tier price ID lists from env
    const transformationIds = (process.env.STRIPE_TRANSFORMATION_PRICE_IDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const growthIds = (process.env.STRIPE_GROWTH_PRICE_IDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 4. Walk subscriptions — check metadata.tier and each item's price.id
    let resolvedTier = "foundation";
    outer: for (const sub of subscriptions.data) {
      // Check subscription-level metadata first
      if (sub.metadata?.tier === "transformation") { resolvedTier = "transformation"; break outer; }
      if (sub.metadata?.tier === "growth" && resolvedTier !== "transformation") { resolvedTier = "growth"; }

      // Check each line-item price ID
      for (const item of sub.items?.data || []) {
        const priceId = item.price?.id;
        if (priceId && transformationIds.includes(priceId)) { resolvedTier = "transformation"; break outer; }
        if (priceId && growthIds.includes(priceId) && resolvedTier !== "transformation") { resolvedTier = "growth"; }
      }
    }

    log("auth_check", { emailDomain, tier: resolvedTier });
    return res.status(200).json({ tier: resolvedTier });

  } catch (err) {
    // Any Stripe API error → fail open, never block the user
    log("stripe_error", { message: err.message });
    log("auth_check", { emailDomain, tier: "foundation" });
    return res.status(200).json({ tier: "foundation" });
  }
};
