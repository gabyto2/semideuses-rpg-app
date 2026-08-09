const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const context={console,CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;}};
context.window=context;context.dispatchEvent=()=>{};context.addEventListener=()=>{};
vm.createContext(context);
function load(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});}
[
  'assets/rules-engine.js','assets/rules-conditions.js','assets/rules-origins.js','assets/rules-database.js',
  'assets/rules-atena.js','assets/rules-resource-definitions.js','assets/rules-backgrounds.js',
  'assets/rules-skills.js','assets/rules-talents.js','assets/rules-equipment.js','assets/character-model.js',
  'assets/origin-model-extension.js','assets/background-model-extension.js','assets/player-mechanics-extension.js',
  'assets/equipment-model-extension.js'
].forEach(load);

const Model=context.SemideusesCharacter;
const db=context.SemideusesRulesDatabase;
const store={};
context.SemideusesCharacterService={
  get(id){return store[id]?Model.normalize(store[id]):null;},
  update(id,mutator){const current=this.get(id);if(!current)throw new Error('Personagem não encontrado.');const result=mutator(Model.clone(current))||current;store[id]=Model.normalize(result);return Model.clone(store[id]);},
  adjustSpecialResource(id,resourceId,delta){return this.update(id,c=>Model.adjustResource(c,'special:'+resourceId,delta));}
};
load('assets/player-mechanics-service.js');
load('assets/session-runtime.js');
load('assets/evolution-runtime.js');

const Service=context.SemideusesCharacterService;
const Session=context.SemideusesSessionRuntime;
const Evolution=context.SemideusesEvolutionRuntime;
const base={name:'Herói completo',background:'Atleta',attributes:{FOR:14,DES:14,CON:14,INT:14,SAB:16,CAR:12}};

let satyr=Model.create({...base,id:'satyr',heroType:'Sátiro / Fauno',originChoices:{expertise:'Atletismo'}});
assert.equal(satyr.rules.speed,12,'Pés de Bode deve elevar o deslocamento base para 12 m.');
assert(Model.pericia(satyr,'Atletismo').expertise);
satyr.originChoices.expertise='Acrobacia';
satyr=Model.calculate(satyr);
assert(!Model.pericia(satyr,'Atletismo').expertise,'Trocar a escolha não pode manter a Especialização antiga.');
assert(Model.pericia(satyr,'Acrobacia').expertise,'A nova Especialização do Sátiro deve ser aplicada.');

let mortal=Model.create({...base,id:'mortal',heroType:'Mortal Vidente',originChoices:{keyAttribute:'INT',skills:['Percepção','Investigação']}});
assert(Model.pericia(mortal,'Percepção').proficient,'Perícia extra da origem deve se somar ao Antecedente.');
assert(Model.pericia(mortal,'Investigação').proficient,'As duas perícias extras devem chegar à ficha calculada.');
store.mortal=mortal;
let level2=Evolution.preview('mortal');
assert.equal(level2.gain.chooseProfession,true,'O nível 2 deve exigir a escolha do Ofício de Mortal.');
assert(Evolution.validateChoice(level2,{}).some(message=>/Ofício/.test(message)));
mortal=Evolution.apply('mortal',{profession:'Investigador'});
assert.equal(mortal.originChoices.profession,'Investigador');
assert(Model.pericia(mortal,'Investigação').expertise,'Investigador deve aplicar Especialização.');
assert.throws(()=>Service.setMortalProfession('mortal','Mecânico'),/Descanso Longo/);
mortal=Session.longRest('mortal');
assert.equal(mortal.session.professionChangeAvailable,true);
mortal=Service.setMortalProfession('mortal','Mecânico');
assert.equal(mortal.originChoices.profession,'Mecânico');
assert(!Model.pericia(mortal,'Investigação').expertise,'Trocar o Ofício deve remover a Especialização exclusiva de Investigador.');
const mechanic=Session.abilityCatalog(mortal).find(item=>item.ability.name==='Ofício de Mortal');
mortal=Session.useOfficialAbility('mortal',mechanic.key);
assert.throws(()=>Session.useOfficialAbility('mortal',mechanic.key),/Sem usos restantes/,'O dispositivo do Mecânico deve respeitar 1 uso por dia.');

