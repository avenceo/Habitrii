import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import { Turnstile } from "@marsidev/react-turnstile";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";
import AuthFlow from "./AuthFlow";
import { supabase } from "./lib/supabase";
import PlanSelect from "./PlanSelect";
import { fetchProfile, savePersonality, completeOnboarding, fetchPersonality, trialActive } from "./lib/profile";

// ─── Color System ─────────────────────────────────────────────────────────────
const C = {
  bg:"#57b7a7", dark:"#232321", mid:"#32322f",
  card:"#ffffff", cardHover:"#f0faf8", cardSelected:"#f5d924",
  cardBorder:"rgba(35,35,33,0.14)", cardBorderSel:"rgba(35,35,33,0.35)",
  text:"#232321", textSub:"rgba(35,35,33,0.7)", textMut:"rgba(35,35,33,0.62)",
  textOnDark:"#ffffff", teal:"#57b7a7", yellow:"#f5d924", gray:"#a09e98",
};

const btnYellow = {
  background:C.yellow, color:C.dark, border:"none", borderRadius:"12px",
  padding:"15px 28px", fontSize:"16px", fontWeight:700, cursor:"pointer",
  width:"100%", fontFamily:"inherit", letterSpacing:"0.2px",
  boxShadow:"0 2px 12px rgba(245,217,36,0.35)", transition:"all 0.15s ease",
};
const btnGhost = {
  background:"rgba(255,255,255,0.5)", color:C.dark,
  border:"1.5px solid rgba(35,35,33,0.22)", borderRadius:"12px",
  padding:"15px 28px", fontSize:"16px", fontWeight:600, cursor:"pointer",
  width:"100%", fontFamily:"inherit", transition:"all 0.15s ease",
};
const btnBack = {
  background:C.yellow, color:C.dark, border:"none", borderRadius:"10px",
  padding:"9px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer",
  fontFamily:"inherit", alignSelf:"flex-start", letterSpacing:"0.2px",
  boxShadow:"0 2px 8px rgba(245,217,36,0.3)", transition:"all 0.15s ease",
};
const lbl = (color=C.dark) => ({
  fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase",
  color, fontWeight:600, margin:"0 0 8px",
});

// ─── Personality Data ─────────────────────────────────────────────────────────
const MBTI_TYPES = [
  {code:"INTJ",label:"Architect"},  {code:"INTP",label:"Thinker"},
  {code:"ENTJ",label:"Commander"},  {code:"ENTP",label:"Debater"},
  {code:"INFJ",label:"Advocate"},   {code:"INFP",label:"Mediator"},
  {code:"ENFJ",label:"Protagonist"},{code:"ENFP",label:"Champion"},
  {code:"ISTJ",label:"Inspector"},  {code:"ISFJ",label:"Defender"},
  {code:"ESTJ",label:"Executive"},  {code:"ESFJ",label:"Consul"},
  {code:"ISTP",label:"Virtuoso"},   {code:"ISFP",label:"Adventurer"},
  {code:"ESTP",label:"Entrepreneur"},{code:"ESFP",label:"Entertainer"},
];

const WESTERN_SIGNS = [
  {sign:"Aries",emoji:"♈"},{sign:"Taurus",emoji:"♉"},
  {sign:"Gemini",emoji:"♊"},{sign:"Cancer",emoji:"♋"},
  {sign:"Leo",emoji:"♌"},{sign:"Virgo",emoji:"♍"},
  {sign:"Libra",emoji:"♎"},{sign:"Scorpio",emoji:"♏"},
  {sign:"Sagittarius",emoji:"♐"},{sign:"Capricorn",emoji:"♑"},
  {sign:"Aquarius",emoji:"♒"},{sign:"Pisces",emoji:"♓"},
];

const CHINESE_ZODIAC = [
  {sign:"Rat",emoji:"🐭"},{sign:"Ox",emoji:"🐂"},
  {sign:"Tiger",emoji:"🐯"},{sign:"Rabbit",emoji:"🐰"},
  {sign:"Dragon",emoji:"🐲"},{sign:"Snake",emoji:"🐍"},
  {sign:"Horse",emoji:"🐴"},{sign:"Goat",emoji:"🐑"},
  {sign:"Monkey",emoji:"🐵"},{sign:"Rooster",emoji:"🐓"},
  {sign:"Dog",emoji:"🐶"},{sign:"Pig",emoji:"🐷"},
];

// ─── Lesson Data ──────────────────────────────────────────────────────────────
// ── Card color rotation (approved 2026-07-16) ────────────────────────────────
// Surfaces rotate teal/yellow/white via a seeded shuffle (stable across renders,
// never the same tone back-to-back). Borders are 1px; the one exception is a
// teal card on the teal canvas, which takes 2px white. Gray is trim only.
const CARD_TONES = ["#57b7a7", "#f5d924", "#ffffff"];
const CARD_SEQ = (() => {
  const seq = []; let prev = -1, s = 7;
  for (let i = 0; i < 48; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    let p = s % 3; if (p === prev) p = (p + 1) % 3;
    seq.push(p); prev = p;
  }
  return seq;
})();
const cardTone = (i) => CARD_TONES[CARD_SEQ[i % CARD_SEQ.length]];
// Glow system (July 18 QA): yellow/white cards carry a soft glow instead of a
// black border — matches the CTA treatment. Teal keeps its white border for
// separation against the teal canvas.
const toneBorder = (tone) => tone === "#57b7a7" ? "2px solid #ffffff" : "none";
const toneGlow = (tone) => tone === "#f5d924" ? "0 4px 18px rgba(245,217,36,0.5)"
  : tone === "#ffffff" ? "0 4px 18px rgba(255,255,255,0.6)" : "none";
const toneCard = (i) => { const t = cardTone(i); return { background: t, border: toneBorder(t), boxShadow: toneGlow(t) }; };

const FREE_LESSONS = 3; // Foundation tier: first N Mind & Money lessons free forever

const LESSONS = [
  {
    id:"L01",number:"01",title:"The 24-Hour Rule",emoji:"⏰",duration:"3 min",
    hook:"You're about to check out. Cart total: $87. Your thumb is hovering over 'Place Order.' Sound familiar?",
    concept:"The 24-Hour Rule is disarmingly simple: before buying anything non-essential, wait 24 hours. That gap between impulse and action is where your real preferences live. Studies show up to 73% of impulse purchases are regretted within a day — the rule turns that regret into clarity before it costs you.",
    choices:[
      {id:"a",emoji:"😮‍💨",label:"I spend when I'm stressed or overwhelmed"},
      {id:"b",emoji:"🏷️", label:"I spend when I see a deal or feel left out"},
      {id:"c",emoji:"🎉", label:"I spend to celebrate or treat myself"},
    ],
    branches:{
      a:{headline:"For stress spenders",body:"Buying something feels like a reset — a quick hit of control when life feels out of hand. The 24-Hour Rule works here because stress spending always feels urgent, but it's almost never a real deadline. Set a phone timer, close the tab, and let the urgency pass. A 5-minute walk breaks the loop faster than willpower alone.",tip:"Screenshot the item and price. Revisit it when the timer goes off. You'll often find the urgency has quietly disappeared."},
      b:{headline:"For FOMO spenders",body:"Sales, 'only 2 left!', limited-time offers — these are engineered to make 24 hours feel impossible. But most deals return, and most FOMO fades. Ask yourself: would I buy this at full price? If not, the discount isn't saving you money — it's costing you money you wouldn't have otherwise spent.",tip:"Screenshot the deal and compare how you feel about the item 24 hours later. Doing this a few times rewires how you read 'urgent' messaging."},
      c:{headline:"For reward spenders",body:"Treating yourself isn't the problem — you've earned it. The challenge is when 'reward' becomes the automatic response to any positive feeling. The rule isn't about denying yourself; it's about making sure the reward matches the moment. After 24 hours, ask: is this still the reward I want?",tip:"Build a running wish list. Items that stay on it for 30 days are genuinely worth getting."},
    },
    reflection:"Before your next purchase, pause and ask: am I buying this because I want it — or because of how I'm feeling right now?",
    teaser:{title:"Mindful Spending Check-In",desc:"Three questions. 90 seconds. Enough to know if you actually want it."},
  },
  {
    id:"L02",number:"02",title:"Mindful Spending Check-In",emoji:"🧘",duration:"2 min",
    hook:"Your thumb is hovering. The item is in your cart. Something makes you pause. That pause? That's the check-in trying to happen. Let's make it intentional.",
    concept:"The Mindful Spending Check-In is three questions before any non-essential purchase: Do I need this or want it? Will I still want it in a week? Am I buying this for me, or for how it looks to others? Ninety seconds. That's all it takes to find out if a purchase is genuinely yours.",
    choices:[
      {id:"a",emoji:"🛋️",label:"I'm browsing and just found something"},
      {id:"b",emoji:"🎁",label:"I feel like I've earned a treat"},
      {id:"c",emoji:"👀",label:"I saw someone else with it and want one"},
    ],
    branches:{
      a:{headline:"The browsing check-in",body:"Browsing mode is a receptive headspace designed for finding things — and algorithms are tuned to your taste. The check-in creates a pattern interrupt: you shift from passive scroll to active choice. Ask the three questions before you hit 'add to cart.' You'll still buy plenty — but they'll be things you actually wanted.",tip:"Try a 'save for later' list instead of your cart. Items you return to after a week? Buy them. Items you forget? You already have your answer."},
      b:{headline:"The reward check-in",body:"You do deserve nice things. The check-in here is about proportion — does the treat match the moment? A hard week deserves something real. A stressful afternoon might deserve a walk and a good meal, not a $90 item that arrives days later when the feeling has passed.",tip:"Before you buy, name the thing you're rewarding yourself for — out loud or in writing. If you can name it specifically, the purchase is probably genuine."},
      c:{headline:"The comparison check-in",body:"Wanting what someone else has is completely human. The check-in helps you separate 'I want that specific thing' from 'I want the feeling that thing seems to give them.' The first leads to purchases you love. The second leads to purchases that don't quite land.",tip:"When you spot something through someone else, add it to a list and wait 48 hours. If you go looking, you wanted it. If you forgot, the moment passed."},
    },
    reflection:"Next time you feel the urge to buy something, pause and ask: am I buying this for me — or for the version of me I want others to see?",
    teaser:{title:"Emotional Spending Awareness",desc:"What's really driving the purchase? Let's find out."},
  },
  {
    id:"L13",number:"13",title:"Emotional Spending Awareness",emoji:"💭",duration:"3 min",
    hook:"You bought something yesterday. Something small — maybe $18. You barely remember what it was. That's not carelessness. That's emotional spending doing exactly what it's designed to do.",
    concept:"Emotional spending is using a purchase to manage a feeling. It genuinely works — briefly. The problem is that the feeling that triggered it doesn't go away. Awareness is the first tool. You don't need to stop immediately. You just need to start noticing when it's happening.",
    choices:[
      {id:"a",emoji:"😔",label:"Lonely, bored, or disconnected"},
      {id:"b",emoji:"😰",label:"Anxious, stressed, or overwhelmed"},
      {id:"c",emoji:"😤",label:"Frustrated, resentful, or low on self-worth"},
    ],
    branches:{
      a:{headline:"When you're spending to feel connected",body:"Shopping fills silence. Browsing creates stimulation. Packages feel like something to look forward to. These are real needs — connection, novelty, anticipation — and buying briefly satisfies them. The awareness practice: am I shopping because I need something, or because I'm looking for something to do?",tip:"Next time you open a shopping app out of boredom, set a 5-minute timer and text someone instead. If the urge is still there, it might be genuine. If it's gone, you found what you were actually looking for."},
      b:{headline:"When you're spending to feel in control",body:"When everything feels uncertain, buying something feels like a decision you can actually make — a small, completable action in a world that feels unmanageable. The awareness practice: the purchase only provides control for as long as the transaction is happening. What comes after is often the same anxiety, plus a receipt.",tip:"When you feel the urge to stress-shop, write down the one thing that's actually bothering you. Just naming it often reduces the urgency more than a purchase would."},
      c:{headline:"When you're spending to feel deserving",body:"'I've been working so hard and no one notices. I deserve this.' That narrative is true and false at the same time. The purchase is often chosen for what it represents — recognition, reward, proof of value — not what it actually is. What would actually make you feel seen right now?",tip:"Before buying as a reward, write down what you're rewarding yourself for specifically. If you can name it, the purchase may be genuine. If you can't, the spending is chasing the feeling — not delivering it."},
    },
    reflection:"The next time you feel the urge to buy, pause for ten seconds and ask: what am I feeling right now that made me open this? Just asking is enough.",
    teaser:{title:"Saying No to FOMO",desc:"Social pressure is real — here's how to spend from your values instead."},
  },
  {
    id:"L14",number:"14",title:"Saying No to FOMO",emoji:"🙅",duration:"3 min",
    hook:"The group chat just blew up. Everyone's going. Your stomach tightens. You don't even know if you want to go — but the thought of being the only one who didn't? That feeling has a name. And it has a price tag.",
    concept:"FOMO spending is almost never about the thing. It's about belonging, identity, and not being left out of a story that feels important. Saying no to FOMO doesn't mean saying no to experiences — it means knowing when you're making a free choice, and when you're following a script someone else wrote.",
    choices:[
      {id:"a",emoji:"📱",label:"Social media makes me feel behind"},
      {id:"b",emoji:"👥",label:"Friend groups and social pressure"},
      {id:"c",emoji:"⏰",label:"'Limited time' and scarcity messaging"},
    ],
    branches:{
      a:{headline:"When the feed makes you feel behind",body:"Social media shows you a curated highlight reel — everyone's best moments, best purchases, best selves. Comparing your everyday life to that is a losing game by design. The spending it triggers is an attempt to close a gap that doesn't exist. The practice: am I drawn to this thing, or to the life it seems to represent?",tip:"Try a 48-hour unfollow experiment: mute accounts that consistently make you feel like you need to spend. Notice how your spending urges shift within two days."},
      b:{headline:"When you spend to belong",body:"Group spending pressure is real and often subtle — splitting bills you can't afford, buying tickets to avoid being the one who didn't come. The reframe: the people worth spending your life with are not keeping score. Being honest about your budget is not the same as being left out.",tip:"Have one script ready: 'I'm being more intentional with money right now — can we find something that works for both of us?' Most people will meet you there."},
      c:{headline:"When the countdown clock gets you",body:"'Limited time.' 'Only 2 left.' 'Sale ends at midnight.' These are pressure mechanisms, not neutral descriptions. The reframe: if this deal disappeared tonight, would I regret not having the item — or would I forget about it by Tuesday? Most 'last chance' deals come back.",tip:"When you see urgency language, add the item to a list and set a 24-hour reminder. If it's gone and you still want it, buy it at full price. If you forgot, the urgency did its job — and you didn't let it."},
    },
    reflection:"The next time you feel the pull to spend because of what others are doing — pause and ask: am I making this choice freely, or following a script someone else wrote?",
    teaser:{title:"The True Cost of Sales",desc:"How 'saving money' became one of the most effective ways to spend more."},
  },
  {
    id:"L15",number:"15",title:"The True Cost of Sales",emoji:"🏷️",duration:"3 min",
    hook:"The email arrives: 40% off, today only. Your heart rate ticks up. You weren't planning to buy anything. But now you're browsing — because it would be a shame to miss such a good deal.",
    concept:"Sales don't save you money. They redirect money you weren't planning to spend toward things you weren't planning to buy. The filter is simple: would you buy this at full price? If yes, the sale is a bonus. If no, you're not saving money — you're spending it in a way that feels smarter than it is.",
    choices:[
      {id:"a",emoji:"💯",label:"Percentage-off and flash deals get me"},
      {id:"b",emoji:"📦",label:"Bundle deals and free shipping thresholds"},
      {id:"c",emoji:"⌛",label:"Clearance and 'last chance' pricing"},
    ],
    branches:{
      a:{headline:"When the discount feels like a win",body:"Percentage discounts activate loss aversion — the discomfort of paying more than you have to. When you see 50% off, your brain registers: if I don't buy now, I'm losing money. But you can only lose money you were going to spend. The filter: what would you pay for this item if no sale price were shown?",tip:"Try covering the original price and looking only at the sale price. Ask: would I buy this without knowing it was higher? If knowing the original is what makes it feel good, you're buying the discount — not the item."},
      b:{headline:"When you spend more to save more",body:"'Free shipping on orders over $50.' 'Buy 3, get 1 free.' These are designed to increase your order size. Adding a $12 item to hit the free shipping threshold feels smart — until you realize you spent $12 to avoid a $6 fee. The math only works if what you're adding is something you genuinely wanted.",tip:"When about to add something to hit a threshold, ask: would I buy this in a separate trip? If no, the bundle is costing you more than it's saving."},
      c:{headline:"When 'last chance' feels urgent",body:"Clearance pricing creates a specific psychology: the item is so cheap, it feels wrong not to buy it. But clearance items are often things no one wanted at full price. The question isn't whether the price is low — it's whether you'd want the item at any price if it weren't marked down.",tip:"Before buying clearance, ask: if this item appeared in my home tomorrow with no price tag, would I be glad it was there? If you're not sure, the clearance price is doing more work than the item."},
    },
    reflection:"The next time you feel the pull of a sale, ask yourself: would I buy this at full price? If the answer is no — you're not saving money. You're just spending it differently.",
    teaser:{title:"Your Spending Triggers Map",desc:"Your spending patterns aren't random — they have a map. Let's draw it."},
  },
  {
    id:"L16",number:"16",title:"Your Spending Triggers Map",emoji:"🗺️",duration:"4 min",
    hook:"You didn't plan to spend anything today. One minute you were doing something else — the next, three tabs were open and your cart had four things in it. Spending doesn't come from nowhere. It comes from conditions.",
    concept:"A spending trigger is any condition — emotional, environmental, or social — that makes spending feel automatic. Everyone has them, and they follow patterns that are learnable. Mapping your triggers creates a moment of recognition: 'Oh, this is a trigger situation.' That recognition is the gap between automatic and intentional.",
    choices:[
      {id:"a",emoji:"💭",label:"My feelings drive my unplanned spending most"},
      {id:"b",emoji:"🏙️",label:"Certain places, times, or platforms are my triggers"},
      {id:"c",emoji:"👥",label:"Other people and social contexts are my biggest influence"},
    ],
    branches:{
      a:{headline:"Mapping your emotional triggers",body:"For each significant unplanned purchase you can recall, try to remember: what were you feeling in the hour before? Over time, you'll notice a short list of emotional states that reliably predict your spending. Knowing your emotional trigger list means knowing to check in when those states arrive.",tip:"For one week, every time you make an unplanned purchase, note the feeling that came just before — one word is enough. After seven days, look at the list. The pattern will be obvious."},
      b:{headline:"Mapping your environmental triggers",body:"Environmental triggers are the easiest to see and most actionable to change. Certain apps, stores, times of day, and physical states have reliable associations with spending. Once you identify yours, you can design your environment to reduce accidental exposure — this is called friction-adding.",tip:"Identify your top three environmental triggers. For each, add one layer of friction: log out of shopping apps, unsubscribe from promotional emails, or move your wallet to a different room. Small friction creates big pauses."},
      c:{headline:"Mapping your social triggers",body:"Social triggers are the subtlest and hardest to name: specific people who make you feel like you should spend more, accounts that generate want, events where spending feels like participation. Mapping them isn't about blaming others — it's about recognizing that your spending decisions are always made inside a social context.",tip:"Think of one person or account that consistently makes you feel behind. Consider what a 30-day mute would feel like. Notice your reaction to the idea. That reaction is information."},
    },
    reflection:"The next time you make an unplanned purchase, pause afterward and ask: what were the conditions? The emotion, the environment, the social context. You're building your map one honest observation at a time.",
    teaser:{title:"The Spending Feelings Journal",desc:"What if the most powerful financial tool you own is a notebook?"},
  },
  {
    id:"L28",number:"28",title:"The Spending Feelings Journal",emoji:"📓",duration:"4 min",
    hook:"You bought something last week. Maybe $40 or $60. You can picture the item. What you probably can't picture is how you felt the hour before you bought it. That gap — between the feeling and the purchase — is where the pattern lives.",
    concept:"The Spending Feelings Journal isn't a budget tracker. It tracks the emotional context around your purchases — the before, the during, and the after. Three honest fields, written without judgment. Over time, patterns appear. And those patterns become the most personalized financial tool you have.",
    choices:[
      {id:"a",emoji:"⏮️",label:"The Before — what triggers my spending"},
      {id:"b",emoji:"⏺️",label:"The During — what buying actually feels like"},
      {id:"c",emoji:"⏭️",label:"The After — how I feel once it's done"},
    ],
    branches:{
      a:{headline:"Starting with the trigger",body:"The 'before' entry is the most revealing and the hardest to catch — because the trigger happens before you've decided to pay attention. The practice is to work backward: after a purchase, reconstruct the emotional state that preceded it. Over time, this backward reconstruction gets faster, until you start noticing the trigger while it's happening.",tip:"Keep the entry short: one sentence, one feeling word, one context note. 'Stressed about work. Opened shopping app at 2pm.' That's enough. The pattern emerges from repetition."},
      b:{headline:"Noticing the feeling of buying",body:"The 'during' entry captures what most people have never consciously observed: what does it actually feel like to buy something? For some people it's genuine excitement. For others, it's relief, distraction, or a flat numbness that looks like satisfaction but isn't. Knowing your 'during' feeling tells you what need the purchase is trying to meet.",tip:"Next time you're about to complete a purchase, pause five seconds before clicking confirm. Notice your body. What does buying this feel like right now? The anticipation and the completion often feel very different."},
      c:{headline:"Following the feeling past the receipt",body:"The 'after' entry is where the journal pays off most clearly. Over a few weeks, you'll see which types of purchases reliably leave you feeling satisfied — and which ones leave you flat, regretful, or already thinking about the next thing. That contrast is worth more than any budgeting category.",tip:"Write the after entry at least one hour after the purchase, not immediately. The first feeling is often still dopamine. One hour out, you'll get the honest answer."},
    },
    reflection:"When did you last buy something and feel genuinely, lastingly satisfied? What was different about that purchase? That difference is your compass.",
    teaser:{title:"Healthy Coping Alternatives",desc:"You don't have to stop seeking comfort. You just need more tools in the kit."},
  },
  {
    id:"L29",number:"29",title:"Healthy Coping Alternatives",emoji:"🧰",duration:"4 min",
    hook:"It's 9pm. You're tired in a specific way — emotionally wrung out. Your phone is in your hand. The shopping app is two taps away. The question isn't whether you deserve comfort. You do. The question is whether this comfort will leave you feeling better — or just less bad, temporarily.",
    concept:"The goal isn't to stop seeking comfort. It's to expand your toolkit so spending isn't the only option available. Healthy alternatives aren't about discipline — they're about matching the right tool to the right need. Build a personal toolkit that works for you, so spending becomes a choice, not a default.",
    choices:[
      {id:"a",emoji:"⚡",label:"Stimulation — I'm bored or restless"},
      {id:"b",emoji:"🌿",label:"Soothing — I'm anxious or overwhelmed"},
      {id:"c",emoji:"🤝",label:"Connection — I'm lonely or feeling unseen"},
    ],
    branches:{
      a:{headline:"When boredom is the trigger",body:"Boredom is one of the most underestimated spending triggers. When your mind is under-engaged, browsing and buying provide immediate novelty — exactly what boredom craves. The key is finding alternatives that deliver genuine engagement: a creative project, a game, a walk somewhere new, a conversation, a rabbit hole on something genuinely interesting.",tip:"Build a 'boredom menu' — 5-7 things that genuinely engage you and cost nothing. Keep it visible. The next time you open a shopping app out of boredom, open the list first and choose one thing."},
      b:{headline:"When anxiety is the trigger",body:"Anxiety-driven spending feels like taking action — doing something to manage a situation that feels out of control. But it leaves you with one more thing to think about on top of the original stress. Effective soothing alternatives work with the nervous system: movement, breathwork, time outdoors, a specific playlist.",tip:"Identify your single most reliable calming tool. Write it somewhere visible. When the spending urge arrives in an anxious moment, do that one thing first. Give it ten minutes."},
      c:{headline:"When loneliness is the trigger",body:"Loneliness is the hardest trigger to name and the most common driver of spending that doesn't satisfy. Packages provide anticipation. Shopping mimics participation. But the need underneath — to feel connected, seen, part of something — can't be met by an object. The alternatives require more vulnerability than clicking 'add to cart.' They also actually work.",tip:"The next time you feel the spending urge and loneliness might be underneath it, try texting one specific person before opening the app. Not a group chat — one person. The act of choosing someone is already a form of connection."},
    },
    reflection:"The next time you want to spend to feel better — pause and ask: what do I actually need right now? Name it specifically. Then ask: is there one thing I could try that gets closer to that need, before I open the app?",
    teaser:null,
  },
];

