import React from 'react';
import { createRoot } from 'react-dom/client';
import { inject } from '@vercel/analytics';
import MoneyMirror from './MoneyMirror.jsx';

// Money Mirror is a separate Vite entry (moneymirror/index.html) so it ships
// as a real, crawlable URL without touching the main app's state-based
// navigation or its protected lesson routes.
inject();
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MoneyMirror />
  </React.StrictMode>,
);
