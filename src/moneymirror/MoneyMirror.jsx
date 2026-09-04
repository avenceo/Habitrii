import { useEffect, useMemo, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { ARCHETYPES, ARCHETYPE_ORDER, TIEBREAK_ORDER } from './archetypes.js';
import { QUESTIONS, scoreAnswers } from './questions.js';

// ─── Brand ──────────────────────────────────────────────────────────────────
const C = {
  teal: '#57b7a7',
  yellow: '#f5d924',
  gray: '#a09e98',
  white: '#ffffff',
  deep: '#1a3330',
  mid: '#2a4a44',
  ink: '#0d1f1d',
};

const APP_URL = 'https://habitrii.aven4life.com/';
const MIRROR_URL = 'https://habitrii.aven4life.com/moneymirror/';
const TURNSTILE_SITE_KEY = '0x4AAAAAADr_TSPU6XirX62b';

// ─── Helpers ────────────────────────────────────────────────────────────────
function safeTrack(name, props) {
  try {
    if (typeof window !== 'undefined' && typeof window.va === 'function') {
      window.va('event', { name, data: props || {} });
    }
  } catch {
    /* analytics must never break the experience */
  }
}

function readTypeParam() {
  try {
    const t = new URLSearchParams(window.location.search).get('type');
    return t && ARCHETYPES[t] ? t : null;
  } catch {
    return null;
  }
}

// ─── Shared UI ──────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: C.teal,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: C.ink,
    padding: '24px 16px 48px',
    boxSizing: 'border-box',
  },
  shell: { maxWidth: 560, margin: '0 auto' },
  brand: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandLink: { color: C.deep, fontWeight: 800, fontSize: 20, textDecoration: 'none', letterSpacing: -0.3 },
  brandSub: { color: C.deep, fontSize: 13, opacity: 0.85 },
  card: {
    background: C.white,
    borderRadius: 18,
    padding: '26px 22px',
    boxShadow: '0 8px 28px rgba(13,31,29,0.14)',
  },
  darkCard: {
    background: C.deep,
    color: C.white,
    borderRadius: 18,
    padding: '26px 22px',
  },
  h1: { fontSize: 30, lineHeight: 1.12, margin: '0 0 12px', fontWeight: 800, letterSpacing: -0.5 },
  h2: { fontSize: 22, lineHeight: 1.2, margin: '0 0 14px', fontWeight: 800, letterSpacing: -0.3 },
  p: { fontSize: 16, lineHeight: 1.55, margin: '0 0 12px' },
  small: { fontSize: 13, lineHeight: 1.5, color: C.gray },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: C.teal,
    margin: '0 0 8px',
  },
  btn: {
    display: 'inline-block',
    background: C.yellow,
    color: C.ink,
    border: 'none',
    borderRadius: 12,
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    textAlign: 'center',
  },
  btnGhost: {
    display: 'inline-block',
    background: 'transparent',
    color: C.deep,
    border: `2px solid ${C.deep}`,
    borderRadius: 12,
    padding: '12px 18px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    textAlign: 'center',
  },
  choice: (selected) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: selected ? C.yellow : C.white,
    border: `2px solid ${selected ? C.yellow : '#e6e4df'}`,
    borderRadius: 14,
    padding: '14px 16px',
    fontSize: 16,
    lineHeight: 1.45,
    fontFamily: 'inherit',
    color: C.ink,
    cursor: 'pointer',
    marginBottom: 10,
    transition: 'background 120ms, border-color 120ms',
  }),
  dots: { display: 'flex', gap: 6, marginBottom: 16 },
  dot: (state) => ({
    height: 6,
    flex: 1,
    borderRadius: 4,
    background: state === 'done' ? C.yellow : state === 'now' ? C.deep : 'rgba(13,31,29,0.18)',
  }),
  tip: {
    background: C.deep,
    color: C.white,
    borderLeft: `5px solid ${C.yellow}`,
    borderRadius: 12,
    padding: '14px 16px',
    margin: '14px 0',
    fontSize: 15,
    lineHeight: 1.5,
  },
  label: { display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6, color: C.deep },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    fontSize: 16,
    fontFamily: 'inherit',
    borderRadius: 12,
    border: '2px solid #e6e4df',
    marginBottom: 10,
  },
  checkRow: { display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.45, marginBottom: 10 },
  disclaimer: {
    marginTop: 22,
    fontSize: 12,
    lineHeight: 1.5,
    color: C.deep,
    opacity: 0.85,
  },
};

function Brand() {
  return (
    <div style={styles.brand}>
      <a href={APP_URL} style={styles.brandLink}>Habitrii</a>
      <span style={styles.brandSub}>Money Mirror</span>
    </div>
  );
}

