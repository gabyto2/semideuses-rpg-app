(function(global){
'use strict';
var Model=global.SemideusesCharacter,Service=global.SemideusesCharacterService;if(!Model||!Service)return;
var oldNormalize=Model.normalize,oldCalculate=Model.calculate,oldCreate=Model.create;
var EFFECTS={1:'Desvantagem em testes de atributo.',2:'Velocidade reduzida à metade.',3:'Desvantagem em jogadas de ataque e Testes de Resistência.',4:'PV máximo reduzido à metade.',5:'Velocidade reduzida a 0.',6:'Morte.'};
function clone(v){return Model.clone(v);}function clamp(v){return Math.max(0,Math.min(6,Math.floor(Number(v||0))));}
function rawLevel(raw,c){var rr=raw&&raw.resources||{},cr=c&&c.resources||{};if(rr.exhaustionLevel!=null)return clamp(rr.exhaustionLevel);if(cr.exhaustionLevel!=null)return clamp(cr.exhaustionLevel);var list=Array.isArray(rr.conditions)?rr.conditions:Array.isArray(cr.conditions)?cr.conditions:[];return list.indexOf('Exausto')>=0?1:0;}
function apply(c,raw){c.resources=c.resources||{};c.rules=c.rules||{};var level=rawLevel(raw,c),list=Array.isArray(c.resources.conditions)?c.resources.conditions.slice():[];list=list.filter(function(x){return x!=='Exausto';});if(level>0)list.push('Exausto');c.resources.conditions=list;c.resources.condition=list[0]||'Saudável';c.resources.exhaustionLevel=level;
var active=[];for(var i=1;i<=level;i++)active.push({level:i,effect:EFFECTS[i]});var fullMax=Number(c.rules.pvMax||0);c.rules.exhaustion={level:level,maxLevel:6,effects:active,fullPvMax:fullMax,disadvantageAbilityChecks:level>=1,halfSpeed:level>=2,disadvantageAttacksAndSaves:level>=3,halfMaxHp:level>=4,speedZero:level>=5,dead:level>=6};
if(level>=4&&fullMax>0){c.rules.pvMax=Math.max(1,Math.floor(fullMax/2));c.rules.exhaustion.effectivePvMax=c.rules.pvMax;c.resources.pvCurrent=Math.min(Number(c.resources.pvCurrent||0),c.rules.pvMax);}else c.rules.exhaustion.effectivePvMax=fullMax;
if(level>=3&&c.rules.equipment&&Array.isArray(c.rules.equipment.attacks))c.rules.equipment.attacks.forEach(function(a){a.disadvantage=true;a.exhaustionDisadvantage=true;});
if(level>=6)c.resources.pvCurrent=0;return c;}
function normalize(v){var raw=clone(v||{});return apply(oldNormalize(raw),raw);}function calculate(v){var raw=clone(v||{});return apply(oldCalculate(raw),raw);}function create(v){var raw=clone(v||{});return apply(oldCreate(raw),raw);}
Model.normalize=normalize;Model.calculate=calculate;Model.create=create;Model.exhaustionEffects=clone(EFFECTS);Model.exhaustionLevel=function(character){return rawLevel(character,Model.normalize(character));};Model.version='3e-model-0.13.0';
Service.setExhaustionLevel=function(id,level){level=clamp(level);return Service.update(id,function(c){c.resources=c.resources||{};c.resources.exhaustionLevel=level;var list=Array.isArray(c.resources.conditions)?c.resources.conditions.slice():[];list=list.filter(function(x){return x!=='Exausto';});if(level>0)list.push('Exausto');c.resources.conditions=list;c.resources.condition=list[0]||'Saudável';return c;});};
Service.adjustExhaustion=function(id,delta){var c=Service.get(id);if(!c)throw new Error('Personagem não encontrado.');return Service.setExhaustionLevel(id,clamp(Number(c.resources.exhaustionLevel||0)+Number(delta||0)));};
Service.version='3e-service-0.11.0';
})(window);
