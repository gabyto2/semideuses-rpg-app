(function(global){
'use strict';
var Service=global.SemideusesCharacterService,Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;if(!Service||!Model||!db||!Service.equipItem)return;
var oldEquip=Service.equipItem;
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function hasProp(d,name){return (d&&d.properties||[]).some(function(p){return norm(p).indexOf(norm(name))===0;});}
function talent(c,name){return (c.talents||[]).some(function(r){var t=db.getTalent&&db.getTalent(r.catalogId||r.name);return r.name===name||(t&&t.name===name);});}
function record(c,id){return (c.inventory||[]).find(function(x){return x.id===id;})||null;}function def(c,id){var r=record(c,id);return r&&Model.equipmentDefinition?Model.equipmentDefinition(r):null;}
function eligible(c,d){if(!d||d.type!=='weapon')return false;if(hasProp(d,'Leve'))return true;return talent(c,'Combate com Duas Armas Aprimorado')&&hasProp(d,'Acuada');}
function validatePair(c,mainId,offId){if(!mainId||!offId)return;var m=def(c,mainId),o=def(c,offId);if(!eligible(c,m)||!eligible(c,o))throw new Error(talent(c,'Combate com Duas Armas Aprimorado')?'Para combater com duas armas, ambas precisam ser Leves ou Acuadas.':'Para combater com duas armas, ambas precisam ser Leves.');}
Service.equipItem=function(id,itemId,slot){var c=Service.get(id);if(!c)return oldEquip.apply(Service,arguments);c=Model.normalize(c);if(slot==='offHand')validatePair(c,c.equipmentSlots&&c.equipmentSlots.mainHand,itemId);if(slot==='mainHand')validatePair(c,itemId,c.equipmentSlots&&c.equipmentSlots.offHand);return oldEquip.apply(Service,arguments);};
Service.version='3e-service-0.10.3';
})(window);
