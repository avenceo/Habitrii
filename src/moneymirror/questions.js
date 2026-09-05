// Money Mirror — five behavioral questions.
//
// Design rules:
// - Behavior, not personality. A stranger can answer these in under a minute
//   with no prior self-knowledge (no MBTI, no birth data).
// - Each option carries weighted points toward 1–2 archetypes. The highest
//   total wins; ties resolve by ARCHETYPE_ORDER.
// - Weights are tuned so every type is reachable and none dominates.
//   Run `node scripts/balance-check.mjs` after any edit.

export const QUESTIONS = [
  {
    id: 'q1',
    prompt: 'An unexpected $500 lands in your account. First honest instinct?',
    options: [
      { label: 'Straight into savings. I barely feel it.', weights: { keeper: 3, architect: 1 } },
      { label: "Something I've wanted — and I'll enjoy it this week.", weights: { spark: 2, soother: 2 } },
      { label: "I'd think about the best use for a while before touching it.", weights: { deliberator: 3, hunter: 1 } },
      { label: "Toward the thing I'm building — the plan, the goal, the future.", weights: { dreamer: 3, keeper: 1 } },
    ],
  },
  {
    id: 'q2',
    prompt: 'How often do you actually look at your balance?',
    options: [
      { label: 'Often. I like knowing exactly where things stand.', weights: { architect: 3, keeper: 1 } },
      { label: "Rarely. It usually works out, and I'd rather not carry it around.", weights: { wanderer: 3, dreamer: 1 } },
      { label: 'Right before a decision — then I go deep.', weights: { deliberator: 2, hunter: 2 } },
      { label: "Honestly, less when I'm stressed.", weights: { soother: 2, wanderer: 2 } },
    ],
  },
  {
    id: 'q3',
    prompt: "It's been a hard day. Money-wise, you're most likely to…",
    options: [
      { label: 'Buy something small that makes the evening feel better.', weights: { soother: 3, spark: 1 } },
      { label: "Nothing changes. My routine holds, and money isn't really on my mind.", weights: { wanderer: 2, architect: 1, keeper: 1 } },
      { label: 'Go hunting for a deal. Finding a bargain is weirdly calming.', weights: { hunter: 3 } },
      { label: 'Spend on or with people — dinner, a gift, picking up the tab.', weights: { giver: 3, spark: 1 } },
    ],
  },
  {
    id: 'q4',
    prompt: "Something you like is 40% off. You hadn't planned to buy it.",
    options: [
      { label: "That's a win. Buying it.", weights: { hunter: 2, spark: 2 } },
      { label: "I'll wait a day and see if I still want it.", weights: { deliberator: 3, architect: 1 } },
      { label: 'Only if it fits the plan. Otherwise, no.', weights: { architect: 3 } },
      { label: "I'd probably get it — for someone I love, not for me.", weights: { giver: 3 } },
    ],
  },
  {
    id: 'q5',
    prompt: 'When you think about money five years from now…',
    options: [
      { label: "I picture the big thing I'm building toward. It pulls me forward.", weights: { dreamer: 3, spark: 1 } },
      { label: 'I want a cushion so solid nothing can shake me.', weights: { keeper: 3, architect: 1 } },
      { label: "Honestly, I don't think that far. I'm here now.", weights: { spark: 3, wanderer: 1 } },
      { label: 'I want the people around me taken care of.', weights: { giver: 3, dreamer: 1 } },
    ],
  },
];

// Score a list of chosen option indexes (one per question) → archetype key.
export function scoreAnswers(answers, order) {
  const totals = {};
  answers.forEach((optIdx, qIdx) => {
    const opt = QUESTIONS[qIdx] && QUESTIONS[qIdx].options[optIdx];
    if (!opt) return;
    Object.entries(opt.weights).forEach(([key, pts]) => {
      totals[key] = (totals[key] || 0) + pts;
    });
  });
  let best = null;
  let bestScore = -1;
  order.forEach((key) => {
    const s = totals[key] || 0;
    if (s > bestScore) {
      best = key;
      bestScore = s;
    }
  });
  return { key: best, totals };
}
