const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');
const context={console};context.window=context;context.SemideusesRules={rankCost:r=>({E:1,D:2,C:4,B:6,A:8,S:12,SS:16,'Lendário':24}[r])};
vm.createContext(context);function load(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});}
load('assets/skill-builder.js');
const B=context.SemideusesSkillBuilder;
let calc=B.calculate({rank:'C',axis:'Dano',activation:'Ação',area:true,condition:true});
assert.equal(calc.resultDice,'2d6','C 5d6 - área - condição = 2d6');
assert.equal(calc.mpCost,4);assert.equal(calc.training.baseCost,300);assert.equal(calc.training.weeks,4);
calc=B.calculate({rank:'C',axis:'Dano',activation:'Ação',melee:true});assert.equal(calc.resultDice,'7d6','corpo a corpo devolve um passo');
calc=B.calculate({rank:'D',axis:'Cura',activation:'Ação Bônus'});assert.equal(calc.resultDice,'2d6','Ação Bônus custa um passo');
assert.equal(B.training('B',true).cost,0);assert.equal(B.training('B',false).cost,600);

const store={a:{id:'a',affiliation:'Atena',heroMark:'',level:5,session:{inCombat:true,round:1,abilityUses:{},history:[]},resources:{primaryCurrent:20},rules:{primaryResource:{label:'MP'},abilities:[{level:1,name:'Poder A',rank:'C',cost:4,action:'Ação',effect:'x'}],paths:[]}}};
context.SemideusesCharacter={clone:v=>JSON.parse(JSON.stringify(v)),normalize:v=>JSON.parse(JSON.stringify(v))};
context.SemideusesCharacterService={get:id=>JSON.parse(JSON.stringify(store[id])),update(id,fn){let c=JSON.parse(JSON.stringify(store[id]));c=fn(c)||c;store[id]=c;return JSON.parse(JSON.stringify(c));}};
context.SemideusesSessionRuntime={canUseOfficialAbility(c){return {allowed:true,reason:'',item:{ability:c.rules.abilities[0]},cost:4};},useOfficialAbility(id){return context.SemideusesCharacterService.update(id,c=>{c.resources.primaryCurrent-=4;return c;});},canUseLearnedSkill(){return {allowed:true,skill:{id:'s',rank:'E',action:'Ação'},cost:1};},useLearnedSkill(id){return context.SemideusesCharacterService.update(id,c=>c);},startCombat:id=>context.SemideusesCharacterService.update(id,c=>{c.session.inCombat=true;return c;}),nextRound:id=>context.SemideusesCharacterService.update(id,c=>{c.session.round++;return c;}),endCombat:id=>context.SemideusesCharacterService.update(id,c=>{c.session.inCombat=false;return c;})};
context.SemideusesSignatureRuntime={actions:()=>[],spendAction(){}};
load('assets/action-economy-extension.js');
let c=context.SemideusesCharacterService.get('a');assert(context.SemideusesSessionRuntime.canUseOfficialAbility(c,'x').allowed);
context.SemideusesSessionRuntime.useOfficialAbility('a','x');c=context.SemideusesCharacterService.get('a');let check=context.SemideusesSessionRuntime.canUseOfficialAbility(c,'x');assert.equal(check.allowed,false);assert(/Ação já usada/.test(check.reason));
context.SemideusesSessionRuntime.nextRound('a');c=context.SemideusesCharacterService.get('a');assert(context.SemideusesSessionRuntime.canUseOfficialAbility(c,'x').allowed,'novo turno recupera Ação');
console.log('turn-economy-skill-builder.test: OK');