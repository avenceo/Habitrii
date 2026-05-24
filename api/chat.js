// Habitrii — Vercel Serverless Function
// Secure proxy between the React app and the Anthropic API.
// The API key never touches the browser — it lives only in Vercel's
// environment variables and is accessed here on the server.

export default async function handler(req, res) {

  // ── CORS (allows local dev at localhost:5173) ───────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  // ── Validate API key ────────────────────────────────────────────────────
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("VITE_ANTHROPIC_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "API key not configured" });
  }

  // ── Parse and validate request body ────────────────────────────────────
  const { profile, lesson, choice } = req.body ?? {};

  if (!profile || !lesson || !choice) {
    return res.status(400).json({
      error: "Missing required fields: profile, lesson, choice",
    });
  }

  // ── Build prompt ────────────────────────────────────────────────────────
  const system  = buildSystemPrompt(profile, lesson);
  const message = buildUserMessage(choice, lesson);

  // ── Call Anthropic API ──────────────────────────────────────────────────
  console.log("API key present:", !!apiKey, "| Key prefix:", apiKey?.slice(0,7));
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 350,
        system,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.json().catch(() => ({}));
      console.error("Anthropic API error:", errBody);
      return res.status(anthropicRes.status).json({
        error: errBody?.error?.message ?? "Anthropic API error",
      });
    }

    const data = await anthropicRes.json();
    const text = data.content?.[0]?.text ?? "";
    return res.status(200).json({ text });

  } catch (err) {
    console.error("chat handler threw:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ── System prompt builder ─────────────────────────────────────────────────
function buildSystemPrompt(profile, lesson) {

  const levelMap = {
    1: "beginner — keep it simple, avoid jargon, use everyday examples",
    2: "intermediate — comfortable with money basics, ready for nuance",
    3: "advanced — wants depth, appreciates psychological insight",
  };
  const level = levelMap[profile.q1] ?? levelMap[2];

  const personalityStyle =
    profile.q2 === "a"
      ? "This person loves personality frameworks. Weave in MBTI and astrology insights naturally — they'll appreciate the self-awareness angle."
      : profile.q2 === "b"
      ? "This person is curious about personality but new to it. Light references only — don't lead with it."
      : "This person is focused on practical outcomes. Skip personality references entirely.";

  const mbtiLine      = profile.mbti        ? `MBTI type: ${profile.mbti}.`               : "";
  const westernLine   = profile.westernSign ? `Western sign: ${profile.westernSign}.`      : "";
  const chineseLine   = profile.chineseSign ? `Chinese zodiac: ${profile.chineseSign}.`    : "";
  const profileBlock  = [mbtiLine, westernLine, chineseLine].filter(Boolean).join(" ");

  return `You are Penny — Habitrii's warm, encouraging financial companion. You help adults build better money habits through self-awareness, not shame. You never lecture, never judge, and always stay human.

USER PROFILE
Knowledge level: ${level}
${profileBlock ? `Personality: ${profileBlock}` : ""}
Style note: ${personalityStyle}

CURRENT LESSON
Title: ${lesson.title}
Core concept: ${lesson.concept}

YOUR JOB
The user just completed a lesson and is doing a quick check-in on whether it landed. Write a personalized 2–4 sentence response. Be specific to the lesson — no generic encouragement. End with ONE concrete action they can take today.

RULES
- 2–4 sentences only. No bullet lists. No headers. No bold text.
- Warm, direct, and human. No corporate-speak.
- This is educational content only — not financial advice. Never promise outcomes.`;
}

// ── User message builder ──────────────────────────────────────────────────
function buildUserMessage(choice, lesson) {
  const ctx = `Lesson: "${lesson.title}". Concept: ${lesson.concept}`;
  const map = {
    yes: `The user said this lesson clicked for them. ${ctx}. Give warm validation and extend the idea with one fresh, personality-relevant insight.`,
    sort_of: `The user said this lesson sort of clicked but not fully. ${ctx}. Reframe the concept using a completely different metaphor or real-life scenario. Warm and encouraging.`,
    no: `The user said this lesson didn't click — and that's completely okay. ${ctx}. Explain the core idea from scratch in the simplest, freshest way possible. Extra warm and reassuring. No shame.`,
  };
  return map[choice] ?? `The user just finished the lesson on ${lesson.title}. Offer a warm, brief reflection.`;
}