// ─── Budgeting Foundations (Growth) — content from approved briefs, July 18 2026 ──
const BUDGET_LESSONS = [
  {
    id:"L04",number:"01",title:"The 50/30/20 Framework",emoji:"🥧",duration:"4 min",
    hero:"/lessons/l04-hero.png",heroFit:"cover",heroPos:"center",
    hook:"Payday felt great — for about four days. Now it's week three, your balance is doing that thing again, and you honestly couldn't say where the money went.",
    concept:"The 50/30/20 Framework splits your after-tax income into three buckets: 50% for Needs (housing, groceries, the bills that keep life running), 30% for Wants (the spending that makes life feel like yours), and 20% for Future You (saving, and paying down debt faster than the minimum). Its power isn't precision — it's that three buckets is few enough to hold in your head. And the percentages are a starting point, not a grade: in a high-rent city, Needs might genuinely run 60. That's not failure — that's information.",
    choices:[
      {id:"a",emoji:"🙈",label:"Budgets have always felt like punishment"},
      {id:"b",emoji:"🔁",label:"I start budgets strong, then abandon them"},
      {id:"c",emoji:"🧮",label:"I track everything, but it's exhausting"},
    ],
    branches:{
      a:{headline:"For budget avoiders",body:"If every budget you've met felt like a diet, here's the difference: 50/30/20 gives Wants their own bucket, on purpose. Thirty percent of your income is supposed to go to things you simply enjoy — guilt-free by design. A plan that includes joy is a plan you can actually live inside.",tip:"Tonight, change nothing — just sort last month's three biggest purchases into Needs, Wants, or Future You. Looking is the whole assignment."},
      b:{headline:"For strong starters",body:"Most budgets don't die from overspending — they die from precision fatigue. Twenty-seven categories in week one, zero by week six. Three buckets survive busy weeks because close enough still counts, and a budget you almost follow beats a perfect one you abandoned.",tip:"Start from the 20%: write down what 20% of your take-home pay actually is, today. Just knowing that number changes how the month starts."},
      c:{headline:"For detail trackers",body:"You don't need more data — you need a summary layer. Keep the tracking you love, then roll every category up into the three buckets once a month. The ratios will tell you things your line items can't: whether the shape of your month matches the life you're trying to build.",tip:"Roll last month's tracking into the three buckets and write down your actual ratio — that single set of numbers is your baseline."},
    },
    reflection:"Think about your last paycheck. Needs, Wants, Future You: which bucket took more than its share — and which one got whatever was left over?",
    teaser:{title:"Zero-Based Budgeting Light",desc:"Every dollar gets a job — no spreadsheet required."},
  },
  {
    id:"L05",number:"02",title:"Zero-Based Budgeting Light",emoji:"🧾",duration:"3 min",
    hero:"/lessons/l05-hero.png",heroFit:"contain",heroBg:"#ffffff",
    hook:"There's $214 \"left over\" at the end of the month. By the 3rd, it's gone — and you couldn't name a single thing it bought.",
    concept:"Zero-based budgeting runs on one equation: income minus jobs equals zero. Every dollar gets assigned a job before the month starts — not zero dollars in your account, but zero dollars without a purpose. The Light version keeps it to six or eight jobs, never forty. And here's the part people miss: \"stay in savings\" is a job. Assigning a dollar doesn't mean spending it — it means deciding, on purpose, what it's for. Unassigned money has no defense; it says yes to whoever asks first.",
    choices:[
      {id:"a",emoji:"💨",label:"Leftover money always disappears on me"},
      {id:"b",emoji:"🧾",label:"I've tried zero-based apps and drowned in detail"},
      {id:"c",emoji:"🤔",label:"Isn't this just a stricter budget?"},
    ],
    branches:{
      a:{headline:"For the vanishing-leftovers crowd",body:"Your leftovers aren't disappearing — they're being claimed, one small yes at a time, by whatever asks first. Giving money a job isn't restriction; it's protection. \"This $214 is next month's head start\" is a full-time job, and a dollar that knows its purpose is remarkably hard to talk into anything else.",tip:"Tonight, give every dollar currently in your account a one-sentence job. \"Waiting for next month\" absolutely counts."},
      b:{headline:"For the detail-drowned",body:"Those apps failed you by treating precision as the point — forty categories, receipt-level logging, guilt by Thursday. Precision was never the point; assignment was. Six jobs you actually maintain beat forty perfect ones you abandon, every single month.",tip:"Draft your job list today with exactly six lines. If you catch yourself needing a seventh, one of your six is too specific."},
      c:{headline:"For the skeptics",body:"Fair question — but a budget watches your money, while zero-based decides with it, and the deciding happens earlier. The choice moves to payday, when you're calm and can see the whole month, instead of checkout, when you're tired and staring at one shiny thing. Not stricter. Sooner.",tip:"On your next payday, before anything else happens, write down where the first $50 goes. That's the entire practice, in miniature."},
    },
    reflection:"Look at your balance right now. How much of it has a job — and how much is just waiting to be claimed by whatever happens next?",
    teaser:{title:"The Anti-Budget Method",desc:"One decision, zero tracking. The budget for people who hate budgets."},
  },
  {
    id:"L06",number:"03",title:"The Anti-Budget Method",emoji:"🚫",duration:"3 min",
    hero:"/lessons/l06-hero.png",heroFit:"contain",heroBg:"#fffbef",
    hook:"You've downloaded four budgeting apps. You've deleted four budgeting apps. What if the problem was never you?",
    concept:"The Anti-Budget has exactly one move: on payday, set your future aside first — many people start somewhere between 10 and 20 percent, but the number is entirely yours — make sure the bills are covered, and then spend the rest without tracking a single purchase. It works because it relocates willpower: one calm decision a month at payday instead of thirty tired ones at checkout. And the guilt-free part isn't reckless; it's engineered. By the time you're spending, your future and your obligations are already handled. There's nothing left to break.",
    choices:[
      {id:"a",emoji:"🙅",label:"Tracking every purchase makes me quit"},
      {id:"b",emoji:"😬",label:"Guilt-free spending sounds dangerous"},
      {id:"c",emoji:"⚖️",label:"How is this different from 50/30/20?"},
    ],
    branches:{
      a:{headline:"For the tracking-averse",body:"This method was built for you. It asks for one action on one day — the set-aside — and then leaves you alone. There is nothing to log, nothing to categorize, and no streak to break, because the system doesn't depend on your attention. It depends on your payday.",tip:"Today, just write down the one number: the percentage you'd set aside first. No transfer required yet — naming the number is the first rep."},
      b:{headline:"For the cautious",body:"The safety isn't discipline — it's sequencing. Future-you gets paid first and the bills are covered before \"fun money\" even exists, so nothing you do with the remainder can hurt anything that matters. Guilt-free isn't a personality trait here; it's a math property.",tip:"Tonight, total your fixed monthly bills. Knowing the \"already handled\" number is what makes the rest of it feel — and be — safe."},
      c:{headline:"For the systems-minded",body:"50/30/20 is a map of where money should go; the Anti-Budget is a machine for when it goes there. They stack beautifully: set the 20 aside first, and the 50/30 largely sorts itself without tracking. One tells you the shape, the other removes the effort.",tip:"Write one sentence on which fits your temperament better — the map or the machine. That sentence is your budgeting system."},
    },
    reflection:"If saving happened before you ever saw the money, what would change about how the rest of it feels to spend?",
    teaser:{title:"Budget Categories That Actually Work",desc:"Six buckets that fit real life — including the one everyone forgets."},
  },
  {
    id:"L19",number:"04",title:"Budget Categories That Actually Work",emoji:"🗂️",duration:"4 min",
    hero:"/lessons/l19-hero.png",heroFit:"contain",heroBg:"#fef3e1",
    hook:"\"Miscellaneous: $412.\" If your budget's junk drawer is bigger than your grocery line, your categories are quietly lying to you.",
    concept:"Categories fail when they're borrowed from someone else's life — a template's twenty-six lines for a person whose money really moves through six. Most real lives fit: Home, Food, Transport, Fun, People, and Surprises. \"People\" is the one everyone forgets — gifts, treats, helping family — and ignoring it is how generosity gets mislabeled as failure. \"Surprises\" is the other secret: most surprises are just slow bills. Divide the annual ones by twelve and they become boring, and boring is the goal.",
    choices:[
      {id:"a",emoji:"🗂️",label:"My 'misc' category eats everything"},
      {id:"b",emoji:"🎁",label:"I always blow the budget on other people"},
      {id:"c",emoji:"🔁",label:"Annual bills wreck me every time"},
    ],
    branches:{
      a:{headline:"For the misc-drawer owners",body:"Misc grows when your real categories are too narrow or missing entirely — a $400 junk drawer usually has two or three genuine categories hiding inside it. You don't have a discipline problem; you have an unlabeled-shelf problem, and labels are cheap.",tip:"Open last month's statement and sort only the misc items into the six categories. Whichever one fills up fastest was your invisible category."},
      b:{headline:"For the generous",body:"Spending on people you love isn't a leak — it's one of the best things money does. The problem was never the giving; it's that an unnamed category can't be planned for, so every gift registers as going over. Give People its own line and generosity becomes something you do on purpose.",tip:"Total what you spent on others last month — gifts, coffees, helping out. That number, without judgment, is your first People line."},
      c:{headline:"For the annually ambushed",body:"Annual bills are the slowest bills you have — you get eleven months of warning and one month of pain. Divide any yearly amount by twelve and it stops being an event and becomes a line item. (There's a whole toolkit for this waiting in the Safety & Stability world.)",tip:"Write down the next annual bill you already know is coming, and its month. Congratulations — that's your first Surprises entry."},
    },
    reflection:"Which of your six categories have you been funding in secret — and calling a failure every time?",
    teaser:{title:"The Weekly Money Date",desc:"Fifteen minutes, one coffee, zero spreadsheets."},
  },
  {
    id:"L20",number:"05",title:"The Weekly Money Date",emoji:"☕",duration:"3 min",
    hero:"/lessons/l20-hero.png",heroFit:"contain",heroBg:"#fdfcf7",
    hook:"Most money stress doesn't come from what you spent. It comes from not looking — and not-looking compounds faster than any interest rate.",
    concept:"The Weekly Money Date is fifteen minutes, once a week, same time: glance at your balances, scan the week's spending, peek at what's coming. Three looks — that's the whole date. It's a date, not an audit: coffee, music, low stakes, no verdicts allowed. Frequency beats depth, because a weekly glance catches things while they're still small enough to be boring. And the dread shrinks every single week you show up. First dates are awkward. The fifth one is just Tuesday.",
    choices:[
      {id:"a",emoji:"🙈",label:"I avoid looking at my accounts"},
      {id:"b",emoji:"📆",label:"I start routines and then drop them"},
      {id:"c",emoji:"💑",label:"Money talks with my partner turn into fights"},
    ],
    branches:{
      a:{headline:"For the look-avoiders",body:"Avoidance is self-protection — looking has meant bad news often enough that not-looking feels safer. The date works because it's small and scheduled: dread thrives on vagueness, and fifteen defined minutes with a drink you like is about as un-vague as it gets. You're not facing your finances. You're glancing at them.",tip:"Put fifteen minutes on your calendar right now, name it something friendly (\"coffee with my money\"), and decide the drink. That's the whole setup."},
      b:{headline:"For the routine-droppers",body:"Routines don't survive on motivation — they survive on anchors. Attach the date to something you already never skip: Sunday coffee, the load of laundry, the drive home. And missing a week isn't failure; the calendar invite simply fires again, judgment-free, like calendars do.",tip:"Pick your anchor — the existing habit it rides on — and set the recurring invite today."},
      c:{headline:"For the ambushed couples",body:"Most money fights aren't about money — they're about ambush. One person raises it mid-stress, the other gets defensive, repeat. A scheduled date defuses the ambush: it's short, it's expected, and the agenda is three glances, not verdicts. Hard conversations get easier when they stop being surprise attacks.",tip:"Invite your partner to one fifteen-minute date this week with a single rule agreed in advance: we look together, nobody blames."},
    },
    reflection:"What would change if looking at your money were something you did — instead of something that happens to you?",
    teaser:{title:"Annual Financial Planning",desc:"Zoom out — your year has a shape, and seeing it is the plan."},
  },
  {
    id:"L21",number:"06",title:"Annual Financial Planning",emoji:"🗓️",duration:"5 min",
    hero:"/lessons/l21-hero.png",heroFit:"cover",heroPos:"center 41%",
    hook:"Every year has a December. Somehow, the holidays still show up on the credit card like a surprise guest.",
    concept:"Months lie to you one at a time; a year tells the truth. Zoom out and your spending has a shape — the holiday spike, the summer trip, the renewal cluster, the birthday season — and that shape repeats with remarkable loyalty. Annual planning is one sitting, once a year: look back at last year's expensive months, mark the peaks on the calendar ahead with rough numbers, decide what this month should set aside for the nearest one, and book the next sitting. You're not forecasting to the dollar. You're learning your terrain — and a predictable month, seen early, is just a bill with good manners.",
    choices:[
      {id:"a",emoji:"🎄",label:"The holidays flatten me financially every year"},
      {id:"b",emoji:"📅",label:"I can't think past this month"},
      {id:"c",emoji:"🧭",label:"I want goals, not just survival"},
    ],
    branches:{
      a:{headline:"For the December-flattened",body:"December is the least surprising month of the year — it arrives on schedule, costs roughly what it cost last time, and still lands like an ambush because it's one brutal number instead of twelve small ones. Name December's number in July and you've turned a cliff into a staircase — and whatever your personal \"December\" is, the same staircase works on it.",tip:"Look up what last December actually cost you — the real number, no flinching. Divide it by the months remaining this year; that's your holiday line, starting this month."},
      b:{headline:"For the month-locked",body:"When the present is loud, twelve months of vision is too much to ask — so don't ask it. Plan one quarter: what are the two big-ticket events in the next ninety days? That's a complete, legitimate annual plan at starter size. Do it four times and you'll have done the whole year without ever once thinking twelve months ahead.",tip:"Mark just the next quarter's two expensive moments on your calendar, each with a rough number. Done — you've out-planned most people."},
      c:{headline:"For the goal-setters",body:"A goal without a month is a wish; a goal with a month is a plan. Attach each goal to a quarter — the trip lives in Q3, so its funding lives in Q1 and Q2 — and the year's shape stops being pure defense and becomes a route to somewhere you chose. This is where the whole world snaps together: categories tell you where money goes, your system decides how it flows, the weekly date keeps it honest, and the annual view points it all at something.",tip:"Pick one money goal. Write the month it happens, then the month its funding starts. Two dates is all a plan is."},
    },
    reflection:"Looking at the next twelve months, which one is going to be expensive — and what would it feel like to already know that, today?",
    teaser:null,
  },
];

