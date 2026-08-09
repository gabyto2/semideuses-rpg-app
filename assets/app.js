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
function originByCharacter(character){return OriginCatalog&&typeof OriginCatalog.get==='function'?(OriginCatalog.get(character&&character.heroType)||OriginCatalog.get('semideus-grego')):originCatalog()[0];}
function heroSourceText(character){var origin=originByCharacter(character),parts=[origin&&origin.name||character.heroType||'Semideus Grego'];if(character.affiliation)parts.push(character.affiliation);return parts.join(' · ');}
function hasPrimaryPool(character){return primaryDefinition(character).kind!=='none';}
function wizardStepTitle(){if(state.step!==3)return steps[state.step];var origin=originByCharacter(state.editing);return origin&&origin.requiresAffiliation?'Filiação':'Detalhes da origem';}
function affiliationChoices(character){return '<div class="choice-grid gods-grid">'+affiliationCatalog().map(function(affiliation){return '<button class="choice god-choice '+(character.affiliation===affiliation.name?'selected':'')+'" data-aff="'+esc(affiliation.name)+'"><span class="choice-icon">'+esc(affiliation.icon||'✦')+'</span><strong>'+esc(affiliation.name)+'</strong><small>'+esc(affiliation.domain||affiliation.profile||'')+'</small></button>';}).join('')+'</div>';}
function originSkillChoices(character){
  var selected=character.originChoices&&character.originChoices.skills||[];
  var skills=Model.periciaDefinitions||[];
  return '<div class="origin-choice-block"><h4>Duas perícias adicionais <small>'+selected.length+'/2</small></h4><p>Escolha duas diferentes. Elas se somam às perícias do Antecedente e, no caso do Legado, às da Filiação.</p><div class="choice-grid origin-skill-grid">'+skills.map(function(skill){return '<button type="button" class="choice '+(selected.indexOf(skill.name)>=0?'selected':'')+'" data-origin-skill="'+esc(skill.name)+'"><strong>'+esc(skill.name)+'</strong><small>'+esc(skill.attribute)+'</small></button>';}).join('')+'</div></div>';
}
function originConfiguration(character){
  var origin=originByCharacter(character),choices=character.originChoices||{};
  if(origin.id==='semideus-grego')return '<h3>Escolha a Filiação</h3><p>A Filiação define sua herança divina, recurso e Caminhos.</p>'+affiliationChoices(character);
  if(origin.id==='legado')return '<h3>Herança do Legado</h3><p>O Legado escolhe uma Filiação, mas recebe Dado de Vida menor, MP diluído e habilidades de Caminho atrasadas.</p>'+affiliationChoices(character)+originSkillChoices(character);
  if(origin.id==='satiro-fauno')return '<span class="step-icon">♬</span><h3>Especialização de Sátiro / Fauno</h3><p>Pés de Bode concede Especialização em uma destas perícias.</p><div class="choice-grid">'+(origin.choices.expertise||[]).map(function(value){return '<button class="choice '+(choices.expertise===value?'selected':'')+'" data-origin-choice="expertise" data-origin-value="'+esc(value)+'"><strong>'+esc(value)+'</strong></button>';}).join('')+'</div><div class="coming"><strong>Caminho fixo:</strong> Caminho da Natureza Selvagem. O Sátiro usa MP Natural baseado em SAB.</div>';
  if(origin.id==='mortal-vidente')return '<span class="step-icon">👁</span><h3>Preparação do Mortal Vidente</h3><p>O Mortal não usa Mana. Seu recurso são Pontos de Sorte iguais ao Bônus de Proficiência.</p><div class="origin-choice-block"><h4>Atributo-chave</h4><div class="choice-grid origin-attribute-grid">'+attrs.map(function(value){return '<button class="choice '+(choices.keyAttribute===value?'selected':'')+'" data-origin-choice="keyAttribute" data-origin-value="'+value+'"><strong>'+value+'</strong></button>';}).join('')+'</div></div>'+originSkillChoices(character)+(creationTargetLevel()>=2?'<div class="origin-choice-block"><h4>Ofício de Mortal · nível 2</h4><div class="choice-list">'+(origin.choices.professions||[]).map(function(value){var description={Investigador:'Especialização em Investigação e leitura de cenas.',Mecânico:'Opera, sabota e improvisa dispositivos.',Sobrevivente:'Recupera 1 Sorte no Descanso Curto e melhora o uso da Sorte.'}[value];return '<button class="choice '+(choices.profession===value?'selected':'')+'" data-origin-choice="profession" data-origin-value="'+esc(value)+'"><strong>'+esc(value)+'</strong><small>'+esc(description)+'</small></button>';}).join('')+'</div></div>':'<div class="coming">O Ofício de Mortal será escolhido ao alcançar o nível 2.</div>');
  return '<span class="step-icon">◉</span><h3>Ciclope</h3><p>Esta origem não exige uma escolha adicional agora.</p><div class="coming"><strong>Regras aplicadas:</strong> d12, FOR e CON nos Testes de Resistência, Couro Grosso, carga dobrada, Resistência a Concussivo e poderes limitados por Descanso — sem Mana.</div>';
}

