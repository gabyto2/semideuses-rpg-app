(function(global){
  'use strict';
  if(!('serviceWorker' in navigator))return;
  var started=false;
  function start(){
    if(started)return;
    started=true;
    navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(function(registration){
      return registration.update();
    }).catch(function(error){
      console.warn('O modo offline não pôde ser ativado.',error);
    });
  }
  if(document.readyState==='complete')start();
  else global.addEventListener('load',start);
})(window);