function Disclaimer() {
  return (
    <p style={styles.disclaimer}>
      Money Mirror is for educational and self-reflection purposes only. It is not
      financial, legal, or investment advice, and your result is a reflection, not a
      prediction or a diagnosis. Habitrii is for adults 18 and older.
    </p>
  );
}

// ─── Email capture (the soft bridge) ────────────────────────────────────────
function EmailCapture({ archetypeKey }) {
  const [email, setEmail] = useState('');
  const [adult, setAdult] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [token, setToken] = useState('');

  const valid =
    email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && adult && consent && !!token;

  const submit = async () => {
    if (!valid || status === 'sending') return;
    setStatus('sending');
    safeTrack('mm_email_submit', { type: archetypeKey });
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          captchaToken: token,
          source: 'money-mirror',
          tags: ['money-mirror', `mm-${archetypeKey}`],
        }),
      });
      if (!res.ok) throw new Error('capture failed');
      setStatus('done');
      safeTrack('mm_email_captured', { type: archetypeKey });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div style={styles.tip}>
        Saved. Your full Money Mirror breakdown is on its way — check your inbox
        (and the promotions folder, just in case). 💛
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="mm-email" style={styles.label}>Save your Money Mirror</label>
      <input
        id="mm-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        maxLength={254}
      />
      <label style={styles.checkRow}>
        <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
        <span>I confirm I am 18 years of age or older.</span>
      </label>
      <label style={styles.checkRow}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Send me my full breakdown and occasional Habitrii updates. Unsubscribe anytime.
        </span>
      </label>
      <div style={{ marginBottom: 12, minHeight: 66 }}>
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          options={{ theme: 'light' }}
          onSuccess={(t) => setToken(t)}
          onExpire={() => setToken('')}
          onError={() => setToken('')}
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={!valid || status === 'sending'}
        style={{ ...styles.btn, width: '100%', opacity: valid ? 1 : 0.55 }}
      >
        {status === 'sending' ? 'Saving…' : 'Send me my full breakdown'}
      </button>
      {status === 'error' && (
        <p style={{ ...styles.small, color: '#8a2f2f', marginTop: 8 }}>
          That didn’t go through. Give it another try in a moment.
        </p>
      )}
    </div>
  );
}

// ─── Result ─────────────────────────────────────────────────────────────────
function Result({ archetypeKey, fromShare, onRetake }) {
  const a = ARCHETYPES[archetypeKey];
  const [copied, setCopied] = useState(false);
  const shareUrl = `${MIRROR_URL}?type=${a.key}`;

  useEffect(() => {
    safeTrack(fromShare ? 'mm_share_landing' : 'mm_result_view', { type: a.key });
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('type', a.key);
      window.history.replaceState(null, '', url.toString());
    } catch { /* noop */ }
  }, [a.key, fromShare]);

  const share = async () => {
    safeTrack('mm_share_click', { type: a.key });
    const text = `${a.shareLine} Find yours: ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Money Mirror — ${a.name}`, text: a.shareLine, url: shareUrl });
        return;
      } catch { /* user cancelled or unsupported — fall through to copy */ }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch { /* noop */ }
  };

  const lessonHref = `${APP_URL}?mm=${a.key}&lesson=${a.lesson.id}`;

  return (
    <div>
      <div style={styles.darkCard}>
        <p style={{ ...styles.eyebrow, color: C.yellow }}>
          {fromShare ? 'A friend’s Money Mirror' : 'Your Money Mirror'}
        </p>
        <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }} aria-hidden="true">{a.emoji}</div>
        <h1 style={{ ...styles.h1, color: C.white }}>{a.name}</h1>
        <p style={{ ...styles.p, fontSize: 18, fontWeight: 700, color: C.yellow, marginBottom: 16 }}>
          {a.tagline}
        </p>
        <p style={{ ...styles.p, color: C.white, opacity: 0.94 }}>{a.mirror}</p>
      </div>

      <div style={{ ...styles.card, marginTop: 14 }}>
        <p style={styles.eyebrow}>Your strength</p>
        <p style={styles.p}>{a.strength}</p>
        <p style={styles.eyebrow}>Your blind spot</p>
        <p style={styles.p}>{a.blindSpot}</p>
        <div style={styles.tip}>
          <strong style={{ color: C.yellow }}>One small shift: </strong>{a.smallShift}
        </div>
      </div>

      <div style={{ ...styles.card, marginTop: 14 }}>
        <p style={styles.eyebrow}>Go deeper — no credit card</p>
        <p style={styles.p}>
          {fromShare
            ? 'Take the mirror yourself, then start with the lesson built for your type.'
            : `The lesson built for ${a.name.replace('The ', 'a ')}: `}
          {!fromShare && <strong>{a.lesson.title}</strong>}
          {!fromShare && ' — inside Habitrii’s free Mind & Money world.'}
        </p>
        <div style={{ display: 'grid', gap: 10 }}>
          {fromShare ? (
            <button type="button" onClick={onRetake} style={styles.btn}>Find your Money Mirror</button>
          ) : (
            <a
              href={lessonHref}
              style={styles.btn}
              onClick={() => safeTrack('mm_lesson_click', { type: a.key, lesson: a.lesson.id })}
            >
              Start {a.lesson.title} — free to begin
            </a>
          )}
          <button type="button" onClick={share} style={styles.btnGhost}>
            {copied ? 'Link copied ✓' : 'Share your Money Mirror'}
          </button>
        </div>
      </div>

      {!fromShare && (
        <div style={{ ...styles.card, marginTop: 14 }}>
          <EmailCapture archetypeKey={a.key} />
        </div>
      )}

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a
          href="/blog/"
          style={{ color: C.deep, fontWeight: 700, fontSize: 14 }}
          onClick={() => safeTrack('mm_blog_click', { type: a.key })}
        >
          Meet all nine types →
        </a>
        {!fromShare && (
          <button
            type="button"
            onClick={onRetake}
            style={{ background: 'none', border: 'none', color: C.deep, fontFamily: 'inherit', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Retake
          </button>
        )}
      </div>
      <Disclaimer />
    </div>
  );
}

