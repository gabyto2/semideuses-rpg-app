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
window.eval(source('master-runtime.js'));
window.eval(source('encounter-calculator.js'));

const Bestiary=window.SemideusesBestiary;
const Runtime=window.SemideusesMasterRuntime;
const Calculator=window.SemideusesEncounterCalculator;
const creatures=Bestiary.all();

assert.equal(Calculator.read().catalogOpen,false,'O catálogo extenso deve iniciar recolhido.');

assert.equal(creatures.length,27,'A primeira fase deve catalogar as 27 entradas das páginas 83–94.');
assert(creatures.every(creature=>creature.page>=83&&creature.page<=94),'Toda entrada deve apontar para uma página do trecho oficial catalogado.');
const incomplete=creatures.filter(creature=>creature.pv==null||creature.ca==null);
assert.deepEqual(incomplete.map(creature=>creature.id),['mortal-conhecimento'],'Somente o modelo escalável pode ficar sem valores exatos.');
assert.equal(Bestiary.get('estrige').threat,100,'ND 1/2 deve valer 100 VA.');
assert.equal(Bestiary.get('lestrigao').threat,1100,'ND 4 deve valer 1.100 VA.');
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

dom.window.close();
console.log('bestiary-calculator.test: OK');
