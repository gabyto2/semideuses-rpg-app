const fs=require('fs');
const path=require('path');
const assert=require('assert');
const {JSDOM}=require('jsdom');

const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.display,'standalone','O PWA deve abrir sem a interface do navegador.');
assert.equal(manifest.start_url,'/');
assert.equal(manifest.scope,'/');
['180x180','192x192','512x512'].forEach(size=>assert((manifest.icons||[]).some(icon=>icon.sizes===size),'O manifesto deve declarar o ícone '+size+'.'));

const index=read('index.html');
assert(index.includes('rel="apple-touch-icon"'),'O iPhone precisa de um ícone dedicado para a tela inicial.');
assert(index.includes('name="apple-mobile-web-app-capable" content="yes"'),'O modo de aplicativo do iOS deve estar habilitado.');
assert(index.includes('src="/assets/pwa.js"'),'O registrador do service worker deve ser carregado.');
Array.from(index.matchAll(/\b(?:src|href)=["']\/([^"']+)["']/g)).forEach(match=>assert(fs.existsSync(path.join(root,match[1])),'O recurso pré-cacheado precisa existir: /'+match[1]));

const sw=read('sw.js');
assert(!sw.includes("semideuses-rpg-v01"),'O cache antigo não pode continuar ativo.');
assert(sw.includes("fetch('/index.html',{cache:'reload'})"),'A instalação deve buscar a versão atual da página.');
assert(sw.includes('request.mode===\'navigate\''),'A navegação offline deve voltar para a página principal em cache.');
assert(sw.includes('keys.filter(key=>key!==CACHE)'),'Caches antigos devem ser removidos na ativação.');

const dom=new JSDOM('<!doctype html>',{url:'https://example.test/',runScripts:'outside-only'});
let registrationArgs=null,updates=0;
Object.defineProperty(dom.window.navigator,'serviceWorker',{configurable:true,value:{register:async function(url,options){registrationArgs={url,options};return {update:async function(){updates+=1;}};}}});
dom.window.eval(read('assets/pwa.js'));
dom.window.dispatchEvent(new dom.window.Event('load'));

setTimeout(function(){
  try{
    assert.deepEqual(registrationArgs,{url:'/sw.js',options:{scope:'/',updateViaCache:'none'}});
    assert.equal(updates,1,'O aplicativo deve procurar uma versão nova do service worker ao abrir.');
    dom.window.close();
    console.log('pwa.test: OK');
  }catch(error){dom.window.close();console.error(error);process.exitCode=1;}
},20);
