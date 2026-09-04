import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Router basename must match Vite's base, or every route resolves against the
// wrong prefix once the site is served from a subdirectory (GitHub Pages).
// import.meta.env.BASE_URL is whatever `base` resolved to at build time, so
// the two cannot drift; the trailing slash is trimmed because React Router
// wants "/repo", not "/repo/".
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