const DEBT_LESSONS = [
  {
    id:"L10",number:"01",title:"Good Debt vs Bad Debt",emoji:"⚖️",duration:"4 min",
    hero:"/lessons/l10-hero.png",heroFit:"contain",heroBg:"#ffffff",
    hook:"Somewhere along the way you learned that all debt is shameful. Then you watched people build whole lives on mortgages and degrees — and the story stopped adding up.",
    concept:"Debt is a tool with a price tag, and the useful question was never \"is debt bad?\" It's two questions: what did this debt buy, and what does it cost? Debt that financed something still growing — an education, a home, a business — is doing a job. Debt financing a moment that's already gone is just charging you rent on the past. The cost side is simple arithmetic: interest rate multiplied by time. A low rate on something that appreciates can be a partnership; a high rate on something already consumed is a leak. And none of this is a moral grade. \"Good\" and \"bad\" here describe the deal, not the person who signed it. Clarity, not shame, is the whole lesson.",
    choices:[
      {id:"a",emoji:"😔",label:"I feel ashamed of my debt"},
      {id:"b",emoji:"🧮",label:"I don't know which of my debts is which"},
      {id:"c",emoji:"🙅",label:"I avoid all debt, even the useful kinds"},
    ],
    branches:{
      a:{headline:"For the debt-ashamed",body:"Debt is a contract, not a character flaw. Every balance you carry was a decision made by a person doing their best with what they knew and what they faced — and shame is the one thing on your statement earning no interest for anyone. The lesson isn't to feel good about debt; it's to look at it without flinching, because you can't work with what you won't look at.",tip:"Tonight, write your debts as a plain list — name, balance, rate. No commentary allowed. A list is information, and information is the opposite of shame."},
      b:{headline:"For the unsorted",body:"Run each debt through the two questions. What did it buy — something still growing, or something already gone? What does it cost — the rate, times the time you'll carry it? Most people find their list sorts itself fast, and the surprise is usually how few of the debts are genuinely working against them.",tip:"Next to each debt on your list, write one word for what it bought. \"Degree.\" \"Car.\" \"Dinners.\" The words do the sorting for you."},
      c:{headline:"For the debt-avoiders",body:"Avoiding all debt is a strategy with its own price tag — the years of rent while waiting to buy in cash, the opportunities that needed capital you didn't have. Many people find that some debts function more like investments than burdens. That doesn't mean borrowing is right for you; it means the avoidance deserves the same two-question scrutiny you'd give the debt.",tip:"Write one sentence about what your debt-avoidance protects you from. Naming the fear makes the trade-off visible — and visible trade-offs are choices instead of reflexes."},
    },
    reflection:"Which of your debts bought something that's still growing — and which bought a moment that's already gone?",
    teaser:{title:"The Debt Snowball Method",desc:"Five debts, one order that changes how paying them feels."},
  },
  {
    id:"L11",number:"02",title:"The Debt Snowball Method",emoji:"⛄",duration:"3 min",
    hero:"/lessons/l11-hero.png",heroFit:"contain",heroBg:"#fbf7eb",
    hook:"Five debts, five minimum payments, zero feeling of progress. What if the order you pay them in could change how the whole thing feels?",
    concept:"The Debt Snowball works like this: list your debts smallest balance to largest, keep paying every minimum, and aim anything extra at the smallest one. When it disappears, roll its entire payment into the next-smallest. Each knocked-out debt makes the rolling payment bigger — hence the snowball. Here's the honest part: this is psychology-first, not math-first. Its power is the quick, visible wins — a debt actually gone, fast — and wins are fuel for a process that takes years. A method that keeps you going beats a theoretically perfect one you abandon in March. It has a math-first sibling, the Avalanche, waiting a few lessons ahead. Neither is \"correct.\" They're two tools for the same job, and the right one depends on what keeps you moving.",
    choices:[
      {id:"a",emoji:"🎯",label:"I need to see progress or I quit"},
      {id:"b",emoji:"🤔",label:"Shouldn't I pay high-interest debt first?"},
      {id:"c",emoji:"😵",label:"I don't even know what I owe"},
    ],
    branches:{
      a:{headline:"For the progress-powered",body:"Then the snowball was designed for your exact wiring. The first debt on its list is chosen precisely because it can die quickly — and watching an entire balance hit zero rewires what feels possible. Momentum isn't a nice-to-have in a years-long project; for most people, it's the project.",tip:"Tonight, write your debts smallest to largest and circle the smallest. That circle is where the method starts — just seeing it chosen changes how the list feels."},
      b:{headline:"For the math-minded",body:"Honest answer: paying the highest rate first — the Avalanche, coming later in this world — usually costs less in total interest, and the difference is real money. The snowball's counter-argument is completion psychology: a method you sustain beats a method you optimize. Which trade matters more is genuinely about you, and it's your call — always.",tip:"Write both orderings of your debts side by side — smallest-first and priciest-first. Notice which list makes you want to start. That reaction is data."},
      c:{headline:"For the not-yet-counted",body:"Then step zero comes before any method: the inventory. Not knowing the total is the most common state in the world, and it's also the heaviest version — the unknown number is always scarier than the real one. Every method starts from the same place: a complete, honest list.",tip:"Gather every statement and write the full list today — balance, rate, minimum for each. Just the list. No plan required yet; the list IS the progress."},
    },
    reflection:"What would it feel like to have one debt actually gone — not smaller balances everywhere, but one line crossed off entirely?",
    teaser:{title:"Credit Score Decoded",desc:"Three digits, one formula, no more black box."},
  },
  {
    id:"L12",number:"03",title:"Credit Score Decoded",emoji:"🔍",duration:"4 min",
    hero:"/lessons/l12-hero.png",heroFit:"contain",heroBg:"#ffffff",
    hook:"Three digits, assigned by a formula you never see, quietly pricing everything from your apartment to your car insurance. Time to turn the black box into glass.",
    concept:"A credit score is a prediction, not a verdict. It estimates one thing: how predictably you handle borrowed money. It says nothing about your worth, your intelligence, or your future — just your pattern. The recipe is roughly five ingredients: payment history (~35%) — do you pay on time; utilization (~30%) — how much of your available credit you're using; age of accounts (~15%); credit mix (~10%); and new applications (~10%). Two ingredients are nearly two-thirds of the dish. Which means the levers are refreshingly boring: pay on time, and keep the share of credit you're using low. Everything else is slow-moving scenery.",
    choices:[
      {id:"a",emoji:"😰",label:"I'm afraid to look at mine"},
      {id:"b",emoji:"📉",label:"Mine dropped and I don't know why"},
      {id:"c",emoji:"📈",label:"I want to raise it — where do I start?"},
    ],
    branches:{
      a:{headline:"For the look-avoiders",body:"An unseen score still gets used — by landlords, lenders, insurers — so not-looking only means you're the last to know. Here's the relief: checking your own score is a \"soft inquiry\" and doesn't lower it, not even a little. Looking is free, private, and instantly converts dread into a number you can work with.",tip:"Look up your score today — most banks and several free services show it. Just look. That's the entire assignment."},
      b:{headline:"For the mystery-drop",body:"The usual suspects, in order: a utilization spike (big balance reported that month), a missed payment, a new application, or an old account closing and shortening your history. And sometimes it's an error — reports contain them more often than you'd think, and disputing them is your legal right, free of charge.",tip:"Pull your free annual credit report this week and scan the recent activity for the change. Finding the cause is diagnosis, not damage."},
      c:{headline:"For the builders",body:"Start where the weight is: the two levers that carry roughly 65%. Many people focus there first — every payment on time, utilization kept low — and treat the rest as background. It isn't fast, because the score measures patterns and patterns take months to form. But it's simple, and simple things done monthly are how three digits move.",tip:"Find your utilization today: statement balance divided by credit limit. Knowing that one percentage is the first lever in your hand."},
    },
    reflection:"If your score is just a record of how predictable you've been — what's one pattern future-you could start recording this month?",
    teaser:{title:"The Debt Avalanche Method",desc:"The snowball's math-first sibling."},
  },
  {
    id:"L25",number:"04",title:"The Debt Avalanche Method",emoji:"🏔️",duration:"4 min",
    hero:"/lessons/l25-hero.png",heroFit:"contain",heroBg:"#faf6e5",
    hook:"Meet the snowball's spreadsheet-loving sibling: same rolling payment, different order — and the difference is measured in interest.",
    concept:"The Avalanche orders your debts by interest rate, highest first. Minimums on everything, extra dollars to the most expensive debt, and when it dies, its payment rolls downhill to the next-priciest. Same engine as the snowball — different fuel. On paper, this is the cheapest path out of debt: every extra dollar attacks the balance charging you the most, so total interest paid is mathematically minimized. The catch is emotional: if your priciest debt is also your biggest, the first win can take a long time to arrive. So the real question isn't which method is right — it's which kind of motivation you run on. Visible wins? Snowball. Knowing the math is optimal? Avalanche. And nobody's checking your homework: hybrids are allowed.",
    choices:[
      {id:"a",emoji:"🧮",label:"I want the cheapest path out"},
      {id:"b",emoji:"🐢",label:"I tried the avalanche and lost steam"},
      {id:"c",emoji:"⚖️",label:"How do I choose between the two methods?"},
    ],
    branches:{
      a:{headline:"For the optimizers",body:"Then the avalanche is your method on paper — every extra dollar working exactly where the leak is biggest. Your version of a \"win\" isn't a closed account; it's watching the interest line on your statements shrink month over month. Track that number and the avalanche gets its own scoreboard.",tip:"Reorder your debt list by interest rate tonight, highest on top. That top line is where extra dollars work hardest — now you know its name."},
      b:{headline:"For the stalled",body:"Losing steam on the avalanche is common enough to have a standard remedy: the hybrid. Many people start with the snowball — kill one small debt fast for the momentum — then switch to avalanche ordering once the habit is load-bearing. The methods are tools, not loyalty oaths; switching isn't quitting, it's tuning.",tip:"Pick your smallest debt as a momentum-starter, and write the avalanche order beside it for the day it's gone. A plan with a morale budget lasts longer."},
      c:{headline:"For the undecided",body:"Here's the honest test: think about the last hard, long thing you actually finished. What kept you going — the visible milestones, or the quiet knowledge you were doing it the smart way? That answer is your method. The best debt strategy isn't the mathematically elegant one; it's the one still running in month nine. Your temperament, your call.",tip:"Write one sentence about the last hard habit you kept and what kept you keeping it. You just chose your method."},
    },
    reflection:"Which moves you more when things get hard: a win you can see, or math you can trust?",
    teaser:{title:"Negotiating Lower Interest Rates",desc:"The rate isn't carved in stone."},
  },
  {
    id:"L26",number:"05",title:"Negotiating Lower Interest Rates",emoji:"📞",duration:"3 min",
    hero:"/lessons/l26-hero.png",heroFit:"contain",heroBg:"#fdf5e8",
    hook:"The interest rate on your card wasn't carved in stone. It was set by a formula — and formulas have an override button called a phone call.",
    concept:"Here's a thing the statements never mention: card issuers routinely review rate-reduction requests, especially from people with a history of on-time payments. There's a retention department whose whole job is deciding whether keeping you is worth a lower rate. The call itself is unglamorous — a few minutes, a few facts: how long you've been a customer, your payment record, what competing offers look like, and the ask. The person answering handles these requests all day; to them it's a Tuesday. The economics of asking are lopsided: a \"no\" costs ten minutes and changes nothing, while a \"yes\" compounds in your favor every month afterward. No outcome is ever guaranteed — the decision is entirely the issuer's — but few sentences in personal finance have a better cost-to-upside ratio than a polite request.",
    choices:[
      {id:"a",emoji:"😬",label:"Talking to companies about money makes me anxious"},
      {id:"b",emoji:"💬",label:"What would I even say?"},
      {id:"c",emoji:"🤨",label:"Does this actually work?"},
    ],
    branches:{
      a:{headline:"For the phone-averse",body:"Scripts kill anxiety — that's their entire job. When the facts are written down before the call, the conversation stops being a performance and becomes a reading. And remember who's on the other end: someone processing routine requests, not judging you. Your ask is a form they fill out, not a favor they grant.",tip:"Write the three facts on a card: years as a customer, your on-time streak, your current rate. Facts on paper are a script — and a script is armor."},
      b:{headline:"For the wordless",body:"The structure is three sentences, not magic: who you've been (\"a customer for X years, on time for Y months\"), what you know (\"I've seen offers at lower rates\"), and the ask (\"is a lower rate available on my account?\"). That's the whole genre. Drafting yours costs nothing and commits you to nothing — having words ready is separate from ever dialing.",tip:"Draft your own three-sentence version today, just to have it. Whether and when to call is a different decision, and it's entirely yours."},
      c:{headline:"For the skeptics",body:"Fair question. Reported success rates for these requests vary by source and year, but they're consistently high enough that a ten-minute call carries remarkable expected value — many surveys find most askers get something. No promises live here: your issuer decides, not you. But \"usually worth asking\" is about as strong as personal-finance findings get.",tip:"Find the current rate on each of your cards today and circle the highest. If you ever do make the call, you now know which account to ask about first."},
    },
    reflection:"What's the most expensive sentence you've never said out loud — and what would it actually cost to say it once?",
    teaser:{title:"Strategic Use of Credit",desc:"Credit as power tools: useful, dangerous, all in the grip."},
  },
  {
    id:"L27",number:"06",title:"Strategic Use of Credit",emoji:"🧰",duration:"5 min",
    hero:"/lessons/l27-hero.png",heroFit:"contain",heroBg:"#fcf4e7",
    hook:"Credit isn't a debt machine, and it isn't the devil. It's power tools — useful, dangerous, and entirely about how you hold them.",
    concept:"Strategic use means the card serves a plan instead of replacing one. The mechanics are known: purchases you'd make anyway, paid in full each cycle, build the payment history the last lesson decoded while paying zero interest. The card becomes a scorekeeper, not a lender. Rewards deserve one honest sentence: points are a rebate, not a reason. The moment a purchase exists because of the points, the rebate has bought you — and rebates never outrun interest. Here's the deeper frame, and it ties this whole world together: a credit card spends future-you's money. Your budget (that's the other Story World) is how future-you gets a vote. Strategy is nothing more than making sure the person paying the bill agreed to the purchase.",
    choices:[
      {id:"a",emoji:"💳",label:"I use credit for everything and worry about it"},
      {id:"b",emoji:"😨",label:"I'm scared to use credit at all"},
      {id:"c",emoji:"🎁",label:"I chase rewards — is that bad?"},
    ],
    branches:{
      a:{headline:"For the worried heavy-users",body:"The tell isn't the swipe count — it's whether the card is executing your budget or writing it. Card-for-everything works fine when the spending was planned and the balance clears monthly; it turns expensive the month the card starts making decisions the budget never saw. One honest comparison shows you which side you're on.",tip:"Tonight, put last month's card statement next to last month's plan. One question: did the card follow the plan, or improvise? No fixing required — just the verdict."},
      b:{headline:"For the credit-wary",body:"Caution around credit is a reasonable response to everything this world covers — and it's still worth knowing the mechanics: used deliberately, small and planned and paid in full, a card builds the history lenders read without costing interest. Whether that trade is worth it for you is genuinely your call. Fear you've examined is judgment; fear you haven't is just a wall.",tip:"Write down what specifically scares you about credit. A named fear usually turns out to be a manageable rule — \"groceries only,\" \"paid every Friday\" — and rules are things you get to set."},
      c:{headline:"For the points-chasers",body:"Rewards are wonderful exactly as long as they're a rebate on spending that already had a reason. The audit is one subtraction: what the points gave you last year, minus what interest and point-justified purchases cost you. Positive number, enjoy the game. Negative, and the game has been playing you — which the card companies quietly count on.",tip:"Look up your last year of rewards redeemed and interest paid. Do the one subtraction. The sign of that number is the whole answer."},
    },
    reflection:"Is your credit card executing your plan — or writing it?",
    teaser:null,
  },
];

