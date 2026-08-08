(function(global){
'use strict';
var App=global.SemideusesApp,Service=global.SemideusesCharacterService,Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;
if(!Service||!Model||!db)return;

var itemView='equipment:inventory';
var scrollAnchor=null,restoreScheduled=false,scheduled=false;
var mutationSelectors=[
  '[data-equip-slot]','[data-unequip-slot]','[data-inventory-equip]','[data-inventory-unequip]','[data-wield-mode]','[data-inventory-qty]',
  '[data-remove-inventory]','[data-add-catalog-item]','[data-buy-catalog-item]',
  '[data-save-dracmas]','[data-add-custom-item]','[data-item-weight]','[data-attack-attribute]',
  '[data-use-consumable]','[data-remove-mythic-consumable]','[data-add-mythic-consumable]',
  '[data-link-panoply]','[data-unlink-panoply]','[data-use-panoply]',
  '[data-add-owned-mythic]','[data-remove-owned-mythic]','[data-use-owned-mythic]'
].join(',');

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function character(){var e=App&&App.getEditing&&App.getEditing();return e&&e.id?Service.get(e.id)||e:null;}

function attrSelector(name,value){return '['+name+'="'+String(value||'').replace(/["\\]/g,'\\$&')+'"]';}
function anchorInfo(target){
  var item=target&&target.closest&&target.closest('[data-inventory-item],[data-catalog-item],[data-equipment-slot-card]');
  if(item&&item.hasAttribute('data-inventory-item'))return {selector:attrSelector('data-inventory-item',item.dataset.inventoryItem),node:item};
  if(item&&item.hasAttribute('data-catalog-item'))return {selector:attrSelector('data-catalog-item',item.dataset.catalogItem),node:item};
  if(item&&item.hasAttribute('data-equipment-slot-card'))return {selector:attrSelector('data-equipment-slot-card',item.dataset.equipmentSlotCard),node:item};
  var center=target&&target.closest&&target.closest('[data-equipment-center],[data-mythic-center],[data-advanced-items-panel]');
  if(!center)return null;
  return {selector:center.hasAttribute('data-equipment-center')?'[data-equipment-center]':center.hasAttribute('data-mythic-center')?'[data-mythic-center]':'[data-advanced-items-panel]',node:center};
}
function rememberItemPosition(target){
  var info=anchorInfo(target);if(!info)return;
  scrollAnchor={selector:info.selector,top:info.node.getBoundingClientRect().top,x:global.scrollX||0,y:global.scrollY||0,until:Date.now()+500,tries:0};
}
function cancelItemPosition(){scrollAnchor=null;}
function restoreItemPosition(){
  restoreScheduled=false;
  var p=scrollAnchor;if(!p||Date.now()>p.until){scrollAnchor=null;return;}
  var node=document.querySelector(p.selector);
  if(!node&&p.tries++<6){setTimeout(queuePositionRestore,32);return;}
  scrollAnchor=null;
  if(node){var delta=node.getBoundingClientRect().top-p.top;if(Math.abs(delta)>1&&typeof global.scrollBy==='function')global.scrollBy(0,delta);return;}
  var maximum=Math.max(0,(document.documentElement.scrollHeight||0)-(global.innerHeight||0));
  global.scrollTo(p.x,Math.min(p.y,maximum));
}
function queuePositionRestore(){
  if(!scrollAnchor||restoreScheduled)return;restoreScheduled=true;
  requestAnimationFrame(function(){requestAnimationFrame(restoreItemPosition);});
}

function hideLegacy(){
  Array.prototype.forEach.call(document.querySelectorAll('.panel > h3'),function(h){
    if(h.textContent.trim()==='Atributos'){
      var p=h.closest('.panel');if(p){p.classList.add('legacy-attributes-duplicate');p.setAttribute('aria-hidden','true');}
    }
  });
}

function clickSelector(selector){
  var node=document.querySelector(selector);
  if(node){node.click();return true;}
  return false;
}
function setCentersVisibility(){
  var equipment=document.querySelector('[data-equipment-center]'),mythic=document.querySelector('[data-mythic-center]');
  var mythicMode=itemView.indexOf('mythic:')===0;
  if(equipment)equipment.hidden=mythicMode;
  if(mythic)mythic.hidden=!mythicMode;
}
function activateItemView(view,doClick){
  itemView=view||itemView;
  setCentersVisibility();
  if(doClick!==false){
    if(itemView==='equipment:equipped')clickSelector('[data-equipment-tab="equipped"]');
    else if(itemView==='equipment:inventory')clickSelector('[data-equipment-tab="inventory"]');
    else if(itemView==='equipment:catalog')clickSelector('[data-equipment-tab="catalog"]');
    else if(itemView==='mythic:panoply')clickSelector('[data-mythic-tab="panoply"]');
    else if(itemView==='mythic:consumables')clickSelector('[data-mythic-tab="consumables"]');
    else if(itemView==='mythic:relics')clickSelector('[data-mythic-tab="relics"]');
    else if(itemView==='mythic:artifacts')clickSelector('[data-mythic-tab="artifacts"]');
    else if(itemView.indexOf('mythic:catalog')===0){
      clickSelector('[data-mythic-tab="catalog"]');
      var tier=itemView.split(':')[2]||'Panóplia';
      setTimeout(function(){clickSelector('[data-mythic-tier="'+tier+'"]');},0);
    }
  }
  ensureItemHub();
}
function itemViewInfo(view){
  var map={
    'equipment:inventory':['Meu Inventário','Itens que a personagem possui. Equipe armas e proteções aqui.'],
    'equipment:catalog':['Adicionar itens','Escolha no catálogo; o item será enviado ao Inventário.'],
    'equipment:equipped':['Em uso','Veja mãos ocupadas, armadura, escudo, CA e ataques prontos.'],
    'mythic:panoply':['Panóplia','Item mítico ligado à alma da personagem.'],
    'mythic:consumables':['Consumíveis','Doses e usos disponíveis.'],
    'mythic:relics':['Relíquias','Tesouros míticos conquistados.'],
    'mythic:artifacts':['Artefatos','Peças que podem moldar a campanha.'],
    'mythic:catalog:Panóplia':['Catálogo mítico','Consulte e registre itens míticos.']
  };if(view.indexOf('mythic:catalog')===0)return ['Catálogo mítico','Consulte e registre itens míticos.'];
  return map[view]||['Itens','Conteúdo selecionado logo abaixo.'];
}
function revealActiveContent(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    var marker=document.querySelector('[data-items-current-view]'),center=itemView.indexOf('mythic:')===0?document.querySelector('[data-mythic-center]:not([hidden])'):document.querySelector('[data-equipment-center]:not([hidden])');
    var target=marker||center;if(target&&typeof target.scrollIntoView==='function')target.scrollIntoView({block:'start',behavior:'auto'});
    if(center){center.classList.add('items-view-changed');setTimeout(function(){center.classList.remove('items-view-changed');},420);}
  });});
}
function itemNavButton(view,label,count){
  return '<button class="'+(itemView===view?'active ':'')+(view==='equipment:inventory'?'featured':'')+'" data-items-view="'+esc(view)+'"><span>'+esc(label)+'</span>'+(count!=null?'<b>'+count+'</b>':'')+'</button>';
}
function ensureItemHub(){
  var equipment=document.querySelector('[data-equipment-center]'),c=character();
  if(!equipment||!c)return;
  var old=document.querySelector('[data-items-hub]');
  var hubState=[itemView,(c.inventory||[]).length,JSON.stringify(c.equipmentSlots||{}),c.mythic&&c.mythic.panoplyId||'',(c.mythic&&c.mythic.consumables||[]).length,(c.mythic&&c.mythic.relics||[]).length,(c.mythic&&c.mythic.artifacts||[]).length].join('|');
  var slots=c.equipmentSlots||{},equippedCount=['armor','shield','mainHand','offHand'].filter(function(slot){return !!slots[slot];}).length;
  var current=itemViewInfo(itemView);
  var html='<section class="panel items-hub" data-items-hub data-items-state="'+esc(hubState)+'"><div class="items-hub-head"><div><span class="eyebrow">CENTRAL DE ITENS</span><h2>Inventário e itens</h2><p>Veja o que você possui, equipe o que está usando e adicione novos itens.</p></div><button class="secondary" data-open-item-compendium>Compêndio de Itens ↗</button></div><div class="items-nav-group"><span class="items-nav-label">INVENTÁRIO</span><nav class="items-master-tabs items-common-tabs" aria-label="Inventário e equipamentos">'+
    itemNavButton('equipment:inventory','Meu Inventário',(c.inventory||[]).length)+
    itemNavButton('equipment:catalog','+ Adicionar itens')+
    itemNavButton('equipment:equipped','Em uso',equippedCount)+
    '</nav></div><details class="items-secondary-navigation" open><summary>Itens míticos e Forja</summary><nav class="items-master-tabs items-mythic-tabs" aria-label="Itens míticos e Forja">'+
    itemNavButton('mythic:panoply','Panóplia',c.mythic&&c.mythic.panoplyId?1:0)+
    itemNavButton('mythic:consumables','Consumíveis',(c.mythic&&c.mythic.consumables||[]).length)+
    itemNavButton('mythic:relics','Relíquias',(c.mythic&&c.mythic.relics||[]).length)+
    itemNavButton('mythic:artifacts','Artefatos',(c.mythic&&c.mythic.artifacts||[]).length)+
    itemNavButton('mythic:catalog:Panóplia','Catálogo mítico')+
    '</nav></details><div class="items-current-view" data-items-current-view><span>EXIBINDO AGORA</span><strong>'+esc(current[0])+'</strong><small>'+esc(current[1])+'</small><b aria-hidden="true">↓</b></div><p class="items-hub-note"><strong>Como funciona:</strong> adicione ou compre um item → ele aparece em <strong>Meu Inventário</strong> → toque em <strong>Equipar</strong>. A aba “Em uso” mostra o resultado na CA e nos ataques.</p></section>';
  if(!old)equipment.insertAdjacentHTML('beforebegin',html);
  else if(old.dataset.itemsState!==hubState)old.outerHTML=html;
  setCentersVisibility();
}
function shortlist(){
  try{return JSON.parse(localStorage.getItem('semideuses.itemShortlist.v1')||'[]');}catch(e){return [];}
}
function annotateCatalogs(){
  var c=character();if(!c)return;
  var selected=shortlist();
  document.querySelectorAll('[data-add-catalog-item]').forEach(function(btn){
    var id=btn.dataset.addCatalogItem,count=(c.inventory||[]).filter(function(r){return r.catalogId===id;}).reduce(function(s,r){return s+Number(r.quantity||1);},0);
    var card=btn.closest('.equipment-catalog-card');
    if(count){
      if(btn.textContent!=='Adicionar outra')btn.textContent='Adicionar outra';
      if(card&&!card.querySelector('[data-owned-count]')){
        var badge=document.createElement('span');badge.className='item-owned-badge';badge.setAttribute('data-owned-count','');badge.textContent='No inventário: '+count;card.querySelector('summary').appendChild(badge);
      }else if(card){var existing=card.querySelector('[data-owned-count]');var label='No inventário: '+count;if(existing.textContent!==label)existing.textContent=label;}
    }else if(btn.textContent!=='Adicionar ao inventário')btn.textContent='Adicionar ao inventário';
    if(card&&selected.indexOf('equipment:'+id)>=0)card.classList.add('shortlisted');
  });
  document.querySelectorAll('[data-add-mythic-consumable],[data-link-panoply],[data-add-owned-mythic]').forEach(function(btn){
    var id=btn.dataset.addMythicConsumable||btn.dataset.linkPanoply||btn.dataset.addOwnedMythic;
    var card=btn.closest('.mythic-catalog-card');if(card&&selected.indexOf('mythic:'+id)>=0)card.classList.add('shortlisted');
  });
}

