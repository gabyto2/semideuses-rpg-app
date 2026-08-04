(function(){
'use strict';
var CHARACTER_KEY='semideuses.characters.v4';
var SKILLS_KEY='semideuses.skills.v1';
var currentId='';

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];});}
function readCharacters(){try{var data=JSON.parse(localStorage.getItem(CHARACTER_KEY)||'[]');return Array.isArray(data)?data:[];}catch(e){return [];}}
function readSkills(){try{var data=JSON.parse(localStorage.getItem(SKILLS_KEY)||'{}');return data&&typeof data==='object'?data:{};}catch(e){return {};}}
function writeSkills(data){try{localStorage.setItem(SKILLS_KEY,JSON.stringify(data));return true;}catch(e){alert('Não foi possível salvar a Skill: '+e.message);return false;}}
function findCurrent(){var list=readCharacters();if(currentId){var byId=list.find(function(c){return c.id===currentId;});if(byId)return byId;}var heading=document.querySelector('.section-heading h2');if(!heading)return null;var name=heading.textContent.trim();var matches=list.filter(function(c){return String(c.name||'').trim()===name;});matches.sort(function(a,b){return String(b.updatedAt||'').localeCompare(String(a.updatedAt||''));});if(matches[0])currentId=matches[0].id;return matches[0]||null;}
function getCharacterSkills(c){var all=readSkills();if(!Array.isArray(all[c.id])){all[c.id]=Array.isArray(c.skills)?c.skills:[];writeSkills(all);}return all[c.id];}
function panelHtml(c){var skills=getCharacterSkills(c);var mp=Math.max(0,Number(c.resources&&c.resources.mpCurrent||0));return '<section class="panel" id="skills-panel"><div class="section-heading"><div><h3>Skills e habilidades</h3><p>O custo fixo é descontado automaticamente do MP atual.</p></div></div>'+(skills.length?'<div class="skill-list">'+skills.map(function(s){var cost=Math.max(0,Number(s.cost||0));return '<article class="skill-row"><div><strong>'+esc(s.name||'Habilidade')+'</strong><small>Custo fixo: '+cost+' MP</small></div><button class="primary" data-skill-use="'+esc(s.id)+'" '+(mp<cost?'disabled':'')+'>Usar</button><button class="danger-link" data-skill-delete="'+esc(s.id)+'">Excluir</button></article>';}).join('')+'</div>':'<div class="coming">Nenhuma Skill cadastrada. Depois elas serão preenchidas automaticamente pelo banco oficial.</div>')+'<div class="inline-form"><input id="skill-name" placeholder="Nome da Skill ou habilidade" autocomplete="off"><input id="skill-cost" type="number" min="0" value="1" inputmode="numeric"><button class="secondary" data-skill-add>Adicionar Skill</button></div></section>';}
function ensurePanel(force){var ready=Array.prototype.some.call(document.querySelectorAll('.eyebrow'),function(e){return e.textContent.trim()==='FICHA PRONTA';});if(!ready)return;var existing=document.getElementById('skills-panel');if(existing&&!force)return;var c=findCurrent();if(!c)return;if(existing)existing.remove();var panels=Array.prototype.slice.call(document.querySelectorAll('main .panel'));var target=panels.find(function(p){var h=p.querySelector('h3');return h&&h.textContent.trim()==='Progressão';});if(target)target.insertAdjacentHTML('beforebegin',panelHtml(c));}
function spendMpThroughMainApp(cost){if(cost<=0)return true;var amount=document.querySelector('[data-amount="mp"]');var button=document.querySelector('[data-apply="mp"][data-mode="lose"]');if(!amount||!button)return false;amount.value=cost;button.click();return true;}

document.addEventListener('click',function(event){
  var open=event.target.closest('[data-open-sheet]');
  if(open){currentId=open.getAttribute('data-open-sheet')||'';setTimeout(function(){ensurePanel(false);},0);return;}
  var add=event.target.closest('[data-skill-add]');
  var use=event.target.closest('[data-skill-use]');
  var del=event.target.closest('[data-skill-delete]');
  if(!(add||use||del))return;
  var c=findCurrent();if(!c)return;
  var all=readSkills();var skills=Array.isArray(all[c.id])?all[c.id].slice():getCharacterSkills(c).slice();
  if(add){
    var nameInput=document.getElementById('skill-name'),costInput=document.getElementById('skill-cost');
    var name=String(nameInput&&nameInput.value||'').trim();
    var cost=Math.max(0,Number(costInput&&costInput.value||0));
    if(!name){alert('Informe o nome da Skill ou habilidade.');if(nameInput)nameInput.focus();return;}
    skills.push({id:'skill-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:name,cost:cost});
    all[c.id]=skills;if(writeSkills(all))ensurePanel(true);return;
  }
  if(del){all[c.id]=skills.filter(function(s){return s.id!==del.getAttribute('data-skill-delete');});if(writeSkills(all))ensurePanel(true);return;}
  if(use){
    var skill=skills.find(function(s){return s.id===use.getAttribute('data-skill-use');});if(!skill)return;
    var cost=Math.max(0,Number(skill.cost||0));var current=Math.max(0,Number(c.resources&&c.resources.mpCurrent||0));
    if(current<cost){alert('MP insuficiente.');return;}
    if(!spendMpThroughMainApp(cost)){alert('Não foi possível acessar o controle de MP.');}
  }
},false);

var observer=new MutationObserver(function(){
  if(!document.getElementById('skills-panel'))ensurePanel(false);
});
observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
window.addEventListener('load',function(){setTimeout(function(){ensurePanel(false);},0);});
})();
