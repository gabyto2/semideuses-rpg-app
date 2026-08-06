const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const root=path.resolve(__dirname,'..');
const names=['Zeus','Poseidon','Hades','Atena','Ares','Apolo','Hermes','Hefesto','Afrodite','Deméter','Dionísio','Ártemis','Hécate','Íris','Nêmesis','Hipnos','Morfeu','Nike','Tique','Tânatos','Éolo','Circe','Perséfone','Hebe','Eros','Nyx'];
const context={console,CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;}};
context.window=context;
context.dispatchEvent=function(){};
context.SemideusesRules={
  modifier:value=>Math.floor((Number(value||10)-10)/2),
  proficiency:level=>level<=4?2:level<=8?3:level<=12?4:level<=16?5:6,
  maxHP:(level,die,con)=>Number(die)+(level-1)*Math.ceil(Number(die)/2)+level*Math.floor((Number(con)-10)/2),
  maxMP:(level,score)=>Math.max(0,6+Math.floor((Number(score)-10)/2)+(level-1)*(2+Math.floor((Number(score)-10)/2)))
};
const affiliations={};
names.forEach(name=>{
  affiliations[name]={
    id:name.toLowerCase(),name,mechanicalStatus:'complete',casting:name==='Hebe'?'CON':'SAB',hitDie:8,
    savingThrows:[],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],
    progression:{},signature:null,abilities:[],paths:[{name:'Caminho de Teste'}]
  };
});
context.SemideusesRulesDatabase={
  affiliations,
  getAffiliation(name){const value=this.affiliations[name];return value&&value.mechanicalStatus==='complete'?JSON.parse(JSON.stringify(value)):null;}
};
vm.createContext(context);
function load(relative){const file=path.join(root,relative);vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});}
load('assets/rules-resource-definitions.js');
load('assets/character-model.js');

const Model=context.SemideusesCharacter;
assert(Model,'modelo carregado');

let hebe=Model.create({name:'Hebe Teste',affiliation:'Hebe',level:5,background:'Atleta',divinePath:'Caminho de Teste',heroMark:'Ataque Extra'});
assert.equal(hebe.rules.primaryResource.id,'vigor');
assert.equal(hebe.rules.primaryMax,10);
assert.equal(hebe.rules.manaMax,0);
assert.equal(hebe.resources.primaryCurrent,10);
assert.equal(hebe.resources.vigorCurrent,10);
assert.equal(hebe.resources.mpCurrent,10,'alias de compatibilidade');
hebe=Model.adjustResource(hebe,'mp',-3);
assert.equal(hebe.resources.vigorCurrent,7,'ajuste legado MP roteado para Vigor');

let ares=Model.create({name:'Ares Teste',affiliation:'Ares',background:'Atleta'});
assert.equal(ares.resources.special.fury.current,0);
assert.equal(ares.rules.specialResources.find(resource=>resource.id==='fury').max,10);
ares=Model.setResource(ares,'special:fury',99);
assert.equal(ares.resources.special.fury.current,10);

let poseidon=Model.create({name:'Poseidon Teste',affiliation:'Poseidon',background:'Atleta'});
poseidon=Model.setResource(poseidon,'special:tide',-9);
assert.equal(poseidon.resources.special.tide.current,-3);
poseidon=Model.adjustResource(poseidon,'special:tide',8);
assert.equal(poseidon.resources.special.tide.current,3);

let invalid=Model.create({name:'',affiliation:'Ares',level:5,background:'',divinePath:'',heroMark:''});
let validation=Model.validate(invalid);
assert.equal(validation.valid,false);
assert(validation.errors.some(error=>error.code==='required-name'));
assert(validation.errors.some(error=>error.code==='required-background'));
assert(validation.errors.some(error=>error.code==='required-path'));
assert(validation.errors.some(error=>error.code==='required-hero-mark'));

let valid=Model.create({name:'Completo',affiliation:'Ares',level:5,background:'Atleta',divinePath:'Caminho de Teste',heroMark:'Ataque Extra'});
assert.equal(Model.validate(valid).valid,true);

console.log('core-resources.test: OK');
