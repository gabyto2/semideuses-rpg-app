(function(global){
  'use strict';

  var Model=global.SemideusesCharacter;
  var Catalog=global.SemideusesOriginCatalog;
  var Rules=global.SemideusesRules;
  var Resources=global.SemideusesResourceRules;
  if(!Model||!Catalog||!Rules)return;

  var oldNormalize=Model.normalize;
  var oldCalculate=Model.calculate;
  var oldCreate=Model.create;
  var oldValidate=Model.validate;
  var ATTRS=Model.attributes.slice();
  var HIT_DIE_STEP={12:10,10:8,8:6,6:6};

  function clone(value){return Model.clone(value);}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function unique(list){return (list||[]).filter(function(value,index,all){return value&&all.indexOf(value)===index;});}
  function originFor(character){return Catalog.get(character&&character.heroType)||Catalog.get('semideus-grego');}
  function isSemideus(origin){return !origin||origin.id==='semideus-grego';}
  function affiliationFor(name){return name&&typeof Model.databaseAffiliation==='function'?Model.databaseAffiliation(name):null;}
  function castingModifier(character,attribute){return Rules.modifier(character.attributes[attribute]||10);}
  function legacyMana(character,casting){
    var modifier=castingModifier(character,casting);
    return Math.max(0,4+modifier+(Number(character.level||1)-1)*(1+modifier));
  }
  function primaryFor(character,origin,rules){
    var source=clone(rules.primary||{});
    var maximum=0;
    if(source.formula==='mana')maximum=Rules.maxMP(character.level,character.attributes[rules.casting]||10);
    else if(source.formula==='legacyMana')maximum=legacyMana(character,rules.casting);
    else if(source.formula==='proficiency')maximum=Rules.proficiency(character.level);
    source.id=source.id||'mp';
    source.label=source.label||'MP';
    source.kind=source.kind||'pool';
    source.min=0;
    source.max=maximum;
    source.initial='max';
    source.originId=origin.id;
    return source;
  }
  function pathWithDelayedLevels(path,map){
    var copy=clone(path);
    copy.abilities=(copy.abilities||[]).map(function(ability){
      var item=clone(ability);
      item.originalLevel=Number(item.level||1);
      item.level=Number(map[item.originalLevel]||item.originalLevel);
      return item;
    });
    return copy;
  }
  function dilutedSpecialDefinitions(definitions){
    return (definitions||[]).map(function(definition){
      var item=clone(definition);
      if(typeof item.max==='number')item.max=Math.ceil(item.max/2);
      if(typeof item.min==='number'&&item.min<0)item.min=-Math.ceil(Math.abs(item.min)/2);
      item.diluted=true;
      return item;
    });
  }
  function normalizeSpecialState(character,definitions,raw,sameOrigin){
    var output={};
    definitions.forEach(function(definition){
      var previous=raw&&raw.resources&&raw.resources.special&&raw.resources.special[definition.id];
      var calculated=character.resources&&character.resources.special&&character.resources.special[definition.id];
      var source=sameOrigin&&previous?previous:calculated;
      var current=source&&source.current;
      if(definition.kind==='mode'){
        if(!Array.isArray(definition.options)||definition.options.indexOf(current)<0)current=definition.initial||definition.options&&definition.options[0]||'';
      }else if(definition.kind==='toggle')current=!!current;
      else if(definition.kind==='counter'||definition.kind==='signed-counter'){
        if(current==null)current=definition.initial==='max'?definition.max:Number(definition.min||0);
        current=Number(current||0);
        if(definition.min!=null)current=Math.max(Number(definition.min),current);
        if(definition.max!=null)current=Math.min(Number(definition.max),current);
      }else if(current==null)current=null;
      output[definition.id]={id:definition.id,label:definition.label,kind:definition.kind,scope:definition.scope||'character',current:current};
    });
    return output;
  }
  function cleanChoiceSkills(value){
    var allowed=(Model.periciaDefinitions||[]).map(function(item){return item.name;});
    return unique(Array.isArray(value)?value:[]).filter(function(skill){return !allowed.length||allowed.indexOf(skill)>=0;}).slice(0,2);
  }
  function normalizeChoices(character,origin,raw){
    var source=raw&&raw.originChoices||character.originChoices||{};
    var choices={};
    if(origin.id==='satiro-fauno')choices.expertise=(origin.choices.expertise||[]).indexOf(source.expertise)>=0?source.expertise:'';
    if(origin.id==='mortal-vidente'){
      choices.keyAttribute=ATTRS.indexOf(source.keyAttribute)>=0?source.keyAttribute:'INT';
      choices.skills=cleanChoiceSkills(source.skills);
      choices.profession=(origin.choices.professions||[]).indexOf(source.profession)>=0?source.profession:'';
    }
    if(origin.id==='legado')choices.skills=cleanChoiceSkills(source.skills);
    character.originChoices=choices;
    return choices;
  }
  function talentEntitlement(origin,level){
    var base=Number(origin.rules&&origin.rules.talentBase!=null?origin.rules.talentBase:1);
    (origin.rules&&origin.rules.talentBonusLevels||[]).forEach(function(unlock){if(level>=unlock)base++;});
    return base;
  }
  function abilityRules(character,origin,originRules,affiliation){
    var abilities=clone(originRules.abilities||[]);
    var paths=clone(originRules.paths||[]);
    if(origin.id==='legado'&&affiliation){
      abilities=(affiliation.abilities||[]).filter(function(ability){return Number(ability.level||1)<=1;}).map(clone).concat(abilities);
      paths=(affiliation.paths||[]).map(function(path){return pathWithDelayedLevels(path,originRules.pathLevelMap||{});});
    }
    return {abilities:abilities,paths:paths};
  }
  function applyOrigin(character,raw){
    var c=character;
    var origin=originFor(c);
    c.heroType=origin.name;
    c.rules=c.rules||{};
    c.rules.originId=origin.id;
    c.rules.originName=origin.name;
    c.rules.originGroup=origin.group;
    c.rules.originSummary=origin.summary;
    c.rules.sourcePages=origin.sourcePages;
    c.rules.heroSourceLabel=origin.name;
    c.rules.heroSourceKind=origin.requiresAffiliation?'Filiação e origem':'Origem';
    c.rules.allowedHeroMarks=(origin.marks||[]).slice();
    c.rules.attributeBonus=clone(origin.attributeBonus||null);
    if(isSemideus(origin))return c;

    var previousOriginId=raw&&raw.rules&&raw.rules.originId;
    var sameOrigin=previousOriginId===origin.id;
    var oldPvMax=Number(raw&&raw.rules&&raw.rules.pvMax);
    var oldPrimaryMax=Number(raw&&raw.rules&&(raw.rules.primaryMax!=null?raw.rules.primaryMax:raw.rules.mpMax));
    var affiliation=origin.requiresAffiliation?affiliationFor(c.affiliation):null;
    var originRules=clone(origin.rules||{});
    var choices=normalizeChoices(c,origin,raw);
    if(!origin.requiresAffiliation)c.affiliation='';

    if(origin.id==='mortal-vidente')originRules.casting=choices.keyAttribute||'INT';
    if(origin.id==='legado'&&affiliation){
      originRules.casting=affiliation.casting||'SAB';
      originRules.hitDie=HIT_DIE_STEP[Number(affiliation.hitDie||8)]||6;
      originRules.savingThrows=clone(affiliation.savingThrows||[]);
      originRules.weaponProficiencies=clone(affiliation.weaponProficiencies||[]);
      originRules.armorProficiencies=clone(affiliation.armorProficiencies||[]);
      originRules.skillProficiencies=clone(affiliation.skillProficiencies||[]);
    }

    var abilityData=abilityRules(c,origin,originRules,affiliation);
    var skillChoices=origin.id==='mortal-vidente'||origin.id==='legado'?choices.skills||[]:[];
    var originSkills=unique((originRules.skillProficiencies||[]).concat(skillChoices));
    var originExpertise=[];
    if(origin.id==='satiro-fauno'&&choices.expertise)originExpertise.push(choices.expertise);
    if(origin.id==='mortal-vidente'&&choices.profession==='Investigador')originExpertise.push('Investigação');
    c.periciaExpertise=unique((c.periciaExpertise||[]).concat(originExpertise));

    var primary=primaryFor(c,origin,originRules);
    var fullSpecial=origin.id==='legado'?clone(c.rules.specialResources||[]):[];
    var specialDefinitions=origin.id==='legado'?dilutedSpecialDefinitions(fullSpecial):[];
    var hitDie=Number(originRules.hitDie||8);
    var newPvMax=Rules.maxHP(c.level,hitDie,c.attributes.CON);
    var rawPv=raw&&raw.resources&&raw.resources.pvCurrent;
    var pvCurrent=!sameOrigin||rawPv==null||Number(rawPv)===oldPvMax?newPvMax:clamp(Number(rawPv||0),0,newPvMax);
    var rawPrimary=raw&&raw.resources&&(raw.resources.primaryCurrent!=null?raw.resources.primaryCurrent:raw.resources.mpCurrent);
    var primaryCurrent=!sameOrigin||rawPrimary==null||Number(rawPrimary)===oldPrimaryMax?primary.max:clamp(Number(rawPrimary||0),primary.min,primary.max);

    c.rules=Object.assign({},c.rules,{
      source:'origin-catalog',originId:origin.id,originName:origin.name,originGroup:origin.group,
      originSummary:origin.summary,sourcePages:origin.sourcePages,heroSourceLabel:origin.name,
      heroSourceKind:origin.requiresAffiliation?'Filiação e origem':'Origem',allowedHeroMarks:(origin.marks||[]).slice(),
      attributeBonus:null,affiliationId:affiliation&&affiliation.id||'',affiliationTitle:affiliation&&affiliation.title||'',
      affiliationIcon:affiliation&&affiliation.icon||origin.icon||'',domain:affiliation&&affiliation.domain||'',
      profile:originRules.profile||origin.summary,overview:originRules.title||origin.summary,
      casting:originRules.casting||'SAB',hitDie:hitDie,savingThrows:unique(originRules.savingThrows||[]),
      skillProficiencies:originSkills,originSkillProficiencies:originSkills.slice(),
      weaponProficiencies:clone(originRules.weaponProficiencies||[]),armorProficiencies:clone(originRules.armorProficiencies||[]),
      progression:clone(originRules.progression||{}),signature:origin.id==='legado'&&affiliation?clone(affiliation.signature||null):null,
      abilities:abilityData.abilities,paths:abilityData.paths,resourceSystem:null,
      primaryResource:primary,specialResources:specialDefinitions,proficiency:Rules.proficiency(c.level),
      pvMax:newPvMax,primaryMax:primary.max,manaMax:primary.usesMana===false?0:primary.max,mpMax:primary.max,
      speed:Number(originRules.speed||9),naturalArmorBonus:Number(originRules.naturalArmorBonus||0),
      carryingMultiplier:Number(originRules.carryingMultiplier||1),unarmedDamage:originRules.unarmedDamage||'',
      improvisedDamage:originRules.improvisedDamage||'',passiveSkillsOnly:!!originRules.passiveSkillsOnly,
      fixedPath:origin.fixedPath||'',pathLevelMap:clone(originRules.pathLevelMap||null),
      dilutedSignature:!!originRules.dilutedSignature,maxSkillRank:originRules.maxSkillRank||'Lendário',
      talentEntitlement:talentEntitlement(origin,c.level),originExpertise:originExpertise.slice()
    });

    c.resources=c.resources||{};
    c.resources.pvCurrent=pvCurrent;
    c.resources.primaryId=primary.id;
    c.resources.primaryLabel=primary.label;
    c.resources.primaryCurrent=primaryCurrent;
    c.resources[primary.id+'Current']=primaryCurrent;
    c.resources.mpCurrent=primaryCurrent;
    c.resources.special=normalizeSpecialState(c,specialDefinitions,raw,sameOrigin);
    c.officialSaveProficiencies=unique(originRules.savingThrows||[]);

    if(origin.fixedPath)c.divinePath=origin.fixedPath;
    else if(origin.id==='ciclope'||origin.id==='mortal-vidente')c.divinePath='';
    if((origin.marks||[]).indexOf(c.heroMark)<0)c.heroMark='';
    return c;
  }

  function calculate(character){var raw=clone(character||{});return applyOrigin(oldCalculate(raw),raw);}
  function normalize(character){var raw=clone(character||{});return applyOrigin(oldNormalize(raw),raw);}
  function create(overrides){var raw=Object.assign({originChoices:{}},overrides||{});return applyOrigin(oldCreate(raw),raw);}
  function validate(character,options){
    var result=oldValidate(character,options||{});
    var c=normalize(character);
    var origin=originFor(c);
    var step=options&&options.step;
    function applies(target){return step==null||step===target;}
    function add(target,field,code,message){if(applies(target))result.errors.push({step:target,field:field,code:code,message:message});}

    if(!isSemideus(origin)){
      result.errors=result.errors.filter(function(error){
        if(error.code==='required-affiliation'&&!origin.requiresAffiliation)return false;
        if(error.code==='required-path'&&(origin.fixedPath||origin.id==='ciclope'||origin.id==='mortal-vidente'))return false;
        if(error.code==='required-hero-mark')return false;
        return true;
      });
      if(origin.requiresAffiliation&&!affiliationFor(c.affiliation)&&!result.errors.some(function(error){return error.code==='required-affiliation';}))add(3,'affiliation','required-affiliation','Escolha uma Filiação válida para o Legado.');
      if(origin.id==='satiro-fauno'&&!c.originChoices.expertise)add(3,'originChoices.expertise','required-satyr-expertise','Escolha Especialização em Atletismo ou Acrobacia.');
      if(origin.id==='mortal-vidente'){
        if(ATTRS.indexOf(c.originChoices.keyAttribute)<0)add(3,'originChoices.keyAttribute','required-key-attribute','Escolha o atributo-chave do Mortal Vidente.');
        if((c.originChoices.skills||[]).length!==2)add(3,'originChoices.skills','required-origin-skills','Escolha duas perícias adicionais diferentes.');
        if(c.level>=2&&!c.originChoices.profession)add(3,'originChoices.profession','required-mortal-profession','Escolha o Ofício do Mortal para uma ficha de nível 2 ou maior.');
      }
      if(origin.id==='legado'){
        if((c.originChoices.skills||[]).length!==2)add(3,'originChoices.skills','required-origin-skills','Escolha duas perícias adicionais diferentes para o Legado.');
        var pathNames=(c.rules.paths||[]).map(function(path){return path.name;});
        if(!c.divinePath||pathNames.indexOf(c.divinePath)<0)add(6,'divinePath','required-path','Escolha o Caminho herdado pelo Legado.');
      }
      if(c.level>=5&&(origin.marks||[]).indexOf(c.heroMark)<0)add(7,'heroMark','required-hero-mark','Escolha uma Marca do Herói permitida para '+origin.name+'.');
    }
    result.valid=result.errors.length===0;
    result.character=c;
    return result;
  }
  function resourceState(character,type){
    var c=Model.normalize(character);
    var primary=c.rules.primaryResource;
    if(type==='primary'||type==='mp'||type===primary.id)return {id:primary.id,label:primary.label,current:c.resources.primaryCurrent,max:c.rules.primaryMax,min:primary.min,kind:primary.kind};
    if(type==='pv')return {id:'pv',label:'PV',current:c.resources.pvCurrent,max:c.rules.pvMax,min:0,kind:'pool'};
    if(type==='tempHp')return {id:'tempHp',label:'PV Temporários',current:c.resources.tempHp,max:null,min:0,kind:'counter'};
    if(type==='hitDice')return {id:'hitDice',label:'Dados de Vida',current:c.resources.hitDiceCurrent,max:c.resources.hitDiceMax,min:0,kind:'counter'};
    var specialId=String(type||'').replace(/^special:/,'');
    var special=c.resources.special&&c.resources.special[specialId];
    if(!special)return null;
    var definition=(c.rules.specialResources||[]).find(function(item){return item.id===specialId;})||{};
    return Object.assign({},definition,special);
  }
  function adjustResource(character,type,amount){
    var c=Model.normalize(character);
    var state=resourceState(c,type);
    if(!state)throw new Error('Recurso inválido: '+type);
    if(['none','mode','toggle','target-marker','target-counter','reference'].indexOf(state.kind)>=0)throw new Error('Este recurso não aceita ajuste numérico: '+state.label);
    var next=Number(state.current||0)+Number(amount||0);
    if(state.min!=null)next=Math.max(Number(state.min),next);
    if(state.max!=null)next=Math.min(Number(state.max),next);
    if(state.id==='pv')c.resources.pvCurrent=next;
    else if(state.id==='tempHp')c.resources.tempHp=next;
    else if(state.id==='hitDice')c.resources.hitDiceCurrent=next;
    else if(state.id===c.rules.primaryResource.id){c.resources.primaryCurrent=next;c.resources[c.rules.primaryResource.id+'Current']=next;c.resources.mpCurrent=next;}
    else c.resources.special[state.id].current=next;
    return Model.calculate(c);
  }
  function setResource(character,type,value){
    var c=Model.normalize(character);
    var state=resourceState(c,type);
    if(!state)throw new Error('Recurso inválido: '+type);
    if(state.kind==='mode'){
      var definition=(c.rules.specialResources||[]).find(function(item){return item.id===state.id;})||{};
      if(!Array.isArray(definition.options)||definition.options.indexOf(value)<0)throw new Error('Modo inválido para '+state.label+'.');
      c.resources.special[state.id].current=value;
      return Model.calculate(c);
    }
    if(state.kind==='toggle'){c.resources.special[state.id].current=!!value;return Model.calculate(c);}
    return adjustResource(c,type,Number(value||0)-Number(state.current||0));
  }

  Model.version='3e-model-origins-1.0.0';
  Model.originFor=originFor;
  Model.calculate=calculate;
  Model.normalize=normalize;
  Model.create=create;
  Model.validate=validate;
  Model.resourceState=resourceState;
  Model.adjustResource=adjustResource;
  Model.setResource=setResource;
})(window);
