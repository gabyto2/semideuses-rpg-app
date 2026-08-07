(function(global){
  'use strict';
  var Service=global.SemideusesCharacterService,Model=global.SemideusesCharacter,db=global.SemideusesRulesDatabase;if(!Service||!Model||!db)return;
  function addConsumable(id,catalogId,charges){
    return Service.update(id,function(c){c=Model.normalize(c);var d=db.getMythicItem&&db.getMythicItem(catalogId);if(!d||d.tier!=='Consumível')throw new Error('Consumível mítico não encontrado.');
      var existing=(c.mythic.consumables||[]).find(function(r){return r.catalogId===d.id;});
      if(d.chargeFormula){charges=Math.floor(Number(charges||0));if(charges<1)throw new Error('Informe quantos '+(d.chargeLabel||'usos')+' foram obtidos ('+d.chargeFormula+').');}
      if(d.variants&&d.variants.length){
        if(!existing){existing={id:Model.uid('consumable'),catalogId:d.id,charges:0,variantCharges:{},notes:''};c.mythic.consumables.push(existing);}d.variants.forEach(function(v){existing.variantCharges[v.id]=Number(existing.variantCharges[v.id]||0)+Number(v.charges||0);});existing.charges=Object.keys(existing.variantCharges).reduce(function(s,k){return s+Number(existing.variantCharges[k]||0);},0);
      }else{
        var amount=d.chargeFormula?charges:Math.max(1,Number(d.defaultCharges||1));if(existing)existing.charges=Number(existing.charges||0)+amount;else c.mythic.consumables.push({id:Model.uid('consumable'),catalogId:d.id,charges:amount,variantCharges:{},notes:''});
      }return c;});
  }
  function removeConsumable(id,recordId){return Service.update(id,function(c){c=Model.normalize(c);c.mythic.consumables=c.mythic.consumables.filter(function(r){return r.id!==recordId;});return c;});}
  function setConsumableCharges(id,recordId,value){return Service.update(id,function(c){c=Model.normalize(c);var r=c.mythic.consumables.find(function(x){return x.id===recordId;});if(!r)throw new Error('Consumível não encontrado.');r.charges=Math.max(0,Math.floor(Number(value||0)));return c;});}
  function linkPanoply(id,catalogId,replace){return Service.update(id,function(c){c=Model.normalize(c);var d=db.getMythicItem&&db.getMythicItem(catalogId);if(!d||d.tier!=='Panóplia')throw new Error('Panóplia não encontrada.');if(c.mythic.panoplyId&&c.mythic.panoplyId!==d.id&&!replace)throw new Error('O personagem já possui uma Panóplia ligada à alma.');c.mythic.panoplyId=d.id;return c;});}
  function unlinkPanoply(id){return Service.update(id,function(c){c=Model.normalize(c);c.mythic.panoplyId='';return c;});}
  Service.version='3e-service-0.8.0';Service.addMythicConsumable=addConsumable;Service.removeMythicConsumable=removeConsumable;Service.setMythicConsumableCharges=setConsumableCharges;Service.linkPanoply=linkPanoply;Service.unlinkPanoply=unlinkPanoply;
})(window);
