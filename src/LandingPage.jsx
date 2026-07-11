import { useState } from "react";

// ─── Brand Colors ──────────────────────────────────────────────────────────────
const C = {
  bg:         "#57b7a7",
  dark:       "#232321",
  surface:    "#c3c3c3",
  mid:        "#d2d2cf",
  card:       "#ffffff",
  cardLight:  "#f0faf8",
  yellow:     "#f5d924",
  teal:       "#57b7a7",
  gray:       "#a09e98",
  grayText: "#5f5d57",
  text:       "#232321",
  textSub:    "rgba(35,35,33,0.7)",
  textMut: "rgba(35,35,33,0.62)",  textOnDark: "#ffffff",
};

// ─── Button Base Styles ────────────────────────────────────────────────────────
const btnYellow = {
  background: C.yellow, color: C.dark, border: "none", borderRadius: "12px",
  fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  letterSpacing: "0.2px", boxShadow: "0 2px 12px rgba(245,217,36,0.35)",
  transition: "all 0.15s ease",
};
const btnOutline = {
  background: "transparent", color: C.dark,
  border: "2px solid rgba(35,35,33,0.5)", borderRadius: "12px",
  fontSize: "16px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.15s ease",
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Choose your path",
    desc: "Pick a Story World. Penny tailors the experience to your knowledge level and personality.",
  },
  {
    num: "02",
    title: "Learn your way",
    desc: "Each lesson is a choose-your-own-adventure. Your choices shape how concepts are explained.",
  },
  {
    num: "03",
    title: "Reflect with Penny",
    desc: "After every lesson, Penny delivers a 2–4 sentence personalized check-in based on your MBTI type, Western zodiac, and Chinese zodiac.",
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
    desc: "Powered by Anthropic's Claude API. Responds to how you learn, not a generic script.",
  },
  {
    emoji: "🔮",
    title: "Personality-driven personalization",
    desc: "MBTI and astrology shape every lesson's tone and examples. For entertainment and self-reflection — not predictive.",
  },
];

const WORLDS = [
  {
    emoji: "🧠",
    name: "Mind & Money",
    tier: "FREE",
    desc: "Behavioral habits, emotional spending, impulse control.",
    badge: "LIVE",
    badgeBg: C.yellow,
    badgeColor: C.dark,
  },
  {
    emoji: "📐",
    name: "Budgeting Foundations",
    tier: "GROWTH",
    desc: "50/30/20, zero-based budgeting, weekly money dates.",
    badge: "COMING SOON",
    badgeBg: "rgba(35,35,33,0.12)",
    badgeColor: "rgba(35,35,33,0.66)",
  },
  {
    emoji: "💳",
    name: "Debt & Credit",
    tier: "GROWTH",
    desc: "Snowball method, credit score decoded, negotiating rates.",
    badge: "COMING SOON",
    badgeBg: "rgba(35,35,33,0.12)",
    badgeColor: "rgba(35,35,33,0.66)",
  },
  {
    emoji: "🛡️",
    name: "Safety & Stability",
    tier: "TRANSFORMATION",
    desc: "Emergency funds, sinking funds, insurance basics.",
    badge: "COMING SOON",
    badgeBg: "rgba(35,35,33,0.12)",
    badgeColor: "rgba(35,35,33,0.66)",
  },
  {
    emoji: "🌟",
    name: "Advanced & Values",
    tier: "TRANSFORMATION",
    desc: "Values-based spending, intentional purchase protocol.",
    badge: "COMING SOON",
    badgeBg: "rgba(35,35,33,0.12)",
    badgeColor: "rgba(35,35,33,0.66)",
  },
];

const FAQS = [
  {
    q: "Is Habitrii real financial advice?",
    a: "No. Habitrii is an educational and entertainment platform only. Nothing constitutes financial, legal, or investment advice. Always consult a qualified professional for personal financial decisions.",
  },
  {
    q: "Who is Penny?",
    a: "Penny is Habitrii's AI companion, powered by Anthropic's Claude API. She responds to your lesson reflections with personalized, warm check-ins tailored to your knowledge level and personality profile. Penny does not give financial advice.",
  },
  {
    q: "What do MBTI and astrology have to do with money?",
    a: "Habitrii uses personality frameworks for self-reflection — to help you understand your habits, emotional triggers, and decision-making style. For entertainment and self-reflection only, not predictive or professional.",
  },
  {
    q: "Can I use Habitrii if I'm under 18?",
    a: "No. Habitrii is strictly for users 18 years of age and older. No exceptions.",
  },
  {
    q: "How do I get support?",
    a: "Email habitrii@aven4life.com — we respond within 2 business days.",
  },
];

