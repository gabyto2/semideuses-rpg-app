(function(){
'use strict';
var app=document.getElementById('app');
var Service=window.SemideusesCharacterService;
var Model=window.SemideusesCharacter;
var Rules=window.SemideusesRules;
var Database=window.SemideusesRulesDatabase;
var OriginCatalog=window.SemideusesOriginCatalog;
if(!Service||!Model||!Rules||!Database)throw new Error('Núcleo do aplicativo não carregado.');

var attrs=Model.attributes.slice();
var conditions=Model.conditions.slice();
var sections=[
  {id:'inicio',label:'Início',icon:'⌂'},
  {id:'jogador',label:'Jogador',icon:'♙'},
  {id:'mestre',label:'Mestre',icon:'⚑'},
  {id:'compendio',label:'Compêndio',icon:'☷'}
];
var steps=['Conceito','Identidade','Natureza','Filiação','Atributos','Antecedente','Caminho','Marca','Revisão'];

function affiliationCatalog(){return typeof Database.listCompleteAffiliations==='function'?Database.listCompleteAffiliations():[];}
function backgroundCatalog(){return typeof Database.listBackgrounds==='function'?Database.listBackgrounds():[];}
function heroMarkCatalog(){return Array.isArray(Database.heroMarks)?Database.heroMarks.slice():[];}
function originCatalog(){return OriginCatalog&&typeof OriginCatalog.list==='function'?OriginCatalog.list():[{id:'semideus-grego',name:'Semideus Grego',group:'Semideus',implemented:true,summary:'Filho de mortal e divindade do Olimpo.'}];}
function affiliationByName(name){return typeof Database.getAffiliation==='function'?Database.getAffiliation(name):null;}
function backgroundByName(name){return typeof Database.getBackground==='function'?Database.getBackground(name):null;}

var state={section:'inicio',screen:'home',step:0,editing:null,characters:Service.list(),message:'',controlAmounts:{pv:5,mp:3}};
try{
  var storedAmounts=JSON.parse(sessionStorage.getItem('semideuses.controlAmounts')||'{}');
  if(Number(storedAmounts.pv)>0)state.controlAmounts.pv=Number(storedAmounts.pv);
  if(Number(storedAmounts.mp)>0)state.controlAmounts.mp=Number(storedAmounts.mp);
}catch(error){}

function esc(value){return String(value==null?'':value).replace(/[&<>\"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char];});}
function clone(value){return Model.clone(value);}
function signed(value){return Number(value)>=0?'+'+Number(value):String(Number(value));}
function refreshCharacters(){state.characters=Service.list();}
function recalc(){if(state.editing)state.editing=Model.calculate(state.editing);}
function updateEditing(saved){state.editing=clone(saved);refreshCharacters();}
function renderAndTop(){render();requestAnimationFrame(function(){window.scrollTo(0,0);});}
function persistAmounts(){try{sessionStorage.setItem('semideuses.controlAmounts',JSON.stringify(state.controlAmounts));}catch(error){}}
function msg(text){state.message=text;render();setTimeout(function(){if(state.message===text){state.message='';render();}},1800);}
function setText(selector,text){var element=document.querySelector(selector);if(element)element.textContent=text;}
function primaryDefinition(character){return character.rules&&character.rules.primaryResource||{id:'mp',label:'MP'};}
function primaryCurrent(character){return Number(character.resources&&character.resources.primaryCurrent!=null?character.resources.primaryCurrent:character.resources.mpCurrent||0);}
function primaryMax(character){return Number(character.rules&&character.rules.primaryMax!=null?character.rules.primaryMax:character.rules.mpMax||0);}
function resourceSummary(character){var definition=primaryDefinition(character);return definition.label+' '+primaryCurrent(character)+'/'+primaryMax(character);}
function pvTone(character){
  var current=Number(character&&character.resources&&character.resources.pvCurrent||0);
  var maximum=Number(character&&character.rules&&character.rules.pvMax||0);
  var ratio=maximum>0?current/maximum:0;
  if(current<=0||ratio<=.25)return 'pv-danger';
  if(ratio<=.5)return 'pv-warning';
  return 'pv-healthy';
}
function refreshPvTone(character){
  var card=document.querySelector('.resource-card.pv');
  if(!card)return;
  ['pv-healthy','pv-warning','pv-danger'].forEach(function(name){card.classList.remove(name);});
  var tone=pvTone(character);card.classList.add(tone);
  card.dataset.pvState=tone==='pv-danger'?'crítico':tone==='pv-warning'?'atenção':'saudável';
}

function refreshResourceDom(saved){
  updateEditing(saved);
  var c=state.editing,definition=primaryDefinition(c);
  setText('[data-resource-display="pv"]',c.resources.pvCurrent+' / '+c.rules.pvMax);
  refreshPvTone(c);
  setText('[data-resource-display="mp"]',primaryCurrent(c)+' / '+primaryMax(c));
  setText('.resource-card.mp > span',definition.label+' atual');
  setText('[data-extra-display="tempHp"]',String(c.resources.tempHp));
  setText('[data-extra-display="hitDice"]',c.resources.hitDiceCurrent+' / '+c.resources.hitDiceMax+' d'+c.rules.hitDie);
  setText('[data-extra-display="condition"]',c.resources.condition);
  document.querySelectorAll('[data-skill-use]').forEach(function(button){
    var skill=(c.skills||[]).find(function(item){return item.id===button.dataset.skillUse;});
    button.disabled=!!skill&&primaryCurrent(c)<Number(skill.cost||0);
  });
}

function applyAttributeCreation(payload){
  if(!state.editing||!payload||!payload.values)return false;
  attrs.forEach(function(attribute){var value=Number(payload.values[attribute]);if(Number.isFinite(value))state.editing.attributes[attribute]=Math.max(1,Math.min(30,value));});
  state.editing.attributeCreation={method:payload.method||'standard',base:clone(payload.base||{}),originBonus:clone(payload.originBonus||{}),milestones:clone(payload.milestones||{}),bonusesAlreadyIncluded:!!payload.bonusesAlreadyIncluded};
  recalc();return true;
}

function home(){
  refreshCharacters();var last=state.characters[0];
  return '<section class="hero"><span class="eyebrow">SEMIDEUSES RPG 3E</span><h2>Seu universo mítico em um só lugar.</h2><p>Crie personagens, acompanhe recursos e consulte as regras do sistema.</p></section>'+
    (last?'<section class="panel continue-card"><span class="status ready">Continuar</span><h3>'+esc(last.name||'Personagem')+'</h3><p>Nível '+last.level+' · '+esc(last.affiliation||'Sem Filiação')+' · PV '+last.resources.pvCurrent+'/'+last.rules.pvMax+' · '+esc(resourceSummary(last))+'</p><button class="primary" data-open-sheet="'+last.id+'">Abrir ficha</button></section>':'<section class="panel empty"><span class="large-icon">♙</span><h2>Crie seu primeiro personagem</h2><p>O assistente explica cada escolha passo a passo.</p><button class="primary" data-new>Começar criação</button></section>')+
    '<section class="grid">'+sections.slice(1).map(function(section){return '<button class="card action" data-go="'+section.id+'"><span class="card-icon">'+section.icon+'</span><strong>'+section.label+'</strong><small>Abrir módulo</small></button>';}).join('')+'</section>';
}
function moduleView(){
  if(state.section==='jogador')return listView();
  return '<section class="panel empty"><span class="large-icon">'+(state.section==='mestre'?'⚑':'☷')+'</span><h2>'+esc(state.section==='mestre'?'Mestre':'Compêndio')+'</h2><p>Este módulo continuará sendo desenvolvido após a estabilização da ficha do jogador.</p></section>';
}
function listView(){
  refreshCharacters();
  return '<section class="section-heading"><div><span class="eyebrow">MÓDULO JOGADOR</span><h2>Personagens</h2><p>Fichas salvas neste aparelho.</p></div><button class="primary" data-new>+ Nova ficha</button></section>'+
    (state.characters.length?'<section class="character-list">'+state.characters.map(card).join('')+'</section>':'<section class="panel empty"><span class="large-icon">♙</span><h2>Nenhuma ficha</h2><button class="primary" data-new>Criar personagem</button></section>');
}
function card(character){
  var affiliation=affiliationByName(character.affiliation);var icon=affiliation&&affiliation.icon||(character.name||'?').charAt(0).toUpperCase();
  return '<article class="character-card"><button class="character-main" data-open-sheet="'+character.id+'"><span class="avatar">'+esc(icon)+'</span><span><strong>'+esc(character.name||'Sem nome')+'</strong><small>Nível '+character.level+' · '+esc(character.affiliation||'Sem Filiação')+' · PV '+character.resources.pvCurrent+'/'+character.rules.pvMax+' · '+esc(resourceSummary(character))+'</small></span></button><div class="card-actions"><button data-edit="'+character.id+'">Editar</button><button data-copy="'+character.id+'">Duplicar</button><button class="danger" data-del="'+character.id+'">Excluir</button></div></article>';
}
function wizard(){
  return '<section class="wizard-head"><button class="secondary compact-btn" data-cancel>Fechar</button><div><span class="eyebrow">CRIAÇÃO GUIADA</span><h2>'+steps[state.step]+'</h2><small>Passo '+(state.step+1)+' de '+steps.length+'</small></div></section><div class="progress"><span style="width:'+((state.step+1)/steps.length*100)+'%"></span></div><section class="panel wizard-card">'+stepView()+'</section><div class="wizard-actions">'+(state.step?'<button class="secondary" data-prev>Voltar</button>':'<span></span>')+(state.step===steps.length-1?'<button class="primary" data-save>Salvar ficha</button>':'<button class="primary" data-next>Próximo</button>')+'</div>';
}
function field(name,label,value,type,placeholder){return '<label class="identity-field"><span>'+label+'</span><input data-field="'+name+'" type="'+type+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'"></label>';}
function backgroundChoice(background,selected){
  return '<button class="choice '+(selected?'selected':'')+'" data-bg="'+esc(background.name)+'"><strong>'+esc(background.name)+'</strong><small>'+esc((background.skillProficiencies||[]).join(', '))+' · '+esc(background.toolProficiency||'')+'</small><small><b>'+esc(background.trait&&background.trait.name||'Traço')+':</b> '+esc(background.trait&&background.trait.description||'')+'</small></button>';
}
function stepView(){
  var c=state.editing;
  if(state.step===0)return '<span class="step-icon">✦</span><h3>Conceito do personagem <small class="optional">opcional</small></h3><p>Esta etapa resume quem o personagem é antes dos números. Uma frase já é suficiente.</p><div class="prompt-list"><small>Quem ele era antes do mundo mítico?</small><small>Qual sua principal qualidade ou dificuldade?</small><small>O que deseja alcançar?</small></div><label class="full-field"><span>Resumo do conceito</span><textarea data-field="concept" rows="6" placeholder="Ex.: Uma atleta protetora que teme decepcionar a própria mãe divina.">'+esc(c.concept)+'</textarea></label><button class="text-button" data-skip-concept>Pular por enquanto</button>';
  if(state.step===1){var persisted=!!Service.get(c.id);return '<div class="identity-hero"><div class="portrait-placeholder">'+esc((c.name||'?').charAt(0).toUpperCase())+'</div><div><h3>Identidade do herói</h3><p>Dados principais usados no cabeçalho e na apresentação da ficha.</p></div></div><div class="form-grid">'+field('name','Nome do personagem',c.name,'text','Helena Demétrio')+field('player','Nome do jogador',c.player,'text','Quem controla a ficha')+field('age','Idade',c.age,'number','17')+'</div><label class="full-field"><span>Aparência ou detalhe marcante</span><textarea data-field="appearance" rows="4" placeholder="Cabelos, roupas, cicatriz, postura ou outro detalhe visual.">'+esc(c.appearance)+'</textarea></label>'+(persisted?'<div class="level-control"><span>Nível do personagem</span><strong data-level-display>'+c.level+'</strong></div><div class="coming">Use o botão Evoluir ficha para subir de nível sem recuperar PV ou recursos indevidamente.</div>':'<div class="level-control"><span>Nível inicial</span><button data-level-delta="-1">−</button><strong data-level-display>'+c.level+'</strong><button data-level-delta="1">+</button><input data-field="level" type="number" min="1" max="20" value="'+c.level+'"></div><div class="coming">Caminho libera no nível 3. Marca do Herói libera no nível 5.</div>');}
  if(state.step===2){var origins=originCatalog(),semideus=origins.find(function(origin){return origin.id==='semideus-grego';})||origins[0],beyond=origins.filter(function(origin){return origin.group==='Heróis Além do Sangue';});return '<span class="step-icon">⚜</span><h3>Natureza do herói</h3><p>A Natureza define qual estrutura de origem e progressão o personagem utiliza.</p><button class="choice selected nature-option" type="button"><span class="nature-choice-head"><strong>'+esc(semideus.name)+'</strong><span class="status ready">Disponível</span></span><small>'+esc(semideus.summary)+'</small></button><section class="nature-future"><span class="eyebrow">HERÓIS ALÉM DO SANGUE</span><h4>Origens oficiais em integração</h4><p>Estas opções são jogáveis no livro, mas ainda precisam do motor próprio no aplicativo.</p><div class="choice-list">'+beyond.map(function(origin){return '<article class="choice nature-option unavailable" data-future-origin="'+esc(origin.id)+'"><span class="nature-choice-head"><strong>'+esc(origin.name)+'</strong><span class="status">Em integração</span></span><small>'+esc(origin.summary)+'</small><small>Livro do Jogador 3e · p. '+esc(origin.sourcePages)+'</small></article>';}).join('')+'</div></section>';}
  if(state.step===3)return '<h3>Escolha a Filiação</h3><div class="choice-grid">'+affiliationCatalog().map(function(affiliation){return '<button class="choice '+(c.affiliation===affiliation.name?'selected':'')+'" data-aff="'+esc(affiliation.name)+'"><span class="choice-icon">'+esc(affiliation.icon||'✦')+'</span><strong>'+esc(affiliation.name)+'</strong><small>'+esc(affiliation.domain||affiliation.profile||'')+'</small></button>';}).join('')+'</div>';
  if(state.step===4)return '<h3>Atributos</h3><p>O modificador é calculado automaticamente.</p><div class="attribute-grid">'+attrs.map(function(attribute){return '<label><span>'+attribute+'</span><small>Valor</small><input data-attr="'+attribute+'" type="number" min="1" max="30" value="'+c.attributes[attribute]+'"><small>Modificador</small><b data-mod="'+attribute+'">'+signed(Rules.modifier(c.attributes[attribute]))+'</b></label>';}).join('')+'</div>';
  if(state.step===5)return '<h3>Antecedente</h3><p>Cada Antecedente aplica três proficiências, uma ferramenta, um Traço e um Vínculo.</p><div class="choice-list">'+backgroundCatalog().map(function(background){return backgroundChoice(background,c.background===background.name);}).join('')+'</div>';
  if(state.step===6){
    if(c.level<3)return '<span class="step-icon">🔒</span><h3>Caminho ainda não liberado</h3><p>Esta escolha aparece no nível 3.</p>';
    var paths=c.rules&&Array.isArray(c.rules.paths)?c.rules.paths:[];
    return '<h3>Caminho Divino</h3>'+(paths.length?'<div class="choice-list">'+paths.map(function(path){return '<button class="choice '+(c.divinePath===path.name?'selected':'')+'" data-path="'+esc(path.name)+'"><strong>'+esc(path.name)+'</strong><small>'+esc(path.summary||'')+'</small></button>';}).join('')+'</div>':'<div class="coming">Nenhum Caminho oficial encontrado.</div>');
  }
  if(state.step===7){
    if(c.level<5)return '<span class="step-icon">🔒</span><h3>Marca ainda não liberada</h3><p>Esta escolha aparece no nível 5.</p>';
    return '<h3>Marca do Herói</h3><div class="choice-list">'+heroMarkCatalog().map(function(mark){return '<button class="choice '+(c.heroMark===mark.name?'selected':'')+'" data-mark="'+esc(mark.name)+'"><strong>'+esc(mark.name)+'</strong><small>'+esc(mark.description||'')+'</small></button>';}).join('')+'</div>';
  }
  recalc();var primary=primaryDefinition(c),background=backgroundByName(c.background);
  return '<h3>Revisão</h3><div class="review-grid"><div><span>Herói</span><strong>'+esc(c.name||'Sem nome')+'</strong></div><div><span>Nível</span><strong>'+c.level+'</strong></div><div><span>Filiação</span><strong>'+esc(c.affiliation||'—')+'</strong></div><div><span>Antecedente</span><strong>'+esc(c.background||'—')+'</strong></div><div><span>Caminho</span><strong>'+esc(c.divinePath||'Ainda não definido')+'</strong></div><div><span>Marca</span><strong>'+esc(c.heroMark||'Ainda não definida')+'</strong></div><div><span>PV máximo</span><strong>'+c.rules.pvMax+'</strong></div><div><span>'+esc(primary.label)+' máximo</span><strong>'+primaryMax(c)+'</strong></div></div>'+(background?'<section class="background-review"><h3>'+esc(background.trait.name)+'</h3><p>'+esc(background.trait.description)+'</p><small><strong>Vínculo:</strong> '+esc(background.bond)+'</small></section>':'')+'<h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(attribute){return '<div><span>'+attribute+'</span><strong>'+c.attributes[attribute]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[attribute]))+'</b></div>';}).join('')+'</div>';
}

function extraResources(c){return '<section class="panel"><h3>Recursos adicionais</h3><div class="sheet-extra-grid"><article class="sheet-extra-card"><span>PV temporários</span><strong data-extra-display="tempHp">'+c.resources.tempHp+'</strong><div class="mini-adjust"><button data-extra-resource="tempHp" data-delta="-1">−1</button><button data-extra-resource="tempHp" data-delta="1">+1</button></div></article><article class="sheet-extra-card"><span>Dados de Vida</span><strong data-extra-display="hitDice">'+c.resources.hitDiceCurrent+' / '+c.resources.hitDiceMax+' d'+c.rules.hitDie+'</strong><div class="mini-adjust"><button data-extra-resource="hitDice" data-delta="-1">Usar 1</button><button data-extra-resource="hitDice" data-delta="1">Recuperar 1</button></div></article><article class="sheet-extra-card"><span>Condição atual</span><strong data-extra-display="condition">'+esc(c.resources.condition)+'</strong><select class="condition-select" data-condition>'+conditions.map(function(name){return '<option value="'+esc(name)+'" '+(name===c.resources.condition?'selected':'')+'>'+esc(name)+'</option>';}).join('')+'</select></article></div><p class="sheet-note">Ao receber dano, os PV temporários são consumidos antes dos PV atuais.</p></section>';}
function savesPanel(c){
  var bonus=c.rules.proficiency,official=Array.isArray(c.officialSaveProficiencies)?c.officialSaveProficiencies:[];
  return '<details class="panel sheet-reference-panel"><summary><span><strong>Testes de Resistência</strong><small>Ver valores e ajustar proficiências adicionais</small></span><b>Detalhes</b></summary><div class="sheet-reference-body"><div class="proficiency-banner"><span>Bônus de Proficiência</span><strong>+'+bonus+'</strong></div><h3>Testes de Resistência</h3><div class="save-grid">'+attrs.map(function(attribute){var officialProficiency=official.indexOf(attribute)>=0;var trained=officialProficiency||c.saveProficiencies.indexOf(attribute)>=0;var base=Rules.modifier(c.attributes[attribute]);var total=base+(trained?bonus:0);return '<article class="save-card '+(trained?'proficient':'')+'"><span>'+attribute+'</span><strong>'+signed(total)+'</strong><small>'+signed(base)+' atributo'+(trained?' + '+bonus+' proficiência':'')+'</small>'+(officialProficiency?'<span class="save-toggle">● Filiação</span>':'<button class="save-toggle" data-save-prof="'+attribute+'">'+(trained?'● Proficiente':'○ Marcar proficiência')+'</button>')+'</article>';}).join('')+'</div><p class="sheet-note">Proficiências da Filiação são aplicadas automaticamente. As demais podem vir de talentos, itens ou decisões do Mestre.</p></div></details>';
}
function backgroundPanel(c){
  var background=c.rules&&c.rules.background||backgroundByName(c.background);if(!background)return '';
  return '<details class="panel background-sheet-panel sheet-reference-panel"><summary><span><strong>Antecedente · '+esc(background.name)+'</strong><small>Traço, Vínculo e proficiências</small></span><b>Detalhes</b></summary><div class="sheet-reference-body"><span class="eyebrow">ANTECEDENTE</span><h3>'+esc(background.name)+'</h3><p>'+esc(background.overview||'')+'</p><div class="official-rules-groups"><div><strong>Perícias</strong><div class="official-rule-tags">'+(background.skillProficiencies||[]).map(function(skill){return '<span>'+esc(skill)+'</span>';}).join('')+'</div></div><div><strong>Ferramenta</strong><div class="official-rule-tags"><span>'+esc(background.toolProficiency||'—')+'</span></div></div></div><article class="background-trait"><strong>'+esc(background.trait.name)+'</strong><small>'+esc(background.trait.action||'')+'</small><p>'+esc(background.trait.description)+'</p></article><p><strong>Vínculo:</strong> '+esc(background.bond||'—')+'</p></div></details>';
}
function skillsPanel(c){
  var current=primaryCurrent(c),definition=primaryDefinition(c),skills=c.skills||[];
  return '<section class="panel"><div class="section-heading"><div><h3>Skills e habilidades</h3><p>O custo fixo é descontado automaticamente de '+esc(definition.label)+'.</p></div></div>'+(skills.length?'<div class="skill-list">'+skills.map(function(skill){return '<article class="skill-row"><div><strong>'+esc(skill.name||'Habilidade')+'</strong><small>Rank '+esc(skill.rank||'—')+' · Custo: '+skill.cost+' '+esc(definition.costLabel||definition.label)+'</small></div><button class="primary" data-skill-use="'+skill.id+'" '+(current<skill.cost?'disabled':'')+'>Usar</button><button class="danger-link" data-skill-delete="'+skill.id+'">Excluir</button></article>';}).join('')+'</div>':'<div class="coming">Nenhuma Skill cadastrada.</div>')+'<div class="inline-form"><input id="skill-name" placeholder="Nome da Skill ou habilidade" autocomplete="off"><input id="skill-cost" type="number" min="0" value="1" inputmode="numeric"><button class="secondary" data-skill-add>Adicionar Skill</button></div></section>';
}
function sheet(){
  var c=state.editing;recalc();var definition=primaryDefinition(c);
  return '<section class="section-heading"><div><span class="eyebrow">FICHA PRONTA</span><h2>'+esc(c.name||'Sem nome')+'</h2><p>Nível '+c.level+' · '+esc(c.affiliation||'Sem Filiação')+'</p></div><button class="secondary" data-back-list>Voltar</button></section><section class="resource-grid"><article class="resource-card pv '+pvTone(c)+'" data-pv-state="'+(pvTone(c)==='pv-danger'?'crítico':pvTone(c)==='pv-warning'?'atenção':'saudável')+'"><span>PV atual</span><strong data-resource-display="pv">'+c.resources.pvCurrent+' / '+c.rules.pvMax+'</strong><div class="adjust-row"><button data-adjust="pv" data-delta="-1">−1</button><button data-adjust="pv" data-delta="1">+1</button><input data-amount="pv" type="number" min="1" value="'+state.controlAmounts.pv+'"><button data-apply="pv" data-mode="lose">Dano</button><button data-apply="pv" data-mode="gain">Curar</button></div></article><article class="resource-card mp"><span>'+esc(definition.label)+' atual</span><strong data-resource-display="mp">'+primaryCurrent(c)+' / '+primaryMax(c)+'</strong><div class="adjust-row"><button data-adjust="mp" data-delta="-1">−1</button><button data-adjust="mp" data-delta="1">+1</button><input data-amount="mp" type="number" min="1" value="'+state.controlAmounts.mp+'"><button data-apply="mp" data-mode="lose">Gastar</button><button data-apply="mp" data-mode="gain">Restaurar</button></div></article></section>'+extraResources(c)+'<section class="panel"><h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(attribute){return '<div><span>'+attribute+'</span><strong>'+c.attributes[attribute]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[attribute]))+'</b></div>';}).join('')+'</div></section>'+savesPanel(c)+backgroundPanel(c)+skillsPanel(c)+'<details class="panel sheet-reference-panel"><summary><span><strong>Identidade e aparência</strong><small>Jogador, idade e detalhes visuais</small></span><b>Detalhes</b></summary><div class="sheet-reference-body"><h3>Identidade</h3><p><strong>Jogador:</strong> '+esc(c.player||'—')+'<br><strong>Idade:</strong> '+esc(c.age||'—')+'<br><strong>Aparência:</strong> '+esc(c.appearance||'—')+'</p></div></details><section class="panel"><h3>Progressão</h3><p><strong>Caminho:</strong> '+esc(c.level>=3?(c.divinePath||'Escolha pendente'):'Libera no nível 3')+'<br><strong>Marca:</strong> '+esc(c.level>=5?(c.heroMark||'Escolha pendente'):'Libera no nível 5')+'</p><div class="sheet-progress-actions"><button class="secondary" data-edit-current>Editar personagem</button><button class="primary" data-evolve-character="'+c.id+'" '+(c.level>=20?'disabled':'')+'>⬆ Evoluir ficha</button></div></section>';
}
function nav(){return '<nav class="bottom-nav">'+sections.map(function(section){return '<button data-go="'+section.id+'" class="'+(state.section===section.id?'active':'')+'"><span>'+section.icon+'</span><small>'+section.label+'</small></button>';}).join('')+'</nav>';}
function render(){
  var content=state.screen==='wizard'?wizard():state.screen==='characters'?listView():state.screen==='sheet'?sheet():state.section==='inicio'?home():moduleView();
  var selected=sections.find(function(section){return section.id===state.section;})||sections[0];
  var title=state.screen==='wizard'?'Criação':state.screen==='characters'?'Personagens':state.screen==='sheet'?'Ficha':selected.label;
  app.innerHTML='<div class="app-shell"><header class="topbar"><div><span class="eyebrow">SEMIDEUSES RPG 3E</span><h1>'+title+'</h1></div><div class="brand-mark">S3</div></header>'+(state.message?'<div class="toast">'+esc(state.message)+'</div>':'')+'<main class="content">'+content+'</main>'+nav()+'</div>';
  bind();
  window.dispatchEvent(new CustomEvent('semideuses:rendered',{detail:{screen:state.screen,section:state.section}}));
}
function bind(){
  document.querySelectorAll('[data-go]').forEach(function(button){button.onclick=function(){state.section=button.dataset.go;state.screen=state.section==='jogador'?'characters':'home';state.editing=null;renderAndTop();};});
  document.querySelectorAll('[data-open-characters]').forEach(function(button){button.onclick=function(){state.section='jogador';state.screen='characters';renderAndTop();};});
  document.querySelectorAll('[data-new]').forEach(function(button){button.onclick=function(){state.section='jogador';state.editing=Model.create();state.step=0;state.screen='wizard';renderAndTop();};});
  document.querySelectorAll('[data-open-sheet]').forEach(function(button){button.onclick=function(){var character=Service.get(button.dataset.openSheet);if(character){state.section='jogador';state.editing=character;state.screen='sheet';sessionStorage.setItem('semideuses.currentCharacterId',character.id);renderAndTop();}};});
  document.querySelectorAll('[data-edit]').forEach(function(button){button.onclick=function(){var character=Service.get(button.dataset.edit);if(character){state.section='jogador';state.editing=character;state.step=0;state.screen='wizard';renderAndTop();}};});
  document.querySelectorAll('[data-copy]').forEach(function(button){button.onclick=function(){try{Service.duplicate(button.dataset.copy);refreshCharacters();msg('Ficha duplicada.');}catch(error){alert(error.message);}};});
  document.querySelectorAll('[data-del]').forEach(function(button){button.onclick=function(){if(confirm('Excluir esta ficha?')){Service.remove(button.dataset.del);refreshCharacters();msg('Ficha excluída.');}};});
  document.querySelectorAll('[data-field]').forEach(function(element){element.oninput=function(){var key=element.dataset.field;if(key==='level'){state.editing.level=Math.max(1,Math.min(20,Number(element.value||1)));if(state.editing.level<3)state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';var output=document.querySelector('[data-level-display]');if(output)output.textContent=state.editing.level;}else state.editing[key]=element.value;recalc();};});
  document.querySelectorAll('[data-level-delta]').forEach(function(button){button.onclick=function(){state.editing.level=Math.max(1,Math.min(20,state.editing.level+Number(button.dataset.levelDelta)));if(state.editing.level<3)state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';render();};});
  document.querySelectorAll('[data-attr]').forEach(function(element){element.oninput=function(){var attribute=element.dataset.attr;state.editing.attributes[attribute]=Math.max(1,Math.min(30,Number(element.value||10)));var output=document.querySelector('[data-mod="'+attribute+'"]');if(output)output.textContent=signed(Rules.modifier(state.editing.attributes[attribute]));recalc();};});
  document.querySelectorAll('[data-aff]').forEach(function(button){button.onclick=function(){state.editing.affiliation=button.dataset.aff;state.editing.divinePath='';recalc();render();};});
  document.querySelectorAll('[data-bg]').forEach(function(button){button.onclick=function(){state.editing.background=button.dataset.bg;recalc();render();};});
  document.querySelectorAll('[data-path]').forEach(function(button){button.onclick=function(){state.editing.divinePath=button.dataset.path;render();};});
  document.querySelectorAll('[data-mark]').forEach(function(button){button.onclick=function(){state.editing.heroMark=button.dataset.mark;render();};});
  var skip=document.querySelector('[data-skip-concept]');if(skip)skip.onclick=function(){state.step=1;renderAndTop();};
  var prev=document.querySelector('[data-prev]');if(prev)prev.onclick=function(){state.step--;renderAndTop();};
  var next=document.querySelector('[data-next]');if(next)next.onclick=function(){var result=Model.validate(state.editing,{step:state.step});if(!result.valid){alert(result.errors.map(function(error){return error.message;}).join('\n'));return;}state.step++;renderAndTop();};
  var saveButton=document.querySelector('[data-save]');if(saveButton)saveButton.onclick=function(){try{var validation=Model.validate(state.editing,{});if(!validation.valid)throw new Error(validation.errors.map(function(error){return error.message;}).join('\n'));updateEditing(Service.save(state.editing));state.screen='sheet';msg('Ficha salva neste aparelho.');}catch(error){alert('Não foi possível salvar: '+error.message);}};
  document.querySelectorAll('[data-cancel]').forEach(function(button){button.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};});
  var back=document.querySelector('[data-back-list]');if(back)back.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};
  var edit=document.querySelector('[data-edit-current]');if(edit)edit.onclick=function(){state.step=0;state.screen='wizard';renderAndTop();};
  document.querySelectorAll('[data-amount]').forEach(function(input){input.oninput=function(){var value=Math.max(1,Number(input.value||1));state.controlAmounts[input.dataset.amount]=value;persistAmounts();};});
  document.querySelectorAll('[data-adjust]').forEach(function(button){button.onclick=function(){try{refreshResourceDom(Service.adjustResource(state.editing.id,button.dataset.adjust,Number(button.dataset.delta)));}catch(error){alert(error.message);}};});
  document.querySelectorAll('[data-apply]').forEach(function(button){button.onclick=function(){var type=button.dataset.apply,input=document.querySelector('[data-amount="'+type+'"]'),amount=Math.max(0,Number(input&&input.value||0));state.controlAmounts[type]=Math.max(1,amount||1);persistAmounts();try{var saved;if(type==='pv'&&button.dataset.mode==='lose')saved=Service.applyDamage(state.editing.id,amount);else saved=Service.adjustResource(state.editing.id,type,button.dataset.mode==='lose'?-amount:amount);refreshResourceDom(saved);}catch(error){alert(error.message);}};});
  document.querySelectorAll('[data-extra-resource]').forEach(function(button){button.onclick=function(){try{refreshResourceDom(Service.adjustResource(state.editing.id,button.dataset.extraResource,Number(button.dataset.delta)));}catch(error){alert(error.message);}};});
  var condition=document.querySelector('[data-condition]');if(condition)condition.onchange=function(){try{refreshResourceDom(Service.setCondition(state.editing.id,condition.value));}catch(error){alert(error.message);}};
  document.querySelectorAll('[data-save-prof]').forEach(function(button){button.onclick=function(){try{updateEditing(Service.toggleSaveProficiency(state.editing.id,button.dataset.saveProf));render();}catch(error){alert(error.message);}};});
  var addSkill=document.querySelector('[data-skill-add]');if(addSkill)addSkill.onclick=function(){var name=document.getElementById('skill-name'),cost=document.getElementById('skill-cost'),text=String(name&&name.value||'').trim();if(!text){alert('Informe o nome da Skill ou habilidade.');if(name)name.focus();return;}try{updateEditing(Service.addSkill(state.editing.id,{name:text,cost:Math.max(0,Number(cost&&cost.value||0))}));render();}catch(error){alert(error.message);}};
  document.querySelectorAll('[data-skill-use]').forEach(function(button){button.onclick=function(){try{refreshResourceDom(Service.useSkill(state.editing.id,button.dataset.skillUse));}catch(error){alert(error.message);}};});
  document.querySelectorAll('[data-skill-delete]').forEach(function(button){button.onclick=function(){try{updateEditing(Service.removeSkill(state.editing.id,button.dataset.skillDelete));render();}catch(error){alert(error.message);}};});
}
window.SemideusesApp={getEditing:function(){return state.editing?clone(state.editing):null;},isEditingPersisted:function(){return !!(state.editing&&Service.get(state.editing.id));},applyAttributeCreation:applyAttributeCreation,refresh:function(){if(state.editing){var current=Service.get(state.editing.id);if(current)state.editing=current;}render();},openSheet:function(id){var character=Service.get(id);if(character){state.section='jogador';state.editing=character;state.screen='sheet';renderAndTop();}}};
window.addEventListener('semideuses:character-updated',refreshCharacters);
window.addEventListener('semideuses:character-removed',refreshCharacters);
try{render();}catch(error){app.innerHTML='<main style="padding:24px;font-family:system-ui"><h1>Falha ao iniciar</h1><pre>'+esc(error&&error.stack||error)+'</pre></main>';}
})();