const luck=Session.abilityCatalog(mortal).find(item=>item.ability.name==='Sorte do Mortal');
assert(luck,'Sorte do Mortal deve aparecer entre as habilidades utilizáveis.');
const luckBefore=mortal.resources.primaryCurrent;
mortal=Session.useOfficialAbility('mortal',luck.key);
assert.equal(mortal.resources.primaryCurrent,luckBefore-1,'Usar Sorte do Mortal deve gastar 1 Ponto de Sorte.');
mortal=Session.longRest('mortal');
mortal=Service.setMortalProfession('mortal','Sobrevivente');
mortal=Service.update('mortal',character=>Model.adjustResource(character,'primary',-2));
const survivorBefore=mortal.resources.primaryCurrent;
mortal=Session.shortRest('mortal');
assert.equal(mortal.resources.primaryCurrent,survivorBefore+1,'Sobrevivente deve recuperar 1 Ponto de Sorte no Descanso Curto.');

let level5=Model.create({...base,id:'mortal-5',heroType:'Mortal Vidente',level:5,heroMark:'Ataque Extra',originChoices:{keyAttribute:'INT',skills:['Percepção','Investigação'],profession:'Mecânico'}});
store['mortal-5']=level5;
const level6=Evolution.preview('mortal-5');
assert.equal(level6.gain.originTalent,true);
const talent=level6.talentOptions.find(item=>!item.choice&&!Service.talentPrerequisite(level5,item));
assert(talent,'Deve existir ao menos um Talento elegível.');
assert(Evolution.validateChoice(level6,{skillMode:'custom',customSkillName:'Preparação Improvável'}).some(message=>/Engenhosidade/.test(message)));
level5=Evolution.apply('mortal-5',{skillMode:'custom',customSkillName:'Preparação Improvável',originTalentId:talent.id});
assert(level5.talents.some(item=>item.source==='Engenhosidade Humana'),'O Talento extra deve ser salvo pela evolução.');

