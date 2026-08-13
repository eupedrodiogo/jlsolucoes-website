import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { loadAnalytics, trackContactClicks } from '@/lib/analytics';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

// O listener é barato e precisa existir desde já: se o visitante clicar num
// CTA antes do gtag carregar, o evento entra na fila do dataLayer e sai assim
// que o script chega.
trackContactClicks();

// O gtag.js pesa ~146 KB. Fica fora do caminho crítico: só depois que a página
// terminou de carregar e a thread principal está ociosa.
function startAnalytics() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => loadAnalytics());
  } else {
    setTimeout(() => loadAnalytics(), 2000);
  }
}

if (document.readyState === 'complete') {
  startAnalytics();
} else {
  window.addEventListener('load', startAnalytics, { once: true });
}
