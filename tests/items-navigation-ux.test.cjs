const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clone=value=>JSON.parse(JSON.stringify(value));

async function compendiumReturnsToSheet(){
  const dom=new JSDOM('<!doctype html><header class="topbar"><h1>Ficha</h1></header><main class="content"></main><button data-go="compendio">Compêndio</button>',{url:'https://example.test/app',runScripts:'outside-only',pretendToBeVisual:true});
  const window=dom.window;
  let opened='';
  window.scrollTo=()=>{};
  window.SemideusesRulesDatabase={listEquipment:()=>[],listMythicItems:()=>[]};
  window.SemideusesApp={getEditing:()=>({id:'helena'}),openSheet:id=>{opened=id;window.document.querySelector('.topbar h1').textContent='Ficha';}};
  window.document.querySelector('[data-go="compendio"]').onclick=()=>{window.document.querySelector('.topbar h1').textContent='Compêndio';window.document.querySelector('main.content').innerHTML='';};
  window.eval(source('item-compendium.js'));

  window.SemideusesItemCompendium.open();
  await wait(30);
  assert(window.document.querySelector('[data-close-item-compendium]'),'O Compêndio aberto pela ficha deve exibir uma saída visível.');
  assert.equal(window.history.state.semideusesView,'semideuses-item-compendium','O Compêndio deve criar uma etapa interna no histórico do navegador.');
  window.history.back();
  await wait(40);
  assert.equal(opened,'helena','O botão físico Voltar deve reabrir a ficha, não sair do app.');
  dom.window.close();
}

async function inventoryIsPrimaryAndEquips(){
  const weapon={id:'spear',catalogId:'lanca',name:'Lança',type:'weapon',quantity:1,training:'Simples',rangeType:'Corpo a Corpo',damage:'1d6',damageType:'Perfurante',properties:[],wieldMode:'one'};
  let character={id:'helena',updatedAt:'1',inventory:[weapon],equipmentSlots:{armor:null,shield:null,mainHand:null,offHand:null},currency:{dracmas:50},mythic:{consumables:[],relics:[],artifacts:[]},rules:{armorClass:13,armorClassFormula:'10 + CON',equipment:{proficient:true,attacks:[],carrying:{knownWeightKg:0,limitKg:70,unknownEntries:1}}}};
  const dom=new JSDOM('<!doctype html><section data-command-center></section>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const window=dom.window;
  let scrollToCalls=0,scrollByCalls=0,reveals=0,afterMutation=false;
  window.scrollTo=()=>{scrollToCalls++;};
  window.scrollBy=()=>{scrollByCalls++;};
  window.Element.prototype.scrollIntoView=function(){reveals++;};
  window.HTMLElement.prototype.getBoundingClientRect=function(){
    if(this.matches&&this.matches('[data-inventory-item="spear"]'))return {top:afterMutation?120:240};
    return {top:0};
  };
  window.SemideusesCharacter={equipmentDefinition:record=>clone(record),weaponProficient:()=>true,armorProficient:()=>true,shieldProficient:()=>true};
  window.SemideusesRulesDatabase={listEquipment:()=>[clone(weapon)],getEquipmentItem:id=>id==='lanca'?clone(weapon):null};
  window.SemideusesCharacterService={
    get:id=>id===character.id?clone(character):null,
    equipItem:(id,itemId,slot)=>{character.equipmentSlots[slot]=itemId;character.updatedAt=String(Number(character.updatedAt)+1);afterMutation=true;return clone(character);},
    unequipItem:(id,slot)=>{character.equipmentSlots[slot]=null;character.updatedAt=String(Number(character.updatedAt)+1);return clone(character);},
    adjustInventoryQuantity:()=>clone(character),removeInventoryItem:()=>clone(character),addCatalogItem:()=>clone(character),buyCatalogItem:()=>clone(character),setDracmas:()=>clone(character),addCustomItem:()=>clone(character),setInventoryWeight:()=>clone(character),setWeaponWieldMode:()=>clone(character),setWeaponAttackAttribute:()=>clone(character)
  };
  const refresh=()=>{};
  window.SemideusesApp={getEditing:()=>clone(character),refresh};
  window.eval(source('equipment-ui.js'));
  window.eval(source('stability-items-ux.js'));
  await wait(40);

  const master=[...window.document.querySelectorAll('[data-items-view]')];
  assert.equal(master[0].dataset.itemsView,'equipment:inventory','Meu Inventário deve ser o primeiro destino da Central de Itens.');
  assert(master[0].classList.contains('active'),'A ficha deve abrir diretamente no Inventário.');
  assert.equal(window.SemideusesApp.refresh,refresh,'A Central de Itens não deve envolver toda a ficha em um bloqueio global de rolagem.');
  assert(window.document.querySelector('.items-common-tabs'),'As três ações comuns devem formar um grupo visual próprio.');
  assert.equal(window.document.querySelector('[data-items-current-view] strong').textContent,'Meu Inventário');
  const equip=window.document.querySelector('[data-inventory-equip][data-slot="mainHand"]');
  assert(equip,'Uma arma no Inventário deve oferecer Equipar diretamente no próprio cartão.');
  equip.dispatchEvent(new window.Event('pointerdown',{bubbles:true}));
  equip.click();
  await wait(80);
  assert.equal(character.equipmentSlots.mainHand,'spear');
  assert(window.document.querySelector('.inventory-equipped-badges'),'O Inventário deve mostrar que a arma está em uso.');
  assert.equal(scrollByCalls,1,'Uma alteração deve corrigir a posição no máximo uma vez pelo cartão, sem prender a rolagem.');
  assert.equal(scrollToCalls,0,'Alterar um item existente não deve mandar a ficha para outra coordenada.');

  window.document.querySelector('[data-items-view="equipment:catalog"]').click();
  await wait(50);
  assert(window.document.querySelector('.item-location-help [data-equipment-tab="inventory"]'),'O catálogo deve indicar claramente onde ficam os itens já adicionados.');
  assert.equal(window.document.querySelector('[data-items-current-view] strong').textContent,'Adicionar itens','A faixa junto ao conteúdo deve confirmar qual aba está sendo exibida.');
  assert(reveals>=1,'Trocar de aba deve levar o usuário ao conteúdo alterado no celular.');
  dom.window.close();
}

(async()=>{
  await compendiumReturnsToSheet();
  await inventoryIsPrimaryAndEquips();
  console.log('items-navigation-ux.test: OK');
})().catch(error=>{console.error(error);process.exitCode=1;});
