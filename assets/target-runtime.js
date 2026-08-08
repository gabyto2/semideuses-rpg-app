(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  if(!Service||!Model)return;

  function clone(value){return Model.clone(value);}
  function uid(){return 'target-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
  function targetDefinitions(character){
    var definitions=(character.rules&&character.rules.specialResources||[]).filter(function(definition){
      return definition.kind==='target-marker'||definition.kind==='target-counter';
    });
    if(character.affiliation==='Eros')definitions.push({id:'bonds',label:'Vínculos',kind:'target-bond',max:Math.max(1,Math.floor((Number(character.attributes.CAR||10)-10)/2)),description:'Ligações Guardião, Espelho ou Grilhão entre duas criaturas.'});
    return definitions;
  }
  function definition(character,resourceId){return targetDefinitions(character).find(function(item){return item.id===resourceId;})||null;}
  function ensure(character){
    character.targets=character.targets&&typeof character.targets==='object'?character.targets:{};
    targetDefinitions(character).forEach(function(item){if(!Array.isArray(character.targets[item.id]))character.targets[item.id]=[];});
    return character.targets;
  }
  function maxFor(character,item){
    if(item.id==='marked-prey')return 1;
    if(item.id==='death-mark')return character.level>=2?2:1;
    if(item.max!=null)return Number(item.max);
    return null;
  }
  function list(character,resourceId){var c=Model.normalize(character);ensure(c);return clone(c.targets[resourceId]||[]);}
  function addTarget(id,resourceId,payload){
    return Service.update(id,function(character){
      character=Model.normalize(character);var item=definition(character,resourceId);if(!item)throw new Error('Controle por alvo não encontrado.');
      var targets=ensure(character)[resourceId],maximum=maxFor(character,item);
      if(maximum!=null&&targets.length>=maximum)throw new Error(item.label+' já atingiu o limite de '+maximum+'.');
      payload=payload||{};
      if(item.kind==='target-bond'){
        var first=String(payload.first||'').trim(),second=String(payload.second||'').trim(),bondType=String(payload.type||'Guardião');
        if(!first||!second)throw new Error('Informe as duas criaturas do Vínculo.');
        if(['Guardião','Espelho','Grilhão'].indexOf(bondType)<0)throw new Error('Tipo de Vínculo inválido.');
        targets.push({id:uid(),first:first,second:second,type:bondType,active:true,createdAt:new Date().toISOString()});
      }else{
        var name=String(payload.name||'').trim();if(!name)throw new Error('Informe o nome do alvo.');
        targets.push({id:uid(),name:name,current:item.kind==='target-counter'?0:true,active:true,createdAt:new Date().toISOString()});
      }
      return character;
    });
  }
  function removeTarget(id,resourceId,targetId){return Service.update(id,function(character){ensure(character);character.targets[resourceId]=(character.targets[resourceId]||[]).filter(function(target){return target.id!==targetId;});return character;});}
  function adjustTarget(id,resourceId,targetId,amount){
    return Service.update(id,function(character){
      character=Model.normalize(character);var item=definition(character,resourceId);if(!item||item.kind!=='target-counter')throw new Error('Este controle não usa contador.');
      ensure(character);var target=(character.targets[resourceId]||[]).find(function(entry){return entry.id===targetId;});if(!target)throw new Error('Alvo não encontrado.');
      var minimum=item.min==null?0:Number(item.min),maximum=item.max==null?Number.MAX_SAFE_INTEGER:Number(item.max);
      target.current=Math.max(minimum,Math.min(maximum,Number(target.current||0)+Number(amount||0)));return character;
    });
  }
  function toggleTarget(id,resourceId,targetId){return Service.update(id,function(character){ensure(character);var target=(character.targets[resourceId]||[]).find(function(item){return item.id===targetId;});if(!target)throw new Error('Alvo não encontrado.');target.active=!target.active;target.current=target.active;return character;});}

  global.SemideusesTargetRuntime={version:'3e-target-runtime-0.1.0',definitions:targetDefinitions,list:list,addTarget:addTarget,removeTarget:removeTarget,adjustTarget:adjustTarget,toggleTarget:toggleTarget};
})(window);
