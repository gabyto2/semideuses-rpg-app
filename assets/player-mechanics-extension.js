(function(global){
  'use strict';
  var Model=global.SemideusesCharacter;
  var Rules=global.SemideusesRules;
  var db=global.SemideusesRulesDatabase;
  if(!Model||!Rules||!db)return;

  var PERICIAS=[
    ['Atletismo','FOR'],['Acrobacia','DES'],['Furtividade','DES'],['Prestidigitação','DES'],
    ['Saber Mítico','INT'],['História','INT'],['Investigação','INT'],['Natureza','INT'],['Religião / Panteão','INT'],
    ['Lidar com Animais','SAB'],['Intuição','SAB'],['Medicina','SAB'],['Percepção','SAB'],['Sobrevivência','SAB'],
    ['Atuação','CAR'],['Enganação','CAR'],['Intimidação','CAR'],['Persuasão','CAR']
  ];
  var ALIASES={
    'Religião':'Religião / Panteão','Religião/Panteão':'Religião / Panteão','Religião / Panteão':'Religião / Panteão',
    'Lidar c/ Animais':'Lidar com Animais'
  };
  var originalNormalize=Model.normalize;
  var originalCalculate=Model.calculate;
  var originalCreate=Model.create;

  function clone(value){return Model.clone(value);}
  function canonical(name){name=String(name||'').trim();return ALIASES[name]||name;}
  function unique(list){return (list||[]).map(canonical).filter(function(value,index,all){return value&&all.indexOf(value)===index;});}
  function talentRecord(value){
    if(typeof value==='string')return {id:Model.uid('talent'),name:value,catalogId:'',choice:'',level:1};
    value=value||{};return {id:value.id||Model.uid('talent'),name:String(value.name||''),catalogId:String(value.catalogId||''),choice:value.choice==null?'':clone(value.choice),level:Number(value.level||1)};
  }
  function preserveSkillMetadata(normalized,raw){
    var source=Array.isArray(raw&&raw.skills)?raw.skills:[];
    normalized.skills=(normalized.skills||[]).map(function(skill){
      var old=source.find(function(item){return item&&((item.id&&item.id===skill.id)||(item.catalogId&&item.catalogId===skill.catalogId)||(item.name===skill.name));})||{};
      ['catalogId','action','axis','sourceType','automatic','usage','minLevel'].forEach(function(key){if(old[key]!=null)skill[key]=clone(old[key]);});
      if(old.description&&!skill.description)skill.description=old.description;
      return skill;
    });
    return normalized;
  }
  function fixedExpertiseFromTalents(character){
    var expertise=[];
    (character.talents||[]).forEach(function(record){
      var definition=db.getTalent&&db.getTalent(record.catalogId||record.name);
      if(!definition)return;
      (definition.expertise||[]).forEach(function(name){expertise.push(canonical(name));});
      if(definition.name==='Especialista'&&record.choice)expertise.push(canonical(record.choice));
    });
    return unique(expertise);
  }
  function proficiencyFromTalents(character){
    var prof=[];
    (character.talents||[]).forEach(function(record){
      var definition=db.getTalent&&db.getTalent(record.catalogId||record.name);
      if(!definition)return;
      if(definition.name==='Polímata'){
        var choices=Array.isArray(record.choice)?record.choice:String(record.choice||'').split(',');
        choices.forEach(function(name){if(name)prof.push(canonical(name));});
      }
    });
    return unique(prof);
  }
  function hasTalent(character,name){return (character.talents||[]).some(function(record){return record.name===name||(db.getTalent&&db.getTalent(record.catalogId||record.name)||{}).name===name;});}
  function apply(character,raw){
    var c=character;
    c.talents=(Array.isArray(raw&&raw.talents)?raw.talents:Array.isArray(c.talents)?c.talents:[]).map(talentRecord).filter(function(item){return item.name;});
    c.periciaProficiencies=unique(raw&&raw.periciaProficiencies||c.periciaProficiencies||[]);
    c.periciaExpertise=unique(raw&&raw.periciaExpertise||c.periciaExpertise||[]);
    preserveSkillMetadata(c,raw||c);

    var official=unique(c.officialSkillProficiencies||c.rules&&c.rules.skillProficiencies||[]);
    var talentProf=proficiencyFromTalents(c);
    var manual=unique(c.periciaProficiencies.concat(talentProf));
    var expert=unique(c.periciaExpertise.concat(fixedExpertiseFromTalents(c)));
    expert.forEach(function(name){if(official.indexOf(name)<0&&manual.indexOf(name)<0)manual.push(name);});
    c.periciaProficiencies=manual;
    c.periciaExpertise=expert;

    var proficiency=Number(c.rules&&c.rules.proficiency||Rules.proficiency(c.level));
    c.rules=c.rules||{};
    c.rules.pericias=PERICIAS.map(function(entry){
      var name=entry[0],attribute=entry[1],isProficient=official.indexOf(name)>=0||manual.indexOf(name)>=0,isExpert=expert.indexOf(name)>=0;
      var bonus=Rules.modifier(c.attributes[attribute])+(isProficient?proficiency:0)+(isExpert?proficiency:0);
      return {name:name,attribute:attribute,proficient:isProficient,expertise:isExpert,official:official.indexOf(name)>=0,bonus:bonus};
    });
    var perception=c.rules.pericias.find(function(item){return item.name==='Percepção';});
    c.rules.passivePerception=10+Number(perception&&perception.bonus||0);
    c.rules.initiative=Rules.modifier(c.attributes.DES)+2;
    var casting=c.rules.casting||'SAB',castingMod=Rules.modifier(c.attributes[casting]);
    c.rules.abilityDC=8+proficiency+castingMod;
    c.rules.castingAttackBonus=proficiency+castingMod;

    var base=hasTalent(c,'Armadura Natural')?12:10;
    c.rules.defenseAttribute='CON';
    c.rules.armorClassBase=base+Rules.modifier(c.attributes.CON);
    c.rules.armorClass=c.rules.armorClassBase;
    c.rules.armorClassFormula=base+' + mod CON';
    c.rules.armorClassRule='project-override';
    c.rules.talents=c.talents.map(function(record){var definition=db.getTalent&&db.getTalent(record.catalogId||record.name);return definition?Object.assign({},definition,{record:clone(record)}):{name:record.name,record:clone(record)};});
    return c;
  }
  function normalize(character){var raw=clone(character||{});return apply(originalNormalize(raw),raw);}
  function calculate(character){var raw=clone(character||{});return apply(originalCalculate(raw),raw);}
  function create(overrides){var raw=Object.assign({talents:[],periciaProficiencies:[],periciaExpertise:[]},overrides||{});return apply(originalCreate(raw),raw);}
  function pericia(character,name){var c=normalize(character);return (c.rules.pericias||[]).find(function(item){return item.name===canonical(name);})||null;}

  db.systemOverrides=db.systemOverrides||{};
  db.systemOverrides.armorClass={attribute:'CON',unarmoredBase:10,note:'Regra deliberada do aplicativo: CA usa Constituição no lugar de Destreza.'};
  Model.version='3e-model-0.7.0';
  Model.periciaDefinitions=PERICIAS.map(function(entry){return {name:entry[0],attribute:entry[1]};});
  Model.canonicalPericia=canonical;
  Model.pericia=pericia;
  Model.normalize=normalize;
  Model.calculate=calculate;
  Model.create=create;
})(window);