// Habitrii — Auth screens (Supabase Phase 02)
// Self-contained flow: signup / signin / verify-email / request-reset / new-password.
// Renders inside App.jsx when screen === "auth". Brand-consistent with the welcome gate.

import { useState } from "react";
import { supabase } from "./lib/supabase";

const C = {
  bg: "#faf9f6", dark: "#232321", teal: "#57b7a7", tealDark: "#2f6f65",
  yellow: "#f5d924", text: "#1f1f1d", textOnDark: "#1f1f1d",
};

const card = {
  background: "#c3c3c3", borderRadius: "16px", padding: "32px 28px 36px",
  boxShadow: "0 8px 32px rgba(35,35,33,0.25)", textAlign: "left",
};
const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "14px 16px",
  borderRadius: "10px", border: "1.5px solid rgba(35,35,33,0.3)",
  background: "rgba(35,35,33,0.06)", color: "#1f1f1d",
  fontSize: "16px", fontFamily: "inherit", outline: "none",
};
const primaryBtn = {
  width: "100%", padding: "15px 16px", borderRadius: "10px", border: "none",
  background: C.yellow, color: C.dark, fontSize: "16px", fontWeight: 700,
  fontFamily: "inherit", cursor: "pointer",
};
const linkStyle = { color: C.tealDark, textDecoration: "underline", cursor: "pointer", background: "none", border: "none", font: "inherit", fontSize: "13px", padding: 0 };
const mutedText = { fontSize: "13px", color: "rgba(31,31,29,0.72)", lineHeight: 1.55 };
const errText = { fontSize: "13px", color: "#8b2f2f", margin: 0 };
const okText = { fontSize: "13px", color: "#1e6b5c", margin: 0 };
const h2 = { fontSize: "26px", fontWeight: 700, margin: "0 0 8px", color: C.textOnDark };