const SAFETY_LESSONS = [
  {
    id:"L07",number:"01",title:"Emergency Fund 101",emoji:"🛡️",duration:"3 min",
    hero:"/lessons/l07-hero.png",heroFit:"contain",heroBg:"#faf6ea",
    hook:"The flat tire doesn't care that it's the 28th. The vet bill doesn't check your balance first. Emergencies don't schedule — but you can be ready for them anyway.",
    concept:"An emergency fund is money whose only job is absorbing the unexpected — the repair, the bill, the gap between jobs. It isn't savings for something; it's savings for instead-of-panic. And here's the part that surprises people: the first win isn't financial, it's neurological. Even a small cushion — many people start with a few hundred dollars as a \"starter fund\" — converts a category of catastrophe into a category of inconvenience. The stress reduction arrives long before the fund is \"finished.\" The mechanics are almost insultingly simple: a separate account, out of everyday sight, fed automatically. Separate, so it doesn't get spent by accident. Automatic, so it doesn't depend on remembering to be responsible.",
    choices:[
      {id:"a",emoji:"😱",label:"One surprise bill would wreck me right now"},
      {id:"b",emoji:"🐌",label:"I've tried to save — it never sticks"},
      {id:"c",emoji:"🤷",label:"How is this different from regular saving?"},
    ],
    branches:{
      a:{headline:"For the one-surprise-away",body:"Then this lesson found you at the right time, and here's the reframe: you don't need the finished fund — you need the first rung. A starter cushion measured in hundreds, not months, is what turns \"everything is an emergency\" into \"some things are just annoying.\" Starting small isn't failing at the big version; it's how the big version starts.",tip:"Tonight, open (or just name) a separate place for this money and give it a title you'll respect — \"Do Not Touch: Future Emergencies.\" Naming the container is the first brick."},
      b:{headline:"For the never-sticks savers",body:"Saving that depends on remembering, deciding, and resisting — every single month — isn't a system, it's a willpower tax. The emergency fund version removes all three: a transfer that happens automatically on payday, into an account you don't look at when you're bored. You can't abandon a habit you never have to perform.",tip:"Set up one automatic transfer for the day after your next payday — any amount that won't hurt. The amount matters far less than the automation."},
      c:{headline:"For the skeptics",body:"Regular saving points at a goal you chose: the trip, the car, the deposit. Emergency saving points at the goals you didn't choose — and that's why mixing them fails. One jar with two jobs always resolves the conflict the same way: the fun goal wins, and the emergency finds you uncovered. Separate jars, separate jobs, zero arguments.",tip:"Check whether your emergency money currently shares a container with anything else. If it does, write down what would happen to it the next time the \"fun\" goal gets tempting. That answer is the argument for the second jar."},
    },
    reflection:"Think of your last money emergency. What did it actually cost — and what did the scramble around it cost on top?",
    teaser:{title:"The Sinking Fund Strategy",desc:"Most 'emergencies' sent eleven months of warning first."},
  },
  {
    id:"L08",number:"02",title:"The Sinking Fund Strategy",emoji:"⛵",duration:"3 min",
    hero:"/lessons/l08-hero.png",heroFit:"contain",heroBg:"#fdf1e2",
    hook:"Car registration. The dentist. December. School supplies. None of these are surprises — they told you they were coming a year in advance. So why do they keep arriving like ambushes?",
    concept:"A sinking fund is pre-paying a known future expense to yourself, in slices. Take the bill's date, take its rough size, divide by the months between now and then, and set that slice aside monthly. When the bill lands, the money is already there — bored, waiting, uneventful. This is the tool that separates true emergencies from slow bills: the transmission failing is an emergency; the registration renewing is an appointment. Sinking funds clear the appointments out of your emergency fund's job description. And if you built budget categories in the Budgeting Foundations world, this is the machinery behind the \"Surprises\" line — every yearly bill divided by twelve becomes boring, and boring is the goal. Two or three sinking funds cover most lives.",
    choices:[
      {id:"a",emoji:"🎄",label:"The same expenses ambush me every year"},
      {id:"b",emoji:"🫙",label:"How many funds is too many?"},
      {id:"c",emoji:"😤",label:"I raid my set-aside money before the bill arrives"},
    ],
    branches:{
      a:{headline:"For the annually ambushed",body:"Your ambushes have a schedule — that's the good news hiding inside the frustration. List the three that hit hardest last year, note their months, and you've drawn a map of your next twelve. A bill you can see from eleven months away isn't a threat; it's a slow-motion invoice, and slow things are easy to catch.",tip:"Write down your three most predictable \"surprise\" expenses and the month each one lands. That list is the entire foundation of this strategy."},
      b:{headline:"For the over-organizers",body:"The honest answer: fewer than you think. Twenty micro-funds is a part-time job; two or three grouped funds is a system. Many people run just \"Annual Bills\" (registration, subscriptions, insurance premiums) and \"Celebrations\" (holidays, birthdays, the wedding season) and let the grouping absorb the detail. Precision isn't the point — readiness is.",tip:"Sort your predictable expenses into at most three groups and name each group. If a fourth feels necessary, one of your three is probably mislabeled."},
      c:{headline:"For the raiders",body:"Raiding isn't a character flaw — it's what happens when set-aside money sits in plain sight with a vague name. \"Savings\" gets raided; \"March: car registration\" mostly doesn't, because now spending it has a specific victim with a due date. Friction and naming do the discipline so you don't have to.",tip:"Rename your set-aside money after the specific bill it's for, and move it one step out of everyday reach. Specific names are surprisingly good bodyguards."},
    },
    reflection:"Which bill ambushed you most recently — and how many months of warning did it actually give you?",
    teaser:{title:"Building Your Safety Ladder",desc:"Cushion, funds, and what comes after — the whole net, one rung at a time."},
  },
  {
    id:"L09",number:"03",title:"Building Your Safety Ladder",emoji:"🪜",duration:"5 min",
    hero:"/lessons/l09-hero.png",heroFit:"contain",heroBg:"#f9f2e5",
    hook:"\"Get an emergency fund. Also insurance. Also save more. Also—\" Financial safety advice arrives as a pile. Piles are overwhelming. Ladders aren't — because a ladder tells you what's next.",
    concept:"Financial safety isn't one thing; it's layers that catch different sizes of trouble. A useful way many people sequence it: a small buffer in checking (catches timing hiccups), then a starter emergency cushion (catches the flat tire), then sinking funds (catch the scheduled \"surprises\"), then a fuller emergency fund measured in months (catches the job gap), then insurance (catches what no savings account could). The power of the ladder isn't the rungs — it's the ordering. Each rung makes the next one easier to build: the buffer stops the overdrafts that drain saving, the cushion stops the raids on everything else, the sinking funds stop the cushion from leaking. You're not fighting on five fronts; you're climbing one rung. And one rung at a time means you always know exactly what to work on. Not everything. Just the next thing.",
    choices:[
      {id:"a",emoji:"🫠",label:"The pile overwhelms me — I do nothing instead"},
      {id:"b",emoji:"🪜",label:"Which rung am I actually on?"},
      {id:"c",emoji:"🏃",label:"Can I skip rungs? I want the good stuff"},
    ],
    branches:{
      a:{headline:"For the pile-frozen",body:"Overwhelm isn't a discipline problem — it's what a pile does to a brain. The fix is structural: replace \"everything\" with \"the next rung,\" and suddenly there's exactly one assignment. Nobody climbs a ladder by pulling on every rung at once, and nobody needs to. The bottom rung is small on purpose.",tip:"Write down just your bottom unbuilt rung — nothing else from the pile. One line. That's your entire safety project this month."},
      b:{headline:"For the self-locators",body:"Walk it bottom-up and be honest: Does checking survive a badly-timed bill? Does a few-hundred-dollar surprise come out of a cushion or a card? Do your predictable annual bills have their own funds? Could you cover a month without income? The first \"no\" is your rung — and finding it is genuinely most of the work.",tip:"Run the four questions right now and write down where the first \"no\" landed. That's your rung; everything above it can wait its turn."},
      c:{headline:"For the skippers",body:"You can — it's your ladder — but know what the lower rungs were protecting you from. A months-deep fund with no buffer still bleeds overdraft fees; investments built before a cushion get sold at the worst moment when the tire blows. The lower rungs aren't the boring part; they're what makes the good stuff safe to hold.",tip:"Write one sentence about what happens to your favorite \"upper rung\" goal the next time a mid-sized surprise hits. If the answer involves undoing it, the skipped rung just introduced itself."},
    },
    reflection:"Which rung of your ladder is actually the next one — and what were you working on instead?",
    teaser:{title:"How Much Emergency Fund Do YOU Need",desc:"Everyone quotes a number. Yours isn't theirs."},
  },
  {
    id:"L22",number:"04",title:"How Much Emergency Fund Do YOU Need",emoji:"🧮",duration:"4 min",
    hero:"/lessons/l22-hero.png",heroFit:"contain",heroBg:"#fdf2e3",
    hook:"Ask the internet how big your emergency fund should be and you'll get a chorus: \"three to six months!\" Ask why yours should be three and not six, and the chorus goes quiet. That gap — that's this lesson.",
    concept:"The quoted range exists because emergency funds are measured in time, not money: how many months could you cover the essentials if income stopped? \"Essentials\" is the load-bearing word — rent, food, utilities, minimum payments, the keep-the-lights-on number from your budget. Not your full lifestyle; the survivable version. Where you personally land in (or outside) any range is a function of real factors: how steady your income is, how fast you could replace it, how many people depend on you, what breaks expensive in your life, and — honestly — how much uncertainty costs you in sleep. Two people with identical salaries can have wildly different right answers. So the homework isn't adopting a number — it's knowing your monthly essentials figure and consciously choosing your multiplier. A chosen number, even a modest one, beats a quoted number every time. And done matters: an emergency fund has a finish line, and past it, money can go do other jobs.",
    choices:[
      {id:"a",emoji:"🧮",label:"I don't actually know my monthly essentials number"},
      {id:"b",emoji:"😴",label:"Uncertainty costs me sleep — I want a big cushion"},
      {id:"c",emoji:"🏁",label:"How do I know when I'm done?"},
    ],
    branches:{
      a:{headline:"For the not-yet-counted",body:"Then that's the whole assignment, and it's a pleasant surprise for most people: the survival number is usually well below the normal-month number. Strip last month down to what keeps life running — housing, food, utilities, transport, minimums — and total just that. Every emergency-fund decision you'll ever make is built on this one figure.",tip:"Tonight, total last month's essentials only. Write the number somewhere you'll see it — it's the unit your safety is measured in."},
      b:{headline:"For the sleep-buyers",body:"Peace of mind is a legitimate line item — if uncertainty is expensive for you, a thicker cushion is buying something real, and nobody gets to audit that purchase. The only honest caution: past your chosen finish line, each extra month adds less calm than the one before, while other goals wait. The move isn't \"cap it\" — it's \"choose the cap yourself.\"",tip:"Write the number of months that would actually let you sleep — not the internet's number, yours. Then write what the first dollar past that line would rather be doing."},
      c:{headline:"For the finish-line seekers",body:"Done is when your fund covers your chosen months of essentials — a number you can compute today: essentials × multiplier. Write it down and something shifts: the fund stops being an endless obligation and becomes a project with a progress bar. And projects with progress bars get finished.",tip:"Do the multiplication now — essentials number times your chosen months. That single figure is your finish line; put it where your progress can see it."},
    },
    reflection:"If your income paused tomorrow, how many months would you want between you and the panic — and what makes your number different from your neighbor's?",
    teaser:{title:"The Insurance Safety Net",desc:"The rung for the things no savings account could catch."},
  },
  {
    id:"L23",number:"05",title:"The Insurance Safety Net",emoji:"☂️",duration:"5 min",
    hero:"/lessons/l23-hero.png",heroFit:"contain",heroBg:"#fdf3e3",
    hook:"Your emergency fund can catch a broken transmission. It cannot catch a totaled car, a flooded apartment, or a hospital week. Some risks are simply bigger than any jar — and that's the exact problem insurance was invented for.",
    concept:"Insurance is risk-pooling: many people pay a small certain cost (the premium) so that the few hit by a large uncertain cost aren't ruined by it. You're not \"losing\" premiums any more than you're losing rent — you're buying a ceiling on how bad one day can get. The vocabulary is smaller than it pretends to be. Premium: what you pay. Deductible: the part of a loss you cover before the policy does. Coverage limit: the most it will pay. Exclusion: what it won't touch. Every policy you'll ever read is those four words wearing different outfits. Insurance is a ladder rung, not a replacement for the others — the fund handles what's below the deductible; the policy handles what's above the jar. What kinds, what amounts, and from whom are decisions for you and a licensed professional. This lesson's job is smaller and earlier: making sure you walk into that conversation knowing what the four words mean.",
    choices:[
      {id:"a",emoji:"🙈",label:"I have policies I've honestly never read"},
      {id:"b",emoji:"🤔",label:"Premiums feel like burning money"},
      {id:"c",emoji:"🧩",label:"How do insurance and my emergency fund fit together?"},
    ],
    branches:{
      a:{headline:"For the never-readers",body:"You're in the majority, for what it's worth — policies are written to be skimmed past. But you don't need to read like a lawyer; you need four answers per policy: what do I pay, what's my deductible, what's the limit, what's excluded. Four answers, per policy, and you know more about your own safety net than most people ever will.",tip:"Pick one policy you already have and find just its deductible. One number, one policy. That's the whole assignment — and it usually takes five minutes."},
      b:{headline:"For the premium-resenters",body:"The resentment makes sense — you're paying real money for an invisible product and the best outcome is never using it. The reframe that helps: you're not buying a payout, you're buying a maximum. \"The worst this can cost me is X\" is a real thing you own every month, and it's doing its job precisely on all the days nothing happens.",tip:"For one risk in your life, write down what the uninsured worst case would actually cost. Seeing the size of the thing the premium caps is usually the moment the resentment quiets down."},
      c:{headline:"For the systems-thinkers",body:"They're two layers of the same net, split by size: the emergency fund handles what's below and around the deductible — the fund is even what makes a higher deductible survivable, if you and your professional ever weigh that trade — and the policy handles what no reasonable jar could. Neither replaces the other; each makes the other's job smaller.",tip:"Write your emergency fund number next to one policy's deductible and just look at them side by side. How those two numbers relate is exactly the kind of question to bring to a licensed professional — and now you're bringing it with the vocabulary in hand."},
    },
    reflection:"Which risk in your life is genuinely bigger than any jar you could fill — and do you actually know, today, what would catch it?",
    teaser:{title:"Irregular Income Safety Planning",desc:"When the paycheck itself is the plot twist — the world finale."},
  },
  {
    id:"L24",number:"06",title:"Irregular Income Safety Planning",emoji:"🌊",duration:"5 min",
    hero:"/lessons/l24-hero.png",heroFit:"contain",heroBg:"#faf6e4",
    hook:"Every budgeting rule quietly assumes the same thing: a paycheck that behaves. Freelance, commission, tips, seasonal, gig — if your income has moods, the standard advice doesn't fail politely. It just fails. Here's the version built for you.",
    concept:"The core move is separating when you earn from when you pay yourself. Income lands — whenever, whatever size — in a holding account. From there you pay yourself a level \"salary\" into checking, the same amount on the same day each month. The wild graph becomes someone else's problem; your bills only ever meet the smooth version of you. The salary is set off your baseline month — what the essentials cost plus a realistic normal life — and it's deliberately set against your leaner months, not your best ones. Good months don't raise the salary; they deepen the buffer in the holding account. That buffer is what a \"raise\" looks like when income is irregular: more months of calm, banked. And the safety ladder still applies — it just climbs in percentages instead of amounts. A slice of every payment that lands goes to the rungs. Percentages flex with reality; fixed amounts snap. When income is a wave, you build the net out of ratios.",
    choices:[
      {id:"a",emoji:"🎢",label:"Great months, terrible months — no pattern I can find"},
      {id:"b",emoji:"💸",label:"Good months evaporate before the lean ones arrive"},
      {id:"c",emoji:"🧾",label:"How do I even find my baseline?"},
    ],
    branches:{
      a:{headline:"For the wave-riders",body:"You may have more pattern than you think — most \"random\" income has a floor it rarely breaks. Line up your last several months from worst to best and look at the low cluster: that floor, not the average and definitely not the peaks, is what the smooth-salary system builds on. Plan for the floor and every month above it is a bonus with a job.",tip:"List your last six months of income, worst to best, and circle the lowest cluster. That floor is the number the rest of this lesson stands on."},
      b:{headline:"For the feast-then-famine",body:"Good months evaporate because they arrive labeled as spending money — the label is the leak. The holding-account move relabels them at the door: a strong month isn't a windfall, it's inventory — future salary, warehoused. Nothing about your discipline has to change; the money just stops introducing itself as fun.",tip:"Next above-average payment that lands, move the surplus over your salary line into holding before it reaches checking. One relabeled month and you'll feel the famine-proofing start."},
      c:{headline:"For the baseline-hunters",body:"Baseline is your essentials number plus the realistic minimum of everything else — the quiet-month version of your life, not the punishment version. Too strict and you'll abandon the system by March; the baseline needs to be livable, because it's the amount you'll actually meet every month. Survivable and sustainable are different numbers; you want the second one.",tip:"Take your essentials total and add honest minimums for the rest. Write that figure down — it's your baseline, your smooth salary's first draft, and the last number this world needed from you."},
    },
    reflection:"If your income arrived as a flat line instead of a wave, what would change first — your spending, or your sleep?",
    teaser:null,
  },
];

