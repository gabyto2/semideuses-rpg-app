(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var db=global.SemideusesRulesDatabase;
  if(!Service||!Model||!db)return;

  function canonical(name){return Model.canonicalPericia?Model.canonicalPericia(name):String(name||'');}
  function unique(list){return (list||[]).filter(function(value,index,all){return all.indexOf(value)===index;});}
  function setPericiaState(id,name,state){
    name=canonical(name);state=String(state||'untrained');
    return Service.update(id,function(character){
      character=Model.normalize(character);
      var official=(character.officialSkillProficiencies||[]).map(canonical);
      var prof=unique((character.periciaProficiencies||[]).map(canonical));
      var exp=unique((character.periciaExpertise||[]).map(canonical));
      function remove(list,value){var index=list.indexOf(value);if(index>=0)list.splice(index,1);}
      if(state==='untrained'){
        remove(exp,name);
        if(official.indexOf(name)<0)remove(prof,name);
      }else if(state==='proficient'){
        remove(exp,name);if(official.indexOf(name)<0&&prof.indexOf(name)<0)prof.push(name);
      }else if(state==='expertise'){
        if(official.indexOf(name)<0&&prof.indexOf(name)<0)prof.push(name);
        if(exp.indexOf(name)<0)exp.push(name);
      }else throw new Error('Estado de perícia inválido.');
      character.periciaProficiencies=prof;character.periciaExpertise=exp;return character;
    });
  }
  function trainedSkillLimit(character){return 2+Math.floor(Number(character.level||1)/2);}
  function learnCatalogSkill(id,skillId,sourceType){
    sourceType=sourceType||'trained';
    return Service.update(id,function(character){
      character=Model.normalize(character);var skill=db.getSkill&&db.getSkill(skillId);if(!skill)throw new Error('Skill do catálogo não encontrada.');
      if(Number(character.level)<Number(skill.minLevel||1))throw new Error('Esta Skill exige nível '+skill.minLevel+'+.');
      if((character.skills||[]).some(function(item){return item.catalogId===skill.id||item.name===skill.name;}))throw new Error('Esta Skill já está na ficha.');
      if(sourceType==='trained'){
        var trained=(character.skills||[]).filter(function(item){return item.sourceType==='trained';}).length;
        if(trained>=trainedSkillLimit(character))throw new Error('Limite de Skills treinadas atingido: '+trainedSkillLimit(character)+'.');
      }
      character.skills=(character.skills||[]).concat([{
        id:Model.uid('skill'),catalogId:skill.id,name:skill.name,rank:skill.rank,cost:skill.cost,resourceId:'primary',
        description:skill.effect,action:skill.action,axis:skill.axis,minLevel:skill.minLevel,usage:skill.usage||null,
        sourceType:sourceType,automatic:sourceType==='automatic'
      }]);
      return character;
    });
  }
  function addCustomSkill(id,payload){
    payload=payload||{};
    return Service.update(id,function(character){
      character=Model.normalize(character);var rank=String(payload.rank||'E'),name=String(payload.name||'').trim();
      if(!name)throw new Error('Informe o nome da Skill personalizada.');
      var minimum={E:1,D:1,C:5,B:5,A:9,S:13,SS:17,'Lendário':17}[rank];if(!minimum)throw new Error('Rank inválido.');
      if(character.level<minimum)throw new Error('Rank '+rank+' exige nível '+minimum+'+.');
      var trained=(character.skills||[]).filter(function(item){return item.sourceType==='trained';}).length;if(trained>=trainedSkillLimit(character))throw new Error('Limite de Skills treinadas atingido: '+trainedSkillLimit(character)+'.');
      character.skills=(character.skills||[]).concat([{id:Model.uid('skill'),name:name,rank:rank,cost:global.SemideusesRules.rankCost(rank,false)||0,resourceId:'primary',description:String(payload.description||'Skill personalizada aprovada pelo Mestre.'),action:String(payload.action||'Definida pelo jogador'),sourceType:'trained',automatic:false}]);
      return character;
    });
  }
  function talentPrerequisite(character,talent){
    if(talent.minLevel&&character.level<talent.minLevel)return 'Exige nível '+talent.minLevel+'+';
    if(talent.requiresTalent&&!(character.talents||[]).some(function(item){return item.name===talent.requiresTalent;}))return 'Exige '+talent.requiresTalent+'.';
    if(talent.requiresAttribute&&Number(character.attributes[talent.requiresAttribute.name]||0)<talent.requiresAttribute.min)return 'Exige '+talent.requiresAttribute.name+' '+talent.requiresAttribute.min+'+';
    if(talent.requiresSkillProficiency){var p=Model.pericia(character,talent.requiresSkillProficiency);if(!p||!p.proficient)return 'Exige proficiência em '+talent.requiresSkillProficiency+'.';}
    return '';
  }
  function addTalent(id,talentId,choice,level){
    return Service.update(id,function(character){
      character=Model.normalize(character);var talent=db.getTalent&&db.getTalent(talentId);if(!talent)throw new Error('Talento não encontrado.');
      var reason=talentPrerequisite(character,talent);if(reason)throw new Error(reason);
      var existing=(character.talents||[]).filter(function(item){return item.catalogId===talent.id||item.name===talent.name;});
      if(existing.length&&!talent.repeatable)throw new Error('Este Talento já foi escolhido.');
      if(talent.choice&&!choice)throw new Error('Este Talento exige uma escolha adicional.');
      if(talent.name==='Especialista'){
        var chosen=canonical(choice),pericia=Model.pericia(character,chosen);
        if(!pericia||!pericia.proficient)throw new Error('Especialista exige proficiência na perícia escolhida.');
        choice=chosen;
      }
      if(talent.name==='Polímata'){
        var choices=String(choice||'').split(',').map(function(item){return canonical(item.trim());}).filter(Boolean);
        if(choices.length!==3||unique(choices).length!==3)throw new Error('Polímata exige três perícias diferentes, separadas por vírgula.');
        choices.forEach(function(name){if(!Model.periciaDefinitions.some(function(item){return item.name===name;}))throw new Error('Perícia inválida em Polímata: '+name+'.');});
        choice=choices;
      }
      character.talents=(character.talents||[]).concat([{id:Model.uid('talent'),catalogId:talent.id,name:talent.name,category:talent.category,choice:choice||'',level:Number(level||character.level||1)}]);
      return character;
    });
  }
  function removeTalent(id,talentRecordId){return Service.update(id,function(character){character.talents=(character.talents||[]).filter(function(item){return item.id!==talentRecordId;});return character;});}

  Service.version='3e-service-0.5.0';
  Service.setPericiaState=setPericiaState;
  Service.learnCatalogSkill=learnCatalogSkill;
  Service.trainedSkillLimit=function(idOrCharacter){var c=typeof idOrCharacter==='string'?Service.get(idOrCharacter):Model.normalize(idOrCharacter);return trainedSkillLimit(c);};
  Service.addCustomSkill=addCustomSkill;
  Service.talentPrerequisite=talentPrerequisite;
  Service.addTalent=addTalent;
  Service.removeTalent=removeTalent;
})(window);