import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import { Turnstile } from "@marsidev/react-turnstile";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

// ─── Color System ─────────────────────────────────────────────────────────────
const C = {
  bg:"#57b7a7", dark:"#1a3330", mid:"#2a4a44",
  card:"#ffffff", cardHover:"#f0faf8", cardSelected:"#f5d924",
  cardBorder:"rgba(26,51,48,0.14)", cardBorderSel:"rgba(26,51,48,0.35)",
  text:"#0d1f1d", textSub:"rgba(13,31,29,0.7)", textMut:"rgba(13,31,29,0.62)",
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
  border:"1.5px solid rgba(26,51,48,0.22)", borderRadius:"12px",
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

function ChoiceCard({ label, sub, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:selected?C.cardSelected:hover?C.cardHover:C.card,
        border:`1.5px solid ${selected?C.cardBorderSel:hover?"rgba(26,51,48,0.25)":C.cardBorder}`,
        borderRadius:"14px",padding:"16px 20px",cursor:"pointer",
        transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:selected?"0 3px 14px rgba(245,217,36,0.4)":hover?"0 4px 16px rgba(26,51,48,0.1)":"0 1px 4px rgba(26,51,48,0.07)",
      }}>
      <p style={{fontSize:"16px",fontWeight:selected?700:500,margin:"0 0 2px",color:C.text,lineHeight:1.4}}>{label}</p>
      {sub&&<p style={{fontSize:"14px",color:C.textSub,margin:0,lineHeight:1.4}}>{sub}</p>}
    </div>
  );
}

function MBTICard({ type, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        background:selected?C.cardSelected:hover?C.cardHover:C.card,
        border:`1.5px solid ${selected?C.cardBorderSel:hover?"rgba(26,51,48,0.25)":C.cardBorder}`,
        borderRadius:"12px",padding:"12px 6px",cursor:"pointer",
        textAlign:"center",transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:selected?"0 3px 12px rgba(245,217,36,0.4)":hover?"0 3px 12px rgba(26,51,48,0.1)":"0 1px 4px rgba(26,51,48,0.06)",
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
        border:`1.5px solid ${selected?C.cardBorderSel:hover?"rgba(26,51,48,0.25)":C.cardBorder}`,
        borderRadius:"12px",padding:"10px 4px",cursor:"pointer",
        textAlign:"center",transition:"all 0.15s ease",
        transform:hover&&!selected?"translateY(-2px)":"none",
        boxShadow:selected?"0 3px 12px rgba(245,217,36,0.4)":"0 1px 4px rgba(26,51,48,0.06)",
      }}>
      <p style={{fontSize:"18px",margin:"0 0 3px",lineHeight:1}}>{data.emoji}</p>
      <p style={{fontSize:"10px",color:C.text,margin:0,fontWeight:500,lineHeight:1.3}}>{data.sign}</p>
    </div>
  );
}

