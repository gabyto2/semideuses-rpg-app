const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM,VirtualConsole}=require('jsdom');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const errors=[];
const virtualConsole=new VirtualConsole();
virtualConsole.on('jsdomError',error=>errors.push(error));
const dom=new JSDOM(source,{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole});
const window=dom.window;

window.alert=message=>errors.push(new Error(String(message)));
window.confirm=()=>true;
window.scrollTo=()=>{};
window.HTMLElement.prototype.scrollIntoView=function(){};
window.addEventListener('error',event=>errors.push(event.error||new Error(event.message)));

for(const script of window.document.querySelectorAll('script[src]')){
  const filename=script.getAttribute('src').replace(/^\//,'');
  const absolute=path.join(root,filename);
  assert(fs.existsSync(absolute),'Arquivo referenciado pelo index não existe: '+filename);
  window.eval(fs.readFileSync(absolute,'utf8')+'\n//# sourceURL='+filename);
}

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  await wait(20);
  window.document.querySelector('[data-new]').onclick();
  window.document.querySelector('[data-skip-concept]').onclick();

  const name=window.document.querySelector('[data-field="name"]');
  name.value='Teste de Atributos';
  name.oninput();
  window.document.querySelector('[data-next]').onclick();
  window.document.querySelector('[data-aff="Poseidon"]').onclick();
  window.document.querySelector('[data-next]').onclick();

  await wait(30);
  assert.equal(window.document.querySelector('.wizard-head h2').textContent.trim(),'Atributos');
  assert(window.document.querySelector('.ac-wrap'),'A distribuição avançada deve montar mesmo quando a navegação não propaga um evento de clique.');
  assert.equal(window.document.querySelectorAll('[data-ac-base]').length,6,'A etapa deve exibir os seis atributos.');
  assert(!/&quot(?!;)/.test(fs.readFileSync(path.join(root,'assets/sheet-header.js'),'utf8')),'O cabeçalho não pode conter entidade HTML incompleta.');
  assert(!/&quot(?!;)/.test(fs.readFileSync(path.join(root,'assets/sheet-polish-v3.js'),'utf8')),'O acabamento da ficha não pode conter entidade HTML incompleta.');
  assert.equal(errors.length,0,errors.map(error=>error.stack||error.message).join('\n'));
  dom.window.close();
  console.log('attribute-creation-flow.test: OK');
})().catch(error=>{dom.window.close();console.error(error);process.exitCode=1;});
