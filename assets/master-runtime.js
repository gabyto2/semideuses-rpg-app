(function(global){
  'use strict';

  var Service=global.SemideusesCharacterService;
  var Model=global.SemideusesCharacter;
  var KEY='semideuses.master.encounter.v1';
  var HISTORY_KEY='semideuses.master.history.v1';
  var VERSION=2;
  if(!Service||!Model)return;

  function clone(value){return Model.clone?Model.clone(value):JSON.parse(JSON.stringify(value));}
  function uid(prefix){return Model.uid?Model.uid(prefix||'combatant'):(prefix||'combatant')+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);}
  function number(value,fallback){var parsed=Number(value);return Number.isFinite(parsed)?parsed:Number(fallback||0);}
  function empty(){return {version:VERSION,id:uid('encounter'),title:'Encontro atual',status:'preparing',round:0,currentTurnId:'',createdAt:new Date().toISOString(),endedAt:'',combatants:[]};}
  function normalizeTracker(raw,index){
    raw=raw&&typeof raw==='object'?raw:{};var kind=raw.kind==='segments'?'segments':'counter',id=String(raw.id||('tracker-'+index)),label=String(raw.label||'Controle').slice(0,60);
    if(kind==='segments'){
      var segments=Math.max(1,Math.min(20,Math.floor(number(raw.segments,1)))),segmentMax=Math.max(1,Math.floor(number(raw.segmentMax,1))),values=Array.isArray(raw.values)?raw.values.slice(0,segments):[];
      while(values.length<segments)values.push(segmentMax);values=values.map(function(value){return Math.max(0,Math.min(segmentMax,Math.floor(number(value,segmentMax))));});
      return {id:id,label:label,kind:kind,segmentLabel:String(raw.segmentLabel||'Parte').slice(0,30),segments:segments,segmentMax:segmentMax,ca:Math.max(0,Math.floor(number(raw.ca,0))),values:values,resetOnRound:false};
    }
    var maximum=Math.max(1,Math.min(999,Math.floor(number(raw.max,1)))),current=raw.current==null?maximum:Math.floor(number(raw.current,maximum));
    return {id:id,label:label,kind:kind,max:maximum,current:Math.max(0,Math.min(maximum,current)),resetOnRound:Boolean(raw.resetOnRound)};
  }
  function normalizeCombatant(raw,index){
    raw=raw&&typeof raw==='object'?raw:{};
    var kind=raw.kind==='player'?'player':raw.kind==='hero'?'hero':'enemy',maximum=Math.max(1,number(raw.pvMax,1)),rawConditions=Array.isArray(raw.conditions)?raw.conditions:[],exhaustionLevel=raw.exhaustionLevel==null?(rawConditions.indexOf('Exausto')>=0?1:0):Math.max(0,Math.min(6,Math.floor(number(raw.exhaustionLevel,0))));
    var normalizedConditions=rawConditions.filter(function(value,pos,list){return typeof value==='string'&&value!=='Saudável'&&value!=='Exausto'&&list.indexOf(value)===pos;});if(exhaustionLevel>0)normalizedConditions.push('Exausto');
    return {
      id:String(raw.id||uid(kind)),kind:kind,characterId:kind==='player'?String(raw.characterId||''):'',partyMemberId:kind==='hero'?String(raw.partyMemberId||''):'',trackVitals:kind==='hero'?raw.trackVitals!==false:true,role:kind==='enemy'&&['enemy','npc','scenario'].indexOf(raw.role)>=0?raw.role:'enemy',
      name:String(raw.name||'Participante'),initiative:raw.initiative==null||raw.initiative===''?null:number(raw.initiative,0),
      pvCurrent:Math.max(0,Math.min(maximum,number(raw.pvCurrent,maximum))),pvMax:maximum,ca:Math.max(0,number(raw.ca,0)),
      conditions:normalizedConditions,exhaustionLevel:exhaustionLevel,
      notes:String(raw.notes||''),order:number(raw.order,index),
      bestiaryId:kind==='enemy'?String(raw.bestiaryId||''):'',nd:kind==='enemy'?String(raw.nd||''):'',sourcePage:kind==='enemy'&&raw.sourcePage!=null?Math.max(0,Math.floor(number(raw.sourcePage,0))):null,
      trackers:kind==='enemy'&&Array.isArray(raw.trackers)?raw.trackers.map(normalizeTracker):[]
    };
  }
  function normalize(raw){
    raw=raw&&typeof raw==='object'?raw:{};
    var state=empty();
    state.id=String(raw.id||state.id);
    state.title=String(raw.title||state.title).slice(0,80);
    state.status=['preparing','active','ended'].indexOf(raw.status)>=0?raw.status:'preparing';
    state.round=Math.max(0,Math.floor(number(raw.round,0)));
    state.currentTurnId=String(raw.currentTurnId||'');
    state.createdAt=String(raw.createdAt||state.createdAt);
    state.endedAt=String(raw.endedAt||'');
    state.combatants=Array.isArray(raw.combatants)?raw.combatants.map(normalizeCombatant):[];
    if(!state.combatants.some(function(item){return item.id===state.currentTurnId;}))state.currentTurnId='';
    if(state.status==='active'&&!state.currentTurnId&&state.combatants.length)state.currentTurnId=state.combatants[0].id;
    return state;
  }
  function read(){try{return normalize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch(error){return empty();}}
  function readHistory(){try{return (JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')||[]).map(normalize).filter(function(item){return item.status==='ended';}).sort(function(a,b){return String(b.endedAt).localeCompare(String(a.endedAt));}).slice(0,50);}catch(error){return [];}}
  function writeHistory(items){var saved=(items||[]).map(normalize).filter(function(item){return item.status==='ended';}).slice(0,50);localStorage.setItem(HISTORY_KEY,JSON.stringify(saved));return clone(saved);}
  function archive(state){var items=readHistory().filter(function(item){return item.id!==state.id;});items.unshift(normalize(state));return writeHistory(items);}
  function write(state){
    var saved=normalize(state);localStorage.setItem(KEY,JSON.stringify(saved));
    global.dispatchEvent(new CustomEvent('semideuses:master-updated',{detail:{state:clone(saved)}}));
    return clone(saved);
  }
  function update(mutator){var state=read(),result=mutator(clone(state))||state;return write(result);}
  function find(state,id){var item=state.combatants.find(function(combatant){return combatant.id===id;});if(!item)throw new Error('Participante não encontrado.');return item;}
  function live(item){
    var result=clone(item),character=item.kind==='player'&&item.characterId?Service.get(item.characterId):null,Campaign=global.SemideusesMasterCampaign,partyMember=null;
    if(item.kind==='player'){
      result.missing=!character;
      if(character){result.name=character.name||item.name;result.pvCurrent=number(character.resources&&character.resources.pvCurrent,0);result.pvMax=Math.max(1,number(character.rules&&character.rules.pvMax,1));result.ca=Math.max(0,number(character.rules&&character.rules.armorClass,0));result.conditions=Array.isArray(character.resources&&character.resources.conditions)?character.resources.conditions.slice():[];result.exhaustionLevel=Math.max(0,Math.min(6,Math.floor(number(character.resources&&character.resources.exhaustionLevel,result.conditions.indexOf('Exausto')>=0?1:0))));result.level=number(character.level,1);result.heroType=character.heroType||'Semideus Grego';}
    }else if(item.kind==='hero'){
      if(Campaign&&typeof Campaign.read==='function')partyMember=Campaign.read().party.find(function(member){return member.id===item.partyMemberId;});
      result.missing=!partyMember;
      if(partyMember){result.name=partyMember.name;result.trackVitals=partyMember.trackVitals;result.pvCurrent=partyMember.pvCurrent;result.pvMax=partyMember.pvMax;result.ca=partyMember.ca;result.conditions=partyMember.conditions.slice();result.exhaustionLevel=partyMember.exhaustionLevel;result.notes=partyMember.notes;}
    }
    return result;
  }
  function view(){var state=read();state.combatants=state.combatants.map(live);return state;}
  function setTitle(title){title=String(title||'').trim();if(!title)throw new Error('Informe um nome para o encontro.');return update(function(state){state.title=title.slice(0,80);return state;});}
  function addCharacter(characterId,initiative){
    var character=Service.get(characterId);if(!character)throw new Error('Ficha não encontrada.');
    return update(function(state){
      if(state.status!=='preparing')throw new Error('Adicione participantes antes de iniciar o encontro.');
      if(state.combatants.some(function(item){return item.characterId===characterId;}))throw new Error('Esta ficha já está no encontro.');
      state.combatants.push(normalizeCombatant({id:uid('player'),kind:'player',characterId:characterId,name:character.name||'Personagem',initiative:initiative,pvCurrent:character.resources.pvCurrent,pvMax:character.rules.pvMax,ca:character.rules.armorClass,order:state.combatants.length},state.combatants.length));return state;
    });
  }
  function addPartyMember(member,initiative){
    member=member&&typeof member==='object'?member:{};var memberId=String(member.id||''),name=String(member.name||'').trim();
    if(!memberId||!name)throw new Error('Herói do grupo inválido.');
    return update(function(state){
      if(state.status!=='preparing')throw new Error('Adicione participantes antes de iniciar o encontro.');
      if(state.combatants.some(function(item){return item.partyMemberId===memberId;}))throw new Error('Este herói já está no encontro.');
      state.combatants.push(normalizeCombatant({id:uid('hero'),kind:'hero',partyMemberId:memberId,trackVitals:member.trackVitals,name:name,initiative:initiative,pvCurrent:member.pvCurrent,pvMax:member.pvMax,ca:member.ca,conditions:member.conditions,exhaustionLevel:member.exhaustionLevel,notes:member.notes,order:state.combatants.length},state.combatants.length));return state;
    });
  }
  function addPartyMembers(members){(Array.isArray(members)?members:[]).forEach(function(member){var state=read();if(!state.combatants.some(function(item){return item.partyMemberId===member.id;}))addPartyMember(member,null);});return view();}
  function addEnemy(payload){
    payload=payload||{};var name=String(payload.name||'').trim(),maximum=Math.max(1,Math.floor(number(payload.pvMax,0))),hasArmor=payload.ca!=null&&payload.ca!==''&&Number.isFinite(Number(payload.ca))&&Number(payload.ca)>=0,armor=Math.max(0,Math.floor(number(payload.ca,0)));
    if(!name)throw new Error('Informe o nome do inimigo ou NPC.');if(!number(payload.pvMax,0))throw new Error('Informe os PV máximos do inimigo ou NPC.');if(!hasArmor)throw new Error('Informe a CA do inimigo ou NPC.');
    return update(function(state){
      if(state.status!=='preparing')throw new Error('Adicione inimigos antes de iniciar o encontro.');
      state.combatants.push(normalizeCombatant({id:uid('enemy'),kind:'enemy',role:payload.role,name:name,initiative:payload.initiative,pvCurrent:maximum,pvMax:maximum,ca:armor,notes:payload.notes,bestiaryId:payload.bestiaryId,nd:payload.nd,sourcePage:payload.sourcePage,trackers:payload.trackers,order:state.combatants.length},state.combatants.length));return state;
    });
  }
  function remove(id){return update(function(state){if(state.status==='active')throw new Error('Encerre o encontro antes de remover participantes.');state.combatants=state.combatants.filter(function(item){return item.id!==id;});if(state.currentTurnId===id)state.currentTurnId='';return state;});}
  function setInitiative(id,value){return update(function(state){if(state.status!=='preparing')throw new Error('A iniciativa fica bloqueada depois que o encontro começa.');find(state,id).initiative=value==null||value===''?null:number(value,0);return state;});}
  function start(){
    return update(function(state){
      if(state.status!=='preparing')throw new Error('O encontro já foi iniciado.');
      if(!state.combatants.length)throw new Error('Adicione pelo menos um participante.');
      var pending=state.combatants.filter(function(item){return item.initiative==null;});if(pending.length)throw new Error('Preencha a iniciativa de todos antes de iniciar.');
      state.combatants.sort(function(a,b){return b.initiative-a.initiative||a.order-b.order;});state.combatants.forEach(function(item,index){item.order=index;});
      state.status='active';state.round=1;state.currentTurnId=state.combatants[0].id;return state;
    });
  }
  function nextTurn(){return update(function(state){if(state.status!=='active')throw new Error('Inicie o encontro primeiro.');var index=state.combatants.findIndex(function(item){return item.id===state.currentTurnId;});if(index<0)index=0;var next=(index+1)%state.combatants.length;if(next===0){state.round+=1;state.combatants.forEach(function(item){item.trackers.forEach(function(tracker){if(tracker.kind==='counter'&&tracker.resetOnRound)tracker.current=tracker.max;});});}state.currentTurnId=state.combatants[next].id;return state;});}
  function moveTie(id,delta){return update(function(state){if(state.status!=='active')throw new Error('A ordem só pode ser ajustada durante o encontro.');var index=state.combatants.findIndex(function(item){return item.id===id;}),target=index+Number(delta||0);if(index<0||target<0||target>=state.combatants.length)return state;if(state.combatants[index].initiative!==state.combatants[target].initiative)throw new Error('A ordem manual é usada apenas para resolver iniciativas empatadas.');var currentId=state.currentTurnId,temp=state.combatants[index];state.combatants[index]=state.combatants[target];state.combatants[target]=temp;state.combatants.forEach(function(item,pos){item.order=pos;});state.currentTurnId=currentId;return state;});}
  function end(){var ended=update(function(state){if(state.status!=='active')throw new Error('Nenhum encontro ativo.');state.status='ended';state.endedAt=new Date().toISOString();return state;});archive(view());return ended;}
  function reset(){return write(empty());}
  function adjustPv(id,delta){
    var state=read(),item=find(state,id),amount=number(delta,0);if(!amount)return view();
    if(item.kind==='player'){
      if(!Service.get(item.characterId))throw new Error('A ficha vinculada não está mais disponível.');
      if(amount<0)Service.applyDamage(item.characterId,-amount);else Service.adjustResource(item.characterId,'pv',amount);
      return view();
    }else if(item.kind==='hero'){
      var Campaign=global.SemideusesMasterCampaign,member=Campaign&&Campaign.read().party.find(function(value){return value.id===item.partyMemberId;});
      if(member){Campaign.editPartyMember(member.id,{pvCurrent:Math.max(0,Math.min(member.pvMax,member.pvCurrent+amount))});return view();}
    }
    update(function(draft){var enemy=find(draft,id);enemy.pvCurrent=Math.max(0,Math.min(enemy.pvMax,enemy.pvCurrent+amount));return draft;});return view();
  }
  function toggleCondition(id,condition){
    condition=String(condition||'');if(!condition||condition==='Saudável'||condition==='Exausto'||(Model.conditions||[]).indexOf(condition)<0)throw new Error('Escolha uma condição válida.');
    var state=read(),item=find(state,id);
    if(item.kind==='player'){
      if(!Service.get(item.characterId))throw new Error('A ficha vinculada não está mais disponível.');
      Service.toggleCondition(item.characterId,condition);return view();
    }else if(item.kind==='hero'){
      var Campaign=global.SemideusesMasterCampaign,member=Campaign&&Campaign.read().party.find(function(value){return value.id===item.partyMemberId;});if(member){var list=member.conditions.filter(function(value){return value!=='Exausto';}),memberIndex=list.indexOf(condition);if(memberIndex>=0)list.splice(memberIndex,1);else list.push(condition);Campaign.editPartyMember(member.id,{conditions:list});return view();}
    }
    update(function(draft){var enemy=find(draft,id),index=enemy.conditions.indexOf(condition);if(index>=0)enemy.conditions.splice(index,1);else enemy.conditions.push(condition);return draft;});return view();
  }
  function setExhaustion(id,level){
    level=Math.max(0,Math.min(6,Math.floor(number(level,0))));var state=read(),item=find(state,id);
    if(item.kind==='player'){
      if(!Service.get(item.characterId))throw new Error('A ficha vinculada não está mais disponível.');
      if(typeof Service.setExhaustionLevel!=='function')throw new Error('O controle de Exaustão da ficha não está disponível.');Service.setExhaustionLevel(item.characterId,level);return view();
    }
    if(item.kind==='hero'){
      var Campaign=global.SemideusesMasterCampaign,member=Campaign&&Campaign.read().party.find(function(value){return value.id===item.partyMemberId;});if(member){Campaign.editPartyMember(member.id,{exhaustionLevel:level});return view();}
    }
    update(function(draft){var target=find(draft,id);target.exhaustionLevel=level;target.conditions=target.conditions.filter(function(value){return value!=='Exausto';});if(level>0)target.conditions.push('Exausto');return draft;});return view();
  }
  function adjustTracker(id,trackerId,delta,segmentIndex){
    delta=number(delta,0);if(!delta)return view();
    update(function(state){var enemy=find(state,id);if(enemy.kind!=='enemy')throw new Error('Controles especiais pertencem às criaturas do Bestiário.');var tracker=enemy.trackers.find(function(item){return item.id===trackerId;});if(!tracker)throw new Error('Controle especial não encontrado.');if(tracker.kind==='segments'){var index=Math.floor(number(segmentIndex,-1));if(index<0||index>=tracker.values.length)throw new Error('Parte da criatura não encontrada.');tracker.values[index]=Math.max(0,Math.min(tracker.segmentMax,tracker.values[index]+delta));}else tracker.current=Math.max(0,Math.min(tracker.max,tracker.current+delta));return state;});return view();
  }
  function deleteHistory(id){return writeHistory(readHistory().filter(function(item){return item.id!==id;}));}
  function exportData(){return {current:read(),history:readHistory()};}
  function restoreData(raw){
    if(!raw||typeof raw!=='object')throw new Error('Dados de encontros inválidos.');
    var current=write(raw.current||empty()),history=writeHistory(Array.isArray(raw.history)?raw.history:[]);
    return {current:current,history:history};
  }

  global.SemideusesMasterRuntime={version:'master-session-0.4.0',storageKey:KEY,historyKey:HISTORY_KEY,read:read,view:view,history:function(){return clone(readHistory());},exportData:exportData,restoreData:restoreData,setTitle:setTitle,addCharacter:addCharacter,addPartyMember:addPartyMember,addPartyMembers:addPartyMembers,addEnemy:addEnemy,remove:remove,setInitiative:setInitiative,start:start,nextTurn:nextTurn,moveTie:moveTie,end:end,reset:reset,adjustPv:adjustPv,toggleCondition:toggleCondition,setExhaustion:setExhaustion,adjustTracker:adjustTracker,deleteHistory:deleteHistory};
})(window);
