const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert');

const root=path.resolve(__dirname,'..');
const context={console,CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;}};
context.window=context;
context.dispatchEvent=()=>{};
context.addEventListener=()=>{};
vm.createContext(context);

function load(file){
  const absolute=path.join(root,file);
  vm.runInContext(fs.readFileSync(absolute,'utf8'),context,{filename:absolute});
}

[
  'assets/rules-engine.js','assets/rules-conditions.js','assets/rules-origins.js','assets/rules-database.js',
  'assets/rules-atena.js','assets/rules-resource-definitions.js','assets/rules-backgrounds.js',
  'assets/rules-skills.js','assets/rules-talents.js','assets/rules-equipment.js',
  'assets/character-model.js','assets/origin-model-extension.js','assets/background-model-extension.js',
  'assets/player-mechanics-extension.js','assets/equipment-model-extension.js'
].forEach(load);

const Model=context.SemideusesCharacter;
const Catalog=context.SemideusesOriginCatalog;
const base={
  name:'Herói de teste',background:'Atleta',level:5,heroMark:'Ataque Extra',
  attributes:{FOR:16,DES:14,CON:14,INT:12,SAB:16,CAR:10}
};

assert.equal(Catalog.list().length,5);
assert(Catalog.list().every(origin=>origin.implemented),'As cinco Naturezas devem estar disponíveis.');

let satyr=Model.create({...base,heroType:'Sátiro / Fauno',originChoices:{expertise:'Atletismo'}});
assert.equal(satyr.affiliation,'');
assert.equal(satyr.divinePath,'Caminho da Natureza Selvagem');
assert.equal(satyr.rules.hitDie,8);
assert.equal(satyr.rules.primaryResource.label,'MP Natural');
assert.equal(satyr.rules.primaryMax,29);
assert.deepEqual(Array.from(satyr.officialSaveProficiencies),['DES','SAB']);
assert(Model.pericia(satyr,'Atletismo').expertise,'Pés de Bode deve aplicar a Especialização escolhida.');
assert.equal(Model.validate(satyr).valid,true);

let cyclops=Model.create({...base,heroType:'Ciclope'});
assert.equal(cyclops.rules.hitDie,12);
assert.equal(cyclops.rules.pvMax,50);
assert.equal(cyclops.rules.primaryResource.kind,'none');
assert.equal(cyclops.rules.primaryMax,0);
assert.equal(cyclops.rules.armorClass,14,'Couro Grosso deve conceder +2 CA sem armadura.');
assert.equal(cyclops.rules.equipment.carrying.limitKg,224,'Força Sobre-humana deve dobrar a carga.');
assert.deepEqual(Array.from(cyclops.rules.allowedHeroMarks),['Ataque Extra']);
assert.equal(Model.validate(cyclops).valid,true);
const invalidCyclops=Model.validate({...cyclops,heroMark:'Bônus de Conjuração'});
assert(invalidCyclops.errors.some(error=>error.code==='required-hero-mark'));

let mortal=Model.create({...base,heroType:'Mortal Vidente',level:2,heroMark:'',originChoices:{
  keyAttribute:'INT',skills:['Percepção','Investigação'],profession:'Investigador'
}});
assert.equal(mortal.rules.primaryResource.id,'luck');
assert.equal(mortal.rules.primaryMax,2,'Sorte deve ser igual ao Bônus de Proficiência.');
assert(mortal.rules.skillProficiencies.includes('Percepção'));
assert(mortal.rules.skillProficiencies.includes('Investigação'));
assert(Model.pericia(mortal,'Investigação').expertise,'Investigador deve especializar Investigação.');
assert.equal(Model.validate(mortal).valid,true);

let legacy=Model.create({...base,heroType:'Legado',affiliation:'Atena',divinePath:'Caminho da Estratégia',originChoices:{skills:['Percepção','Atletismo']}});
assert.equal(legacy.rules.hitDie,6,'O d8 de Atena deve cair um passo para d6 no Legado.');
assert.equal(legacy.rules.pvMax,32);
assert.equal(legacy.rules.primaryResource.label,'MP Diluído');
assert.equal(legacy.rules.primaryMax,13);
assert.equal(legacy.rules.maxSkillRank,'S');
assert.equal(legacy.rules.specialResources.find(resource=>resource.id==='command').max,3,'O teto da Assinatura deve ser reduzido à metade.');
const legacyPath=legacy.rules.paths.find(path=>path.name==='Caminho da Estratégia');
assert.equal(legacyPath.abilities[0].originalLevel,3);
assert.equal(legacyPath.abilities[0].level,5,'A primeira habilidade de Caminho do Legado chega no nível 5.');
assert.equal(Model.validate(legacy).valid,true);

legacy=Model.adjustResource(legacy,'primary',-4);
legacy=Model.adjustResource(legacy,'special:command',99);
assert.equal(legacy.resources.primaryCurrent,9);
assert.equal(legacy.resources.special.command.current,3);
legacy.resources.pvCurrent=7;
legacy=Model.calculate(legacy);
assert.equal(legacy.resources.pvCurrent,7,'Recalcular não pode curar o personagem.');
assert.equal(legacy.resources.primaryCurrent,9,'Recalcular não pode restaurar MP diluído.');

const missingSatyr=Model.validate(Model.create({...base,heroType:'Sátiro / Fauno',originChoices:{}}));
assert(missingSatyr.errors.some(error=>error.code==='required-satyr-expertise'));
const missingMortal=Model.validate(Model.create({...base,heroType:'Mortal Vidente',originChoices:{keyAttribute:'INT',skills:['Percepção']}}));
assert(missingMortal.errors.some(error=>error.code==='required-origin-skills'));
const missingLegacy=Model.validate(Model.create({...base,heroType:'Legado',affiliation:'Atena',originChoices:{skills:['Percepção','Atletismo']}}));
assert(missingLegacy.errors.some(error=>error.code==='required-path'));

console.log('origins-rules.test: OK');
