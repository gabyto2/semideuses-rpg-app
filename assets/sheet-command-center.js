(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Runtime=global.SemideusesSessionRuntime;
  var Database=global.SemideusesRulesDatabase;
  var Rules=global.SemideusesRules;
  var App=global.SemideusesApp;
  if(!Service||!Model||!Database||!Rules)return;

  var activeTab='powers',scheduled=false,rendering=false;
  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});}
  function signed(value){return Number(value)>=0?'+'+Number(value):String(Number(value));}
  function character(){var editing=App&&App.getEditing&&App.getEditing();return editing&&editing.id?Service.get(editing.id)||editing:null;}
  function stateKey(c){
    return [c.id,c.level,c.divinePath,c.heroMark,JSON.stringify(c.skills||[]),JSON.stringify(c.talents||[]),
      JSON.stringify(c.periciaProficiencies||[]),JSON.stringify(c.periciaExpertise||[]),
      JSON.stringify(c.session&&c.session.abilityUses||{}),JSON.stringify(c.session&&c.session.turnEconomy||{}),
      c.resources&&c.resources.primaryCurrent,c.resources&&c.resources.mpCurrent].join('|');
  }
  function statsKey(c){
    return [c.id,c.level,JSON.stringify(c.attributes||{}),c.rules.armorClass,c.rules.armorClassFormula,c.rules.initiative,
      c.rules.passivePerception,c.rules.abilityDC,c.rules.castingAttackBonus,c.rules.proficiency,c.rules.casting].join('|');
  }
  function topStats(c,key){
    var attr=Model.attributes.map(function(a){
      return '<article class="top-attribute" data-top-attribute="'+a+'"><span>'+a+'</span><strong>'+Number(c.attributes[a]||0)+'</strong><small>'+signed(Rules.modifier(c.attributes[a]))+'</small></article>';
    }).join('');
    return '<section class="sheet-core-stats" data-core-stats data-stats-state="'+esc(key)+'">'+attr+
      '<article class="ca-main"><span>CA</span><strong>'+c.rules.armorClass+'</strong><small>'+esc(c.rules.armorClassFormula)+' · regra do projeto</small></article>'+
      '<article><span>Iniciativa</span><strong>'+signed(c.rules.initiative)+'</strong><small>DES + Reflexos de TDAH</small></article>'+
      '<article><span>Percepção Passiva</span><strong>'+c.rules.passivePerception+'</strong><small>10 + Percepção</small></article>'+
      '<article><span>CD de Habilidade</span><strong>'+c.rules.abilityDC+'</strong><small>8 + Prof. + '+esc(c.rules.casting)+'</small></article>'+
      '<article><span>Ataque de Conjuração</span><strong>'+signed(c.rules.castingAttackBonus)+'</strong><small>Prof. + '+esc(c.rules.casting)+'</small></article>'+
      '<article><span>Proficiência</span><strong>+'+c.rules.proficiency+'</strong><small>Nível '+c.level+'</small></article></section>';
  }
  function tabs(c){
    var path=(c.rules.paths||[]).find(function(item){return item.name===c.divinePath;});
    var labels=[['powers','Habilidades'],['path','Caminho'],['skills','Skills'],['talents','Talentos'],['pericias','Perícias']];
    return '<nav class="command-tabs">'+labels.map(function(tab){
      var count=tab[0]==='skills'?(c.skills||[]).length:
        tab[0]==='talents'?(c.talents||[]).length:
        tab[0]==='pericias'?(c.rules.pericias||[]).filter(function(p){return p.proficient;}).length:
        tab[0]==='path'?(path?path.abilities.length:0):
        Runtime?Runtime.abilityCatalog(c).filter(function(item){return item.group==='base';}).length:0;
      return '<button class="'+(activeTab===tab[0]?'active':'')+'" data-command-tab="'+tab[0]+'"><span>'+tab[1]+'</span><b>'+count+'</b></button>';
    }).join('')+'</nav>';
  }
  function officialAbility(c,item){
    var a=item.ability,passive=/passiva|escolha permanente/i.test(String(a.rank)+' '+String(a.action));
    var check=Runtime&&Runtime.canUseOfficialAbility?Runtime.canUseOfficialAbility(c,item.key):{allowed:false,cost:Number(a.cost||0),reason:''};
    return '<details class="command-ability"><summary><span><strong>'+esc(a.name)+'</strong><small>Nv '+a.level+' · Rank '+esc(a.rank||'—')+' · '+esc(a.action||'—')+'</small></span><b>'+
      (passive?'Passiva':(check.cost||0)+' '+esc(c.rules.primaryResource.label))+
      '</b></summary><div><p>'+esc(a.effect||'')+'</p>'+
      (passive?'':'<button class="primary" data-command-use-ability="'+esc(item.key)+'" '+(check.allowed?'':'disabled title="'+esc(check.reason||'Indisponível')+'"')+'>Usar habilidade</button>')+
      '</div></details>';
  }
  function powersTab(c){
    var list=Runtime?Runtime.abilityCatalog(c).filter(function(item){return item.group==='base';}):[];
    return '<div class="command-tab-head"><div><span class="eyebrow">FILIAÇÃO</span><h3>'+esc(c.affiliation)+'</h3><p>'+
      esc(c.rules.signature&&c.rules.signature.name?'Assinatura: '+c.rules.signature.name:'Poderes desbloqueados no nível atual.')+
      '</p></div></div><div class="command-ability-list">'+list.map(function(item){return officialAbility(c,item);}).join('')+'</div>';
  }
  function pathTab(c){
    if(c.level<3)return '<div class="command-empty"><strong>Caminho Divino</strong><p>Libera no nível 3.</p></div>';
    var path=(c.rules.paths||[]).find(function(item){return item.name===c.divinePath;});
    if(!path)return '<div class="command-empty"><strong>Escolha de Caminho pendente</strong><p>Use Evoluir ficha ou Editar personagem para concluir a escolha.</p></div>';
    var list=Runtime?Runtime.abilityCatalog(c).filter(function(item){return item.group==='path';}):[];
    return '<div class="command-tab-head"><div><span class="eyebrow">CAMINHO DIVINO</span><h3>'+esc(path.name)+'</h3><p>'+esc(path.summary||'')+
      '</p></div></div><div class="command-ability-list">'+list.map(function(item){return officialAbility(c,item);}).join('')+'</div>';
  }
  function skillUsage(c,skill){if(!Runtime||!Runtime.canUseLearnedSkill)return {allowed:true,cost:skill.cost||0};return Runtime.canUseLearnedSkill(c,skill.id);}
  function skillsTab(c){
    var learned=c.skills||[];
    var available=(Database.listSkills?Database.listSkills():[]).filter(function(skill){
      return skill.minLevel<=c.level&&!learned.some(function(item){return item.catalogId===skill.id||item.name===skill.name;});
    });
    var trained=learned.filter(function(item){return item.sourceType==='trained';}).length;
    var limit=Service.trainedSkillLimit?Service.trainedSkillLimit(c):2+Math.floor(c.level/2);
    var rankOptions=[['E',1],['D',1],['C',5],['B',5],['A',9],['S',13],['SS',17],['Lendário',17]].filter(function(entry){return c.level>=entry[1];});
    return '<div class="command-tab-head"><div><span class="eyebrow">TREINAMENTO</span><h3>Skills conhecidas</h3><p>Treinadas: '+trained+' / '+limit+'. Skills automáticas não ocupam este limite.</p></div></div>'+
      (learned.length?'<div class="command-skill-list">'+learned.map(function(skill){
        var check=skillUsage(c,skill);
        return '<details><summary><span><strong>'+esc(skill.name)+'</strong><small>Rank '+esc(skill.rank||'—')+
          (skill.axis?' · '+esc(skill.axis):'')+(skill.sourceType==='automatic'?' · Automática':skill.sourceType==='trained'?' · Treinada':'')+
          '</small></span><b>'+Number(check.cost==null?skill.cost||0:check.cost)+' '+esc(c.rules.primaryResource.label)+
          '</b></summary><div><small>'+esc(skill.action||'')+'</small><p>'+esc(skill.description||'')+
          '</p><div class="command-row-actions"><button class="primary" data-command-use-skill="'+skill.id+'" '+
          (check.allowed===false?'disabled title="'+esc(check.reason||'Indisponível')+'"':'')+
          '>Usar</button><button class="danger-link" data-command-remove-skill="'+skill.id+'">Remover</button></div></div></details>';
      }).join('')+'</div>':'<div class="command-empty"><p>Nenhuma Skill registrada.</p></div>')+
      '<details class="command-add-box"><summary>+ Adicionar Skill do catálogo</summary><div><label><span>Skill</span><select data-command-skill-catalog><option value="">Escolha…</option>'+
      available.map(function(skill){return '<option value="'+skill.id+'">'+esc(skill.name+' · Rank '+skill.rank+' · '+skill.axis)+'</option>';}).join('')+
      '</select></label><label><span>Registrar como</span><select data-command-skill-source><option value="trained">Treinada</option><option value="automatic">Automática / ganho de nível</option></select></label><button class="secondary" data-command-learn-skill>Adicionar</button></div></details>'+
      '<details class="command-add-box"><summary>+ Skill personalizada</summary><div><label><span>Nome</span><input data-command-custom-name placeholder="Nome da Skill"></label><label><span>Rank</span><select data-command-custom-rank>'+
      rankOptions.map(function(entry){return '<option>'+entry[0]+'</option>';}).join('')+
      '</select></label><label class="full"><span>Descrição mecânica aprovada</span><textarea data-command-custom-description rows="3"></textarea></label><button class="secondary" data-command-add-custom>Registrar treinada</button></div></details>';
  }
  function talentDefinition(record){return Database.getTalent&&Database.getTalent(record.catalogId||record.name);}
  function talentsTab(c){
    var records=c.talents||[];
    var available=(Database.listTalents?Database.listTalents():[]).filter(function(talent){
      if(!talent.repeatable&&records.some(function(record){return record.catalogId===talent.id||record.name===talent.name;}))return false;
      return !Service.talentPrerequisite||!Service.talentPrerequisite(c,talent);
    });
    return '<div class="command-tab-head"><div><span class="eyebrow">TALENTOS</span><h3>Treino e aptidão</h3><p>'+records.length+' Talento(s) registrado(s). Todo personagem recebe um Talento gratuito no nível 1.</p></div></div>'+
      (records.length?'<div class="command-talent-list">'+records.map(function(record){
        var t=talentDefinition(record)||{name:record.name,category:record.category||'Talento',effect:'Detalhes não catalogados.'};
        return '<details><summary><span><strong>'+esc(t.name)+'</strong><small>'+esc(t.category)+(record.choice?' · '+esc(Array.isArray(record.choice)?record.choice.join(', '):record.choice):'')+
          '</small></span></summary><div>'+(t.prerequisite?'<small>Pré-requisito: '+esc(t.prerequisite)+'</small>':'')+'<p>'+esc(t.effect||'')+'</p></div></details>';
      }).join('')+'</div>':'<div class="command-warning"><strong>Talento inicial pendente</strong><p>Registre o Talento gratuito do nível 1.</p></div>')+
      '<details class="command-add-box"><summary>+ Registrar Talento</summary><div><label><span>Talento</span><select data-command-talent><option value="">Escolha…</option>'+
      ['Combate','Perícia','Resistência','Divino'].map(function(category){
        var list=available.filter(function(t){return t.category===category;});
        return list.length?'<optgroup label="'+category+'">'+list.map(function(t){return '<option value="'+t.id+'">'+esc(t.name)+'</option>';}).join('')+'</optgroup>':'';
      }).join('')+
      '</select></label><label><span>Escolha específica, quando houver</span><input data-command-talent-choice placeholder="Perícia, arma, elemento…"></label><button class="secondary" data-command-add-talent>Registrar</button></div></details>';
  }
  function periciasTab(c){
    var list=c.rules.pericias||[];
    return '<div class="command-tab-head"><div><span class="eyebrow">PERÍCIAS</span><h3>Testes automatizados</h3><p>P = Proficiência. E = Especialização, somando o Bônus de Proficiência duas vezes.</p></div></div><div class="pericia-grid">'+
      list.map(function(p){
        return '<article class="pericia-card '+(p.expertise?'expert':p.proficient?'trained':'')+'"><div><strong>'+esc(p.name)+'</strong><small>'+p.attribute+(p.official?' · Filiação/Antecedente':'')+
          '</small></div><b>'+signed(p.bonus)+'</b><div class="pericia-state"><button class="'+(p.proficient?'active':'')+'" data-pericia-toggle="proficient" data-pericia="'+esc(p.name)+'" title="Proficiência">P</button><button class="'+(p.expertise?'active':'')+'" data-pericia-toggle="expertise" data-pericia="'+esc(p.name)+'" title="Especialização">E</button></div></article>';
      }).join('')+'</div>';
  }
  function tabBody(c){if(activeTab==='path')return pathTab(c);if(activeTab==='skills')return skillsTab(c);if(activeTab==='talents')return talentsTab(c);if(activeTab==='pericias')return periciasTab(c);return powersTab(c);}
  function hub(c,key){return '<section class="panel command-center" data-command-center data-state="'+esc(key)+'">'+tabs(c)+'<div class="command-tab-body">'+tabBody(c)+'</div></section>';}
  function hideLegacy(){
    document.querySelectorAll('.official-abilities-runtime').forEach(function(node){node.style.display='none';});
    Array.prototype.forEach.call(document.querySelectorAll('.panel h3'),function(heading){
      var text=heading.textContent.trim();
      if(text==='Skills e habilidades'||text==='Atributos'){var panel=heading.closest('.panel');if(panel)panel.style.display='none';}
    });
  }
  function render(force){
    if(rendering)return;
    var grid=document.querySelector('.resource-grid'),c=character();if(!grid||!c)return;
    rendering=true;
    try{
      hideLegacy();
      var sk=statsKey(c),stats=document.querySelector('[data-core-stats]');
      if(!stats){
        var session=document.querySelector('[data-session-tools]');
        (session||grid).insertAdjacentHTML('beforebegin',topStats(c,sk));
      }else if(stats.dataset.statsState!==sk){
        stats.outerHTML=topStats(c,sk);
      }
      var key=stateKey(c),old=document.querySelector('[data-command-center]'),html=hub(c,key);
      if(old){if(force||old.dataset.state!==key)old.outerHTML=html;}else grid.insertAdjacentHTML('afterend',html);
      hideLegacy();
    }finally{rendering=false;}
  }
  function schedule(){if(scheduled)return;scheduled=true;setTimeout(function(){scheduled=false;render(false);},0);}
  function refresh(){if(App&&App.refresh)App.refresh();schedule();}

  document.addEventListener('click',function(event){
    var c=character();if(!c)return;
    var tab=event.target.closest('[data-command-tab]');if(tab){activeTab=tab.dataset.commandTab;render(true);return;}
    var ability=event.target.closest('[data-command-use-ability]');if(ability){try{Runtime.useOfficialAbility(c.id,ability.dataset.commandUseAbility);refresh();}catch(error){alert(error.message);}return;}
    var skill=event.target.closest('[data-command-use-skill]');if(skill){try{if(Runtime&&Runtime.useLearnedSkill)Runtime.useLearnedSkill(c.id,skill.dataset.commandUseSkill);else Service.useSkill(c.id,skill.dataset.commandUseSkill);refresh();}catch(error){alert(error.message);}return;}
    var removeSkill=event.target.closest('[data-command-remove-skill]');if(removeSkill){if(confirm('Remover esta Skill da ficha?'))try{Service.removeSkill(c.id,removeSkill.dataset.commandRemoveSkill);refresh();}catch(error){alert(error.message);}return;}
    var pericia=event.target.closest('[data-pericia-toggle]');
    if(pericia){
      var p=Model.pericia(c,pericia.dataset.pericia),state;
      if(pericia.dataset.periciaToggle==='expertise')state=p.expertise?'proficient':'expertise';
      else state=p.official?'proficient':p.proficient?'untrained':'proficient';
      try{Service.setPericiaState(c.id,pericia.dataset.pericia,state);refresh();}catch(error){alert(error.message);}return;
    }
    if(event.target.closest('[data-command-learn-skill]')){
      var sel=document.querySelector('[data-command-skill-catalog]'),source=document.querySelector('[data-command-skill-source]');
      try{if(!sel||!sel.value)throw new Error('Escolha uma Skill.');Service.learnCatalogSkill(c.id,sel.value,source&&source.value||'trained');refresh();}catch(error){alert(error.message);}return;
    }
    if(event.target.closest('[data-command-add-custom]')){
      var name=document.querySelector('[data-command-custom-name]'),rank=document.querySelector('[data-command-custom-rank]'),description=document.querySelector('[data-command-custom-description]');
      try{Service.addCustomSkill(c.id,{name:name&&name.value,rank:rank&&rank.value,description:description&&description.value});refresh();}catch(error){alert(error.message);}return;
    }
    if(event.target.closest('[data-command-add-talent]')){
      var talent=document.querySelector('[data-command-talent]'),choice=document.querySelector('[data-command-talent-choice]');
      try{if(!talent||!talent.value)throw new Error('Escolha um Talento.');Service.addTalent(c.id,talent.value,choice&&choice.value,c.level);refresh();}catch(error){alert(error.message);}return;
    }
  });

  global.addEventListener('semideuses:character-updated',schedule);
  global.addEventListener('load',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})(window);