function LessonCard({ lesson, isComplete, isCurrent, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        display:"flex",alignItems:"center",gap:"16px",
        background:isCurrent?C.cardSelected:isComplete?"rgba(255,255,255,0.65)":C.card,
        border:`1.5px solid ${isCurrent?C.cardBorderSel:isComplete?"rgba(26,51,48,0.2)":C.cardBorder}`,
        borderRadius:"14px",padding:"14px 18px",cursor:"pointer",
        transition:"all 0.15s ease",
        transform:hover?"translateY(-1px)":"none",
        boxShadow:isCurrent?"0 3px 14px rgba(245,217,36,0.4)":hover?"0 4px 16px rgba(26,51,48,0.1)":"0 1px 4px rgba(26,51,48,0.06)",
      }}>
      <div style={{fontSize:"26px",minWidth:"32px",textAlign:"center"}}>{lesson.emoji}</div>
      <div style={{flex:1}}>
        <p style={{fontSize:"15px",fontWeight:600,margin:"0 0 2px",color:C.text,lineHeight:1.3}}>{lesson.title}</p>
        <p style={{fontSize:"13px",color:C.textSub,margin:0}}>{lesson.duration}</p>
      </div>
      <div style={{fontSize:"12px",fontWeight:700,padding:"4px 11px",borderRadius:"99px",letterSpacing:"0.3px",
        background:isComplete?C.dark:isCurrent?C.dark:"rgba(26,51,48,0.1)",
        color:isComplete?C.textOnDark:isCurrent?C.yellow:C.textSub}}>
        {isComplete?"✓ Done":isCurrent?"Go →":"Soon"}
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
      border:"1px solid rgba(26,51,48,0.12)"}}>
      <p style={{fontSize:"11px",fontWeight:600,color:C.textSub,margin:"0 6px 0 0",letterSpacing:"1px",textTransform:"uppercase",alignSelf:"center"}}>Your profile:</p>
      {mbti && <span style={{fontSize:"12px",fontWeight:700,padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.yellow}}>{mbti}</span>}
      {westernSign && <span style={{fontSize:"12px",padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.textOnDark}}>{westernSign}</span>}
      {chineseSign && <span style={{fontSize:"12px",padding:"3px 8px",borderRadius:"99px",background:C.dark,color:C.textOnDark}}>{chineseSign}</span>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
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
  // Tier is cached in React state for the browser session to avoid repeated Stripe API calls.
  const [userTier, setUserTier]       = useState("foundation");
  const [tierLoading, setTierLoading] = useState(false);
  const [tierChecked, setTierChecked] = useState(false);

  const lesson = LESSONS[lessonIdx];
  const completedCount = completed.size;

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
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          profile:{q1,q2,mbti,westernSign,chineseSign},
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
    go("q1");
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

  // ── WELCOME / EMAIL GATE ──────────────────────────────────────────────────
  if(screen==="welcome") return (
    <div style={{...outer,justifyContent:"center"}}>
      <div style={{...inner,textAlign:"center"}}>
        <div style={{background:C.dark,borderRadius:"16px",padding:"32px 28px 36px",boxShadow:"0 8px 32px rgba(13,31,29,0.25)"}}>
          <p style={lbl(C.yellow)}>HABITRII</p>
          <h1 style={{fontSize:"38px",fontWeight:700,lineHeight:1.2,margin:"0 0 16px",color:C.textOnDark}}>
            Financial literacy<br/>that actually <span style={{color:C.yellow}}>clicks.</span>
          </h1>
          <p style={{fontSize:"17px",color:"rgba(255,255,255,0.72)",lineHeight:1.65,margin:"0 0 28px"}}>
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
                borderRadius:"10px",border:"1.5px solid rgba(255,255,255,0.2)",
                background:"rgba(255,255,255,0.1)",color:"#fff",
                fontSize:"16px",fontFamily:"inherit",outline:"none",
              }}
            />
            {emailError&&(
              <p style={{fontSize:"13px",color:"#ffb3b3",margin:0,textAlign:"left"}}>{emailError}</p>
            )}
            {/* ToS + Privacy consent — required before continuing */}
            <label style={{display:"flex",alignItems:"flex-start",gap:"10px",cursor:"pointer",textAlign:"left"}}>
              <input
                type="checkbox"
                checked={tosAgreed}
                onChange={e=>setTosAgreed(e.target.checked)}
                style={{marginTop:"3px",accentColor:C.yellow,cursor:"pointer",flexShrink:0,width:"16px",height:"16px"}}
              />
              <span style={{fontSize:"13px",color:"rgba(255,255,255,0.72)",lineHeight:1.55}}>
                I agree to the{" "}
                <span
                  onClick={e=>{e.stopPropagation();setLegalDoc("terms");}}
                  style={{color:C.yellow,textDecoration:"underline",cursor:"pointer"}}
                >Terms of Service</span>
                {" "}and{" "}
                <span
                  onClick={e=>{e.stopPropagation();setLegalDoc("privacy");}}
                  style={{color:C.yellow,textDecoration:"underline",cursor:"pointer"}}
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
        <p style={{fontSize:"12px",color:"rgba(13,31,29,0.72)",margin:0}}>For educational purposes only · Not financial advice</p>
      </div>
    </div>
  );

  // ── Q1 ────────────────────────────────────────────────────────────────────
  if(screen==="q1") return (
    <div style={outer}>
      <div style={inner}>
        <button onClick={()=>go("welcome")} style={btnBack}>← Back</button>
        <OnboardingBar step={1} total={3}/>
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
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
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
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
        <div style={{background:C.dark,borderRadius:"14px",padding:"18px 22px",boxShadow:"0 4px 18px rgba(13,31,29,0.2)"}}>
          <p style={lbl(C.yellow)}>PERSONALIZE PENNY · 1 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.textOnDark,lineHeight:1.3}}>What's your MBTI type?</h2>
          <p style={{fontSize:"14px",color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.5}}>Penny uses this to tailor responses to how you think and make decisions.</p>
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
        <div style={{background:C.dark,borderRadius:"14px",padding:"18px 22px",boxShadow:"0 4px 18px rgba(13,31,29,0.2)"}}>
          <p style={lbl(C.yellow)}>PERSONALIZE PENNY · 2 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.textOnDark,lineHeight:1.3}}>What's your Western zodiac sign?</h2>
          <p style={{fontSize:"14px",color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.5}}>Penny uses this to add a personal touch to how your lessons are framed.</p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"16px 18px",boxShadow:"0 1px 6px rgba(26,51,48,0.07)"}}>
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
        <div style={{background:C.dark,borderRadius:"14px",padding:"18px 22px",boxShadow:"0 4px 18px rgba(13,31,29,0.2)"}}>
          <p style={lbl(C.yellow)}>PERSONALIZE PENNY · 3 OF 3</p>
          <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.textOnDark,lineHeight:1.3}}>What's your Chinese zodiac animal?</h2>
          <p style={{fontSize:"14px",color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.5}}>Almost there — Penny will use this to complete your personality profile.</p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"16px 18px",boxShadow:"0 1px 6px rgba(26,51,48,0.07)"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px"}}>
            {CHINESE_ZODIAC.map(s=>(
              <SignCard key={s.sign} data={s} selected={chineseSign===s.sign}
                onClick={()=>{setChineseSign(s.sign);setTimeout(()=>go("worlds"),280);}}/>
            ))}
          </div>
        </div>
        <button onClick={()=>{setChineseSign(null);go("worlds");}} style={btnGhost}>I'm not sure — skip this →</button>
      </div>
    </div>
  );

  // ── WORLD SELECT ──────────────────────────────────────────────────────────
  if(screen==="worlds") {
    // World tier requirements
    const WORLD_TIER = { mind:"foundation", budget:"growth", debt:"growth", safety:"transformation", values:"transformation" };
    const TIER_RANK  = { foundation:0, growth:1, transformation:2 };
    const userRank   = TIER_RANK[userTier] ?? 0;

    const isLocked = (worldId) => userRank < (TIER_RANK[WORLD_TIER[worldId]] ?? 0);
    const requiredLabel = (worldId) => WORLD_TIER[worldId] === "growth" ? "Growth" : "Transformation";
    // Growth → amber badge; Transformation → purple badge
    const badgeStyle = (worldId) => ({
      position:"absolute", top:"14px", right:"16px",
      fontSize:"11px", padding:"3px 10px", borderRadius:"99px", fontWeight:700,
      background: WORLD_TIER[worldId]==="growth" ? "#f59e0b" : "#8b5cf6",
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
          <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
            <h2 style={{fontSize:"22px",fontWeight:700,margin:"0 0 6px",color:C.text,lineHeight:1.3}}>Choose your first Story World</h2>
            <p style={{fontSize:"15px",color:C.textSub,margin:0}}>Each world is a themed journey through a cluster of financial concepts.</p>
          </div>
          {WORLDS.map(w => {
            const locked = isLocked(w.id);
            return (
              <div key={w.id} style={{position:"relative"}}>
                <ChoiceCard
                  label={`${w.emoji}  ${w.title}`}
                  sub={locked ? `${w.desc} — ${requiredLabel(w.id)} plan` : w.desc}
                  selected={world===w.id}
                  onClick={()=>{
                    if(locked){
                      alert(`Upgrade to ${requiredLabel(w.id)} to unlock this world.`);
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
        </div>
      </div>
    );
  }

  // ── LESSON MAP ────────────────────────────────────────────────────────────
  if(screen==="lesson_map") return (
    <div style={outer}>
      <div style={inner}>
        <div style={{background:C.dark,borderRadius:"16px",padding:"20px 22px",boxShadow:"0 4px 20px rgba(13,31,29,0.2)"}}>
          <p style={lbl(C.yellow)}>STORY WORLD</p>
          <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 16px",color:C.textOnDark}}>🧠 Mind & Money</h2>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <ProgressDots current={completedCount} total={8}/>
            <p style={{fontSize:"13px",color:"rgba(255,255,255,0.6)",margin:0,fontWeight:500}}>{completedCount} of 8 complete</p>
          </div>
        </div>
        {(mbti||westernSign||chineseSign) && (
          <ProfileBadge q1={q1} q2={q2} mbti={mbti} westernSign={westernSign} chineseSign={chineseSign}/>
        )}
        <p style={{fontSize:"15px",color:C.textSub,margin:0,lineHeight:1.65,fontWeight:500}}>
          Explore all 8 lessons in any order. Each one deepens your understanding of the relationship between feelings and spending.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {LESSONS.map((l,i)=>(
            <LessonCard key={l.id} lesson={l} isComplete={completed.has(l.id)}
              isCurrent={!completed.has(l.id)&&completedCount===i}
              onClick={()=>go("scene",{lessonIdx:i,branch:null,resetPenny:true})}/>
          ))}
        </div>
        {completedCount===8&&(
          <button onClick={()=>go("world_complete")} style={btnYellow}>🌟 View world completion →</button>
        )}
      </div>
    </div>
  );

  // ── SCENE ─────────────────────────────────────────────────────────────────
  if(screen==="scene") return (
    <div style={outer}>
      <div style={inner}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>go("lesson_map")}
            style={{background:"rgba(255,255,255,0.5)",border:"1.5px solid rgba(26,51,48,0.18)",borderRadius:"99px",padding:"5px 14px",color:C.text,cursor:"pointer",fontSize:"13px",fontWeight:600,fontFamily:"inherit"}}>
            ← Map
          </button>
          <ProgressDots current={lessonIdx} total={8}/>
          <span style={{fontSize:"12px",fontWeight:600,padding:"3px 9px",borderRadius:"99px",background:"rgba(26,51,48,0.1)",color:C.textSub}}>{lessonIdx+1}/8</span>
        </div>
        <div style={{background:C.card,borderRadius:"16px",padding:"20px 22px",borderTop:`4px solid ${C.yellow}`,boxShadow:"0 4px 16px rgba(26,51,48,0.1)"}}>
          <p style={lbl(C.teal)}>🧠 MIND & MONEY · LESSON {lessonIdx+1} OF 8</p>
          <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 14px",color:C.text,lineHeight:1.2}}>{lesson.emoji} {lesson.title}</h2>
          <p style={{fontSize:"16px",color:C.textSub,margin:0,lineHeight:1.72,fontStyle:"italic"}}>"{lesson.hook}"</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.6)",borderRadius:"14px",padding:"18px 20px",boxShadow:"0 1px 6px rgba(26,51,48,0.07)"}}>
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
          <div style={{background:C.cardSelected,border:"1.5px solid rgba(26,51,48,0.25)",borderRadius:"16px",padding:"20px 22px",boxShadow:"0 4px 18px rgba(245,217,36,0.35)"}}>
            <p style={lbl(C.dark)}>YOUR PATH</p>
            <h3 style={{fontSize:"24px",fontWeight:700,margin:0,color:C.dark}}>{b.headline}</h3>
          </div>
          <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
            <p style={{fontSize:"16px",lineHeight:1.8,color:C.text,margin:0}}>{b.body}</p>
          </div>
          <div style={{background:C.dark,borderLeft:`4px solid ${C.yellow}`,borderRadius:"0 12px 12px 0",padding:"16px 20px",boxShadow:"0 2px 10px rgba(13,31,29,0.18)"}}>
            <p style={{fontSize:"14px",color:C.textOnDark,margin:0,lineHeight:1.7}}>{b.tip}</p>
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
        <div style={{background:C.dark,borderRadius:"16px",padding:"24px 28px",boxShadow:"0 6px 24px rgba(13,31,29,0.22)"}}>
          <p style={{fontSize:"19px",lineHeight:1.75,color:C.textOnDark,margin:0,fontStyle:"italic"}}>"{lesson.reflection}"</p>
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
          <div style={{background:C.dark,borderRadius:"16px",padding:"18px 22px",boxShadow:"0 4px 20px rgba(13,31,29,0.2)"}}>
            <p style={lbl(C.yellow)}>PENNY CHECK-IN</p>
            <p style={{fontSize:"17px",color:C.textOnDark,margin:0,lineHeight:1.6,fontWeight:500}}>
              Did the <strong style={{color:C.yellow}}>{lesson.title}</strong> lesson click for you?
            </p>
            {(mbti||westernSign) && (
              <p style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",margin:"8px 0 0",lineHeight:1.4}}>
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
            <div style={{background:C.card,borderRadius:"14px",padding:"28px 22px",textAlign:"center",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
              <div style={{fontSize:"28px",marginBottom:"12px",display:"inline-block",animation:"spin 1.5s linear infinite"}}>✨</div>
              <p style={{fontSize:"15px",color:C.textSub,margin:0,fontWeight:500}}>Penny is personalizing a response for you…</p>
            </div>
          )}
          {pennyError&&!pennyLoading&&(
            <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
              <p style={{fontSize:"15px",color:C.text,margin:"0 0 14px",lineHeight:1.6}}>{pennyError}</p>
              <button onClick={()=>callPenny(pennyChoice)} style={btnGhost}>Try again</button>
            </div>
          )}
          {pennyText&&!pennyLoading&&(
            <>
              <div style={{background:C.card,borderRadius:"16px",padding:"22px 24px",borderLeft:`4px solid ${C.yellow}`,boxShadow:"0 4px 16px rgba(26,51,48,0.1)"}}>
                <p style={{...lbl(C.teal),marginBottom:"10px"}}>PENNY SAYS</p>
                <p style={{fontSize:"16px",lineHeight:1.8,color:C.text,margin:0}}>{pennyText}</p>
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
    const allDone=newCompleted.size===8;
    const nextLesson=LESSONS[lessonIdx+1];
    return (
      <div style={{...outer,justifyContent:"center"}}>
        <div style={{...inner,textAlign:"center"}}>
          <div style={{background:C.cardSelected,borderRadius:"20px",padding:"28px 24px",boxShadow:"0 6px 24px rgba(245,217,36,0.4)"}}>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>✅</div>
            <h2 style={{fontSize:"26px",fontWeight:700,margin:"0 0 8px",color:C.dark}}>Lesson {lessonIdx+1} complete</h2>
            <p style={{fontSize:"15px",color:"rgba(13,31,29,0.7)",margin:0}}>{lesson.emoji} {lesson.title}</p>
          </div>
          <div style={{background:"rgba(255,255,255,0.7)",borderRadius:"12px",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <ProgressDots current={newCompleted.size} total={8}/>
            <p style={{fontSize:"13px",color:C.textSub,margin:0,fontWeight:600}}>{newCompleted.size}/8 done</p>
          </div>
          {!allDone&&lesson.teaser&&nextLesson&&(
            <div style={{background:C.dark,borderRadius:"14px",padding:"20px 24px",textAlign:"left",boxShadow:"0 4px 16px rgba(13,31,29,0.2)"}}>
              <p style={lbl(C.yellow)}>UP NEXT</p>
              <p style={{fontSize:"18px",fontWeight:700,margin:"0 0 5px",color:C.textOnDark}}>{nextLesson.emoji} {lesson.teaser.title}</p>
              <p style={{fontSize:"14px",color:"rgba(255,255,255,0.65)",margin:0,lineHeight:1.5}}>{lesson.teaser.desc}</p>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {!allDone&&nextLesson&&(
              <button onClick={()=>go("scene",{lessonIdx:lessonIdx+1,branch:null,resetPenny:true})} style={btnYellow}>
                Continue journey →
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
        <div style={{background:C.dark,borderRadius:"20px",padding:"32px 28px",boxShadow:"0 8px 32px rgba(13,31,29,0.3)"}}>
          <div style={{fontSize:"56px",marginBottom:"12px"}}>🌟</div>
          <p style={{...lbl(C.yellow),letterSpacing:"3px",marginBottom:"8px"}}>WORLD COMPLETE</p>
          <h2 style={{fontSize:"30px",fontWeight:700,margin:"0 0 12px",color:C.textOnDark}}>Mind & Money</h2>
          <p style={{fontSize:"16px",color:"rgba(255,255,255,0.72)",lineHeight:1.65,margin:0}}>
            You've completed all 8 lessons. You now have a real map of how your emotions, environment, and social world shape your spending — and a growing toolkit to work with it.
          </p>
        </div>
        <div style={{background:C.card,borderRadius:"14px",padding:"20px 22px",textAlign:"left",boxShadow:"0 2px 8px rgba(26,51,48,0.08)"}}>
          <p style={lbl(C.teal)}>WHAT YOU COVERED</p>
          {LESSONS.map(l=>(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}>
              <span style={{fontSize:"16px"}}>{l.emoji}</span>
              <p style={{fontSize:"14px",color:C.text,margin:0,fontWeight:500}}>{l.title}</p>
              <span style={{marginLeft:"auto",color:C.teal,fontWeight:700,fontSize:"14px"}}>✓</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <button onClick={()=>go("worlds")} style={btnYellow}>Choose your next world →</button>
          <button onClick={()=>go("lesson_map")} style={btnGhost}>Revisit Mind & Money</button>
        </div>
        <p style={{fontSize:"12px",color:C.textMut,margin:0}}>For educational purposes only · Not financial advice · AVEN LLC</p>
      </div>
    </div>
  );

  return null;
}
