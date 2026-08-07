(function(global){
'use strict';
var App=global.SemideusesApp,Service=global.SemideusesCharacterService,Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;
if(!Service||!Model||!db)return;

var itemView='equipment:equipped';
var restoring=null,scheduled=false;
var mutationSelectors=[
  '[data-adjust]','[data-apply]','[data-extra-resource]','[data-condition]',
  '[data-command-use-ability]','[data-command-use-skill]','[data-use-official]',
  '[data-signature-spend]','[data-signature-trigger]','[data-economy-manual]',
  '[data-equip-slot]','[data-unequip-slot]','[data-wield-mode]','[data-inventory-qty]',
  '[data-remove-inventory]','[data-add-catalog-item]','[data-buy-catalog-item]',
  '[data-save-dracmas]','[data-add-custom-item]','[data-item-weight]','[data-attack-attribute]',
  '[data-use-consumable]','[data-remove-mythic-consumable]','[data-add-mythic-consumable]',
  '[data-link-panoply]','[data-unlink-panoply]','[data-use-panoply]',
  '[data-add-owned-mythic]','[data-remove-owned-mythic]','[data-use-owned-mythic]'
].join(',');

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function character(){var e=App&&App.getEditing&&App.getEditing();return e&&e.id?Service.get(e.id)||e:null;}

function beginScrollLock(target){
  var y=Math.max(0,global.scrollY||0),x=Math.max(0,global.scrollX||0);
  restoring={x:x,y:y,until:Date.now()+650,target:target||null};
}
function restoreScroll(){
  if(!restoring||Date.now()>restoring.until)return;
  var p=restoring;
  global.scrollTo(p.x,p.y);
  requestAnimationFrame(function(){if(restoring===p&&Date.now()<=p.until)global.scrollTo(p.x,p.y);});
  setTimeout(function(){if(restoring===p&&Date.now()<=p.until)global.scrollTo(p.x,p.y);},40);
  setTimeout(function(){if(restoring===p&&Date.now()<=p.until)global.scrollTo(p.x,p.y);},120);
}
if(App&&typeof App.refresh==='function'&&!App.__stableRefresh){
  var originalRefresh=App.refresh;
  App.refresh=function(){
    if(!restoring)beginScrollLock(document.activeElement);
    var result=originalRefresh.apply(App,arguments);
    restoreScroll();
    return result;
  };
  App.__stableRefresh=true;
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
function itemNavButton(view,label,count){
  return '<button class="'+(itemView===view?'active':'')+'" data-items-view="'+esc(view)+'"><span>'+esc(label)+'</span>'+(count!=null?'<b>'+count+'</b>':'')+'</button>';
}
function ensureItemHub(){
  var equipment=document.querySelector('[data-equipment-center]'),c=character();
  if(!equipment||!c)return;
  var old=document.querySelector('[data-items-hub]');
  var html='<section class="panel items-hub" data-items-hub><div class="items-hub-head"><div><span class="eyebrow">CENTRAL DE ITENS</span><h2>Itens & Acervo</h2><p>Um único lugar para equipar, consultar inventário e administrar itens míticos.</p></div><button class="secondary" data-open-item-compendium>Consultar Compêndio de Itens</button></div><nav class="items-master-tabs">'+
    itemNavButton('equipment:equipped','Em uso')+
    itemNavButton('equipment:inventory','Inventário',(c.inventory||[]).length)+
    itemNavButton('equipment:catalog','Catálogo comum')+
    itemNavButton('mythic:panoply','Panóplia',c.mythic&&c.mythic.panoplyId?1:0)+
    itemNavButton('mythic:consumables','Consumíveis',(c.mythic&&c.mythic.consumables||[]).length)+
    itemNavButton('mythic:relics','Relíquias',(c.mythic&&c.mythic.relics||[]).length)+
    itemNavButton('mythic:artifacts','Artefatos',(c.mythic&&c.mythic.artifacts||[]).length)+
    itemNavButton('mythic:catalog:Panóplia','Catálogo mítico')+
    '</nav><p class="items-hub-note">Itens comuns adicionados vão primeiro para o <strong>Inventário</strong>. Armas, armaduras e escudos só alteram a ficha depois de serem <strong>equipados</strong> em “Em uso”.</p></section>';
  if(!old)equipment.insertAdjacentHTML('beforebegin',html);
  else if(old.outerHTML!==html)old.outerHTML=html;
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
      btn.textContent='Adicionar outra';
      if(card&&!card.querySelector('[data-owned-count]')){
        var badge=document.createElement('span');badge.className='item-owned-badge';badge.setAttribute('data-owned-count','');badge.textContent='No inventário: '+count;card.querySelector('summary').appendChild(badge);
      }else if(card){card.querySelector('[data-owned-count]').textContent='No inventário: '+count;}
    }else btn.textContent='Adicionar ao inventário';
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
  toast(d.name+' foi para o Inventário'+(count?' (agora '+count+')':'')+'.'+(equip?' Ainda não está equipado.':''),equip?'Ir para Em uso':'Abrir Inventário',function(){activateItemView(equip?'equipment:equipped':'equipment:inventory');setTimeout(function(){var h=document.querySelector('[data-items-hub]');if(h)h.scrollIntoView({block:'start'});},0);});
});
patchService('buyCatalogItem',function(args){
  var d=db.getEquipmentItem&&db.getEquipmentItem(args[1]);if(!d)return;var equip=/^(weapon|armor|shield)$/.test(d.type);
  toast(d.name+' comprado e adicionado ao Inventário.'+(equip?' Ele ainda precisa ser equipado.':''),equip?'Ir para Em uso':'Abrir Inventário',function(){activateItemView(equip?'equipment:equipped':'equipment:inventory');});
});
patchService('addMythicConsumable',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' adicionado aos Consumíveis míticos.','Ver Consumíveis',function(){activateItemView('mythic:consumables');});});
patchService('linkPanoply',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' vinculada como Panóplia do personagem.','Ver Panóplia',function(){activateItemView('mythic:panoply');});});
patchService('addMythicOwnedItem',function(args){var d=db.getMythicItem&&db.getMythicItem(args[1]);if(d)toast(d.name+' registrada na ficha.','Ver '+d.tier,function(){activateItemView(d.tier==='Relíquia'?'mythic:relics':'mythic:artifacts');});});