const VALUES_LESSONS = [
  {
    id:"L03",number:"01",title:"The Joy Per Dollar Ratio",emoji:"✨",duration:"4 min",
    hero:"/lessons/l03-hero.png",heroFit:"contain",heroBg:"#fefefd",
    hook:"Two purchases, same price. One you still smile about a year later; one you can't even find. Your bank statement says they were identical. Your life says they weren't. There's a number for that difference.",
    concept:"Joy per dollar is exactly what it sounds like: how much actual, lasting enjoyment a purchase delivers for what it cost. Not happiness in the moment of buying — that fades in days — but the enjoyment still there on the tenth use, the hundredth wear, the third year. The revelation for most people is how badly price predicts joy: the expensive thing that felt obligatory-to-love scores low; the cheap thing you use daily scores absurdly high. Once you've seen your own pattern — and it's personal, nobody else's ratios transfer — expensive stops meaning good and cheap stops meaning smart. If you played Mind & Money, this is the Check-In's older sibling: that lesson asked \"do I actually want this?\" before the purchase. This one asks \"what did it actually give me?\" after — and the after-answers are what train the before-instincts.",
    choices:[
      {id:"a",emoji:"🛍️",label:"Expensive things keep disappointing me"},
      {id:"b",emoji:"🤷",label:"I honestly can't tell what brings me joy"},
      {id:"c",emoji:"🧾",label:"Isn't this just overthinking shopping?"},
    ],
    branches:{
      a:{headline:"For the disappointed",body:"The pattern usually isn't bad taste — it's borrowed numerators. Expensive purchases carry other people's joy math: the reviews, the status, the person you imagined becoming. The ratio fixes this by only counting joy that actually arrived in your actual life. A few honest scores and you'll find where your money genuinely converts to enjoyment — and it's almost never where the price tags point.",tip:"Rate your three biggest purchases of the past year — just \"still brings me joy: yes/some/no\" next to what they cost. No judgment, just data. The pattern is the lesson."},
      b:{headline:"For the joy-blind",body:"That's more common than you'd think, and it usually means joy is being measured at the wrong moment. Purchase-moment excitement is loud; tenth-use enjoyment is quiet. Look backward instead: what do you already own that you'd instantly replace if it vanished? That list is your joy profile, sitting in plain sight — and it's a better shopping guide than any wishlist.",tip:"Write down the five owned things you'd replace tomorrow if they disappeared. Look at what they cost. That's your joy-per-dollar signature — study it before your next purchase."},
      c:{headline:"For the skeptics",body:"Fair — and for small stuff, you're right: nobody needs a ratio for a coffee. The tool earns its keep on repeat categories and bigger buys, where the same mistake compounds monthly. One honest look at which categories consistently deliver and which consistently don't isn't overthinking; it's the thinking you do once so the next fifty purchases don't need it.",tip:"Pick just one spending category you repeat monthly and ask: is this one still earning its spot? One category, one honest answer. That's the whole practice at minimum dose."},
    },
    reflection:"What's the highest joy-per-dollar thing you own — and what did it cost compared to what you'd have guessed?",
    teaser:{title:"Advanced Impulse Defense",desc:"The 24-Hour Rule was one wall. Here's the whole castle."},
  },
  {
    id:"L17",number:"02",title:"Advanced Impulse Defense",emoji:"🏰",duration:"5 min",
    hero:"/lessons/l17-hero.png",heroFit:"contain",heroBg:"#fefefd",
    hook:"The 24-Hour Rule stops the impulse that politely knocks. But some impulses don't knock — they arrive mid-scroll at 11pm, pre-approved by a stressful day and one-click checkout. For those, one wall isn't enough. You need the whole castle.",
    concept:"Advanced defense starts from a truth the beginner version skips: impulses aren't one enemy. There's the boredom impulse, the stress impulse, the social-feed impulse, the sale-panic impulse — and if you drew your Spending Triggers Map back in Mind & Money, you already know which ones visit you. Each type breaches a different wall, so each gets its own layer. The layers stack by distance from the purchase. Far out: environment design — unfollow the trigger accounts, delete the saved card details, unsubscribe from the sale emails. Mid-range: friction rules — the 24-Hour Rule for knock-at-the-door wants, a cart-but-don't-buy rule for scroll finds, a per-category monthly cap. Close-in: the moment-of-weakness protocol — one pre-written question you've agreed to answer before any unplanned buy. The advanced part isn't more discipline — it's less reliance on it. Every layer moves a decision from your tired evening self to your calm planning self.",
    choices:[
      {id:"a",emoji:"📱",label:"The scroll gets me — I buy things I never went looking for"},
      {id:"b",emoji:"😮‍💨",label:"Stress shopping is my pressure valve"},
      {id:"c",emoji:"🕳️",label:"My defenses work for weeks, then collapse in one night"},
    ],
    branches:{
      a:{headline:"For the scroll-caught",body:"Scroll purchases are ambushes — you never chose to enter the store, the store entered you. Environment design is your heavy armor: the unfollows, the ad-blockers, the deleted card autofill that turns one-click into find-your-wallet. And for what still gets through, the cart-and-wait rule converts the ambush into an appointment: it can sit in the cart overnight, and mostly, morning-you never goes back.",tip:"Tonight, delete your saved card details from the one app that gets you most. That single minute of friction will quietly cancel purchases for months."},
      b:{headline:"For the stress-spenders",body:"Stress shopping works — that's the honest problem with it. It delivers real relief, just at retail prices, and the relief fades faster than the charge clears. The defense isn't refusing comfort; it's having the substitution ready before the stress arrives — that's the Healthy Coping toolkit from Mind & Money doing safety-net duty. The purchase question for stressed evenings is pre-written: \"Am I buying this thing, or buying a feeling I could get cheaper?\"",tip:"Write your moment-of-weakness question on a card and put it where the shopping happens — by the laptop, in the phone case. Agreeing to ask it is the entire commitment."},
      c:{headline:"For the collapse-prone",body:"Systems that collapse in one night were usually load-bearing on willpower the whole time — the rules held while you were rested and folded when you weren't. Layered defense fails differently: one breach doesn't open the castle, because the next layer catches it. Bought something mid-scroll? The category cap still contains the damage. The goal was never a perfect record; it's a system where a bad night costs a skirmish, not the war.",tip:"Add one containment layer to whatever defense you already run — a monthly cap on your weakest category is the classic. Breaches stop being collapses when there's a wall behind the wall."},
    },
    reflection:"Which of your impulses walks through your current defenses untouched — and which layer was built for exactly that visitor?",
    teaser:{title:"The Intentional Purchase Protocol",desc:"For the big buys: a checklist that turns wanting into deciding."},
  },
  {
    id:"L18",number:"03",title:"The Intentional Purchase Protocol",emoji:"🎯",duration:"4 min",
    hero:"/lessons/l18-hero.png",heroFit:"contain",heroBg:"#faf9f4",
    hook:"Small impulses nibble at a budget. But it's the big purchases — the ones you told yourself you'd thought about — that move the whole month. \"I thought about it\" usually means \"I wanted it for long enough that it felt decided.\" Wanting a while isn't deciding. Here's what deciding looks like.",
    concept:"The Intentional Purchase Protocol is a short ritual that stands between wanting something big and owning it. The classic checks: a waiting period scaled to price (a day per hundred, capped at a month — pick your own exchange rate); the three honest questions (What job does this do? What does it replace? What would I buy instead with the same money?); the joy-per-dollar forecast, scored against your own history, not the reviews; and the planned-money check — does it come from a bucket that exists, or from future-you's paycheck? The magic isn't in any single check — it's that the protocol runs the same way every time. Rituals remove the negotiation. And a protocol pass is not a purchase denial system — roughly half the point is buying with a clear conscience. A big purchase that clears every check gets owned guilt-free, enjoyed fully, and never re-litigated at 2am. Intentional doesn't mean less; it means on purpose.",
    choices:[
      {id:"a",emoji:"💳",label:"Big purchases sneak past me disguised as 'deserved'"},
      {id:"b",emoji:"🐢",label:"I deliberate forever and buy nothing — is that winning?"},
      {id:"c",emoji:"🧩",label:"How many checks is the right number?"},
    ],
    branches:{
      a:{headline:"For the deserving",body:"\"I deserve this\" might be the most expensive sentence in retail — not because it's false, but because it's unfalsifiable. Of course you deserve nice things. The protocol doesn't argue with deserving; it just asks the deserving purchase to also answer the same three questions everything else answers. What clears both is genuinely yours to enjoy. What only clears \"deserved\" was a feeling wearing a price tag.",tip:"Next time \"I deserve this\" shows up, write down what specifically you deserve — comfort, celebration, rest. Then check whether this purchase is actually the best supplier of that thing. Sometimes it is. Now you know."},
      b:{headline:"For the eternal deliberators",body:"Endless deliberation isn't discipline — it's a decision with no exit condition, and it quietly costs you the joy of the things you'd have loved. The protocol fixes this from the other side: it has an END. Checks passed, waiting period served, money planned? Buy it — that's the ruling, and re-opening the case is against your own rules. A protocol that can say yes is what makes its no trustworthy.",tip:"Pick the big purchase you've been circling for months and run it through the checks once, with a deadline attached. Whatever the verdict, take it. Deciding is the win — in both directions."},
      c:{headline:"For the calibrators",body:"The right number is however many you'll actually run — which for most people is three or four, and the same three or four every time. A ten-check protocol gets skipped by February; a fixed ritual you can do from memory in five minutes gets used for a decade. Start with waiting period + the three questions + planned-money. Add a check only when a purchase gets past you that shouldn't have.",tip:"Write your protocol — your checks, your waiting-period exchange rate — on one card. If it doesn't fit on the card, it's not a protocol yet; it's a wish list of virtues."},
    },
    reflection:"Think of your last big purchase. Did it pass a decision — or just outlast your resistance?",
    teaser:{title:"Values-Based Spending",desc:"The final lesson: pointing all of it at what actually matters to you."},
  },
  {
    id:"L30",number:"04",title:"Values-Based Spending",emoji:"🧭",duration:"5 min",
    hero:"/lessons/l30-hero.png",heroFit:"contain",heroBg:"#f8f6e5",
    hook:"Twenty-nine lessons ago, this was about not buying the thing at 11pm. It was never really about the thing. Every rule, ratio, bucket, and buffer you've built was scaffolding for one question — the last one: what is your money actually for?",
    concept:"Values-based spending means your money flows toward what you'd defend out loud — and away from what you wouldn't. Not what should matter, not what matters to the people you follow: what actually matters to you. Most budgets fail quietly here — technically balanced, pointed at nothing. The practice is one honest audit: put three months of spending next to a list of your top five values and see whether the money knows what you care about. Almost everyone finds a mismatch, and the mismatch is just the gap between autopilot and intention — you now own every tool needed to close it. And here's the graduation part: Mind & Money taught you to see the feelings behind spending. Budgeting Foundations gave the money jobs. Debt & Credit turned old weight into tools. Safety & Stability built the net under all of it. This lesson is why: a person whose spending survives emotions, has a system, carries its debt on purpose, and can absorb a bad month — that person gets to spend on what they love without fear. That was the point the whole time. The system is yours now.",
    choices:[
      {id:"a",emoji:"🧭",label:"I honestly don't know what my top values are"},
      {id:"b",emoji:"📉",label:"I know my values — my spending just ignores them"},
      {id:"c",emoji:"🎓",label:"I've built the system — what now?"},
    ],
    branches:{
      a:{headline:"For the compass-seekers",body:"Values hide in behavior better than in brainstorms — so skip the blank-page exercise and read your own evidence. Look at your last three months: which purchases would you make again instantly? Which would you defend to someone you respect? The pattern behind the defensible ones IS your values, already voting. You don't have to invent a compass; you have to notice the one your best purchases were already following.",tip:"Circle your five favorite purchases of the season — the ones you'd repeat without hesitation. Write the one word each was really buying (time, connection, health, beauty, freedom). That list is your compass, drawn from life."},
      b:{headline:"For the misaligned",body:"Knowing your values while your spending ignores them isn't hypocrisy — it's just autopilot outrunning intention, and autopilot always wins until something structural changes. The fix is mechanical, not moral, and you already own it: give your top value its own budget line, fund it first, and let a low-joy category shrink to pay for it. Alignment isn't a resolution; it's a line item.",tip:"Pick your most neglected value and give it a funded line in next month's budget — even a small one. A value with a budget line is a priority; a value without one is a poster."},
      c:{headline:"For the graduates",body:"Now it runs on maintenance: the weekly money date keeps it honest, the annual sitting keeps it aimed, and the values audit — three months of spending against your five words — is worth one evening a year. The rules can even loosen now; you've internalized what they were teaching. And someday, you might notice the last upgrade: the system stops being about your money and starts being how you decide things generally. That's not a money skill. That was never a money skill.",tip:"Put one date on the calendar: your values audit, one year out. Thirty lessons built this system — one evening a year keeps it pointed where you're actually going."},
    },
    reflection:"If a stranger audited your last three months of spending, what would they say you love? Is it what you'd want them to say — and if not, you now know exactly which tools close that gap.",
    teaser:null,
  },
];

