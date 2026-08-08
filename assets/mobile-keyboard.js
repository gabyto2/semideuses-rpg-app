(function(){
'use strict';
var coarse=window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;
if(!coarse)return;
var button=document.createElement('button');
button.type='button';
button.className='mobile-keyboard-done';
button.textContent='Concluir';
button.setAttribute('aria-label','Fechar teclado');
document.body.appendChild(button);
function isEditable(target){return target&&target.matches&&target.matches('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, select');}
function show(target){if(!isEditable(target))return;target.setAttribute('enterkeyhint',target.tagName==='TEXTAREA'?'newline':'done');button.classList.add('visible');}
function hide(){button.classList.remove('visible');}
document.addEventListener('focusin',function(event){show(event.target);},true);
document.addEventListener('focusout',function(){setTimeout(function(){if(!isEditable(document.activeElement))hide();},80);},true);
document.addEventListener('keydown',function(event){if(event.key==='Enter'&&event.target&&event.target.tagName!=='TEXTAREA'&&isEditable(event.target)){event.preventDefault();event.target.blur();hide();}},true);
button.addEventListener('pointerdown',function(event){event.preventDefault();var active=document.activeElement;if(active&&typeof active.blur==='function')active.blur();hide();});
})();