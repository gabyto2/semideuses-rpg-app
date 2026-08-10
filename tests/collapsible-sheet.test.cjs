const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const character={id:'helena',resources:{pvCurrent:20,primaryCurrent:8,tempHp:0,hitDiceCurrent:3,hitDiceMax:3,exhaustionLevel:0},rules:{pvMax:20,primaryMax:10,hitDie:8,pericias:[],exhaustion:{}}};
const html='<main><section class="sheet-identity-hero"></section><section data-core-stats></section><section data-session-tools></section><section class="resource-grid"></section><section class="panel" data-command-center><h3>Habilidades</h3><p>Conteúdo</p></section><section class="panel" data-items-hub><h3>Itens</h3><p>Conteúdo</p></section><section class="panel" data-multi-conditions><h3>Condições</h3><select data-condition-picker></select></section><section class="panel" data-player-notes><h3>Anotações</h3><p>Conteúdo</p></section><section class="panel"><h3>Progressão</h3><p>Conteúdo</p></section></main>';
const dom=new JSDOM('<!doctype html><div id="app">'+html+'</div>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;
let destination=null;
window.HTMLElement.prototype.scrollIntoView=function(){destination=this;};
window.SemideusesApp={getEditing:()=>character};
window.SemideusesCharacterService={get:()=>character};
window.SemideusesCharacter={};
window.eval(source('sheet-polish-v3.js'));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  await wait(30);
  ['abilities','items','states','notes','progress'].forEach(id=>{
    const target=window.document.querySelector('[data-sheet-collapse="'+id+'"]');
    assert(target,'A seção '+id+' deve receber controle de recolhimento.');
    assert(target.classList.contains('is-collapsed'),'A seção densa '+id+' deve iniciar recolhida.');
  });
  assert(!window.document.querySelector('.resource-grid').classList.contains('is-collapsed'),'PV e recursos de combate devem continuar visíveis.');
  assert(!window.document.querySelector('[data-session-tools]').classList.contains('is-collapsed'),'Controles da sessão não podem ser fechados por padrão.');

  const abilities=window.document.querySelector('[data-sheet-collapse="abilities"]');
  abilities.querySelector('[data-sheet-collapse-toggle]').click();
  assert(!abilities.classList.contains('is-collapsed'),'O jogador deve conseguir abrir a seção.');
  const saved=JSON.parse(window.localStorage.getItem('semideuses.sheetSections.v1.helena'));
  assert.equal(saved.abilities,false,'A preferência deve ser salva para a personagem atual.');

  const notesJump=window.document.querySelector('[data-sheet-jump="notes"]');
  notesJump.click();
  const notes=window.document.querySelector('[data-sheet-collapse="notes"]');
  assert(!notes.classList.contains('is-collapsed'),'O atalho deve abrir a seção recolhida antes de navegar.');
  assert.equal(destination,notes);
  assert.equal(JSON.parse(window.localStorage.getItem('semideuses.sheetSections.v1.helena')).notes,false);
  assert(window.document.querySelector('[data-sheet-jump="summary"]'),'O resumo deve continuar na navegação rápida.');

  dom.window.close();
  console.log('collapsible-sheet.test: OK');
})().catch(error=>{dom.window.close();console.error(error);process.exitCode=1;});
