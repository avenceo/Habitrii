// Habitrii — VCDPA account deletion (Phase 05)
// One authenticated request permanently removes the user from BOTH systems:
//   Supabase (personality, subscriptions, profiles rows + auth user)
//   Mailchimp (permanent delete — required for VCDPA, not just archive)
// Also cancels any active Stripe subscription. Stripe's own billing records
// are retained by Stripe for financial/legal compliance (VCDPA exemption).
//
// Env (per environment):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//   STRIPE_SECRET_KEY (optional — subscription cancel is best-effort)
//   MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX (best-effort)

import crypto from "crypto";

const ALLOWED_ORIGINS = [
  "https://habitrii.aven4life.com",
  "https://staging.habitrii.aven4life.com",
  "http://localhost:5173",
];

function log(level, event, extra = {}) {
  console.log(JSON.stringify({ level, event, path: "/api/delete-account", timestamp: new Date().toISOString(), ...extra }));
}

const sbUrl = () => process.env.VITE_SUPABASE_URL;

// New-style sb_secret_ keys are not JWTs: apikey header only.
// Legacy JWT service_role keys also go in the Authorization header.
function sbAdminHeaders() {
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const headers = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  return headers;
}

async function getUserFromToken(token) {
  const anon = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();
  const res = await fetch(`${sbUrl()}/auth/v1/user`, {
    headers: { apikey: anon, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const user = await res.json();
  return user && user.id ? user : null;
}

async function sbDelete(pathAndQuery) {
  const res = await fetch(`${sbUrl()}${pathAndQuery}`, { method: "DELETE", headers: sbAdminHeaders() });
  if (!res.ok) log("error", "supabase_row_delete_failed", { target: pathAndQuery.split("?")[0], status: res.status });
  return res.ok;
}

async function deleteAuthUser(userId) {
  // Try apikey-only first (new keys); retry with Bearer for setups that require it.
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  let res = await fetch(`${sbUrl()}/auth/v1/admin/users/${userId}`, { method: "DELETE", headers: sbAdminHeaders() });
  if (res.status === 401 || res.status === 403) {
    res = await fetch(`${sbUrl()}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    });
  }
  if (!res.ok) log("error", "auth_user_delete_failed", { status: res.status });
  return res.ok;
}

async function cancelStripeSubscription(userId) {
  try {
    const res = await fetch(
      `${sbUrl()}/rest/v1/subscriptions?user_id=eq.${userId}&select=stripe_subscription_id,status`,
      { headers: sbAdminHeaders() }
    );
    const rows = await res.json();
    const subId = Array.isArray(rows) && rows[0] ? rows[0].stripe_subscription_id : null;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!subId || !stripeKey) return;
    const cancel = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${stripeKey}` },
    });
    log(cancel.ok ? "info" : "warn", "stripe_subscription_cancel", { ok: cancel.ok, status: cancel.status });
  } catch (e) {
    log("warn", "stripe_subscription_cancel_error", { message: e.message });
  }
}

async function mailchimpPermanentDelete(email) {
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX } = process.env;
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) return;
  try {
    const hash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
    const res = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${hash}/actions/delete-permanent`,
      { method: "POST", headers: { Authorization: `Bearer ${MAILCHIMP_API_KEY}` } }
    );
    // 204 = deleted; 404 = was never on the list — both fine for VCDPA.
    log(res.ok || res.status === 404 ? "info" : "warn", "mailchimp_permanent_delete", { status: res.status });
  } catch (e) {
    log("warn", "mailchimp_delete_error", { message: e.message });
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!sbUrl() || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_ANON_KEY) {
    log("error", "delete_config_missing");
    return res.status(500).json({ error: "Not configured" });
  }

  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Not signed in" });

  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ error: "Invalid session" });

  log("info", "deletion_requested", { userId: user.id });

  // 1) Cancel Stripe subscription (needs the subscriptions row, so do it first)
  await cancelStripeSubscription(user.id);

  // 2) Application rows
  await sbDelete(`/rest/v1/personality?user_id=eq.${user.id}`);
  await sbDelete(`/rest/v1/subscriptions?user_id=eq.${user.id}`);
  await sbDelete(`/rest/v1/profiles?id=eq.${user.id}`);

  // 3) Auth user (this is the point of no return)
  const authDeleted = await deleteAuthUser(user.id);
  if (!authDeleted) return res.status(500).json({ error: "Deletion incomplete — please contact support@aven4life.com" });

  // 4) Mailchimp permanent delete (best-effort, VCDPA)
  if (user.email) await mailchimpPermanentDelete(user.email);

  log("info", "deletion_complete", { userId: user.id });
  return res.status(200).json({ deleted: true });
}
