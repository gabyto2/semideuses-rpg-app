(function(global){
'use strict';
var Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;if(!Model||!db)return;
var oldNormalize=Model.normalize,oldCalculate=Model.calculate,oldCreate=Model.create;
var DAMAGE=['Cortante','Perfurante','Concussivo','Ígneo','Elétrico','Gélido','Ácido','Psíquico','Divino','Necrótico','Radiante','Místico','Veneno','Sônico'];
var CONDITIONS=['Abalado','Agarrado','Apavorado','Atordoado','Caído','Cego','Dominado','Enfeitiçado','Envenenado','Incapacitado','Invisível','Morrendo','Paralisado','Petrificado','Restrito','Surdo'];
function clone(v){return Model.clone(v);}function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function add(list,value,source,kind){if(!value)return;var key=norm(value);if(!list.some(function(x){return norm(x.value)===key;}))list.push({value:value,source:source||'',kind:kind||''});}
function contains(text,word){return norm(text).indexOf(norm(word))>=0;}
function parseText(profile,text,source){text=String(text||'');if(!text)return;
  DAMAGE.forEach(function(t){var n=norm(t),s=norm(text);if((s.indexOf('resistencia a dano '+n)>=0||s.indexOf('resistencia a '+n)>=0||s.indexOf('resistente a '+n)>=0)&&s.indexOf('vantagem')<0)add(profile.resistances,t,source,'damage');if(s.indexOf('imune a dano '+n)>=0||s.indexOf('imunidade a dano '+n)>=0)add(profile.immunities,t,source,'damage');});
  CONDITIONS.forEach(function(t){var n=norm(t),s=norm(text);if(s.indexOf('imunidade a condicao '+n)>=0||s.indexOf('imune a condicao '+n)>=0||s.indexOf('imune a '+n)>=0||s.indexOf('imune as condicoes '+n)>=0)add(profile.conditionImmunities,t,source,'condition');});
  var s=norm(text);if(s.indexOf('imune as condicoes')>=0){CONDITIONS.forEach(function(t){if(s.indexOf(norm(t))>=0)add(profile.conditionImmunities,t,source,'condition');});}
  if(/Vantagem em Testes de Resistência|Vantagem contra|dano .* reduzido|não pode receber a condição|efeitos mágicos têm duração|venenos e doenças|penalidades de combate subaquático/i.test(text))add(profile.defensiveNotes,text,source,'note');
}
function equipped(c){var out=[],slots=c.equipmentSlots||{};Object.keys(slots).forEach(function(k){var id=slots[k],r=(c.inventory||[]).find(function(x){return x.id===id;});if(!r)return;var d=Model.equipmentDefinition?Model.equipmentDefinition(r):r;if(!d)return;out.push({record:r,definition:d,slot:k});});return out;}
function profile(c){var p={resistances:[],immunities:[],conditionImmunities:[],defensiveNotes:[],equipmentEffects:[],sources:[]},aff=db.getAffiliation&&db.getAffiliation(c.affiliation);
  if(aff){(aff.abilities||[]).filter(function(a){return Number(a.level||1)<=Number(c.level||1)&&(/passiva/i.test(String(a.action||''))||/passiva/i.test(String(a.rank||''))||a.name==='Dom');}).forEach(function(a){parseText(p,a.effect,c.affiliation+' — '+a.name);});var path=(aff.paths||[]).find(function(x){return x.name===c.divinePath;});if(path)(path.abilities||[]).filter(function(a){return Number(a.level||1)<=Number(c.level||1)&&(/passiva/i.test(String(a.action||''))||/passiva/i.test(String(a.rank||'')));}).forEach(function(a){parseText(p,a.effect,path.name+' — '+a.name);});}
  (c.talents||[]).forEach(function(r){var t=db.getTalent&&db.getTalent(r.catalogId||r.name);if(t)parseText(p,t.effect,'Talento — '+t.name);});
  equipped(c).forEach(function(x){var d=x.definition,src='Equipamento — '+d.name,text=[d.notes||'',(d.properties||[]).join(' · ')].join(' · ');parseText(p,text,src);if(text.trim())add(p.equipmentEffects,text,src,'equipment');if(x.record.forge&&c.rules&&c.rules.equipment&&c.rules.equipment.forgeNotes){var f=c.rules.equipment.forgeNotes.find(function(n){return n.itemId===x.record.id;});if(f&&(f.notes||[]).length){var ft=f.notes.join(' · ');parseText(p,ft,'Forja — '+d.name);add(p.equipmentEffects,ft,'Forja — '+d.name,'forge');}}});
  if(Model.panoply){var pan=Model.panoply(c);if(pan){parseText(p,pan.base,'Panóplia — '+pan.name+' (Base)');add(p.equipmentEffects,pan.base,'Panóplia — '+pan.name,'panoply');if(Model.panoplyAwakenings)(Model.panoplyAwakenings(c)||[]).filter(function(a){return a.unlocked;}).forEach(function(a){parseText(p,a.effect,'Panóplia — '+pan.name+' (Desperta '+a.level+')');add(p.equipmentEffects,a.effect,'Panóplia — '+pan.name+' (Desperta '+a.level+')','panoply');});}}
  return p;
}
function fixOffhand(c){var attacks=c.rules&&c.rules.equipment&&c.rules.equipment.attacks||[];attacks.forEach(function(a){if(a.slot!=='offHand')return;var r=(c.inventory||[]).find(function(x){return x.id===a.itemId;});if(!r)return;var d=Model.equipmentDefinition?Model.equipmentDefinition(r):null;if(!d)return;var mod=global.SemideusesRules&&global.SemideusesRules.modifier?global.SemideusesRules.modifier(c.attributes[a.attribute]):0;var flat=0;if(a.damage&&mod){var pat=new RegExp('\\s[+]\\s'+Math.abs(mod)+'(?=\\s|$)');if(mod>0)a.damage=a.damage.replace(pat,'');else if(mod<0)a.damage=a.damage.replace(new RegExp('\\s-\\s'+Math.abs(mod)+'(?=\\s|$)'),'');}a.offHandNoAttribute=true;a.actionType='Ação Bônus';a.attacksPerAction=1;});return c;}
function apply(c){fixOffhand(c);c.rules=c.rules||{};c.rules.combatProfile=profile(c);return c;}
function normalize(v){return apply(oldNormalize(v));}function calculate(v){return apply(oldCalculate(v));}function create(v){return apply(oldCreate(v));}
Model.normalize=normalize;Model.calculate=calculate;Model.create=create;Model.combatProfile=function(c){return clone(profile(Model.normalize(c)));};Model.version='3e-model-0.12.0';
})(window);
