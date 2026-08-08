const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const clone=value=>JSON.parse(JSON.stringify(value));
function baseNormalize(character){
  const c=clone(character||{});
  c.id=c.id||'helena';
  c.level=Number(c.level||5);
  c.attributes=c.attributes||{FOR:16,DES:12,CON:14,INT:10,SAB:12,CAR:10};
  c.talents=c.talents||[];
  c.rules=c.rules||{};
  c.rules.proficiency=3;
  c.rules.weaponProficiencies=c.rules.weaponProficiencies||['Armas simples','Armas marciais'];
  c.rules.armorProficiencies=c.rules.armorProficiencies||[];
  c.rules.armorClassBase=12;
  c.rules.armorClassFormula='10 + mod CON';
  c.inventory=c.inventory||[];
  c.currency=c.currency||{dracmas:0};
  c.equipmentSlots=c.equipmentSlots||{armor:null,shield:null,mainHand:null,offHand:null};
  return c;
}

const ctx={console};
ctx.window=ctx;
ctx.SemideusesRules={
  modifier:value=>Math.floor((Number(value||10)-10)/2),
  proficiency:()=>3
};
ctx.SemideusesRulesDatabase={affiliations:{},getTalent(){return null;}};
ctx.SemideusesCharacter={
  clone,
  uid:(prefix='id')=>prefix+'-'+Math.random().toString(36).slice(2),
  normalize:baseNormalize,
  calculate:baseNormalize,
  create:baseNormalize
};
function load(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});}
vm.createContext(ctx);
load('assets/rules-equipment.js');
load('assets/equipment-model-extension.js');

const Model=ctx.SemideusesCharacter;
const store={helena:Model.normalize({id:'helena'})};
ctx.SemideusesCharacterService={
  get(id){return store[id]?Model.normalize(store[id]):null;},
  update(id,fn){const current=this.get(id);const output=fn(Model.clone(current))||current;store[id]=Model.normalize(output);return this.get(id);}
};
load('assets/equipment-service.js');
const Service=ctx.SemideusesCharacterService;

let saved=Service.addCustomItem('helena',{
  catalogId:'lanca',
  name:'Kudayari',
  damageType:'Perfurante ou Cortante',
  properties:'Versátil (1d10), Arremessável (6/18m), Longa',
  notes:'Lança com ponta giratória.'
});
let weapon=saved.inventory.find(item=>item.name==='Kudayari');
assert(weapon,'A arma personalizada deve entrar no Inventário.');
let definition=Model.equipmentDefinition(weapon);
assert.equal(definition.name,'Kudayari');
assert.equal(definition.damage,'1d8');
assert.equal(definition.damageType,'Perfurante ou Cortante');
assert(definition.properties.includes('Versátil (1d10)'));
assert.equal(definition.training,'Marcial');

saved=Service.equipItem('helena',weapon.id,'mainHand');
saved=Service.setWeaponWieldMode('helena',weapon.id,'two');
assert.equal(saved.rules.equipment.attacks[0].name,'Kudayari');
assert.equal(saved.rules.equipment.attacks[0].damage,'1d10 + 3');
assert.equal(saved.rules.equipment.attacks[0].damageType,'Perfurante ou Cortante');

saved=Service.addCustomItem('helena',{name:'Pote de sementes',type:'misc',notes:'Item simples sem regra de combate.'});
assert(saved.inventory.some(item=>item.name==='Pote de sementes'&&item.type==='misc'));
console.log('custom-items.test: OK');
