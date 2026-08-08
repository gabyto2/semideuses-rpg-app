(function(global){
  'use strict';

  function database(){return global.SemideusesRulesDatabase||null;}
  function service(){return global.SemideusesCharacterService||null;}
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}

  var currentId='',scheduled=false;

  function findCharacter(){
    var api=global.SemideusesApp;
    if(api&&typeof api.getEditing==='function'){
      var editing=api.getEditing();
      if(editing&&editing.id)return editing;
    }
    var characterService=service();
    if(!characterService)return null;
    if(currentId){
      var byId=characterService.get(currentId);
      if(byId)return byId;
    }
    var heading=document.querySelector('.sheet-character-name,.section-heading h2');
    if(!heading)return null;
    var name=heading.textContent.trim();
    return characterService.list().find(function(character){return String(character.name||'').trim()===name;})||null;
  }

  function enhancePaths(){
    var title=document.querySelector('.wizard-head h2');
    if(!title||title.textContent.trim()!=='Caminho')return;
    var character=findCharacter();
    var db=database();
    if(!character||!db||typeof db.getAffiliation!=='function')return;
    var affiliation=db.getAffiliation(character.affiliation);
    if(!affiliation||!Array.isArray(affiliation.paths))return;

    document.querySelectorAll('[data-path]').forEach(function(button){
      if(button.querySelector('.official-path-summary'))return;
      var path=affiliation.paths.find(function(item){return item.name===button.dataset.path;});
      if(!path||!path.summary)return;
      button.insertAdjacentHTML('beforeend','<small class="official-path-summary">'+esc(path.summary)+'</small>');
    });
  }

  function listHtml(items){
    if(!Array.isArray(items)||!items.length)return '<span class="official-rule-empty">Em catalogação</span>';
    return '<div class="official-rule-tags">'+items.map(function(item){return '<span>'+esc(item)+'</span>';}).join('')+'</div>';
  }

  function enhanceSheet(){
    if(document.querySelector('.official-affiliation-panel'))return;
    var ready=Array.prototype.some.call(document.querySelectorAll('.eyebrow'),function(element){return element.textContent.trim()==='FICHA PRONTA';});
    if(!ready)return;
    var character=findCharacter();
    var db=database();
    if(!character||!db||typeof db.getAffiliation!=='function')return;
    var affiliation=db.getAffiliation(character.affiliation);
    if(!affiliation)return;

    var savesPanel=Array.prototype.find.call(document.querySelectorAll('.panel'),function(panel){
      var heading=panel.querySelector('h3');
      return heading&&heading.textContent.trim()==='Testes de Resistência';
    });
    if(!savesPanel)return;

    var html='<section class="panel official-affiliation-panel">'+
      '<div class="official-rules-heading"><div><span class="eyebrow">REGRAS DA FILIAÇÃO</span><h3>'+esc(affiliation.name)+'</h3><p>'+esc(affiliation.profile||affiliation.domain||'')+'</p></div><span class="official-rules-icon">'+esc(affiliation.icon||'✦')+'</span></div>'+
      '<div class="official-rules-core">'+
        '<article><span>Atributo de Conjuração</span><strong>'+esc(affiliation.casting||'—')+'</strong></article>'+
        '<article><span>Dado de Vida</span><strong>d'+esc(affiliation.hitDie||'—')+'</strong></article>'+
        '<article><span>Resistências</span><strong>'+esc((affiliation.savingThrows||[]).join(' e ')||'—')+'</strong></article>'+
      '</div>'+
      (affiliation.overview?'<p class="official-rules-overview">'+esc(affiliation.overview)+'</p>':'')+
      '<div class="official-rules-groups">'+
        '<div><strong>Perícias</strong>'+listHtml(affiliation.skillProficiencies)+'</div>'+
        '<div><strong>Armas</strong>'+listHtml(affiliation.weaponProficiencies)+'</div>'+
        '<div><strong>Armaduras</strong>'+listHtml(affiliation.armorProficiencies)+'</div>'+
      '</div>'+
    '</section>';
    savesPanel.insertAdjacentHTML('afterend',html);
  }

  function enhance(){enhancePaths();enhanceSheet();}
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    setTimeout(function(){scheduled=false;enhance();},0);
  }

  document.addEventListener('click',function(event){
    var open=event.target.closest('[data-open-sheet]');
    if(open)currentId=open.dataset.openSheet||'';
    if(event.target.closest('[data-next],[data-prev],[data-aff],[data-path],[data-edit-current],[data-open-sheet]'))schedule();
  },true);
  global.addEventListener('semideuses:character-updated',function(event){
    if(event.detail&&event.detail.id)currentId=event.detail.id;
    schedule();
  });
  global.addEventListener('semideuses:rendered',schedule);
  global.addEventListener('load',schedule);
  schedule();
})(window);
