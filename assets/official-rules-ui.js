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
    var db=database(),fallback=character&&db&&db.getAffiliation&&db.getAffiliation(character.affiliation),paths=character&&character.rules&&character.rules.paths||fallback&&fallback.paths;
    if(!character||!Array.isArray(paths))return;

    document.querySelectorAll('[data-path]').forEach(function(button){
      if(button.querySelector('.official-path-summary'))return;
      var path=paths.find(function(item){return item.name===button.dataset.path;});
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
    var db=database(),fallback=character&&db&&db.getAffiliation&&db.getAffiliation(character.affiliation);
    if(!character||(!character.rules&&!fallback))return;
    var rules=character.rules||fallback,origin=global.SemideusesOriginCatalog&&global.SemideusesOriginCatalog.get(character.heroType);

    var savesPanel=Array.prototype.find.call(document.querySelectorAll('.panel'),function(panel){
      var heading=panel.querySelector('h3');
      return heading&&heading.textContent.trim()==='Testes de Resistência';
    });
    if(!savesPanel)return;

    var title=(character.heroType||'Semideus Grego')+(character.affiliation?' · '+character.affiliation:'');
    var html='<details class="panel official-affiliation-panel sheet-reference-panel">'+
      '<summary><span><strong>Regras da Natureza · '+esc(title)+'</strong><small>Dado de Vida, proficiências e Livro do Jogador p. '+esc(rules.sourcePages||'19–29')+'</small></span><b>Detalhes</b></summary><div class="sheet-reference-body">'+
      '<div class="official-rules-heading"><div><span class="eyebrow">REGRAS DA NATUREZA</span><h3>'+esc(title)+'</h3><p>'+esc(rules.profile||rules.domain||'')+'</p></div><span class="official-rules-icon">'+esc(rules.affiliationIcon||origin&&origin.icon||'✦')+'</span></div>'+
      '<div class="official-rules-core">'+
        '<article><span>Atributo-chave</span><strong>'+esc(rules.casting||'—')+'</strong></article>'+
        '<article><span>Dado de Vida</span><strong>d'+esc(rules.hitDie||'—')+'</strong></article>'+
        '<article><span>Resistências</span><strong>'+esc((rules.savingThrows||[]).join(' e ')||'—')+'</strong></article>'+
      '</div>'+
      (rules.overview?'<p class="official-rules-overview">'+esc(rules.overview)+'</p>':'')+
      '<div class="official-rules-groups">'+
        '<div><strong>Perícias</strong>'+listHtml(rules.affiliationSkillProficiencies||rules.originSkillProficiencies||rules.skillProficiencies)+'</div>'+
        '<div><strong>Armas</strong>'+listHtml(rules.weaponProficiencies)+'</div>'+
        '<div><strong>Armaduras</strong>'+listHtml(rules.armorProficiencies)+'</div>'+
      '</div>'+
    '</div></details>';
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
