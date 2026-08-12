(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Targets=global.SemideusesTargetRuntime;
  var Signatures=global.SemideusesSignatureRuntime;
  var Backgrounds=global.SemideusesBackgroundRuntime;
  var App=global.SemideusesApp;
  if(!Service||!Model)return;

  var scheduled=false,rendering=false;
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function character(){var editing=App&&App.getEditing&&App.getEditing();return editing&&editing.id?Service.get(editing.id)||editing:null;}
  function signaturePanel(c){
    if(!Signatures)return '';
    var actions=Signatures.actions(c),triggers=Signatures.triggers(c),resourceId=Signatures.resourceId(c),state=resourceId?Model.resourceState(c,'special:'+resourceId):null;
    if(!actions.length&&!triggers.length)return '';
    var title=c.affiliation==='Atena'?'Comandar':'Gatilhos da Assinatura';
    return '<section class="panel signature-action-panel" data-signature-actions><div class="section-heading"><div><span class="eyebrow">ASSINATURA ATIVA</span><h3>'+esc(title)+'</h3><p>'+(state?esc(state.label)+': '+esc(state.current)+(state.max!=null?' / '+esc(state.max):''):'Controle os gatilhos e gastos da sua Assinatura.')+'</p></div></div>'+
      (triggers.length?'<div class="signature-trigger-list">'+triggers.map(function(trigger){return '<button class="secondary" data-signature-trigger="'+esc(trigger.id)+'">'+esc(trigger.label)+' <b>+'+trigger.delta+'</b></button>';}).join('')+'</div>':'')+
      (actions.length?'<div class="signature-spend-list">'+actions.map(function(action){var disabled=state&&Number(state.current||0)<action.cost;return '<article><div><strong>'+esc(action.name)+'</strong><small>'+esc(action.effect)+'</small></div><button class="primary" data-signature-spend="'+esc(action.id)+'" '+(disabled?'disabled':'')+'>'+action.cost+' '+esc(state&&state.label||'pontos')+'</button></article>';}).join('')+'</div>':'')+'</section>';
  }
  function targetPanel(c){
    if(!Targets)return '';var definitions=Targets.definitions(c);if(!definitions.length)return '';
    return '<section class="panel target-control-panel" data-target-controls><div class="section-heading"><div><span class="eyebrow">ALVOS E VÍNCULOS</span><h3>Controles individuais</h3><p>Marcas, Sonolência e Vínculos são salvos separadamente por alvo.</p></div></div>'+definitions.map(function(definition){
      var items=Targets.list(c,definition.id);
      var add=definition.kind==='target-bond'?'<div class="target-add bond"><input data-target-first="'+definition.id+'" placeholder="Primeira criatura"><input data-target-second="'+definition.id+'" placeholder="Segunda criatura"><select data-target-type="'+definition.id+'"><option>Guardião</option><option>Espelho</option><option>Grilhão</option></select><button class="secondary" data-add-target="'+definition.id+'">Criar Vínculo</button></div>':'<div class="target-add"><input data-target-name="'+definition.id+'" placeholder="Nome do alvo"><button class="secondary" data-add-target="'+definition.id+'">Adicionar</button></div>';
      return '<div class="target-resource-group"><div class="target-group-head"><strong>'+esc(definition.label)+'</strong><small>'+esc(definition.description||'')+'</small></div>'+(items.length?'<div class="target-list">'+items.map(function(item){
        var label=definition.kind==='target-bond'?item.first+' ↔ '+item.second+' · '+item.type:item.name;
        var controls=definition.kind==='target-counter'?'<button data-target-adjust="'+definition.id+'" data-target-id="'+item.id+'" data-delta="-1">−</button><b>'+Number(item.current||0)+' / '+Number(definition.max||3)+'</b><button data-target-adjust="'+definition.id+'" data-target-id="'+item.id+'" data-delta="1">+</button>':definition.kind==='target-marker'?'<button data-target-toggle="'+definition.id+'" data-target-id="'+item.id+'">'+(item.active?'Marcado':'Inativo')+'</button>':'';
        return '<article><span>'+esc(label)+'</span><div>'+controls+'<button class="danger-link" data-target-remove="'+definition.id+'" data-target-id="'+item.id+'">Remover</button></div></article>';
      }).join('')+'</div>':'<p class="session-empty">Nenhum alvo registrado.</p>')+add+'</div>';
    }).join('')+'</section>';
  }
  function backgroundPanel(c){
    if(!Backgrounds)return '';var trait=Backgrounds.trait(c);if(!trait)return '';
    var check=Backgrounds.canUse(c),passive=trait.recharge==='passive';
    return '<section class="panel background-runtime-panel" data-background-runtime><span class="eyebrow">TRAÇO DE ANTECEDENTE</span><h3>'+esc(trait.name)+'</h3><p>'+esc(trait.description)+'</p><div class="background-runtime-actions">'+(passive?'<span class="status ready">Passivo</span>':'<button class="primary" data-use-background '+(check.allowed?'':'disabled')+'>Usar Traço'+(check.max?' · '+check.used+'/'+check.max:'')+'</button>')+(trait.recharge==='session'?'<button class="secondary" data-reset-background-session>Nova sessão</button>':'')+'</div></section>';
  }
  function stateKey(c){return [c.updatedAt,c.affiliation,c.background,JSON.stringify(c.resources.special||{}),JSON.stringify(c.targets||{}),JSON.stringify(c.session&&c.session.backgroundUses||{})].join('|');}
  function render(){
    if(rendering)return;var grid=document.querySelector('.resource-grid'),c=character();if(!grid||!c)return;rendering=true;
    try{
      var key=stateKey(c),old=document.querySelector('[data-advanced-session]'),html='<div data-advanced-session data-state="'+esc(key)+'">'+signaturePanel(c)+targetPanel(c)+backgroundPanel(c)+'</div>';
      if(old){if(old.dataset.state!==key)old.outerHTML=html;}else{var anchor=document.querySelector('[data-affiliation-resources]')||grid;anchor.insertAdjacentHTML('afterend',html);}
    }finally{rendering=false;}
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(function(){scheduled=false;render();},0);}
  document.addEventListener('click',function(event){
    var c=character();if(!c)return;var trigger=event.target.closest('[data-signature-trigger]');if(trigger){try{Signatures.applyTrigger(c.id,trigger.dataset.signatureTrigger);schedule();}catch(error){alert(error.message);}return;}
    var spend=event.target.closest('[data-signature-spend]');if(spend){try{Signatures.spendAction(c.id,spend.dataset.signatureSpend);schedule();}catch(error){alert(error.message);}return;}
    var add=event.target.closest('[data-add-target]');if(add){var id=add.dataset.addTarget;try{if(id==='bonds')Targets.addTarget(c.id,id,{first:(document.querySelector('[data-target-first="'+id+'"]')||{}).value,second:(document.querySelector('[data-target-second="'+id+'"]')||{}).value,type:(document.querySelector('[data-target-type="'+id+'"]')||{}).value});else Targets.addTarget(c.id,id,{name:(document.querySelector('[data-target-name="'+id+'"]')||{}).value});schedule();}catch(error){alert(error.message);}return;}
    var adjust=event.target.closest('[data-target-adjust]');if(adjust){try{Targets.adjustTarget(c.id,adjust.dataset.targetAdjust,adjust.dataset.targetId,Number(adjust.dataset.delta));schedule();}catch(error){alert(error.message);}return;}
    var toggle=event.target.closest('[data-target-toggle]');if(toggle){try{Targets.toggleTarget(c.id,toggle.dataset.targetToggle,toggle.dataset.targetId);schedule();}catch(error){alert(error.message);}return;}
    var remove=event.target.closest('[data-target-remove]');if(remove){try{Targets.removeTarget(c.id,remove.dataset.targetRemove,remove.dataset.targetId);schedule();}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-use-background]')){try{Backgrounds.use(c.id);schedule();}catch(error){alert(error.message);}return;}
    if(event.target.closest('[data-reset-background-session]')){if(confirm('Renovar os usos por sessão deste Antecedente?')){Backgrounds.reset(c.id,'session');schedule();}}
  });
  global.addEventListener('semideuses:character-updated',schedule);global.addEventListener('load',schedule);new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});schedule();
})(window);
