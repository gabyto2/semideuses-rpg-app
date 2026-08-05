(function(){
'use strict';
var app=document.getElementById('app');
var Service=window.SemideusesCharacterService;
var Model=window.SemideusesCharacter;
var Rules=window.SemideusesRules;
if(!Service||!Model||!Rules)throw new Error('Núcleo do aplicativo não carregado.');

var attrs=Model.attributes.slice();
var conditions=Model.conditions.slice();
var sections=[
  {id:'inicio',label:'Início',icon:'⌂'},
  {id:'jogador',label:'Jogador',icon:'♙'},
  {id:'mestre',label:'Mestre',icon:'⚑'},
  {id:'compendio',label:'Compêndio',icon:'☷'}
];
var affiliations=['Zeus','Poseidon','Hades','Atena','Ares','Apolo','Hermes','Hefesto','Afrodite','Deméter','Dionísio','Ártemis','Hécate','Íris','Hipnos','Morfeu','Tique','Éolo','Circe','Eros','Nyx','Nêmesis','Nike','Tânatos','Perséfone','Hebe'];
var info={
  'Zeus':{icon:'⚡',domain:'Céu, trovão e autoridade.'},
  'Poseidon':{icon:'🔱',domain:'Mar, terremotos e cavalos.'},
  'Hades':{icon:'♜',domain:'Submundo, mortos e riquezas.'},
  'Atena':{icon:'🦉',domain:'Sabedoria, estratégia e guerra justa.'},
  'Ares':{icon:'🪖',domain:'Guerra, coragem e violência.'},
  'Apolo':{icon:'☀',domain:'Sol, música, cura e profecia.'},
  'Hermes':{icon:'⚕',domain:'Viagens, comércio e astúcia.'},
  'Hefesto':{icon:'⚒',domain:'Forja, fogo, metal e invenção.'},
  'Afrodite':{icon:'♀',domain:'Amor, beleza e desejo.'},
  'Deméter':{icon:'🌾',domain:'Colheita, natureza e estações.',paths:['Caminho da Colheita','Caminho das Estações','Caminho da Terra']},
  'Dionísio':{icon:'🍇',domain:'Vinho, êxtase, teatro e loucura.'},
  'Ártemis':{icon:'🏹',domain:'Caça, lua e natureza selvagem.'},
  'Hécate':{icon:'☾☽☾',domain:'Magia, encruzilhadas e noite.'},
  'Íris':{icon:'🌈',domain:'Arco-íris, mensagens e caminhos.'},
  'Hipnos':{icon:'🪶',domain:'Sono, repouso e esquecimento.'},
  'Morfeu':{icon:'☁',domain:'Sonhos, formas e visões.'},
  'Tique':{icon:'🎲',domain:'Sorte, acaso e oportunidade.'},
  'Éolo':{icon:'🌀',domain:'Ventos, correntes e tempestades.'},
  'Circe':{icon:'⚗',domain:'Feitiçaria, transformação e poções.'},
  'Eros':{icon:'🏹♥',domain:'Desejo, atração e vínculos.'},
  'Nyx':{icon:'✦',domain:'Noite primordial e estrelas.'},
  'Nêmesis':{icon:'⚖',domain:'Retribuição, equilíbrio e justiça.'},
  'Nike':{icon:'🪽',domain:'Vitória, glória e competição.'},
  'Tânatos':{icon:'🕯',domain:'Morte serena e passagem.'},
  'Perséfone':{icon:'🌺',domain:'Primavera, submundo e renovação.'},
  'Hebe':{icon:'🏺',domain:'Juventude, vitalidade e renovação.'}
};
var backgrounds=['Atleta','Órfão de Rua','Estudante Prodígio','Filho de Família Rica','Imigrante','Artista','Criminoso','Criança Soldado','Culto Familiar','Sobrevivente'];
var marks=[
  {name:'Ataque Extra',text:'Ao usar a ação Atacar, realiza dois ataques com arma em vez de um.'},
  {name:'Bônus de Conjuração',text:'Reduz em 1 MP o custo de Rank C e permite combinar uma habilidade Rank E com sua ação de conjuração, pagando o custo.'}
];
var steps=['Conceito','Identidade','Natureza','Filiação','Atributos','Antecedente','Caminho','Marca','Revisão'];

var state={
  section:'inicio',screen:'home',step:0,editing:null,
  characters:Service.list(),message:'',controlAmounts:{pv:5,mp:3}
};
try{
  var storedAmounts=JSON.parse(sessionStorage.getItem('semideuses.controlAmounts')||'{}');
  if(Number(storedAmounts.pv)>0)state.controlAmounts.pv=Number(storedAmounts.pv);
  if(Number(storedAmounts.mp)>0)state.controlAmounts.mp=Number(storedAmounts.mp);
}catch(error){}

function esc(v){return String(v==null?'':v).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c];});}
function clone(v){return Model.clone(v);}
function signed(v){return Number(v)>=0?'+'+Number(v):String(Number(v));}
function refreshCharacters(){state.characters=Service.list();}
function recalc(){if(state.editing)state.editing=Model.calculate(state.editing);}
function updateEditing(saved){state.editing=clone(saved);refreshCharacters();}
function persistAmounts(){try{sessionStorage.setItem('semideuses.controlAmounts',JSON.stringify(state.controlAmounts));}catch(error){}}
function renderAndTop(){render();requestAnimationFrame(function(){window.scrollTo(0,0);});}
function msg(text){state.message=text;render();setTimeout(function(){if(state.message===text){state.message='';render();}},1800);}
function setText(selector,text){var element=document.querySelector(selector);if(element)element.textContent=text;}
function refreshResourceDom(saved){
  updateEditing(saved);
  var c=state.editing;
  setText('[data-resource-display="pv"]',c.resources.pvCurrent+' / '+c.rules.pvMax);
  setText('[data-resource-display="mp"]',c.resources.mpCurrent+' / '+c.rules.mpMax);
  setText('[data-extra-display="tempHp"]',String(c.resources.tempHp));
  setText('[data-extra-display="hitDice"]',c.resources.hitDiceCurrent+' / '+c.resources.hitDiceMax+' d'+c.rules.hitDie);
  setText('[data-extra-display="condition"]',c.resources.condition);
  document.querySelectorAll('[data-skill-use]').forEach(function(button){
    var skill=(c.skills||[]).find(function(item){return item.id===button.dataset.skillUse;});
    button.disabled=!!skill&&c.resources.mpCurrent<Number(skill.cost||0);
  });
}
function applyAttributeCreation(payload){
  if(!state.editing||!payload||!payload.values)return false;
  attrs.forEach(function(attribute){
    var value=Number(payload.values[attribute]);
    if(Number.isFinite(value))state.editing.attributes[attribute]=Math.max(1,Math.min(30,value));
  });
  state.editing.attributeCreation={
    method:payload.method||'standard',base:clone(payload.base||{}),
    originBonus:clone(payload.originBonus||{}),milestones:clone(payload.milestones||{}),
    bonusesAlreadyIncluded:!!payload.bonusesAlreadyIncluded
  };
  recalc();
  return true;
}

