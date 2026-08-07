(function(global){
'use strict';
var db=global.SemideusesRulesDatabase;
if(!db)return;

var mode='affiliations',filter='all',query='',limit=40,expandAll=false,scheduled=false;
var storageKey='semideuses.itemShortlist.v1';

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function isCompendium(){var top=document.querySelector('.topbar h1');return !!top&&top.textContent.trim()==='Compêndio';}
function main(){return document.querySelector('main.content');}
function shortlist(){try{var v=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(v)?v:[];}catch(e){return [];}}
function saveShortlist(v){try{localStorage.setItem(storageKey,JSON.stringify(v));}catch(e){}}
function key(item){return item.__kind==='equipment'?'equipment:'+item.id:'mythic:'+item.id;}

function equipmentItems(){
  return (db.listEquipment?db.listEquipment():[]).map(function(i){var x=Object.assign({},i);x.__kind='equipment';x.__tier='Equipamento comum';return x;});
}
function mythicItems(){
  return (db.listMythicItems?db.listMythicItems():[]).map(function(i){var x=Object.assign({},i);x.__kind='mythic';x.__tier=i.tier;return x;});
}
function allItems(){return equipmentItems().concat(mythicItems());}
function text(item){
  if(item.__kind==='equipment')return [item.name,item.type,item.category,item.training,item.rangeType,item.damage,item.damageType,item.range,(item.properties||[]).join(' '),item.notes].join(' ');
  if(item.tier==='Panóplia')return [item.name,item.sourceGroup,item.source,item.base,Object.keys(item.awakenings||{}).map(function(k){return item.awakenings[k];}).join(' '),item.active&&item.active.name,item.active&&item.active.effect].join(' ');
  return [item.name,item.tier,item.meta,item.sourceGroup,item.source,item.effect,item.active&&item.active.name,item.active&&item.active.effect].join(' ');
}
function filtered(){
  var list=allItems(),saved=shortlist(),q=query.trim().toLowerCase();
  if(filter==='equipment')list=list.filter(function(i){return i.__kind==='equipment';});
  else if(filter!=='all'&&filter!=='shortlist')list=list.filter(function(i){return i.__kind==='mythic'&&i.tier===filter;});
  else if(filter==='shortlist')list=list.filter(function(i){return saved.indexOf(key(i))>=0;});
  if(q)list=list.filter(function(i){return text(i).toLowerCase().indexOf(q)>=0;});
  return list;
}
function commonMeta(i){
  var bits=[];
  if(i.type==='weapon'){bits.push((i.damage||'—')+' '+(i.damageType||''));if(i.training)bits.push(i.training);if(i.rangeType)bits.push(i.rangeType);if(i.range)bits.push(i.range);}
  else if(i.type==='armor'){bits.push('CA base '+i.baseAC);bits.push(i.category||'Armadura');}
  else if(i.type==='shield'){bits.push('CA +'+i.acBonus);bits.push('Escudo');}
  else bits.push(i.category||i.type||'Item');
  if(Number(i.cost||0)>=0)bits.push(Number(i.cost||0)+' drc');
  return bits;
}
function mythicMeta(i){
  var bits=[i.tier];
  if(i.sourceGroup)bits.push(i.sourceGroup);
  if(i.meta)bits.push(i.meta.replace(/^·\s*/,''));
  if(i.page)bits.push('pág. '+i.page);
  if(i.active&&i.active.rank)bits.push('Ativa Rank '+i.active.rank);
  if(i.active&&i.active.cost)bits.push(i.active.cost+' MP');
  return bits;
}
function panoplyBody(i){
  return (i.source?'<p class="mythic-lore">'+esc(i.source)+'</p>':'')+
    '<h4>Base</h4><p>'+esc(i.base||'')+'</p>'+
    Object.keys(i.awakenings||{}).sort(function(a,b){return Number(a)-Number(b);}).map(function(level){return '<h4>Desperta '+level+'</h4><p>'+esc(i.awakenings[level])+'</p>';}).join('')+
    (i.active?'<h4>Ativa — '+esc(i.active.name||'')+'</h4><div class="item-compendium-meta">'+(i.active.rank?'<span>Rank '+esc(i.active.rank)+'</span>':'')+(i.active.cost!=null?'<span>'+Number(i.active.cost||0)+' MP</span>':'')+(i.active.action?'<span>'+esc(i.active.action)+'</span>':'')+'</div><p>'+esc(i.active.effect||'')+'</p>':'');
}
function mythicBody(i){
  if(i.tier==='Panóplia')return panoplyBody(i);
  return (i.source?'<p class="mythic-lore">'+esc(i.source)+'</p>':'')+'<p>'+esc(i.effect||'')+'</p>'+
    (i.projectNote?'<div class="item-compendium-note">'+esc(i.projectNote)+'</div>':'');
}
function commonBody(i){
  return '<div class="item-compendium-meta">'+commonMeta(i).map(function(v){return '<span>'+esc(v)+'</span>';}).join('')+'</div>'+
    ((i.properties||[]).length?'<p><strong>Propriedades:</strong> '+esc(i.properties.join(', '))+'</p>':'')+
    (i.notes?'<p>'+esc(i.notes)+'</p>':'');
}
function card(i,saved){
  var selected=saved.indexOf(key(i))>=0,meta=i.__kind==='equipment'?commonMeta(i):mythicMeta(i);
  return '<details class="item-compendium-card" '+(expandAll?'open':'')+' data-item-card="'+esc(key(i))+'"><summary><span><strong>'+esc(i.name)+'</strong><small>'+esc(meta.slice(0,3).join(' · '))+'</small></span><b>'+esc(i.__tier)+'</b></summary><div class="item-compendium-body">'+
    (i.__kind==='equipment'?commonBody(i):mythicBody(i))+
    '<button class="secondary item-compendium-select '+(selected?'selected':'')+'" data-item-shortlist="'+esc(key(i))+'">'+(selected?'★ Na minha seleção':'☆ Adicionar à minha seleção')+'</button></div></details>';
}
function switcher(){
  return '<nav class="item-compendium-switch" data-item-compendium-switch><button class="'+(mode==='affiliations'?'active':'')+'" data-compendium-mode="affiliations">Filiações</button><button class="'+(mode==='items'?'active':'')+'" data-compendium-mode="items">Itens</button></nav>';
}
function itemsView(){
  var list=filtered(),visible=list.slice(0,limit),saved=shortlist(),counts={
    equipment:equipmentItems().length,
    Consumível:(db.listMythicItems?db.listMythicItems('Consumível'):[]).length,
    Panóplia:(db.listMythicItems?db.listMythicItems('Panóplia'):[]).length,
    Relíquia:(db.listMythicItems?db.listMythicItems('Relíquia'):[]).length,
    Artefato:(db.listMythicItems?db.listMythicItems('Artefato'):[]).length
  };
  var filters=[['all','Todos',counts.equipment+counts.Consumível+counts.Panóplia+counts.Relíquia+counts.Artefato],['equipment','Comuns',counts.equipment],['Consumível','Consumíveis',counts.Consumível],['Panóplia','Panóplias',counts.Panóplia],['Relíquia','Relíquias',counts.Relíquia],['Artefato','Artefatos',counts.Artefato],['shortlist','Minha seleção',saved.length]];
  return switcher()+'<section class="compendium-hero item-compendium-root" data-item-compendium-root><span class="eyebrow">LIVRO DO JOGADOR INTERATIVO</span><h2>Compêndio de Itens</h2><p>Leia equipamentos comuns e itens míticos com calma antes de mexer em qualquer ficha.</p></section>'+
    '<div class="item-compendium-note"><strong>Consulta independente.</strong> Marcar “Minha seleção” apenas cria uma lista de referência neste aparelho; não adiciona nem equipa nada em personagem.</div>'+
    '<div class="item-compendium-toolbar"><input data-item-compendium-search value="'+esc(query)+'" placeholder="Buscar por nome, mito, dano, propriedade ou efeito"><div class="item-compendium-actions"><button class="secondary" data-item-expand="'+(expandAll?'close':'open')+'">'+(expandAll?'Recolher todos':'Expandir visíveis')+'</button></div><div class="item-compendium-filters">'+
      filters.map(function(f){return '<button class="'+(filter===f[0]?'active':'')+'" data-item-filter="'+esc(f[0])+'">'+esc(f[1])+' · '+f[2]+'</button>';}).join('')+
    '</div></div><div class="compendium-count">'+list.length+' resultado(s)</div>'+
    '<section class="item-compendium-list">'+visible.map(function(i){return card(i,saved);}).join('')+'</section>'+
    (visible.length<list.length?'<button class="secondary mythic-more" data-item-more>Mostrar mais · '+(list.length-visible.length)+' restantes</button>':'');
}
function injectSwitcher(){
  if(!isCompendium()||mode!=='affiliations')return;
  var m=main();if(!m||m.querySelector('[data-item-compendium-switch]'))return;
  m.insertAdjacentHTML('afterbegin',switcher());
}
function renderItems(preserveFocus){
  if(!isCompendium())return;var m=main();if(!m)return;
  var pos=null;if(preserveFocus){var old=m.querySelector('[data-item-compendium-search]');if(old)pos=old.selectionStart;}
  m.innerHTML=itemsView();
  if(preserveFocus){var input=m.querySelector('[data-item-compendium-search]');if(input){input.focus();try{input.setSelectionRange(pos,pos);}catch(e){}}}
  global.scrollTo(0,0);
}
function open(){
  mode='items';filter='all';query='';limit=40;expandAll=false;
  var go=document.querySelector('[data-go="compendio"]');if(go)go.click();
  setTimeout(function(){mode='items';renderItems(false);},10);
}
function affiliations(){
  mode='affiliations';
  if(global.SemideusesCompendium&&global.SemideusesCompendium.open)global.SemideusesCompendium.open('');
  else{var go=document.querySelector('[data-go="compendio"]');if(go)go.click();}
  setTimeout(injectSwitcher,20);
}
document.addEventListener('click',function(e){
  var m=e.target.closest('[data-compendium-mode]');if(m){if(m.dataset.compendiumMode==='items'){mode='items';renderItems(false);}else affiliations();return;}
  if(mode!=='items'||!isCompendium())return;
  var f=e.target.closest('[data-item-filter]');if(f){filter=f.dataset.itemFilter;limit=40;renderItems(false);return;}
  var more=e.target.closest('[data-item-more]');if(more){limit+=40;var y=global.scrollY;renderItems(false);global.scrollTo(0,y);return;}
  var ex=e.target.closest('[data-item-expand]');if(ex){expandAll=ex.dataset.itemExpand==='open';var y2=global.scrollY;renderItems(false);global.scrollTo(0,y2);return;}
  var s=e.target.closest('[data-item-shortlist]');if(s){var saved=shortlist(),k=s.dataset.itemShortlist,idx=saved.indexOf(k);if(idx>=0)saved.splice(idx,1);else saved.push(k);saveShortlist(saved);var y3=global.scrollY;renderItems(false);global.scrollTo(0,y3);return;}
});
document.addEventListener('input',function(e){
  if(mode==='items'&&e.target.matches('[data-item-compendium-search]')){query=e.target.value;limit=40;renderItems(true);}
});
document.addEventListener('click',function(e){
  if(e.target.closest('[data-go="compendio"]')){mode='affiliations';setTimeout(injectSwitcher,30);}
},false);
new MutationObserver(function(){if(isCompendium()&&mode==='affiliations'&&!document.querySelector('[data-item-compendium-root]')){if(!scheduled){scheduled=true;setTimeout(function(){scheduled=false;injectSwitcher();},0);}}}).observe(document.documentElement,{childList:true,subtree:true});
global.addEventListener('load',function(){setTimeout(injectSwitcher,30);});
global.SemideusesItemCompendium={open:open,showAffiliations:affiliations,shortlist:shortlist};
})(window);
