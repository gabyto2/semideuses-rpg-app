(function(global){
  'use strict';
  if(!('serviceWorker' in navigator))return;
  var started=false,hadController=Boolean(navigator.serviceWorker.controller),banner=null;
  function removeBanner(){if(banner&&banner.parentNode)banner.parentNode.removeChild(banner);banner=null;}
  function showUpdate(){
    if(banner||!document.body)return;
    banner=document.createElement('aside');banner.className='pwa-update-ready';banner.setAttribute('data-pwa-update-ready','');banner.setAttribute('role','status');
    banner.innerHTML='<div><span class="eyebrow">NOVA VERSÃO</span><strong>Atualização pronta</strong><p>Seus dados continuam neste aparelho. Atualize quando terminar o que está fazendo.</p></div><div><button type="button" class="primary" data-pwa-reload>Atualizar agora</button><button type="button" class="secondary" data-pwa-update-later>Depois</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('[data-pwa-reload]').onclick=function(){global.location.reload();};
    banner.querySelector('[data-pwa-update-later]').onclick=removeBanner;
  }
  function start(){
    if(started)return;
    started=true;
    navigator.serviceWorker.addEventListener('controllerchange',function(){if(hadController)showUpdate();hadController=true;});
    navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(function(registration){
      if(hadController&&registration.waiting)showUpdate();
      return registration.update();
    }).catch(function(error){console.warn('O modo offline não pôde ser ativado.',error);});
  }
  global.SemideusesPWA={version:'0.2.0',start:start,showUpdate:showUpdate,removeUpdate:removeBanner};
  if(document.readyState==='complete')start();
  else global.addEventListener('load',start);
})(window);
