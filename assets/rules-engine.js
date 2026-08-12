(function(global){
  'use strict';

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function modifier(value){return Math.floor((Number(value||10)-10)/2);}
  function proficiency(level){
    level=clamp(Number(level||1),1,20);
    if(level<=4)return 2;
    if(level<=8)return 3;
    if(level<=12)return 4;
    if(level<=16)return 5;
    return 6;
  }
  function hitDieAverage(hitDie){return {6:4,8:5,10:6,12:7}[Number(hitDie)]||5;}
  function maxHP(level,hitDie,constitution){
    level=clamp(Number(level||1),1,20);
    hitDie=Number(hitDie||8);
    var con=modifier(constitution);
    return Math.max(1,hitDie+con+(level-1)*(hitDieAverage(hitDie)+con));
  }
  function maxMP(level,castingScore){
    level=clamp(Number(level||1),1,20);
    var cast=modifier(castingScore);
    return Math.max(0,6+cast+(level-1)*(2+cast));
  }
  function shortRestMana(maximum){return Math.max(1,Math.floor(Number(maximum||0)/4));}
  function unlocks(level){
    level=clamp(Number(level||1),1,20);
    return {
      divinePath:level>=3,
      heroMark:level>=5,
      pathFeature1:level>=7,
      pathFeature2:level>=12,
      amplification:level>=13,
      pathFeature3:level>=17
    };
  }
  function rankCost(rank,hasCastingBonus){
    var costs={E:1,D:2,C:4,B:6,A:8,S:12,SS:16,'Lendário':24};
    var cost=costs[rank];
    if(cost==null)return null;
    if(hasCastingBonus&&rank==='C')cost=Math.max(1,cost-1);
    return cost;
  }
  function canUseAbility(character,ability){
    if(!ability||ability.passive)return {allowed:true,cost:0,reason:''};
    var cost=ability.mp!=null?Number(ability.mp):rankCost(ability.rank,character&&character.heroMark==='Bônus de Conjuração');
    var current=Number(character&&character.mpCurrent||0);
    return {allowed:current>=cost,cost:cost,reason:current>=cost?'':'MP insuficiente'};
  }
  function spendMP(character,amount){
    var copy=Object.assign({},character);
    copy.mpCurrent=clamp(Number(copy.mpCurrent||0)-Number(amount||0),0,Number(copy.mpMax||0));
    return copy;
  }
  function restoreMP(character,amount){
    var copy=Object.assign({},character);
    copy.mpCurrent=clamp(Number(copy.mpCurrent||0)+Number(amount||0),0,Number(copy.mpMax||0));
    return copy;
  }
  function changeHP(character,amount){
    var copy=Object.assign({},character);
    copy.hpCurrent=clamp(Number(copy.hpCurrent||0)+Number(amount||0),0,Number(copy.hpMax||0));
    return copy;
  }

  global.SemideusesRules={
    version:'3e-core-0.1.0',
    modifier:modifier,
    proficiency:proficiency,
    maxHP:maxHP,
    maxMP:maxMP,
    shortRestMana:shortRestMana,
    unlocks:unlocks,
    rankCost:rankCost,
    canUseAbility:canUseAbility,
    spendMP:spendMP,
    restoreMP:restoreMP,
    changeHP:changeHP
  };
})(window);
