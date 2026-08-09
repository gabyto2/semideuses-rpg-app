const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));

const character={
  id:'atena-17',name:'Helena',player:'Gabi',age:17,appearance:'Cicatriz dourada',concept:'',
  level:5,affiliation:'Atena',background:'Estudiosa',divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra',
  attributes:{FOR:10,DES:14,CON:14,INT:16,SAB:15,CAR:8},skills:[],saveProficiencies:[],officialSaveProficiencies:['INT','SAB'],
  resources:{pvCurrent:10,primaryCurrent:8,mpCurrent:8,tempHp:0,hitDiceCurrent:5,hitDiceMax:5,condition:'Saudável',conditions:[]},
  rules:{pvMax:10,primaryMax:8,mpMax:8,hitDie:8,proficiency:3,primaryResource:{id:'mp',label:'MP'},paths:[]}
};

const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;
window.scrollTo=()=>{};
window.alert=message=>{throw new Error('Alerta inesperado: '+message);};
window.confirm=()=>true;
let stored=clone(character);
const blank=()=>({
  id:'novo',name:'',player:'',age:'',appearance:'',concept:'',level:1,affiliation:'',background:'',divinePath:'',heroMark:'',
  attributes:{FOR:15,DES:14,CON:13,INT:12,SAB:10,CAR:8},skills:[],saveProficiencies:[],officialSaveProficiencies:[],
  resources:{pvCurrent:9,primaryCurrent:6,mpCurrent:6,tempHp:0,hitDiceCurrent:1,hitDiceMax:1,condition:'Saudável',conditions:[]},
  rules:{pvMax:9,primaryMax:6,mpMax:6,hitDie:8,proficiency:2,primaryResource:{id:'mp',label:'MP'},paths:[]}
});
window.SemideusesCharacterService={
  list:()=>[clone(stored)],get:id=>id===stored.id?clone(stored):null,
  applyDamage:(id,amount)=>{stored.resources.pvCurrent=Math.max(0,stored.resources.pvCurrent-Number(amount||0));return clone(stored);},
  adjustResource:(id,type,amount)=>{if(type==='pv')stored.resources.pvCurrent=Math.max(0,Math.min(stored.rules.pvMax,stored.resources.pvCurrent+Number(amount||0)));return clone(stored);}
};
window.SemideusesCharacter={
  attributes:['FOR','DES','CON','INT','SAB','CAR'],conditions:['Saudável','Abalado'],clone,create:blank,calculate:value=>value,
  validate:value=>({valid:true,errors:[],character:value})
};
const originDefinitions=[
  {id:'semideus-grego',name:'Semideus Grego',group:'Semideus',implemented:true,summary:'Semideus disponível.',sourcePages:'19–23'},
  {id:'satiro-fauno',name:'Sátiro / Fauno',group:'Heróis Além do Sangue',implemented:true,summary:'Protetor da natureza.',sourcePages:'24–25',choices:{expertise:['Atletismo','Acrobacia']},fixedPath:'Caminho da Natureza Selvagem'},
  {id:'ciclope',name:'Ciclope',group:'Heróis Além do Sangue',implemented:true,summary:'Bruto da forja.',sourcePages:'25–26'},
  {id:'mortal-vidente',name:'Mortal Vidente',group:'Heróis Além do Sangue',implemented:true,summary:'Humano que enxerga a Névoa.',sourcePages:'26–27',choices:{professions:['Investigador','Mecânico','Sobrevivente']}},
  {id:'legado',name:'Legado',group:'Heróis Além do Sangue',implemented:true,requiresAffiliation:true,summary:'Sangue diluído.',sourcePages:'27–29'}
];
window.SemideusesOriginCatalog={list:()=>clone(originDefinitions),get:value=>clone(originDefinitions.find(origin=>origin.id===value||origin.name===value)||originDefinitions[0])};
window.SemideusesRules={modifier:value=>Math.floor((Number(value)-10)/2)};
window.SemideusesRulesDatabase={
  listCompleteAffiliations:()=>[{name:'Atena',icon:'🦉',domain:'Sabedoria'}],listBackgrounds:()=>[],heroMarks:[],
  getAffiliation:name=>name==='Atena'?{name:'Atena',icon:'🦉'}:null,getBackground:()=>null
};

