(function(global){
  'use strict';
  var scheduled=false,resetOnNextSheet=false;

  function inventoryTab(){return document.querySelector('[data-items-view="equipment:inventory"]');}
  function leaveAdvanced(){var tab=inventoryTab();if(tab){tab.click();return true;}return false;}
  function enhance(){
    var forge=document.querySelector('[data-advanced-panel="forge"]');
    if(!forge)return;
    var head=forge.querySelector('.advanced-head');
    if(head&&!head.querySelector('[data-leave-advanced-items]'))head.insertAdjacentHTML('beforeend','<button type="button" class="secondary" data-leave-advanced-items>← Voltar aos Itens</button>');
    if(!forge.querySelector('.advanced-exit'))forge.insertAdjacentHTML('beforeend','<div class="advanced-exit"><button type="button" class="secondary" data-leave-advanced-items>← Voltar ao Inventário</button></div>');
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(function(){scheduled=false;enhance();},0);}

  document.addEventListener('click',function(event){
    var button=event.target.closest('[data-leave-advanced-items]');if(!button)return;
    event.preventDefault();event.stopPropagation();
    if(leaveAdvanced()){var hub=document.querySelector('[data-items-hub]');if(hub)hub.scrollIntoView({block:'start'});}
  },true);

  global.addEventListener('semideuses:rendered',function(event){
    var detail=event.detail||{};
    if(detail.screen&&detail.screen!=='sheet'){resetOnNextSheet=true;return;}
    if(detail.screen==='sheet'&&resetOnNextSheet){resetOnNextSheet=false;setTimeout(leaveAdvanced,0);}
    schedule();
  });
  global.addEventListener('load',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})(window);
