import { useState } from "react";

// ─── Brand Colors ──────────────────────────────────────────────────────────────
const C = {
  bg:         "#57b7a7",
  dark:       "#1a3330",
  mid:        "#2a4a44",
  card:       "#ffffff",
  cardLight:  "#f0faf8",
  yellow:     "#f5d924",
  teal:       "#57b7a7",
  gray:       "#a09e98",
  text:       "#0d1f1d",
  textSub:    "rgba(13,31,29,0.65)",
  textMut:    "rgba(13,31,29,0.45)",
  textOnDark: "#ffffff",
};

// ─── Shared Button Bases ───────────────────────────────────────────────────────
const btnYellowBase = {
  background: C.yellow, color: C.dark, border: "none", borderRadius: "12px",
  fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  letterSpacing: "0.2px", boxShadow: "0 2px 12px rgba(245,217,36,0.35)",
  transition: "all 0.15s ease",
};
const btnOutlineBase = {
  background: "transparent", color: C.dark,
  border: `2px solid rgba(26,51,48,0.5)`, borderRadius: "12px",
  fontSize: "16px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.15s ease",
};
const btnOutlineLightBase = {
  background: "transparent", color: C.textOnDark,
  border: "2px solid rgba(255,255,255,0.35)", borderRadius: "12px",
  fontSize: "16px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.15s ease",
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Choose your path",
    desc: "Pick a Story World and let Penny tailor the experience to your knowledge level and personality.",
  },
  {
    num: "02",
    title: "Learn your way",
    desc: "Each lesson follows a choose-your-own-adventure format. Your choices shape how concepts are explained.",
  },
  {
    num: "03",
    title: "Reflect with Penny",
    desc: "After every lesson, Penny delivers a personalized 2–4 sentence check-in based on your MBTI type, Western zodiac, and Chinese zodiac.",
  },
];

const FEATURES = [
  {
    emoji: "📚",
    title: "30 Lessons across 5 Story Worlds",
    desc: "From behavioral money habits to debt payoff strategies, built for real life.",
  },
  {
    emoji: "✨",
    title: "Penny, your AI companion",
    desc: "Powered by Anthropic's Claude AI. Penny responds to how you learn, not a generic script.",
  },
  {
    emoji: "🔮",
    title: "Personality-driven personalization",
    desc: "Your MBTI type and astrology signs shape the tone and examples of every lesson. For entertainment and self-reflection — not predictive.",
  },
];

const WORLDS = [
  {
    name: "Mind & Money",
    tier: "FREE",
    desc: "Behavioral habits, emotional spending, impulse control.",
    badge: "LIVE",
    badgeBg: C.yellow,
    badgeColor: C.dark,
  },
  {
    name: "Budgeting Foundations",
    tier: "GROWTH",
    desc: "50/30/20, zero-based budgeting, weekly money dates.",
    badge: "COMING SOON",
    badgeBg: "rgba(255,255,255,0.12)",
    badgeColor: "rgba(255,255,255,0.7)",
  },
  {
    name: "Debt & Credit",
    tier: "GROWTH",
    desc: "Snowball method, credit score decoded, negotiating rates.",
    badge: "COMING SOON",
    badgeBg: "rgba(255,255,255,0.12)",
    badgeColor: "rgba(255,255,255,0.7)",
  },
  {
    name: "Safety & Stability",
    tier: "TRANSFORMATION",
    desc: "Emergency funds, sinking funds, insurance basics.",
    badge: "COMING SOON",
    badgeBg: "rgba(255,255,255,0.12)",
    badgeColor: "rgba(255,255,255,0.7)",
  },
  {
    name: "Advanced & Values",
    tier: "TRANSFORMATION",
    desc: "Values-based spending, intentional purchase protocol.",
    badge: "COMING SOON",
    badgeBg: "rgba(255,255,255,0.12)",
    badgeColor: "rgba(255,255,255,0.7)",
  },
];

