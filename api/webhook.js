// Habitrii — Stripe Webhook Handler
// Control 3.1: Webhook signature verification
//
// Verifies that incoming webhook events genuinely originate from Stripe
// before processing them. Without this, an attacker can POST a fake
// 'payment_intent.succeeded' and trigger unauthorized access.
//
// Setup:
//   1. Stripe Dashboard → Developers → Webhooks → Add endpoint
//   2. Endpoint URL: https://habitrii.aven4life.com/api/webhook
//   3. Events to listen for: payment_intent.succeeded, customer.subscription.created,
//      customer.subscription.updated, customer.subscription.deleted,
//      invoice.payment_failed
//   4. Copy the Signing secret (starts with whsec_)
//   5. Add to Vercel env vars as: STRIPE_WEBHOOK_SECRET (mark Sensitive)

import Stripe from "stripe";

// Vercel must receive the raw body as a Buffer for signature verification.
// Add this export to disable the default body parser.
export const config = {
  api: {
    bodyParser: false,
  },
};

// ── Helper: read raw body as Buffer ─────────────────────────────────────────
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end",  () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// ── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret  = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !stripeSecret) {
    console.error(JSON.stringify({
      level: "error",
      event: "webhook_config_missing",
      path:  "/api/webhook",
      timestamp: new Date().toISOString(),
    }));
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

  // ── Read raw body — required for signature verification ──────────────────
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error(JSON.stringify({
      level: "error", event: "webhook_body_read_failed",
      path: "/api/webhook", timestamp: new Date().toISOString(),
    }));
    return res.status(400).json({ error: "Failed to read request body" });
  }

  // ── Verify Stripe signature ───────────────────────────────────────────────
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.warn(JSON.stringify({
      level: "warn",
      event: "webhook_signature_invalid",
      path: "/api/webhook",
      timestamp: new Date().toISOString(),
      message: err.message,
    }));
    return res.status(400).json({ error: "Invalid signature" });
  }

  // ── Route verified events ─────────────────────────────────────────────────
  console.log(JSON.stringify({
    level: "info",
    event: "webhook_received",
    stripeEvent: event.type,
    path: "/api/webhook",
    timestamp: new Date().toISOString(),
  }));

  try {
    switch (event.type) {

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        // TODO: Unlock paid tier access for the customer
        // Reference: paymentIntent.customer, paymentIntent.metadata
        console.log(JSON.stringify({
          level: "info", event: "payment_succeeded",
          customerId: paymentIntent.customer,
          path: "/api/webhook", timestamp: new Date().toISOString(),
        }));
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        // TODO: Update user's tier in Audos based on subscription.items.data[0].price.id
        console.log(JSON.stringify({
          level: "info", event: "subscription_updated",
          customerId: subscription.customer,
          status: subscription.status,
          path: "/api/webhook", timestamp: new Date().toISOString(),
        }));
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        // TODO: Downgrade user to free tier in Audos
        console.log(JSON.stringify({
          level: "info", event: "subscription_cancelled",
          customerId: subscription.customer,
          path: "/api/webhook", timestamp: new Date().toISOString(),
        }));
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        // TODO: Send payment failure notification to customer
        console.log(JSON.stringify({
          level: "warn", event: "payment_failed",
          customerId: invoice.customer,
          path: "/api/webhook", timestamp: new Date().toISOString(),
        }));
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt to stop Stripe retries
        break;
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error(JSON.stringify({
      level: "error", event: "webhook_handler_threw",
      message: err.message,
      stripeEvent: event.type,
      path: "/api/webhook", timestamp: new Date().toISOString(),
    }));
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
