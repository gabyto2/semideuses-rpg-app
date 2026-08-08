(function(global){
  'use strict';
  var Session=global.SemideusesSessionRuntime;
  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var Rules=global.SemideusesRules;
  if(!Session||!Service||!Model||!Rules)return;

  function clone(value){return Model.clone(value);}
  function ensureSession(character){
    character.session=character.session&&typeof character.session==='object'?character.session:{};
    character.session.abilityUses=character.session.abilityUses&&typeof character.session.abilityUses==='object'?character.session.abilityUses:{};
    character.session.activeEffects=Array.isArray(character.session.activeEffects)?character.session.activeEffects:[];
    character.session.history=Array.isArray(character.session.history)?character.session.history:[];
    return character.session;
  }
  function usage(skill){
    if(skill.usage)return skill.usage;
    if(skill.rank==='S')return {scope:'day',max:2};
    if(skill.rank==='SS'||skill.rank==='Lendário')return {scope:'day',max:1};
    return null;
  }
  function key(skill){return 'skill:'+skill.id;}
  function cost(character,skill){
    var ranked=Rules.rankCost(skill.rank,character.heroMark==='Bônus de Conjuração');
    return ranked==null?Math.max(0,Number(skill.cost||0)):ranked;
  }
  function canUseLearnedSkill(character,skillId){
    var c=Model.normalize(character),skill=(c.skills||[]).find(function(item){return item.id===skillId;});
    if(!skill)return {allowed:false,reason:'Skill não encontrada.'};
    var amount=cost(c,skill),primary=Model.resourceState(c,'primary');
    if(Number(primary.current||0)<amount)return {allowed:false,reason:primary.label+' insuficiente.',skill:skill,cost:amount};
    var limit=usage(skill),session=ensureSession(c),used=limit?Number((session.abilityUses[limit.scope]||{})[key(skill)]||0):0;
    if(limit&&used>=limit.max)return {allowed:false,reason:'Sem usos restantes.',skill:skill,cost:amount,limit:limit,used:used};
    return {allowed:true,reason:'',skill:skill,cost:amount,limit:limit,used:used};
  }
  function useLearnedSkill(id,skillId){
    var current=Service.get(id);if(!current)throw new Error('Personagem não encontrado.');
    var check=canUseLearnedSkill(current,skillId);if(!check.allowed)throw new Error(check.reason);
    return Service.update(id,function(character){
      var beforeSession=ensureSession(character),before={resources:clone(character.resources||{}),session:clone(beforeSession)};delete before.session.history;
      character=check.cost?Model.adjustResource(character,'primary',-check.cost):Model.normalize(character);
      var session=ensureSession(character),limit=check.limit,k=key(check.skill);
      if(limit){session.abilityUses[limit.scope]=session.abilityUses[limit.scope]||{};session.abilityUses[limit.scope][k]=Number(session.abilityUses[limit.scope][k]||0)+1;}
      if(/concentra[cç][aã]o/i.test(String(check.skill.action||'')+' '+String(check.skill.description||''))){session.activeEffects=session.activeEffects.filter(function(effect){return effect.kind!=='concentration';});session.activeEffects.push({id:'effect-'+Date.now(),abilityKey:k,name:check.skill.name,startedAt:new Date().toISOString(),kind:'concentration'});}
      session.history.unshift({id:'history-'+Date.now(),at:new Date().toISOString(),label:'Usou '+check.skill.name,kind:'skill',detail:check.cost?'-'+check.cost+' '+character.rules.primaryResource.label:'Sem custo',before:before});session.history=session.history.slice(0,20);
      return character;
    });
  }
  Session.version='3e-session-runtime-0.2.0';
  Session.canUseLearnedSkill=canUseLearnedSkill;
  Session.useLearnedSkill=useLearnedSkill;
})(window);