function home(){
  refreshCharacters();var last=state.characters[0];
  return '<section class="hero"><span class="eyebrow">SEMIDEUSES RPG 3E</span><h2>Seu universo mítico em um só lugar.</h2><p>Crie personagens, acompanhe recursos e consulte as regras do sistema.</p></section>'+
    (last?'<section class="panel continue-card"><span class="status ready">Continuar</span><h3>'+esc(last.name||'Personagem')+'</h3><p>Nível '+last.level+' · '+esc(last.affiliation||'Sem Filiação')+' · PV '+last.resources.pvCurrent+'/'+last.rules.pvMax+' · MP '+last.resources.mpCurrent+'/'+last.rules.mpMax+'</p><button class="primary" data-open-sheet="'+last.id+'">Abrir ficha</button></section>':'<section class="panel empty"><span class="large-icon">♙</span><h2>Crie seu primeiro personagem</h2><p>O assistente explica cada escolha passo a passo.</p><button class="primary" data-new>Começar criação</button></section>')+
    '<section class="grid">'+sections.slice(1).map(function(s){return '<button class="card action" data-go="'+s.id+'"><span class="card-icon">'+s.icon+'</span><strong>'+s.label+'</strong><small>Abrir módulo</small></button>';}).join('')+'</section>';
}
function moduleView(){if(state.section==='jogador')return '<section class="hero"><span class="eyebrow">MÓDULO JOGADOR</span><h2>Jogador</h2><p>Criação, fichas, progressão e combate.</p></section><section class="module-list"><button class="module-row" data-open-characters><span class="icon">♙</span><span><strong>Personagens</strong><small>Criar, editar e usar fichas.</small></span><span class="status ready">Ativo</span></button></section>';return '<section class="panel empty"><span class="large-icon">'+(state.section==='mestre'?'⚑':'☷')+'</span><h2>'+esc(state.section==='mestre'?'Mestre':'Compêndio')+'</h2><p>Este módulo continuará sendo desenvolvido após a estabilização da criação.</p></section>';}
function listView(){refreshCharacters();return '<section class="section-heading"><div><span class="eyebrow">MÓDULO JOGADOR</span><h2>Personagens</h2><p>Fichas salvas neste aparelho.</p></div><button class="primary" data-new>+ Nova ficha</button></section>'+(state.characters.length?'<section class="character-list">'+state.characters.map(card).join('')+'</section>':'<section class="panel empty"><span class="large-icon">♙</span><h2>Nenhuma ficha</h2><button class="primary" data-new>Criar personagem</button></section>');}
function card(c){var icon=(info[c.affiliation]||{}).icon||(c.name||'?').charAt(0).toUpperCase();return '<article class="character-card"><button class="character-main" data-open-sheet="'+c.id+'"><span class="avatar">'+esc(icon)+'</span><span><strong>'+esc(c.name||'Sem nome')+'</strong><small>Nível '+c.level+' · '+esc(c.affiliation||'Sem Filiação')+' · PV '+c.resources.pvCurrent+'/'+c.rules.pvMax+' · MP '+c.resources.mpCurrent+'/'+c.rules.mpMax+'</small></span></button><div class="card-actions"><button data-edit="'+c.id+'">Editar</button><button data-copy="'+c.id+'">Duplicar</button><button class="danger" data-del="'+c.id+'">Excluir</button></div></article>';}
function wizard(){return '<section class="wizard-head"><button class="secondary compact-btn" data-cancel>Fechar</button><div><span class="eyebrow">CRIAÇÃO GUIADA</span><h2>'+steps[state.step]+'</h2><small>Passo '+(state.step+1)+' de '+steps.length+'</small></div></section><div class="progress"><span style="width:'+((state.step+1)/steps.length*100)+'%"></span></div><section class="panel wizard-card">'+stepView()+'</section><div class="wizard-actions">'+(state.step?'<button class="secondary" data-prev>Voltar</button>':'<span></span>')+(state.step===steps.length-1?'<button class="primary" data-save>Salvar ficha</button>':'<button class="primary" data-next>Próximo</button>')+'</div>';}
function field(name,label,value,type,placeholder){return '<label class="identity-field"><span>'+label+'</span><input data-field="'+name+'" type="'+type+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'"></label>';}
function stepView(){
  var c=state.editing;
  if(state.step===0)return '<span class="step-icon">✦</span><h3>Conceito do personagem <small class="optional">opcional</small></h3><p>Esta etapa resume quem o personagem é antes dos números. Uma frase já é suficiente.</p><div class="prompt-list"><small>Quem ele era antes do mundo mítico?</small><small>Qual sua principal qualidade ou dificuldade?</small><small>O que deseja alcançar?</small></div><label class="full-field"><span>Resumo do conceito</span><textarea data-field="concept" rows="6" placeholder="Ex.: Uma atleta protetora que teme decepcionar a própria mãe divina.">'+esc(c.concept)+'</textarea></label><button class="text-button" data-skip-concept>Pular por enquanto</button>';
  if(state.step===1)return '<div class="identity-hero"><div class="portrait-placeholder">'+esc((c.name||'?').charAt(0).toUpperCase())+'</div><div><h3>Identidade do herói</h3><p>Dados principais usados no cabeçalho e na apresentação da ficha.</p></div></div><div class="form-grid">'+field('name','Nome do personagem',c.name,'text','Helena Demétrio')+field('player','Nome do jogador',c.player,'text','Quem controla a ficha')+field('age','Idade',c.age,'number','17')+'</div><label class="full-field"><span>Aparência ou detalhe marcante</span><textarea data-field="appearance" rows="4" placeholder="Cabelos, roupas, cicatriz, postura ou outro detalhe visual.">'+esc(c.appearance)+'</textarea></label><div class="level-control"><span>Nível do personagem</span><button data-level-delta="-1">−</button><strong data-level-display>'+c.level+'</strong><button data-level-delta="1">+</button><input data-field="level" type="number" min="1" max="20" value="'+c.level+'"></div><div class="coming">Caminho libera no nível 3. Marca do Herói libera no nível 5.</div>';
  if(state.step===2)return '<span class="step-icon">⚜</span><h3>Natureza do herói</h3><p>A Natureza define a origem sobrenatural e quais estruturas de regras o personagem utiliza.</p><button class="choice selected"><strong>Semideus Grego</strong><small>Filho de mortal e divindade. Usa Filiação, Mana, Caminho Divino e Marca do Herói.</small></button><div class="coming">Outras Naturezas serão adicionadas quando suas regras estiverem catalogadas.</div>';
  if(state.step===3)return '<h3>Escolha a Filiação</h3><div class="choice-grid">'+affiliations.map(function(n){var d=info[n];return '<button class="choice '+(c.affiliation===n?'selected':'')+'" data-aff="'+n+'"><span class="choice-icon">'+esc(d.icon)+'</span><strong>'+n+'</strong><small>'+esc(d.domain)+'</small></button>';}).join('')+'</div>';
  if(state.step===4)return '<h3>Atributos</h3><p>O modificador é calculado automaticamente.</p><div class="attribute-grid">'+attrs.map(function(a){return '<label><span>'+a+'</span><small>Valor</small><input data-attr="'+a+'" type="number" min="1" max="30" value="'+c.attributes[a]+'"><small>Modificador</small><b data-mod="'+a+'">'+signed(Rules.modifier(c.attributes[a]))+'</b></label>';}).join('')+'</div>';
  if(state.step===5)return '<h3>Antecedente</h3><div class="choice-list">'+backgrounds.map(function(b){return '<button class="choice '+(c.background===b?'selected':'')+'" data-bg="'+b+'"><strong>'+b+'</strong><small>Descrição completa será ligada ao banco oficial.</small></button>';}).join('')+'</div>';
  if(state.step===6){if(c.level<3)return '<span class="step-icon">🔒</span><h3>Caminho ainda não liberado</h3><p>Esta escolha aparece no nível 3.</p>';var paths=(c.rules&&Array.isArray(c.rules.paths)&&c.rules.paths.length?c.rules.paths.map(function(p){return p.name;}):(info[c.affiliation]||{}).paths)||[];return '<h3>Caminho Divino</h3>'+(paths.length?'<div class="choice-list">'+paths.map(function(p){return '<button class="choice '+(c.divinePath===p?'selected':'')+'" data-path="'+p+'"><strong>'+p+'</strong></button>';}).join('')+'</div>':'<div class="coming">Caminhos em catalogação.</div>');}
  if(state.step===7){if(c.level<5)return '<span class="step-icon">🔒</span><h3>Marca ainda não liberada</h3><p>Esta escolha aparece no nível 5.</p>';return '<h3>Marca do Herói</h3><div class="choice-list">'+marks.map(function(m){return '<button class="choice '+(c.heroMark===m.name?'selected':'')+'" data-mark="'+m.name+'"><strong>'+m.name+'</strong><small>'+m.text+'</small></button>';}).join('')+'</div>';}
  recalc();return '<h3>Revisão</h3><div class="review-grid"><div><span>Herói</span><strong>'+esc(c.name||'Sem nome')+'</strong></div><div><span>Nível</span><strong>'+c.level+'</strong></div><div><span>Filiação</span><strong>'+esc(c.affiliation||'—')+'</strong></div><div><span>Antecedente</span><strong>'+esc(c.background||'—')+'</strong></div><div><span>Caminho</span><strong>'+esc(c.divinePath||'Ainda não definido')+'</strong></div><div><span>Marca</span><strong>'+esc(c.heroMark||'Ainda não definida')+'</strong></div><div><span>PV máximo</span><strong>'+c.rules.pvMax+'</strong></div><div><span>MP máximo</span><strong>'+c.rules.mpMax+'</strong></div></div><h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(a){return '<div><span>'+a+'</span><strong>'+c.attributes[a]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[a]))+'</b></div>';}).join('')+'</div>';
}
function extraResources(c){return '<section class="panel"><h3>Recursos adicionais</h3><div class="sheet-extra-grid"><article class="sheet-extra-card"><span>PV temporários</span><strong data-extra-display="tempHp">'+c.resources.tempHp+'</strong><div class="mini-adjust"><button data-extra-resource="tempHp" data-delta="-1">−1</button><button data-extra-resource="tempHp" data-delta="1">+1</button></div></article><article class="sheet-extra-card"><span>Dados de Vida</span><strong data-extra-display="hitDice">'+c.resources.hitDiceCurrent+' / '+c.resources.hitDiceMax+' d'+c.rules.hitDie+'</strong><div class="mini-adjust"><button data-extra-resource="hitDice" data-delta="-1">Usar 1</button><button data-extra-resource="hitDice" data-delta="1">Recuperar 1</button></div></article><article class="sheet-extra-card"><span>Condição atual</span><strong data-extra-display="condition">'+esc(c.resources.condition)+'</strong><select class="condition-select" data-condition>'+conditions.map(function(name){return '<option value="'+esc(name)+'" '+(name===c.resources.condition?'selected':'')+'>'+esc(name)+'</option>';}).join('')+'</select></article></div><p class="sheet-note">Ao receber dano, os PV temporários são consumidos antes dos PV atuais.</p></section>';}
function savesPanel(c){var bonus=c.rules.proficiency;var official=Array.isArray(c.officialSaveProficiencies)?c.officialSaveProficiencies:[];return '<section class="panel"><div class="proficiency-banner"><span>Bônus de Proficiência</span><strong>+'+bonus+'</strong></div><h3>Testes de Resistência</h3><div class="save-grid">'+attrs.map(function(a){var officialProficiency=official.indexOf(a)>=0;var trained=officialProficiency||c.saveProficiencies.indexOf(a)>=0;var base=Rules.modifier(c.attributes[a]);var total=base+(trained?bonus:0);return '<article class="save-card '+(trained?'proficient':'')+'"><span>'+a+'</span><strong>'+signed(total)+'</strong><small>'+signed(base)+' atributo'+(trained?' + '+bonus+' proficiência':'')+'</small>'+(officialProficiency?'<span class="save-toggle">● Filiação</span>':'<button class="save-toggle" data-save-prof="'+a+'">'+(trained?'● Proficiente':'○ Marcar proficiência')+'</button>')+'</article>';}).join('')+'</div><p class="sheet-note">Proficiências da Filiação são aplicadas automaticamente. As demais podem vir de talentos, itens ou decisões do Mestre.</p></section>';}
function skillsPanel(c){var mp=c.resources.mpCurrent,skills=c.skills||[];return '<section class="panel"><div class="section-heading"><div><h3>Skills e habilidades</h3><p>O custo fixo é descontado automaticamente do MP atual.</p></div></div>'+(skills.length?'<div class="skill-list">'+skills.map(function(s){return '<article class="skill-row"><div><strong>'+esc(s.name||'Habilidade')+'</strong><small>Custo fixo: '+s.cost+' MP</small></div><button class="primary" data-skill-use="'+s.id+'" '+(mp<s.cost?'disabled':'')+'>Usar</button><button class="danger-link" data-skill-delete="'+s.id+'">Excluir</button></article>';}).join('')+'</div>':'<div class="coming">Nenhuma Skill cadastrada.</div>')+'<div class="inline-form"><input id="skill-name" placeholder="Nome da Skill ou habilidade" autocomplete="off"><input id="skill-cost" type="number" min="0" value="1" inputmode="numeric"><button class="secondary" data-skill-add>Adicionar Skill</button></div></section>';}
function sheet(){var c=state.editing;recalc();return '<section class="section-heading"><div><span class="eyebrow">FICHA PRONTA</span><h2>'+esc(c.name||'Sem nome')+'</h2><p>Nível '+c.level+' · '+esc(c.affiliation||'Sem Filiação')+'</p></div><button class="secondary" data-back-list>Voltar</button></section><section class="resource-grid"><article class="resource-card pv"><span>PV atual</span><strong data-resource-display="pv">'+c.resources.pvCurrent+' / '+c.rules.pvMax+'</strong><div class="adjust-row"><button data-adjust="pv" data-delta="-1">−1</button><button data-adjust="pv" data-delta="1">+1</button><input data-amount="pv" type="number" min="1" value="'+state.controlAmounts.pv+'"><button data-apply="pv" data-mode="lose">Dano</button><button data-apply="pv" data-mode="gain">Curar</button></div></article><article class="resource-card mp"><span>MP atual</span><strong data-resource-display="mp">'+c.resources.mpCurrent+' / '+c.rules.mpMax+'</strong><div class="adjust-row"><button data-adjust="mp" data-delta="-1">−1</button><button data-adjust="mp" data-delta="1">+1</button><input data-amount="mp" type="number" min="1" value="'+state.controlAmounts.mp+'"><button data-apply="mp" data-mode="lose">Gastar</button><button data-apply="mp" data-mode="gain">Restaurar</button></div></article></section>'+extraResources(c)+'<section class="panel"><h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(a){return '<div><span>'+a+'</span><strong>'+c.attributes[a]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[a]))+'</b></div>';}).join('')+'</div></section>'+savesPanel(c)+skillsPanel(c)+'<section class="panel"><h3>Identidade</h3><p><strong>Jogador:</strong> '+esc(c.player||'—')+'<br><strong>Idade:</strong> '+esc(c.age||'—')+'<br><strong>Aparência:</strong> '+esc(c.appearance||'—')+'</p></section><section class="panel"><h3>Progressão</h3><p><strong>Caminho:</strong> '+esc(c.level>=3?(c.divinePath||'Escolha pendente'):'Libera no nível 3')+'<br><strong>Marca:</strong> '+esc(c.level>=5?(c.heroMark||'Escolha pendente'):'Libera no nível 5')+'</p><button class="primary" data-edit-current>Editar personagem</button></section>';}
function nav(){return '<nav class="bottom-nav">'+sections.map(function(s){return '<button data-go="'+s.id+'" class="'+(state.screen==='home'&&state.section===s.id?'active':'')+'"><span>'+s.icon+'</span><small>'+s.label+'</small></button>';}).join('')+'</nav>';}
function render(){var content=state.screen==='wizard'?wizard():state.screen==='characters'?listView():state.screen==='sheet'?sheet():state.section==='inicio'?home():moduleView();var selected=sections.find(function(s){return s.id===state.section;})||sections[0];var title=state.screen==='wizard'?'Criação':state.screen==='characters'?'Personagens':state.screen==='sheet'?'Ficha':selected.label;app.innerHTML='<div class="app-shell"><header class="topbar"><div><span class="eyebrow">SEMIDEUSES RPG 3E</span><h1>'+title+'</h1></div><div class="brand-mark">S3</div></header>'+(state.message?'<div class="toast">'+esc(state.message)+'</div>':'')+'<main class="content">'+content+'</main>'+nav()+'</div>';bind();}
function bind(){
  document.querySelectorAll('[data-go]').forEach(function(b){b.onclick=function(){state.section=b.dataset.go;state.screen='home';state.editing=null;renderAndTop();};});
  document.querySelectorAll('[data-open-characters]').forEach(function(b){b.onclick=function(){state.section='jogador';state.screen='characters';renderAndTop();};});
  document.querySelectorAll('[data-new]').forEach(function(b){b.onclick=function(){state.editing=Model.create();state.step=0;state.screen='wizard';renderAndTop();};});
  document.querySelectorAll('[data-open-sheet]').forEach(function(b){b.onclick=function(){var c=Service.get(b.dataset.openSheet);if(c){state.editing=c;state.screen='sheet';renderAndTop();}};});
  document.querySelectorAll('[data-edit]').forEach(function(b){b.onclick=function(){var c=Service.get(b.dataset.edit);if(c){state.editing=c;state.step=0;state.screen='wizard';renderAndTop();}};});
  document.querySelectorAll('[data-copy]').forEach(function(b){b.onclick=function(){try{Service.duplicate(b.dataset.copy);refreshCharacters();msg('Ficha duplicada.');}catch(e){alert(e.message);}};});
  document.querySelectorAll('[data-del]').forEach(function(b){b.onclick=function(){if(confirm('Excluir esta ficha?')){Service.remove(b.dataset.del);refreshCharacters();msg('Ficha excluída.');}};});
  document.querySelectorAll('[data-field]').forEach(function(el){el.oninput=function(){var k=el.dataset.field;if(k==='level'){state.editing.level=Math.max(1,Math.min(20,Number(el.value||1)));if(state.editing.level<3)state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';var out=document.querySelector('[data-level-display]');if(out)out.textContent=state.editing.level;}else state.editing[k]=el.value;recalc();};});
  document.querySelectorAll('[data-level-delta]').forEach(function(b){b.onclick=function(){state.editing.level=Math.max(1,Math.min(20,state.editing.level+Number(b.dataset.levelDelta)));if(state.editing.level<3)state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';render();};});
  document.querySelectorAll('[data-attr]').forEach(function(el){el.oninput=function(){var a=el.dataset.attr;state.editing.attributes[a]=Math.max(1,Math.min(30,Number(el.value||10)));var out=document.querySelector('[data-mod="'+a+'"]');if(out)out.textContent=signed(Rules.modifier(state.editing.attributes[a]));recalc();};});
  document.querySelectorAll('[data-aff]').forEach(function(b){b.onclick=function(){state.editing.affiliation=b.dataset.aff;state.editing.divinePath='';recalc();render();};});
  document.querySelectorAll('[data-bg]').forEach(function(b){b.onclick=function(){state.editing.background=b.dataset.bg;render();};});
  document.querySelectorAll('[data-path]').forEach(function(b){b.onclick=function(){state.editing.divinePath=b.dataset.path;render();};});
  document.querySelectorAll('[data-mark]').forEach(function(b){b.onclick=function(){state.editing.heroMark=b.dataset.mark;render();};});
  var skip=document.querySelector('[data-skip-concept]');if(skip)skip.onclick=function(){state.step=1;renderAndTop();};
  var prev=document.querySelector('[data-prev]');if(prev)prev.onclick=function(){state.step--;renderAndTop();};
  var next=document.querySelector('[data-next]');if(next)next.onclick=function(){if(state.step===1&&!state.editing.name.trim()){alert('Informe o nome do personagem.');return;}if(state.step===3&&!state.editing.affiliation){alert('Escolha uma Filiação.');return;}if(state.step===5&&!state.editing.background){alert('Escolha um Antecedente.');return;}if(state.step===6&&state.editing.level>=3&&!state.editing.divinePath&&state.editing.rules.paths&&state.editing.rules.paths.length){alert('Escolha o Caminho Divino.');return;}if(state.step===7&&state.editing.level>=5&&!state.editing.heroMark){alert('Escolha a Marca do Herói.');return;}state.step++;renderAndTop();};
  var saveButton=document.querySelector('[data-save]');if(saveButton)saveButton.onclick=function(){try{updateEditing(Service.save(state.editing));state.screen='sheet';msg('Ficha salva neste aparelho.');}catch(e){alert('Não foi possível salvar: '+e.message);}};
  document.querySelectorAll('[data-cancel]').forEach(function(b){b.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};});
  var back=document.querySelector('[data-back-list]');if(back)back.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};
  var edit=document.querySelector('[data-edit-current]');if(edit)edit.onclick=function(){state.step=0;state.screen='wizard';renderAndTop();};
  document.querySelectorAll('[data-amount]').forEach(function(input){input.oninput=function(){var value=Math.max(1,Number(input.value||1));state.controlAmounts[input.dataset.amount]=value;persistAmounts();};});
  document.querySelectorAll('[data-adjust]').forEach(function(b){b.onclick=function(){try{refreshResourceDom(Service.adjustResource(state.editing.id,b.dataset.adjust,Number(b.dataset.delta)));}catch(e){alert(e.message);}};});
  document.querySelectorAll('[data-apply]').forEach(function(b){b.onclick=function(){var type=b.dataset.apply,input=document.querySelector('[data-amount="'+type+'"]'),amount=Math.max(0,Number(input&&input.value||0));state.controlAmounts[type]=Math.max(1,amount||1);persistAmounts();try{var saved;if(type==='pv'&&b.dataset.mode==='lose')saved=Service.applyDamage(state.editing.id,amount);else saved=Service.adjustResource(state.editing.id,type,b.dataset.mode==='lose'?-amount:amount);refreshResourceDom(saved);}catch(e){alert(e.message);}};});
  document.querySelectorAll('[data-extra-resource]').forEach(function(b){b.onclick=function(){try{refreshResourceDom(Service.adjustResource(state.editing.id,b.dataset.extraResource,Number(b.dataset.delta)));}catch(e){alert(e.message);}};});
  var condition=document.querySelector('[data-condition]');if(condition)condition.onchange=function(){try{refreshResourceDom(Service.setCondition(state.editing.id,condition.value));}catch(e){alert(e.message);}};
  document.querySelectorAll('[data-save-prof]').forEach(function(b){b.onclick=function(){try{updateEditing(Service.toggleSaveProficiency(state.editing.id,b.dataset.saveProf));render();}catch(e){alert(e.message);}};});
  var addSkill=document.querySelector('[data-skill-add]');if(addSkill)addSkill.onclick=function(){var name=document.getElementById('skill-name'),cost=document.getElementById('skill-cost'),text=String(name&&name.value||'').trim();if(!text){alert('Informe o nome da Skill ou habilidade.');if(name)name.focus();return;}try{updateEditing(Service.addSkill(state.editing.id,{name:text,cost:Math.max(0,Number(cost&&cost.value||0))}));render();}catch(e){alert(e.message);}};
  document.querySelectorAll('[data-skill-use]').forEach(function(b){b.onclick=function(){try{refreshResourceDom(Service.useSkill(state.editing.id,b.dataset.skillUse));}catch(e){alert(e.message);}};});
  document.querySelectorAll('[data-skill-delete]').forEach(function(b){b.onclick=function(){try{updateEditing(Service.removeSkill(state.editing.id,b.dataset.skillDelete));render();}catch(e){alert(e.message);}};});
}
window.SemideusesApp={getEditing:function(){return state.editing?clone(state.editing):null;},isEditingPersisted:function(){return !!(state.editing&&Service.get(state.editing.id));},applyAttributeCreation:applyAttributeCreation};
window.addEventListener('semideuses:character-updated',refreshCharacters);
window.addEventListener('semideuses:character-removed',refreshCharacters);
try{render();}catch(e){app.innerHTML='<main style="padding:24px;font-family:system-ui"><h1>Falha ao iniciar</h1><pre>'+esc(e&&e.stack||e)+'</pre></main>';}
})();