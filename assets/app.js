(function(){
  'use strict';

  var STORAGE_KEY='semideuses.characters.v1';
  var app=document.getElementById('app');
  var state={section:'inicio',screen:'list',editing:null,characters:loadCharacters(),message:''};

  var sections=[
    {id:'inicio',label:'Início',icon:'⌂'},
    {id:'jogador',label:'Jogador',icon:'♙'},
    {id:'mestre',label:'Mestre',icon:'⚑'},
    {id:'compendio',label:'Compêndio',icon:'☷'}
  ];

  var modules={
    jogador:[
      {id:'personagens',icon:'♙',title:'Personagens',text:'Criar, editar, duplicar e salvar fichas.',status:'Ativo'},
      {id:'progressao',icon:'↟',title:'Progressão',text:'Subida de nível e escolhas automáticas.',status:'Preparado'},
      {id:'combate',icon:'⚔',title:'Modo combate',text:'PV, MP, condições, ataques e recursos.',status:'Preparado'}
    ],
    mestre:[
      {id:'campanhas',icon:'⚑',title:'Campanhas',text:'Sessões, jogadores e anotações.',status:'Preparado'},
      {id:'encontros',icon:'♜',title:'Encontros',text:'Iniciativa, criaturas e dificuldade.',status:'Preparado'},
      {id:'profecias',icon:'✦',title:'Profecias',text:'Criação e acompanhamento de profecias.',status:'Preparado'}
    ],
    compendio:[
      {id:'filiacoes',icon:'Ω',title:'Filiações',text:'Os 26 deuses e suas progressões.',status:'Banco vazio'},
      {id:'caminhos',icon:'❖',title:'Caminhos Divinos',text:'Caminhos vinculados a cada Filiação.',status:'Banco vazio'},
      {id:'regras',icon:'☷',title:'Regras e Bestiário',text:'Livros do Jogador e do Mestre.',status:'Banco vazio'}
    ]
  };

  function escapeHtml(value){
    return String(value==null?'':value).replace(/[&<>'\"]/g,function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[character];
    });
  }

  function uid(){return 'char-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);}

  function emptyCharacter(){
    return {id:uid(),name:'Novo Herói',player:'',level:1,origin:'',background:'',affiliation:'',divinePath:'',notes:'',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),rules:{version:1,attributes:{FOR:10,DES:10,CON:10,INT:10,SAB:10,CAR:10},skills:[],features:[],inventory:[]}};
  }

  function loadCharacters(){
    try{var data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(data)?data:[];}catch(error){return [];}
  }

  function saveCharacters(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.characters));}
  function activeSection(){return sections.find(function(item){return item.id===state.section;})||sections[0];}

  function homeView(){
    return '<section class="hero"><span class="eyebrow">FUNDAÇÃO VALIDADA</span><h2>O universo de Semideuses pronto para crescer.</h2><p>O primeiro módulo funcional já está disponível. As fichas ficam salvas somente neste aparelho.</p></section>'+
    '<section class="dashboard-grid"><button class="stat-card" data-open-characters><strong>'+state.characters.length+'</strong><span>Personagens</span></button><article class="stat-card"><strong>0</strong><span>Campanhas</span></article><article class="stat-card"><strong>2</strong><span>Livros-base</span></article></section>'+
    '<section class="grid">'+sections.slice(1).map(function(item){return '<button class="card action" data-go="'+item.id+'"><span class="card-icon">'+item.icon+'</span><strong>'+escapeHtml(item.label)+'</strong><small>Abrir módulo</small></button>';}).join('')+'</section>'+
    '<section class="panel"><span class="status ready">Etapa concluída</span><h3>Gerenciamento de personagens</h3><ul><li>Criar e editar fichas básicas</li><li>Duplicar e excluir personagens</li><li>Salvar automaticamente no navegador</li><li>Modelo preparado para regras automáticas</li></ul></section>';
  }

  function moduleView(section){
    var list=modules[section.id]||[];
    return '<section class="hero"><span class="eyebrow">MÓDULO '+escapeHtml(section.label.toUpperCase())+'</span><h2>'+escapeHtml(section.label)+'</h2><p>'+description(section.id)+'</p></section>'+
      '<section class="module-list">'+list.map(function(item){return '<button class="module-row" data-module="'+escapeHtml(item.id)+'"><span class="icon">'+item.icon+'</span><span><strong>'+escapeHtml(item.title)+'</strong><small>'+escapeHtml(item.text)+'</small></span><span class="status '+(item.status==='Ativo'?'ready':'')+'">'+escapeHtml(item.status)+'</span></button>';}).join('')+'</section>'+
      '<section class="panel"><h3>Preparação técnica</h3><p>'+technicalNote(section.id)+'</p></section>';
  }

  function charactersView(){
    if(state.screen==='edit'&&state.editing){return characterEditorView();}
    return '<section class="section-heading"><div><span class="eyebrow">MÓDULO JOGADOR</span><h2>Personagens</h2><p>Fichas salvas neste aparelho.</p></div><button class="primary" data-new-character>+ Nova ficha</button></section>'+
      (state.characters.length===0?'<section class="panel empty"><span class="large-icon">♙</span><h2>Nenhuma ficha criada</h2><p>Crie seu primeiro personagem para testar o armazenamento local.</p><button class="primary" data-new-character>Criar personagem</button></section>':'<section class="character-list">'+state.characters.map(characterCard).join('')+'</section>')+
      '<section class="panel compact"><h3>Como funciona agora</h3><p>Os dados são armazenados no navegador. Na próxima etapa adicionaremos exportação, importação e cálculos automáticos.</p></section>';
  }

  function characterCard(character){
    var initial=(character.name||'?').trim().charAt(0).toUpperCase()||'?';
    return '<article class="character-card"><button class="character-main" data-edit-character="'+character.id+'"><span class="avatar">'+escapeHtml(initial)+'</span><span><strong>'+escapeHtml(character.name||'Sem nome')+'</strong><small>Nível '+Number(character.level||1)+(character.affiliation?' · '+escapeHtml(character.affiliation):'')+'</small></span></button><div class="card-actions"><button data-duplicate-character="'+character.id+'">Duplicar</button><button class="danger" data-delete-character="'+character.id+'">Excluir</button></div></article>';
  }

  function characterEditorView(){
    var c=state.editing;
    return '<section class="section-heading"><div><span class="eyebrow">EDITOR DE FICHA</span><h2>'+escapeHtml(c.name||'Novo Herói')+'</h2><p>Campos básicos da estrutura oficial.</p></div><button class="secondary" data-cancel-edit>Voltar</button></section>'+
      '<form class="panel form-panel" id="character-form"><div class="form-grid">'+field('name','Nome do herói',c.name,'text',true)+field('player','Jogador',c.player,'text',false)+field('level','Nível',c.level,'number',true)+field('origin','Origem / Raça',c.origin,'text',false)+field('background','Antecedente',c.background,'text',false)+field('affiliation','Filiação',c.affiliation,'text',false)+field('divinePath','Caminho Divino',c.divinePath,'text',false)+'</div><label class="full-field"><span>Notas</span><textarea name="notes" rows="7" placeholder="História, poderes, itens e observações...">'+escapeHtml(c.notes)+'</textarea></label><div class="prepared-block"><strong>Estrutura já reservada</strong><p>Atributos, perícias, habilidades, inventário e progressão já existem no modelo interno da ficha e serão ativados nas próximas etapas.</p></div><div class="editor-actions"><button type="button" class="secondary" data-cancel-edit>Cancelar</button><button type="submit" class="primary">Salvar ficha</button></div></form>';
  }

  function field(name,label,value,type,required){return '<label><span>'+escapeHtml(label)+'</span><input name="'+name+'" type="'+type+'" value="'+escapeHtml(value)+'" '+(type==='number'?'min="1" max="20" inputmode="numeric" ':'')+(required?'required ':'')+'/></label>';}
  function description(id){if(id==='jogador')return 'Fichas, progressão, poderes, inventário e recursos do personagem.';if(id==='mestre')return 'Campanhas, encontros, criaturas, profecias e ferramentas de sessão.';return 'Banco oficial das regras dos Livros do Jogador e do Mestre.';}
  function technicalNote(id){if(id==='jogador')return 'O módulo Personagens já está ativo. Progressão e combate serão conectados ao mesmo modelo de ficha.';if(id==='mestre')return 'A área será ligada futuramente às campanhas e ao Bestiário sem misturar dados do jogador.';return 'As regras serão carregadas de arquivos separados por categoria, permitindo atualização sem reescrever a interface.';}

  function showMessage(message){state.message=message;render();window.setTimeout(function(){if(state.message===message){state.message='';render();}},2200);}

  function render(){
    var active=activeSection();
    var inCharacters=state.screen==='characters'||state.screen==='edit';
    var content=inCharacters?charactersView():(state.section==='inicio'?homeView():moduleView(active));
    var title=inCharacters?'Personagens':active.label;
    app.innerHTML='<div class="app-shell"><header class="topbar"><div><span class="eyebrow">SEMIDEUSES RPG 3E</span><h1>'+escapeHtml(title)+'</h1></div><div class="brand-mark">S3</div></header>'+(state.message?'<button class="toast" data-dismiss-message>'+escapeHtml(state.message)+'</button>':'')+'<main class="content">'+content+'</main>'+bottomNav(inCharacters)+'</div>';
    bindEvents();
  }

  function bottomNav(inCharacters){
    return '<nav class="bottom-nav" aria-label="Navegação principal">'+sections.map(function(item){return '<button data-go="'+item.id+'" class="'+(!inCharacters&&state.section===item.id?'active':'')+'"><span>'+item.icon+'</span><small>'+escapeHtml(item.label)+'</small></button>';}).join('')+'</nav>';
  }

  function openCharacters(){state.section='jogador';state.screen='characters';state.editing=null;render();window.scrollTo(0,0);}

  function bindEvents(){
    document.querySelectorAll('[data-go]').forEach(function(button){button.addEventListener('click',function(){state.section=button.getAttribute('data-go')||'inicio';state.screen='list';state.editing=null;render();window.scrollTo(0,0);});});
    document.querySelectorAll('[data-open-characters]').forEach(function(button){button.addEventListener('click',openCharacters);});
    document.querySelectorAll('[data-module]').forEach(function(button){button.addEventListener('click',function(){if(button.getAttribute('data-module')==='personagens'){openCharacters();}else{alert('Este módulo será ativado em uma etapa futura.');}});});
    document.querySelectorAll('[data-new-character]').forEach(function(button){button.addEventListener('click',function(){state.section='jogador';state.editing=emptyCharacter();state.screen='edit';render();window.scrollTo(0,0);});});
    document.querySelectorAll('[data-edit-character]').forEach(function(button){button.addEventListener('click',function(){var found=state.characters.find(function(c){return c.id===button.getAttribute('data-edit-character');});if(found){state.editing=JSON.parse(JSON.stringify(found));state.screen='edit';render();window.scrollTo(0,0);}});});
    document.querySelectorAll('[data-duplicate-character]').forEach(function(button){button.addEventListener('click',function(){var found=state.characters.find(function(c){return c.id===button.getAttribute('data-duplicate-character');});if(!found)return;var copy=JSON.parse(JSON.stringify(found));copy.id=uid();copy.name=(copy.name||'Personagem')+' — cópia';copy.createdAt=new Date().toISOString();copy.updatedAt=copy.createdAt;state.characters.unshift(copy);saveCharacters();showMessage('Ficha duplicada.');});});
    document.querySelectorAll('[data-delete-character]').forEach(function(button){button.addEventListener('click',function(){var id=button.getAttribute('data-delete-character');var found=state.characters.find(function(c){return c.id===id;});if(found&&confirm('Excluir a ficha de '+found.name+'?')){state.characters=state.characters.filter(function(c){return c.id!==id;});saveCharacters();showMessage('Ficha excluída.');}});});
    document.querySelectorAll('[data-cancel-edit]').forEach(function(button){button.addEventListener('click',function(){state.editing=null;state.screen='characters';render();window.scrollTo(0,0);});});
    var form=document.getElementById('character-form');
    if(form){form.addEventListener('submit',function(event){event.preventDefault();var data=new FormData(form);var character=state.editing||emptyCharacter();character.name=String(data.get('name')||'Sem nome').trim()||'Sem nome';character.player=String(data.get('player')||'').trim();character.level=Math.max(1,Math.min(20,Number(data.get('level')||1)));character.origin=String(data.get('origin')||'').trim();character.background=String(data.get('background')||'').trim();character.affiliation=String(data.get('affiliation')||'').trim();character.divinePath=String(data.get('divinePath')||'').trim();character.notes=String(data.get('notes')||'');character.updatedAt=new Date().toISOString();var index=state.characters.findIndex(function(c){return c.id===character.id;});if(index>=0){state.characters[index]=character;}else{state.characters.unshift(character);}saveCharacters();state.editing=null;state.screen='characters';showMessage('Ficha salva neste aparelho.');});}
    var dismiss=document.querySelector('[data-dismiss-message]');if(dismiss){dismiss.addEventListener('click',function(){state.message='';render();});}
  }

  try{render();}catch(error){app.innerHTML='<main style="padding:24px;font-family:system-ui"><h1>Falha ao iniciar</h1><pre style="white-space:pre-wrap">'+escapeHtml(error&&error.message?error.message:error)+'</pre></main>';}
})();