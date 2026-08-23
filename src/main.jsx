import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Watermark from './Watermark.jsx'
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Watermark />
    <Analytics />
  </React.StrictMode>,
)
