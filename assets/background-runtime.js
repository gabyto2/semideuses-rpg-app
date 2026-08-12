(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Session=global.SemideusesSessionRuntime;
  if(!Service||!Model)return;

  function trait(character){return character.rules&&character.rules.backgroundTrait||null;}
  function ensure(character){character.session=character.session&&typeof character.session==='object'?character.session:{};character.session.backgroundUses=character.session.backgroundUses&&typeof character.session.backgroundUses==='object'?character.session.backgroundUses:{};return character.session.backgroundUses;}
  function key(character){var item=trait(character);return item?String(character.background||'background')+':'+item.name:'';}
  function canUse(character){var item=trait(character);if(!item)return {allowed:false,reason:'Antecedente sem Traço.',trait:null};if(item.recharge==='passive')return {allowed:false,reason:'Traço passivo.',trait:item};var uses=ensure(character)[item.recharge]||{};var used=Number(uses[key(character)]||0),maximum=Number(item.uses||1);return {allowed:used<maximum,reason:used<maximum?'':'Sem usos restantes.',trait:item,used:used,max:maximum};}
  function use(id){
    var current=Service.get(id);if(!current)throw new Error('Personagem não encontrado.');var check=canUse(current);if(!check.allowed)throw new Error(check.reason);
    return Service.update(id,function(character){
      character=Model.normalize(character);var item=trait(character),uses=ensure(character);uses[item.recharge]=uses[item.recharge]||{};uses[item.recharge][key(character)]=Number(uses[item.recharge][key(character)]||0)+1;
      if(character.background==='Atleta'){
        var con=Math.floor((Number(character.attributes.CON||10)-10)/2);character.resources.pvCurrent=Math.min(character.rules.pvMax,character.resources.pvCurrent+Math.max(1,character.level+con));
      }
      return character;
    });
  }
  function reset(id,scope){return Service.update(id,function(character){var uses=ensure(character);uses[scope]={};return character;});}
  if(Session){
    var shortRest=Session.shortRest,longRest=Session.longRest;
    Session.shortRest=function(id){shortRest(id);return reset(id,'short-rest');};
    Session.longRest=function(id){longRest(id);reset(id,'short-rest');return reset(id,'long-rest');};
  }
  global.SemideusesBackgroundRuntime={version:'3e-background-runtime-0.1.0',trait:trait,canUse:canUse,use:use,reset:reset};
})(window);
