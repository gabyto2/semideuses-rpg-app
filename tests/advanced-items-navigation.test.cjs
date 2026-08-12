const fs=require('fs');
const assert=require('assert');
const path=require('path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');

(async function(){
  const dom=new JSDOM('<!doctype html><body><section data-items-hub><nav><button data-items-view="equipment:inventory">Inventário</button></nav></section><section data-equipment-center hidden></section><section data-advanced-items-panel data-advanced-panel="forge"><div class="advanced-head"><h3>Forja</h3></div></section></body>',{runScripts:'outside-only'});
  const {window}=dom;
  window.Element.prototype.scrollIntoView=function(){};
  let exits=0;
  window.document.querySelector('[data-items-view="equipment:inventory"]').addEventListener('click',function(){
    exits++;
    const panel=window.document.querySelector('[data-advanced-items-panel]');if(panel)panel.remove();
    window.document.querySelector('[data-equipment-center]').hidden=false;
  });
  window.eval(fs.readFileSync(path.join(root,'assets/advanced-items-navigation-fix.js'),'utf8'));
  await new Promise(resolve=>setTimeout(resolve,10));
  const buttons=window.document.querySelectorAll('[data-leave-advanced-items]');
  assert.equal(buttons.length,2,'A Forja deve ter saída no topo e no fim da tela.');
  buttons[0].click();
  assert.equal(exits,1);
  assert.equal(window.document.querySelector('[data-equipment-center]').hidden,false);
  assert.equal(window.document.querySelector('[data-advanced-items-panel]'),null);

  window.dispatchEvent(new window.CustomEvent('semideuses:rendered',{detail:{screen:'characters'}}));
  window.dispatchEvent(new window.CustomEvent('semideuses:rendered',{detail:{screen:'sheet'}}));
  await new Promise(resolve=>setTimeout(resolve,10));
  assert.equal(exits,2,'Ao sair e reabrir a ficha, a navegação deve voltar ao Inventário.');
  console.log('advanced-items-navigation.test: OK');
  window.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
