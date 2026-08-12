(function(){
'use strict';
function heading(){var h=document.querySelector('.wizard-head h2');return h?h.textContent.trim():'';}
function hasSelectedBackground(){return !!document.querySelector('[data-bg].selected');}
function block(message,event){alert(message);event.preventDefault();event.stopImmediatePropagation();}
document.addEventListener('click',function(event){var next=event.target.closest('[data-next]');if(next&&heading()==='Antecedente'&&!hasSelectedBackground()){
block('Escolha um Antecedente antes de continuar.',event);return;
}
var save=event.target.closest('[data-save]');if(save){var reviewText=(document.querySelector('.wizard-card')||{}).textContent||'';if(/Antecedente:\s*Pendente/i.test(reviewText)||/Antecedente\s*Pendente/i.test(reviewText)){
block('A ficha precisa de um Antecedente. Volte à etapa Antecedente e faça uma escolha.',event);
}}
},true);
})();