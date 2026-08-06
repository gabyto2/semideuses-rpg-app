const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const root=path.resolve(__dirname,'..');
const context={console,CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;}};
context.window=context;
context.dispatchEvent=function(){};
context.SemideusesRules={
  modifier:value=>Math.floor((Number(value||10)-10)/2),
  proficiency:level=>level<=4?2:level<=8?3:level<=12?4:level<=16?5:6,
  maxHP:(level,die,con)=>Math.max(1,Number(die)+Math.floor((Number(con)-10)/2)+(level-1)*(Math.ceil(Number(die)/2)+Math.floor((Number(con)-10)/2))),
  maxMP:(level,score)=>Math.max(0,6+Math.floor((Number(score)-10)/2)+(level-1)*(2+Math.floor((Number(score)-10)/2)))
};
function ability(level,name,rank,cost,action,effect){return {level,name,rank,cost,action,effect};}
const affiliations={
  Ares:{id:'ares',name:'Ares',mechanicalStatus:'complete',casting:'FOR',hitDie:12,savingThrows:[],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],signature:{name:'Fúria'},progression:{},abilities:[
    ability(1,'Talho Brutal','E',1,'Ação','Ataque simples.'),
    ability(5,'Investida Sangrenta','C',4,'Ação','2 usos por dia. Ataque de teste.'),
    ability(10,'Pele de Guerra','Passiva',null,'Passiva','Sempre ativa.')
  ],paths:[{id:'furia',name:'Caminho da Fúria',abilities:[ability(3,'Golpe Frenético','D',2,'Ação','Golpe do caminho.')]}]},
  Hebe:{id:'hebe',name:'Hebe',mechanicalStatus:'complete',casting:'CON',hitDie:8,savingThrows:[],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],signature:{name:'Vigor'},progression:{},abilities:[ability(1,'Refresco','E',1,'Ação Bônus','Cura.')],paths:[]}
};
context.SemideusesRulesDatabase={affiliations,getAffiliation(name){const value=this.affiliations[name];return value?JSON.parse(JSON.stringify(value)):null;}};
vm.createContext(context);
function load(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});}
load('assets/rules-resource-definitions.js');
load('assets/character-model.js');
const Model=context.SemideusesCharacter;
const store={};
context.SemideusesCharacterService={
  get(id){return store[id]?Model.normalize(store[id]):null;},
  update(id,mutator){const current=this.get(id);if(!current)throw new Error('Personagem não encontrado.');const result=mutator(Model.clone(current))||current;store[id]=Model.normalize(result);return Model.clone(store[id]);}
};
load('assets/session-runtime.js');
const Runtime=context.SemideusesSessionRuntime;

let ares=Model.create({id:'ares1',name:'Guerreiro',affiliation:'Ares',level:5,background:'Atleta',divinePath:'Caminho da Fúria',heroMark:'Bônus de Conjuração'});
ares.resources.pvCurrent=ares.rules.pvMax-7;
store[ares.id]=ares;
let started=Runtime.startCombat(ares.id);
assert.equal(started.session.inCombat,true);
assert.equal(started.session.round,1);
assert.equal(started.resources.special.fury.current,7);
let catalog=Runtime.abilityCatalog(started);
assert(catalog.some(item=>item.ability.name==='Golpe Frenético'));
let investida=catalog.find(item=>item.ability.name==='Investida Sangrenta');
let check=Runtime.canUseOfficialAbility(started,investida.key);
assert.equal(check.cost,3,'Marca reduz Rank C em 1');
let beforePrimary=started.resources.primaryCurrent;
let used=Runtime.useOfficialAbility(ares.id,investida.key);
assert.equal(used.resources.primaryCurrent,beforePrimary-3);
assert.equal(used.session.abilityUses.day[investida.key],1);
used=Runtime.useOfficialAbility(ares.id,investida.key);
assert.equal(used.session.abilityUses.day[investida.key],2);
assert.throws(()=>Runtime.useOfficialAbility(ares.id,investida.key),/Sem usos restantes/);
let undone=Runtime.undoLastAction(ares.id);
assert.equal(undone.session.abilityUses.day[investida.key],1);
assert.equal(undone.resources.primaryCurrent,beforePrimary-3);
let round=Runtime.nextRound(ares.id);
assert.equal(round.session.round,2);
let ended=Runtime.endCombat(ares.id);
assert.equal(ended.session.inCombat,false);
assert.equal(ended.resources.special.fury.current,0);

let hebe=Model.create({id:'hebe1',name:'Copeira',affiliation:'Hebe',level:5,background:'Atleta'});
hebe.resources.primaryCurrent=0;hebe.resources.vigorCurrent=0;hebe.resources.mpCurrent=0;
hebe.resources.pvCurrent=1;hebe.resources.hitDiceCurrent=0;
hebe.resources.conditions=['Cego','Exausto'];hebe.resources.condition='Cego';hebe.resources.exhaustionLevel=2;
store[hebe.id]=hebe;
let short=Runtime.shortRest(hebe.id);
assert.equal(short.resources.primaryCurrent,5,'Hebe recupera metade do Vigor no curto');
let long=Runtime.longRest(hebe.id);
assert.equal(long.resources.primaryCurrent,10);
assert.equal(long.resources.pvCurrent,long.rules.pvMax);
assert.equal(long.resources.hitDiceCurrent,3,'recupera metade arredondada para cima');
assert.deepEqual(Array.from(long.resources.conditions),['Exausto']);
assert.equal(long.resources.exhaustionLevel,1);

console.log('session-runtime.test: OK');