// ─── World Registry ───────────────────────────────────────────────────────────
const WORLD_TIER = { mind:"foundation", budget:"growth", debt:"growth", safety:"transformation", values:"transformation" };
const TIER_RANK  = { foundation:0, growth:1, transformation:2 };
const tierLabel  = t => t==="transformation" ? "Transformation" : t==="growth" ? "Growth" : "Foundation";
const WORLD_META = {
  mind: {
    emoji:"🧠", title:"Mind & Money", lessons:LESSONS,
    mapNote:"Each one deepens your understanding of the relationship between feelings and spending.",
    completeBlurb:"You've completed all 8 lessons. You now have a real map of how your emotions, environment, and social world shape your spending — and a growing toolkit to work with it.",
  },
  budget: {
    emoji:"📐", title:"Budgeting Foundations", lessons:BUDGET_LESSONS,
    mapNote:"Each one adds another tool to your budgeting system — a framework, a rhythm, and a year-level view.",
    completeBlurb:"You've completed all 6 lessons. You now own a complete budgeting toolkit — a framework, a system, categories that fit your life, a weekly rhythm, and a year-level view. Next up: Debt & Credit, where the tools start working on your behalf.",
  },
  debt: {
    emoji:"💳", title:"Debt & Credit", lessons:DEBT_LESSONS,
    mapNote:"Each one turns debt from a source of shame into a set of tools — a sorting system, two payoff methods, a decoded score, and the words that can lower a rate.",
    completeBlurb:"You've completed all 6 lessons. Debt has a sorting system now, a payoff method that fits your temperament, a score you can read, and a script you could use — and with it, the whole Growth tier is complete. Every promise on the pricing card, delivered. Next stop: Safety & Stability.",
  },
  safety: {
    emoji:"🛡️", title:"Safety & Stability", lessons:SAFETY_LESSONS,
    mapNote:"Each one adds a layer to your safety net — a cushion, a system for slow bills, a ladder, your own number, and a plan that holds even when income doesn't behave.",
    completeBlurb:"You've completed all 6 lessons. The whole net is built: a cushion for surprises, sinking funds for the slow bills, a ladder that always knows your next rung, a fund size you chose on purpose, the vocabulary for the bigger net, and a system that works even when the paycheck doesn't. Next up: Advanced & Values — the final world.",
  },
  values: {
    emoji:"🌟", title:"Advanced & Values", lessons:VALUES_LESSONS,
    mapNote:"The final world: measuring joy, defending against your specific impulses, deciding big purchases on purpose, and pointing the whole system at what you actually love.",
    completeBlurb:"You've completed all 4 lessons — and with them, all 30 lessons across all five Story Worlds. The full system is yours: you can see the feelings behind spending, give every dollar a job, carry debt on purpose, absorb a bad month, and point all of it at what you actually love. Habitrii will be here whenever you want to walk any of it again. Congratulations, graduate. 🎓",
  },
};

// ─── Shared Components ────────────────────────────────────────────────────────

function OnboardingBar({ step, total }) {
  return (
    <div style={{display:"flex",gap:"5px"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:"4px",flex:1,borderRadius:"99px",
          background:i<step?C.dark:"rgba(255,255,255,0.45)",transition:"background 0.4s ease"}}/>
      ))}
    </div>
  );
}

function ProgressDots({ current, total }) {
  return (
    <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{
          width:i===current?"22px":"7px",height:"7px",borderRadius:"99px",
          background:i<current?C.dark:i===current?C.yellow:"rgba(255,255,255,0.45)",
          transition:"all 0.3s ease",
          boxShadow:i===current?"0 0 0 2px rgba(245,217,36,0.35)":"none",
        }}/>
      ))}
    </div>
  );
}

function ChoiceCard({ label, sub, selected, onClick, tone }) {
  const [hover, setHover] = useState(false);
  const toned = tone != null;
  // "24-Hour Rule" look — white card, 4px yellow top bar, soft shadow.
  // Toned cards are uniform: no selected-state highlight.
  const bg = toned ? C.card : selected ? C.cardSelected : hover ? C.cardHover : C.card;
  const border = toned
    ? "none"
    : selected ? `1.5px solid ${C.cardBorderSel}`
    : `1.5px solid ${hover ? "rgba(35,35,33,0.25)" : C.cardBorder}`;
  const glow = toned
    ? (hover ? "0 6px 20px rgba(35,35,33,0.14)" : "0 4px 16px rgba(35,35,33,0.1)")
    : selected ? "0 3px 14px rgba(245,217,36,0.4)" : "none";
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:bg,
        border,
        ...(toned ? { borderTop: `4px solid ${C.yellow}` } : {}),
        borderRadius:"14px",padding:"16px 20px",cursor:"pointer",
        transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:glow,
      }}>
      <p style={{fontSize:"16px",fontWeight:selected?700:500,margin:"0 0 2px",color:C.text,lineHeight:1.4}}>{label}</p>
      {sub&&<p style={{fontSize:"14px",color:toned?"rgba(35,35,33,0.85)":C.textSub,margin:0,lineHeight:1.4}}>{sub}</p>}
    </div>
  );
}

function MBTICard({ type, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:selected?C.cardSelected:hover?C.cardHover:C.card,
        border:`1.5px solid ${selected?C.cardBorderSel:hover?"rgba(35,35,33,0.25)":C.cardBorder}`,
        borderRadius:"12px",padding:"12px 6px",cursor:"pointer",
        textAlign:"center",transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:selected?"0 3px 12px rgba(245,217,36,0.4)":hover?"0 3px 12px rgba(35,35,33,0.1)":"0 1px 4px rgba(35,35,33,0.06)",
      }}>
      <p style={{fontSize:"14px",fontWeight:700,margin:"0 0 3px",color:C.text,letterSpacing:"0.5px"}}>{type.code}</p>
      <p style={{fontSize:"10px",color:C.textSub,margin:0,lineHeight:1.3}}>{type.label}</p>
    </div>
  );
}

function SignCard({ data, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:selected?C.cardSelected:hover?C.cardHover:C.card,
        border:`1.5px solid ${selected?C.cardBorderSel:hover?"rgba(35,35,33,0.25)":C.cardBorder}`,
        borderRadius:"12px",padding:"10px 4px",cursor:"pointer",
        textAlign:"center",transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:selected?"0 3px 12px rgba(245,217,36,0.4)":"0 1px 4px rgba(35,35,33,0.06)",
      }}>
      <p style={{fontSize:"18px",margin:"0 0 3px",lineHeight:1}}>{data.emoji}</p>
      <p style={{fontSize:"10px",color:C.text,margin:0,fontWeight:500,lineHeight:1.3}}>{data.sign}</p>
    </div>
  );
}

function LessonCard({ lesson, isComplete, isCurrent, locked, onClick, tone }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        display:"flex",alignItems:"center",gap:"16px",
        opacity:locked?0.62:1,
        background:isComplete?"rgba(255,255,255,0.65)":C.card,
        border:isComplete?"1px solid rgba(35,35,33,0.2)":"none",
        ...(!isComplete ? { borderTop: `4px solid ${C.yellow}` } : {}),
        borderRadius:"14px",padding:"14px 18px",cursor:"pointer",
        transition:"all 0.15s ease",
        transform:hover?"translateY(-1px)":"none",
        boxShadow:isComplete?"none":hover?"0 6px 20px rgba(35,35,33,0.14)":"0 4px 16px rgba(35,35,33,0.1)",
      }}>
      <div style={{fontSize:"26px",minWidth:"32px",textAlign:"center"}}>{locked?"🔒":lesson.emoji}</div>
      <div style={{flex:1}}>
        <p style={{fontSize:"15px",fontWeight:600,margin:"0 0 2px",color:C.text,lineHeight:1.3}}>{lesson.title}</p>
        <p style={{fontSize:"13px",color:C.textSub,margin:0}}>{lesson.duration}</p>
      </div>
      <div style={{fontSize:"12px",fontWeight:700,padding:"4px 11px",borderRadius:"99px",letterSpacing:"0.3px",
        background:isComplete?C.dark:isCurrent?C.dark:"rgba(35,35,33,0.1)",
        color:isComplete?C.textOnDark:isCurrent?C.yellow:C.textSub}}>
        {isComplete?"✓ Done":locked?"Locked":isCurrent?"Go →":"Ready"}
      </div>
    </div>
  );
}

// ─── Profile Badge ─────────────────────────────────────────────────────────────
function ProfileBadge({ q1, q2, mbti, westernSign, chineseSign }) {
  const has = [mbti, westernSign, chineseSign].filter(Boolean);
  if (!has.length) return null;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:"6px",padding:"10px 14px",
      background:"rgba(255,255,255,0.5)",borderRadius:"10px",
      border:"1px solid rgba(35,35,33,0.12)"}}>
      <p style={{fontSize:"11px",fontWeight:600,color:C.textSub,margin:"0 6px 0 0",letterSpacing:"1px",textTransform:"uppercase",alignSelf:"center"}}>Your profile:</p>
      {mbti && <span style={{fontSize:"12px",fontWeight:700,padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.yellow}}>{mbti}</span>}
      {westernSign && <span style={{fontSize:"12px",padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.textOnDark}}>{westernSign}</span>}
      {chineseSign && <span style={{fontSize:"12px",padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.textOnDark}}>{chineseSign}</span>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
// ── Money Mirror archetypes (must match src/moneymirror/archetypes.js keys) ──────────
const MM_TYPES = {
  deliberator: { name: "The Deliberator", emoji: "🔍" },
  spark:       { name: "The Spark",       emoji: "✨" },
  keeper:      { name: "The Keeper",      emoji: "🛡️" },
  wanderer:    { name: "The Wanderer",    emoji: "🌿" },
  giver:       { name: "The Giver",       emoji: "🤲" },
  architect:   { name: "The Architect",   emoji: "📐" },
  soother:     { name: "The Soother",     emoji: "☕" },
  dreamer:     { name: "The Dreamer",     emoji: "🌅" },
  hunter:      { name: "The Hunter",      emoji: "🎯" },
};

export default function Habitrii() {
  // ── Landing Page Gate ────────────────────────────────────────────────────────
  const [showLanding, setShowLanding] = useState(
    true
  );
  const handleEnterApp = () => {
    true
    setShowLanding(false);
  };
  const [legalDoc, setLegalDoc] = useState(null); // null | "terms" | "privacy"

  // ── Supabase auth session (Phase 02) ────────────────────────────────────
  const [session, setSession] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") {
        setShowLanding(false);
        setRecoveryMode(true);
        setScreen("auth");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // ── Profile (tier + trial) — Phase 04 ───────────────────────────────────
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!session) { setProfile(null); return; }
    fetchProfile().then(setProfile);
    // Rehydrate saved personality so Penny stays personalized across visits.
    fetchPersonality().then(p => {
      if (!p) return;
      if (p.mbti_type)       setMbti(m => m ?? p.mbti_type);
      if (p.western_zodiac)  setWesternSign(w => w ?? p.western_zodiac);
      if (p.chinese_zodiac)  setChineseSign(c => c ?? p.chinese_zodiac);
      if (p.knowledge_level) setQ1(v => v ?? p.knowledge_level);
      if (p.framework_pref)  setQ2(v => v ?? p.framework_pref);
    });
  }, [session]);
  // Returning users skip the funnel entirely: land on Story World select.
  useEffect(() => {
    if (session && !recoveryMode) {
      setShowLanding(false);
      const wantMap = mmLesson || new URLSearchParams(window.location.search).get("lesson");
      setScreen(sc => (sc === "welcome" ? (wantMap ? "lesson_map" : "worlds") : sc));
    }
  }, [session, recoveryMode]);
  useEffect(() => {
    if (window.location.search.includes("checkout=success")) {
      window.history.replaceState({}, "", window.location.pathname);
      setShowLanding(false);
      setScreen("worlds");
    }
  }, []);

  // ── Money Mirror handoff (?mm=<type>&lesson=<Lxx>) ────────────────────────────
  // Set by the /moneymirror/ result screen. Persisted in sessionStorage so the
  // type survives the sign-up/auth redirect; stripped from the URL on arrival.
  const [mmType, setMmType] = useState(() => { try { return sessionStorage.getItem("hb_mm_type") || null; } catch { return null; } });
  const [mmLesson, setMmLesson] = useState(() => { try { return sessionStorage.getItem("hb_mm_lesson") || null; } catch { return null; } });
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const mm = p.get("mm"), ls = p.get("lesson");
    if (mm && MM_TYPES[mm]) { setMmType(mm); try { sessionStorage.setItem("hb_mm_type", mm); } catch { /* noop */ } }
    if (ls && /^L\d{2}$/.test(ls)) { setMmLesson(ls); try { sessionStorage.setItem("hb_mm_lesson", ls); } catch { /* noop */ } }
    if (mm || ls) {
      p.delete("mm"); p.delete("lesson");
      const q = p.toString();
      window.history.replaceState({}, "", window.location.pathname + (q ? "?" + q : ""));
    }
  }, []);

  const [screen, setScreen]         = useState("welcome");
  const [q1, setQ1]                 = useState(null);
  const [q2, setQ2]                 = useState(null);
  const [mbti, setMbti]             = useState(null);
  const [westernSign, setWesternSign] = useState(null);
  const [chineseSign, setChineseSign] = useState(null);
  const [world, setWorld]           = useState(null);
  const [lessonIdx, setLessonIdx]   = useState(0);
  const [branch, setBranch]         = useState(null);
  const [completed, setCompleted]   = useState(new Set());
  const [fading, setFading]         = useState(false);
  const [pennyChoice, setPennyChoice]   = useState(null);
  const [pennyText, setPennyText]       = useState("");
  const [pennyLoading, setPennyLoading] = useState(false);
  const [pennyError, setPennyError]     = useState(null);

  // ── Email Gate State ──────────────────────────────────────────────────────
  const [emailInput, setEmailInput]       = useState("");
  const [captchaToken, setCaptchaToken]   = useState("");
  const [emailError, setEmailError]       = useState(null);
  const [tosAgreed, setTosAgreed]         = useState(false);

  // ── Tier State ────────────────────────────────────────────────────────────
  // ── VCDPA account deletion (one request clears Supabase + Mailchimp) ─────
  const [deleteArm, setDeleteArm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteErr, setDeleteErr] = useState(null);
  const handleDeleteAccount = async () => {
    if (!session) return;
    setDeleteBusy(true); setDeleteErr(null);
    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error("Deletion failed. Please try again or email support@aven4life.com.");
      if (supabase) await supabase.auth.signOut();
      window.location.href = "/";
    } catch (e) {
      setDeleteErr(e.message);
      setDeleteBusy(false);
    }
  };

  // Tier is cached in React state for the browser session to avoid repeated Stripe API calls.
  const [userTier, setUserTier]       = useState("foundation");
  // Free-slice model: Foundation = first FREE_LESSONS of Mind & Money, forever.
  // Any paid tier unlocks the full world. No trial clock.
  const hasPaidTier = (profile?.tier || userTier) !== "foundation";
  // First month after signup: all 8 Mind & Money lessons open (trial_ends_at,
  // default now()+30d). After that, free accounts keep the first FREE_LESSONS.
  const fullAccessWindow = !!(profile && trialActive(profile));
  // World-aware lesson gate. Mind & Money uses the free-slice model; every
  // other world is all-or-nothing by tier (mirrors the World Select gate, and
  // covers deep links into scenes).
  const userTierRank = TIER_RANK[profile?.tier || userTier] ?? 0;
  const lessonLocked = (i) => {
    const wid = world || "mind";
    if (wid === "mind") return i >= FREE_LESSONS && !hasPaidTier && !fullAccessWindow;
    return userTierRank < (TIER_RANK[WORLD_TIER[wid]] ?? 1);
  };
  const [tierLoading, setTierLoading] = useState(false);
  const [tierChecked, setTierChecked] = useState(false);

  const worldId = world || "mind";
  const worldMeta = WORLD_META[worldId] || WORLD_META.mind;
  const worldLessons = worldMeta.lessons;
  const lesson = worldLessons[lessonIdx] || worldLessons[0];
  const completedCount = worldLessons.filter(l => completed.has(l.id)).length;
  const mmSuggested = mmLesson ? worldLessons.find(l => l.id === mmLesson) || null : null;

  const go = (next, updates={}) => {
    setFading(true);
    setTimeout(()=>{
      if(updates.q1!==undefined)        setQ1(updates.q1);
      if(updates.q2!==undefined)        setQ2(updates.q2);
      if(updates.world!==undefined)     setWorld(updates.world);
      if(updates.lessonIdx!==undefined) setLessonIdx(updates.lessonIdx);
      if(updates.branch!==undefined)    setBranch(updates.branch);
      if(updates.complete)              setCompleted(prev=>new Set([...prev,updates.complete]));
      if(updates.resetPenny){
        setPennyChoice(null);setPennyText("");setPennyLoading(false);setPennyError(null);
      }
      setScreen(next);setFading(false);
    },220);
  };

  const callPenny = async (choice) => {
    setPennyChoice(choice);setPennyLoading(true);setPennyError(null);setPennyText("");
    try {
      const res = await fetch("/api/chat",{
        method:"POST",headers:{"Content-Type":"application/json",...(session?.access_token?{Authorization:`Bearer ${session.access_token}`}:{})},
        body:JSON.stringify({
          profile:{q1,q2,mbti,westernSign,chineseSign,moneyMirror:mmType||undefined},
          lesson:{title:lesson.title,concept:lesson.concept},
          choice,
        }),
      });
      const data = await res.json();
      if(!res.ok) setPennyError(data.error??"Something went wrong. Please try again.");
      else setPennyText(data.text);
    } catch { setPennyError("Unable to connect right now. Please check your connection."); }
    finally { setPennyLoading(false); }
  };

  // ── Tier Check Effect ─────────────────────────────────────────────────────
  // Fires once per session when the World Select screen is first reached.
  // On any failure or timeout (>5s), silently defaults to 'foundation'.
  useEffect(() => {
    if (screen !== "worlds") return;
    if (tierChecked || !emailInput) return;
    setTierLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput }),
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => { setUserTier(data.tier || "foundation"); setTierChecked(true); })
      .catch(() => { setUserTier("foundation"); setTierChecked(true); })
      .finally(() => { clearTimeout(timeout); setTierLoading(false); });
  }, [screen, tierChecked, emailInput]);

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput) || emailInput.length > 254) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!tosAgreed) {
      setEmailError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    if (!captchaToken) {
      setEmailError("Please complete the verification below.");
      return;
    }
    setEmailError(null);
    // Fire-and-forget — never block the user or surface errors on failure
    fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailInput, captchaToken }),
    }).catch(() => {});
    // Reset token so it cannot be reused
    setCaptchaToken("");
        go(supabase && !session ? "auth" : "q1");
  };

  const outer = {
    fontFamily:"'DM Sans', system-ui, -apple-system, sans-serif",
    background:C.bg,minHeight:"100vh",
    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",
    padding:"36px 24px 60px",boxSizing:"border-box",
    opacity:fading?0:1,transition:"opacity 0.22s ease",color:C.text,
  };
  const inner = {width:"100%",maxWidth:"560px",display:"flex",flexDirection:"column",gap:"18px"};

  // ── LEGAL DOCS
  if (legalDoc === "terms") return <TermsOfService onBack={() => setLegalDoc(null)} />;
  if (legalDoc === "privacy") return <PrivacyPolicy onBack={() => setLegalDoc(null)} />;

  // ── LANDING PAGE
  if (showLanding) return <LandingPage onStart={handleEnterApp} onShowTerms={() => setLegalDoc("terms")} onShowPrivacy={() => setLegalDoc("privacy")} />;

    // ── AUTH (Supabase Phase 02) ──────────────────────────────────────────────
  if (screen === "auth") return (
    <AuthFlow
      initialEmail={emailInput}
      recoveryMode={recoveryMode}
      onAuthed={() => { setRecoveryMode(false); go("q1"); }}
    />
  );

