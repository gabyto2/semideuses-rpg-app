(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Rules=global.SemideusesRules;
  var Database=global.SemideusesRulesDatabase;
  if(!Service||!Model||!Rules||!Database)return;

  var SKILL_RANKS={3:'D',6:'C',9:'B',13:'A',17:'S'};
  var ATTRIBUTE_AND_TALENT=[4];
  var ATTRIBUTE_OR_TALENT=[8,12,16,19];
  function clone(value){return Model.clone(value);}
  function gainFor(level){
    return {
      level:level,
      requiresPath:level>=3,
      choosePath:level===3,
      requiresMark:level>=5,
      chooseMark:level===5,
      skillRank:SKILL_RANKS[level]||'',
      attributeAndTalent:ATTRIBUTE_AND_TALENT.indexOf(level)>=0,
      attributeOrTalent:ATTRIBUTE_OR_TALENT.indexOf(level)>=0,
      amplification:level===13,
      supreme:level===20
    };
  }
  function preview(id){
    var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');if(character.level>=20)throw new Error('Este personagem já está no nível máximo.');
    var next=character.level+1,gain=gainFor(next),affiliation=Database.getAffiliation(character.affiliation),unlocks=[];
    if(affiliation&&affiliation.progression&&affiliation.progression[next])unlocks=unlocks.concat(affiliation.progression[next]);
    if(gain.skillRank)unlocks.push('Skill automática de Rank '+gain.skillRank);
    if(gain.attributeAndTalent)unlocks.push('+2 em um atributo e +1 Talento');
    if(gain.attributeOrTalent)unlocks.push('+2 em um atributo ou +1 Talento');
    if(gain.amplification)unlocks.push('Amplificação disponível');
    var draft=clone(character);draft.level=next;draft=Model.calculate(draft);
    return {character:character,nextLevel:next,gain:gain,unlocks:unlocks,pvIncrease:draft.rules.pvMax-character.rules.pvMax,primaryIncrease:draft.rules.primaryMax-character.rules.primaryMax,newPvMax:draft.rules.pvMax,newPrimaryMax:draft.rules.primaryMax,primaryLabel:draft.rules.primaryResource.label,paths:affiliation&&affiliation.paths||[],marks:Array.isArray(Database.heroMarks)?Database.heroMarks:[]};
  }
  function validateChoice(previewData,choices){
    choices=choices||{};var c=previewData.character,gain=previewData.gain,errors=[];
    if(gain.requiresPath&&!c.divinePath){var names=previewData.paths.map(function(path){return path.name;});if(names.indexOf(choices.divinePath)<0)errors.push('Escolha um Caminho Divino válido.');}
    if(gain.requiresMark&&!c.heroMark){var marks=previewData.marks.map(function(mark){return mark.name;});if(marks.indexOf(choices.heroMark)<0)errors.push('Escolha uma Marca do Herói válida.');}
    if(gain.skillRank&&!String(choices.skillName||'').trim())errors.push('Informe a Skill automática de Rank '+gain.skillRank+'.');
    if(gain.attributeAndTalent){if(Model.attributes.indexOf(choices.attribute)<0)errors.push('Escolha o atributo que recebe +2.');if(!String(choices.talent||'').trim())errors.push('Informe o Talento recebido no nível 4.');}
    if(gain.attributeOrTalent){if(['attribute','talent'].indexOf(choices.advancementChoice)<0)errors.push('Escolha entre atributo ou Talento.');if(choices.advancementChoice==='attribute'&&Model.attributes.indexOf(choices.attribute)<0)errors.push('Escolha o atributo que recebe +2.');if(choices.advancementChoice==='talent'&&!String(choices.talent||'').trim())errors.push('Informe o Talento escolhido.');}
    return errors;
  }
  function apply(id,choices){
    var data=preview(id),errors=validateChoice(data,choices);if(errors.length)throw new Error(errors.join('\n'));
    return Service.update(id,function(character){
      var oldPv=Number(character.resources.pvCurrent||0),oldPrimary=Number(character.resources.primaryCurrent||character.resources.mpCurrent||0),gain=data.gain;
      character.level=data.nextLevel;
      if(!character.divinePath&&choices.divinePath)character.divinePath=choices.divinePath;
      if(!character.heroMark&&choices.heroMark)character.heroMark=choices.heroMark;
      character.talents=Array.isArray(character.talents)?character.talents:[];
      if(gain.attributeAndTalent){character.attributes[choices.attribute]=Math.min(30,Number(character.attributes[choices.attribute]||10)+2);character.talents.push({id:Model.uid('talent'),name:String(choices.talent).trim(),level:data.nextLevel});}
      if(gain.attributeOrTalent&&choices.advancementChoice==='attribute')character.attributes[choices.attribute]=Math.min(30,Number(character.attributes[choices.attribute]||10)+2);
      if(gain.attributeOrTalent&&choices.advancementChoice==='talent')character.talents.push({id:Model.uid('talent'),name:String(choices.talent).trim(),level:data.nextLevel});
      if(gain.skillRank){character.skills=Model.cleanSkills((character.skills||[]).concat([{id:Model.uid('skill'),name:String(choices.skillName).trim(),rank:gain.skillRank,cost:Rules.rankCost(gain.skillRank,character.heroMark==='Bônus de Conjuração')||0,resourceId:'primary',description:'Skill automática recebida no nível '+data.nextLevel+'.'}]));}
      character.evolutionHistory=Array.isArray(character.evolutionHistory)?character.evolutionHistory:[];
      character.evolutionHistory.push({from:data.nextLevel-1,to:data.nextLevel,at:new Date().toISOString(),choices:clone(choices),unlocks:data.unlocks.slice()});
      character=Model.calculate(character);
      character.resources.pvCurrent=Math.min(oldPv,character.rules.pvMax);
      character=Model.setResource(character,'primary',Math.min(oldPrimary,character.rules.primaryMax));
      return character;
    });
  }
  global.SemideusesEvolutionRuntime={version:'3e-evolution-runtime-0.1.0',gainFor:gainFor,preview:preview,validateChoice:validateChoice,apply:apply};
})(window);
