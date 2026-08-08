(function(global){
  'use strict';

  var LEGACY_SKILLS_KEY='semideuses.skills.v1';
  var LEGACY_EXTRAS_KEY='semideuses.sheetExtras.v1';
  var migrationDone=false;

  function requireDependency(name,value){if(!value)throw new Error(name+' não está carregado.');return value;}
  function storage(){return requireDependency('SemideusesStorage',global.SemideusesStorage);}
  function model(){return requireDependency('SemideusesCharacter',global.SemideusesCharacter);}
  function clone(value){return model().clone(value);}
  function now(){return new Date().toISOString();}
  function readLegacy(key){
    try{var value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'?value:{};}catch(error){return {};}
  }
  function migrateLegacyData(){
    if(migrationDone)return false;
    migrationDone=true;
    var legacySkills=readLegacy(LEGACY_SKILLS_KEY);
    var legacyExtras=readLegacy(LEGACY_EXTRAS_KEY);
    var changed=false;
    var list=storage().readCharacters().map(function(raw){
      var character=model().normalize(raw);
      var skills=legacySkills[character.id];
      var extras=legacyExtras[character.id];
      if(Array.isArray(skills)&&skills.length&&(!Array.isArray(raw.skills)||!raw.skills.length)){
        character.skills=model().cleanSkills(skills);changed=true;
      }
      if(extras&&typeof extras==='object'){
        character.resources=character.resources||{};
        if(raw.resources==null||raw.resources.tempHp==null){character.resources.tempHp=Math.max(0,Number(extras.tempHp||0));changed=true;}
        if(raw.resources==null||raw.resources.hitDiceCurrent==null){character.resources.hitDiceCurrent=Math.max(0,Number(extras.hitDiceCurrent==null?character.level:extras.hitDiceCurrent));changed=true;}
        if(raw.resources==null||raw.resources.condition==null){character.resources.condition=extras.condition||'Saudável';changed=true;}
        if((!Array.isArray(raw.saveProficiencies)||!raw.saveProficiencies.length)&&Array.isArray(extras.saveProficiencies)){
          character.saveProficiencies=extras.saveProficiencies.slice();changed=true;
        }
      }
      if(Number(raw.schemaVersion||0)<model().schemaVersion)changed=true;
      return model().normalize(character);
    });
    if(changed)storage().writeCharacters(list);
    return changed;
  }
  function get(id){
    migrateLegacyData();
    if(!id)return null;
    var character=storage().getById(id);
    return character?model().normalize(character):null;
  }
  function list(){
    migrateLegacyData();
    return storage().readCharacters().map(function(character){return model().normalize(character);});
  }
  function save(character){
    var normalized=model().normalize(character);
    normalized.updatedAt=now();
    storage().upsert(normalized);
    global.dispatchEvent(new CustomEvent('semideuses:character-updated',{detail:{id:normalized.id,character:clone(normalized)}}));
    return clone(normalized);
  }
  function saveValidated(character){
    var result=model().validate(character);
    if(!result.valid){
      var error=new Error(result.errors.map(function(item){return item.message;}).join(' '));
      error.validation=result;
      throw error;
    }
    return save(result.character);
  }
  function create(overrides){return save(model().create(overrides||{}));}
  function remove(id){
    if(!get(id))return false;
    storage().removeById(id);
    global.dispatchEvent(new CustomEvent('semideuses:character-removed',{detail:{id:id}}));
    return true;
  }
  function duplicate(id){
    var original=get(id);
    if(!original)throw new Error('Personagem não encontrado.');
    var copy=clone(original);
    copy.id=model().uid();
    copy.name=(copy.name||'Personagem')+' — cópia';
    copy.createdAt=now();
    delete copy.updatedAt;
    return save(copy);
  }
  function update(id,mutator){
    if(typeof mutator!=='function')throw new Error('A atualização precisa receber uma função.');
    var character=get(id);
    if(!character)throw new Error('Personagem não encontrado.');
    var result=mutator(clone(character));
    return save(result||character);
  }
  function takeDamage(id,amount){
    amount=Math.max(0,Number(amount||0));
    return update(id,function(character){
      character.resources=character.resources||{};
      var temp=Math.max(0,Number(character.resources.tempHp||0));
      var absorbed=Math.min(temp,amount);
      character.resources.tempHp=temp-absorbed;
      var remaining=amount-absorbed;
      if(remaining>0)character.resources.pvCurrent=Math.max(0,Number(character.resources.pvCurrent||0)-remaining);
      return character;
    });
  }
  function adjustResource(id,type,amount){
    amount=Number(amount||0);
    if(type==='pv'&&amount<0)return takeDamage(id,-amount);
    return update(id,function(character){return model().adjustResource(character,type,amount);});
  }
  function setResource(id,type,value){
    return update(id,function(character){return model().setResource(character,type,value);});
  }
  function primaryResource(id){
    var character=get(id);
    if(!character)throw new Error('Personagem não encontrado.');
    return model().resourceState(character,'primary');
  }
  function adjustSpecialResource(id,resourceId,amount){return adjustResource(id,'special:'+resourceId,amount);}
  function setSpecialResource(id,resourceId,value){return setResource(id,'special:'+resourceId,value);}
  function updateAttribute(id,attribute,value){return update(id,function(character){return model().updateAttribute(character,attribute,value);});}
  function addSkill(id,skill){
    return update(id,function(character){
      character.skills=model().cleanSkills((character.skills||[]).concat([Object.assign({id:model().uid('skill')},skill||{})]));
      return character;
    });
  }
  function removeSkill(id,skillId){
    return update(id,function(character){character.skills=(character.skills||[]).filter(function(skill){return skill.id!==skillId;});return character;});
  }
  function useSkill(id,skillId){
    var character=get(id);
    if(!character)throw new Error('Personagem não encontrado.');
    var skill=(character.skills||[]).find(function(item){return item.id===skillId;});
    if(!skill)throw new Error('Skill não encontrada.');
    var cost=Math.max(0,Number(skill.cost||0));
    var resourceId=skill.resourceId||'primary';
    var state=model().resourceState(character,resourceId);
    if(!state)throw new Error('Recurso da habilidade não encontrado.');
    if(Number(state.current||0)<cost)throw new Error(state.label+' insuficiente.');
    return adjustResource(id,resourceId,-cost);
  }
  function setCondition(id,condition){
    if(model().conditions.indexOf(condition)<0)throw new Error('Condição inválida.');
    return update(id,function(character){
      character.resources=character.resources||{};
      character.resources.conditions=condition==='Saudável'?[]:[condition];
      character.resources.condition=condition;
      return character;
    });
  }
  function toggleCondition(id,condition){
    if(condition==='Saudável'||model().conditions.indexOf(condition)<0)throw new Error('Condição inválida.');
    return update(id,function(character){
      var list=Array.isArray(character.resources&&character.resources.conditions)?character.resources.conditions.slice():[];
      var index=list.indexOf(condition);
      if(index>=0)list.splice(index,1);else list.push(condition);
      character.resources.conditions=list;
      character.resources.condition=list[0]||'Saudável';
      return character;
    });
  }
  function toggleSaveProficiency(id,attribute){
    if(model().attributes.indexOf(attribute)<0)throw new Error('Atributo inválido.');
    return update(id,function(character){
      var proficiencies=Array.isArray(character.saveProficiencies)?character.saveProficiencies.slice():[];
      var index=proficiencies.indexOf(attribute);
      if(index>=0)proficiencies.splice(index,1);else proficiencies.push(attribute);
      character.saveProficiencies=proficiencies;
      return character;
    });
  }
  function validate(character,options){return model().validate(character,options||{});}

  global.SemideusesCharacterService={
    version:'3e-service-0.4.0',
    list:list,
    get:get,
    create:create,
    save:save,
    saveValidated:saveValidated,
    update:update,
    remove:remove,
    duplicate:duplicate,
    adjustResource:adjustResource,
    takeDamage:takeDamage,
    applyDamage:takeDamage,
    setResource:setResource,
    primaryResource:primaryResource,
    adjustSpecialResource:adjustSpecialResource,
    setSpecialResource:setSpecialResource,
    updateAttribute:updateAttribute,
    addSkill:addSkill,
    removeSkill:removeSkill,
    useSkill:useSkill,
    setCondition:setCondition,
    toggleCondition:toggleCondition,
    toggleSaveProficiency:toggleSaveProficiency,
    validate:validate,
    migrateLegacyData:migrateLegacyData
  };
})(window);