function enhance(){
  hideLegacy();ensureItemHub();annotateCatalogs();
}
function schedule(){
  if(scheduled)return;scheduled=true;
  setTimeout(function(){scheduled=false;enhance();restoreScroll();},0);
}

document.addEventListener('pointerdown',function(e){
  var target=e.target.closest(mutationSelectors);if(target)beginScrollLock(target);
},true);
document.addEventListener('click',function(e){
  var master=e.target.closest('[data-items-view]');
  if(master){beginScrollLock(master);activateItemView(master.dataset.itemsView,true);restoreScroll();return;}
  var open=e.target.closest('[data-open-mythic-catalog]');
  if(open){itemView='mythic:catalog:'+(open.dataset.openMythicCatalog||'Panóplia');setTimeout(function(){activateItemView(itemView,false);},0);}
  if(e.target.closest('[data-open-item-compendium]')){if(global.SemideusesItemCompendium&&global.SemideusesItemCompendium.open)global.SemideusesItemCompendium.open();}
},false);

global.addEventListener('semideuses:character-updated',function(){schedule();restoreScroll();});
global.addEventListener('load',schedule);
new MutationObserver(function(){schedule();restoreScroll();}).observe(document.documentElement,{childList:true,subtree:true});
global.SemideusesItemsUX={open:function(view){activateItemView(view||'equipment:equipped',true);},toast:toast};
schedule();
})(window);
