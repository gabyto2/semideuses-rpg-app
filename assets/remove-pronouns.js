(function(){
'use strict';

function removePronouns(){
  var input=document.querySelector('[data-field="pronouns"]');
  if(input){
    var field=input.closest('.identity-field');
    if(field)field.remove();
  }

  document.querySelectorAll('.panel h3').forEach(function(title){
    if(title.textContent.trim()!=='Identidade')return;
    var paragraph=title.parentElement&&title.parentElement.querySelector('p');
    if(!paragraph||paragraph.dataset.pronounsCleaned==='true')return;
    paragraph.innerHTML=paragraph.innerHTML.replace(/<br><strong>Pronomes:<\/strong>[^<]*/i,'');
    paragraph.dataset.pronounsCleaned='true';
  });
}

var observer=new MutationObserver(removePronouns);
observer.observe(document.getElementById('app'),{childList:true,subtree:true});
removePronouns();
})();
