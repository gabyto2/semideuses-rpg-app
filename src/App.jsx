import { useState } from 'react';

const sections = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'jogador', label: 'Jogador', icon: '♙' },
  { id: 'mestre', label: 'Mestre', icon: '⚑' },
  { id: 'compendio', label: 'Compêndio', icon: '☷' },
];

function App() {
  const [section, setSection] = useState('inicio');
  const current = sections.find((item) => item.id === section);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">SEMIDEUSES RPG 3E</span>
          <h1>{current?.label ?? 'Início'}</h1>
        </div>
        <div className="brand-mark">S3</div>
      </header>

      <main className="content">
        {section === 'inicio' ? (
          <>
            <section className="hero">
              <span className="eyebrow">BASE NOVA · DEVELOP</span>
              <h2>O aplicativo está sendo reconstruído com uma fundação estável.</h2>
              <p>Esta versão de teste serve para validar compilação, navegação e funcionamento em Android, iPhone e computador antes de adicionarmos as regras do RPG.</p>
            </section>

            <section className="grid">
              <button className="card action" onClick={() => setSection('jogador')}>
                <span className="card-icon">♙</span>
                <strong>Jogador</strong>
                <small>Fichas e progressão</small>
              </button>
              <button className="card action" onClick={() => setSection('mestre')}>
                <span className="card-icon">⚑</span>
                <strong>Mestre</strong>
                <small>Campanhas e encontros</small>
              </button>
              <button className="card action" onClick={() => setSection('compendio')}>
                <span className="card-icon">☷</span>
                <strong>Compêndio</strong>
                <small>Regras dos dois livros</small>
              </button>
            </section>

            <section className="panel">
              <span className="status">Sprint 0</span>
              <h3>Teste de fundação</h3>
              <ul>
                <li>React + JavaScript + Vite</li>
                <li>Layout mobile responsivo</li>
                <li>Navegação sem recarregar a página</li>
                <li>Sem TypeScript no processo de build</li>
              </ul>
            </section>
          </>
        ) : (
          <section className="panel empty">
            <span className="large-icon">{current?.icon}</span>
            <h2>Módulo {current?.label}</h2>
            <p>A estrutura está funcionando. O conteúdo será adicionado somente depois que esta base for validada nos aparelhos.</p>
            <button className="primary" onClick={() => setSection('inicio')}>Voltar ao início</button>
          </section>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {sections.map((item) => (
          <button
            key={item.id}
            className={section === item.id ? 'active' : ''}
            onClick={() => setSection(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
