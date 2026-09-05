import { useState } from "react";

// ─── Brand Colors ──────────────────────────────────────────────────────────────
const C = {
  bg:         "#57b7a7",
  dark:       "#232321",
  surface:    "#a09e98",
  mid:        "#b3b1ab",
  card:       "#ffffff",
  cardLight:  "#f0faf8",
  yellow:     "#f5d924",
  teal:       "#57b7a7",
  gray:       "#a09e98",
  grayText: "#5f5d57",
  text:       "#232321",
  textSub:    "rgba(35,35,33,0.7)",
  textMut: "rgba(35,35,33,0.62)",  textOnDark: "#232321",
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
    badge: "LIVE",
    badgeBg: C.yellow,
    badgeColor: C.dark,
  },
  {
    emoji: "💳",
    name: "Debt & Credit",
    tier: "GROWTH",
    desc: "Snowball method, credit score decoded, negotiating rates.",
    badge: "LIVE",
    badgeBg: C.yellow,
    badgeColor: C.dark,
  },
  {
    emoji: "🛡️",
    name: "Safety & Stability",
    tier: "TRANSFORMATION",
    desc: "Emergency funds, sinking funds, insurance basics.",
    badge: "LIVE",
    badgeBg: C.yellow,
    badgeColor: C.dark,
  },
  {
    emoji: "🌟",
    name: "Advanced & Values",
    tier: "TRANSFORMATION",
    desc: "Values-based spending, intentional purchase protocol.",
    badge: "LIVE",
    badgeBg: "#f5d924",
    badgeColor: "#232321",
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
const LP_TONES = ["#57b7a7", "#f5d924", "#ffffff"];
const LP_SEQ = (() => {
  const seq = []; let prev = -1, s = 11;
  for (let i = 0; i < 24; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    let p = s % 3; if (p === prev) p = (p + 1) % 3;
    seq.push(p); prev = p;
  }
  return seq;
})();
const lpToneCard = (i) => {
  const t = LP_TONES[LP_SEQ[i % LP_SEQ.length]];
  return { background: t, border: t === "#ffffff" ? "1px solid #57b7a7" : t === "#57b7a7" ? "1px solid #ffffff" : "1px solid #232321" };
};

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
        .lp-hero-video {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }
        .lp-hero-wash {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(250,249,246,0.62); z-index: 0;
        }
        @media (max-width: 600px) {
          .lp-hero { flex-direction: column; min-height: 0 !important; padding-top: 32px !important; }
          .lp-hero-video {
            position: static; width: 100%; height: auto; aspect-ratio: 16 / 9;
            border-radius: 16px; margin-bottom: 28px;
            box-shadow: 0 12px 40px rgba(35,35,33,0.25);
          }
          .lp-hero-wash { display: none; }
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
            <a
              href="/moneymirror/"
              className="lp-signin"
              style={{
                fontSize: "15px", fontWeight: 600, color: C.dark, fontFamily: "inherit",
                padding: "8px 4px", textDecoration: "none",
              }}
            >
              Money Mirror
            </a>
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
      <section className="lp-hero" style={{
        background: C.bg, minHeight: "90vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 24px", position: "relative", overflow: "hidden",
      }}>
        {/* Hero banner video: full-bleed background on desktop, in-flow banner on mobile */}
        <video className="lp-hero-video" src="/hero-banner.mp4" autoPlay muted loop playsInline />
        {/* Readability wash over the video (desktop only) */}
        <div className="lp-hero-wash" />
        <div style={{ maxWidth: "740px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* Early access pill */}
          <div style={{
            display: "inline-block",
            background: C.dark, color: C.yellow,
            fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", padding: "6px 16px", borderRadius: "99px",
            marginBottom: "30px",
          }}>
            Choose Your Journey
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
              style={{ ...btnOutline, padding: "17px 40px", fontSize: "17px", border: `2px solid ${C.yellow}` }}
            >
              See How It Works
            </button>
          </div>

          {/* Money Mirror — pre-signup soft entry */}
          <p style={{ fontSize: "15px", color: "rgba(35,35,33,0.8)", margin: "0 0 18px", lineHeight: 1.5 }}>
            Not ready to sign up?{" "}
            <a
              href="/moneymirror/"
              style={{ color: C.dark, fontWeight: 700, textDecoration: "underline", textDecorationColor: C.yellow, textUnderlineOffset: "3px" }}
            >
              Find your Money Mirror
            </a>{" "}
            — five questions, under a minute, no account needed.
          </p>
          {/* Disclaimer badge */}
          <p style={{ fontSize: "12px", color: C.textMut, letterSpacing: "0.4px", margin: 0 }}>
            18+ only · Educational use only · Not financial advice
          </p>

        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" className="lp-section" style={{ background: C.bg }}>
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
                background: C.card, borderRadius: "18px", padding: "40px 32px",
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
                borderTop: `4px solid ${C.yellow}`,
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
            {WORLDS.map((w, wi) => (
              <div key={w.name} className="lp-world-card" style={{
                ...lpToneCard(wi), borderRadius: "16px", padding: "28px 24px",
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
                  textTransform: "uppercase", color: "rgba(35,35,33,0.9)",
                  margin: "0 0 6px",
                }}>
                  {w.tier}
                </p>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.textOnDark, margin: "0 0 8px" }}>
                  {w.name}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(35,35,33,0.9)", lineHeight: 1.65, margin: 0 }}>
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
              borderTop: `4px solid ${C.yellow}`,
            }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.grayText, margin: "0 0 10px" }}>
                Foundation
              </p>
              <div style={{ marginBottom: "28px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>Free</span>
                <p style={{ fontSize: "14px", color: C.grayText, margin: "8px 0 0", lineHeight: 1.5 }}>
                  All 8 lessons free for your first month — first 3 free forever. <span style={{ color: C.teal, fontWeight: 600 }}>No credit card.</span>
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "All 8 Mind & Money lessons for your first month",
                  "First 3 lessons free forever after",
                  "Penny AI check-ins after every lesson",
                  "Personality onboarding (MBTI + astrology)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <CheckIcon dark={false} />{item}
                  </li>
                ))}
              </ul>
              <button className="lp-btn-o" onClick={onStart} style={{ ...btnOutline, padding: "14px 24px", width: "100%", color: C.teal }}>
                Start for Free
              </button>
            </div>

            {/* ── Growth (Most Popular) ── */}
            <div className="lp-p-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 10px 48px rgba(35,35,33,0.38)", position: "relative",
              borderTop: `4px solid ${C.yellow}`,
            }}>
              <div style={{
                position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)",
                background: C.dark, color: C.yellow,
                fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase",
                padding: "5px 18px", borderRadius: "99px", whiteSpace: "nowrap",
              }}>
                Most Popular
              </div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.grayText, margin: "0 0 10px" }}>
                Growth
              </p>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: C.dark, lineHeight: 1 }}>$9.99</span>
                <span style={{ fontSize: "15px", color: C.grayText, marginLeft: "6px" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: C.teal, fontWeight: 600, margin: "0 0 28px" }}>or $79/year</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Full Mind & Money world (8 lessons)",
                  "Budgeting Foundations world (6 lessons)",
                  "Debt & Credit world (6 lessons)",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <CheckIcon dark={false} />{item}
                  </li>
                ))}
              </ul>
              <button className="lp-btn-o" onClick={onStart} style={{ ...btnOutline, padding: "14px 24px", width: "100%", color: C.teal }}>
                Get Growth
              </button>
            </div>

            {/* ── Transformation ── */}
            <div className="lp-p-card" style={{
              background: C.card, borderRadius: "20px", padding: "40px 32px",
              boxShadow: "0 4px 24px rgba(35,35,33,0.09)",
              borderTop: `4px solid ${C.yellow}`,
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
                  "Money Mirror: Financial Identity Profile",
                  "Early access to new features",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "15px", color: C.textSub, lineHeight: 1.55 }}>
                    <CheckIcon dark={false} />{item}
                  </li>
                ))}
              </ul>
              <button className="lp-btn-o" onClick={onStart} style={{ ...btnOutline, padding: "14px 24px", width: "100%", color: C.teal }}>
                Get Transformation
              </button>
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
      <section style={{ background: C.yellow, padding: "72px 24px" }}>
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
      <section className="lp-section" style={{ background: "#faf9f6" }}>
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
      <footer style={{ background: C.bg, padding: "44px 24px", textAlign: "center" }}>
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

        {/* Social icons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "28px", marginBottom: "32px" }}>
          <a
            href="https://habitrii.aven4life.com/?utm_source=instagram&utm_medium=footer&utm_campaign=launch"
            target="_blank" rel="noopener noreferrer" aria-label="Habitrii on Instagram"
            className="lp-footer-a"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", color: C.dark }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4.4" />
              <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://habitrii.aven4life.com/?utm_source=tiktok&utm_medium=footer&utm_campaign=launch"
            target="_blank" rel="noopener noreferrer" aria-label="Habitrii on TikTok"
            className="lp-footer-a"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", color: C.dark }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.6 1h-3.3v14.37c0 1.98-1.6 3.58-3.57 3.58a3.58 3.58 0 0 1 0-7.16c.37 0 .73.06 1.07.16V8.6a6.9 6.9 0 0 0-1.07-.08A6.88 6.88 0 1 0 16.6 15.4V7.72A8.16 8.16 0 0 0 21.5 9.3V6a4.9 4.9 0 0 1-4.9-5Z" />
            </svg>
          </a>
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
          background:"#57b7a7",
          borderTop:"2px solid #ffffff",
          padding:"14px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:"16px", flexWrap:"wrap",
          boxShadow:"0 -4px 24px rgba(35,35,33,0.35)",
        }}>
          <p style={{
            color:"rgba(35,35,33,0.92)", fontSize:"13px",
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
                background:"transparent", color:"rgba(35,35,33,0.85)",
                border:"1px solid rgba(35,35,33,0.45)", borderRadius:"8px",
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