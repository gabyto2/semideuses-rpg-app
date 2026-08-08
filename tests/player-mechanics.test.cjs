const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const context={console};context.window=context;
context.SemideusesRules={
  modifier:v=>Math.floor((Number(v||10)-10)/2),
  proficiency:l=>l<=4?2:l<=8?3:l<=12?4:l<=16?5:6,
  rankCost:(r,b)=>{let c={E:1,D:2,C:4,B:6,A:8,S:12,SS:16,'Lendário':24}[r];return b&&r==='C'?Math.max(1,c-1):c;}
};
context.SemideusesRulesDatabase={affiliations:{},getAffiliation(){return null;}};
context.SemideusesCharacter={
  version:'base',attributes:['FOR','DES','CON','INT','SAB','CAR'],schemaVersion:5,
  clone:v=>JSON.parse(JSON.stringify(v)),uid:(p='id')=>p+'-'+Math.random().toString(36).slice(2),
  cleanSkills:source=>(source||[]).map(s=>({id:s.id||'s',name:s.name||'',cost:Number(s.cost||0),resourceId:s.resourceId||'primary',rank:s.rank||'',description:s.description||''})),
  normalize(c){c=JSON.parse(JSON.stringify(c||{}));c.attributes=c.attributes||{FOR:10,DES:10,CON:10,INT:10,SAB:10,CAR:10};c.level=Number(c.level||1);c.skills=(c.skills||[]).map(s=>({id:s.id||'s',name:s.name||'',cost:Number(s.cost||0),resourceId:s.resourceId||'primary',rank:s.rank||'',description:s.description||''}));c.rules=c.rules||{};c.rules.proficiency=context.SemideusesRules.proficiency(c.level);c.rules.casting=c.rules.casting||'SAB';c.resources=c.resources||{primaryCurrent:20};return c;},
  calculate(c){return context.SemideusesCharacter.normalize(c);},create(o){return context.SemideusesCharacter.normalize(o||{});}
};
function load(file){const full=path.join(root,file);vm.runInContext(fs.readFileSync(full,'utf8'),context,{filename:file});}
vm.createContext(context);
load('assets/rules-skills.js');
load('assets/rules-talents.js');
assert.equal(context.SemideusesRulesDatabase.listSkills().length,32,'32 Skills oficiais');
assert.equal(context.SemideusesRulesDatabase.listTalents().length,74,'74 Talentos oficiais');
assert.deepEqual(Object.fromEntries(['Combate','Perícia','Resistência','Divino'].map(c=>[c,context.SemideusesRulesDatabase.talentsByCategory(c).length])),{Combate:26,'Perícia':19,'Resistência':14,Divino:15});
load('assets/player-mechanics-extension.js');
const Model=context.SemideusesCharacter;
let c=Model.normalize({id:'a',level:5,attributes:{FOR:12,DES:18,CON:16,INT:10,SAB:14,CAR:8},rules:{casting:'SAB'},officialSkillProficiencies:['Percepção','Atletismo'],skills:[],talents:[]});
assert.equal(c.rules.armorClass,13,'CA usa 10 + mod CON, não DES');
assert.equal(c.rules.defenseAttribute,'CON');
assert.equal(Model.pericia(c,'Percepção').bonus,5,'SAB +2 e prof +3');
assert.equal(c.rules.passivePerception,15);
assert.equal(c.rules.initiative,6,'DES +4 + 2 da origem');
assert.equal(c.rules.abilityDC,13,'8 + prof3 + SAB2');
assert.equal(c.rules.castingAttackBonus,5);
c=Model.normalize({...c,periciaExpertise:['Percepção']});
assert.equal(Model.pericia(c,'Percepção').bonus,8,'Especialização soma proficiência duas vezes');
assert.equal(c.rules.passivePerception,18);
c=Model.normalize({...c,talents:[{id:'t1',catalogId:'armadura-natural',name:'Armadura Natural',level:5}]});
assert.equal(c.rules.armorClass,15,'Armadura Natural usa 12 + mod CON no override');

const store={a:c};
context.SemideusesCharacterService={
  get(id){return store[id]?Model.normalize(store[id]):null;},
  update(id,fn){let cur=this.get(id);let result=fn(Model.clone(cur))||cur;store[id]=Model.normalize(result);return Model.clone(store[id]);},
  removeSkill(id,sid){return this.update(id,c=>{c.skills=(c.skills||[]).filter(s=>s.id!==sid);return c;})}
};
load('assets/player-mechanics-service.js');
const Service=context.SemideusesCharacterService;
let saved=Service.setPericiaState('a','Atletismo','expertise');
assert.equal(Model.pericia(saved,'Atletismo').expertise,true);
saved=Service.setPericiaState('a','Atletismo','untrained');
assert.equal(Model.pericia(saved,'Atletismo').proficient,true,'proficiência oficial não pode ser removida');
assert.equal(Model.pericia(saved,'Atletismo').expertise,false);
let skill=Service.learnCatalogSkill('a','estocada-elemental','trained');
assert(skill.skills.some(s=>s.catalogId==='estocada-elemental'));
assert.equal(skill.skills.find(s=>s.catalogId==='estocada-elemental').rank,'E');
let talented=Service.addTalent('a','especialista','Percepção',5);
assert.equal(Model.pericia(talented,'Percepção').expertise,true);
console.log('player-mechanics.test: OK');