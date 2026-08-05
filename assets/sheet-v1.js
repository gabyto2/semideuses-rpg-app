(function(){
'use strict';
var Service=window.SemideusesCharacterService;
var Rules=window.SemideusesRules;
var attrs=['FOR','DES','CON','INT','SAB','CAR'];
var conditions=['Saudável','Ferido','Exausto','Inconsciente','Morrendo','Envenenado','Amedrontado','Atordoado','Impedido'];
var currentId='';
function signed(value){return value>=0?'+'+value:String(value);}
function findCurrent(){
  if(currentId){var byId=Service.get(currentId);if(byId)return byId;}
  currentId=sessionStorage.getItem('semideuses.currentCharacterId')||'';
  return currentId?Service.get(currentId):null;
}
function extraResourcesHtml(c){
  var r=c.resources||{};
  return '<section class="panel" id="sheet-extra-resources"><h3>Recursos adicionais</h3><div class="sheet-extra-grid">'+
  '<article class="sheet-extra-card"><span>PV temporários</span><strong>'+Math.max(0,Number(r.tempHp||0))+'</strong><div class="mini-adjust"><button data-extra-temp="-1">−1</button><button data-extra-temp="1">+1</button></div></article>'+
  '<article class="sheet-extra-card"><span>Dados de Vida</span><strong>'+Number(r.hitDiceCurrent||0)+' / '+Number(r.hitDiceMax||c.level||1)+' d'+Number(c.rules&&c.rules.hitDie||8)+'</strong><div class="mini-adjust"><button data-extra-hitdice="-1">Usar 1</button><button data-extra-hitdice="1">Recuperar 1</button></div></article>'+
  '<article class="sheet-extra-card"><span>Condição atual</span><strong>'+String(r.condition||'Saudável')+'</strong><select class="condition-select" data-extra-condition>'+conditions.map(function(name){return '<option '+(name===(r.condition||'Saudável')?'selected':'')+'>'+name+'</option>';}).join('')+'</select></article></div>'+
  '<p class="sheet-note">O dano consome primeiro os PV temporários. Apenas o restante reduz os PV atuais.</p></section>';
}
function savesHtml(c){
  var bonus=Rules.proficiency(c.level),proficiencies=Array.isArray(c.saveProficiencies)?c.saveProficiencies:[];
  return '<section class="panel" id="sheet-saves"><div class="proficiency-banner"><span>Bônus de Proficiência</span><strong>+'+bonus+'</strong></div><h3>Testes de Resistência</h3><div class="save-grid">'+attrs.map(function(a){var trained=proficiencies.indexOf(a)>=0,total=Rules.modifier(c.attributes&&c.attributes[a])+(trained?bonus:0);return '<article class="save-card '+(trained?'proficient':'')+'"><span>'+a+'</span><strong>'+signed(total)+'</strong><small>'+signed(Rules.modifier(c.attributes&&c.attributes[a]))+' atributo'+(trained?' + '+bonus+' proficiência':'')+'</small><button class="save-toggle" data-save-prof="'+a+'">'+(trained?'● Proficiente':'○ Marcar proficiência')+'</button></article>';}).join('')+'</div><p class="sheet-note">Até o banco oficial de cada Filiação estar completo, marque manualmente os Testes de Resistência concedidos por ela.</p></section>';
}
function isSheet(){return Array.prototype.some.call(document.querySelectorAll('.eyebrow'),function(e){return e.textContent.trim()==='FICHA PRONTA';});}
function ensure(force){
  if(!isSheet())return;
  var c=findCurrent();if(!c)return;
  var oldResources=document.getElementById('sheet-extra-resources');
  var oldSaves=document.getElementById('sheet-saves');
  if(force){if(oldResources)oldResources.remove();if(oldSaves)oldSaves.remove();}
  if(!document.getElementById('sheet-extra-resources')){
    var resources=document.querySelector('.resource-grid');
    if(resources)resources.insertAdjacentHTML('afterend',extraResourcesHtml(c));
  }
  if(!document.getElementById('sheet-saves')){
    var panels=Array.prototype.slice.call(document.querySelectorAll('main .panel'));
    var attributesPanel=panels.find(function(p){var h=p.querySelector('h3');return h&&h.textContent.trim()==='Atributos';});
    if(attributesPanel)attributesPanel.insertAdjacentHTML('afterend',savesHtml(c));
  }
}
document.addEventListener('click',function(event){
  var open=event.target.closest('[data-open-sheet]');
  if(open){currentId=open.getAttribute('data-open-sheet')||'';sessionStorage.setItem('semideuses.currentCharacterId',currentId);setTimeout(function(){ensure(false);},0);return;}
  var c=findCurrent();if(!c)return;
  try{
    var temp=event.target.closest('[data-extra-temp]');
    if(temp){Service.adjustResource(c.id,'tempHp',Number(temp.getAttribute('data-extra-temp')||0));setTimeout(function(){ensure(true);},0);return;}
    var hd=event.target.closest('[data-extra-hitdice]');
    if(hd){Service.adjustResource(c.id,'hitDice',Number(hd.getAttribute('data-extra-hitdice')||0));setTimeout(function(){ensure(true);},0);return;}
    var profButton=event.target.closest('[data-save-prof]');
    if(profButton){Service.toggleSaveProficiency(c.id,profButton.getAttribute('data-save-prof'));setTimeout(function(){ensure(true);},0);return;}
  }catch(error){alert(error.message);}
},false);
document.addEventListener('change',function(event){
  var select=event.target.closest('[data-extra-condition]');if(!select)return;
  var c=findCurrent();if(!c)return;
  try{Service.setCondition(c.id,select.value);setTimeout(function(){ensure(true);},0);}catch(error){alert(error.message);}
},false);
window.addEventListener('semideuses:character-updated',function(event){
  if(event.detail&&event.detail.id===currentId)setTimeout(function(){ensure(true);},0);
});
window.addEventListener('load',function(){setTimeout(function(){ensure(false);},0);});
})();
