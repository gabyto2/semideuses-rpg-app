(function(global){
  'use strict';

  var Bestiary=global.SemideusesBestiary,Runtime=global.SemideusesMasterRuntime;
  var KEY='semideuses.master.calculator.v1';
  var BANDS=[
    {min:1,max:4,budgets:{easy:100,medium:200,hard:400,epic:800}},
    {min:5,max:8,budgets:{easy:300,medium:600,hard:1200,epic:2400}},
    {min:9,max:12,budgets:{easy:800,medium:1600,hard:3200,epic:6400}},
    {min:13,max:16,budgets:{easy:2000,medium:4000,hard:8000,epic:16000}},
    {min:17,max:20,budgets:{easy:5000,medium:10000,hard:20000,epic:40000}}
  ];
  if(!Bestiary||!Runtime)return;

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function integer(value,fallback){var parsed=Math.floor(Number(value));return Number.isFinite(parsed)?parsed:Number(fallback||0);}
  function empty(){return {groupLevel:1,partySize:4,query:'',ndFilter:'all',catalogOpen:false,quantities:{}};}
  function normalize(raw){
    raw=raw&&typeof raw==='object'?raw:{};var state=empty();
    state.groupLevel=Math.max(1,Math.min(20,integer(raw.groupLevel,1)));
    state.partySize=Math.max(1,Math.min(12,integer(raw.partySize,4)));
    state.query=String(raw.query||'').slice(0,80);state.ndFilter=String(raw.ndFilter||'all');state.catalogOpen=Boolean(raw.catalogOpen);
    if(['all','1/2','1','2','3','4'].indexOf(state.ndFilter)<0)state.ndFilter='all';
    var quantities=raw.quantities&&typeof raw.quantities==='object'?raw.quantities:{};
    Object.keys(quantities).forEach(function(id){var creature=Bestiary.get(id),quantity=Math.max(0,Math.min(99,integer(quantities[id],0)));if(creature&&!creature.scalable&&quantity)state.quantities[id]=quantity;});
    return state;
  }
  function read(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(error){return empty();}}
  function write(state){var saved=normalize(state);localStorage.setItem(KEY,JSON.stringify(saved));global.dispatchEvent(new CustomEvent('semideuses:calculator-updated',{detail:{state:clone(saved)}}));return clone(saved);}
  function update(mutator){var state=read(),result=mutator(clone(state))||state;return write(result);}
  function bandFor(level){level=Math.max(1,Math.min(20,integer(level,1)));return BANDS.find(function(band){return level>=band.min&&level<=band.max;})||BANDS[0];}
  function budgetFor(level,partySize){
    level=Math.max(1,Math.min(20,integer(level,1)));partySize=Math.max(1,Math.min(12,integer(partySize,4)));
    var band=bandFor(level),levelFactor=1+.25*(level-band.min),partyFactor=1+.25*(partySize-4),result={};
    Object.keys(band.budgets).forEach(function(key){result[key]=Math.round(band.budgets[key]*levelFactor*partyFactor);});
    result.levelFactor=levelFactor;result.partyFactor=partyFactor;result.band={min:band.min,max:band.max};return result;
  }
  function quantityMultiplier(count){count=Math.max(0,integer(count,0));if(count<=1)return 1;if(count===2)return 1.5;if(count<=6)return 2;if(count<=10)return 2.5;if(count<=15)return 3;return 4;}
  function selection(state){
    state=normalize(state||read());var selected=[];
    Object.keys(state.quantities).forEach(function(id){var creature=Bestiary.get(id),quantity=state.quantities[id];if(creature&&!creature.scalable&&quantity)selected.push({creature:creature,quantity:quantity,subtotal:creature.threat*quantity});});
    return selected;
  }
  function calculate(state){
    state=normalize(state||read());var selected=selection(state),count=selected.reduce(function(sum,item){return sum+item.quantity;},0),raw=selected.reduce(function(sum,item){return sum+item.subtotal;},0),multiplier=quantityMultiplier(count),adjusted=Math.round(raw*multiplier),budgets=budgetFor(state.groupLevel,state.partySize),difficulty='Sem criaturas',tone='empty';
    if(count){if(adjusted<=budgets.easy){difficulty='Fácil';tone='easy';}else if(adjusted<=budgets.medium){difficulty='Médio';tone='medium';}else if(adjusted<=budgets.hard){difficulty='Difícil';tone='hard';}else if(adjusted<=budgets.epic){difficulty='Épico';tone='epic';}else{difficulty='Acima do Épico';tone='over';}}
    return {state:state,selected:selected,count:count,rawThreat:raw,multiplier:multiplier,adjustedThreat:adjusted,budgets:budgets,difficulty:difficulty,tone:tone};
  }
  function setConfig(patch){patch=patch||{};return update(function(state){if(patch.groupLevel!=null)state.groupLevel=patch.groupLevel;if(patch.partySize!=null)state.partySize=patch.partySize;if(patch.query!=null)state.query=patch.query;if(patch.ndFilter!=null)state.ndFilter=patch.ndFilter;if(patch.catalogOpen!=null)state.catalogOpen=Boolean(patch.catalogOpen);return state;});}
  function adjust(id,delta){var creature=Bestiary.get(id);if(!creature)throw new Error('Criatura não encontrada no Bestiário.');if(creature.scalable||creature.pv==null||creature.ca==null||creature.threat==null)throw new Error('Este modelo exige que o Mestre defina ND, PV e CA no cadastro manual.');return update(function(state){var next=Math.max(0,Math.min(99,integer(state.quantities[id],0)+integer(delta,0)));if(next)state.quantities[id]=next;else delete state.quantities[id];return state;});}
  function add(id){return adjust(id,1);}
  function clear(){return update(function(state){state.quantities={};return state;});}
  function commitToEncounter(){
    var encounter=Runtime.read();if(encounter.status!=='preparing')throw new Error('Adicione criaturas antes de iniciar o encontro.');
    var result=calculate(),items=result.selected;if(!items.length)throw new Error('Adicione pelo menos uma criatura à calculadora.');
    items.forEach(function(item){if(item.creature.scalable||item.creature.pv==null||item.creature.ca==null)throw new Error(item.creature.name+' precisa de valores definidos pelo Mestre.');});
    var names=encounter.combatants.map(function(item){return item.name;});
    items.forEach(function(item){
      for(var index=1;index<=item.quantity;index++){
        var base=item.creature.name,name=item.quantity>1?base+' '+index:base,suffix=index;
        while(names.indexOf(name)>=0){suffix+=1;name=base+' '+suffix;}
        Runtime.addEnemy({name:name,pvMax:item.creature.pv,ca:item.creature.ca,initiative:null,notes:'ND '+item.creature.nd+' · Bestiário p. '+item.creature.page,bestiaryId:item.creature.id,nd:item.creature.nd,sourcePage:item.creature.page});names.push(name);
      }
    });
    clear();return Runtime.view();
  }

  global.SemideusesEncounterCalculator={version:'encounter-calculator-0.1.0',storageKey:KEY,bands:clone(BANDS),read:read,write:write,budgetFor:budgetFor,quantityMultiplier:quantityMultiplier,calculate:calculate,setConfig:setConfig,adjust:adjust,add:add,clear:clear,commitToEncounter:commitToEncounter};
})(window);
