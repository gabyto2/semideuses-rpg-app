(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var ResourceRules=global.SemideusesResourceRules;
  if(!Service||!Model)return;

  function clone(value){return Model.clone(value);}
  function now(){return new Date().toISOString();}
  function cleanSession(character){
    character.session=character.session&&typeof character.session==='object'?character.session:{};
    character.session.inCombat=!!character.session.inCombat;
    character.session.round=Math.max(0,Number(character.session.round||0));
    character.session.abilityUses=character.session.abilityUses&&typeof character.session.abilityUses==='object'?character.session.abilityUses:{};
    character.session.activeEffects=Array.isArray(character.session.activeEffects)?character.session.activeEffects:[];
    character.session.history=Array.isArray(character.session.history)?character.session.history:[];
    return character.session;
  }
  function snapshot(character){
    var session=cleanSession(character);
    var sessionCopy=clone(session);
    delete sessionCopy.history;
    return {resources:clone(character.resources||{}),session:sessionCopy};
  }
  function addHistory(character,label,kind,before,detail){
    var session=cleanSession(character);
    session.history.unshift({
      id:'history-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
      at:now(),label:label,kind:kind||'action',detail:detail||'',before:before
    });
    session.history=session.history.slice(0,20);
  }
  function abilityKey(group,pathId,ability){
    return [group,pathId||'base',Number(ability.level||0),String(ability.name||'habilidade')].join(':');
  }
  function abilityCatalog(character){
    var c=Model.normalize(character);
    var list=[];
    (c.rules.abilities||[]).forEach(function(ability){
      list.push({key:abilityKey('base','',ability),group:'base',pathId:'',pathName:'Filiação',ability:clone(ability)});
    });
    var selected=(c.rules.paths||[]).find(function(path){return path.name===c.divinePath;});
    if(selected){
      (selected.abilities||[]).forEach(function(ability){
        list.push({key:abilityKey('path',selected.id||selected.name,ability),group:'path',pathId:selected.id||'',pathName:selected.name,ability:clone(ability)});
      });
    }
    return list.filter(function(item){return Number(item.ability.level||0)<=c.level;});
  }
  function findAbility(character,key){return abilityCatalog(character).find(function(item){return item.key===key;})||null;}
  function numericCost(ability,character){
    var raw=ability&&ability.cost;
    var cost=typeof raw==='number'?raw:Number(raw);
    if(!Number.isFinite(cost)||cost<0)cost=0;
    if(character.heroMark==='Bônus de Conjuração'&&ability&&ability.rank==='C')cost=Math.max(1,cost-1);
    return cost;
  }
  function isPassive(ability){
    var rank=String(ability&&ability.rank||'').toLowerCase();
    var action=String(ability&&ability.action||'').toLowerCase();
    return rank==='passiva'||action.indexOf('passiva')>=0||action.indexOf('escolha permanente')>=0||action.indexOf('escolha após')>=0;
  }
  function usageLimit(ability){
    var text=[ability&&ability.effect,ability&&ability.action].join(' ');
    var match=text.match(/(\d+)\s*(?:uso|usos|×|x)\s*(?:por|\/)\s*(dia|combate|arco)/i);
    if(!match)return null;
    var scope=match[2].toLowerCase();
    return {max:Number(match[1]),scope:scope==='dia'?'day':scope==='combate'?'combat':'arc'};
  }
  function useCount(character,key,scope){
    var session=cleanSession(character);
    var bucket=session.abilityUses[scope]||{};
    return Number(bucket[key]||0);
  }
  function canUseOfficialAbility(character,key){
    var c=Model.normalize(character);
    var item=findAbility(c,key);
    if(!item)return {allowed:false,reason:'Habilidade não encontrada.',cost:0,item:null};
    if(isPassive(item.ability))return {allowed:false,reason:'Habilidade passiva.',cost:0,item:item};
    var cost=numericCost(item.ability,c);
    var primary=Model.resourceState(c,'primary');
    if(cost>Number(primary.current||0))return {allowed:false,reason:primary.label+' insuficiente.',cost:cost,item:item};
    var limit=usageLimit(item.ability);
    if(limit&&useCount(c,key,limit.scope)>=limit.max)return {allowed:false,reason:'Sem usos restantes ('+limit.max+' por '+(limit.scope==='day'?'dia':limit.scope==='combat'?'combate':'arco')+').',cost:cost,item:item,limit:limit};
    return {allowed:true,reason:'',cost:cost,item:item,limit:limit};
  }
  function incrementUse(character,key,limit){
    if(!limit)return;
    var session=cleanSession(character);
    session.abilityUses[limit.scope]=session.abilityUses[limit.scope]||{};
    session.abilityUses[limit.scope][key]=Number(session.abilityUses[limit.scope][key]||0)+1;
  }
  function concentrationEffect(ability,key){
    var text=[ability&&ability.action,ability&&ability.effect].join(' ');
    if(!/concentra[cç][aã]o/i.test(text))return null;
    return {id:'effect-'+Date.now(),abilityKey:key,name:ability.name,startedAt:now(),kind:'concentration'};
  }
  function useOfficialAbility(id,key){
    var current=Service.get(id);
    if(!current)throw new Error('Personagem não encontrado.');
    var check=canUseOfficialAbility(current,key);
    if(!check.allowed)throw new Error(check.reason);
    return Service.update(id,function(character){
      var before=snapshot(character);
      var result=check.cost?Model.adjustResource(character,'primary',-check.cost):Model.normalize(character);
      incrementUse(result,key,check.limit);
      var effect=concentrationEffect(check.item.ability,key);
      if(effect){
        var session=cleanSession(result);
        session.activeEffects=session.activeEffects.filter(function(item){return item.kind!=='concentration';});
        session.activeEffects.push(effect);
      }
      addHistory(result,'Usou '+check.item.ability.name,'ability',before,(check.cost?'-'+check.cost+' '+result.rules.primaryResource.label:'Sem custo'));
      return result;
    });
  }
  function initialSpecial(character,definition,context){
    if(context==='start-combat'){
      if(character.affiliation==='Zeus'&&definition.id==='charges')return 1;
      if(character.affiliation==='Ares'&&definition.id==='fury')return Math.min(10,Math.max(0,character.rules.pvMax-character.resources.pvCurrent));
    }
    return ResourceRules&&typeof ResourceRules.initialValue==='function'?ResourceRules.initialValue(definition,character,Model.affiliationRules(character.affiliation)):definition.min||0;
  }
  function resetSpecial(character,predicate,context){
    var c=Model.normalize(character);
    (c.rules.specialResources||[]).forEach(function(definition){
      if(!predicate(definition))return;
      var state=c.resources.special&&c.resources.special[definition.id];
      if(!state)return;
      if(definition.kind==='counter'||definition.kind==='signed-counter'||definition.kind==='mode'||definition.kind==='toggle'){
        state.current=initialSpecial(c,definition,context);
      }
    });
    return Model.calculate(c);
  }
  function startCombat(id){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var c=resetSpecial(character,function(definition){return definition.reset==='combat';},'start-combat');
      var session=cleanSession(c);
      session.inCombat=true;
      session.round=1;
      session.combatStartedAt=now();
      session.abilityUses.combat={};
      session.activeEffects=[];
      addHistory(c,'Iniciou combate','combat',before,'Rodada 1');
      return c;
    });
  }
  function endCombat(id){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var c=resetSpecial(character,function(definition){return definition.reset==='combat';},'end-combat');
      var session=cleanSession(c);
      session.inCombat=false;
      session.round=0;
      session.activeEffects=[];
      session.abilityUses.combat={};
      addHistory(c,'Encerrou combate','combat',before,'Recursos de combate reiniciados');
      return c;
    });
  }
  function nextRound(id){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var session=cleanSession(character);
      if(!session.inCombat)throw new Error('O personagem não está em combate.');
      session.round=Math.max(1,session.round+1);
      addHistory(character,'Avançou para a rodada '+session.round,'round',before,'');
      return character;
    });
  }
  function restorePrimary(character,kind){
    var c=Model.normalize(character);
    var definition=c.rules.primaryResource;
    var rule=definition.recovery&&definition.recovery[kind];
    var maximum=c.rules.primaryMax;
    var amount=ResourceRules&&typeof ResourceRules.recoveryAmount==='function'?ResourceRules.recoveryAmount(rule,maximum):0;
    if(rule&&rule.type==='fractionMax'&&maximum>0)amount=Math.max(1,amount);
    if(rule==='max')return Model.setResource(c,'primary',maximum);
    return Model.adjustResource(c,'primary',amount);
  }
  function shortRest(id){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var c=restorePrimary(character,'shortRest');
      c=resetSpecial(c,function(definition){return definition.reset==='rest';},'short-rest');
      var session=cleanSession(c);
      session.abilityUses.shortRest={};
      addHistory(c,'Concluiu Descanso Curto','rest',before,'Recuperação do recurso principal; Dados de Vida continuam manuais');
      return c;
    });
  }
  function longRest(id){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var c=restorePrimary(character,'longRest');
      c.resources.pvCurrent=c.rules.pvMax;
      c.resources.hitDiceCurrent=Math.min(c.resources.hitDiceMax,c.resources.hitDiceCurrent+Math.ceil(c.resources.hitDiceMax/2));
      var exhaustionBefore=c.resources.exhaustionLevel!=null?Number(c.resources.exhaustionLevel||0):((c.resources.conditions||[]).indexOf('Exausto')>=0?1:0);
      c.resources.exhaustionLevel=Math.max(0,exhaustionBefore-1);
      c.resources.conditions=c.resources.exhaustionLevel>0?['Exausto']:[];
      c.resources.condition=c.resources.conditions[0]||'Saudável';
      c=resetSpecial(c,function(definition){return definition.reset==='rest'||definition.reset==='long-rest';},'long-rest');
      var session=cleanSession(c);
      session.inCombat=false;
      session.round=0;
      session.activeEffects=[];
      session.abilityUses.day={};
      session.abilityUses.shortRest={};
      session.abilityUses.combat={};
      addHistory(c,'Concluiu Descanso Longo','rest',before,'PV e recurso principal restaurados; metade dos Dados de Vida recuperada');
      return c;
    });
  }
  function undoLastAction(id){
    var current=Service.get(id);
    if(!current)throw new Error('Personagem não encontrado.');
    var history=cleanSession(current).history;
    if(!history.length)throw new Error('Não há ação para desfazer.');
    return Service.update(id,function(character){
      var session=cleanSession(character);
      var entry=session.history.shift();
      if(!entry||!entry.before)throw new Error('A última ação não pode ser desfeita.');
      character.resources=clone(entry.before.resources||character.resources);
      var preservedHistory=session.history.slice();
      character.session=clone(entry.before.session||{});
      cleanSession(character).history=preservedHistory;
      return character;
    });
  }
  function dismissEffect(id,effectId){
    return Service.update(id,function(character){
      var before=snapshot(character);
      var session=cleanSession(character);
      var effect=session.activeEffects.find(function(item){return item.id===effectId;});
      session.activeEffects=session.activeEffects.filter(function(item){return item.id!==effectId;});
      addHistory(character,'Encerrou '+(effect&&effect.name||'efeito ativo'),'effect',before,'');
      return character;
    });
  }

  global.SemideusesSessionRuntime={
    version:'3e-session-runtime-0.1.0',
    abilityCatalog:abilityCatalog,
    findAbility:findAbility,
    canUseOfficialAbility:canUseOfficialAbility,
    numericCost:numericCost,
    usageLimit:usageLimit,
    useOfficialAbility:useOfficialAbility,
    startCombat:startCombat,
    endCombat:endCombat,
    nextRound:nextRound,
    shortRest:shortRest,
    longRest:longRest,
    undoLastAction:undoLastAction,
    dismissEffect:dismissEffect
  };
})(window);