window.eval(source('app.js'));

const player=window.document.querySelector('[data-go="jogador"]');
assert(player,'Atalho Jogador deve existir.');
player.click();
assert.equal(window.document.querySelector('.section-heading h2').textContent,'Personagens','Jogador deve abrir a lista de fichas diretamente.');
assert(!window.document.querySelector('[data-open-characters]'),'Não deve existir uma tela intermediária com um único link Personagens.');

window.document.querySelector('[data-new]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Conceito');
assert.equal(window.document.querySelector('.wizard-head small').textContent,'Passo 1 de 7','Caminho e Marca bloqueados não devem contar como etapas no nível 1.');
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Identidade');
const targetLevel=window.document.querySelector('[data-target-level]');
assert(targetLevel,'A criação deve permitir escolher o nível da campanha.');
targetLevel.value='5';targetLevel.dispatchEvent(new window.Event('change',{bubbles:true}));
assert.equal(window.document.querySelector('[data-level-display]').textContent,'5');
assert(window.document.querySelector('.wizard-card').textContent.includes('níveis sem decisão serão aplicados automaticamente'));
window.document.querySelector('[data-target-level]').value='1';window.document.querySelector('[data-target-level]').dispatchEvent(new window.Event('change',{bubbles:true}));
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Natureza','A criação deve preservar a etapa que futuramente muda o motor de origem.');
const availableOrigins=[...window.document.querySelectorAll('[data-origin]')].map(option=>option.textContent);
['Semideus Grego','Sátiro / Fauno','Ciclope','Mortal Vidente','Legado'].forEach(name=>assert(availableOrigins.some(text=>text.includes(name)),'A Natureza deve disponibilizar '+name+'.'));
assert.equal(window.document.querySelectorAll('[data-origin] .status.ready').length,5,'As cinco Naturezas oficiais devem estar disponíveis.');
window.document.querySelector('[data-origin="ciclope"]').click();
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Detalhes da origem');
assert(window.document.querySelector('.wizard-card').textContent.includes('não exige uma escolha adicional'));
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Atributos');
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Antecedente');
window.document.querySelector('[data-next]').click();
assert.equal(window.document.querySelector('.wizard-head h2').textContent,'Revisão','Ciclope de nível 1 deve pular Caminho e Marca sem mostrar telas bloqueadas.');
assert.equal(window.document.querySelector('.wizard-head small').textContent,'Passo 7 de 7');

window.document.querySelector('[data-cancel]').click();
window.document.querySelector('[data-open-sheet="atena-17"]').click();
let pv=window.document.querySelector('.resource-card.pv');
assert(pv.classList.contains('pv-healthy'),'PV acima da metade deve aparecer saudável em verde.');
assert.equal(pv.dataset.pvState,'saudável');
assert(pv.querySelector('[data-extra-display="tempHp"]'),'PV temporários devem ficar dentro do bloco de PV.');
assert(pv.querySelector('[data-extra-display="hitDice"]'),'Dados de Vida devem acompanhar o bloco de vitalidade.');
assert(!window.document.querySelector('.sheet-extra-grid'),'Não deve restar um painel separado de recursos adicionais.');
assert(window.document.querySelector('[data-go="jogador"]').classList.contains('active'),'Jogador deve permanecer ativo dentro da ficha.');
const references=[...window.document.querySelectorAll('.sheet-reference-panel')];
assert(references.length>=2,'Informações secundárias devem ficar agrupadas.');
assert(references.every(panel=>!panel.open),'Referências secundárias devem iniciar recolhidas.');

window.document.querySelector('[data-apply="pv"][data-mode="lose"]').click();
pv=window.document.querySelector('.resource-card.pv');
assert(pv.classList.contains('pv-warning'),'PV em metade deve aparecer em atenção, não em vermelho.');
window.document.querySelector('[data-apply="pv"][data-mode="lose"]').click();
pv=window.document.querySelector('.resource-card.pv');
assert(pv.classList.contains('pv-danger'),'Vermelho deve ficar reservado ao estado crítico.');
assert.equal(pv.dataset.pvState,'crítico');

dom.window.close();
console.log('ux-feedback-regressions.test: OK');
