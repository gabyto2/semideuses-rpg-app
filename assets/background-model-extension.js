(function(global){
  'use strict';

  var Model=global.SemideusesCharacter;
  var db=global.SemideusesRulesDatabase;
  if(!Model||!db)return;

  var originalNormalize=Model.normalize;
  var originalCreate=Model.create;
  var originalCalculate=Model.calculate;
  var originalValidate=Model.validate;

  function clone(value){return Model.clone(value);}
  function unique(list){return (list||[]).filter(function(value,index,all){return all.indexOf(value)===index;});}
  function getBackground(name){return typeof db.getBackground==='function'?db.getBackground(name):null;}

  function applyBackground(character){
    var c=character;
    var background=getBackground(c.background);
    c.rules=c.rules||{};
    c.rules.background=background?clone(background):null;
    c.rules.affiliationSkillProficiencies=(c.rules.skillProficiencies||[]).slice();
    c.rules.backgroundSkillProficiencies=background?(background.skillProficiencies||[]).slice():[];
    c.rules.skillProficiencies=unique(c.rules.affiliationSkillProficiencies.concat(c.rules.backgroundSkillProficiencies));
    c.rules.toolProficiencies=background&&background.toolProficiency?[background.toolProficiency]:[];
    c.rules.backgroundTrait=background?clone(background.trait):null;
    c.rules.backgroundBond=background&&background.bond||'';
    c.officialSkillProficiencies=c.rules.skillProficiencies.slice();
    return c;
  }

  function calculate(character){return applyBackground(originalCalculate(character));}
  function normalize(character){return applyBackground(originalNormalize(character));}
  function create(overrides){return applyBackground(originalCreate(overrides||{}));}
  function validate(character,options){
    var result=originalValidate(character,options||{});
    var c=normalize(character);
    var step=options&&options.step;
    if((step==null||step===5)&&c.background&&!getBackground(c.background)){
      result.errors=result.errors.filter(function(error){return error.code!=='required-background';});
      result.errors.push({step:5,field:'background',code:'invalid-background',message:'Escolha um Antecedente oficial da 3ª edição.'});
    }
    result.valid=result.errors.length===0;
    result.character=c;
    return result;
  }

  Model.version='3e-model-0.6.0';
  Model.calculate=calculate;
  Model.normalize=normalize;
  Model.create=create;
  Model.validate=validate;
  Model.databaseBackground=getBackground;
  Model.listBackgrounds=function(){return typeof db.listBackgrounds==='function'?db.listBackgrounds():[];};
})(window);
