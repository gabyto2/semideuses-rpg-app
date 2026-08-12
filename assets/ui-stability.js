(function(global){
  'use strict';

  var app=document.getElementById('app');
  if(!app)return;

  var amounts={pv:5,mp:3};
  var pendingScroll=null;
  var wizardToTop=false;

  try{
    var stored=JSON.parse(sessionStorage.getItem('semideuses.controlAmounts')||'{}');
    if(Number(stored.pv)>0)amounts.pv=Number(stored.pv);
    if(Number(stored.mp)>0)amounts.mp=Number(stored.mp);
  }catch(error){}

  function saveAmounts(){
    try{sessionStorage.setItem('semideuses.controlAmounts',JSON.stringify(amounts));}catch(error){}
  }

  function captureCreatedAttributes(){
    var hidden=document.querySelector('.ac-hidden');
    if(!hidden)return;
    var values={};
    hidden.querySelectorAll('[data-attr]').forEach(function(input){
      var value=Number(input.value);
      if(Number.isFinite(value))values[input.dataset.attr]=value;
    });
    if(Object.keys(values).length===6){
      global.SemideusesPendingAttributes={values:values};
    }
  }

  function restoreControls(){
    Object.keys(amounts).forEach(function(type){
      var input=document.querySelector('[data-amount="'+type+'"]');
      if(input)input.value=amounts[type];
    });
  }

  document.addEventListener('input',function(event){
    var input=event.target&&event.target.closest&&event.target.closest('[data-amount]');
    if(!input)return;
    var value=Math.max(1,Number(input.value||1));
    amounts[input.dataset.amount]=value;
    saveAmounts();
  },true);

  document.addEventListener('click',function(event){
    if(event.target.closest('[data-save]'))captureCreatedAttributes();

    if(event.target.closest('[data-apply],[data-adjust],[data-extra-resource],[data-skill-use],[data-save-prof]')){
      pendingScroll=global.scrollY;
      if(document.activeElement&&typeof document.activeElement.blur==='function')document.activeElement.blur();
    }

    if(event.target.closest('[data-next],[data-prev],[data-skip-concept]')){
      wizardToTop=true;
    }
  },true);

  var observer=new MutationObserver(function(){
    restoreControls();
    if(wizardToTop){
      wizardToTop=false;
      global.scrollTo(0,0);
      return;
    }
    if(pendingScroll!=null){
      var target=pendingScroll;
      pendingScroll=null;
      global.scrollTo(0,target);
    }
  });

  observer.observe(app,{childList:true,subtree:true});
  restoreControls();
})(window);
