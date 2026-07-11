// Habitrii — Stripe Webhook Handler (Phase 05)
// Verifies signatures, then syncs subscription state into Supabase
// (subscriptions + profiles.tier via service role) and updates Mailchimp tags.
//
// Env:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (whsec_, per environment)
//   STRIPE_GROWTH_PRICE_IDS, STRIPE_TRANSFORMATION_PRICE_IDS ("monthly,yearly")
//   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (per environment)
//   MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX (optional)

import Stripe from "stripe";
import crypto from "crypto";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const log = (level, event, extra = {}) =>
  console.log(JSON.stringify({ level, event, path: "/api/webhook", timestamp: new Date().toISOString(), ...extra }));

// ── Price → tier mapping ─────────────────────────────────────────────────────
function priceToTier(priceId) {
  const inList = (env) => (env || "").split(",").map((s) => s.trim()).includes(priceId);
  if (inList(process.env.STRIPE_GROWTH_PRICE_IDS)) return "growth";
  if (inList(process.env.STRIPE_TRANSFORMATION_PRICE_IDS)) return "transformation";
  return null;
}

// ── Supabase admin REST helpers (service role bypasses RLS) ─────────────────
function sbHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  };
}
const sbUrl = () => process.env.VITE_SUPABASE_URL;

async function findProfileByEmail(email) {
  const res = await fetch(
    `${sbUrl()}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,tier`,
    { headers: sbHeaders() }
  );
  const rows = await res.json();
  if (!Array.isArray(rows) || !rows[0]) {
    log("warn", "profile_lookup_debug", {
      httpStatus: res.status,
      isArray: Array.isArray(rows),
      rowCount: Array.isArray(rows) ? rows.length : null,
      errCode: rows && !Array.isArray(rows) && rows.code ? rows.code : null,
    });
  }
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function syncSupabase(profileId, fields) {
  const { tier, status, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd } = fields;
  const subRes = await fetch(`${sbUrl()}/rest/v1/subscriptions`, {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify({
      user_id: profileId,
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      tier,
      status,
      current_period_end: currentPeriodEnd || null,
    }),
  });
  if (!subRes.ok) log("error", "supabase_subscription_upsert_failed", { status: subRes.status });

  const profRes = await fetch(`${sbUrl()}/rest/v1/profiles?id=eq.${profileId}`, {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify({ tier }),
  });
  if (!profRes.ok) log("error", "supabase_profile_update_failed", { status: profRes.status });
}

// ── Mailchimp tier tags (best effort, never blocks) ─────────────────────────
async function syncMailchimpTags(email, tier) {
  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX } = process.env;
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) return;
  try {
    const hash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
    const tags = ["foundation", "growth", "transformation"].map((t) => ({
      name: `tier:${t}`,
      status: t === tier ? "active" : "inactive",
    }));
    await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${hash}/tags`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
        },
        body: JSON.stringify({ tags }),
      }
    );
    log("info", "mailchimp_tags_synced", { tier });
  } catch (err) {
    log("warn", "mailchimp_tags_failed", { message: err.message });
  }
}

// ── Shared: apply a subscription state to Supabase + Mailchimp ──────────────
async function applySubscription(stripe, subscription) {
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const mappedTier = priceToTier(priceId);
  const statusMap = { active: "active", trialing: "active", past_due: "past_due" };
  const status = statusMap[subscription.status] || "cancelled";
  const cancelled = status === "cancelled";
  const tier = cancelled || !mappedTier ? "foundation" : mappedTier;

  const customer = await stripe.customers.retrieve(subscription.customer);
  const email = customer?.email;
  if (!email) { log("warn", "customer_missing_email", { customerId: subscription.customer }); return; }

  const profile = await findProfileByEmail(email);
  if (!profile) { log("warn", "profile_not_found_for_webhook"); return; }

  await syncSupabase(profile.id, {
    tier,
    status,
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  });
  await syncMailchimpTags(email, tier);
  log("info", "tier_synced", { tier, status });
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !stripeSecret || !process.env.SUPABASE_SERVICE_ROLE_KEY || !sbUrl()) {
    log("error", "webhook_config_missing", {
      hasWebhookSecret: Boolean(webhookSecret),
      hasStripeSecret: Boolean(stripeSecret),
      hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSupabaseUrl: Boolean(sbUrl()),
    });
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

  let rawBody;
  try { rawBody = await getRawBody(req); }
  catch { log("error", "webhook_body_read_failed"); return res.status(400).json({ error: "Failed to read request body" }); }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, req.headers["stripe-signature"], webhookSecret);
  } catch (err) {
    log("warn", "webhook_signature_invalid", { message: err.message });
    return res.status(400).json({ error: "Invalid signature" });
  }

  log("info", "webhook_received", { stripeEvent: event.type });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await applySubscription(stripe, subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await applySubscription(stripe, event.data.object);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        log("warn", "payment_failed", { customerId: invoice.customer });
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          await applySubscription(stripe, subscription);
        }
        break;
      }
      default:
        log("info", "webhook_ignored", { stripeEvent: event.type });
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    log("error", "webhook_processing_failed", { message: err.message });
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
