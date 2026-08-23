import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';

/**
 * Per-user forensic watermark overlay — Habitrii content protection (Aug 2026).
 *
 * Tiles a faint, diagonal identifier (masked email + short account code)
 * across the viewport so any screenshot or photo of the screen traces back to
 * the signed-in account. Deterrence + traceability. Pairs with Terms of
 * Service §10.3, which prohibits removing or circumventing it.
 *
 * INTEGRATION: mounted once in main.jsx as a sibling of <App />. The
 * component subscribes to Supabase auth itself:
 *   - no session (landing, auth screens)  -> renders nothing
 *   - signed in                            -> fixed overlay over all content
 *   - supabase client null (env missing)   -> renders nothing, fail-soft
 * No changes to App.jsx are required.
 *
 * KNOWN LIMITATION (accepted for v1): client-side overlay; a technical user
 * can strip it via devtools. If real leaks surface, revisit baking the
 * identifier server-side into rendered content and image-narration frames.
 *
 * Rendering notes:
 *  - Single element; the tile is an inline SVG data-URI (no repeated DOM).
 *  - pointer-events: none — never intercepts taps/clicks.
 *  - aria-hidden — decorative, invisible to screen readers (WCAG 2.1 AA).
 */

/** "haiden@aven4life.com" -> "h•••@aven4life.com" */
function maskEmail(email) {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  return `${local.charAt(0)}\u2022\u2022\u2022@${domain}`;
}

/** Minimal XML escaping for the SVG text node. */
function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default function Watermark({
  opacity = 0.1,
  color = '#2f6f65', // Habitrii dark teal — reads on the warm surface
  fontSize = 13,
  tileWidth = 340,
  tileHeight = 220,
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined; // env vars missing — fail soft, no overlay
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setUser(data.session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const backgroundImage = useMemo(() => {
    const parts = [
      maskEmail(user?.email),
      user?.id ? String(user.id).slice(0, 8) : '',
    ].filter(Boolean);
    if (parts.length === 0) return 'none';

    const label = escapeXml(parts.join(' \u00B7 '));
    const cx = tileWidth / 2;
    const cy = tileHeight / 2;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${tileWidth}" height="${tileHeight}">` +
      `<text x="16" y="${cy}" font-family="DM Sans, sans-serif" font-size="${fontSize}" ` +
      `fill="${color}" transform="rotate(-30 ${cx} ${cy})">${label}</text>` +
      `</svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [user, color, fontSize, tileWidth, tileHeight]);

  if (!user || backgroundImage === 'none') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        backgroundImage,
        backgroundRepeat: 'repeat',
        opacity,
        zIndex: 2147483000,
      }}
    />
  );
}
