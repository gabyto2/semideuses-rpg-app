const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function appLifecycle(){
  const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const window=dom.window;
  window.scrollTo=()=>{};
  window.SemideusesCharacterService={list:()=>[],get:()=>null};
  window.SemideusesCharacter={attributes:['FOR','DES','CON','INT','SAB','CAR'],conditions:[],clone:value=>JSON.parse(JSON.stringify(value)),calculate:value=>value};
  window.SemideusesRules={modifier:()=>0};
  window.SemideusesRulesDatabase={listCompleteAffiliations:()=>[],listBackgrounds:()=>[],heroMarks:[],getAffiliation:()=>null,getBackground:()=>null};
  let rendered=0;
  window.addEventListener('semideuses:rendered',()=>{rendered+=1;});
  window.eval(source('app.js'));
  assert.equal(rendered,1,'A inicialização deve anunciar o primeiro desenho da tela.');
  window.SemideusesApp.refresh();
  assert.equal(rendered,2,'Uma atualização do aplicativo deve anunciar o novo desenho da tela.');
  dom.window.close();
}

function sheetHtml(){
  return '<section class="section-heading"><span class="eyebrow">FICHA PRONTA</span><h2>Helena Demétrio</h2></section>'+ 
    '<div class="sheet-identity-meta"></div><div class="sheet-badges"><span class="sheet-badge identity">Idade 17</span><span class="sheet-badge path">Caminho das Estações</span></div>'+ 
    '<section class="panel"><h3>Testes de Resistência</h3></section>'+ 
    '<section data-mythic-center><button class="active" data-mythic-tab="panoply">Panóplia</button><div class="mythic-body"></div></section>';
}

async function enhancementLifecycle(){
  const character={id:'helena',name:'Helena Demétrio',affiliation:'Deméter',divinePath:'Caminho das Estações',mythic:{}};
  const affiliation={name:'Deméter',profile:'Natureza e colheita',icon:'🌾',casting:'SAB',hitDie:8,savingThrows:['CON','SAB'],skillProficiencies:['Natureza'],weaponProficiencies:['Foice'],armorProficiencies:['Leves'],paths:[]};
  const dom=new JSDOM('<!doctype html><div id="app">'+sheetHtml()+'</div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const window=dom.window;
  window.SemideusesApp={getEditing:()=>character};
  window.SemideusesCharacterService={get:id=>id===character.id?character:null,list:()=>[character],saveCustomPanoply:()=>{},removeCustomPanoply:()=>{}};
  window.SemideusesCharacter={};
  window.SemideusesRules={rankCost:()=>4};
  window.SemideusesRulesDatabase={getAffiliation:name=>name===affiliation.name?affiliation:null};

  window.eval(source('official-rules-ui.js'));
  window.eval(source('compendium-integration.js'));
  window.eval(source('panoply-builder-ui.js'));
  await wait(20);

  const assertMounted=message=>{
    assert.equal(window.document.querySelectorAll('.official-affiliation-panel').length,1,'As regras oficiais devem '+message+'.');
    assert.equal(window.document.querySelectorAll('[data-compendium-sheet]').length,1,'O atalho do Compêndio deve '+message+'.');
    assert.equal(window.document.querySelectorAll('[data-panoply-builder]').length,1,'O construtor de Panóplia deve '+message+'.');
    const labels=[...window.document.querySelectorAll('[data-compendium-sheet] button')].map(button=>button.textContent.trim());
    assert(labels.includes('📖 Consultar Caminho das Estações'),'O atalho deve consultar o Caminho selecionado.');
    assert(!labels.some(label=>label.includes('Idade 17')),'A idade nunca pode ser tratada como Caminho.');
  };
  assertMounted('aparecer na ficha');

  window.document.getElementById('app').innerHTML=sheetHtml();
  window.dispatchEvent(new window.CustomEvent('semideuses:rendered',{detail:{screen:'sheet',section:'jogador'}}));
  await wait(20);
  assertMounted('voltar uma única vez após o redesenho');
  dom.window.close();
}

(async()=>{
  appLifecycle();
  await enhancementLifecycle();
  console.log('render-lifecycle.test: OK');
})().catch(error=>{console.error(error);process.exitCode=1;});