export default function AuthFlow({ initialEmail = "", consent, recoveryMode = false, onAuthed }) {
  // mode: signup | signin | verify | reset-request | reset-sent | new-password
  const [mode, setMode] = useState(recoveryMode ? "new-password" : "signup");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [showPw, setShowPw] = useState(false);

  if (!supabase) {
    // Env vars missing — fail soft and let the caller continue the old flow.
    onAuthed(null);
    return null;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

  const run = async (fn) => {
    setBusy(true); setError(null); setNotice(null);
    try { await fn(); } catch (e) { setError(e.message || "Something went wrong. Please try again."); }
    setBusy(false);
  };

  const handleSignUp = () => run(async () => {
    if (!emailOk) throw new Error("Please enter a valid email address.");
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (password !== password2) throw new Error("Passwords do not match.");
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          age_verified: true,
          tos_accepted_at: consent?.tosAcceptedAt || new Date().toISOString(),
        },
      },
    });
    if (err) throw err;
    if (data.session) { onAuthed(data.session); return; }
    setMode("verify");
  });

  const handleSignIn = () => run(async () => {
    if (!emailOk) throw new Error("Please enter a valid email address.");
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      if (/confirm/i.test(err.message)) { setMode("verify"); return; }
      throw new Error("Email or password is incorrect.");
    }
    onAuthed(data.session);
  });

  const handleResend = () => run(async () => {
    const { error: err } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: window.location.origin } });
    if (err) throw err;
    setNotice("Confirmation email sent. Check your inbox (and spam folder).");
  });

  const handleResetRequest = () => run(async () => {
    if (!emailOk) throw new Error("Please enter a valid email address.");
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (err) throw err;
    setMode("reset-sent");
  });

  const handleNewPassword = () => run(async () => {
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (password !== password2) throw new Error("Passwords do not match.");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) throw err;
    setNotice("Password updated.");
    const { data: s } = await supabase.auth.getSession();
    onAuthed(s?.session || null);
  });

  const field = (props) => <input style={inputStyle} {...props} />;
  const onEnter = (fn) => (e) => { if (e.key === "Enter") fn(); };
  const pwType = showPw ? "text" : "password";
  const showPwRow = (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={showPw}
        onChange={(e) => setShowPw(e.target.checked)}
        style={{ accentColor: C.yellow, cursor: "pointer", width: "15px", height: "15px" }}
      />
      <span style={mutedText}>Show password</span>
    </label>
  );

  const body = () => {
    if (mode === "verify") return (
      <>
        <h2 style={h2}>Check your email</h2>
        <p style={mutedText}>
          We sent a confirmation link to <strong style={{ color: C.textOnDark }}>{email}</strong>.
          Click it, then come back here and sign in.
        </p>
        {notice && <p style={okText}>{notice}</p>}
        {error && <p style={errText}>{error}</p>}
        <button style={primaryBtn} disabled={busy} onClick={() => setMode("signin")}>I confirmed — sign me in</button>
        <p style={mutedText}>
          Didn&apos;t get it?{" "}
          <button style={linkStyle} disabled={busy} onClick={handleResend}>Resend email</button>
        </p>
      </>
    );

    if (mode === "reset-request") return (
      <>
        <h2 style={h2}>Reset your password</h2>
        <p style={mutedText}>Enter your email and we&apos;ll send you a reset link.</p>
        {field({ type: "email", placeholder: "you@example.com", value: email, autoComplete: "email",
          onChange: (e) => setEmail(e.target.value.trim()), onKeyDown: onEnter(handleResetRequest) })}
        {error && <p style={errText}>{error}</p>}
        <button style={primaryBtn} disabled={busy} onClick={handleResetRequest}>{busy ? "Sending…" : "Send reset link"}</button>
        <p style={mutedText}><button style={linkStyle} onClick={() => setMode("signin")}>Back to sign in</button></p>
      </>
    );

    if (mode === "reset-sent") return (
      <>
        <h2 style={h2}>Reset link sent</h2>
        <p style={mutedText}>Check <strong style={{ color: C.textOnDark }}>{email}</strong> for a link to set a new password.</p>
        <button style={primaryBtn} onClick={() => setMode("signin")}>Back to sign in</button>
      </>
    );

    if (mode === "new-password") return (
      <>
        <h2 style={h2}>Set a new password</h2>
        {field({ type: pwType, placeholder: "New password (8+ characters)", value: password, autoComplete: "new-password",
          onChange: (e) => setPassword(e.target.value) })}
        {field({ type: pwType, placeholder: "Repeat new password", value: password2, autoComplete: "new-password",
          onChange: (e) => setPassword2(e.target.value), onKeyDown: onEnter(handleNewPassword) })}
        {showPwRow}
        {notice && <p style={okText}>{notice}</p>}
        {error && <p style={errText}>{error}</p>}
        <button style={primaryBtn} disabled={busy} onClick={handleNewPassword}>{busy ? "Saving…" : "Save new password"}</button>
      </>
    );

    const isSignup = mode === "signup";
    return (
      <>
        <h2 style={h2}>{isSignup ? "Create your account" : "Welcome back"}</h2>
        <p style={mutedText}>
          {isSignup ? "One account for your whole money journey." : "Sign in to pick up where you left off."}
        </p>
        {field({ type: "email", placeholder: "you@example.com", value: email, autoComplete: "email",
          onChange: (e) => setEmail(e.target.value.trim()) })}
        {field({ type: pwType, placeholder: isSignup ? "Password (8+ characters)" : "Password", value: password,
          autoComplete: isSignup ? "new-password" : "current-password",
          onChange: (e) => setPassword(e.target.value),
          onKeyDown: isSignup ? undefined : onEnter(handleSignIn) })}
        {isSignup && field({ type: pwType, placeholder: "Repeat password", value: password2, autoComplete: "new-password",
          onChange: (e) => setPassword2(e.target.value), onKeyDown: onEnter(handleSignUp) })}
        {showPwRow}
        {error && <p style={errText}>{error}</p>}
        <button style={primaryBtn} disabled={busy} onClick={isSignup ? handleSignUp : handleSignIn}>
          {busy ? "One moment…" : isSignup ? "Create account →" : "Sign in →"}
        </button>
        <p style={mutedText}>
          {isSignup ? "Already have an account? " : "New to Habitrii? "}
          <button style={linkStyle} onClick={() => { setError(null); setMode(isSignup ? "signin" : "signup"); }}>
            {isSignup ? "Sign in" : "Create an account"}
          </button>
          {!isSignup && (
            <>
              {" · "}
              <button style={linkStyle} onClick={() => { setError(null); setMode("reset-request"); }}>Forgot password?</button>
            </>
          )}
        </p>
      </>
    );
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      background: C.bg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "36px 24px", boxSizing: "border-box",
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ ...card, display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(35,35,33,0.7)", margin: 0 }}>HABITRII</p>
          {body()}
        </div>
      </div>
    </div>
  );
}
