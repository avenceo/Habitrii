import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// Multi-page build: the main SPA plus the standalone Money Mirror entry.
// Money Mirror builds to dist/moneymirror/index.html and is served as a
// static file by Vercel ahead of the SPA rewrite.
const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: root + 'index.html',
        moneymirror: root + 'moneymirror/index.html',
      },
    },
  },
})
