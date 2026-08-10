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
assert.equal(manifest.name,'Semideuses RPG');
assert.equal(manifest.short_name,'Semideuses RPG');
['180x180','192x192','512x512'].forEach(size=>assert((manifest.icons||[]).some(icon=>icon.sizes===size),'O manifesto deve declarar o ícone '+size+'.'));
function pngSize(file){const data=fs.readFileSync(path.join(root,file));return [data.readUInt32BE(16),data.readUInt32BE(20)];}
assert.deepEqual(pngSize('icons/icon-180.png'),[180,180]);
assert.deepEqual(pngSize('icons/icon-192.png'),[192,192]);
assert.deepEqual(pngSize('icons/icon-512.png'),[512,512]);
assert.deepEqual(pngSize('icons/favicon-32.png'),[32,32]);

const index=read('index.html');
assert(index.includes('rel="apple-touch-icon"'),'O iPhone precisa de um ícone dedicado para a tela inicial.');
assert(index.includes('name="apple-mobile-web-app-capable" content="yes"'),'O modo de aplicativo do iOS deve estar habilitado.');
assert(index.includes('src="/assets/pwa.js"'),'O registrador do service worker deve ser carregado.');
assert(index.includes('src="/assets/pwa-install.js"'),'O lembrete de instalação deve ser carregado.');
assert(index.includes('href="/assets/pwa-install.css"'),'O lembrete de instalação deve ter estilo próprio.');
assert(index.includes('apple-mobile-web-app-title" content="Semideuses RPG"'));
assert(index.includes("ntl-drawer-state','hidden"),'O Deploy Preview deve esconder automaticamente a barra de colaboração do Netlify.');
Array.from(index.matchAll(/\b(?:src|href)=["']\/([^"']+)["']/g)).forEach(match=>assert(fs.existsSync(path.join(root,match[1])),'O recurso pré-cacheado precisa existir: /'+match[1]));

const sw=read('sw.js');
assert(!sw.includes("semideuses-rpg-v01"),'O cache antigo não pode continuar ativo.');
assert(sw.includes("fetch('/index.html',{cache:'reload'})"),'A instalação deve buscar a versão atual da página.');
assert(sw.includes('request.mode===\'navigate\''),'A navegação offline deve voltar para a página principal em cache.');
assert(sw.includes('keys.filter(key=>key!==CACHE)'),'Caches antigos devem ser removidos na ativação.');

function installDom(options){
  options=options||{};
  const dom=new JSDOM('<!doctype html><body><div id="app"></div></body>',{url:'https://example.test/',runScripts:'outside-only'}),window=dom.window;
  Object.defineProperty(window.navigator,'userAgent',{configurable:true,value:options.userAgent||'Mozilla/5.0 Chrome/151 Safari/537.36'});
  Object.defineProperty(window.navigator,'platform',{configurable:true,value:options.platform||'Linux'});
  Object.defineProperty(window.navigator,'maxTouchPoints',{configurable:true,value:options.maxTouchPoints||0});
  window.matchMedia=()=>({matches:Boolean(options.standalone)});
  window.setTimeout=fn=>{fn();return 1;};
  window.eval(read('assets/pwa-install.js'));
  return {dom,window};
}

async function run(){
  const dom=new JSDOM('<!doctype html>',{url:'https://example.test/',runScripts:'outside-only'});
  let registrationArgs=null,updates=0;
  Object.defineProperty(dom.window.navigator,'serviceWorker',{configurable:true,value:{register:async function(url,options){registrationArgs={url,options};return {update:async function(){updates+=1;}};}}});
  dom.window.eval(read('assets/pwa.js'));
  dom.window.dispatchEvent(new dom.window.Event('load'));
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.deepEqual(registrationArgs,{url:'/sw.js',options:{scope:'/',updateViaCache:'none'}});
  assert.equal(updates,1,'O aplicativo deve procurar uma versão nova do service worker ao abrir.');
  dom.window.close();

  const native=installDom(),event=new native.window.Event('beforeinstallprompt');let prompts=0;
  event.prompt=async()=>{prompts+=1;};event.userChoice=Promise.resolve({outcome:'accepted'});
  native.window.dispatchEvent(event);
  native.window.document.dispatchEvent(new native.window.Event('DOMContentLoaded'));
  let card=native.window.document.querySelector('[data-pwa-install-prompt="native"]');
  assert(card,'Um navegador compatível deve receber o lembrete de instalação.');
  assert(card.textContent.includes('Instalar aplicativo'));
  card.querySelector('[data-pwa-install]').click();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(prompts,1,'O botão deve abrir uma única vez a instalação nativa.');
  assert.equal(native.window.document.querySelector('[data-pwa-install-prompt]'),null);
  assert.equal(native.window.localStorage.getItem(native.window.SemideusesPWAInstall.storageKey),'installed');
  native.dom.window.close();

  const iphone=installDom({userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1',platform:'iPhone'});
  iphone.window.document.dispatchEvent(new iphone.window.Event('DOMContentLoaded'));
  card=iphone.window.document.querySelector('[data-pwa-install-prompt="ios"]');
  assert(card,'O iPhone deve receber instruções próprias.');
  assert(card.textContent.includes('Adicionar à Tela de Início'));
  card.querySelector('[data-pwa-close]').click();
  assert.equal(iphone.window.document.querySelector('[data-pwa-install-prompt]'),null);
  iphone.dom.window.close();

  const standalone=installDom({userAgent:'Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Mobile Safari/604.1',platform:'iPhone',standalone:true});
  standalone.window.document.dispatchEvent(new standalone.window.Event('DOMContentLoaded'));
  assert.equal(standalone.window.document.querySelector('[data-pwa-install-prompt]'),null,'O lembrete não deve aparecer dentro do app instalado.');
  standalone.dom.window.close();
  console.log('pwa.test: OK');
}

run().catch(error=>{console.error(error);process.exitCode=1;});
