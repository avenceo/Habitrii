// Money Mirror — the nine archetypes.
//
// Voice rules (keep these when editing):
// - "You tend to," never "you are." A mirror, not a verdict.
// - Every type gets a real strength AND a real blind spot. No shaming, no flattery.
// - Educational and reflective only. No financial advice, no promised outcomes.
// - Each type hands off to a FREE Mind & Money lesson so the bridge into
//   Habitrii is frictionless. Lesson ids match the app's Mind & Money world.

export const ARCHETYPES = {
  deliberator: {
    key: 'deliberator',
    name: 'The Deliberator',
    emoji: '🔍',
    tagline: "You don't spend money. You decide it.",
    mirror:
      "You research the $30 purchase like it's a $3,000 one. Not because you're cheap — because getting it right matters to you, and regret feels worse than waiting. You almost never make a bad purchase. You also rarely make a fast one, and sometimes the tab stays open until the moment has already passed.",
    strength: "Almost no buyer's remorse. When you commit, you're sure.",
    blindSpot:
      'Deliberation can quietly become avoidance. The cost of the perfect decision is often the decision itself.',
    smallShift:
      'Give small purchases a small process. Under a number you choose, decide in five minutes and let it go.',
    lesson: { id: 'L02', title: 'Mindful Spending Check-In', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Deliberator. I don't spend money — I decide it.",
  },

  spark: {
    key: 'spark',
    name: 'The Spark',
    emoji: '✨',
    tagline: "Money is for living. And you're living.",
    mirror:
      "You feel purchases in the moment — the concert, the good dinner, the thing that makes today better. You're not reckless; you're present. Money, to you, is a tool for joy, and you use it that way. The only trouble is that the bill lives in a different tense than the joy does.",
    strength: 'You actually enjoy your money. Plenty of people never learn how.',
    blindSpot: '"Today" wins so often that "later" never gets a vote.',
    smallShift:
      "Keep the joy — just give it a lane. A set amount each month that's fully yours to spend, no guilt attached.",
    lesson: { id: 'L01', title: 'The 24-Hour Rule', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Spark. Money is for living, and I'm living.",
  },

  keeper: {
    key: 'keeper',
    name: 'The Keeper',
    emoji: '🛡️',
    tagline: 'Safe first. Then everything else.',
    mirror:
      "You save before anyone asks you to. A full cushion feels like oxygen, and you'd rather have it than almost anything it could buy. You're the one who's fine when things go wrong — because you planned for wrong. The quieter truth: sometimes the cushion is big enough, and you still can't let yourself feel safe.",
    strength: "Resilience. Emergencies don't become crises for you.",
    blindSpot:
      'Scarcity can outlive its reason. Saving can become a way of never quite arriving.',
    smallShift:
      'Name the number that means "enough." Then let yourself spend a little on the other side of it.',
    lesson: { id: 'L28', title: 'The Spending Feelings Journal', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Keeper. Safe first, then everything else.",
  },

  wanderer: {
    key: 'wanderer',
    name: 'The Wanderer',
    emoji: '🌿',
    tagline: "Money's fine. You'd just rather not think about it.",
    mirror:
      "You don't avoid money out of fear — you avoid it out of preference. You'd rather your head hold ideas, people, plans, anything but a balance. Things tend to work out, and mostly they have. The catch is the occasional surprise that didn't have to be one, because you weren't looking.",
    strength: "Money doesn't own your attention. That's real freedom.",
    blindSpot: "Not looking feels like peace, but it's mostly deferred noise.",
    smallShift:
      'One glance a week. Not a budget — a glance. Ten minutes, same day, then close it.',
    lesson: { id: 'L16', title: 'Your Spending Triggers Map', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Wanderer. Money's fine — I'd just rather not think about it.",
  },

  giver: {
    key: 'giver',
    name: 'The Giver',
    emoji: '🤲',
    tagline: 'You keep the people. Money keeps the score.',
    mirror:
      "You pick up the tab. You lend when asked. You'd rather run short than let someone you love go without. Money, for you, is a way of showing up — and you show up. The part you don't say out loud: you're often last on your own list, and it comes out in small, quiet ways.",
    strength: "Your relationships are genuinely rich. That's not nothing — it's the whole point.",
    blindSpot: '"No" feels like withdrawing love. So you don\'t say it, even when you should.',
    smallShift:
      'Decide your giving number before the moment asks for it. Generosity with a boundary is still generosity.',
    lesson: { id: 'L14', title: 'Saying No to FOMO', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Giver. I keep the people — money keeps the score.",
  },

  architect: {
    key: 'architect',
    name: 'The Architect',
    emoji: '📐',
    tagline: "If it's not in the system, it's not real.",
    mirror:
      "You have the spreadsheet. The categories. The plan for the plan. Structure calms you, and honestly, it works — you know where every dollar sleeps. What the system can't hold is the unplanned good thing, and when life colors outside the lines, you feel it as failure instead of as life.",
    strength: "Clarity. You're never surprised by your own money.",
    blindSpot: "Rigidity. A plan that can't bend eventually breaks — or squeezes the joy out.",
    smallShift:
      'Build a line in the plan called "unplanned." Fund it. Spend it without a receipt.',
    lesson: { id: 'L02', title: 'Mindful Spending Check-In', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Architect. If it's not in the system, it's not real.",
  },

  soother: {
    key: 'soother',
    name: 'The Soother',
    emoji: '☕',
    tagline: 'When the day is hard, you buy a little softness.',
    mirror:
      "A rough day ends with a small package, a treat, a something. Not because you're careless — because it works, for about an hour. You're more emotionally honest than most people about money; you just route the feeling through a checkout. The relief is real. So is the fact that it fades, and the feeling comes back with a receipt.",
    strength: 'You know what you feel. Most people spend emotionally and call it logic.',
    blindSpot: 'The purchase treats the symptom. The day is still hard.',
    smallShift:
      "Before the buy, name the feeling out loud. You can still buy it — just say what it's for first.",
    lesson: { id: 'L29', title: 'Healthy Coping Alternatives', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Soother. When the day is hard, I buy a little softness.",
  },

  dreamer: {
    key: 'dreamer',
    name: 'The Dreamer',
    emoji: '🌅',
    tagline: "You're not spending. You're building.",
    mirror:
      "You think in five-year arcs. The course, the business, the move, the thing that changes everything — you'll fund the vision before you fund the Tuesday. Optimism isn't a mood for you, it's a strategy, and it's carried you further than caution would have. The blind spot is that the future keeps borrowing from the present, and the present sometimes runs short.",
    strength: 'You actually go. Most people plan the dream; you pay for it.',
    blindSpot: 'The vision is funded. The rent is a surprise.',
    smallShift:
      'Give the dream a monthly number — and give this month one too. Both are real.',
    lesson: { id: 'L13', title: 'Emotional Spending Awareness', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Dreamer. I'm not spending — I'm building.",
  },

  hunter: {
    key: 'hunter',
    name: 'The Hunter',
    emoji: '🎯',
    tagline: "You never pay full price. Sometimes that's the problem.",
    mirror:
      "You know the price history. You have the app, the code, the timing. Winning the deal is its own satisfaction — and you're genuinely good at it. The quiet trick a sale plays on you is the one it plays on everyone: \"saved\" money on something you weren't going to buy is still money gone. The hunt can pick the target.",
    strength: 'Efficiency. You get more per dollar than almost anyone.',
    blindSpot: 'A bargain on the wrong thing is still the wrong thing.',
    smallShift:
      "Before the deal, one question: would I buy this at full price? If the answer is no, it isn't a save.",
    lesson: { id: 'L15', title: 'The True Cost of Sales', world: 'Mind & Money' },
    shareLine: "My Money Mirror says I'm The Hunter. I never pay full price — sometimes that's the problem.",
  },
};

// Display order (used for the blog + "all nine" listing).
export const ARCHETYPE_ORDER = [
  'deliberator', 'spark', 'keeper', 'wanderer', 'giver',
  'architect', 'soother', 'dreamer', 'hunter',
];

// Tie-break order for scoring: rarer-to-reach types resolve first so the
// distribution stays balanced. Do not use this for display.
export const TIEBREAK_ORDER = [
  'soother', 'dreamer', 'wanderer', 'hunter', 'giver',
  'keeper', 'deliberator', 'spark', 'architect',
];