const FAQS = [
  {
    q: "Is Habitrii real financial advice?",
    a: "No. Habitrii is an educational and entertainment platform only. Nothing in the app constitutes financial, legal, or investment advice. Always consult a qualified financial professional for personal financial decisions.",
  },
  {
    q: "Who is Penny?",
    a: "Penny is Habitrii's AI companion, powered by Anthropic's Claude API. She responds to your lesson reflections with personalized, warm check-ins tailored to your knowledge level and personality profile. Penny does not give financial advice.",
  },
  {
    q: "What do MBTI and astrology have to do with money?",
    a: "Habitrii uses personality frameworks as a lens for self-reflection — to help you understand your money habits, emotional triggers, and decision-making style. These insights are for entertainment and self-reflection only, not predictive or professional.",
  },
  {
    q: "Can I use Habitrii if I'm under 18?",
    a: "No. Habitrii is strictly for users 18 years of age and older. No exceptions.",
  },
  {
    q: "How do I get support?",
    a: "Email us at habitrii@aven4life.com and we'll respond within 2 business days.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function PricingCheck({ dark }) {
  return (
    <span style={{ color: dark ? C.yellow : C.teal, fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
      ✓
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage({ onStart }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      color: C.text,
      overflowX: "hidden",
      lineHeight: 1.5,
    }}>

      {/* ═══════════════════ RESPONSIVE STYLES ═══════════════════ */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        html { scroll-behavior: smooth; }

        .lp-nav { position: sticky; top: 0; z-index: 200; }
        .lp-nav-inner {
          max-width: 1160px; margin: 0 auto; padding: 0 32px; height: 68px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-nav-right { display: flex; align-items: center; gap: 14px; }
        .lp-nav-signin { display: inline-block; }

        .lp-section-inner { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

        .lp-hero-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }

        .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lp-grid-worlds {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .lp-grid-pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }

        .lp-footer-links { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }

        /* Hover effects */
        .lp-btn-yellow:hover { transform: translateY(-1px); box-shadow: 0 5px 22px rgba(245,217,36,0.55) !important; }
        .lp-btn-outline:hover { background: rgba(26,51,48,0.07) !important; }
        .lp-btn-outline-light:hover { background: rgba(255,255,255,0.1) !important; }
        .lp-world-card { transition: all 0.2s ease; }
        .lp-world-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.3) !important; }
        .lp-pricing-card { transition: all 0.2s ease; }
        .lp-pricing-card:hover { transform: translateY(-4px); }
        .lp-faq-btn:hover .lp-faq-q { color: ${C.yellow}; }
        .lp-footer-link:hover { color: rgba(255,255,255,0.9) !important; }
        .lp-nav-signin:hover { color: ${C.teal} !important; }

        @media (max-width: 900px) {
          .lp-grid-3 { grid-template-columns: 1fr; }
          .lp-grid-worlds { grid-template-columns: repeat(2, 1fr); }
          .lp-grid-pricing { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .lp-nav-inner { padding: 0 20px; }
          .lp-nav-signin { display: none; }
          .lp-hero-btns { flex-direction: column; width: 100%; }
          .lp-hero-btns button { width: 100% !important; }
          .lp-grid-worlds { grid-template-columns: 1fr; }
          .lp-section-inner { padding: 0 18px; }
        }
      `}</style>

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav className="lp-nav" style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(26,51,48,0.08)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      }}>
        <div className="lp-nav-inner">
          <span style={{ fontSize: "22px", fontWeight: 800, color: C.teal, letterSpacing: "-0.5px" }}>
            Habitrii
          </span>
          <div className="lp-nav-right">
            <button
              className="lp-nav-signin"
              onClick={onStart}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "15px", fontWeight: 600, color: C.dark,
                fontFamily: "inherit", transition: "color 0.15s ease",
                padding: "8px 4px",
              }}
            >
              Sign In
            </button>
            <button
              className="lp-btn-yellow"
              onClick={onStart}
              style={{ ...btnYellowBase, padding: "10px 22px", fontSize: "15px" }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section style={{ background: C.bg, minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <div style={{ maxWidth: "740px", width: "100%", textAlign: "center" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: C.dark, color: C.yellow,
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "6px 16px", borderRadius: "99px",
            marginBottom: "32px",
          }}>
            Now in Early Access
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(38px, 6.5vw, 66px)", fontWeight: 800,
            lineHeight: 1.08, color: C.dark, marginBottom: "26px",
            letterSpacing: "-1.5px",
          }}>
            Financial literacy<br />
            that actually{" "}
            <span style={{
              background: C.yellow, borderRadius: "10px",
              padding: "2px 12px", display: "inline-block", letterSpacing: "-1px",
            }}>
              clicks.
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: "clamp(17px, 2.5vw, 20px)", lineHeight: 1.7,
            color: "rgba(13,31,29,0.72)", maxWidth: "600px",
            margin: "0 auto 44px",
          }}>
            Habitrii is an AI-powered, choose-your-own-adventure financial education app.
            Learn at your own pace, guided by Penny — your personal AI companion who
            adapts to how you actually think.
          </p>

          {/* CTAs */}
          <div className="lp-hero-btns" style={{ marginBottom: "22px" }}>
            <button
              className="lp-btn-yellow"
              onClick={onStart}
              style={{ ...btnYellowBase, padding: "17px 40px", fontSize: "17px" }}
            >
              Start for Free
            </button>
            <button
              className="lp-btn-outline"
              onClick={onStart}
              style={{ ...btnOutlineBase, padding: "17px 40px", fontSize: "17px" }}
            >
              See How It Works
            </button>
          </div>

          {/* Badge */}
          <p style={{ fontSize: "12px", color: C.textMut, letterSpacing: "0.4px" }}>
            18+ only · Educational use only · Not financial advice
          </p>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section style={{ background: C.dark, padding: "100px 0" }}>
        <div className="lp-section-inner">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: C.yellow, margin: "0 0 14px",
            }}>
              How It Works
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
              color: C.textOnDark, letterSpacing: "-0.8px", margin: 0,
            }}>
              Three steps to financial clarity
            </h2>
          </div>

          {/* Steps */}
          <div className="lp-grid-3">
            {STEPS.map((step) => (
              <div key={step.num} style={{
                background: C.mid, borderRadius: "18px", padding: "40px 32px",
                borderTop: `4px solid ${C.yellow}`,
              }}>
                <p style={{
                  fontSize: "48px", fontWeight: 800, color: C.yellow,
                  margin: "0 0 14px", lineHeight: 1,
                }}>
                  {step.num}
                </p>
                <h3 style={{
                  fontSize: "20px", fontWeight: 700, color: C.textOnDark,
                  margin: "0 0 12px",
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.68)", margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section style={{ background: C.bg, padding: "100px 0" }}>
        <div className="lp-section-inner">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(13,31,29,0.5)", margin: "0 0 14px",
            }}>
              Features
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
              color: C.dark, letterSpacing: "-0.8px", margin: 0,
            }}>
              Built different. On purpose.
            </h2>
          </div>

          {/* Cards */}
          <div className="lp-grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: C.card, borderRadius: "18px", padding: "40px 32px",
                boxShadow: "0 4px 24px rgba(26,51,48,0.09)",
              }}>
                <div style={{ fontSize: "44px", marginBottom: "18px", lineHeight: 1 }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 700, color: C.dark, margin: "0 0 12px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: C.textSub, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ STORY WORLDS ═══════════════════ */}
      <section style={{ background: C.cardLight, padding: "100px 0" }}>
        <div className="lp-section-inner">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: C.teal, margin: "0 0 14px",
            }}>
              Story Worlds
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
              color: C.dark, letterSpacing: "-0.8px", margin: "0 0 14px",
            }}>
              Five worlds. One journey.
            </h2>
            <p style={{ fontSize: "17px", color: C.textSub, margin: 0, maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
              Each Story World is a self-contained experience with its own tone, pacing, and lessons.
            </p>
          </div>

          {/* World tiles */}
          <div className="lp-grid-worlds">
            {WORLDS.map((w) => (
              <div key={w.name} className="lp-world-card" style={{
                background: C.dark, borderRadius: "16px", padding: "28px 24px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
              }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", marginBottom: "14px",
                }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.38)",
                  }}>
                    {w.tier}
                  </span>
                  <span style={{
                    background: w.badgeBg, color: w.badgeColor,
                    fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
                    textTransform: "uppercase", padding: "3px 10px", borderRadius: "99px",
                  }}>
                    {w.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.textOnDark, margin: "0 0 8px" }}>
                  {w.name}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.58)", lineHeight: 1.65, margin: 0 }}>
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section style={{ background: C.bg, padding: "100px 0" }}>
        <div className="lp-section-inner">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(13,31,29,0.5)", margin: "0 0 14px",
            }}>
              Pricing
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
              color: C.dark, letterSpacing: "-0.8px", margin: 0,
            }}>
              Start free. Grow when you're ready.
            </h2>
          </div>

          {/* Cards */}
          <div className="lp-grid-pricing">

            {/* Foundation */}
            <div className="lp-pricing-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(26,51,48,0.09)",
            }}>
              <p style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: C.gray, margin: "0 0 10px",
              }}>
                Foundation
              </p>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>Free</span>
                <span style={{ fontSize: "15px", color: C.gray, marginLeft: "8px" }}>forever</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Full Mind & Money world (8 lessons)",
                  "Penny AI check-ins after every lesson",
                  "Personality onboarding (MBTI + astrology)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <PricingCheck dark={false} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="lp-btn-outline"
                onClick={onStart}
                style={{ ...btnOutlineBase, padding: "14px 24px", width: "100%", textAlign: "center" }}
              >
                Start for Free
              </button>
            </div>

            {/* Growth — Most Popular */}
            <div className="lp-pricing-card" style={{
              background: C.dark, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 10px 48px rgba(26,51,48,0.38)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "-15px", left: "50%",
                transform: "translateX(-50%)",
                background: C.yellow, color: C.dark,
                fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px",
                textTransform: "uppercase", padding: "5px 18px", borderRadius: "99px",
                whiteSpace: "nowrap",
              }}>
                Most Popular
              </div>
              <p style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: "rgba(255,255,255,0.45)", margin: "0 0 10px",
              }}>
                Growth
              </p>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.textOnDark, lineHeight: 1 }}>$9.99</span>
                <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", marginLeft: "6px" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: C.yellow, fontWeight: 600, margin: "0 0 28px" }}>
                or $79/year
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Everything in Foundation",
                  "Budgeting Foundations world (6 lessons)",
                  "Debt & Credit world (6 lessons)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
                    <PricingCheck dark={true} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="lp-btn-yellow"
                onClick={onStart}
                style={{ ...btnYellowBase, padding: "14px 24px", width: "100%", textAlign: "center" }}
              >
                Get Growth
              </button>
            </div>

            {/* Transformation */}
            <div className="lp-pricing-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(26,51,48,0.09)",
            }}>
              <p style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
                textTransform: "uppercase", color: C.gray, margin: "0 0 10px",
              }}>
                Transformation
              </p>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>$19.99</span>
                <span style={{ fontSize: "15px", color: C.gray, marginLeft: "6px" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: C.teal, fontWeight: 600, margin: "0 0 28px" }}>
                or $149/year
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Everything in Growth",
                  "Safety & Stability world (6 lessons)",
                  "Advanced & Values world (4 lessons)",
                  "Money Mirror: Financial Identity Profile (coming soon)",
                  "Early access to new features",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <PricingCheck dark={false} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="lp-btn-outline"
                onClick={onStart}
                style={{ ...btnOutlineBase, padding: "14px 24px", width: "100%", textAlign: "center" }}
              >
                Get Transformation
              </button>
            </div>

          </div>

          {/* Pricing note */}
          <p style={{
            textAlign: "center", fontSize: "13px",
            color: "rgba(13,31,29,0.45)", marginTop: "36px",
            maxWidth: "600px", marginLeft: "auto", marginRight: "auto",
            lineHeight: 1.65,
          }}>
            Personality insights (MBTI, Western astrology, Chinese astrology) are for
            entertainment and self-reflection only — not predictive or professional guidance.
          </p>
        </div>
      </section>

      {/* ═══════════════════ LEGAL DISCLAIMER ═══════════════════ */}
      <section style={{ background: C.dark, padding: "72px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: C.yellow, margin: "0 0 22px",
          }}>
            Legal Notice
          </p>
          <p style={{
            fontSize: "17px", lineHeight: 1.8,
            color: "rgba(255,255,255,0.82)", margin: 0,
          }}>
            Habitrii is for educational and entertainment purposes only. Content does not
            constitute financial, legal, or investment advice. Habitrii is strictly for users{" "}
            <strong style={{ color: C.textOnDark }}>18 years of age and older</strong>.
            By using Habitrii, you confirm you are 18 or older.
          </p>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section style={{ background: C.mid, padding: "100px 0" }}>
        <div className="lp-section-inner">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: C.yellow, margin: "0 0 14px",
              }}>
                FAQ
              </p>
              <h2 style={{
                fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
                color: C.textOnDark, letterSpacing: "-0.8px", margin: 0,
              }}>
                Common questions
              </h2>
            </div>

            {/* Accordion */}
            <div>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: i < FAQS.length - 1
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                  }}
                >
                  <button
                    className="lp-faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left",
                      padding: "24px 0", display: "flex",
                      justifyContent: "space-between", alignItems: "center",
                      fontFamily: "inherit",
                      gap: "16px",
                    }}
                  >
                    <span className="lp-faq-q" style={{
                      fontSize: "17px", fontWeight: 600, color: C.textOnDark,
                      lineHeight: 1.4, transition: "color 0.15s ease",
                    }}>
                      {faq.q}
                    </span>
                    <span style={{
                      fontSize: "26px", color: C.yellow, flexShrink: 0,
                      lineHeight: 1, transition: "transform 0.2s ease",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "block",
                    }}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div style={{
                      paddingBottom: "24px",
                      color: "rgba(255,255,255,0.72)",
                      fontSize: "15px", lineHeight: 1.75,
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{ background: C.dark, padding: "64px 24px 44px", textAlign: "center" }}>
        <span style={{
          fontSize: "26px", fontWeight: 800, color: C.teal,
          display: "block", marginBottom: "36px", letterSpacing: "-0.5px",
        }}>
          Habitrii
        </span>

        <div className="lp-footer-links" style={{ marginBottom: "28px" }}>
          <a href="#" className="lp-footer-link" style={{
            color: "rgba(255,255,255,0.55)", fontSize: "14px",
            textDecoration: "none", transition: "color 0.15s ease",
          }}>
            Privacy Policy
          </a>
          <a href="#" className="lp-footer-link" style={{
            color: "rgba(255,255,255,0.55)", fontSize: "14px",
            textDecoration: "none", transition: "color 0.15s ease",
          }}>
            Terms of Service
          </a>
          <a href="mailto:habitrii@aven4life.com" className="lp-footer-link" style={{
            color: "rgba(255,255,255,0.55)", fontSize: "14px",
            textDecoration: "none", transition: "color 0.15s ease",
          }}>
            habitrii@aven4life.com
          </a>
        </div>

        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>
          Educational and entertainment purposes only · Not financial advice · 18+ only
        </p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.28)", margin: 0 }}>
          © 2026 AVEN LLC. All rights reserved. Habitrii is a product of AVEN LLC, registered in Virginia.
        </p>
      </footer>

    </div>
  );
}
