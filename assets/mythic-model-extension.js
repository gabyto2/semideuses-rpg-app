(function(global){
  'use strict';
  var Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;if(!Model||!db)return;
  var oldNormalize=Model.normalize,oldCalculate=Model.calculate,oldCreate=Model.create;
  function clone(v){return Model.clone(v);}
  function cleanVariants(raw,definition){
    var out={};
    (definition&&definition.variants||[]).forEach(function(v){out[v.id]=Math.max(0,Number(raw&&raw[v.id]!=null?raw[v.id]:v.charges||0));});
    return out;
  }
  function cleanConsumables(source){
    if(!Array.isArray(source))return [];
    return source.map(function(raw){
      raw=raw||{};var d=db.getMythicItem&&db.getMythicItem(raw.catalogId);
      if(!d||d.tier!=='Consumível')return null;
      var variants=cleanVariants(raw.variantCharges,d),variantTotal=Object.keys(variants).reduce(function(sum,k){return sum+Number(variants[k]||0);},0);
      var charges=(d.variants&&d.variants.length)?variantTotal:Math.max(0,Math.floor(Number(raw.charges!=null?raw.charges:d.defaultCharges||0)));
      return {id:raw.id||Model.uid('consumable'),catalogId:d.id,charges:charges,variantCharges:variants,notes:String(raw.notes||'')};
    }).filter(Boolean);
  }
  function cleanOwned(source,tier,prefix){
    if(!Array.isArray(source))return [];
    var seen={};
    return source.map(function(raw){
      raw=raw||{};var d=db.getMythicItem&&db.getMythicItem(raw.catalogId);
      if(!d||d.tier!==tier||seen[d.id])return null;seen[d.id]=true;
      return {id:raw.id||Model.uid(prefix),catalogId:d.id,notes:String(raw.notes||'')};
    }).filter(Boolean);
  }
  function apply(c,raw){
    raw=raw||c;var m=raw.mythic&&typeof raw.mythic==='object'?raw.mythic:{};
    var panoplyId=String(m.panoplyId||''),pan=panoplyId&&db.getMythicItem?db.getMythicItem(panoplyId):null;if(!pan||pan.tier!=='Panóplia')panoplyId='';
    c.mythic={
      panoplyId:panoplyId,
      consumables:cleanConsumables(m.consumables||[]),
      relics:cleanOwned(m.relics||[],'Relíquia','relic'),
      artifacts:cleanOwned(m.artifacts||[],'Artefato','artifact')
    };
    c.rules=c.rules||{};
    c.rules.mythic={
      panoply:panoplyId?db.getMythicItem(panoplyId):null,
      consumableCount:c.mythic.consumables.length,
      relicCount:c.mythic.relics.length,
      artifactCount:c.mythic.artifacts.length,
      artifactEncounterWarning:c.mythic.artifacts.length>=2
    };
    return c;
  }
  function normalize(c){var raw=clone(c||{});return apply(oldNormalize(raw),raw);}
  function calculate(c){var raw=clone(c||{});return apply(oldCalculate(raw),raw);}
  function create(o){var raw=Object.assign({mythic:{panoplyId:'',consumables:[],relics:[],artifacts:[]}},o||{});return apply(oldCreate(raw),raw);}
  function panoply(character){var c=normalize(character);return c.mythic.panoplyId&&db.getMythicItem?db.getMythicItem(c.mythic.panoplyId):null;}
  function panoplyAwakenings(character){var c=normalize(character),p=panoply(c);if(!p)return [];return [5,11,17].map(function(level){return {level:level,unlocked:c.level>=level,effect:p.awakenings&&p.awakenings[String(level)]||''};}).filter(function(x){return x.effect;});}
  function consumable(character,id){var c=normalize(character),r=(c.mythic.consumables||[]).find(function(x){return x.id===id;});if(!r)return null;return {record:clone(r),definition:db.getMythicItem(r.catalogId)};}
  function owned(character,tier){
    var c=normalize(character),key=tier==='Relíquia'?'relics':tier==='Artefato'?'artifacts':'';
    if(!key)return [];
    return (c.mythic[key]||[]).map(function(r){return {record:clone(r),definition:db.getMythicItem(r.catalogId)};}).filter(function(x){return !!x.definition;});
  }
  function ownedRecord(character,recordId){
    var c=normalize(character),keys=['relics','artifacts'];
    for(var i=0;i<keys.length;i++){var r=(c.mythic[keys[i]]||[]).find(function(x){return x.id===recordId;});if(r)return {record:clone(r),definition:db.getMythicItem(r.catalogId),tier:keys[i]==='relics'?'Relíquia':'Artefato'};}
    return null;
  }
  Model.version='3e-model-0.10.0';
  Model.panoply=panoply;Model.panoplyAwakenings=panoplyAwakenings;Model.mythicConsumable=consumable;
  Model.mythicOwned=owned;Model.mythicOwnedRecord=ownedRecord;
  Model.normalize=normalize;Model.calculate=calculate;Model.create=create;
})(window);
