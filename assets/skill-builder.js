(function(global){
  'use strict';
  var Rules=global.SemideusesRules;
  var RANKS=['E','D','C','B','A','S','SS','Lendário'];
  var TRAINING={E:{weeks:1,cost:50},D:{weeks:2,cost:100},C:{weeks:4,cost:300},B:{weeks:8,cost:600},A:{weeks:16,cost:1500},S:{weeks:32,cost:3000},SS:{weeks:64,cost:5000},'Lendário':{weeks:null,cost:null}};
  var LADDER=['1d6','2d6','3d6','5d6','7d6','9d6','12d6','15d6'];
  var BASE_INDEX={E:1,D:2,C:3,B:4,A:5,S:6,SS:7};
  var CONTROL={E:'controle leve até o fim do próximo turno',D:'1 condição por 1 rodada, com TR',C:'condição até o fim do próximo turno',B:'condição por 1 minuto, repetindo TR',A:'condição por 1 minuto em vários alvos',S:'controle forte por 1 minuto, sujeito à Resistência de Chefe',SS:'incapacitação por até 1 rodada, sujeita à Resistência de Chefe','Lendário':'domínio de campo'};
  var EXTRA_COSTS={area:-1,condition:-1,noSaveLight:-1,extendedRange:-1,multiTarget:-1};
  var LIMIT_GAINS={melee:1,restrictiveTrigger:1,onceCombat:1};
  function rankCost(rank){var c=Rules&&Rules.rankCost?Rules.rankCost(rank,false):({E:1,D:2,C:4,B:6,A:8,S:12,SS:16,'Lendário':24}[rank]);return Number(c||0);}
  function nextRank(rank){var i=RANKS.indexOf(rank);return i>=0&&i<RANKS.length-1?RANKS[i+1]:rank;}
  function training(rank,mentor){var t=TRAINING[rank]||{weeks:null,cost:null};return {weeks:t.weeks,cost:mentor?0:t.cost,baseCost:t.cost,mentor:!!mentor};}
  function calculate(spec){
    spec=spec||{};var rank=RANKS.indexOf(spec.rank)>=0?spec.rank:'E',axis=String(spec.axis||'Dano'),activation=String(spec.activation||'Ação');
    var costs=[],gains=[],delta=0,warnings=[],errors=[];
    if(/Ação Bônus/i.test(activation)){costs.push({id:'bonus',label:'Ação Bônus',steps:1});delta-=1;}
    Object.keys(EXTRA_COSTS).forEach(function(id){if(spec[id]){costs.push({id:id,label:{area:'Área',condition:'Condição adicional',noSaveLight:'Condição leve sem TR',extendedRange:'Alcance 18–30 m',multiTarget:'Até 3 alvos escolhidos'}[id],steps:1});delta-=1;}});
    Object.keys(LIMIT_GAINS).forEach(function(id){if(spec[id]){gains.push({id:id,label:{melee:'Somente corpo a corpo',restrictiveTrigger:'Gatilho restritivo',onceCombat:'Uso único por combate'}[id],steps:1});delta+=1;}});
    var sustained=!!spec.sustained,effectiveRank=sustained?nextRank(rank):rank;
    if(sustained&&rank==='Lendário')warnings.push('Lendário já é o teto de Rank; duração sustentada exige validação direta do Mestre.');
    if(spec.noSaveLight&&RANKS.indexOf(rank)<RANKS.indexOf('D'))errors.push('Condição leve sem TR exige Rank D ou superior.');
    if(spec.hardControl&&RANKS.indexOf(rank)<RANKS.indexOf('B'))errors.push('Controle duro exige Rank B ou superior e sempre concede TR.');
    if(/Passiva/i.test(activation)&&axis==='Dano')errors.push('Skill Passiva não pode causar dano direto.');
    var baseIndex=BASE_INDEX[rank],resultIndex=baseIndex==null?null:baseIndex+delta,resultDice=null;
    if(resultIndex!=null){if(resultIndex<0){errors.push('O orçamento caiu abaixo do primeiro degrau da escada de dados. Remova extras ou aceite limitações.');resultIndex=0;}if(resultIndex>LADDER.length-1){warnings.push('O orçamento ultrapassou 15d6; compare com a habilidade de Filiação do mesmo Rank e peça validação do Mestre.');resultIndex=LADDER.length-1;}resultDice=LADDER[resultIndex];}
    var baseLabel;if(axis==='Dano'||axis==='Cura')baseLabel=baseIndex==null?'efeito lendário':LADDER[baseIndex];else if(axis==='Controle')baseLabel=CONTROL[rank]||('orçamento de Controle Rank '+rank);else baseLabel='orçamento de '+axis+' do Rank '+rank;
    var resultLabel=(axis==='Dano'||axis==='Cura')?(resultDice||'efeito especial'):axis==='Controle'?(CONTROL[rank]||'controle especial'):(baseLabel+(delta?' · saldo '+(delta>0?'+':'')+delta+' passo(s)':' · orçamento integral'));
    var mp=/Passiva/i.test(activation)?0:rankCost(effectiveRank);
    var summary='Base '+rank+' ('+baseLabel+')'+(costs.length?' · custos: '+costs.map(function(x){return '-'+x.steps+' '+x.label;}).join(', '):'')+(gains.length?' · ganhos: '+gains.map(function(x){return '+'+x.steps+' '+x.label;}).join(', '):'')+' · resultado: '+resultLabel+(sustained?' · sustentada: paga custo de Rank '+effectiveRank:'')+'.';
    return {rank:rank,axis:axis,activation:activation,baseLabel:baseLabel,delta:delta,resultLabel:resultLabel,resultDice:resultDice,costs:costs,gains:gains,sustained:sustained,effectiveRank:effectiveRank,mpCost:mp,training:training(rank,!!spec.mentor),summary:summary,warnings:warnings,errors:errors};
  }
  global.SemideusesSkillBuilder={version:'3e-skill-builder-0.1.0',ranks:RANKS.slice(),ladder:LADDER.slice(),training:training,calculate:calculate,rankCost:rankCost};
})(window);
