import { useState } from "react";

const C = {
  teal: "#57b7a7",
  yellow: "#f5d924",
  gray: "#a09e98",
  dark: "#1a3330",
  deep: "#0d1f1d",
  mid: "#2a4a44",
  cardBg: "rgba(13,31,29,0.10)",
  cardBorder: "rgba(13,31,29,0.35)",
};

const scene = {
  hook: "You're about to check out. Cart total: $87. Your thumb is hovering over 'Place Order.' Sound familiar?",
  concept:
    "The 24-Hour Rule is disarmingly simple: before buying anything non-essential, wait 24 hours. That gap between impulse and action is where your real preferences live. Studies show up to 73% of impulse purchases are regretted within a day — the rule turns that regret into clarity before it costs you.",
  choices: [
    { id: "stress", emoji: "😮‍💨", label: "I spend when I'm stressed or overwhelmed" },
    { id: "fomo", emoji: "🏷️", label: "I spend when I see a deal or feel left out" },
    { id: "reward", emoji: "🎉", label: "I spend to celebrate or treat myself" },
  ],
  branches: {
    stress: {
      headline: "For stress spenders",
      body: "Buying something feels like a reset — a quick hit of control when life feels out of hand. The 24-Hour Rule works here because stress spending always feels urgent, but it's almost never a real deadline. Set a phone timer, close the tab, and let the urgency pass. Physical movement breaks the loop faster than willpower — a 5-minute walk works remarkably well.",
      tip: "When the urge hits: screenshot the item and price. Revisit it when the timer goes off. You'll often find the urgency has quietly disappeared.",
    },
    fomo: {
      headline: "For FOMO spenders",
      body: "Sales, 'only 2 left!', limited-time offers — these are engineered to make 24 hours feel impossible. But most deals return, and most FOMO fades. The rule here is learning to recognize artificial urgency. Ask yourself: would I buy this at full price? If not, the discount isn't saving you money — it's costing you money you wouldn't have otherwise spent.",
      tip: "Screenshot the deal and compare how you feel about the item 24 hours later. Doing this just a few times will rewire how you read 'urgent' messaging.",
    },
    reward: {
      headline: "For reward spenders",
      body: "Treating yourself isn't the problem — you've earned it. The challenge is when 'reward' becomes the automatic response to any positive feeling. The rule isn't about denying yourself; it's about making sure the reward actually matches the moment. After 24 hours, ask: is this still the reward I want? When the answer is yes, the purchase becomes even more satisfying.",
      tip: "Build a running wish list. Adding something to the list scratches the itch without the spend — items that stay on the list for 30 days are genuinely worth getting.",
    },
  },
  reflection:
    "Before your next purchase, pause and ask: am I buying this because I want it — or because of how I'm feeling right now?",
};

