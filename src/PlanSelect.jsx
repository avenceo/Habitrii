// Habitrii — Plan selection (Phase 04)
// Shown after the personality quiz. Foundation continues free (30-day full trial,
// Mind & Money free forever); paid plans go to Stripe Checkout.

import { useState } from "react";

const C = {
  bg: "#57b7a7", dark: "#0d1f1d", yellow: "#f5d924",
  text: "#0d1f1d", textOnDark: "#ffffff", sub: "rgba(255,255,255,0.72)",
};

const cardStyle = (highlight) => ({
  background: highlight ? "#13302c" : "#0d1f1d",
  border: highlight ? "2px solid " + C.yellow : "2px solid rgba(255,255,255,0.08)",
  borderRadius: "16px", padding: "24px 22px", textAlign: "left",
  display: "flex", flexDirection: "column", gap: "10px",
  boxShadow: "0 8px 32px rgba(13,31,29,0.25)",
});
const btn = (primary) => ({
  width: "100%", padding: "13px 16px", borderRadius: "10px",
  border: primary ? "none" : "1.5px solid rgba(255,255,255,0.25)",
  background: primary ? C.yellow : "transparent",
  color: primary ? C.dark : C.textOnDark,
  fontSize: "15px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
});
const price = { fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 };
const sub = { fontSize: "13px", color: C.sub, lineHeight: 1.55, margin: 0 };

const PLANS = [
  {
    id: "foundation", name: "Foundation", monthly: "Free",
    blurb: "Full access for 30 days, then Mind & Money stays free forever.",
  },
  {
    id: "growth", name: "Growth", monthly: "$9.99/mo", yearly: "$79/yr",
    blurb: "Everything in Foundation plus Budgeting Foundations and Debt & Credit.",
  },
  {
    id: "transformation", name: "Transformation", monthly: "$19.99/mo", yearly: "$149/yr",
    blurb: "The whole journey: Safety & Stability plus Advanced & Values.",
  },
];

export default function PlanSelect({ email, onFree }) {
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [yearly, setYearly] = useState(false);

  const checkout = async (plan) => {
    setBusy(plan); setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: yearly ? "yearly" : "monthly", email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.href = data.url;
    } catch (e) {
      setError(e.message);
      setBusy(null);
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "36px 24px", boxSizing: "border-box",
    }}>
      <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", color: C.dark, margin: "0 0 6px" }}>HABITRII</p>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Choose your journey</h1>
          <p style={{ fontSize: "15px", color: "rgba(13,31,29,0.7)", margin: 0 }}>
            Start free — every new account gets 30 days of full access.
          </p>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)}
              style={{ accentColor: C.dark, width: "15px", height: "15px", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", color: C.dark, fontWeight: 600 }}>Annual billing (save up to 38%)</span>
          </label>
        </div>

        {PLANS.map((p) => (
          <div key={p.id} style={cardStyle(p.id === "foundation")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "19px", fontWeight: 700, color: "#fff", margin: 0 }}>{p.name}</h2>
              <p style={price}>{p.id === "foundation" ? p.monthly : (yearly ? p.yearly : p.monthly)}</p>
            </div>
            <p style={sub}>{p.blurb}</p>
            {p.id === "foundation" ? (
              <button style={btn(true)} onClick={onFree}>Start my free month →</button>
            ) : (
              <button style={btn(false)} disabled={!!busy} onClick={() => checkout(p.id)}>
                {busy === p.id ? "Opening checkout…" : `Choose ${p.name}`}
              </button>
            )}
          </div>
        ))}

        {error && <p style={{ fontSize: "13px", color: "#7f1d1d", background: "#fecaca", borderRadius: "8px", padding: "10px 14px", margin: 0 }}>{error}</p>}
        <p style={{ fontSize: "12px", color: "rgba(13,31,29,0.6)", textAlign: "center", margin: 0 }}>
          Cancel anytime. Educational content only — not financial advice.
        </p>
      </div>
    </div>
  );
}
