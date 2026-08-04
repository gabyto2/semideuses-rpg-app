(function(global){
  'use strict';

  function requireDependency(name,value){
    if(!value)throw new Error(name+' não está carregado.');
    return value;
  }
  function storage(){return requireDependency('SemideusesStorage',global.SemideusesStorage);}
  function model(){return requireDependency('SemideusesCharacter',global.SemideusesCharacter);}
  function clone(value){return model().clone(value);}
  function now(){return new Date().toISOString();}
  function get(id){
    if(!id)return null;
    var character=storage().getById(id);
    return character?model().normalize(character):null;
  }
  function list(){
    return storage().readCharacters().map(function(character){return model().normalize(character);});
  }
  function save(character){
    var normalized=model().normalize(character);
    normalized.updatedAt=now();
    storage().upsert(normalized);
    global.dispatchEvent(new CustomEvent('semideuses:character-updated',{detail:{id:normalized.id,character:clone(normalized)}}));
    return clone(normalized);
  }
  function create(overrides){
    var character=model().create(overrides||{});
    return save(character);
  }
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
  function adjustResource(id,type,amount){
    if(type!=='pv'&&type!=='mp')throw new Error('Recurso inválido: '+type);
    return update(id,function(character){return model().adjustResource(character,type,amount);});
  }
  function setResource(id,type,value){
    var character=get(id);
    if(!character)throw new Error('Personagem não encontrado.');
    var key=type==='pv'?'pvCurrent':type==='mp'?'mpCurrent':null;
    if(!key)throw new Error('Recurso inválido: '+type);
    var current=Number(character.resources&&character.resources[key]||0);
    return adjustResource(id,type,Number(value||0)-current);
  }
  function updateAttribute(id,attribute,value){
    return update(id,function(character){return model().updateAttribute(character,attribute,value);});
  }

  global.SemideusesCharacterService={
    version:'3e-service-0.1.0',
    list:list,
    get:get,
    create:create,
    save:save,
    update:update,
    remove:remove,
    duplicate:duplicate,
    adjustResource:adjustResource,
    setResource:setResource,
    updateAttribute:updateAttribute
  };
})(window);
