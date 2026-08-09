(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Rules=global.SemideusesRules;
  var Database=global.SemideusesRulesDatabase;
  var OriginCatalog=global.SemideusesOriginCatalog;
  if(!Service||!Model||!Rules||!Database)return;

  var SKILL_RANKS={3:'D',6:'C',9:'B',13:'A',17:'S'};
  var ATTRIBUTE_AND_TALENT=[4];
  var ATTRIBUTE_OR_TALENT=[8,12,16,19];
  function clone(value){return Model.clone(value);}
  function gainFor(level,character){var type=character&&character.heroType||'Semideus Grego',requiresPath=type==='Legado'||(type==='Semideus Grego'&&level>=3);return {level:level,requiresPath:requiresPath,choosePath:(type==='Legado'&&!character.divinePath)||(type==='Semideus Grego'&&level===3),requiresMark:level>=5,chooseMark:level===5,chooseProfession:type==='Mortal Vidente'&&level===2&&!(character.originChoices&&character.originChoices.profession),skillRank:SKILL_RANKS[level]||'',attributeAndTalent:ATTRIBUTE_AND_TALENT.indexOf(level)>=0,attributeOrTalent:ATTRIBUTE_OR_TALENT.indexOf(level)>=0,originTalent:type==='Mortal Vidente'&&[6,11,16].indexOf(level)>=0,amplification:level===13,supreme:level===20};}
  function talentAllowed(character,talent,nextLevel){
    var draft=clone(character);draft.level=nextLevel;draft=Model.calculate(draft);
    if(talent.minLevel&&nextLevel<talent.minLevel)return false;
    if(talent.requiresTalent&&!(draft.talents||[]).some(function(item){return item.name===talent.requiresTalent;}))return false;
    if(talent.requiresAttribute&&Number(draft.attributes[talent.requiresAttribute.name]||0)<talent.requiresAttribute.min)return false;
    if(talent.requiresSkillProficiency){var p=Model.pericia&&Model.pericia(draft,talent.requiresSkillProficiency);if(!p||!p.proficient)return false;}
    return true;
  }
  function preview(id){
    var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');if(character.level>=20)throw new Error('Este personagem já está no nível máximo.');
    var next=character.level+1,gain=gainFor(next,character),unlocks=[];
    if(character.rules&&character.rules.progression&&character.rules.progression[next])unlocks=unlocks.concat(character.rules.progression[next]);
    if(gain.skillRank)unlocks.push('Skill automática de Rank '+gain.skillRank);
    if(gain.attributeAndTalent)unlocks.push('+2 em um atributo e +1 Talento');
    if(gain.attributeOrTalent)unlocks.push('+2 em um atributo ou +1 Talento');
    if(gain.originTalent)unlocks.push('+1 Talento extra de Engenhosidade Humana');
    if(gain.amplification)unlocks.push('Amplificação disponível');
    var draft=clone(character);draft.level=next;draft=Model.calculate(draft);
    var skills=gain.skillRank&&Database.skillsByRank?Database.skillsByRank(gain.skillRank).filter(function(skill){var passive=/passiva/i.test(String(skill.action||'')+' '+String(skill.usage||''));return Number(skill.minLevel||1)<=next&&(!draft.rules.passiveSkillsOnly||passive);}):[];
    var talents=Database.listTalents?Database.listTalents().filter(function(talent){return talentAllowed(character,talent,next);}):[];
    var allowedMarks=draft.rules.allowedHeroMarks||[];
    var origin=OriginCatalog&&OriginCatalog.get?OriginCatalog.get(character.heroType):null;
    return {character:character,nextLevel:next,gain:gain,unlocks:unlocks,pvIncrease:draft.rules.pvMax-character.rules.pvMax,primaryIncrease:draft.rules.primaryMax-character.rules.primaryMax,newPvMax:draft.rules.pvMax,newPrimaryMax:draft.rules.primaryMax,primaryLabel:draft.rules.primaryResource.label,primaryKind:draft.rules.primaryResource.kind,paths:draft.rules.paths||[],marks:(Array.isArray(Database.heroMarks)?Database.heroMarks:[]).filter(function(mark){return allowedMarks.indexOf(mark.name)>=0;}),professions:origin&&origin.choices&&origin.choices.professions||[],skillOptions:skills,talentOptions:talents};
  }
  function selectedTalent(data,choices){return choices.talentId&&Database.getTalent?Database.getTalent(choices.talentId):null;}
  function selectedOriginTalent(data,choices){return choices.originTalentId&&Database.getTalent?Database.getTalent(choices.originTalentId):null;}
  function validateTalentChoice(character,talent,choice,errors){
    if(!talent)return;
    if(talent.choice&&!choice)errors.push('O Talento '+talent.name+' exige registrar a escolha específica.');
    if(talent.name==='Especialista'&&choice){var chosen=Model.pericia&&Model.pericia(character,choice);if(!chosen||!chosen.proficient)errors.push('Especialista exige uma perícia em que o personagem já seja proficiente.');}
    if(talent.name==='Polímata'&&choice){var poly=String(choice).split(',').map(function(item){return item.trim();}).filter(Boolean);if(poly.length!==3||poly.filter(function(value,index,list){return list.indexOf(value)===index;}).length!==3)errors.push('Polímata exige três perícias diferentes, separadas por vírgula.');}
  }
  function validateChoice(previewData,choices){
    choices=choices||{};var c=previewData.character,gain=previewData.gain,errors=[];
    if(gain.requiresPath&&!c.divinePath){var names=previewData.paths.map(function(path){return path.name;});if(names.indexOf(choices.divinePath)<0)errors.push('Escolha um Caminho Divino válido.');}
    if(gain.requiresMark&&!c.heroMark){var marks=previewData.marks.map(function(mark){return mark.name;});if(marks.indexOf(choices.heroMark)<0)errors.push('Escolha uma Marca do Herói válida.');}
    if(gain.chooseProfession&&previewData.professions.indexOf(choices.profession)<0)errors.push('Escolha o Ofício de Mortal recebido no nível 2.');
    if(gain.skillRank){
      if(choices.skillMode==='custom'){if(!String(choices.customSkillName||'').trim())errors.push('Informe o nome da Skill personalizada de Rank '+gain.skillRank+'.');}
      else if(!previewData.skillOptions.some(function(skill){return skill.id===choices.skillId;}))errors.push('Escolha uma Skill oficial de Rank '+gain.skillRank+' ou use a opção personalizada.');
    }
    if(gain.attributeAndTalent){if(Model.attributes.indexOf(choices.attribute)<0)errors.push('Escolha o atributo que recebe +2.');if(!selectedTalent(previewData,choices))errors.push('Escolha o Talento recebido no nível 4.');}
    if(gain.attributeOrTalent){if(['attribute','talent'].indexOf(choices.advancementChoice)<0)errors.push('Escolha entre atributo ou Talento.');if(choices.advancementChoice==='attribute'&&Model.attributes.indexOf(choices.attribute)<0)errors.push('Escolha o atributo que recebe +2.');if(choices.advancementChoice==='talent'&&!selectedTalent(previewData,choices))errors.push('Escolha um Talento oficial.');}
    if(gain.originTalent&&!selectedOriginTalent(previewData,choices))errors.push('Escolha o Talento extra de Engenhosidade Humana.');
    if(gain.originTalent&&choices.originTalentId&&choices.talentId===choices.originTalentId){var repeated=selectedOriginTalent(previewData,choices);if(repeated&&!repeated.repeatable)errors.push('Escolha dois Talentos diferentes neste nível.');}
    validateTalentChoice(c,selectedTalent(previewData,choices),choices.talentChoice,errors);
    validateTalentChoice(c,selectedOriginTalent(previewData,choices),choices.originTalentChoice,errors);
    return errors;
  }
  function skillRecord(data,choices){
    if(!data.gain.skillRank)return null;
    if(choices.skillMode==='custom'){var passive=!!data.character.rules.passiveSkillsOnly;return {id:Model.uid('skill'),name:String(choices.customSkillName).trim(),rank:data.gain.skillRank,cost:passive?0:Rules.rankCost(data.gain.skillRank,false)||0,resourceId:'primary',description:String(choices.customSkillDescription||'Skill personalizada aprovada pelo Mestre.'),action:passive?'Passiva':'Definida pelo jogador',sourceType:'automatic',automatic:true};}
    var skill=Database.getSkill(choices.skillId);return {id:Model.uid('skill'),catalogId:skill.id,name:skill.name,rank:skill.rank,cost:skill.cost,resourceId:'primary',description:skill.effect,action:skill.action,axis:skill.axis,minLevel:skill.minLevel,usage:skill.usage||null,sourceType:'automatic',automatic:true};
  }
  function talentRecord(data,choices){var talent=selectedTalent(data,choices);if(!talent)return null;return {id:Model.uid('talent'),catalogId:talent.id,name:talent.name,category:talent.category,choice:choices.talentChoice||'',level:data.nextLevel};}
  function originTalentRecord(data,choices){var talent=selectedOriginTalent(data,choices);if(!talent)return null;return {id:Model.uid('talent'),catalogId:talent.id,name:talent.name,category:talent.category,choice:choices.originTalentChoice||'',level:data.nextLevel,source:'Engenhosidade Humana'};}
  function apply(id,choices){
    var data=preview(id),errors=validateChoice(data,choices);if(errors.length)throw new Error(errors.join('\n'));
    return Service.update(id,function(character){
      var oldPv=Number(character.resources.pvCurrent||0),oldPrimary=Number(character.resources.primaryCurrent||character.resources.mpCurrent||0),gain=data.gain;
      character.level=data.nextLevel;
      if(!character.divinePath&&choices.divinePath)character.divinePath=choices.divinePath;
      if(!character.heroMark&&choices.heroMark)character.heroMark=choices.heroMark;
      if(gain.chooseProfession){character.originChoices=character.originChoices||{};character.originChoices.profession=choices.profession;}
      character.talents=Array.isArray(character.talents)?character.talents:[];
      if(gain.attributeAndTalent){character.attributes[choices.attribute]=Math.min(30,Number(character.attributes[choices.attribute]||10)+2);character.talents.push(talentRecord(data,choices));}
      if(gain.attributeOrTalent&&choices.advancementChoice==='attribute')character.attributes[choices.attribute]=Math.min(30,Number(character.attributes[choices.attribute]||10)+2);
      if(gain.attributeOrTalent&&choices.advancementChoice==='talent')character.talents.push(talentRecord(data,choices));
      if(gain.originTalent)character.talents.push(originTalentRecord(data,choices));
      if(gain.skillRank){character.skills=(character.skills||[]).concat([skillRecord(data,choices)]);}
      character.evolutionHistory=Array.isArray(character.evolutionHistory)?character.evolutionHistory:[];
      character.evolutionHistory.push({from:data.nextLevel-1,to:data.nextLevel,at:new Date().toISOString(),choices:clone(choices),unlocks:data.unlocks.slice()});
      character=Model.calculate(character);
      character.resources.pvCurrent=Math.min(oldPv,character.rules.pvMax);
      if(character.rules.primaryResource.kind!=='none')character=Model.setResource(character,'primary',Math.min(oldPrimary,character.rules.primaryMax));
      return character;
    });
  }
  global.SemideusesEvolutionRuntime={version:'3e-evolution-runtime-0.2.0',gainFor:gainFor,preview:preview,validateChoice:validateChoice,apply:apply,talentAllowed:talentAllowed};
})(window);
