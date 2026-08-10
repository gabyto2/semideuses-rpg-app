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
window.eval(source('rules-bestiary-nd12.js'));
window.eval(source('rules-bestiary-final.js'));
window.eval(source('master-runtime.js'));
window.eval(source('encounter-calculator.js'));

const Bestiary=window.SemideusesBestiary;
const Runtime=window.SemideusesMasterRuntime;
const Calculator=window.SemideusesEncounterCalculator;
const creatures=Bestiary.all();

assert.equal(Calculator.read().catalogOpen,false,'O catálogo extenso deve iniciar recolhido.');

assert.equal(creatures.length,71,'O catálogo deve reunir todas as 71 entradas oficiais até ND 17.');
assert.equal(creatures.slice(27,52).length,25,'O bloco ND 5–8 deve manter suas 25 entradas.');
assert.equal(creatures.slice(52,64).length,12,'O bloco ND 9–12 deve conter 12 entradas oficiais.');
assert.equal(creatures.slice(64).length,7,'O bloco final ND 13–17 deve conter as sete entradas oficiais.');
assert(creatures.every(creature=>creature.page>=83&&creature.page<=123),'Toda ficha deve apontar para sua página no trecho oficial catalogado.');
const incomplete=creatures.filter(creature=>creature.pv==null||creature.ca==null);
assert.deepEqual(incomplete.map(creature=>creature.id),['mortal-conhecimento','basilisco','semideus-veterano'],'Somente as três lacunas explicitamente documentadas podem ficar sem valores exatos.');
assert.equal(Bestiary.get('estrige').threat,100,'ND 1/2 deve valer 100 VA.');
assert.equal(Bestiary.get('lestrigao').threat,1100,'ND 4 deve valer 1.100 VA.');
assert.equal(Bestiary.get('talos').threat,3900,'ND 8 deve valer 3.900 VA.');
assert.equal(Bestiary.get('drakon').threat,7200,'ND 12 deve valer 7.200 VA.');
assert.equal(Bestiary.get('aspecto-tifon').threat,13000,'ND 17 deve valer 13.000 VA.');
assert.equal(Bestiary.get('basilisco').catalogNd,'5','O Basilisco deve continuar localizável no bloco em que aparece.');
assert.equal(Bestiary.get('basilisco').threat,1800,'O Apêndice A deve corrigir o ND do Basilisco para 5.');
assert.equal(Bestiary.get('basilisco').pv,null,'O Apêndice não pode ser usado para inventar PV ausentes.');
assert.equal(Bestiary.list({nd:'6'}).length,6,'O filtro ND 6 deve devolver o bloco completo.');
assert.equal(Bestiary.list({nd:'7'}).length,5,'O filtro ND 7 deve devolver o bloco completo.');
assert.equal(Bestiary.list({nd:'8'}).length,6,'O filtro ND 8 deve incluir as cinco fichas fixas e o Veterano escalável.');
assert.equal(Bestiary.list({nd:'9'}).length,6,'O filtro ND 9 deve devolver as seis entradas oficiais.');
assert.equal(Bestiary.list({nd:'10'}).length,2,'O filtro ND 10 deve devolver as duas entradas oficiais.');
assert.equal(Bestiary.list({nd:'11'}).length,3,'O filtro ND 11 deve devolver as três entradas oficiais.');
assert.equal(Bestiary.list({nd:'12'}).length,1,'O filtro ND 12 deve devolver o Drakon.');
assert.equal(Bestiary.list({nd:'13'}).length,2,'O filtro ND 13 deve devolver Caríbdis Desperta e Gegenes.');
assert.equal(Bestiary.list({nd:'14'}).length,2,'O filtro ND 14 deve devolver Campe e Cérbero.');
assert.equal(Bestiary.list({nd:'15'}).length,2,'O filtro ND 15 deve devolver Cólera e Titã Menor.');
assert.equal(Bestiary.list({nd:'17'}).length,1,'O filtro ND 17 deve devolver o Aspecto de Tífon.');
assert.equal(Bestiary.list({query:'Mesa'}).filter(creature=>creature.environmental).length,4,'A busca deve encontrar os quatro encontros ambientais pelas orientações da Mesa.');
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

Calculator.setConfig({groupLevel:12,partySize:4,ndFilter:'12',catalogPage:4});
assert.equal(Calculator.read().ndFilter,'12','O filtro deve persistir NDs até 12.');
assert.equal(Calculator.read().catalogPage,4,'A página do catálogo deve persistir sem afetar o encontro.');
Calculator.add('drakon');
assert.equal(Calculator.calculate().rawThreat,7200);
Calculator.commitToEncounter();
assert(Runtime.read().combatants.some(enemy=>enemy.bestiaryId==='drakon'&&enemy.pvMax===230&&enemy.ca===18),'O Drakon deve entrar com PV e CA oficiais.');

Calculator.setConfig({groupLevel:17,partySize:5,ndFilter:'17'});
Calculator.add('aspecto-tifon');
Calculator.saveEncounter('Final contra Tífon');
assert.equal(Calculator.read().savedEncounters.length,1,'A preparação deve ser salva no aparelho.');
Calculator.clear();
Calculator.loadEncounter(Calculator.read().savedEncounters[0].id);
assert.equal(Calculator.calculate().rawThreat,13000,'Carregar um encontro deve restaurar as criaturas e o orçamento.');
assert.equal(Calculator.read().ndFilter,'17','O filtro final deve persistir até ND 17.');
Calculator.clear();

Calculator.add('cila');
Calculator.commitToEncounter();
const cila=Runtime.read().combatants.find(enemy=>enemy.bestiaryId==='cila');
assert(cila.notes.includes('seis cabeças'),'A Mesa deve preservar a orientação ambiental da Cila.');
assert.equal(cila.trackers[0].values.length,6,'A Mesa deve criar seis cabeças independentes.');
assert.equal(cila.trackers[0].values[0],25);
Runtime.adjustTracker(cila.id,'cabecas',-7,0);
assert.equal(Runtime.read().combatants.find(enemy=>enemy.id===cila.id).trackers[0].values[0],18,'O dano em uma cabeça deve persistir separadamente.');

Calculator.add('caribdis-desperta');
Calculator.commitToEncounter();
const awakened=Runtime.read().combatants.find(enemy=>enemy.bestiaryId==='caribdis-desperta');
assert.equal(awakened.ca,10,'A CA 10 deve representar apenas o intervalo vulnerável oficial.');
assert.equal(awakened.trackers.find(item=>item.id==='succao-devastadora').current,3,'Os três usos diários devem chegar à Mesa.');

dom.window.close();
console.log('bestiary-calculator.test: OK');
