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
  window.scrollTo=()=>{};
  window.Element.prototype.scrollIntoView=function(){};
  window.SemideusesCharacter={equipmentDefinition:record=>clone(record),weaponProficient:()=>true,armorProficient:()=>true,shieldProficient:()=>true};
  window.SemideusesRulesDatabase={listEquipment:()=>[clone(weapon)],getEquipmentItem:id=>id==='lanca'?clone(weapon):null};
  window.SemideusesCharacterService={
    get:id=>id===character.id?clone(character):null,
    equipItem:(id,itemId,slot)=>{character.equipmentSlots[slot]=itemId;character.updatedAt=String(Number(character.updatedAt)+1);return clone(character);},
    unequipItem:(id,slot)=>{character.equipmentSlots[slot]=null;character.updatedAt=String(Number(character.updatedAt)+1);return clone(character);},
    adjustInventoryQuantity:()=>clone(character),removeInventoryItem:()=>clone(character),addCatalogItem:()=>clone(character),buyCatalogItem:()=>clone(character),setDracmas:()=>clone(character),addCustomItem:()=>clone(character),setInventoryWeight:()=>clone(character),setWeaponWieldMode:()=>clone(character),setWeaponAttackAttribute:()=>clone(character)
  };
  window.SemideusesApp={getEditing:()=>clone(character),refresh:()=>{}};
  window.eval(source('equipment-ui.js'));
  window.eval(source('stability-items-ux.js'));
  await wait(40);

  const master=[...window.document.querySelectorAll('[data-items-view]')];
  assert.equal(master[0].dataset.itemsView,'equipment:inventory','Meu Inventário deve ser o primeiro destino da Central de Itens.');
  assert(master[0].classList.contains('active'),'A ficha deve abrir diretamente no Inventário.');
  const equip=window.document.querySelector('[data-inventory-equip][data-slot="mainHand"]');
  assert(equip,'Uma arma no Inventário deve oferecer Equipar diretamente no próprio cartão.');
  equip.click();
  await wait(30);
  assert.equal(character.equipmentSlots.mainHand,'spear');
  assert(window.document.querySelector('.inventory-equipped-badges'),'O Inventário deve mostrar que a arma está em uso.');

  window.document.querySelector('[data-items-view="equipment:catalog"]').click();
  await wait(20);
  assert(window.document.querySelector('.item-location-help [data-equipment-tab="inventory"]'),'O catálogo deve indicar claramente onde ficam os itens já adicionados.');
  dom.window.close();
}

(async()=>{
  await compendiumReturnsToSheet();
  await inventoryIsPrimaryAndEquips();
  console.log('items-navigation-ux.test: OK');
})().catch(error=>{console.error(error);process.exitCode=1;});
