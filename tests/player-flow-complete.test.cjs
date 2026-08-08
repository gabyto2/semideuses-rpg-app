const fs=require('fs');
const vm=require('vm');
const path=require('path');
const assert=require('assert');
const root=path.resolve(__dirname,'../assets');
const context={console,CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;}};
context.window=context;context.dispatchEvent=function(){};
context.SemideusesRules={modifier:v=>Math.floor((Number(v||10)-10)/2),rankCost:(rank,bonus)=>({E:1,D:2,C:bonus?3:4,B:6,A:8,S:12}[rank]||0)};
function clone(v){return JSON.parse(JSON.stringify(v));}
const affiliations={
  Atena:{id:'atena',name:'Atena',casting:'INT',hitDie:8,mechanicalStatus:'complete',skillProficiencies:['História'],savingThrows:['INT','SAB'],weaponProficiencies:[],armorProficiencies:[],progression:{3:['Caminho','Skill Rank D']},signature:{name:'Plano de Batalha',universalCosts:[{cost:1,effect:'Avançar: mover aliado.'},{cost:1,effect:'Guarda: +5 CA.'},{cost:2,effect:'Golpe Ordenado: ataque.'},{cost:3,effect:'Ofensiva Total: turno completo.'}]},abilities:[{level:1,name:'Ordem',rank:'E',cost:1,action:'Ação Bônus',effect:'Gera Comando.'},{level:15,name:'Contra-Ordem',rank:'A',cost:8,action:'Reação',effect:'Gaste 3 de Comando.'}],paths:[{id:'estrategia',name:'Caminho da Estratégia',summary:'Comando.',abilities:[]}]},
  Hipnos:{id:'hipnos',name:'Hipnos',casting:'SAB',hitDie:8,mechanicalStatus:'complete',skillProficiencies:[],savingThrows:[],weaponProficiencies:[],armorProficiencies:[],progression:{},signature:{name:'Sonolência'},abilities:[],paths:[]},
  Eros:{id:'eros',name:'Eros',casting:'CAR',hitDie:6,mechanicalStatus:'complete',skillProficiencies:[],savingThrows:[],weaponProficiencies:[],armorProficiencies:[],progression:{},signature:{name:'Vínculos'},abilities:[],paths:[]}
};
context.SemideusesRulesDatabase={affiliations,getAffiliation(name){return this.affiliations[name]?clone(this.affiliations[name]):null;},listCompleteAffiliations(){return Object.values(this.affiliations).map(clone);},heroMarks:[{name:'Ataque Extra',description:'Dois ataques.'},{name:'Bônus de Conjuração',description:'Rank C reduzido.'}]};
function baseCalculate(raw){
  const c=clone(raw||{});const a=affiliations[c.affiliation]||{};c.level=Number(c.level||1);c.attributes=Object.assign({FOR:10,DES:10,CON:10,INT:14,SAB:14,CAR:14},c.attributes||{});c.resources=Object.assign({pvCurrent:10,primaryCurrent:20,mpCurrent:20,special:{},conditions:[],tempHp:0,hitDiceCurrent:c.level},c.resources||{});
  const specials=c.affiliation==='Atena'?[{id:'command',label:'Comando',kind:'counter',min:0,max:8}]:c.affiliation==='Hipnos'?[{id:'drowsiness',label:'Sonolência',kind:'target-counter',min:0,max:3}]:[];
  c.rules={affiliationId:a.id,casting:a.casting,hitDie:a.hitDie,skillProficiencies:(a.skillProficiencies||[]).slice(),paths:clone(a.paths||[]),abilities:clone(a.abilities||[]),signature:clone(a.signature||{}),progression:clone(a.progression||{}),specialResources:specials,primaryResource:{id:'mp',label:'MP'},pvMax:10+c.level*5,primaryMax:20+c.level*2,proficiency:2};
  specials.forEach(d=>{c.resources.special[d.id]=c.resources.special[d.id]||{id:d.id,label:d.label,kind:d.kind,current:0};});
  c.skills=c.skills||[];c.background=c.background||'';c.divinePath=c.divinePath||'';c.heroMark=c.heroMark||'';c.id=c.id||'x';return c;
}
let uidN=0;
context.SemideusesCharacter={
  schemaVersion:5,attributes:['FOR','DES','CON','INT','SAB','CAR'],clone,uid:p=>(p||'id')+(++uidN),
  calculate:baseCalculate,normalize:baseCalculate,create:o=>baseCalculate(Object.assign({id:'new',level:1},o||{})),
  validate:c=>({valid:!!c.background,errors:c.background?[]:[{code:'required-background',message:'Escolha Antecedente'}],character:baseCalculate(c)}),
  cleanSkills:s=>(s||[]).map(clone),
  resourceState(c,type){c=baseCalculate(c);if(type==='primary')return {id:'mp',label:'MP',current:c.resources.primaryCurrent,max:c.rules.primaryMax,kind:'pool'};const id=String(type).replace('special:','');const d=c.rules.specialResources.find(x=>x.id===id);const s=c.resources.special[id];return d&&s?Object.assign({},d,s):null;},
  adjustResource(c,type,amount){c=baseCalculate(c);if(type==='primary'){c.resources.primaryCurrent=Math.max(0,Math.min(c.rules.primaryMax,c.resources.primaryCurrent+amount));c.resources.mpCurrent=c.resources.primaryCurrent;return c;}const id=String(type).replace('special:','');const d=c.rules.specialResources.find(x=>x.id===id);c.resources.special[id].current=Math.max(d.min,Math.min(d.max,c.resources.special[id].current+amount));return c;},
  setResource(c,type,value){const state=this.resourceState(c,type);return this.adjustResource(c,type,value-state.current);}
};
function load(name){vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});}
vm.createContext(context);
load('rules-backgrounds.js');
load('background-model-extension.js');
assert.equal(context.SemideusesRulesDatabase.listBackgrounds().length,10);
let athlete=context.SemideusesCharacter.create({id:'ath',affiliation:'Atena',background:'Atleta'});
assert(athlete.rules.skillProficiencies.includes('Atletismo'));
assert.equal(athlete.rules.backgroundTrait.name,'Segundo Fôlego');
const store={ath:athlete};
context.SemideusesCharacterService={
 get(id){return store[id]?context.SemideusesCharacter.normalize(store[id]):null;},
 update(id,mutator){const result=mutator(this.get(id));store[id]=context.SemideusesCharacter.normalize(result);return clone(store[id]);},
 adjustSpecialResource(id,r,delta){return this.update(id,c=>context.SemideusesCharacter.adjustResource(c,'special:'+r,delta));},
 applyDamage(id,amount){return this.update(id,c=>{c.resources.pvCurrent=Math.max(0,c.resources.pvCurrent-amount);return c;});}
};
context.SemideusesSessionRuntime={
 canUseOfficialAbility(c,key){const ability=c.rules.abilities.find(a=>a.name===key);return {allowed:!!ability,reason:'',cost:ability?ability.cost:0,item:ability?{ability}:null};},
 useOfficialAbility(id,key){return context.SemideusesCharacterService.update(id,c=>context.SemideusesCharacter.adjustResource(c,'primary',-c.rules.abilities.find(a=>a.name===key).cost));},
 nextRound(id){return context.SemideusesCharacterService.update(id,c=>{c.session=c.session||{};c.session.round=(c.session.round||0)+1;return c;});},
 shortRest:id=>context.SemideusesCharacterService.get(id),longRest:id=>context.SemideusesCharacterService.get(id)
};
load('target-runtime.js');
load('signature-runtime.js');
load('background-runtime.js');
load('evolution-runtime.js');
let atena=context.SemideusesCharacter.create({id:'atena',affiliation:'Atena',background:'Atleta',level:15,divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra'});atena.resources.special.command.current=3;store.atena=atena;
assert.equal(context.SemideusesSignatureRuntime.actions(atena).length,4);
assert.equal(context.SemideusesSignatureRuntime.actions(atena)[0].name,'Avançar');
let cc=context.SemideusesSessionRuntime.canUseOfficialAbility(store.atena,'Contra-Ordem');assert.equal(cc.allowed,true);assert.equal(cc.specialCost.cost,3);
let used=context.SemideusesSessionRuntime.useOfficialAbility('atena','Contra-Ordem');assert.equal(used.resources.special.command.current,0);
store.hip=context.SemideusesCharacter.create({id:'hip',affiliation:'Hipnos',background:'Atleta'});
context.SemideusesTargetRuntime.addTarget('hip','drowsiness',{name:'Guarda'});
let target=context.SemideusesTargetRuntime.list(store.hip,'drowsiness')[0];
context.SemideusesTargetRuntime.adjustTarget('hip','drowsiness',target.id,5);
assert.equal(context.SemideusesTargetRuntime.list(store.hip,'drowsiness')[0].current,3);
store.eros=context.SemideusesCharacter.create({id:'eros',affiliation:'Eros',background:'Atleta'});
context.SemideusesTargetRuntime.addTarget('eros','bonds',{first:'A',second:'B',type:'Guardião'});
assert.equal(context.SemideusesTargetRuntime.list(store.eros,'bonds')[0].type,'Guardião');
store.ath.resources.pvCurrent=1;
let healed=context.SemideusesBackgroundRuntime.use('ath');assert(healed.resources.pvCurrent>1);
let lvl2=context.SemideusesCharacter.create({id:'lvl',affiliation:'Atena',background:'Atleta',level:2});lvl2.resources.pvCurrent=4;lvl2.resources.primaryCurrent=7;store.lvl=lvl2;
let pv=context.SemideusesEvolutionRuntime.preview('lvl');assert.equal(pv.nextLevel,3);assert.equal(pv.gain.skillRank,'D');
let evolved=context.SemideusesEvolutionRuntime.apply('lvl',{divinePath:'Caminho da Estratégia',skillMode:'custom',customSkillName:'Tática Menor'});
assert.equal(evolved.level,3);assert.equal(evolved.resources.pvCurrent,4);assert.equal(evolved.resources.primaryCurrent,7);assert.equal(evolved.skills[0].rank,'D');
console.log('player-flow-complete.test: OK');