// ─── Quiz ───────────────────────────────────────────────────────────────────
function Quiz({ onDone }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [picked, setPicked] = useState(null);
  const q = QUESTIONS[idx];

  const choose = (optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    const next = [...answers, optIdx];
    setTimeout(() => {
      if (idx + 1 < QUESTIONS.length) {
        setAnswers(next);
        setIdx(idx + 1);
        setPicked(null);
      } else {
        onDone(next);
      }
    }, 260);
  };

  return (
    <div style={styles.card}>
      <div style={styles.dots} aria-hidden="true">
        {QUESTIONS.map((_, i) => (
          <div key={i} style={styles.dot(i < idx ? 'done' : i === idx ? 'now' : 'todo')} />
        ))}
      </div>
      <p style={styles.eyebrow}>Question {idx + 1} of {QUESTIONS.length}</p>
      <h2 style={styles.h2}>{q.prompt}</h2>
      {q.options.map((opt, i) => (
        <button key={i} type="button" onClick={() => choose(i)} style={styles.choice(picked === i)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Intro ──────────────────────────────────────────────────────────────────
function Intro({ onStart }) {
  return (
    <div>
      <div style={styles.darkCard}>
        <p style={{ ...styles.eyebrow, color: C.yellow }}>Money Mirror</p>
        <h1 style={{ ...styles.h1, color: C.white }}>Your money has a personality. Meet it.</h1>
        <p style={{ ...styles.p, color: C.white, opacity: 0.92 }}>
          Five honest questions. Under a minute. No sign-up to see your result.
          You’ll get one of nine money types — with the strength you’re probably
          underusing and the blind spot you probably already suspect.
        </p>
        <button type="button" onClick={onStart} style={{ ...styles.btn, width: '100%', marginTop: 6 }}>
          Show me my Money Mirror
        </button>
      </div>
      <div style={{ ...styles.card, marginTop: 14 }}>
        <p style={styles.eyebrow}>The nine types</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {ARCHETYPE_ORDER.map((k) => (
            <div key={k} style={{ fontSize: 13, lineHeight: 1.3, textAlign: 'center', padding: '10px 4px', background: '#f5f4f1', borderRadius: 10 }}>
              <div style={{ fontSize: 22 }} aria-hidden="true">{ARCHETYPES[k].emoji}</div>
              <div style={{ fontWeight: 700 }}>{ARCHETYPES[k].name.replace('The ', '')}</div>
            </div>
          ))}
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}

// ─── Root ───────────────────────────────────────────────────────────────────
export default function MoneyMirror() {
  const initialType = useMemo(readTypeParam, []);
  const [screen, setScreen] = useState(initialType ? 'shared' : 'intro');
  const [resultKey, setResultKey] = useState(initialType);

  const start = () => {
    safeTrack('mm_start');
    setScreen('quiz');
  };

  const finish = (answers) => {
    const { key } = scoreAnswers(answers, TIEBREAK_ORDER);
    setResultKey(key);
    safeTrack('mm_complete', { type: key });
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retake = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('type');
      window.history.replaceState(null, '', url.toString());
    } catch { /* noop */ }
    setResultKey(null);
    setScreen('quiz');
    safeTrack('mm_start', { retake: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Brand />
        {screen === 'intro' && <Intro onStart={start} />}
        {screen === 'quiz' && <Quiz onDone={finish} />}
        {screen === 'result' && resultKey && (
          <Result archetypeKey={resultKey} fromShare={false} onRetake={retake} />
        )}
        {screen === 'shared' && resultKey && (
          <Result archetypeKey={resultKey} fromShare onRetake={retake} />
        )}
      </div>
    </main>
  );
}
