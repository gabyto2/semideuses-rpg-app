(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var App=global.SemideusesApp;
  if(!Service)return;

  var scheduled=false;
  var enhancing=false;

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function currentCharacter(){
    if(App&&typeof App.getEditing==='function'){
      var editing=App.getEditing();
      if(editing&&editing.id)return Service.get(editing.id)||editing;
    }
    var open=document.querySelector('[data-edit-current]');
    if(!open)return null;
    var heading=document.querySelector('.section-heading h2');
    if(!heading)return null;
    var name=heading.textContent.trim();
    return Service.list().find(function(character){return String(character.name||'').trim()===name;})||null;
  }
  function primary(character){return character&&character.rules&&character.rules.primaryResource||{id:'mp',label:'MP',costLabel:'MP'};}
  function replaceResourceText(text,character){
    var definition=primary(character);
    var replacement=definition.label+' '+character.resources.primaryCurrent+'/'+character.rules.primaryMax;
    if(/MP\s+\d+\s*\/\s*\d+/i.test(text))return text.replace(/MP\s+\d+\s*\/\s*\d+/i,replacement);
    if(new RegExp(definition.label+'\\s+\\d+\\s*\\/\\s*\\d+','i').test(text))return text;
    return text;
  }
  function patchCards(){
    document.querySelectorAll('[data-open-sheet]').forEach(function(button){
      var id=button.dataset.openSheet;
      var character=id&&Service.get(id);
      if(!character)return;
      var scope=button.closest('.character-card,.continue-card')||button;
      var small=scope.querySelector('small')||scope.querySelector('p');
      if(small){
        var next=replaceResourceText(small.textContent,character);
        if(next!==small.textContent)small.textContent=next;
      }
    });
  }
  function patchPrimary(character){
    var definition=primary(character);
    var card=document.querySelector('.resource-card.mp');
    if(card){
      card.dataset.primaryResource=definition.id;
      var label=card.querySelector(':scope > span');
      if(label)label.textContent=definition.label+' atual';
      var display=card.querySelector('[data-resource-display="mp"]');
      if(display)display.textContent=character.resources.primaryCurrent+' / '+character.rules.primaryMax;
      var actions=card.querySelectorAll('[data-apply="mp"]');
      if(actions[0])actions[0].textContent='Gastar';
      if(actions[1])actions[1].textContent='Restaurar';
    }
    document.querySelectorAll('.review-grid > div').forEach(function(item){
      var label=item.querySelector('span');
      if(!label)return;
      if(label.textContent.trim()==='MP máximo'||label.textContent.trim()===definition.label+' máximo'){
        label.textContent=definition.label+' máximo';
        var value=item.querySelector('strong');
        if(value)value.textContent=character.rules.primaryMax;
      }
    });
    var skillsHeading=Array.prototype.find.call(document.querySelectorAll('.panel'),function(panel){
      var h3=panel.querySelector('h3');
      return h3&&h3.textContent.trim()==='Skills e habilidades';
    });
    if(skillsHeading){
      var intro=skillsHeading.querySelector('.section-heading p');
      if(intro)intro.textContent='O custo fixo é descontado automaticamente de '+definition.label+'.';
      skillsHeading.querySelectorAll('.skill-row small').forEach(function(small){
        small.textContent=small.textContent.replace(/\bMP\b/g,definition.costLabel||definition.label);
      });
    }
  }
  function displayValue(definition,state){
    if(definition.kind==='mode')return esc(state.current||'—');
    if(definition.kind==='toggle')return state.current?'Ativa':'Inativa';
    if(definition.kind==='signed-counter'){
      var value=Number(state.current||0);
      if(value>0)return 'Alta +'+value;
      if(value<0)return 'Baixa '+value;
      return 'Neutra 0';
    }
    if(definition.kind==='counter')return definition.max==null?String(state.current||0):(state.current+' / '+definition.max);
    if(definition.kind==='target-counter')return 'Controle por alvo · máximo '+definition.max;
    if(definition.kind==='target-marker')return 'Controle por alvo';
    return 'Referência de regra';
  }
  function controls(definition,state){
    if(definition.kind==='counter'||definition.kind==='signed-counter'){
      return '<div class="special-resource-actions"><button type="button" data-special-adjust="'+esc(definition.id)+'" data-special-delta="-1">−1</button><button type="button" data-special-adjust="'+esc(definition.id)+'" data-special-delta="1">+1</button></div>';
    }
    if(definition.kind==='mode'){
      return '<div class="special-resource-modes">'+(definition.options||[]).map(function(option){return '<button type="button" class="'+(state.current===option?'selected':'')+'" data-special-set="'+esc(definition.id)+'" data-special-value="'+esc(option)+'">'+esc(option)+'</button>';}).join('')+'</div>';
    }
    if(definition.kind==='toggle'){
      return '<button type="button" class="special-toggle '+(state.current?'active':'')+'" data-special-toggle="'+esc(definition.id)+'">'+(state.current?'Desativar':'Ativar')+'</button>';
    }
    return '';
  }
  function specialPanel(character){
    var definitions=character.rules&&Array.isArray(character.rules.specialResources)?character.rules.specialResources:[];
    if(!definitions.length)return '';
    var states=character.resources&&character.resources.special||{};
    return '<section class="panel affiliation-resources-panel" data-affiliation-resources><div class="section-heading"><div><span class="eyebrow">ASSINATURA EM JOGO</span><h3>Recursos de '+esc(character.affiliation)+'</h3><p>Controles vinculados ao Banco de Regras da 3ª edição.</p></div></div><div class="special-resource-grid">'+definitions.map(function(definition){
      var state=states[definition.id]||{current:null};
      return '<article class="special-resource-card" data-special-card="'+esc(definition.id)+'"><span>'+esc(definition.label)+'</span><strong>'+displayValue(definition,state)+'</strong>'+(definition.description?'<small>'+esc(definition.description)+'</small>':'')+controls(definition,state)+'</article>';
    }).join('')+'</div></section>';
  }
  function patchSpecial(character){
    var resourceGrid=document.querySelector('.resource-grid');
    if(!resourceGrid)return;
    var existing=document.querySelector('[data-affiliation-resources]');
    var html=specialPanel(character);
    if(!html){if(existing)existing.remove();return;}
    if(existing)existing.outerHTML=html;
    else resourceGrid.insertAdjacentHTML('afterend',html);
  }
  function enhance(){
    if(enhancing)return;
    enhancing=true;
    try{
      patchCards();
      var character=currentCharacter();
      if(character){patchPrimary(character);patchSpecial(character);}
    }finally{enhancing=false;}
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    setTimeout(function(){scheduled=false;enhance();},0);
  }

  document.addEventListener('click',function(event){
    var adjust=event.target.closest('[data-special-adjust]');
    if(adjust){
      event.preventDefault();
      var character=currentCharacter();
      if(!character)return;
      try{Service.adjustSpecialResource(character.id,adjust.dataset.specialAdjust,Number(adjust.dataset.specialDelta||0));schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var set=event.target.closest('[data-special-set]');
    if(set){
      event.preventDefault();
      var setCharacter=currentCharacter();
      if(!setCharacter)return;
      try{Service.setSpecialResource(setCharacter.id,set.dataset.specialSet,set.dataset.specialValue);schedule();}
      catch(error){alert(error.message);}
      return;
    }
    var toggle=event.target.closest('[data-special-toggle]');
    if(toggle){
      event.preventDefault();
      var toggleCharacter=currentCharacter();
      if(!toggleCharacter)return;
      var state=toggleCharacter.resources.special&&toggleCharacter.resources.special[toggle.dataset.specialToggle];
      try{Service.setSpecialResource(toggleCharacter.id,toggle.dataset.specialToggle,!(state&&state.current));schedule();}
      catch(error){alert(error.message);}
    }
  });

  global.addEventListener('semideuses:character-updated',schedule);
  global.addEventListener('load',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})(window);
(function(global){
  'use strict';

  var Model=global.SemideusesCharacter;
  var App=global.SemideusesApp;
  if(!Model)return;

  var STEP_BY_HEADING={
    'Conceito':0,'Identidade':1,'Natureza':2,'Filiação':3,'Atributos':4,
    'Antecedente':5,'Caminho':6,'Marca':7,'Revisão':8
  };

  function heading(){var h=document.querySelector('.wizard-head h2');return h?h.textContent.trim():'';}
  function editing(){return App&&typeof App.getEditing==='function'?App.getEditing():null;}
  function removePanel(){var panel=document.querySelector('[data-creation-errors]');if(panel)panel.remove();}
  function showErrors(errors){
    removePanel();
    if(!errors||!errors.length)return;
    var card=document.querySelector('.wizard-card');
    if(!card)return;
    var html='<div class="creation-error-panel" data-creation-errors role="alert"><strong>Revise esta etapa</strong><ul>'+errors.map(function(error){return '<li>'+String(error.message||'Erro de validação')+'</li>';}).join('')+'</ul></div>';
    card.insertAdjacentHTML('afterbegin',html);
    var panel=card.querySelector('[data-creation-errors]');
    if(panel)panel.scrollIntoView({behavior:'smooth',block:'center'});
  }
  function validateCurrent(all){
    var character=editing();
    if(!character)return {valid:true,errors:[]};
    var step=STEP_BY_HEADING[heading()];
    return Model.validate(character,all?{}:{step:step});
  }
  function block(event,result){
    event.preventDefault();
    event.stopImmediatePropagation();
    showErrors(result.errors);
  }

  document.addEventListener('click',function(event){
    var next=event.target.closest('[data-next]');
    if(next){
      var stepResult=validateCurrent(false);
      if(!stepResult.valid){block(event,stepResult);return;}
      removePanel();
      return;
    }
    var save=event.target.closest('[data-save]');
    if(save){
      var finalResult=validateCurrent(true);
      if(!finalResult.valid){block(event,finalResult);return;}
      removePanel();
    }
  },true);

  document.addEventListener('input',removePanel,true);
  document.addEventListener('change',removePanel,true);
  document.addEventListener('click',function(event){
    if(event.target.closest('[data-aff],[data-bg],[data-path],[data-mark],[data-level-delta]'))removePanel();
  },true);
})(window);
