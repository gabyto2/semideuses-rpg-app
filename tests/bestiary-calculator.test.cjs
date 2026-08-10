const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const clone=value=>JSON.parse(JSON.stringify(value));
const dom=new JSDOM('<!doctype html>',{url:'https://example.test/',runScripts:'outside-only'});
const window=dom.window;
let sequence=0;
window.SemideusesCharacter={clone,uid:prefix=>prefix+'-'+(++sequence),conditions:['Saudável','Abalado']};
window.SemideusesCharacterService={list:()=>[],get:()=>null};
window.eval(source('rules-bestiary-nd04.js'));
window.eval(source('rules-bestiary-nd08.js'));
window.eval(source('master-runtime.js'));
window.eval(source('encounter-calculator.js'));

const Bestiary=window.SemideusesBestiary;
const Runtime=window.SemideusesMasterRuntime;
const Calculator=window.SemideusesEncounterCalculator;
const creatures=Bestiary.all();

assert.equal(Calculator.read().catalogOpen,false,'O catálogo extenso deve iniciar recolhido.');

assert.equal(creatures.length,52,'O catálogo deve reunir 27 entradas até ND 4 e 25 entradas no bloco seguinte.');
assert.equal(creatures.filter(creature=>creature.page>=95&&creature.page<=112).length,25,'O bloco ND 5–8 deve conter as 25 entradas das páginas 95–112.');
assert(creatures.every(creature=>creature.page>=83&&creature.page<=112),'Toda entrada deve apontar para uma página do trecho oficial catalogado.');
const incomplete=creatures.filter(creature=>creature.pv==null||creature.ca==null);
assert.deepEqual(incomplete.map(creature=>creature.id),['mortal-conhecimento','basilisco','semideus-veterano'],'Somente as três lacunas explicitamente documentadas podem ficar sem valores exatos.');
assert.equal(Bestiary.get('estrige').threat,100,'ND 1/2 deve valer 100 VA.');
assert.equal(Bestiary.get('lestrigao').threat,1100,'ND 4 deve valer 1.100 VA.');
assert.equal(Bestiary.get('talos').threat,3900,'ND 8 deve valer 3.900 VA.');
assert.equal(Bestiary.get('basilisco').catalogNd,'5','O Basilisco deve continuar localizável no bloco em que aparece.');
assert.equal(Bestiary.get('basilisco').threat,null,'A lacuna do cabeçalho oficial não pode ser completada pela calculadora.');
assert.equal(Bestiary.list({nd:'6'}).length,6,'O filtro ND 6 deve devolver o bloco completo.');
assert.equal(Bestiary.list({nd:'7'}).length,5,'O filtro ND 7 deve devolver o bloco completo.');
assert.equal(Bestiary.list({nd:'8'}).length,6,'O filtro ND 8 deve incluir as cinco fichas fixas e o Veterano escalável.');
assert.equal(Bestiary.threatFor('30'),155000,'A tabela oficial de VA deve permanecer pronta até ND 30.');

const levelEight=Calculator.budgetFor(8,4);
assert.equal(levelEight.medium,1050,'O orçamento Médio de nível 8 deve aplicar +75% à base de nível 5–8.');
assert.equal(Calculator.quantityMultiplier(1),1);
assert.equal(Calculator.quantityMultiplier(2),1.5);
assert.equal(Calculator.quantityMultiplier(3),2);
assert.equal(Calculator.quantityMultiplier(16),4);

Calculator.setConfig({groupLevel:1,partySize:4});
Calculator.add('estrige');Calculator.add('estrige');Calculator.add('estrige');
let result=Calculator.calculate();
assert.equal(result.rawThreat,300);
assert.equal(result.multiplier,2);
assert.equal(result.adjustedThreat,600);
assert.equal(result.difficulty,'Épico');

Calculator.commitToEncounter();
const enemies=Runtime.read().combatants;
assert.equal(enemies.length,3,'As três criaturas devem entrar na Mesa.');
assert(enemies.every(enemy=>enemy.bestiaryId==='estrige'&&enemy.nd==='1/2'&&enemy.sourcePage===83),'A Mesa deve preservar a referência oficial de cada criatura.');
assert(enemies.every(enemy=>enemy.pvMax===14&&enemy.ca===13),'PV e CA devem vir da ficha oficial.');
assert(enemies.every(enemy=>enemy.initiative==null),'A iniciativa deve continuar como decisão do Mestre.');
assert.equal(Calculator.calculate().count,0,'A seleção deve ser limpa depois de enviada à Mesa.');
assert.throws(()=>Calculator.add('mortal-conhecimento'),/cadastro manual/,'O app não pode inventar valores para o modelo escalável.');
assert.throws(()=>Calculator.add('basilisco'),/cadastro manual/,'O app não pode inventar o cabeçalho ausente do Basilisco.');
assert.throws(()=>Calculator.add('semideus-veterano'),/cadastro manual/,'O app não pode interpolar a faixa do Semideus Veterano.');

Calculator.setConfig({groupLevel:8,partySize:4,ndFilter:'8'});
assert.equal(Calculator.read().ndFilter,'8','O filtro expandido deve persistir NDs até 8.');
Calculator.add('talos');
result=Calculator.calculate();
assert.equal(result.adjustedThreat,3900);
Calculator.commitToEncounter();
assert(Runtime.read().combatants.some(enemy=>enemy.bestiaryId==='talos'&&enemy.sourcePage===112),'Talos deve entrar na Mesa com a referência oficial.');

dom.window.close();
console.log('bestiary-calculator.test: OK');