function CheckIcon({ dark }) {
  return (
    <span style={{ color: dark ? C.yellow : C.teal, fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>
      ✓
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function LandingPage({ onStart, onShowTerms, onShowPrivacy }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [gdprDismissed, setGdprDismissed] = useState(
    () => !!localStorage.getItem("hb_gdpr_accepted")
  );
  const handleGdprAccept = () => {
    localStorage.setItem("hb_gdpr_accepted", "1");
    setGdprDismissed(true);
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      color: C.text,
      overflowX: "hidden",
      lineHeight: 1.5,
    }}>

      {/* ══════════════════════ RESPONSIVE STYLES ══════════════════════ */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* Layout utilities */
        .lp-section { padding: 96px 0; }
        .lp-inner  { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
        .lp-section-header { text-align: center; margin-bottom: 60px; }

        /* Nav */
        .lp-nav {
          position: sticky; top: 0; z-index: 200;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(35,35,33,0.08);
          box-shadow: 0 1px 10px rgba(0,0,0,0.05);
        }
        .lp-nav-inner {
          max-width: 1160px; margin: 0 auto; padding: 0 32px;
          height: 68px; display: flex; align-items: center;
          justify-content: space-between;
        }
        .lp-nav-right { display: flex; align-items: center; gap: 14px; }
        .lp-signin { transition: color 0.15s ease !important; }
        .lp-signin:hover { color: ${C.teal} !important; }

        /* Hero buttons */
        .lp-hero-btns {
          display: flex; gap: 16px; flex-wrap: wrap;
          justify-content: center; margin-bottom: 20px;
        }

        /* Grids */
        .lp-grid-3     { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lp-grid-worlds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lp-grid-pricing { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: start; }

        /* Hover states */
        .lp-btn-y:hover  { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(245,217,36,0.55) !important; }
        .lp-btn-o:hover  { background: rgba(35,35,33,0.07) !important; }
        .lp-world-card { transition: all 0.2s ease; }
        .lp-world-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.3) !important; }
        .lp-p-card { transition: all 0.2s ease; }
        .lp-p-card:hover { transform: translateY(-4px); }
        .lp-faq-q { transition: color 0.15s ease; }
        .lp-faq-btn:hover .lp-faq-q { color: ${C.yellow}; }
        .lp-footer-a { transition: color 0.15s ease !important; }
        .lp-footer-a:hover { color: rgba(35,35,33,0.9) !important; }

        /* Responsive breakpoints */
        @media (max-width: 900px) {
          .lp-grid-3     { grid-template-columns: 1fr; }
          .lp-grid-worlds { grid-template-columns: repeat(2, 1fr); }
          .lp-grid-pricing { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .lp-inner { padding: 0 18px; }
          .lp-nav-inner { padding: 0 20px; }
          .lp-section { padding: 64px 0; }
          .lp-signin-hide { display: none; }
          .lp-hero-btns { flex-direction: column; width: 100%; }
          .lp-hero-btns button { width: 100% !important; }
          .lp-grid-worlds { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══════════════════════ NAV ══════════════════════ */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span style={{ fontSize: "22px", fontWeight: 800, color: C.teal, letterSpacing: "-0.5px" }}>
            Habitrii
          </span>
          <div className="lp-nav-right">
            <button
              className="lp-signin lp-signin-hide"
              onClick={onStart}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: "15px", fontWeight: 600, color: C.dark, fontFamily: "inherit",
                padding: "8px 4px",
              }}
            >
              Sign In
            </button>
            <button
              className="lp-btn-y"
              onClick={onStart}
              style={{ ...btnYellow, padding: "10px 22px", fontSize: "15px" }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section style={{
        background: C.bg, minHeight: "90vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 24px", position: "relative", overflow: "hidden",
      }}>
        {/* Full-bleed hero banner video */}
        <video
          src="/hero-banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover", zIndex: 0,
          }}
        />
        {/* Readability wash over the video */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(250,249,246,0.62)", zIndex: 0,
        }} />
        <div style={{ maxWidth: "740px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Early access pill */}
          <div style={{
            display: "inline-block",
            background: C.dark, color: C.yellow,
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "6px 16px", borderRadius: "99px",
            marginBottom: "30px",
          }}>
            Now in Early Access
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(38px, 6.5vw, 64px)", fontWeight: 800,
            lineHeight: 1.08, color: C.dark, marginBottom: "24px",
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
            color: "rgba(35,35,33,0.72)", maxWidth: "600px",
            margin: "0 auto 44px",
          }}>
            Habitrii is an AI-powered, choose-your-own-adventure financial education app.
            Learn at your own pace, guided by Penny — your personal AI companion who
            adapts to how you actually think.
          </p>

          {/* CTAs */}
          <div className="lp-hero-btns">
            <button
              className="lp-btn-y"
              onClick={onStart}
              style={{ ...btnYellow, padding: "17px 40px", fontSize: "17px" }}
            >
              Start for Free
            </button>
            <button
              className="lp-btn-o"
              onClick={scrollToHowItWorks}
              style={{ ...btnOutline, padding: "17px 40px", fontSize: "17px" }}
            >
              See How It Works
            </button>
          </div>

          {/* Disclaimer badge */}
          <p style={{ fontSize: "12px", color: C.textMut, letterSpacing: "0.4px", margin: 0 }}>
            18+ only · Educational use only · Not financial advice
          </p>

        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" className="lp-section" style={{ background: C.surface }}>
        <div className="lp-inner">
          <div className="lp-section-header">
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: C.dark, margin: "0 0 14px",
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

          <div className="lp-grid-3">
            {STEPS.map((s) => (
              <div key={s.num} style={{
                background: C.mid, borderRadius: "18px", padding: "40px 32px",
                borderTop: `4px solid ${C.yellow}`,
              }}>
                <p style={{
                  fontSize: "48px", fontWeight: 800, color: C.dark,
                  margin: "0 0 14px", lineHeight: 1,
                }}>
                  {s.num}
                </p>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: C.textOnDark, margin: "0 0 12px" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(35,35,33,0.75)", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section className="lp-section" style={{ background: C.bg }}>
        <div className="lp-inner">
          <div className="lp-section-header">
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(35,35,33,0.72)", margin: "0 0 14px",
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

          <div className="lp-grid-3">
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: C.card, borderRadius: "18px", padding: "40px 32px",
                boxShadow: "0 4px 24px rgba(35,35,33,0.09)",
              }}>
                <div style={{ fontSize: "44px", marginBottom: "18px", lineHeight: 1 }}>{f.emoji}</div>
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

      {/* ══════════════════════ STORY WORLDS ══════════════════════ */}
      <section className="lp-section" style={{ background: C.cardLight }}>
        <div className="lp-inner">
          <div className="lp-section-header">
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: C.teal, margin: "0 0 14px",
            }}>
              Story Worlds
            </p>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
              color: C.dark, letterSpacing: "-0.8px", margin: "0 0 12px",
            }}>
              Five worlds. One journey.
            </h2>
            <p style={{ fontSize: "17px", color: C.textSub, margin: 0, maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
              Each Story World is a self-contained experience with its own tone, pacing, and lessons.
            </p>
          </div>

          <div className="lp-grid-worlds">
            {WORLDS.map((w) => (
              <div key={w.name} className="lp-world-card" style={{
                background: C.surface, borderRadius: "16px", padding: "28px 24px",
                boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <span style={{ fontSize: "26px", lineHeight: 1 }}>{w.emoji}</span>
                  <span style={{
                    background: w.badgeBg, color: w.badgeColor,
                    fontSize: "10px", fontWeight: 700, letterSpacing: "1px",
                    textTransform: "uppercase", padding: "3px 10px", borderRadius: "99px",
                  }}>
                    {w.badge}
                  </span>
                </div>
                <p style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", color: "rgba(35,35,33,0.66)",
                  margin: "0 0 6px",
                }}>
                  {w.tier}
                </p>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.textOnDark, margin: "0 0 8px" }}>
                  {w.name}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(35,35,33,0.75)", lineHeight: 1.65, margin: 0 }}>
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PRICING ══════════════════════ */}
      <section className="lp-section" style={{ background: C.bg }}>
        <div className="lp-inner">
          <div className="lp-section-header">
            <p style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
              textTransform: "uppercase", color: "rgba(35,35,33,0.72)", margin: "0 0 14px",
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

          <div className="lp-grid-pricing">

            {/* ── Foundation ── */}
            <div className="lp-p-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(35,35,33,0.09)",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.grayText, margin: "0 0 10px" }}>
                Foundation
              </p>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>Free</span>
                <span style={{ fontSize: "15px", color: C.grayText, marginLeft: "8px" }}>forever</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Full Mind & Money world (8 lessons)",
                  "Penny AI check-ins after every lesson",
                  "Personality onboarding (MBTI + astrology)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <CheckIcon dark={false} />{item}
                  </li>
                ))}
              </ul>
              <button className="lp-btn-o" onClick={onStart} style={{ ...btnOutline, padding: "14px 24px", width: "100%" }}>
                Start for Free
              </button>
            </div>

            {/* ── Growth (Most Popular) ── */}
            <div className="lp-p-card" style={{
              background: C.surface, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 10px 48px rgba(35,35,33,0.38)", position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)",
                background: C.yellow, color: C.dark,
                fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase",
                padding: "5px 18px", borderRadius: "99px", whiteSpace: "nowrap",
              }}>
                Most Popular
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(35,35,33,0.6)", margin: "0 0 10px" }}>
                Growth
              </p>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.textOnDark, lineHeight: 1 }}>$9.99</span>
                <span style={{ fontSize: "15px", color: "rgba(35,35,33,0.6)", marginLeft: "6px" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(35,35,33,0.8)", fontWeight: 700, margin: "0 0 28px" }}>or $79/year</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Everything in Foundation",
                  "Budgeting Foundations world (6 lessons)",
                  "Debt & Credit world (6 lessons)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: "rgba(35,35,33,0.8)", lineHeight: 1.55 }}>
                    <CheckIcon dark={true} />{item}
                  </li>
                ))}
              </ul>
              <div style={{
                padding: "14px 24px", width: "100%", boxSizing: "border-box",
                borderRadius: "12px", textAlign: "center", fontFamily: "inherit",
                fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px",
                textTransform: "uppercase", cursor: "default",
                background: "rgba(35,35,33,0.08)",
                color: "rgba(35,35,33,0.45)",
                border: "1.5px solid rgba(35,35,33,0.2)",
              }}>
                Coming Soon
              </div>
            </div>

            {/* ── Transformation ── */}
            <div className="lp-p-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(35,35,33,0.09)",
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.grayText, margin: "0 0 10px" }}>
                Transformation
              </p>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>$19.99</span>
                <span style={{ fontSize: "15px", color: C.grayText, marginLeft: "6px" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: C.teal, fontWeight: 600, margin: "0 0 28px" }}>or $149/year</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Everything in Growth",
                  "Safety & Stability world (6 lessons)",
                  "Advanced & Values world (4 lessons)",
                  "Money Mirror: Financial Identity Profile (coming soon)",
                  "Early access to new features",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <CheckIcon dark={false} />{item}
                  </li>
                ))}
              </ul>
              <div style={{
                padding: "14px 24px", width: "100%", boxSizing: "border-box",
                borderRadius: "12px", textAlign: "center", fontFamily: "inherit",
                fontSize: "14px", fontWeight: 700, letterSpacing: "1.5px",
                textTransform: "uppercase", cursor: "default",
                background: "rgba(35,35,33,0.05)",
                color: "rgba(35,35,33,0.28)",
                border: "1.5px solid rgba(35,35,33,0.1)",
              }}>
                Coming Soon
              </div>
            </div>

          </div>

          {/* Pricing footnote */}
          <p style={{
            textAlign: "center", fontSize: "13px", color: C.textMut,
            marginTop: "36px", maxWidth: "600px",
            marginLeft: "auto", marginRight: "auto", lineHeight: 1.65,
          }}>
            Personality insights (MBTI, Western astrology, Chinese astrology) are for
            entertainment and self-reflection only — not predictive or professional guidance.
          </p>
        </div>
      </section>

      {/* ══════════════════════ LEGAL DISCLAIMER ══════════════════════ */}
      <section style={{ background: C.surface, padding: "72px 24px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: C.dark, margin: "0 0 22px",
          }}>
            Legal Notice
          </p>
          <p style={{ fontSize: "17px", lineHeight: 1.85, color: "rgba(35,35,33,0.8)", margin: 0 }}>
            Habitrii is for educational and entertainment purposes only. Content does not
            constitute financial, legal, or investment advice. Habitrii is strictly for users{" "}
            <strong style={{ color: C.textOnDark }}>18 years of age and older</strong>.
            By using Habitrii, you confirm you are 18 or older.
          </p>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section className="lp-section" style={{ background: C.mid }}>
        <div className="lp-inner">
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div className="lp-section-header">
              <p style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
                textTransform: "uppercase", color: C.dark, margin: "0 0 14px",
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

            <div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{
                  borderBottom: i < FAQS.length - 1 ? "1px solid rgba(35,35,33,0.08)" : "none",
                }}>
                  <button
                    className="lp-faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", padding: "24px 0",
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", fontFamily: "inherit", gap: "16px",
                    }}
                  >
                    <span className="lp-faq-q" style={{
                      fontSize: "17px", fontWeight: 600, color: C.textOnDark, lineHeight: 1.4,
                    }}>
                      {faq.q}
                    </span>
                    <span style={{
                      fontSize: "26px", color: C.dark, flexShrink: 0, lineHeight: 1,
                      transition: "transform 0.2s ease",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      display: "block",
                    }}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div style={{
                      paddingBottom: "24px",
                      color: "rgba(35,35,33,0.75)",
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

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={{ background: C.surface, padding: "64px 24px 44px", textAlign: "center" }}>
        <span style={{
          fontSize: "26px", fontWeight: 800, color: C.teal,
          display: "block", marginBottom: "36px", letterSpacing: "-0.5px",
        }}>
          Habitrii
        </span>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", marginBottom: "28px" }}>
          {[
      { label: "Privacy Policy", href: "#", onClick: onShowPrivacy },
      { label: "Terms of Service", href: "#", onClick: onShowTerms },
            { label: "habitrii@aven4life.com",  href: "mailto:habitrii@aven4life.com" },
          ].map(link => (
            <a key={link.label} href={link.href} className="lp-footer-a" onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); } : undefined} style={{
              color: "rgba(35,35,33,0.66)", fontSize: "14px", textDecoration: "none",
            }}>
              {link.label}
            </a>
          ))}
        </div>

        <p style={{ fontSize: "13px", color: "rgba(35,35,33,0.66)", marginBottom: "10px" }}>
          Educational and entertainment purposes only · Not financial advice · 18+ only
        </p>
        <p style={{ fontSize: "13px", color: "rgba(35,35,33,0.66)", margin: 0 }}>
          © 2026 AVEN LLC. All rights reserved. Habitrii is a product of AVEN LLC, registered in Virginia.
        </p>
      </footer>

      {/* GDPR / Cookie Consent Banner */}
      {!gdprDismissed && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:9999,
          background:"#c3c3c3",
          borderTop:"1px solid rgba(35,35,33,0.12)",
          padding:"14px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:"16px", flexWrap:"wrap",
          boxShadow:"0 -4px 24px rgba(35,35,33,0.35)",
        }}>
          <p style={{
            color:"rgba(35,35,33,0.8)", fontSize:"13px",
            margin:0, lineHeight:1.55, flex:1, minWidth:"240px",
          }}>
            We use essential cookies to keep Habitrii running. By using this site
            you agree to our{" "}
            <span
              onClick={onShowPrivacy}
              style={{color:"#f5d924",textDecoration:"underline",cursor:"pointer"}}
            >Privacy Policy</span>.
            {" "}This site is operated by AVEN LLC (Virginia, USA) and is intended
            for users 18 and older worldwide, including the EU/EEA.
          </p>
          <div style={{display:"flex",gap:"10px",flexShrink:0}}>
            <button
              onClick={handleGdprAccept}
              style={{
                background:"#f5d924", color:"#232321", border:"none",
                borderRadius:"8px", padding:"9px 20px",
                fontSize:"13px", fontWeight:700, cursor:"pointer",
                fontFamily:"inherit",
              }}
            >
              Accept & continue
            </button>
            <button
              onClick={handleGdprAccept}
              style={{
                background:"transparent", color:"rgba(35,35,33,0.66)",
                border:"1px solid rgba(35,35,33,0.3)", borderRadius:"8px",
                padding:"9px 16px", fontSize:"13px", fontWeight:500,
                cursor:"pointer", fontFamily:"inherit",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
