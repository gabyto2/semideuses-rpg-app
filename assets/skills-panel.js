(function(){
'use strict';
var Service=window.SemideusesCharacterService;
var currentId='';
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function findCurrent(){
  if(currentId){var byId=Service.get(currentId);if(byId)return byId;}
  currentId=sessionStorage.getItem('semideuses.currentCharacterId')||'';
  if(currentId)return Service.get(currentId);
  return null;
}
function syncMpDisplay(c){
  var card=document.querySelector('.resource-card.mp strong');
  if(card)card.textContent=Number(c.resources&&c.resources.mpCurrent||0)+' / '+Number(c.rules&&c.rules.mpMax||0);
}
function panelHtml(c){
  var skills=Array.isArray(c.skills)?c.skills:[];
  var mp=Math.max(0,Number(c.resources&&c.resources.mpCurrent||0));
  return '<section class="panel" id="skills-panel"><div class="section-heading"><div><h3>Skills e habilidades</h3><p>O custo fixo é descontado automaticamente do MP atual.</p></div></div>'+
  (skills.length?'<div class="skill-list">'+skills.map(function(s){var cost=Math.max(0,Number(s.cost||0));return '<article class="skill-row"><div><strong>'+esc(s.name||'Habilidade')+'</strong><small>Custo fixo: '+cost+' MP</small></div><button class="primary" data-skill-use="'+esc(s.id)+'" '+(mp<cost?'disabled':'')+'>Usar</button><button class="danger-link" data-skill-delete="'+esc(s.id)+'">Excluir</button></article>';}).join('')+'</div>':'<div class="coming">Nenhuma Skill cadastrada. Depois elas serão preenchidas automaticamente pelo banco oficial.</div>')+
  '<div class="inline-form"><input id="skill-name" placeholder="Nome da Skill ou habilidade" autocomplete="off"><input id="skill-cost" type="number" min="0" value="1" inputmode="numeric"><button class="secondary" data-skill-add>Adicionar Skill</button></div></section>';
}
function ensurePanel(force){
  var ready=Array.prototype.some.call(document.querySelectorAll('.eyebrow'),function(e){return e.textContent.trim()==='FICHA PRONTA';});
  if(!ready)return;
  var existing=document.getElementById('skills-panel');
  if(existing&&!force)return;
  var c=findCurrent();if(!c)return;
  syncMpDisplay(c);
  if(existing)existing.remove();
  var panels=Array.prototype.slice.call(document.querySelectorAll('main .panel'));
  var target=panels.find(function(p){var h=p.querySelector('h3');return h&&h.textContent.trim()==='Progressão';});
  if(target)target.insertAdjacentHTML('beforebegin',panelHtml(c));
}
document.addEventListener('click',function(event){
  var open=event.target.closest('[data-open-sheet]');
  if(open){currentId=open.getAttribute('data-open-sheet')||'';sessionStorage.setItem('semideuses.currentCharacterId',currentId);setTimeout(function(){ensurePanel(false);},0);return;}
  var add=event.target.closest('[data-skill-add]');
  var use=event.target.closest('[data-skill-use]');
  var del=event.target.closest('[data-skill-delete]');
  if(!(add||use||del))return;
  var c=findCurrent();if(!c)return;
  try{
    if(add){
      var nameInput=document.getElementById('skill-name'),costInput=document.getElementById('skill-cost');
      var name=String(nameInput&&nameInput.value||'').trim();
      var cost=Math.max(0,Number(costInput&&costInput.value||0));
      if(!name){alert('Informe o nome da Skill ou habilidade.');if(nameInput)nameInput.focus();return;}
      Service.addSkill(c.id,{name:name,cost:cost});ensurePanel(true);return;
    }
    if(del){Service.removeSkill(c.id,del.getAttribute('data-skill-delete'));ensurePanel(true);return;}
    if(use){Service.useSkill(c.id,use.getAttribute('data-skill-use'));ensurePanel(true);return;}
  }catch(error){alert(error.message);}
},false);
window.addEventListener('semideuses:character-updated',function(event){
  if(event.detail&&event.detail.id===currentId)setTimeout(function(){ensurePanel(true);},0);
});
window.addEventListener('load',function(){setTimeout(function(){ensurePanel(false);},0);});
})();
