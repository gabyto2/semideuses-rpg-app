const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const character={id:'helena',name:'Helena "Demétrio"',player:'Lucca',age:17,level:5,affiliation:'Deméter',background:'Atleta',divinePath:'Caminho das Estações',heroMark:'Ataque Extra'};
const sheet=()=>'<section class="section-heading"><div><span class="eyebrow">FICHA PRONTA</span><h2>'+character.name+'</h2></div></section>';
const dom=new JSDOM('<!doctype html><div id="app">'+sheet()+'</div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;
window.SemideusesCharacterService={get:id=>id===character.id?character:null,list:()=>[character]};
window.SemideusesApp={getEditing:()=>character};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

window.eval(fs.readFileSync(path.join(root,'assets/sheet-header.js'),'utf8'));

(async()=>{
  await wait(20);
  assert(window.document.querySelector('.sheet-identity-hero'),'O topo personalizado deve aparecer ao abrir a ficha.');
  assert.equal(window.document.querySelector('.sheet-character-name').textContent,character.name);
  assert.equal(window.document.querySelector('.section-heading').style.display,'none');

  window.document.getElementById('app').innerHTML=sheet();
  assert(!window.document.querySelector('.sheet-identity-hero'),'O redesenho do aplicativo remove o topo anterior antes da remontagem.');

  await wait(20);
  assert(window.document.querySelector('.sheet-identity-hero'),'O topo personalizado deve voltar automaticamente após o redesenho da ficha.');
  assert.equal(window.document.querySelector('.sheet-character-name').textContent,character.name);
  assert.equal(window.document.querySelector('.section-heading').style.display,'none');
  dom.window.close();
  console.log('sheet-header-persistence.test: OK');
})().catch(error=>{dom.window.close();console.error(error);process.exitCode=1;});
