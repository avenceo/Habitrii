# Habitrii

Financial literacy that actually clicks.

A choose-your-own-adventure learning experience built with React + Vite, deployed on Vercel.

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **Hosting**: Vercel
- **AI**: Anthropic Claude API (Phase 3)
- **Content**: Google Drive JSON files (Phase 2)
- **Backend**: Audos SDK (user auth, progress, payments)

---

## Environment Variables

Add these in your Vercel project dashboard under Settings → Environment Variables:

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key (added in Phase 3) |

**Never put API keys directly in code files.**

---

## Local Development

```bash
npm install
npm run dev
```

---

## Deployment

This project auto-deploys via Vercel when you push to the `main` branch on GitHub.

---

*AVEN LLC · Habitrii · For educational purposes only · Not financial advice*
