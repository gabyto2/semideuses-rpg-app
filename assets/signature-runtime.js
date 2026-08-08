(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Session=global.SemideusesSessionRuntime;
  if(!Service||!Model)return;

  var RESOURCE_IDS={Zeus:'charges',Hades:'souls',Atena:'command',Ares:'fury',Hermes:'rhythm',Hefesto:'machine-points',Afrodite:'charm','Nêmesis':'debt',Morfeu:'dream-threads',Nike:'momentum'};
  var TRIGGERS={
    Zeus:[{id:'turn',label:'Início do turno',delta:1}],
    Hades:[{id:'death',label:'Inimigo morreu próximo',delta:1}],
    Atena:[{id:'turn',label:'Início do turno',delta:1},{id:'marked-hit',label:'Aliado acertou alvo marcado',delta:1}],
    Ares:[{id:'damage',label:'Sofreu dano',delta:1},{id:'critical',label:'Crítico ou derrubou inimigo',delta:2}],
    Hermes:[{id:'move',label:'Moveu 6 m ou mais',delta:1},{id:'action',label:'Atacou ou usou habilidade',delta:1}],
    Hefesto:[{id:'forge-hit',label:'Martelo Incandescente acertou',delta:1}],
    Afrodite:[{id:'failed-save',label:'Inimigo falhou no TR',delta:1}],
    'Nêmesis':[{id:'damage',label:'Sofreu dano de inimigo',delta:1},{id:'critical',label:'Recebeu acerto crítico',delta:1},{id:'ally-down',label:'Aliado caiu a 0 PV',delta:1}],
    Morfeu:[{id:'failed-save',label:'Inimigo falhou no TR',delta:1}],
    Nike:[{id:'critical',label:'Aliado obteve crítico',delta:1},{id:'enemy-down',label:'Inimigo caiu a 0 PV',delta:1}]
  };
  var EXTRA_COSTS={Atena:{'Contra-Ordem':{resourceId:'command',cost:3},'Antecipar':{resourceId:'command',cost:1}}};

  function resourceId(character){return RESOURCE_IDS[character.affiliation]||'';}
  function triggers(character){return (TRIGGERS[character.affiliation]||[]).slice();}
  function signatureActions(character){
    var signature=character.rules&&character.rules.signature||{};
    var id=resourceId(character);
    if(!id||!Array.isArray(signature.universalCosts))return [];
    return signature.universalCosts.map(function(entry,index){
      var effect=String(entry.effect||''),colon=effect.indexOf(':');
      return {id:'signature-'+index,name:colon>0?effect.slice(0,colon):'Gastar '+entry.cost,cost:Number(entry.cost||0),effect:colon>0?effect.slice(colon+1).trim():effect,resourceId:id};
    });
  }
  function applyTrigger(id,triggerId){
    var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');
    var trigger=triggers(character).find(function(item){return item.id===triggerId;});if(!trigger)throw new Error('Gatilho não encontrado.');
    return Service.adjustSpecialResource(id,resourceId(character),trigger.delta);
  }
  function spendAction(id,actionId){
    var character=Service.get(id);if(!character)throw new Error('Personagem não encontrado.');
    var action=signatureActions(character).find(function(item){return item.id===actionId;});if(!action)throw new Error('Opção de Assinatura não encontrada.');
    var state=Model.resourceState(character,'special:'+action.resourceId);if(!state||Number(state.current||0)<action.cost)throw new Error(state&&state.label?state.label+' insuficiente.':'Recurso insuficiente.');
    return Service.adjustSpecialResource(id,action.resourceId,-action.cost);
  }
  function extraCost(character,abilityName){return EXTRA_COSTS[character.affiliation]&&EXTRA_COSTS[character.affiliation][abilityName]||null;}

  if(Service.applyDamage){
    var originalDamage=Service.applyDamage;
    Service.applyDamage=function(id,amount){
      var saved=originalDamage(id,amount);
      if(Number(amount)>0&&saved.affiliation==='Ares')saved=Service.adjustSpecialResource(id,'fury',1);
      if(Number(amount)>0&&saved.affiliation==='Nêmesis')saved=Service.adjustSpecialResource(id,'debt',1);
      return saved;
    };
    Service.takeDamage=Service.applyDamage;
  }

  if(Session){
    var originalCan=Session.canUseOfficialAbility;
    var originalUse=Session.useOfficialAbility;
    var originalRound=Session.nextRound;
    Session.canUseOfficialAbility=function(character,key){
      var result=originalCan(character,key);if(!result.item)return result;
      var cost=extraCost(Model.normalize(character),result.item.ability.name);
      if(cost){var state=Model.resourceState(character,'special:'+cost.resourceId);result.specialCost=cost;if(!state||Number(state.current||0)<cost.cost){result.allowed=false;result.reason=(state&&state.label||'Recurso')+' insuficiente: precisa de '+cost.cost+'.';}}
      return result;
    };
    Session.useOfficialAbility=function(id,key){
      var before=Service.get(id),check=Session.canUseOfficialAbility(before,key);if(!check.allowed)throw new Error(check.reason);
      var saved=originalUse(id,key),name=check.item.ability.name;
      if(check.specialCost)saved=Service.adjustSpecialResource(id,check.specialCost.resourceId,-check.specialCost.cost);
      if(saved.affiliation==='Atena'&&name==='Ordem')saved=Service.adjustSpecialResource(id,'command',1);
      if(saved.affiliation==='Zeus'&&name==='Pulso Elétrico')saved=Service.adjustSpecialResource(id,'charges',1);
      if(saved.affiliation==='Hefesto'&&name==='Martelo Incandescente')saved=Service.adjustSpecialResource(id,'machine-points',1);
      if(saved.affiliation==='Hermes')saved=Service.adjustSpecialResource(id,'rhythm',1);
      return saved;
    };
    Session.nextRound=function(id){
      var saved=originalRound(id);
      if(saved.affiliation==='Zeus')saved=Service.adjustSpecialResource(id,'charges',1);
      if(saved.affiliation==='Atena')saved=Service.adjustSpecialResource(id,'command',1);
      return saved;
    };
  }

  global.SemideusesSignatureRuntime={version:'3e-signature-runtime-0.1.0',resourceId:resourceId,triggers:triggers,actions:signatureActions,applyTrigger:applyTrigger,spendAction:spendAction,extraCost:extraCost};
})(window);
