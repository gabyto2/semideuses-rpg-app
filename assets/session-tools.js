(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Runtime=global.SemideusesSessionRuntime;
  var App=global.SemideusesApp;
  if(!Service||!Model||!Runtime)return;

  var scheduled=false;
  var rendering=false;

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function currentCharacter(){
    if(App&&typeof App.getEditing==='function'){
      var editing=App.getEditing();
      if(editing&&editing.id)return Service.get(editing.id)||editing;
    }
    var edit=document.querySelector('[data-edit-current]');
    if(!edit)return null;
    var name=(document.querySelector('.section-heading h2')||{}).textContent||'';
    return Service.list().find(function(character){return character.name===name.trim();})||null;
  }
  function stateKey(character){
    var session=character.session||{};
    return encodeURIComponent(JSON.stringify({
      id:character.id,updatedAt:character.updatedAt,level:character.level,path:character.divinePath,
      primary:character.resources.primaryCurrent,conditions:character.resources.conditions||[],
      combat:!!session.inCombat,round:session.round||0,uses:session.abilityUses||{},
      effects:session.activeEffects||[],history:(session.history||[]).slice(0,6).map(function(item){return item.id;})
    }));
  }
  function primaryLabel(character){return character.rules.primaryResource&&character.rules.primaryResource.label||'MP';}
  function resourceRecoveryText(character){
    var definition=character.rules.primaryResource||{};
    var shortRule=definition.recovery&&definition.recovery.shortRest;
    if(shortRule&&shortRule.type==='fractionMax')return 'Recupera '+Math.max(1,Math.floor(character.rules.primaryMax*Number(shortRule.value||0)))+' '+primaryLabel(character)+'. PV exigem Dados de Vida.';
    return 'Aplica a recuperação prevista para '+primaryLabel(character)+'.';
  }
  function sessionPanel(character,key){
    var session=character.session||{};
    var history=Array.isArray(session.history)?session.history:[];
    var effects=Array.isArray(session.activeEffects)?session.activeEffects:[];
    return '<section class="panel session-control-panel" data-session-tools data-session-state="'+esc(key)+'">'+
      '<div class="section-heading"><div><span class="eyebrow">MODO DE SESSÃO</span><h3>'+((session.inCombat)?'Combate · rodada '+Math.max(1,Number(session.round||1)):'Fora de combate')+'</h3><p>Descansos e ações ficam registrados e podem ser desfeitos.</p></div></div>'+
      '<div class="session-actions">'+
        (session.inCombat?'<button class="secondary" data-session-action="next-round">Próxima rodada</button><button class="secondary" data-session-action="end-combat">Encerrar combate</button>':'<button class="primary" data-session-action="start-combat">Iniciar combate</button>')+
        '<button class="secondary" data-session-action="short-rest" title="'+esc(resourceRecoveryText(character))+'">Descanso Curto</button>'+
        '<button class="secondary" data-session-action="long-rest">Descanso Longo</button>'+
        '<button class="secondary" data-session-action="undo" '+(history.length?'':'disabled')+'>Desfazer última ação</button>'+
      '</div>'+
      (effects.length?'<div class="active-effects"><strong>Efeitos ativos</strong>'+effects.map(function(effect){return '<button data-dismiss-effect="'+esc(effect.id)+'"><span>'+esc(effect.name)+'</span><small>'+esc(effect.kind==='concentration'?'Concentração':'Ativo')+'</small> ×</button>';}).join('')+'</div>':'')+
      (history.length?'<details class="session-history"><summary>Histórico recente</summary><div>'+history.slice(0,6).map(function(item){return '<article><strong>'+esc(item.label)+'</strong><small>'+esc(item.detail||'')+'</small></article>';}).join('')+'</div></details>':'')+
    '</section>';
  }
  function usageText(character,item,check){
    var limit=check.limit;
    if(!limit)return '';
    var uses=character.session&&character.session.abilityUses&&character.session.abilityUses[limit.scope]||{};
    var used=Number(uses[item.key]||0);
    return used+' / '+limit.max+' usos';
  }
  function costText(character,item,check){
    if(check.cost<=0)return 'Sem custo';
    return check.cost+' '+primaryLabel(character);
  }
  function abilityCard(character,item){
    var ability=item.ability;
    var check=Runtime.canUseOfficialAbility(character,item.key);
    var passive=/passiva/i.test(String(ability.rank)+' '+String(ability.action));
    var usage=usageText(character,item,check);
    return '<details class="official-ability-card" data-ability-card="'+esc(item.key)+'"><summary><span><strong>'+esc(ability.name)+'</strong><small>Nível '+esc(ability.level)+' · Rank '+esc(ability.rank||'—')+(item.group==='path'?' · '+esc(item.pathName):'')+'</small></span><span class="ability-cost">'+esc(passive?'Passiva':costText(character,item,check))+'</span></summary><div class="official-ability-body"><div class="ability-meta"><span>'+esc(ability.action||'—')+'</span>'+(usage?'<span>'+esc(usage)+'</span>':'')+'</div><p>'+esc(ability.effect||'')+'</p>'+(passive?'<span class="ability-passive-label">Sempre ativa</span>':'<button class="primary" data-use-official="'+esc(item.key)+'" '+(check.allowed?'':'disabled title="'+esc(check.reason)+'"')+'>Usar habilidade</button>')+'</div></details>';
  }
  function abilitiesPanel(character,key){
    var abilities=Runtime.abilityCatalog(character);
    if(!abilities.length)return '';
    var base=abilities.filter(function(item){return item.group==='base';});
    var path=abilities.filter(function(item){return item.group==='path';});
    return '<section class="panel official-abilities-runtime" data-official-abilities data-abilities-state="'+esc(key)+'"><div class="section-heading"><div><span class="eyebrow">PODERES DESBLOQUEADOS</span><h3>Habilidades oficiais</h3><p>Somente poderes disponíveis no nível atual e no Caminho escolhido.</p></div></div>'+
      '<div class="ability-runtime-list">'+base.map(function(item){return abilityCard(character,item);}).join('')+'</div>'+
      (path.length?'<h4 class="ability-path-heading">'+esc(path[0].pathName)+'</h4><div class="ability-runtime-list">'+path.map(function(item){return abilityCard(character,item);}).join('')+'</div>':'')+
    '</section>';
  }
  function conditionsPanel(character,key){
    var active=Array.isArray(character.resources.conditions)?character.resources.conditions:[];
    var options=Model.conditions.filter(function(condition){return condition!=='Saudável'&&active.indexOf(condition)<0;});
    return '<section class="panel multi-condition-panel" data-multi-conditions data-conditions-state="'+esc(key)+'"><div class="section-heading"><div><span class="eyebrow">ESTADOS ATIVOS</span><h3>Condições</h3><p>O personagem pode manter várias condições ao mesmo tempo.</p></div></div>'+
      (active.length?'<div class="condition-chip-list">'+active.map(function(condition){return '<button data-remove-condition="'+esc(condition)+'">'+esc(condition)+' ×</button>';}).join('')+'</div>':'<p class="session-empty">Nenhuma condição ativa.</p>')+
      (options.length?'<div class="condition-add-row"><select data-condition-picker><option value="">Adicionar condição…</option>'+options.map(function(condition){return '<option value="'+esc(condition)+'">'+esc(condition)+'</option>';}).join('')+'</select><button class="secondary" data-add-condition>Adicionar</button></div>':'')+
    '</section>';
  }
  function hideLegacyCondition(){
    var select=document.querySelector('[data-condition]');
    var card=select&&select.closest('.sheet-extra-card');
    if(card&&card.style.display!=='none')card.style.display='none';
  }
  function renderPanels(){
    if(rendering)return;
    var resourceGrid=document.querySelector('.resource-grid');
    if(!resourceGrid)return;
    var character=currentCharacter();
    if(!character)return;
    rendering=true;
    try{
      hideLegacyCondition();
      var key=stateKey(character);
      var session=document.querySelector('[data-session-tools]');
      if(!session||session.dataset.sessionState!==key){
        if(session)session.outerHTML=sessionPanel(character,key);
        else resourceGrid.insertAdjacentHTML('beforebegin',sessionPanel(character,key));
      }
      var conditions=document.querySelector('[data-multi-conditions]');
      var conditionsHtml=conditionsPanel(character,key);
      if(conditions&&conditions.dataset.conditionsState!==key)conditions.outerHTML=conditionsHtml;
      else if(!conditions){
        var extra=document.querySelector('.sheet-extra-grid')&&document.querySelector('.sheet-extra-grid').closest('.panel');
        (extra||resourceGrid).insertAdjacentHTML('afterend',conditionsHtml);
      }
      var abilities=document.querySelector('[data-official-abilities]');
      var abilitiesHtml=abilitiesPanel(character,key);
      if(abilities&&abilities.dataset.abilitiesState!==key)abilities.outerHTML=abilitiesHtml;
      else if(!abilities){
        var affiliation=document.querySelector('.official-affiliation-panel');
        var anchor=affiliation||document.querySelector('[data-multi-conditions]')||resourceGrid;
        anchor.insertAdjacentHTML('afterend',abilitiesHtml);
      }
    }finally{rendering=false;}
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    setTimeout(function(){scheduled=false;renderPanels();},0);
  }
  function runAction(character,action){
    if(action==='start-combat')return Runtime.startCombat(character.id);
    if(action==='end-combat')return Runtime.endCombat(character.id);
    if(action==='next-round')return Runtime.nextRound(character.id);
    if(action==='short-rest')return Runtime.shortRest(character.id);
    if(action==='long-rest')return Runtime.longRest(character.id);
    if(action==='undo')return Runtime.undoLastAction(character.id);
    throw new Error('Ação de sessão inválida.');
  }

  document.addEventListener('click',function(event){
    var action=event.target.closest('[data-session-action]');
    if(action){
      event.preventDefault();
      var character=currentCharacter();
      if(!character)return;
      try{runAction(character,action.dataset.sessionAction);schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var use=event.target.closest('[data-use-official]');
    if(use){
      event.preventDefault();
      var abilityCharacter=currentCharacter();
      if(!abilityCharacter)return;
      try{Runtime.useOfficialAbility(abilityCharacter.id,use.dataset.useOfficial);schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var dismiss=event.target.closest('[data-dismiss-effect]');
    if(dismiss){
      event.preventDefault();
      var effectCharacter=currentCharacter();
      if(!effectCharacter)return;
      try{Runtime.dismissEffect(effectCharacter.id,dismiss.dataset.dismissEffect);schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var remove=event.target.closest('[data-remove-condition]');
    if(remove){
      event.preventDefault();
      var conditionCharacter=currentCharacter();
      if(!conditionCharacter)return;
      try{Service.toggleCondition(conditionCharacter.id,remove.dataset.removeCondition);schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var add=event.target.closest('[data-add-condition]');
    if(add){
      event.preventDefault();
      var picker=document.querySelector('[data-condition-picker]');
      var value=picker&&picker.value;
      var addCharacter=currentCharacter();
      if(!addCharacter||!value)return;
      try{Service.toggleCondition(addCharacter.id,value);schedule();}
      catch(error){alert(error.message);}
    }
  });

  global.addEventListener('semideuses:character-updated',schedule);
  global.addEventListener('load',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})(window);