// ── WELCOME / EMAIL GATE ──────────────────────────────────────────────────
  if(screen==="welcome") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...inner,textAlign:"center"}}>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"16px",padding:"32px 28px 36px"}}>
          <p style={lbl("rgba(35,35,33,0.9)")}>HABITRII</p>
          <h1 style={{fontSize:"38px",fontWeight:700,lineHeight:1.2,margin:"0 0 16px",color:C.text}}>
            Financial literacy<br/>that actually <span style={{background:C.yellow,color:C.dark,borderRadius:"8px",padding:"0 10px",display:"inline-block"}}>clicks.</span>
          </h1>
          <p style={{fontSize:"17px",color:"rgba(35,35,33,0.9)",lineHeight:1.65,margin:"0 0 28px"}}>
            A choose-your-own-adventure journey through money — built around how you think, feel, and make decisions.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",textAlign:"left"}}>
            <input
              type="email"
              maxLength={254}
              autoComplete="email"
              placeholder="Enter your email to get started"
              value={emailInput}
              onChange={e=>{
                const val=e.target.value.replace(/<[^>]*>/g,"").trim();
                if(val.length>254)return;
                setEmailInput(val);setEmailError(null);
              }}
              onKeyDown={e=>{if(e.key==="Enter")handleEmailSubmit();}}
              style={{
                width:"100%",boxSizing:"border-box",padding:"14px 16px",
                borderRadius:"10px",border:"1.5px solid rgba(35,35,33,0.35)",
                background:"#ffffff",color:"#1f1f1d",
                fontSize:"16px",fontFamily:"inherit",outline:"none",
              }}
            />
            {emailError&&(
              <p style={{fontSize:"13px",color:"#8b2f2f",margin:0,textAlign:"left"}}>{emailError}</p>
            )}
            {/* ToS + Privacy consent — required before continuing */}
            <label style={{display:"flex",alignItems:"flex-start",gap:"10px",cursor:"pointer",textAlign:"left"}}>
              <input
                type="checkbox"
                checked={tosAgreed}
                onChange={e=>setTosAgreed(e.target.checked)}
                style={{marginTop:"3px",accentColor:C.yellow,cursor:"pointer",flexShrink:0,width:"16px",height:"16px"}}
              />
              <span style={{fontSize:"13px",color:"rgba(35,35,33,0.9)",lineHeight:1.55}}>
                I agree to the{" "}
                <span
                  onClick={e=>{e.stopPropagation();setLegalDoc("terms");}}
                  style={{color:"#2f6f65",textDecoration:"underline",cursor:"pointer"}}
                >Terms of Service</span>
                {" "}and{" "}
                <span
                  onClick={e=>{e.stopPropagation();setLegalDoc("privacy");}}
                  style={{color:"#2f6f65",textDecoration:"underline",cursor:"pointer"}}
                >Privacy Policy</span>.
                {" "}I confirm I am 18 years of age or older.
              </span>
            </label>
            <div style={{display:"flex",justifyContent:"center"}}>
              <Turnstile
                siteKey="0x4AAAAAADr_TSPU6XirX62b"
                onSuccess={token=>setCaptchaToken(token)}
                onExpire={()=>setCaptchaToken("")}
                onError={()=>setCaptchaToken("")}
                options={{theme:"light"}}
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              style={{...btnYellow,opacity:tosAgreed?1:0.6}}
            >
              Start your journey →
            </button>
          </div>
        </div>
        <p style={{fontSize:"12px",color:"rgba(35,35,33,0.72)",margin:0}}>For educational purposes only · Not financial advice</p>
      </div>
    </div>
  );

  // ── Q1 ────────────────────────────────────────────────────────────────────
  if(screen==="q1") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("welcome")} style={btnBack}>← Back</button>
        <OnboardingBar step={1} total={3}/>
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
          <p style={lbl(C.teal)}>QUESTION 1 OF 2</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:0,lineHeight:1.35,color:C.text}}>Where are you on your financial learning journey?</h2>
        </div>
        {[
          {id:1,label:"I'm pretty new to this",sub:"I don't really know where to start with money stuff"},
          {id:2,label:"I know the basics",sub:"I want to get smarter about saving, budgeting, or debt"},
          {id:3,label:"I'm fairly knowledgeable",sub:"I want deeper insights into why I make the decisions I do"},
        ].map(o=>(
          <ChoiceCard key={o.id} label={o.label} sub={o.sub} selected={q1===o.id}
            onClick={()=>{setQ1(o.id);setTimeout(()=>go("q2"),280);}}/>
        ))}
      </div>
    </div>
  );

  // ── Q2 ────────────────────────────────────────────────────────────────────
  if(screen==="q2") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("q1")} style={btnBack}>← Back</button>
        <OnboardingBar step={2} total={3}/>
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
          <p style={lbl(C.teal)}>QUESTION 2 OF 2</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:0,lineHeight:1.35,color:C.text}}>Habitrii uses personality frameworks to personalize your journey. Which sounds like you?</h2>
        </div>
        {[
          {id:"a",label:"I know my MBTI and/or astrology signs",sub:"Let's use them to shape my experience"},
          {id:"b",label:"I'm curious but new to personality stuff",sub:"Help me figure it out as we go"},
          {id:"c",label:"I'm mainly here for the financial lessons",sub:"Personality is a fun bonus, not a priority"},
        ].map(o=>(
          <ChoiceCard key={o.id} label={o.label} sub={o.sub} selected={q2===o.id}
            onClick={()=>{
              setQ2(o.id);
              setTimeout(()=>go(o.id==="a"?"q3_mbti":"worlds"),280);
            }}/>
        ))}
      </div>
    </div>
  );

  // ── Q3: MBTI PICKER ───────────────────────────────────────────────────────
  if(screen==="q3_mbti") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("q2")} style={btnBack}>← Back</button>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"14px",padding:"18px 22px"}}>
          <p style={lbl("rgba(35,35,33,0.9)")}>PERSONALIZE PENNY · 1 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.text,lineHeight:1.3}}>What's your MBTI type?</h2>
          <p style={{fontSize:"14px",color:"rgba(35,35,33,0.9)",margin:0,lineHeight:1.5}}>Penny uses this to tailor responses to how you think and make decisions.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}}>
          {MBTI_TYPES.map(t=>(
            <MBTICard key={t.code} type={t} selected={mbti===t.code}
              onClick={()=>{setMbti(t.code);setTimeout(()=>go("q4_western"),320);}}/>
          ))}
        </div>
        <button onClick={()=>{setMbti(null);go("q4_western");}} style={btnGhost}>I'm not sure — skip this →</button>
      </div>
    </div>
  );

  // ── Q4: WESTERN ZODIAC ───────────────────────────────────────────────────
  if(screen==="q4_western") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("q3_mbti")} style={btnBack}>← Back</button>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"14px",padding:"18px 22px"}}>
          <p style={lbl("rgba(35,35,33,0.9)")}>PERSONALIZE PENNY · 2 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.text,lineHeight:1.3}}>What's your Western zodiac sign?</h2>
          <p style={{fontSize:"14px",color:"rgba(35,35,33,0.9)",margin:0,lineHeight:1.5}}>Penny uses this to add a personal touch to how your lessons are framed.</p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"16px 18px",boxShadow:"0 1px 6px rgba(35,35,33,0.07)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}}>
            {WESTERN_SIGNS.map(s=>(
              <SignCard key={s.sign} data={s} selected={westernSign===s.sign}
                onClick={()=>{setWesternSign(s.sign);setTimeout(()=>go("q4_chinese"),280);}}/>
            ))}
          </div>
        </div>
        <button onClick={()=>{setWesternSign(null);go("q4_chinese");}} style={btnGhost}>I'm not sure — skip this →</button>
      </div>
    </div>
  );

  // ── Q5: CHINESE ZODIAC ────────────────────────────────────────────────────
  if(screen==="q4_chinese") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("q4_western")} style={btnBack}>← Back</button>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"14px",padding:"18px 22px"}}>
          <p style={lbl("rgba(35,35,33,0.9)")}>PERSONALIZE PENNY · 3 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.text,lineHeight:1.3}}>What's your Chinese zodiac animal?</h2>
          <p style={{fontSize:"14px",color:"rgba(35,35,33,0.9)",margin:0,lineHeight:1.5}}>Almost there — Penny will use this to complete your personality profile.</p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"16px 18px",boxShadow:"0 1px 6px rgba(35,35,33,0.07)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}}>
            {CHINESE_ZODIAC.map(s=>(
              <SignCard key={s.sign} data={s} selected={chineseSign===s.sign}
                                onClick={()=>{setChineseSign(s.sign);savePersonality({mbti,westernSign,chineseSign:s.sign,q1,q2});setTimeout(()=>go(session?"plan":"worlds"),280);}}/>
            ))}
          </div>
        </div>
                <button onClick={()=>{setChineseSign(null);savePersonality({mbti,westernSign,chineseSign:null,q1,q2});go(session?"plan":"worlds");}} style={btnGhost}>I'm not sure — skip this →</button>
      </div>
    </div>
  );

    // ── PLAN SELECT (Phase 04) ────────────────────────────────────────────────
  if(screen==="plan") return (
    <PlanSelect
      email={session?.user?.email || emailInput}
      onFree={() => { completeOnboarding(); go("worlds"); }}
      onBack={() => go("worlds")}
    />
  );

