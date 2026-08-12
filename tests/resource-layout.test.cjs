const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'assets/sheet-command-center.js'),'utf8');
const dom=new JSDOM('<!doctype html><div class="resource-grid"><article class="resource-card pv"><strong data-resource-display="pv">20 / 20</strong><div data-extra-display="tempHp">0</div></article><article class="resource-card mp" data-affiliation-resource><span>MP atual</span><strong data-resource-display="mp">12 / 12</strong></article></div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;
const character={
  id:'layout',level:5,affiliation:'Atena',divinePath:'Caminho da Estratégia',heroMark:'Ataque Extra',
  attributes:{FOR:10,DES:14,CON:14,INT:16,SAB:15,CAR:8},skills:[],talents:[],saveProficiencies:[],
  resources:{pvCurrent:20,primaryCurrent:12,mpCurrent:12},session:{abilityUses:{},turnEconomy:{}},
  rules:{primaryResource:{id:'mp',label:'MP'},primaryMax:12,armorClass:14,armorClassFormula:'10 + DES',initiative:4,passivePerception:12,abilityDC:14,castingAttackBonus:6,proficiency:3,casting:'INT',paths:[],pericias:[]}
};
window.SemideusesApp={getEditing:()=>character};
window.SemideusesCharacterService={get:id=>id===character.id?character:null};
window.SemideusesCharacter={attributes:['FOR','DES','CON','INT','SAB','CAR']};
window.SemideusesRules={modifier:value=>Math.floor((Number(value)-10)/2)};
window.SemideusesRulesDatabase={listSkills:()=>[],listTalents:()=>[]};
window.SemideusesSessionRuntime={abilityCatalog:()=>[]};
window.eval(source);

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
  await wait(30);
  const grid=window.document.querySelector('.resource-grid');
  const original=window.document.querySelector('[data-affiliation-resource]');
  assert(grid.classList.contains('vitality-only'),'O topo deve ficar dedicado à vitalidade.');
  assert(original.closest('[data-command-resource-slot]'),'O recurso da Filiação deve ficar dentro do centro de Habilidades.');
  assert.equal(window.document.querySelectorAll('[data-affiliation-resource]').length,1);

  character.resources.primaryCurrent=9;
  character.resources.mpCurrent=9;
  window.dispatchEvent(new window.CustomEvent('semideuses:character-updated',{detail:{id:character.id}}));
  await wait(30);
  const refreshed=window.document.querySelector('[data-affiliation-resource]');
  assert.strictEqual(refreshed,original,'Redesenhar as Habilidades deve preservar o cartão e seus controles já vinculados.');
  assert(refreshed.closest('[data-command-resource-slot]'));
  assert.equal(window.document.querySelectorAll('[data-affiliation-resource]').length,1,'O recurso não pode duplicar.');
  dom.window.close();
  console.log('resource-layout.test: OK');
})().catch(error=>{dom.window.close();console.error(error);process.exitCode=1;});
