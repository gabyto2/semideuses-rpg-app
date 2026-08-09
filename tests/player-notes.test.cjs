const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const clone=value=>JSON.parse(JSON.stringify(value));
const characters={
  helena:{id:'helena',name:'Helena',notes:'A raiz estava doente.',journalEntries:[]},
  orion:{id:'orion',name:'Orion',notes:'',journalEntries:[]}
};
let activeId='helena',sequence=0,lastNotice='';
const dom=new JSDOM('<!doctype html><main><section class="sheet-identity-hero"></section><nav class="sheet-quick-nav"><div class="sheet-quick-nav-track"><button data-sheet-jump="progress">Progressão</button></div></nav><section class="panel"><h3>Progressão</h3></section></main>',{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
const window=dom.window;
window.HTMLElement.prototype.scrollIntoView=function(){};
window.confirm=()=>true;
window.alert=message=>{throw new Error('Alerta inesperado: '+message);};
window.SemideusesCharacter={clone,uid:prefix=>prefix+'-'+(++sequence)};
window.SemideusesCharacterService={
  get:id=>characters[id]?clone(characters[id]):null,
  update(id,mutator){characters[id]=clone(mutator(clone(characters[id]))||characters[id]);window.dispatchEvent(new window.CustomEvent('semideuses:character-updated',{detail:{id}}));return clone(characters[id]);}
};
window.SemideusesApp={getEditing:()=>clone(characters[activeId]),refresh:()=>{},notify:message=>{lastNotice=message;}};

window.eval(fs.readFileSync(path.join(root,'assets/player-notes.js'),'utf8'));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  await wait(15);
  const Service=window.SemideusesCharacterService;
  assert(window.document.querySelector('[data-player-notes]'),'A ficha deve receber o painel de anotações.');
  assert(window.document.querySelector('[data-player-notes-jump]'),'A navegação rápida deve receber o atalho Anotações.');
  assert(window.document.querySelector('[data-journal-entry="legacy"]'),'Texto do campo antigo deve ser preservado e exibido.');

  window.document.querySelector('[data-journal-new]').click();
  let form=window.document.querySelector('[data-journal-form]');
  form.elements.type.value='prophecy';
  form.elements.date.value='2026-08-09';
  form.elements.title.value='Profecia do norte';
  form.elements.text.value='Um retornará para casa, mas um deverá permanecer.';
  form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  await wait(15);
  assert.equal(characters.helena.journalEntries.length,1,'A anotação deve ser salva dentro da personagem.');
  assert.equal(characters.helena.journalEntries[0].type,'prophecy');
  assert.equal(characters.helena.journalEntries[0].title,'Profecia do norte');
  assert.equal(lastNotice,'Anotação salva na ficha.');
  assert.equal(Service.listJournalEntries('orion').length,0,'Anotações não podem vazar para outra ficha.');

  const entryId=characters.helena.journalEntries[0].id;
  window.SemideusesPlayerNotes.render();
  window.document.querySelector('[data-journal-edit="'+entryId+'"]').click();
  form=window.document.querySelector('[data-journal-form]');
  form.elements.text.value='Texto corrigido da profecia.';
  form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  await wait(15);
  assert.equal(characters.helena.journalEntries[0].text,'Texto corrigido da profecia.','A edição deve persistir.');

  Service.updateJournalEntry('helena','legacy',{type:'general',date:'2026-08-01',title:'Primeira teoria',text:'A raiz estava doente.'});
  assert.equal(characters.helena.notes,'','Editar a nota antiga deve migrá-la sem duplicação.');
  assert.equal(characters.helena.journalEntries.length,2);

  Service.removeJournalEntry('helena',entryId);
  assert.equal(characters.helena.journalEntries.length,1,'A exclusão deve remover somente a anotação escolhida.');
  assert.equal(Service.listJournalEntries('helena')[0].title,'Primeira teoria');

  assert.throws(()=>Service.addJournalEntry('helena',{type:'idea',text:'   '}),/Escreva a anotação/,'Não deve salvar anotação vazia.');
  dom.window.close();
  console.log('player-notes.test: OK');
})().catch(error=>{dom.window.close();console.error(error);process.exitCode=1;});