function toast(message,actionLabel,action){
  var host=document.querySelector('[data-item-toast-host]');
  if(!host){host=document.createElement('div');host.className='item-toast-host';host.setAttribute('data-item-toast-host','');document.body.appendChild(host);}
  var node=document.createElement('div');node.className='item-toast';
  node.innerHTML='<div><strong>✓ Item atualizado</strong><span>'+esc(message)+'</span></div>'+(actionLabel?'<button type="button">'+esc(actionLabel)+'</button>':'');
  if(actionLabel)node.querySelector('button').onclick=function(){try{action&&action();}finally{node.remove();}};
  host.appendChild(node);setTimeout(function(){node.classList.add('show');},10);setTimeout(function(){node.classList.remove('show');setTimeout(function(){node.remove();},180);},4200);
}
function patchService(name,handler){
  var original=Service[name];if(typeof original!=='function'||original.__itemsFeedback)return;
  function wrapped(){var args=Array.prototype.slice.call(arguments),result=original.apply(Service,args);try{handler(args,result);}catch(e){}return result;}
  wrapped.__itemsFeedback=true;wrapped.__original=original;Service[name]=wrapped;
}
patchService('addCatalogItem',function(args,saved){
  var d=db.getEquipmentItem&&db.getEquipmentItem(args[1]),count=(saved.inventory||[]).filter(function(r){return r.catalogId===args[1];}).reduce(function(s,r){return s+Number(r.quantity||1);},0);
  if(!d)return;var equip=/^(weapon|armor|shield)$/.test(d.type);
  toast(d.name+' foi para o Inventário'+(count?' (agora '+count+')':'')+'.'+(equip?' Você pode equipá-lo por lá.':''),equip?'Ver e equipar':'Abrir Inventário',function(){activateItemView('equipment:inventory');setTimeout(function(){var h=document.querySelector('[data-items-hub]');if(h)h.scrollIntoView({block:'start'});},0);});
});
patchService('buyCatalogItem',function(args){
  var d=db.getEquipmentItem&&db.getEquipmentItem(args[1]);if(!d)return;var equip=/^(weapon|armor|shield)$/.test(d.type);
  toast(d.name+' comprado e adicionado ao Inventário.'+(equip?' Você pode equipá-lo por lá.':''),equip?'Ver e equipar':'Abrir Inventário',function(){activateItemView('equipment:inventory');});
});
patchService('addMythicConsumable',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' adicionado aos Consumíveis míticos.','Ver Consumíveis',function(){activateItemView('mythic:consumables');});});
patchService('linkPanoply',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' vinculada como Panóplia do personagem.','Ver Panóplia',function(){activateItemView('mythic:panoply');});});
patchService('addMythicOwnedItem',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' registrada na ficha.','Ver '+d.tier,function(){activateItemView(d.tier==='Relíquia'?'mythic:relics':'mythic:artifacts');});});

