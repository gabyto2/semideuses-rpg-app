const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));

function character(id,name,initiative){return {id,name,player:'Teste',age:18,level:5,heroType:'Semideus Grego',affiliation:'Atena',background:'Atleta',attributes:{FOR:14,DES:14,CON:14,INT:14,SAB:14,CAR:14},skills:[],saveProficiencies:[],officialSaveProficiencies:[],resources:{pvCurrent:30,conditions:[],condition:'Saudável',tempHp:0,hitDiceCurrent:5,hitDiceMax:5,primaryCurrent:8,mpCurrent:8},rules:{pvMax:30,armorClass:15,primaryMax:8,mpMax:8,hitDie:8,primaryResource:{kind:'pool',label:'MP'},paths:[]},initiative};}

function environment(){
  const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const window=dom.window;window.scrollTo=()=>{};window.confirm=()=>true;
  const store={helena:character('helena','Helena',14),orion:character('orion','Orion',12)};
  window.SemideusesCharacter={
    attributes:['FOR','DES','CON','INT','SAB','CAR'],conditions:['Saudável','Abalado','Agarrado','Apavorado','Atordoado','Caído','Cego','Envenenado','Lento','Morrendo','Restrito'],
    clone,uid:(prefix='id')=>prefix+'-'+Math.random().toString(36).slice(2,8),calculate:clone,create:()=>character('novo','',0),validate:value=>({valid:true,errors:[],character:value})
  };
  window.SemideusesCharacterService={
    list:()=>Object.values(store).map(clone),get:id=>store[id]?clone(store[id]):null,
    applyDamage(id,amount){store[id].resources.pvCurrent=Math.max(0,store[id].resources.pvCurrent-Number(amount||0));return clone(store[id]);},
    adjustResource(id,type,amount){if(type==='pv')store[id].resources.pvCurrent=Math.max(0,Math.min(store[id].rules.pvMax,store[id].resources.pvCurrent+Number(amount||0)));return clone(store[id]);},
    toggleCondition(id,condition){const list=store[id].resources.conditions,index=list.indexOf(condition);if(index>=0)list.splice(index,1);else list.push(condition);store[id].resources.condition=list[0]||'Saudável';return clone(store[id]);},
    duplicate(){},remove(){},save:value=>value
  };
  window.SemideusesRules={modifier:value=>Math.floor((Number(value)-10)/2)};
  window.SemideusesRulesDatabase={listCompleteAffiliations:()=>[],listBackgrounds:()=>[],heroMarks:[],getAffiliation:()=>null,getBackground:()=>null};
  return {dom,window,store};
}

function runtimeRules(){
  const {dom,window,store}=environment();window.eval(source('master-runtime.js'));const Runtime=window.SemideusesMasterRuntime;
  Runtime.addCharacter('helena',14);Runtime.addCharacter('orion',12);Runtime.addEnemy({name:'Cão do Inferno',pvMax:24,ca:13,initiative:14,trackers:[{id:'acoes','label':'Ações Lendárias',kind:'counter',max:3,resetOnRound:true}]});
  let state=Runtime.start();
  assert.equal(state.status,'active');assert.equal(state.round,1);assert.equal(state.combatants[0].name,'Helena','Empate deve preservar a ordem de inclusão até o Mestre decidir.');
  const enemy=state.combatants.find(item=>item.kind==='enemy');
  Runtime.moveTie(enemy.id,-1);state=Runtime.view();assert.equal(state.combatants[0].name,'Cão do Inferno','O Mestre deve conseguir resolver empates manualmente.');
  Runtime.adjustPv(enemy.id,-7);assert.equal(Runtime.view().combatants.find(item=>item.id===enemy.id).pvCurrent,17);
  const helena=state.combatants.find(item=>item.characterId==='helena');Runtime.adjustPv(helena.id,-5);assert.equal(store.helena.resources.pvCurrent,25,'Dano na Mesa deve atualizar a ficha vinculada.');
  Runtime.toggleCondition(helena.id,'Abalado');assert(store.helena.resources.conditions.includes('Abalado'),'Condição da Mesa deve atualizar a ficha vinculada.');
  const turns=state.combatants.length;for(let index=0;index<turns;index++)Runtime.nextTurn();assert.equal(Runtime.read().round,2,'Uma volta completa deve iniciar a rodada seguinte.');
  Runtime.adjustTracker(enemy.id,'acoes',-2);for(let index=0;index<turns;index++)Runtime.nextTurn();assert.equal(Runtime.read().combatants.find(item=>item.id===enemy.id).trackers[0].current,3,'Ações Lendárias devem renovar a cada rodada.');
  Runtime.end();assert.equal(Runtime.read().status,'ended');
  assert.equal(Runtime.history().length,1,'Um encontro encerrado deve entrar no histórico da campanha.');
  assert(JSON.parse(window.localStorage.getItem(Runtime.storageKey)).combatants.length===3,'O encontro deve persistir no navegador.');
  dom.window.close();
}