function rapidChoices(data){
  const choices={};
  if(data.gain.skillRank)Object.assign(choices,{skillMode:'custom',customSkillName:'Skill rápida Rank '+data.gain.skillRank});
  if(data.gain.attributeAndTalent){
    const eligible=data.talentOptions.find(item=>!item.choice);
    assert(eligible,'A criação rápida precisa oferecer um Talento sem escolha complementar para o teste.');
    Object.assign(choices,{attribute:'FOR',talentId:eligible.id});
  }
  if(data.gain.attributeOrTalent)Object.assign(choices,{advancementChoice:'attribute',attribute:'FOR'});
  return choices;
}
function finishRapid(id,targetLevel){
  let decisions=0;
  for(let guard=0;guard<25;guard++){
    const progress=Evolution.advanceToDecision(id,targetLevel);
    if(progress.complete)return {character:progress.character,decisions};
    decisions++;
    Evolution.apply(id,rapidChoices(progress.data));
  }
  throw new Error('A criação acelerada não chegou ao nível alvo.');
}
let quick5=Model.create({...base,id:'quick-5',heroType:'Semideus Grego',affiliation:'Atena',divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra',level:1,creationTargetLevel:5});
store['quick-5']=quick5;
const quick5Result=finishRapid('quick-5',5);
assert.equal(quick5Result.character.level,5);
assert.equal(quick5Result.decisions,2,'Do nível 1 ao 5, só Skill do nível 3 e atributo/Talento do nível 4 devem interromper a criação.');
assert.equal(quick5Result.character.creationTargetLevel,0);
assert.equal(quick5Result.character.resources.pvCurrent,quick5Result.character.rules.pvMax,'Personagem recém-criado deve terminar com PV cheios no nível alvo.');

let quick15=Model.create({...base,id:'quick-15',heroType:'Semideus Grego',affiliation:'Atena',divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra',level:1,creationTargetLevel:15});
store['quick-15']=quick15;
const quick15Result=finishRapid('quick-15',15);
assert.equal(quick15Result.character.level,15);
assert.equal(quick15Result.decisions,7,'Uma ficha de nível 15 deve pedir 4 Skills e 3 escolhas de atributo/Talento, não 14 evoluções.');

let quick20=Model.create({...base,id:'quick-20',heroType:'Semideus Grego',affiliation:'Atena',divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra',level:1,creationTargetLevel:20});
store['quick-20']=quick20;
const quick20Result=finishRapid('quick-20',20);
assert.equal(quick20Result.character.level,20);
assert.equal(quick20Result.decisions,10,'Uma ficha de nível 20 deve pedir apenas as 5 Skills e as 5 escolhas de atributo/Talento, não 19 evoluções.');
assert.equal(quick20Result.character.skills.length,5);

let legacy=Model.create({...base,id:'legacy',heroType:'Legado',affiliation:'Atena',divinePath:'Caminho da Estratégia',level:20,heroMark:'Ataque Extra',originChoices:{skills:['Percepção','Atletismo']}});
store.legacy=legacy;
const commandBefore=legacy.rules.specialResources.find(item=>item.id==='command').max;
const awakening=Session.abilityCatalog(legacy).find(item=>item.ability.name==='Sangue que Desperta');
legacy=Session.useOfficialAbility('legacy',awakening.key);
const commandAwake=legacy.rules.specialResources.find(item=>item.id==='command').max;
assert.equal(legacy.rules.legacyAwakened,true);
assert(commandAwake>commandBefore,'Sangue que Desperta deve restaurar temporariamente o teto cheio da Assinatura.');
assert(legacy.session.activeEffects.some(effect=>effect.kind==='legacy-awakening'));
const freeRankA=Session.abilityCatalog(legacy).find(item=>item.group==='path'&&item.ability.rank==='A');
assert(freeRankA,'O Caminho herdado deve fornecer uma habilidade de Rank A.');
const mpBeforeFree=legacy.resources.primaryCurrent;
legacy=Session.useOfficialAbility('legacy',freeRankA.key);
assert.equal(legacy.resources.primaryCurrent,mpBeforeFree,'A primeira habilidade de Rank A do Caminho deve ser gratuita durante Sangue que Desperta.');
assert.equal(legacy.session.legacyAwakeningFreeUsed,true);
legacy=Session.useOfficialAbility('legacy',freeRankA.key);
assert.equal(legacy.resources.primaryCurrent,mpBeforeFree-Number(freeRankA.ability.cost),'O segundo uso de Rank A deve voltar a pagar o custo normal.');

const dom=new JSDOM('<!doctype html><header class="topbar"><h1>Compêndio</h1></header><main class="content"></main><button data-go="compendio"></button>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;window.scrollTo=()=>{};window.requestAnimationFrame=callback=>callback();window.SemideusesOriginCatalog=context.SemideusesOriginCatalog;window.SemideusesRulesDatabase=db;
window.eval(fs.readFileSync(path.join(root,'assets/compendium.js'),'utf8'));
window.dispatchEvent(new window.Event('load'));
setTimeout(()=>{
  const cards=[...window.document.querySelectorAll('[data-compendium-open]')];
  ['Sátiro / Fauno','Ciclope','Mortal Vidente','Legado'].forEach(name=>assert(cards.some(card=>card.dataset.compendiumOpen===name),'Compêndio deve listar '+name+'.'));
  cards.find(card=>card.dataset.compendiumOpen==='Ciclope').click();
  window.document.querySelector('[data-comp-tab="abilities"]').click();
  assert(window.document.body.textContent.includes('Força Sobre-humana'));
  assert(![...window.document.querySelectorAll('[data-comp-tab]')].some(tab=>tab.textContent==='Caminhos'),'Ciclope não deve mostrar uma aba de Caminhos vazia.');
  dom.window.close();
  console.log('heroes-beyond-blood-complete.test: OK');
},10);
