(function(global){
  'use strict';

  var KEY='semideuses.pwa.install-prompt.v1',deferredPrompt=null,host=null;

  function stored(){try{return localStorage.getItem(KEY)||'';}catch(error){return '';}}
  function remember(value){try{localStorage.setItem(KEY,value);}catch(error){}}
  function installed(){return Boolean((global.matchMedia&&global.matchMedia('(display-mode: standalone)').matches)||global.navigator.standalone===true);}
  function ios(){var agent=String(global.navigator.userAgent||''),platform=String(global.navigator.platform||'');return /iphone|ipad|ipod/i.test(agent)||(platform==='MacIntel'&&Number(global.navigator.maxTouchPoints||0)>1);}
  function remove(){if(host&&host.parentNode)host.parentNode.removeChild(host);host=null;}
  function content(kind){
    if(kind==='ios')return '<div class="pwa-install-icon"><img src="/icons/icon-192.png" alt=""></div><div class="pwa-install-copy"><span class="eyebrow">ACESSO RÁPIDO</span><h2>Instale no iPhone</h2><p>No Safari, toque em <strong>Compartilhar</strong>, escolha <strong>Adicionar à Tela de Início</strong> e ative <strong>Abrir como App</strong>.</p></div><div class="pwa-install-actions"><button type="button" class="primary" data-pwa-close>Entendi</button></div>';
    return '<div class="pwa-install-icon"><img src="/icons/icon-192.png" alt=""></div><div class="pwa-install-copy"><span class="eyebrow">ACESSO RÁPIDO</span><h2>Instale o Semideuses RPG</h2><p>Abra pela tela inicial, com menos distrações e acesso mais rápido durante a sessão.</p></div><div class="pwa-install-actions"><button type="button" class="primary" data-pwa-install>Instalar aplicativo</button><button type="button" class="secondary" data-pwa-close>Agora não</button></div>';
  }
  function mount(kind){
    if(installed()||stored()||host||!document.body)return;
    host=document.createElement('aside');host.className='pwa-install-prompt '+kind;host.setAttribute('data-pwa-install-prompt',kind);host.setAttribute('role','region');host.setAttribute('aria-label','Instalar Semideuses RPG');host.innerHTML=content(kind)+'<button type="button" class="pwa-install-x" data-pwa-close aria-label="Fechar lembrete de instalação">×</button>';
    document.body.appendChild(host);remember('shown');
    host.querySelectorAll('[data-pwa-close]').forEach(function(button){button.onclick=remove;});
    var install=host.querySelector('[data-pwa-install]');
    if(install)install.onclick=async function(){
      if(!deferredPrompt){remove();return;}
      var prompt=deferredPrompt;deferredPrompt=null;remove();
      await prompt.prompt();
      try{var choice=await prompt.userChoice;if(choice&&choice.outcome==='accepted')remember('installed');}catch(error){}
    };
  }
  function schedule(kind){var show=function(){global.setTimeout(function(){mount(kind);},700);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();}

  global.addEventListener('beforeinstallprompt',function(event){event.preventDefault();deferredPrompt=event;schedule('native');});
  global.addEventListener('appinstalled',function(){remember('installed');remove();deferredPrompt=null;});
  if(ios()&&!installed())schedule('ios');

  global.SemideusesPWAInstall={version:'pwa-install-0.1.0',storageKey:KEY,isInstalled:installed,isIOS:ios};
})(window);
