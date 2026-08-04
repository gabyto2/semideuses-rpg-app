import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/foundation.css';

const rootElement = document.getElementById('root');

try {
  if (!rootElement) throw new Error('Elemento #root não encontrado.');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error(error);
  document.body.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#f4efe4;font-family:system-ui,-apple-system,Segoe UI,sans-serif">
      <section style="max-width:520px;background:#fffdf8;border:1px solid #ddd2bc;border-radius:18px;padding:24px;color:#21313c;box-shadow:0 8px 24px #00000012">
        <strong style="display:block;color:#9b2f2f;font-size:1.2rem;margin-bottom:8px">Falha ao iniciar o aplicativo</strong>
        <p style="margin:0 0 10px;line-height:1.5">A página foi carregada, mas o React encontrou um erro.</p>
        <code style="display:block;white-space:pre-wrap;color:#706b61">${String(error)}</code>
      </section>
    </main>`;
}
