(function(global){
  'use strict';

  var service=global.SemideusesCharacterService;
  var model=global.SemideusesCharacter;
  if(!service||!model||typeof service.save!=='function')return;

  var originalSave=service.save.bind(service);

  service.save=function(character){
    var pending=global.SemideusesPendingAttributes;
    var candidate=model.clone(character||{});

    if(pending&&pending.values&&typeof pending.values==='object'){
      candidate.attributes=candidate.attributes||{};
      model.attributes.forEach(function(attribute){
        var value=Number(pending.values[attribute]);
        if(Number.isFinite(value))candidate.attributes[attribute]=Math.max(1,Math.min(30,value));
      });
      candidate.attributeCreation={
        method:pending.method||'standard',
        base:model.clone(pending.base||{}),
        originBonus:model.clone(pending.originBonus||{}),
        milestones:model.clone(pending.milestones||{})
      };
    }

    var saved=originalSave(candidate);
    global.SemideusesPendingAttributes=null;
    return saved;
  };
})(window);
