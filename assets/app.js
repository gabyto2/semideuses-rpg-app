(function(){
  'use strict';

  var app=document.getElementById('app');
  var state={section:'inicio'};

  var sections=[
    {id:'inicio',label:'Início',icon:'⌂'},
    {id:'jogador',label:'Jogador',icon:'♙'},
    {id:'mestre',label:'Mestre',icon:'⚑'},
    {id:'compendio',label:'Compêndio',icon:'☷'}
  ];

  var modules={
    jogador:[
      {icon:'♙',title:'Personagens',text:'Criar, editar, duplicar e salvar fichas.',status:'Próxima etapa'},
      {icon:'↟',title:'Progressão',text:'Subida de nível e escolhas automáticas.',status:'Preparado'},
      {icon:'⚔',title:'Modo combate',text:'PV, MP, condições, ataques e recursos.',status:'Preparado'}
    ],
    mestre:[
      {icon:'⚑',title:'Campanhas',text:'Sessões, jogadores e anotações.',status:'Preparado'},
      {icon:'♜',title:'Encontros',text:'Iniciativa, criaturas e dificuldade.',status:'Preparado'},
      {icon:'✦',title:'Profecias',text:'Criação e acompanhamento de profecias.',status:'Preparado'}
    ],
    compendio:[
      {icon:'Ω',title:'Filiações',text:'Os 26 deuses e suas progressões.',status:'Banco vazio'},
      {icon:'❖',title:'Caminhos Divinos',text:'Caminhos vinculados a cada Filiação.',status:'Banco vazio'},
      {icon:'☷',title:'Regras e Bestiário',text:'Livros do Jogador e do Mestre.',status:'Banco vazio'}
    ]
  };

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g,function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character];
    });
  }

  function activeSection(){
    return sections.find(function(item){return item.id===state.section;})||sections[0];
  }

  function homeView(){
    return '<section class="hero">'+
      '<span class="eyebrow">FUNDAÇÃO VALIDADA</span>'+
      '<h2>O universo de Semideuses pronto para crescer.</h2>'+
      '<p>A navegação agora está organizada em módulos reais. As próximas funcionalidades serão adicionadas sem alterar a estrutura principal.</p>'+
    '</section>'+
    '<section class="grid">'+sections.slice(1).map(function(item){
      return '<button class="card action" data-go="'+item.id+'">'+
        '<span class="card-icon">'+item.icon+'</span><strong>'+escapeHtml(item.label)+'</strong><small>Abrir módulo</small></button>';
    }).join('')+'</section>'+
    '<section class="panel"><span class="status ready">Parte concluída</span><h3>Estrutura preparada</h3><ul>'+ 
      '<li>Navegação entre telas sem recarregar</li><li>Separação entre Jogador, Mestre e Compêndio</li><li>Estrutura pronta para banco local</li><li>Base pronta para regras em arquivos separados</li></ul></section>';
  }

  function moduleView(section){
    var list=modules[section.id]||[];
    return '<section class="hero"><span class="eyebrow">MÓDULO '+escapeHtml(section.label.toUpperCase())+'</span><h2>'+escapeHtml(section.label)+'</h2><p>'+description(section.id)+'</p></section>'+
      '<section class="module-list">'+list.map(function(item,index){
        return '<button class="module-row" data-module="'+section.id+'-'+index+'"><span class="icon">'+item.icon+'</span><span><strong>'+escapeHtml(item.title)+'</strong><small>'+escapeHtml(item.text)+'</small></span><span class="status">'+escapeHtml(item.status)+'</span></button>';
      }).join('')+'</section>'+
      '<section class="panel"><h3>Preparação técnica</h3><p>'+technicalNote(section.id)+'</p></section>';
  }

  function description(id){
    if(id==='jogador')return 'Fichas, progressão, poderes, inventário e recursos do personagem.';
    if(id==='mestre')return 'Campanhas, encontros, criaturas, profecias e ferramentas de sessão.';
    return 'Banco oficial das regras dos Livros do Jogador e do Mestre.';
  }

  function technicalNote(id){
    if(id==='jogador')return 'O próximo passo será criar o armazenamento local e o primeiro formulário de personagem.';
    if(id==='mestre')return 'A área será ligada futuramente às campanhas e ao Bestiário sem misturar dados do jogador.';
    return 'As regras serão carregadas de arquivos separados por categoria, permitindo atualização sem reescrever a interface.';
  }

  function render(){
    var active=activeSection();
    var content=state.section==='inicio'?homeView():moduleView(active);
    app.innerHTML='<div class="app-shell">'+
      '<header class="topbar"><div><span class="eyebrow">SEMIDEUSES RPG 3E</span><h1>'+escapeHtml(active.label)+'</h1></div><div class="brand-mark">S3</div></header>'+
      '<main class="content">'+content+'</main>'+bottomNav()+'</div>';
    bindEvents();
  }

  function bottomNav(){
    return '<nav class="bottom-nav" aria-label="Navegação principal">'+sections.map(function(item){
      return '<button data-go="'+item.id+'" class="'+(state.section===item.id?'active':'')+'"><span>'+item.icon+'</span><small>'+escapeHtml(item.label)+'</small></button>';
    }).join('')+'</nav>';
  }

  function bindEvents(){
    Array.prototype.forEach.call(document.querySelectorAll('[data-go]'),function(button){
      button.addEventListener('click',function(){
        state.section=button.getAttribute('data-go')||'inicio';
        render();
        window.scrollTo(0,0);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-module]'),function(button){
      button.addEventListener('click',function(){
        var title=button.querySelector('strong');
        alert((title?title.textContent:'Módulo')+' será implementado na próxima etapa correspondente.');
      });
    });
  }

  try{render();}
  catch(error){
    app.innerHTML='<main style="padding:24px;font-family:system-ui"><h1>Falha ao iniciar</h1><pre style="white-space:pre-wrap">'+escapeHtml(error&&error.message?error.message:error)+'</pre></main>';
  }
})();