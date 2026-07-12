// Habitrii — Stripe Checkout session creation (Phase 04/05)
// Env (per environment; Preview holds test-mode values):
//   STRIPE_SECRET_KEY                 sk_test_/sk_live_
//   STRIPE_GROWTH_PRICE_IDS           "price_monthly,price_yearly"
//   STRIPE_TRANSFORMATION_PRICE_IDS   "price_monthly,price_yearly"

const ALLOWED_ORIGINS = [
  "https://habitrii.aven4life.com",
  "https://staging.habitrii.aven4life.com",
  "http://localhost:5173",
];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: "Payments are not configured." });

  const { plan, interval, email } = req.body ?? {};
  const priceEnv = {
    growth: process.env.STRIPE_GROWTH_PRICE_IDS,
    transformation: process.env.STRIPE_TRANSFORMATION_PRICE_IDS,
  }[plan];
  if (!priceEnv) return res.status(400).json({ error: "Unknown plan." });

  const [monthly, yearly] = priceEnv.split(",").map((s) => s.trim());
  const priceId = interval === "yearly" ? yearly : monthly;
  if (!priceId) return res.status(400).json({ error: "Unknown billing interval." });

  const emailOk = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

  const base = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  try {
    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${base}/?checkout=success`,
      cancel_url: `${base}/?checkout=cancelled`,
      allow_promotion_codes: "true",
    });
    if (emailOk) params.set("customer_email", email);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      console.error("checkout error:", data?.error?.type);
      return res.status(502).json({ error: "Could not start checkout. Please try again." });
    }
    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error("checkout threw:", err.message);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