function ProgressBar({ step, total }) {
  return (
    <div style={{ display: "flex", gap: "5px", marginBottom: "4px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "3px",
            flex: 1,
            borderRadius: "99px",
            background: i < step ? C.teal : "rgba(255,255,255,0.15)",
            transition: "background 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

function ChoiceCard({ label, sub, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: selected
          ? "rgba(13,31,29,0.20)"
          : hover
          ? "rgba(13,31,29,0.10)"
          : C.cardBg,
        border: `1px solid ${selected ? C.deep : hover ? "rgba(13,31,29,0.30)" : C.cardBorder}`,
        borderRadius: "14px",
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        transform: hover && !selected ? "translateY(-2px)" : "none",
      }}
    >
      <p
        style={{
          fontSize: "16px",
          fontWeight: selected ? 600 : 400,
          margin: "0 0 2px",
          color: C.deep,
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
      {sub && (
        <p style={{ fontSize: "14px", color: "rgba(13,31,29,0.85)", margin: 0, lineHeight: 1.4 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const btnYellow = {
  background: C.yellow,
  color: C.dark,
  border: "none",
  borderRadius: "12px",
  padding: "15px 28px",
  fontSize: "16px",
  fontWeight: 700,
  cursor: "pointer",
  width: "100%",
  fontFamily: "inherit",
  transition: "opacity 0.15s ease",
  letterSpacing: "0.2px",
};

export default function Habitrii() {
  const [screen, setScreen] = useState("welcome");
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [world, setWorld] = useState(null);
  const [branch, setBranch] = useState(null);
  const [fading, setFading] = useState(false);

  const go = (next, updates = {}) => {
    setFading(true);
    setTimeout(() => {
      if (updates.q1 !== undefined) setQ1(updates.q1);
      if (updates.q2 !== undefined) setQ2(updates.q2);
      if (updates.world !== undefined) setWorld(updates.world);
      if (updates.branch !== undefined) setBranch(updates.branch);
      setScreen(next);
      setFading(false);
    }, 220);
  };

  const outer = {
    fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
    background: C.teal,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "36px 24px 60px",
    boxSizing: "border-box",
    opacity: fading ? 0 : 1,
    transition: "opacity 0.22s ease",
    color: C.deep,
  };

  const inner = {
    width: "100%",
    maxWidth: "560px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  // ── WELCOME ──────────────────────────────────────────────────────────────
  if (screen === "welcome")
    return (
      <div style={{ ...outer, justifyContent: "center" }}>
        <div style={{ ...inner, textAlign: "center" }}>
          <div>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 20px",
                fontWeight: 600,
              }}
            >
              HABITRII
            </p>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: "0 0 16px",
                color: C.deep,
              }}
            >
              Financial literacy
              <br />
              that actually{" "}
              <span style={{ color: C.yellow }}>clicks.</span>
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                margin: "0 0 36px",
                maxWidth: "400px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              A choose-your-own-adventure journey through money — built around
              how you think, feel, and make decisions.
            </p>
          </div>
          <button onClick={() => go("q1")} style={btnYellow}>
            Start your journey →
          </button>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            For educational purposes only · Not financial advice
          </p>
        </div>
      </div>
    );

  // ── Q1: KNOWLEDGE LEVEL ─────────────────────────────────────────────────
  if (screen === "q1")
    return (
      <div style={outer}>
        <div style={inner}>
          <ProgressBar step={1} total={4} />
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 10px",
                fontWeight: 600,
              }}
            >
              QUESTION 1 OF 2
            </p>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              Where are you on your financial learning journey?
            </h2>
          </div>
          {[
            { id: 1, label: "I'm pretty new to this", sub: "I don't really know where to start with money stuff" },
            { id: 2, label: "I know the basics", sub: "I want to get smarter about saving, budgeting, or debt" },
            { id: 3, label: "I'm fairly knowledgeable", sub: "I want deeper insights into why I make the money decisions I do" },
          ].map((o) => (
            <ChoiceCard
              key={o.id}
              label={o.label}
              sub={o.sub}
              selected={q1 === o.id}
              onClick={() => { setQ1(o.id); setTimeout(() => go("q2"), 280); }}
            />
          ))}
        </div>
      </div>
    );

  // ── Q2: PERSONALITY ──────────────────────────────────────────────────────
  if (screen === "q2")
    return (
      <div style={outer}>
        <div style={inner}>
          <ProgressBar step={2} total={4} />
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 10px",
                fontWeight: 600,
              }}
            >
              QUESTION 2 OF 2
            </p>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              Habitrii uses personality frameworks to personalize your journey. Which sounds like you?
            </h2>
          </div>
          {[
            { id: "a", label: "I know my MBTI and/or astrology signs", sub: "Let's use them to shape my experience" },
            { id: "b", label: "I'm curious but new to personality stuff", sub: "Help me figure it out as we go" },
            { id: "c", label: "I'm mainly here for the financial lessons", sub: "Personality is a fun bonus, not a priority" },
          ].map((o) => (
            <ChoiceCard
              key={o.id}
              label={o.label}
              sub={o.sub}
              selected={q2 === o.id}
              onClick={() => { setQ2(o.id); setTimeout(() => go("worlds"), 280); }}
            />
          ))}
        </div>
      </div>
    );

  // ── WORLD SELECT ────────────────────────────────────────────────────────
  if (screen === "worlds")
    return (
      <div style={outer}>
        <div style={inner}>
          <ProgressBar step={3} total={4} />
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>
              Choose your first Story World
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              Each world is a themed journey through a cluster of financial concepts.
            </p>
          </div>
          {[
            { id: "mind", emoji: "🧠", title: "Mind & Money", desc: "Your emotional relationship with spending — and how to shift it" },
            { id: "budget", emoji: "📐", title: "Budgeting Foundations", desc: "Build a system that actually works for your life" },
            { id: "safety", emoji: "🛡️", title: "Safety & Stability", desc: "Create a financial safety net from the ground up" },
            { id: "debt", emoji: "💳", title: "Debt & Credit", desc: "Take control of what you owe and build your score" },
            { id: "values", emoji: "🌟", title: "Advanced & Values", desc: "Align your spending with what actually matters to you" },
          ].map((w) => (
            <ChoiceCard
              key={w.id}
              label={`${w.emoji}  ${w.title}`}
              sub={w.desc}
              selected={world === w.id}
              onClick={() => { setWorld(w.id); setTimeout(() => go("scene"), 280); }}
            />
          ))}
        </div>
      </div>
    );

  // ── SCENE: THE 24-HOUR RULE ──────────────────────────────────────────────
  if (screen === "scene")
    return (
      <div style={outer}>
        <div style={inner}>
          <ProgressBar step={4} total={4} />
          <div
            style={{
              background: "rgba(87,183,167,0.12)",
              border: "1px solid rgba(87,183,167,0.35)",
              borderRadius: "14px",
              padding: "18px 22px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 8px",
                fontWeight: 600,
              }}
            >
              🧠 MIND &amp; MONEY · LESSON 1
            </p>
            <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2 }}>
              The 24-Hour Rule
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.8)",
                margin: 0,
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              "{scene.hook}"
            </p>
          </div>
          <p style={{ fontSize: "16px", lineHeight: 1.75, color: "rgba(255,255,255,0.82)", margin: 0 }}>
            {scene.concept}
          </p>
          <div>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                margin: "0 0 12px",
              }}
            >
              Which of these sounds most like you?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {scene.choices.map((c) => (
                <ChoiceCard
                  key={c.id}
                  label={`${c.emoji}  ${c.label}`}
                  selected={branch === c.id}
                  onClick={() => { setBranch(c.id); setTimeout(() => go("branch", { branch: c.id }), 280); }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // ── BRANCH ───────────────────────────────────────────────────────────────
  if (screen === "branch" && branch) {
    const b = scene.branches[branch];
    return (
      <div style={outer}>
        <div style={inner}>
          <div
            style={{
              background: "rgba(245,217,36,0.12)",
              border: "1px solid rgba(245,217,36,0.4)",
              borderRadius: "14px",
              padding: "18px 22px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C.yellow,
                margin: "0 0 6px",
                fontWeight: 600,
              }}
            >
              YOUR PATH
            </p>
            <h3 style={{ fontSize: "24px", fontWeight: 700, margin: 0, color: C.yellow }}>
              {b.headline}
            </h3>
          </div>
          <p style={{ fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.85)", margin: 0 }}>
            {b.body}
          </p>
          <div
            style={{
              background: C.mid,
              borderLeft: `3px solid ${C.teal}`,
              borderRadius: "0 10px 10px 0",
              padding: "16px 20px",
            }}
          >
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.78)", margin: 0, lineHeight: 1.65 }}>
              {b.tip}
            </p>
          </div>
          <button onClick={() => go("reflect")} style={btnYellow}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ── REFLECTION ───────────────────────────────────────────────────────────
  if (screen === "reflect")
    return (
      <div style={{ ...outer, justifyContent: "center" }}>
        <div style={{ ...inner, textAlign: "center" }}>
          <div style={{ fontSize: "52px" }}>💛</div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
            Reflection moment
          </h2>
          <div
            style={{
              background: "rgba(87,183,167,0.1)",
              border: "1px solid rgba(87,183,167,0.3)",
              borderRadius: "16px",
              padding: "24px 28px",
            }}
          >
            <p style={{ fontSize: "20px", lineHeight: 1.7, color: C.deep, margin: 0, fontStyle: "italic" }}>
              "{scene.reflection}"
            </p>
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: "420px",
              alignSelf: "center",
            }}
          >
            Save this somewhere you'll see it before you shop. Even asking it once starts rewiring the habit.
          </p>
          <button onClick={() => go("complete")} style={btnYellow}>
            I've got it 💛
          </button>
        </div>
      </div>
    );

  // ── COMPLETE ─────────────────────────────────────────────────────────────
  if (screen === "complete")
    return (
      <div style={{ ...outer, justifyContent: "center" }}>
        <div style={{ ...inner, textAlign: "center" }}>
          <div style={{ fontSize: "56px" }}>✨</div>
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 700, margin: "0 0 12px" }}>
              Lesson 1 complete
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
              You just did the hardest part — starting. The 24-Hour Rule is now in your toolkit.
            </p>
          </div>
          <div
            style={{
              background: C.mid,
              borderRadius: "14px",
              padding: "20px 24px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 8px",
                fontWeight: 600,
              }}
            >
              NEXT IN MIND &amp; MONEY
            </p>
            <p style={{ fontSize: "19px", fontWeight: 700, margin: "0 0 6px" }}>
              🧘 Mindful Spending Check-In
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
              A quick 3-question pause before any purchase — takes 90 seconds, saves real money
            </p>
          </div>
          <button
            onClick={() => go("welcome", { q1: null, q2: null, world: null, branch: null })}
            style={{
              ...btnYellow,
              background: "transparent",
              border: "1px solid rgba(87,183,167,0.5)",
              color: C.teal,
            }}
          >
            ↩ Restart
          </button>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", margin: 0, lineHeight: 1.5 }}>
            For educational purposes only · Not financial advice
          </p>
        </div>
      </div>
    );

  return null;
}