// ── WORLD SELECT ──────────────────────────────────────────────────────────
  if(screen==="worlds") {
    // World tier requirements come from the module-level registry (WORLD_TIER / TIER_RANK)
    const effectiveTier = profile?.tier || userTier;
    const userRank   = TIER_RANK[effectiveTier] ?? 0;

    // Free-slice model: Mind & Money world always enterable (lesson gate inside);
    // other worlds require a sufficient paid tier.
    const isLocked = (wid) => {
      if (wid === "mind") return false;
      return userRank < (TIER_RANK[WORLD_TIER[wid]] ?? 0);
    };
    const requiredLabel = (wid) => tierLabel(WORLD_TIER[wid]);
    // Growth → amber badge; Transformation → purple badge
    const badgeStyle = (wid) => ({
      position:"absolute", top:"14px", right:"16px",
      fontSize:"11px", padding:"3px 10px", borderRadius:"99px", fontWeight:700,
      background: WORLD_TIER[wid]==="growth" ? "#f59e0b" : "#8b5cf6",
      color:"#fff", letterSpacing:"0.4px",
    });

    const WORLDS = [
      {id:"mind",  emoji:"🧠", title:"Mind & Money",          desc:"Your emotional relationship with spending — and how to shift it"},
      {id:"budget",emoji:"📐", title:"Budgeting Foundations", desc:"Build a system that actually works for your life"},
      {id:"safety",emoji:"🛡️", title:"Safety & Stability",   desc:"Create a financial safety net from the ground up"},
      {id:"debt",  emoji:"💳", title:"Debt & Credit",         desc:"Take control of what you owe and build your score"},
      {id:"values",emoji:"🌟", title:"Advanced & Values",     desc:"Align your spending with what actually matters to you"},
    ];

    return (
      <div style={outer}>
        <div style={inner}>
          <OnboardingBar step={3} total={3}/>
          <button onClick={()=>go(q2==="a"?"q4_chinese":"q2")} style={btnBack}>← Back</button>
          {(mbti||westernSign||chineseSign) && (
            <ProfileBadge q1={q1} q2={q2} mbti={mbti} westernSign={westernSign} chineseSign={chineseSign}/>
          )}
          <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"14px",padding:"20px 22px"}}>
            <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.text,lineHeight:1.3}}>Choose your first Story World</h2>
            <p style={{fontSize:"15px",color:"rgba(35,35,33,0.9)",margin:0}}>Each world is a themed journey through a cluster of financial concepts.</p>
          </div>
          {WORLDS.map(w => {
            const locked = isLocked(w.id);
            return (
              <div key={w.id} style={{position:"relative"}}>
                <ChoiceCard
                  tone={WORLDS.indexOf(w)}
                  label={`${w.emoji}  ${w.title}`}
                  sub={locked ? `${w.desc} — ${requiredLabel(w.id)} plan` : w.desc}
                  selected={world===w.id}
                  onClick={()=>{
                    if(locked){
                      // Route straight to the plan screen — the upgrade should be
                      // one tap away from the moment of intent (QA finding, July 18).
                      setTimeout(()=>go("plan"),180);
                      return;
                    }
                    setWorld(w.id);
                    setTimeout(()=>go("lesson_map"),280);
                  }}
                />
                {locked && <div style={badgeStyle(w.id)}>{requiredLabel(w.id)}</div>}
              </div>
            );
          })}
          {/* Loading indicator — worlds remain visible and non-blocking during check */}
          {tierLoading && (
            <p style={{fontSize:"12px",color:C.textSub,textAlign:"center",margin:"2px 0 0"}}>
              Checking your access…
            </p>
          )}
          {session && (
            <div style={{textAlign:"center",marginTop:"22px"}}>
              {!deleteArm ? (
                <button onClick={()=>setDeleteArm(true)}
                  style={{background:"none",border:"none",cursor:"pointer",fontSize:"12px",color:C.textMut,textDecoration:"underline",fontFamily:"inherit"}}>
                  Delete my account
                </button>
              ) : (
                <div style={{background:"rgba(255,255,255,0.7)",borderRadius:"12px",padding:"16px 18px",display:"inline-block",textAlign:"left",maxWidth:"440px",boxShadow:"0 2px 10px rgba(35,35,33,0.1)"}}>
                  <p style={{fontSize:"13px",color:C.text,margin:"0 0 12px",lineHeight:1.55}}>
                    This permanently deletes your account, personality profile, and subscription
                    records from Habitrii and removes you from our email list. Any active
                    subscription is cancelled. This cannot be undone.
                  </p>
                  {deleteErr && <p style={{fontSize:"12px",color:"#8b2f2f",margin:"0 0 10px"}}>{deleteErr}</p>}
                  <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                    <button disabled={deleteBusy} onClick={handleDeleteAccount}
                      style={{background:"#8b2f2f",color:"#fff",border:"none",borderRadius:"8px",padding:"9px 16px",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                      {deleteBusy ? "Deleting…" : "Yes, delete everything"}
                    </button>
                    <button disabled={deleteBusy} onClick={()=>{setDeleteArm(false);setDeleteErr(null);}}
                      style={{background:"none",border:"1.5px solid rgba(35,35,33,0.25)",borderRadius:"8px",padding:"9px 16px",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.text}}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LESSON MAP ────────────────────────────────────────────────────────────
  if(screen==="lesson_map") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("worlds")} style={btnBack}>← Story Worlds</button>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"16px",padding:"20px 22px"}}>
          <p style={lbl("rgba(35,35,33,0.9)")}>STORY WORLD</p>
          <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 16px",color:C.text}}>{worldMeta.emoji} {worldMeta.title}</h2>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <ProgressDots current={completedCount} total={worldLessons.length}/>
            <p style={{fontSize:"13px",color:"rgba(35,35,33,0.9)",margin:0,fontWeight:500}}>{completedCount} of {worldLessons.length} complete</p>
          </div>
        </div>
        {(mbti||westernSign||chineseSign) && (
          <ProfileBadge q1={q1} q2={q2} mbti={mbti} westernSign={westernSign} chineseSign={chineseSign}/>
        )}
        {mmType && MM_TYPES[mmType] && worldId==="mind" && (
          <div style={{background:"#ffffff",border:"2px solid #f5d924",borderRadius:"14px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px"}}>
            <span style={{fontSize:"24px",lineHeight:1}} aria-hidden="true">{MM_TYPES[mmType].emoji}</span>
            <p style={{fontSize:"14px",lineHeight:1.5,margin:0,color:C.text}}>
              <strong>Your Money Mirror: {MM_TYPES[mmType].name}.</strong>{" "}
              {mmSuggested
                ? <>Penny will keep it in mind. Start with <strong>{mmSuggested.title}</strong> — the lesson built for your type.</>
                : "Penny will keep it in mind as you go."}
            </p>
          </div>
        )}
        <p style={{fontSize:"15px",color:C.textSub,margin:0,lineHeight:1.65,fontWeight:500}}>
          {worldId!=="mind"
            ? `Explore all ${worldLessons.length} lessons in any order. ${worldMeta.mapNote}`
            : hasPaidTier
            ? `Explore all 8 lessons in any order. ${worldMeta.mapNote}`
            : fullAccessWindow
            ? `All 8 lessons are unlocked for your first month — your first ${FREE_LESSONS} stay free forever after.`
            : `Your first ${FREE_LESSONS} lessons are free, forever. Unlock all 8 with Growth.`}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {worldLessons.map((l,i)=>(
            <LessonCard key={l.id} lesson={l} isComplete={completed.has(l.id)}
              isCurrent={!completed.has(l.id)&&(completedCount===i||l.id===mmLesson)}
              locked={lessonLocked(i)}
              tone={i}
              onClick={()=>lessonLocked(i)?go("plan"):go("scene",{lessonIdx:i,branch:null,resetPenny:true})}/>
          ))}
        </div>
        {completedCount===worldLessons.length&&(
          <button onClick={()=>go("world_complete")} style={btnYellow}>🌟 View world completion →</button>
        )}
      </div>
    </div>
  );

  // ── SCENE ─────────────────────────────────────────────────────────────────
  if(screen==="scene"&&lessonLocked(lessonIdx)) return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...inner,textAlign:"center"}}>
        <div style={{background:C.card,borderRadius:"16px",padding:"32px 26px",boxShadow:"0 4px 20px rgba(35,35,33,0.12)"}}>
          <div style={{fontSize:"44px",marginBottom:"10px"}}>🔒</div>
          <h2 style={{fontSize:"24px",fontWeight:700,margin:"0 0 10px",color:C.text}}>
            {worldId==="mind" ? "This lesson is part of Growth" : `This lesson is part of ${tierLabel(WORLD_TIER[worldId])}`}
          </h2>
          <p style={{fontSize:"15px",color:C.textSub,margin:"0 0 22px",lineHeight:1.6}}>
            {worldId==="mind"
              ? `Your first ${FREE_LESSONS} Mind & Money lessons are free forever. Upgrade to unlock all 8 lessons — and every new world as it launches.`
              : `${worldMeta.title} is a ${tierLabel(WORLD_TIER[worldId])} world. Upgrade to unlock all ${worldLessons.length} lessons — and every new world as it launches.`}
          </p>
          <button onClick={()=>go("plan")} style={btnYellow}>See plans →</button>
        </div>
        <button onClick={()=>go("lesson_map")} style={btnGhost}>← Back to lesson map</button>
      </div>
    </div>
  );

  if(screen==="scene") return (
    <div style={outer}>
      <div style={inner}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>go("lesson_map")}
            style={{background:"rgba(255,255,255,0.5)",border:"1.5px solid rgba(35,35,33,0.18)",borderRadius:"99px",padding:"5px 14px",color:C.text,cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>
            ← Map
          </button>
          <ProgressDots current={lessonIdx} total={worldLessons.length}/>
          <span style={{fontSize:"12px",fontWeight:600,padding:"3px 9px",borderRadius:"99px",background:"rgba(35,35,33,0.1)",color:C.textSub}}>{lessonIdx+1}/{worldLessons.length}</span>
        </div>
        <div style={{background:C.card,borderRadius:"16px",padding:"20px 22px",borderTop:`4px solid ${C.yellow}`,boxShadow:"0 4px 16px rgba(35,35,33,0.1)"}}>
          <p style={lbl(C.teal)}>{worldMeta.emoji} {worldMeta.title.toUpperCase()} · LESSON {lessonIdx+1} OF {worldLessons.length}</p>
          <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 14px",color:C.text,lineHeight:1.2}}>{lesson.emoji} {lesson.title}</h2>
          <p style={{fontSize:"16px",color:C.textSub,margin:0,lineHeight:1.72,fontStyle:"italic"}}>"{lesson.hook}"</p>
        </div>
        {lesson.hero && (
          <img src={lesson.hero} alt={`${lesson.title} illustration`} loading="lazy"
            style={{width:"100%",aspectRatio:"4/3",objectFit:lesson.heroFit||"cover",objectPosition:lesson.heroPos||"center",background:lesson.heroBg||"transparent",display:"block",borderRadius:"16px",boxShadow:"0 4px 16px rgba(35,35,33,0.1)"}}/>
        )}
        <div style={{background:"rgba(255,255,255,0.6)",borderRadius:"14px",padding:"18px 20px",boxShadow:"0 1px 6px rgba(35,35,33,0.07)"}}>
          <p style={{fontSize:"16px",lineHeight:1.78,color:C.text,margin:0}}>{lesson.concept}</p>
        </div>
        <div>
          <p style={{fontSize:"15px",fontWeight:700,color:C.text,margin:"0 0 12px"}}>Which of these sounds most like you?</p>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {lesson.choices.map(ch=>(
              <ChoiceCard key={ch.id} label={`${ch.emoji}  ${ch.label}`} selected={branch===ch.id}
                onClick={()=>{setBranch(ch.id);setTimeout(()=>go("branch",{branch:ch.id}),280);}}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── BRANCH ────────────────────────────────────────────────────────────────
  if(screen==="branch"&&branch) {
    const b=lesson.branches[branch];
    return (
      <div style={outer}>
        <div style={inner}>
          <div style={{background:C.cardSelected,border:"1.5px solid rgba(35,35,33,0.25)",borderRadius:"16px",padding:"20px 22px",boxShadow:"0 4px 18px rgba(245,217,36,0.35)"}}>
            <p style={lbl(C.dark)}>YOUR PATH</p>
            <h3 style={{fontSize:"24px",fontWeight:700,margin:0,color:C.dark}}>{b.headline}</h3>
          </div>
          <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
            <p style={{fontSize:"16px",lineHeight:1.8,color:C.text,margin:0}}>{b.body}</p>
          </div>
          <div style={{background:"#ffffff",borderLeft:`4px solid ${C.yellow}`,borderRadius:"12px",padding:"16px 20px",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
            <p style={{fontSize:"14px",color:C.text,margin:0,lineHeight:1.7}}>{b.tip}</p>
          </div>
          <button onClick={()=>go("reflect")} style={btnYellow}>Continue →</button>
        </div>
      </div>
    );
  }

  // ── REFLECT ───────────────────────────────────────────────────────────────
  if(screen==="reflect") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...inner,textAlign:"center"}}>
        <div style={{fontSize:"52px"}}>💛</div>
        <h2 style={{fontSize:"26px",fontWeight:700,margin:0,color:C.text,lineHeight:1.3}}>Reflection moment</h2>
        <div style={{background:"#f5d924",borderRadius:"16px",padding:"24px 28px",boxShadow:"0 4px 18px rgba(245,217,36,0.5)"}}>
          <p style={{fontSize:"19px",lineHeight:1.75,color:C.text,margin:0,fontStyle:"italic"}}>"{lesson.reflection}"</p>
        </div>
        <p style={{fontSize:"15px",color:C.textSub,lineHeight:1.65,margin:0,maxWidth:"420px",alignSelf:"center",fontWeight:500}}>
          Save this somewhere you'll see it. Even asking it once starts rewiring the habit.
        </p>
        <button onClick={()=>go("penny_checkin",{resetPenny:true})} style={btnYellow}>
          I've got it — check in with Penny 💛
        </button>
      </div>
    </div>
  );

  // ── PENNY CHECK-IN ─────────────────────────────────────────────────────────
  if(screen==="penny_checkin") {
    const opts=[
      {id:"yes",     emoji:"💛",label:"Yes — this totally clicked"},
      {id:"sort_of", emoji:"🤔",label:"Sort of — I get it but not fully"},
      {id:"no",      emoji:"😅",label:"Not quite — I need a different angle"},
    ];
    return (
      <div style={outer}>
        <div style={inner}>
          <div style={{background:"#f5d924",borderRadius:"16px",padding:"18px 22px",boxShadow:"0 4px 18px rgba(245,217,36,0.5)"}}>
            <p style={lbl("rgba(35,35,33,0.9)")}>PENNY CHECK-IN</p>
            <p style={{fontSize:"17px",color:C.text,margin:0,lineHeight:1.6,fontWeight:500}}>
              Did the <strong style={{color:C.text}}>{lesson.title}</strong> lesson click for you?
            </p>
            {(mbti||westernSign) && (
              <p style={{fontSize:"12px",color:"rgba(35,35,33,0.85)",margin:"8px 0 0",lineHeight:1.4}}>
                Penny will personalize her response for you{mbti?` as an ${mbti}`:""}
                {westernSign?` (${westernSign})`:""}.
              </p>
            )}
          </div>
          {!pennyChoice&&(
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {opts.map(opt=>(
                <ChoiceCard key={opt.id} label={`${opt.emoji}  ${opt.label}`}
                  selected={false} onClick={()=>callPenny(opt.id)}/>
              ))}
            </div>
          )}
          {pennyLoading&&(
            <div style={{background:C.card,borderRadius:"14px",padding:"28px 22px",textAlign:"center",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
              <div style={{fontSize:"28px",marginBottom:"12px",display:"inline-block",animation:"spin 1.5s linear infinite"}}>✨</div>
              <p style={{fontSize:"15px",color:C.textSub,margin:0,fontWeight:500}}>Penny is personalizing a response for you…</p>
            </div>
          )}
          {pennyError&&!pennyLoading&&(
            <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
              <p style={{fontSize:"15px",color:C.text,margin:"0 0 14px",lineHeight:1.6}}>{pennyError}</p>
              <button onClick={()=>callPenny(pennyChoice)} style={btnGhost}>Try again</button>
            </div>
          )}
          {pennyText&&!pennyLoading&&(
            <>
              <div style={{background:C.card,borderRadius:"16px",padding:"22px 24px",borderLeft:`4px solid ${C.yellow}`,boxShadow:"0 4px 16px rgba(35,35,33,0.1)"}}>
                <p style={{...lbl(C.teal),marginBottom:"10px"}}>PENNY SAYS</p>
                {pennyText.split(/\n{2,}|\n(?=[A-Z])/).filter(Boolean).map((para,i)=>(
                  <p key={i} style={{fontSize:"16px",lineHeight:1.8,color:C.text,margin:i===0?0:"12px 0 0"}}>{para}</p>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                <button onClick={()=>go("lesson_complete",{complete:lesson.id})} style={btnYellow}>Continue →</button>
                <button onClick={()=>{setPennyChoice(null);setPennyText("");setPennyError(null);}} style={btnGhost}>Ask from a different angle</button>
              </div>
            </>
          )}
          <button onClick={()=>go("lesson_complete",{complete:lesson.id})}
            style={{...btnGhost,fontSize:"13px",padding:"10px 20px"}}>
            Skip and continue
          </button>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  // ── LESSON COMPLETE ───────────────────────────────────────────────────────
  if(screen==="lesson_complete") {
    const newCompleted=new Set([...completed,lesson.id]);
    const worldDone=worldLessons.filter(l=>newCompleted.has(l.id)).length;
    const allDone=worldDone===worldLessons.length;
    const nextLesson=worldLessons[lessonIdx+1];
    return (
      <div style={{...outer,justifyContent:"center"}}>
        <div style={{...inner,textAlign:"center"}}>
          <div style={{background:C.cardSelected,borderRadius:"20px",padding:"28px 24px",boxShadow:"0 6px 24px rgba(245,217,36,0.4)"}}>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>✅</div>
            <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 8px",color:C.dark}}>Lesson {lessonIdx+1} complete</h2>
            <p style={{fontSize:"15px",color:"rgba(35,35,33,0.7)",margin:0}}>{lesson.emoji} {lesson.title}</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.7)",borderRadius:"12px",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <ProgressDots current={worldDone} total={worldLessons.length}/>
            <p style={{fontSize:"13px",color:C.textSub,margin:0,fontWeight:600}}>{worldDone}/{worldLessons.length} done</p>
          </div>
          {!allDone&&lesson.teaser&&nextLesson&&(
            <div style={{background:"#ffffff",borderRadius:"14px",padding:"20px 24px",textAlign:"left",boxShadow:"0 4px 18px rgba(255,255,255,0.6)"}}>
              <p style={lbl("rgba(35,35,33,0.9)")}>UP NEXT</p>
              <p style={{fontSize:"18px",fontWeight:700,margin:"0 0 5px",color:C.text}}>{nextLesson.emoji} {lesson.teaser.title}</p>
              <p style={{fontSize:"14px",color:"rgba(35,35,33,0.9)",margin:0,lineHeight:1.5}}>{lesson.teaser.desc}</p>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {!allDone&&nextLesson&&(
              <button onClick={()=>lessonLocked(lessonIdx+1)?go("plan"):go("scene",{lessonIdx:lessonIdx+1,branch:null,resetPenny:true})} style={btnYellow}>
                {lessonLocked(lessonIdx+1)?"Unlock the next lesson →":"Continue journey →"}
              </button>
            )}
            {allDone&&<button onClick={()=>go("world_complete")} style={btnYellow}>🌟 Complete the world →</button>}
            <button onClick={()=>go("lesson_map")} style={btnGhost}>← Back to lesson map</button>
          </div>
        </div>
      </div>
    );
  }

  // ── WORLD COMPLETE ────────────────────────────────────────────────────────
  if(screen==="world_complete") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...inner,textAlign:"center"}}>
        <div style={{background:"#57b7a7",border:"2px solid #ffffff",borderRadius:"20px",padding:"32px 28px"}}>
          <div style={{fontSize:"56px",marginBottom:"12px"}}>🌟</div>
          <p style={{...lbl("rgba(35,35,33,0.9)"),letterSpacing:"3px",marginBottom:"8px"}}>WORLD COMPLETE</p>
          <h2 style={{fontSize:"30px",fontWeight:700,margin:"0 0 12px",color:C.text}}>{worldMeta.title}</h2>
          <p style={{fontSize:"16px",color:"rgba(35,35,33,0.9)",lineHeight:1.65,margin:0}}>
            {worldMeta.completeBlurb}
          </p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",textAlign:"left",boxShadow:"0 2px 8px rgba(35,35,33,0.08)"}}>
          <p style={lbl(C.teal)}>WHAT YOU COVERED</p>
          {worldLessons.map(l=>(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
              <span style={{fontSize:"16px"}}>{l.emoji}</span>
              <p style={{fontSize:"14px",color:C.text,margin:0,fontWeight:500}}>{l.title}</p>
              <span style={{marginLeft:"auto",color:C.teal,fontWeight:700,fontSize:"14px"}}>✓</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <button onClick={()=>go("worlds")} style={btnYellow}>Choose your next world →</button>
          <button onClick={()=>go("lesson_map")} style={btnGhost}>Revisit {worldMeta.title}</button>
        </div>
        <p style={{fontSize:"12px",color:C.textMut,margin:0}}>For educational purposes only · Not financial advice · AVEN LLC</p>
      </div>
    </div>
  );

  return null;
}