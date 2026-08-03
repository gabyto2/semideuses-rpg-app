import { useMemo, useState } from 'react';

type Section = 'inicio' | 'personagens' | 'campanha' | 'compendio' | 'ajustes';

const navItems: Array<{ id: Section; label: string; icon: string }> = [
  { id: 'inicio', label: 'Início', icon: '⌂' },
  { id: 'personagens', label: 'Personagens', icon: '♙' },
  { id: 'campanha', label: 'Campanha', icon: '⚑' },
  { id: 'compendio', label: 'Compêndio', icon: '☷' },
  { id: 'ajustes', label: 'Ajustes', icon: '⚙' },
];

function App() {
  const [section, setSection] = useState<Section>('inicio');
  const title = useMemo(() => navItems.find((item) => item.id === section)?.label ?? 'Início', [section]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">SEMIDEUSES RPG</span>
          <h1>{title}</h1>
        </div>
        <button className="profile-button" aria-label="Perfil">S3</button>
      </header>

      <main className="content">
        {section === 'inicio' && <Home />}
        {section === 'personagens' && <Placeholder title="Personagens" text="Aqui ficarão as fichas, criação guiada, evolução e backups." />}
        {section === 'campanha' && <Placeholder title="Campanha" text="Área preparada para jogadores, sessões, encontros e anotações do Mestre." />}
        {section === 'compendio' && <Placeholder title="Compêndio" text="Banco oficial de Filiações, Caminhos Divinos, Skills, Talentos, itens e Bestiário." />}
        {section === 'ajustes' && <Placeholder title="Ajustes" text="Tema, instalação, armazenamento local, importação e exportação." />}
      </main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={section === item.id ? 'active' : ''}
            onClick={() => setSection(item.id)}
          >
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero-card">
        <div>
          <span className="eyebrow">APP OFICIAL DA MESA</span>
          <h2>Seu universo mítico em um só lugar</h2>
          <p>Fichas automáticas, campanhas, regras e ferramentas do Mestre — com funcionamento offline.</p>
        </div>
        <div className="hero-mark">Ω</div>
      </section>

      <section className="quick-grid">
        <article className="quick-card"><strong>0</strong><span>Personagens</span></article>
        <article className="quick-card"><strong>0</strong><span>Campanhas</span></article>
        <article className="quick-card"><strong>317</strong><span>Páginas catalogadas</span></article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><span className="eyebrow">SPRINT 1</span><h3>Fundação do aplicativo</h3></div>
          <span className="status">Em construção</span>
        </div>
        <ul className="checklist">
          <li className="done">React + TypeScript + Vite</li>
          <li className="done">Layout mobile para Android e iPhone</li>
          <li className="done">Navegação principal</li>
          <li>Banco local com IndexedDB</li>
          <li>Gerenciamento de personagens</li>
          <li>Tema claro e escuro</li>
        </ul>
      </section>

      <section className="panel compact">
        <span className="eyebrow">PRÓXIMA ETAPA</span>
        <h3>Minhas fichas</h3>
        <p>Criação, edição, duplicação, exclusão, backup e restauração de personagens.</p>
      </section>
    </>
  );
}

function Placeholder({ title, text }: { title: string; text: string }) {
  return (
    <section className="panel empty-state">
      <div className="empty-icon">✦</div>
      <h2>{title}</h2>
      <p>{text}</p>
      <span className="status">Módulo preparado</span>
    </section>
  );
}

export default App;