function enhance(){
  hideLegacy();ensureItemHub();annotateCatalogs();
}
function schedule(){
  if(scheduled)return;scheduled=true;
  setTimeout(function(){scheduled=false;enhance();queuePositionRestore();},0);
}

document.addEventListener('pointerdown',function(e){
  var target=e.target.closest(mutationSelectors);if(target)rememberItemPosition(target);
},true);
document.addEventListener('click',function(e){
  if(e.target.closest(mutationSelectors))queuePositionRestore();
  var master=e.target.closest('[data-items-view]');
  if(master){cancelItemPosition();activateItemView(master.dataset.itemsView,true);revealActiveContent();return;}
  var advanced=e.target.closest('[data-advanced-items]');
  if(advanced){cancelItemPosition();setTimeout(function(){var panel=document.querySelector('[data-advanced-items-panel]');if(panel&&typeof panel.scrollIntoView==='function')panel.scrollIntoView({block:'start',behavior:'auto'});},0);return;}
  var open=e.target.closest('[data-open-mythic-catalog]');
  if(open){itemView='mythic:catalog:'+(open.dataset.openMythicCatalog||'Panóplia');setTimeout(function(){activateItemView(itemView,false);},0);}
  if(e.target.closest('[data-open-item-compendium]')){if(global.SemideusesItemCompendium&&global.SemideusesItemCompendium.open)global.SemideusesItemCompendium.open();}
},false);

document.addEventListener('touchmove',cancelItemPosition,{passive:true});
document.addEventListener('wheel',cancelItemPosition,{passive:true});
global.addEventListener('semideuses:character-updated',function(){schedule();queuePositionRestore();});
global.addEventListener('load',schedule);
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
global.SemideusesItemsUX={open:function(view){activateItemView(view||'equipment:inventory',true);},toast:toast};
schedule();
})(window);
