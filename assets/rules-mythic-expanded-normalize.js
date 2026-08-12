(function(global){
  'use strict';
  var db=global.SemideusesRulesDatabase;if(!db||!db.mythicItems)return;
  function strictAction(rawMeta,effect){
    var m=String(rawMeta||''),e=String(effect||'').trim();
    if(/Rea[cç][aã]o/i.test(m))return 'Reação';
    if(/A[cç][aã]o B[oô]nus/i.test(m))return 'Ação Bônus';
    if(/(?:^|[,·;]\s*)A[cç][aã]o(?:\s|$)/i.test(m))return 'Ação';
    if(/^como\s+Rea[cç][aã]o\b/i.test(e))return 'Reação';
    if(/^como\s+A[cç][aã]o\s+B[oô]nus\b/i.test(e))return 'Ação Bônus';
    if(/^como\s+A[cç][aã]o\b/i.test(e))return 'Ação';
    return '';
  }
  function recovery(text){
    text=String(text||'');
    if(/Recarrega\s+no\s+Descanso\s+Curto/i.test(text))return 'shortRest';
    if(/Recarrega\s+no\s+Descanso\s+Longo/i.test(text))return 'longRest';
    return '';
  }
  function usageFrom(active,item){
    var meta=String(active&&active.rawMeta||''),text=meta+' '+String(active&&active.effect||'');
    var m,rec=recovery(text);
    m=text.match(/(\d+)\s*usos?\s+(?:por|\/)\s*dia\b/i);if(m)return {scope:'day',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s*\/\s*(?:por\s*)?dia\b/i);if(m)return {scope:'day',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s+por\s+dia\b/i);if(m)return {scope:'day',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s*\/\s*(?:por\s*)?combate\b/i);if(m)return {scope:'combat',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s+por\s+combate\b/i);if(m)return {scope:'combat',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s*\/\s*(?:por\s*)?Descanso\s+Curto\b/i);if(m)return {scope:'shortRest',max:Number(m[1])};
    m=text.match(/(\d+)\s*[x×]\s*\/\s*(?:por\s*)?Descanso\s+Longo\b/i);if(m)return {scope:'day',max:Number(m[1])};
    m=text.match(/(\d+)\s*usos?\b/i);if(m&&rec==='shortRest')return {scope:'shortRest',max:Number(m[1])};
    if(m&&rec==='longRest')return {scope:'day',max:Number(m[1])};
    if(rec==='shortRest')return {scope:'shortRest',max:1};
    if(rec==='longRest')return {scope:'day',max:1};
    return item&&item.usage&&item.usage.scope?item.usage:null;
  }
  function parseActive(item){
    var text=String(item.effect||''),idx=text.indexOf('Ativa —');
    if(idx<0){item.active=null;return;}
    var tail=text.slice(idx+7).trim();
    var match=tail.match(/^(.+?)\s*\(([^)]*)\)\s*:\s*([\s\S]*)$/);
    if(!match){item.active=null;return;}
    var name=match[1].trim(),rawMeta=match[2].trim(),effect=match[3].trim();
    var rankMatch=rawMeta.match(/Rank\s+([A-Z]{1,2}|Lend[aá]rio|L)\b/i),costMatch=rawMeta.match(/(\d+)\s*MP\b/i);
    var active={name:name,rank:rankMatch?(rankMatch[1].toUpperCase()==='L'?'L':rankMatch[1]):'',cost:costMatch?Number(costMatch[1]):0,action:strictAction(rawMeta,effect),recovery:recovery(effect),effect:effect,rawMeta:rawMeta};
    active.usage=usageFrom(active,item);
    item.active=active;
  }
  Object.keys(db.mythicItems).forEach(function(key){
    var item=db.mythicItems[key];if(!item||(item.tier!=='Relíquia'&&item.tier!=='Artefato'))return;
    parseActive(item);
    if(/CA[^.]{0,50}\bDES\b/i.test(String(item.meta||'')+' '+String(item.effect||'')))item.projectNote='Regra do aplicativo: no cálculo de CA, CON substitui DES.';
    if(item.id==='artifact-o-coracao-do-tartaro-lendario')item.effect=String(item.effect||'').split(' Estes seis tiers')[0];
  });
  db.version='3e-rules-db-0.39.5';
})(window);
