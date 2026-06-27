import { useEffect, useRef, useState } from 'react';
import './LegalDocLayout.css';

/**
 * LegalDocLayout
 *
 * Shared layout for Habitrii's legal documents (Terms of Service, Privacy
 * Policy, etc). Renders the document body next to a sticky table-of-contents
 * sidebar that highlights the section currently in view (scrollspy), and
 * collapses into a dropdown above the content on small screens.
 *
 * Props:
 *  - title:           string, e.g. "Terms of service"
 *  - effectiveDate:    string, e.g. "[Insert effective date before publishing]"
 *  - lastUpdated:      string, same format as effectiveDate
 *  - draftNotice:      optional string. When present, renders a visible
 *                       banner. Leave this set until a Virginia attorney has
 *                       signed off on the document — do not remove it just
 *                       because the page is live.
 *  - tocItems:         array of { id, label } describing every section, used
 *                       to build the sidebar/dropdown nav. Must match the
 *                       `id` attributes on the <section> elements passed as
 *                       children.
 *  - children:         the document body. Wrap each section in
 *                       <section id="...">, matching a tocItems id.
 */
export default function LegalDocLayout({
  title,
  effectiveDate,
  lastUpdated,
  draftNotice,
  tocItems,
  onBack,
  children,
}) {
  const [activeId, setActiveId] = useState(tocItems?.[0]?.id ?? null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!tocItems?.length) return;

    const sections = tocItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those
        // currently intersecting, so the highlighted item tracks scroll
        // position the way Vercel's / Stripe's docs do.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Treat a section as "active" once it's within the top third of the
        // viewport, and until it scrolls past that point.
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tocItems]);

  function handleTocClick(event, id) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    // Move focus for keyboard/screen-reader users so the document flow
    // continues from the section heading, not from the link they left.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });

    setActiveId(id);

    // Close the mobile dropdown after a selection.
    const details = document.getElementById('hb-legal-toc-mobile');
    if (details) details.removeAttribute('open');
  }

  const tocList = (
    <ul className="hb-legal-toc-list">
      {tocItems.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={
              'hb-legal-toc-link' +
              (item.id === activeId ? ' hb-legal-toc-link--active' : '')
            }
            aria-current={item.id === activeId ? 'true' : undefined}
            onClick={(e) => handleTocClick(e, item.id)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="hb-legal-page">
      {onBack && (
        <div className="hb-legal-back-top">
          <button onClick={onBack} className="hb-legal-back-btn">
            ← Back
          </button>
        </div>
      )}
      <div className="hb-legal-header">
        <h1 className="hb-legal-title">{title}</h1>
        <p className="hb-legal-meta">Operated by AVEN LLC &middot; Sterling, Virginia</p>
        <p className="hb-legal-meta">
          Effective date: {effectiveDate} &middot; Last updated: {lastUpdated}
        </p>
        {draftNotice && (
          <div className="hb-legal-draft-banner" role="note">
            {draftNotice}
          </div>
        )}
      </div>

      {/* Mobile: collapsible "On this page" menu, shown above the content. */}
      <details id="hb-legal-toc-mobile" className="hb-legal-toc-mobile">
        <summary>On this page</summary>
        {tocList}
      </details>

      <div className="hb-legal-grid">
        <main ref={contentRef} className="hb-legal-content">
          {children}
        </main>

        {/* Desktop: sticky sidebar nav. */}
        <nav className="hb-legal-toc-desktop" aria-label="Table of contents">
          <div className="hb-legal-toc-label">On this page</div>
          {tocList}
        </nav>
      </div>

      {onBack && (
        <div className="hb-legal-back-bottom">
          <button onClick={onBack} className="hb-legal-back-btn">
            ← Back to Habitrii
          </button>
        </div>
      )}
    </div>
  );
}