function uiFlow(){
  const {dom,window,store}=environment();window.alert=message=>{throw new Error('Alerta inesperado: '+message);};
  window.eval(source('rules-bestiary-nd04.js'));window.eval(source('rules-bestiary-nd08.js'));window.eval(source('rules-bestiary-nd12.js'));window.eval(source('rules-bestiary-final.js'));window.eval(source('master-runtime.js'));window.eval(source('encounter-calculator.js'));window.eval(source('bestiary-ui.js'));window.eval(source('master-ui.js'));window.eval(source('app.js'));
  window.document.querySelector('[data-go="mestre"]').click();
  assert.equal(window.document.querySelector('.master-intro h2').textContent,'Prepare o encontro sem trocar de tela');
  assert(window.document.querySelector('[data-master-bestiary]'),'A preparação deve incluir o Bestiário oficial.');
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,0,'O catálogo recolhido não deve renderizar dezenas de fichas ocultas.');
  const browser=window.document.querySelector('.bestiary-browser');browser.open=true;browser.ontoggle();browser.ontoggle=null;
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,12,'O catálogo aberto deve renderizar somente uma página curta.');
  assert(window.document.querySelector('.bestiary-browser summary').textContent.includes('71 entradas oficiais'),'O resumo deve confirmar o catálogo completo.');
  assert.equal(window.document.querySelector('[data-bestiary-add="estrige"]').closest('[data-bestiary-card]').querySelector('.bestiary-source').textContent,'p. 83');
  window.document.querySelector('[data-bestiary-page="2"]').click();
  assert.equal(window.SemideusesEncounterCalculator.read().catalogPage,2,'A paginação deve avançar sem renderizar o catálogo inteiro.');
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,12);
  const filter=window.document.querySelector('[data-bestiary-filter]');filter.value='8';filter.onchange();
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,6,'O filtro ND 8 deve renderizar apenas suas seis entradas.');
  assert(window.document.querySelector('[data-bestiary-add="talos"]'),'Uma criatura ND 8 completa deve entrar na calculadora.');
  filter.value='5';filter.onchange();
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,8,'O filtro ND 5 deve renderizar apenas suas oito entradas.');
  assert(window.document.querySelector('[data-bestiary-manual="basilisco"]'),'A ficha incompleta do Basilisco deve exigir preparação manual.');
  filter.value='12';filter.onchange();
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,1,'O filtro ND 12 deve mostrar somente o Drakon.');
  assert(window.document.querySelector('[data-bestiary-add="drakon"]'));
  filter.value='17';filter.onchange();
  assert.equal(window.document.querySelectorAll('[data-bestiary-card]').length,1,'O filtro ND 17 deve mostrar somente o Aspecto de Tífon.');
  assert(window.document.querySelector('[data-bestiary-add="aspecto-tifon"]'));
  window.document.querySelector('[data-master-add-character="helena"]').click();
  let initiative=window.document.querySelector('[data-master-initiative]');initiative.value='16';initiative.dispatchEvent(new window.Event('change',{bubbles:true}));
  window.document.querySelector('[data-master-enemy="name"]').value='Empusa';
  window.document.querySelector('[data-master-enemy="pvMax"]').value='20';
  window.document.querySelector('[data-master-enemy="ca"]').value='14';
  window.document.querySelector('[data-master-enemy="initiative"]').value='12';
  window.document.querySelector('[data-master-add-enemy]').click();
  assert.equal(window.document.querySelectorAll('.master-setup-row').length,2);
  window.document.querySelector('[data-master-start]').click();
  assert(window.document.querySelector('.master-turn-bar').textContent.includes('Helena'));
  const helenaCard=window.document.querySelector('[data-master-combatant]');helenaCard.querySelector('.master-pv-controls input').value='4';helenaCard.querySelector('[data-master-pv][data-mode="damage"]').click();
  assert.equal(store.helena.resources.pvCurrent,26);
  const condition=window.document.querySelector('[data-master-add-condition]'),select=condition.closest('.master-conditions').querySelector('select');select.value='Abalado';condition.click();
  assert(store.helena.resources.conditions.includes('Abalado'));
  assert(window.document.querySelector('[data-master-next]'),'O controle de próximo turno deve permanecer visível.');
  dom.window.close();
}

runtimeRules();uiFlow();console.log('master-session.test: OK');