var state={section:'inicio',screen:'home',step:0,editing:null,creationTargetLevel:1,characters:Service.list(),message:'',controlAmounts:{pv:5,mp:3}};
try{
  var storedAmounts=JSON.parse(sessionStorage.getItem('semideuses.controlAmounts')||'{}');
  if(Number(storedAmounts.pv)>0)state.controlAmounts.pv=Number(storedAmounts.pv);
  if(Number(storedAmounts.mp)>0)state.controlAmounts.mp=Number(storedAmounts.mp);
}catch(error){}

function esc(value){return String(value==null?'':value).replace(/[&<>\"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char];});}
function clone(value){return Model.clone(value);}
function editingPersisted(){return !!(state.editing&&Service.get(state.editing.id));}
function creationTargetLevel(){return editingPersisted()?Number(state.editing.level||1):Math.max(1,Math.min(20,Number(state.creationTargetLevel||1)));}
function originNeedsPath(origin,target){return !!(origin&&(origin.id==='legado'||(origin.id==='semideus-grego'&&target>=3)));}
function allowedCreationMarks(character){return character&&character.rules&&Array.isArray(character.rules.allowedHeroMarks)?character.rules.allowedHeroMarks:[];}
function syncCreationMilestones(){
  if(!state.editing||editingPersisted())return;
  var target=creationTargetLevel(),origin=originByCharacter(state.editing),allowed=allowedCreationMarks(state.editing);
  if(origin.id==='semideus-grego'&&target<3)state.editing.divinePath='';
  if(target<5)state.editing.heroMark='';
  else if(allowed.length===1)state.editing.heroMark=allowed[0];
}
function activeWizardSteps(){
  var active=[0,1,2,3,4,5],c=state.editing,origin=c&&originByCharacter(c),target=creationTargetLevel();
  if(originNeedsPath(origin,target))active.push(6);
  if(target>=5&&allowedCreationMarks(c).length>1)active.push(7);
  active.push(8);return active;
}
function wizardPosition(){var active=activeWizardSteps(),index=active.indexOf(state.step);return {active:active,index:index<0?0:index};}
function moveWizard(delta){var position=wizardPosition(),next=Math.max(0,Math.min(position.active.length-1,position.index+delta));state.step=position.active[next];}
function creationMilestoneErrors(step){
  if(editingPersisted())return [];
  var c=state.editing,origin=originByCharacter(c),target=creationTargetLevel(),errors=[];
  if((step==null||step===3)&&origin.id==='mortal-vidente'&&target>=2&&!(c.originChoices&&c.originChoices.profession))errors.push('Escolha o Ofício de Mortal usado no nível 2.');
  if((step==null||step===6)&&originNeedsPath(origin,target)&&!c.divinePath)errors.push('Escolha o Caminho recebido na progressão inicial.');
  if((step==null||step===7)&&target>=5&&!c.heroMark)errors.push('Escolha a Marca do Herói recebida no nível 5.');
  return errors;
}
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
function resourceSummary(character){var definition=primaryDefinition(character);return definition.kind==='none'?'Poderes por Descanso':definition.label+' '+primaryCurrent(character)+'/'+primaryMax(character);}
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
    (last?'<section class="panel continue-card"><span class="status ready">Continuar</span><h3>'+esc(last.name||'Personagem')+'</h3><p>Nível '+last.level+' · '+esc(heroSourceText(last))+' · PV '+last.resources.pvCurrent+'/'+last.rules.pvMax+' · '+esc(resourceSummary(last))+'</p><button class="primary" data-open-sheet="'+last.id+'">Abrir ficha</button></section>':'<section class="panel empty"><span class="large-icon">♙</span><h2>Crie seu primeiro personagem</h2><p>O assistente explica cada escolha passo a passo.</p><button class="primary" data-new>Começar criação</button></section>')+
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
  var affiliation=affiliationByName(character.affiliation),origin=originByCharacter(character);var icon=affiliation&&affiliation.icon||origin&&origin.icon||(character.name||'?').charAt(0).toUpperCase();
  return '<article class="character-card"><button class="character-main" data-open-sheet="'+character.id+'"><span class="avatar">'+esc(icon)+'</span><span><strong>'+esc(character.name||'Sem nome')+'</strong><small>Nível '+character.level+' · '+esc(heroSourceText(character))+' · PV '+character.resources.pvCurrent+'/'+character.rules.pvMax+' · '+esc(resourceSummary(character))+'</small></span></button><div class="card-actions"><button data-edit="'+character.id+'">Editar</button><button data-copy="'+character.id+'">Duplicar</button><button class="danger" data-del="'+character.id+'">Excluir</button></div></article>';
}
function wizard(){
  var position=wizardPosition(),number=position.index+1,total=position.active.length;
  return '<section class="wizard-head"><button class="secondary compact-btn" data-cancel>Fechar</button><div><span class="eyebrow">CRIAÇÃO GUIADA</span><h2>'+wizardStepTitle()+'</h2><small>Passo '+number+' de '+total+'</small></div></section><div class="progress"><span style="width:'+(number/total*100)+'%"></span></div><section class="panel wizard-card">'+stepView()+'</section><div class="wizard-actions">'+(position.index?'<button class="secondary" data-prev>Voltar</button>':'<span></span>')+(state.step===8?'<button class="primary" data-save>Salvar e montar nível '+creationTargetLevel()+'</button>':'<button class="primary" data-next>Próximo</button>')+'</div>';
}
function field(name,label,value,type,placeholder){return '<label class="identity-field"><span>'+label+'</span><input data-field="'+name+'" type="'+type+'" value="'+esc(value)+'" placeholder="'+esc(placeholder||'')+'"></label>';}
function backgroundChoice(background,selected){
  return '<button class="choice '+(selected?'selected':'')+'" data-bg="'+esc(background.name)+'"><strong>'+esc(background.name)+'</strong><small>'+esc((background.skillProficiencies||[]).join(', '))+' · '+esc(background.toolProficiency||'')+'</small><small><b>'+esc(background.trait&&background.trait.name||'Traço')+':</b> '+esc(background.trait&&background.trait.description||'')+'</small></button>';
}
function stepView(){
  var c=state.editing;
  if(state.step===0)return '<span class="step-icon">✦</span><h3>Conceito do personagem <small class="optional">opcional</small></h3><p>Esta etapa resume quem o personagem é antes dos números. Uma frase já é suficiente.</p><div class="prompt-list"><small>Quem ele era antes do mundo mítico?</small><small>Qual sua principal qualidade ou dificuldade?</small><small>O que deseja alcançar?</small></div><label class="full-field"><span>Resumo do conceito</span><textarea data-field="concept" rows="6" placeholder="Ex.: Uma atleta protetora que teme decepcionar a própria mãe divina.">'+esc(c.concept)+'</textarea></label><button class="text-button" data-skip-concept>Pular por enquanto</button>';
  if(state.step===1){var persisted=editingPersisted(),target=creationTargetLevel(),levelOptions='';for(var level=1;level<=20;level++)levelOptions+='<option value="'+level+'" '+(target===level?'selected':'')+'>'+level+'</option>';return '<div class="identity-hero"><div class="portrait-placeholder">'+esc((c.name||'?').charAt(0).toUpperCase())+'</div><div><h3>Identidade do herói</h3><p>Dados principais usados no cabeçalho e na apresentação da ficha.</p></div></div><div class="form-grid">'+field('name','Nome do personagem',c.name,'text','Helena Demétrio')+field('player','Nome do jogador',c.player,'text','Quem controla a ficha')+field('age','Idade',c.age,'number','17')+'</div><label class="full-field"><span>Aparência ou detalhe marcante</span><textarea data-field="appearance" rows="4" placeholder="Cabelos, roupas, cicatriz, postura ou outro detalhe visual.">'+esc(c.appearance)+'</textarea></label>'+(persisted?'<div class="level-control level-readonly"><span>Nível do personagem</span><strong data-level-display>'+c.level+'</strong></div><div class="coming">Use Evoluir ficha para continuar a progressão sem alterar níveis manualmente.</div>':'<div class="level-control creation-level-control"><span>Nível da campanha</span><select data-target-level aria-label="Nível da campanha">'+levelOptions+'</select><strong data-level-display>'+target+'</strong></div><div class="coming"><strong>Criação acelerada:</strong> níveis sem decisão serão aplicados automaticamente. Você só preencherá as escolhas reais de Caminho, Marca, Talentos, Skills e Ofício.</div>');}
  if(state.step===2){var origins=originCatalog(),chosen=originByCharacter(c);return '<span class="step-icon">⚜</span><h3>Natureza do herói</h3><p>A Natureza muda de verdade a ficha: Dado de Vida, recursos, proficiências, escolhas e progressão.</p><div class="choice-list">'+origins.map(function(origin){return '<button class="choice nature-option '+(chosen&&chosen.id===origin.id?'selected':'')+'" type="button" data-origin="'+esc(origin.id)+'"><span class="nature-choice-head"><strong>'+esc(origin.icon||'✦')+' '+esc(origin.name)+'</strong><span class="status ready">Disponível</span></span><small>'+esc(origin.summary)+'</small><small>Livro do Jogador 3e · p. '+esc(origin.sourcePages)+'</small></button>';}).join('')+'</div>';}
  if(state.step===3)return originConfiguration(c);
  if(state.step===4)return '<h3>Atributos</h3><p>O modificador é calculado automaticamente.</p><div class="attribute-grid">'+attrs.map(function(attribute){return '<label><span>'+attribute+'</span><small>Valor</small><input data-attr="'+attribute+'" type="number" min="1" max="30" value="'+c.attributes[attribute]+'"><small>Modificador</small><b data-mod="'+attribute+'">'+signed(Rules.modifier(c.attributes[attribute]))+'</b></label>';}).join('')+'</div>';
  if(state.step===5)return '<h3>Antecedente</h3><p>Cada Antecedente aplica três proficiências, uma ferramenta, um Traço e um Vínculo.</p><div class="choice-list">'+backgroundCatalog().map(function(background){return backgroundChoice(background,c.background===background.name);}).join('')+'</div>';
  if(state.step===6){
    var origin=originByCharacter(c);
    if(origin.fixedPath)return '<span class="step-icon">♬</span><h3>'+esc(origin.fixedPath)+'</h3><p>O Sátiro / Fauno segue este Caminho fixo. As primeiras habilidades são liberadas no nível 3.</p><div class="coming">Nenhuma escolha adicional é necessária.</div>';
    if(origin.id==='ciclope'||origin.id==='mortal-vidente')return '<span class="step-icon">✓</span><h3>Esta origem não usa Caminho</h3><p>'+esc(origin.name)+' progride pelas próprias habilidades de origem.</p>';
    if(creationTargetLevel()<3&&origin.id!=='legado')return '<span class="step-icon">🔒</span><h3>Caminho ainda não liberado</h3><p>Esta escolha aparece no nível 3.</p>';
    var paths=c.rules&&Array.isArray(c.rules.paths)?c.rules.paths:[];
    return '<h3>'+(origin.id==='legado'?'Caminho herdado':'Caminho Divino')+'</h3>'+(origin.id==='legado'?'<p>O Legado escolhe o Caminho já na criação, mas recebe suas habilidades nos níveis 5, 9, 14 e 19.</p>':'')+(paths.length?'<div class="choice-list">'+paths.map(function(path){return '<button class="choice '+(c.divinePath===path.name?'selected':'')+'" data-path="'+esc(path.name)+'"><strong>'+esc(path.name)+'</strong><small>'+esc(path.summary||'')+'</small></button>';}).join('')+'</div>':'<div class="coming">Escolha primeiro uma Filiação válida.</div>');
  }
  if(state.step===7){
    if(creationTargetLevel()<5)return '<span class="step-icon">🔒</span><h3>Marca ainda não liberada</h3><p>Esta escolha aparece no nível 5.</p>';
    var allowed=c.rules&&c.rules.allowedHeroMarks||[];
    return '<h3>Marca do Herói</h3><p>'+(allowed.length===1?'Esta origem permite apenas a Marca abaixo.':'Escolha uma das Marcas permitidas para esta origem.')+'</p><div class="choice-list">'+heroMarkCatalog().filter(function(mark){return allowed.indexOf(mark.name)>=0;}).map(function(mark){return '<button class="choice '+(c.heroMark===mark.name?'selected':'')+'" data-mark="'+esc(mark.name)+'"><strong>'+esc(mark.name)+'</strong><small>'+esc(mark.description||'')+'</small></button>';}).join('')+'</div>';
  }
  recalc();c=state.editing;var primary=primaryDefinition(c),background=backgroundByName(c.background),originReview=originByCharacter(c);
  var target=creationTargetLevel();
  return '<h3>Revisão</h3><div class="review-grid"><div><span>Herói</span><strong>'+esc(c.name||'Sem nome')+'</strong></div><div><span>Nível da campanha</span><strong>'+target+'</strong></div><div><span>Natureza</span><strong>'+esc(originReview.name)+'</strong></div>'+(c.affiliation?'<div><span>Filiação</span><strong>'+esc(c.affiliation)+'</strong></div>':'')+'<div><span>Antecedente</span><strong>'+esc(c.background||'—')+'</strong></div>'+(c.divinePath?'<div><span>Caminho</span><strong>'+esc(c.divinePath)+'</strong></div>':'')+(target>=5?'<div><span>Marca</span><strong>'+esc(c.heroMark||'Ainda não definida')+'</strong></div>':'')+'<div><span>PV no nível 1</span><strong>'+c.rules.pvMax+' · d'+c.rules.hitDie+'</strong></div>'+(hasPrimaryPool(c)?'<div><span>'+esc(primary.label)+' no nível 1</span><strong>'+primaryMax(c)+'</strong></div>':'<div><span>Recurso</span><strong>Poderes por Descanso</strong></div>')+'</div>'+(target>1?'<div class="coming"><strong>Depois de salvar:</strong> o app avançará sozinho pelos níveis sem decisão e abrirá somente os níveis que exigem uma escolha.</div>':'')+(background?'<section class="background-review"><h3>'+esc(background.trait.name)+'</h3><p>'+esc(background.trait.description)+'</p><small><strong>Vínculo:</strong> '+esc(background.bond)+'</small></section>':'')+'<h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(attribute){return '<div><span>'+attribute+'</span><strong>'+c.attributes[attribute]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[attribute]))+'</b></div>';}).join('')+'</div>';
}

function vitalitySupport(c){return '<div class="vitality-support-grid"><article class="vitality-support-card temp-hp"><div><span>PV temporários</span><strong data-extra-display="tempHp">'+c.resources.tempHp+'</strong></div><div class="mini-adjust"><button data-extra-resource="tempHp" data-delta="-1">−1</button><button data-extra-resource="tempHp" data-delta="1">+1</button></div></article><article class="vitality-support-card hit-dice"><div><span>Dados de Vida</span><strong data-extra-display="hitDice">'+c.resources.hitDiceCurrent+' / '+c.resources.hitDiceMax+' d'+c.rules.hitDie+'</strong></div><div class="mini-adjust"><button data-extra-resource="hitDice" data-delta="-1">Usar 1</button><button data-extra-resource="hitDice" data-delta="1">Recuperar 1</button></div></article></div><p class="vitality-note">Ao receber dano, os PV temporários são consumidos antes dos PV atuais.</p>';}
function savesPanel(c){
  var bonus=c.rules.proficiency,official=Array.isArray(c.officialSaveProficiencies)?c.officialSaveProficiencies:[];
  var source=c.affiliation?'Filiação':'Origem';
  return '<details class="panel sheet-reference-panel"><summary><span><strong>Testes de Resistência</strong><small>Ver valores e ajustar proficiências adicionais</small></span><b>Detalhes</b></summary><div class="sheet-reference-body"><div class="proficiency-banner"><span>Bônus de Proficiência</span><strong>+'+bonus+'</strong></div><h3>Testes de Resistência</h3><div class="save-grid">'+attrs.map(function(attribute){var officialProficiency=official.indexOf(attribute)>=0;var trained=officialProficiency||c.saveProficiencies.indexOf(attribute)>=0;var base=Rules.modifier(c.attributes[attribute]);var total=base+(trained?bonus:0);return '<article class="save-card '+(trained?'proficient':'')+'"><span>'+attribute+'</span><strong>'+signed(total)+'</strong><small>'+signed(base)+' atributo'+(trained?' + '+bonus+' proficiência':'')+'</small>'+(officialProficiency?'<span class="save-toggle">● '+source+'</span>':'<button class="save-toggle" data-save-prof="'+attribute+'">'+(trained?'● Proficiente':'○ Marcar proficiência')+'</button>')+'</article>';}).join('')+'</div><p class="sheet-note">Proficiências de '+source+' são aplicadas automaticamente. As demais podem vir de talentos, itens ou decisões do Mestre.</p></div></details>';
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
  var c=state.editing;recalc();c=state.editing;var definition=primaryDefinition(c),origin=originByCharacter(c),pathText=c.divinePath||((origin.id==='ciclope'||origin.id==='mortal-vidente')?'Não utiliza':'Escolha pendente'),pendingTarget=Math.max(0,Number(c.creationTargetLevel||0));
  var primaryCard=hasPrimaryPool(c)?'<article class="resource-card mp" data-affiliation-resource><span>'+esc(definition.label)+' atual</span><strong data-resource-display="mp">'+primaryCurrent(c)+' / '+primaryMax(c)+'</strong><div class="adjust-row"><button data-adjust="mp" data-delta="-1">−1</button><button data-adjust="mp" data-delta="1">+1</button><input data-amount="mp" type="number" min="1" value="'+state.controlAmounts.mp+'"><button data-apply="mp" data-mode="lose">Gastar</button><button data-apply="mp" data-mode="gain">Restaurar</button></div></article>':'';
  return '<section class="section-heading"><div><span class="eyebrow">FICHA PRONTA</span><h2>'+esc(c.name||'Sem nome')+'</h2><p>Nível '+c.level+' · '+esc(heroSourceText(c))+'</p></div><button class="secondary" data-back-list>Voltar</button></section><section class="resource-grid"><article class="resource-card pv '+pvTone(c)+'" data-pv-state="'+(pvTone(c)==='pv-danger'?'crítico':pvTone(c)==='pv-warning'?'atenção':'saudável')+'"><span>PV atual</span><strong data-resource-display="pv">'+c.resources.pvCurrent+' / '+c.rules.pvMax+'</strong><div class="adjust-row"><button data-adjust="pv" data-delta="-1">−1</button><button data-adjust="pv" data-delta="1">+1</button><input data-amount="pv" type="number" min="1" value="'+state.controlAmounts.pv+'"><button data-apply="pv" data-mode="lose">Dano</button><button data-apply="pv" data-mode="gain">Curar</button></div>'+vitalitySupport(c)+'</article>'+primaryCard+'</section><section class="panel"><h3>Atributos</h3><div class="attribute-summary">'+attrs.map(function(attribute){return '<div><span>'+attribute+'</span><strong>'+c.attributes[attribute]+'</strong><b>Mod. '+signed(Rules.modifier(c.attributes[attribute]))+'</b></div>';}).join('')+'</div></section>'+savesPanel(c)+backgroundPanel(c)+skillsPanel(c)+'<details class="panel sheet-reference-panel"><summary><span><strong>Identidade e aparência</strong><small>Jogador, idade e detalhes visuais</small></span><b>Detalhes</b></summary><div class="sheet-reference-body"><h3>Identidade</h3><p><strong>Jogador:</strong> '+esc(c.player||'—')+'<br><strong>Idade:</strong> '+esc(c.age||'—')+'<br><strong>Aparência:</strong> '+esc(c.appearance||'—')+'</p></div></details><section class="panel"><h3>Progressão</h3><p><strong>Natureza:</strong> '+esc(origin.name)+'<br><strong>Caminho:</strong> '+esc(pathText)+'<br><strong>Marca:</strong> '+esc(c.level>=5?(c.heroMark||'Escolha pendente'):'Libera no nível 5')+'</p><div class="sheet-progress-actions"><button class="secondary" data-edit-current>Editar personagem</button><button class="primary" data-evolve-character="'+c.id+'" '+(c.level>=20?'disabled':'')+'>'+(pendingTarget>c.level?'▶ Continuar criação até o nível '+pendingTarget:'⬆ Evoluir ficha')+'</button></div></section>';
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
  document.querySelectorAll('[data-new]').forEach(function(button){button.onclick=function(){state.section='jogador';state.editing=Model.create({level:1});state.creationTargetLevel=1;state.step=0;state.screen='wizard';renderAndTop();};});
  document.querySelectorAll('[data-open-sheet]').forEach(function(button){button.onclick=function(){var character=Service.get(button.dataset.openSheet);if(character){state.section='jogador';state.editing=character;state.screen='sheet';sessionStorage.setItem('semideuses.currentCharacterId',character.id);renderAndTop();}};});
  document.querySelectorAll('[data-edit]').forEach(function(button){button.onclick=function(){var character=Service.get(button.dataset.edit);if(character){state.section='jogador';state.editing=character;state.creationTargetLevel=character.level;state.step=0;state.screen='wizard';renderAndTop();}};});
  document.querySelectorAll('[data-copy]').forEach(function(button){button.onclick=function(){try{Service.duplicate(button.dataset.copy);refreshCharacters();msg('Ficha duplicada.');}catch(error){alert(error.message);}};});
  document.querySelectorAll('[data-del]').forEach(function(button){button.onclick=function(){if(confirm('Excluir esta ficha?')){Service.remove(button.dataset.del);refreshCharacters();msg('Ficha excluída.');}};});
  document.querySelectorAll('[data-field]').forEach(function(element){element.oninput=function(){var key=element.dataset.field;if(key==='level'){state.editing.level=Math.max(1,Math.min(20,Number(element.value||1)));var origin=originByCharacter(state.editing);if(state.editing.level<3&&origin.id==='semideus-grego')state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';var output=document.querySelector('[data-level-display]');if(output)output.textContent=state.editing.level;}else state.editing[key]=element.value;recalc();};});
  var targetLevel=document.querySelector('[data-target-level]');if(targetLevel)targetLevel.onchange=function(){state.creationTargetLevel=Math.max(1,Math.min(20,Number(targetLevel.value||1)));syncCreationMilestones();renderAndTop();};
  document.querySelectorAll('[data-level-delta]').forEach(function(button){button.onclick=function(){state.editing.level=Math.max(1,Math.min(20,state.editing.level+Number(button.dataset.levelDelta)));var origin=originByCharacter(state.editing);if(state.editing.level<3&&origin.id==='semideus-grego')state.editing.divinePath='';if(state.editing.level<5)state.editing.heroMark='';recalc();render();};});
  document.querySelectorAll('[data-attr]').forEach(function(element){element.oninput=function(){var attribute=element.dataset.attr;state.editing.attributes[attribute]=Math.max(1,Math.min(30,Number(element.value||10)));var output=document.querySelector('[data-mod="'+attribute+'"]');if(output)output.textContent=signed(Rules.modifier(state.editing.attributes[attribute]));recalc();};});
  document.querySelectorAll('[data-aff]').forEach(function(button){button.onclick=function(){state.editing.affiliation=button.dataset.aff;state.editing.divinePath='';recalc();syncCreationMilestones();render();};});
  document.querySelectorAll('[data-origin]').forEach(function(button){button.onclick=function(){var origin=OriginCatalog.get(button.dataset.origin);if(!origin)return;state.editing.heroType=origin.name;state.editing.originChoices={};state.editing.affiliation='';state.editing.divinePath='';state.editing.heroMark='';state.editing.attributeCreation=null;recalc();syncCreationMilestones();render();};});
  document.querySelectorAll('[data-origin-choice]').forEach(function(button){button.onclick=function(){state.editing.originChoices=state.editing.originChoices||{};state.editing.originChoices[button.dataset.originChoice]=button.dataset.originValue;recalc();render();};});
  document.querySelectorAll('[data-origin-skill]').forEach(function(button){button.onclick=function(){state.editing.originChoices=state.editing.originChoices||{};var selected=state.editing.originChoices.skills||[],value=button.dataset.originSkill,index=selected.indexOf(value);if(index>=0)selected.splice(index,1);else if(selected.length<2)selected.push(value);else{alert('Escolha no máximo duas perícias adicionais.');return;}state.editing.originChoices.skills=selected;recalc();render();};});
  document.querySelectorAll('[data-bg]').forEach(function(button){button.onclick=function(){state.editing.background=button.dataset.bg;recalc();render();};});
  document.querySelectorAll('[data-path]').forEach(function(button){button.onclick=function(){state.editing.divinePath=button.dataset.path;recalc();render();};});
  document.querySelectorAll('[data-mark]').forEach(function(button){button.onclick=function(){state.editing.heroMark=button.dataset.mark;recalc();render();};});
  var skip=document.querySelector('[data-skip-concept]');if(skip)skip.onclick=function(){state.step=1;renderAndTop();};
  var prev=document.querySelector('[data-prev]');if(prev)prev.onclick=function(){moveWizard(-1);renderAndTop();};
  var next=document.querySelector('[data-next]');if(next)next.onclick=function(){var result=Model.validate(state.editing,{step:state.step}),milestones=creationMilestoneErrors(state.step);if(!result.valid||milestones.length){alert(result.errors.map(function(error){return error.message;}).concat(milestones).join('\n'));return;}moveWizard(1);renderAndTop();};
  var saveButton=document.querySelector('[data-save]');if(saveButton)saveButton.onclick=function(){try{var persisted=editingPersisted(),target=creationTargetLevel(),milestones=creationMilestoneErrors(null);if(milestones.length)throw new Error(milestones.join('\n'));if(!persisted){state.editing.level=1;state.editing.creationTargetLevel=target>1?target:0;}var validation=Model.validate(state.editing,{});if(!validation.valid)throw new Error(validation.errors.map(function(error){return error.message;}).join('\n'));var saved=Service.save(state.editing);updateEditing(saved);state.screen='sheet';msg(target>1&&!persisted?'Ficha-base salva. Montando o nível '+target+'…':'Ficha salva neste aparelho.');if(target>1&&!persisted)setTimeout(function(){window.dispatchEvent(new CustomEvent('semideuses:start-fast-evolution',{detail:{id:saved.id,targetLevel:target}}));},80);}catch(error){alert('Não foi possível salvar: '+error.message);}};
  document.querySelectorAll('[data-cancel]').forEach(function(button){button.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};});
  var back=document.querySelector('[data-back-list]');if(back)back.onclick=function(){state.screen='characters';state.editing=null;renderAndTop();};
  var edit=document.querySelector('[data-edit-current]');if(edit)edit.onclick=function(){state.creationTargetLevel=state.editing.level;state.step=0;state.screen='wizard';renderAndTop();};
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
window.SemideusesApp={getEditing:function(){return state.editing?clone(state.editing):null;},isEditingPersisted:function(){return !!(state.editing&&Service.get(state.editing.id));},applyAttributeCreation:applyAttributeCreation,refresh:function(){if(state.editing){var current=Service.get(state.editing.id);if(current)state.editing=current;}render();},openSheet:function(id){var character=Service.get(id);if(character){state.section='jogador';state.editing=character;state.screen='sheet';renderAndTop();}},notify:msg};
window.addEventListener('semideuses:character-updated',refreshCharacters);
window.addEventListener('semideuses:character-removed',refreshCharacters);
try{render();}catch(error){app.innerHTML='<main style="padding:24px;font-family:system-ui"><h1>Falha ao iniciar</h1><pre>'+esc(error&&error.stack||error)+'</pre></main>';}
})();
