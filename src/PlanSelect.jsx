// Habitrii — Plan selection (Phase 04)
// Shown after the personality quiz. Foundation = first 3 Mind & Money lessons free forever,
// Mind & Money free forever); paid plans go to Stripe Checkout.

import { useState } from "react";

// Per-plan availability. Growth opened July 18, 2026 — Budgeting Foundations
// content complete, so the card's promise is real. Transformation flips at
// Safety & Stability launch (WBS 4.4): one line, right here.
const PLAN_AVAILABLE = { foundation: true, growth: true, transformation: false };

const C = {
  bg: "#57b7a7", dark: "#232321", yellow: "#f5d924",
  text: "#232321", textOnDark: "#232321", sub: "rgba(35,35,33,0.9)",
};

const PLAN_TONE = {
  foundation:     { background: "#ffffff", boxShadow: "0 4px 18px rgba(255,255,255,0.6)" },
  growth:         { background: "#f5d924", boxShadow: "0 4px 18px rgba(245,217,36,0.5)" },
  transformation: { background: "#57b7a7", border: "2px solid #ffffff" },
};
const cardStyle = (id) => ({
  ...(PLAN_TONE[id] || PLAN_TONE.foundation),
  borderRadius: "16px", padding: "24px 22px", textAlign: "left",
  display: "flex", flexDirection: "column", gap: "10px",
});
const btn = (primary) => ({
  width: "100%", padding: "13px 16px", borderRadius: "10px",
  border: primary ? "none" : "1.5px solid rgba(35,35,33,0.4)",
  background: primary ? C.yellow : "#ffffff",
  color: C.dark,
  fontSize: "15px", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
  boxShadow: primary ? "0 2px 12px rgba(245,217,36,0.45)" : "none",
  transition: "all 0.15s ease",
});
// Glow for CTAs sitting on colored cards (yellow glow vanishes on the yellow
// Growth card — white reads as the same design family there).
const btnGlowOnColor = { boxShadow: "0 2px 14px rgba(255,255,255,0.85)" };
const price = { fontSize: "26px", fontWeight: 700, color: C.dark, margin: 0 };
const sub = { fontSize: "13px", color: C.sub, lineHeight: 1.55, margin: 0 };

const PLANS = [
  {
    id: "foundation", name: "Foundation", monthly: "Free",
    blurb: "All 8 Mind & Money lessons free for your first month — your first 3 stay free forever. No credit card.",
  },
  {
    id: "growth", name: "Growth", monthly: "$9.99/mo", yearly: "$79/yr",
    blurb: "The complete Growth library, today: Mind & Money (8 lessons), Budgeting Foundations (6 lessons), and Debt & Credit (6 lessons).",
  },
  {
    id: "transformation", name: "Transformation", monthly: "$19.99/mo", yearly: "$149/yr",
    blurb: "Everything in Growth, plus Safety & Stability and Advanced & Values as they launch.",
  },
];

export default function PlanSelect({ email, onFree, onBack }) {
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
        {onBack && (
          <button onClick={onBack} style={{
            background: C.yellow, color: C.dark, border: "none", borderRadius: "10px",
            padding: "9px 18px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: "0.2px",
            boxShadow: "0 2px 8px rgba(245,217,36,0.3)", transition: "all 0.15s ease",
          }}>← Back</button>
        )}
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", color: C.dark, margin: "0 0 6px" }}>HABITRII</p>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: C.dark, margin: "0 0 8px" }}>Choose your journey</h1>
          <p style={{ fontSize: "15px", color: "rgba(35,35,33,0.7)", margin: 0 }}>
            Start free — your first 3 lessons are on us, forever.
          </p>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "12px", cursor: "pointer" }}>
            <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)}
              style={{ accentColor: C.dark, width: "15px", height: "15px", cursor: "pointer" }} />
            <span style={{ fontSize: "13px", color: C.dark, fontWeight: 600 }}>Annual billing (save up to 38%)</span>
          </label>
        </div>

        {PLANS.map((p) => (
          <div key={p.id} style={cardStyle(p.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "19px", fontWeight: 700, color: C.dark, margin: 0 }}>{p.name}</h2>
              <p style={price}>{p.id === "foundation" ? p.monthly : (yearly ? p.yearly : p.monthly)}</p>
            </div>
            <p style={sub}>{p.blurb}</p>
            {p.id === "foundation" ? (
              <button style={btn(true)} onClick={onFree}>Start for free →</button>
            ) : PLAN_AVAILABLE[p.id] ? (
              <button style={{ ...btn(false), ...btnGlowOnColor }} disabled={!!busy} onClick={() => checkout(p.id)}>
                {busy === p.id ? "Opening checkout…" : `Choose ${p.name} →`}
              </button>
            ) : (
              <div style={{
                ...btn(false), textAlign: "center", boxSizing: "border-box", cursor: "default",
                background: "rgba(35,35,33,0.07)", color: "rgba(35,35,33,0.6)",
                border: "1.5px solid rgba(35,35,33,0.22)", fontWeight: 700,
                letterSpacing: "1px", textTransform: "uppercase", fontSize: "13px",
              }}>
                Available at launch
              </div>
            )}
          </div>
        ))}

        {error && <p style={{ fontSize: "13px", color: "#7f1d1d", background: "#fecaca", borderRadius: "8px", padding: "10px 14px", margin: 0 }}>{error}</p>}
        <p style={{ fontSize: "12px", color: "rgba(35,35,33,0.6)", textAlign: "center", margin: 0 }}>
          Cancel anytime. Educational content only — not financial advice.
        </p>
      </div>
    </div>
  );
}
