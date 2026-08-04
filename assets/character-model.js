(function(global){
  'use strict';

  var ATTRIBUTES=['FOR','DES','CON','INT','SAB','CAR'];
  var DEFAULT_ATTRIBUTES={FOR:15,DES:14,CON:13,INT:12,SAB:10,CAR:8};
  var AFFILIATION_RULES={
    'Zeus':{casting:'CAR',hitDie:10},'Poseidon':{casting:'SAB',hitDie:10},
    'Hades':{casting:'INT',hitDie:10},'Atena':{casting:'INT',hitDie:8},
    'Ares':{casting:'FOR',hitDie:12},'Apolo':{casting:'CAR',hitDie:8},
    'Hermes':{casting:'CAR',hitDie:8},'Hefesto':{casting:'INT',hitDie:10},
    'Afrodite':{casting:'CAR',hitDie:8},'Deméter':{casting:'SAB',hitDie:8},
    'Dionísio':{casting:'CAR',hitDie:8},'Ártemis':{casting:'SAB',hitDie:10},
    'Hécate':{casting:'INT',hitDie:8},'Íris':{casting:'CAR',hitDie:8},
    'Hipnos':{casting:'SAB',hitDie:8},'Morfeu':{casting:'INT',hitDie:8},
    'Tique':{casting:'CAR',hitDie:8},'Éolo':{casting:'SAB',hitDie:8},
    'Circe':{casting:'INT',hitDie:8},'Eros':{casting:'CAR',hitDie:8},
    'Nyx':{casting:'CAR',hitDie:10},'Nêmesis':{casting:'SAB',hitDie:10},
    'Nike':{casting:'CAR',hitDie:10},'Tânatos':{casting:'SAB',hitDie:10},
    'Perséfone':{casting:'SAB',hitDie:8},'Hebe':{casting:'CAR',hitDie:8}
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function uid(){return 'char-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function cleanAttributes(source){
    var result={};
    ATTRIBUTES.forEach(function(attribute){
      var value=Number(source&&source[attribute]);
      result[attribute]=Number.isFinite(value)?clamp(value,1,30):DEFAULT_ATTRIBUTES[attribute];
    });
    return result;
  }
  function affiliationRules(name){return clone(AFFILIATION_RULES[name]||{casting:'SAB',hitDie:8});}
  function calculate(character){
    var c=character;
    var rules=affiliationRules(c.affiliation);
    var level=clamp(Number(c.level||1),1,20);
    var oldPv=c.rules&&Number(c.rules.pvMax);
    var oldMp=c.rules&&Number(c.rules.mpMax);
    var ruleEngine=global.SemideusesRules;
    if(!ruleEngine)throw new Error('Motor de regras não carregado.');

    c.level=level;
    c.attributes=cleanAttributes(c.attributes);
    c.rules={
      casting:rules.casting,
      hitDie:rules.hitDie,
      proficiency:ruleEngine.proficiency(level),
      pvMax:ruleEngine.maxHP(level,rules.hitDie,c.attributes.CON),
      mpMax:ruleEngine.maxMP(level,c.attributes[rules.casting])
    };
    c.resources=c.resources||{};
    if(c.resources.pvCurrent==null||c.resources.pvCurrent===oldPv)c.resources.pvCurrent=c.rules.pvMax;
    else c.resources.pvCurrent=clamp(Number(c.resources.pvCurrent||0),0,c.rules.pvMax);
    if(c.resources.mpCurrent==null||c.resources.mpCurrent===oldMp)c.resources.mpCurrent=c.rules.mpMax;
    else c.resources.mpCurrent=clamp(Number(c.resources.mpCurrent||0),0,c.rules.mpMax);
    return c;
  }
  function normalize(character){
    var c=clone(character||{});
    c.id=c.id||uid();
    c.systemEdition=c.systemEdition||'3e';
    c.schemaVersion=2;
    c.name=c.name||'';
    c.player=c.player||'';
    c.age=c.age||'';
    c.appearance=c.appearance||'';
    c.level=clamp(Number(c.level||1),1,20);
    c.concept=c.concept||'';
    c.heroType=c.heroType||'Semideus Grego';
    c.affiliation=c.affiliation||'';
    c.background=c.background||'';
    c.divinePath=c.divinePath||'';
    c.heroMark=c.heroMark||'';
    c.attributes=cleanAttributes(c.attributes);
    c.skills=Array.isArray(c.skills)?c.skills:[];
    c.notes=c.notes||'';
    return calculate(c);
  }
  function create(overrides){
    return normalize(Object.assign({
      id:uid(),systemEdition:'3e',schemaVersion:2,name:'',player:'',age:'',
      appearance:'',level:1,concept:'',heroType:'Semideus Grego',affiliation:'',
      background:'',divinePath:'',heroMark:'',attributes:clone(DEFAULT_ATTRIBUTES),
      skills:[],notes:'',createdAt:new Date().toISOString()
    },overrides||{}));
  }
  function updateAttribute(character,attribute,value){
    if(ATTRIBUTES.indexOf(attribute)<0)throw new Error('Atributo inválido: '+attribute);
    var c=normalize(character);
    c.attributes[attribute]=clamp(Number(value||10),1,30);
    return calculate(c);
  }
  function adjustResource(character,type,amount){
    var c=normalize(character);
    var key=type==='pv'?'pvCurrent':'mpCurrent';
    var max=type==='pv'?c.rules.pvMax:c.rules.mpMax;
    c.resources[key]=clamp(Number(c.resources[key]||0)+Number(amount||0),0,max);
    return c;
  }

  global.SemideusesCharacter={
    version:'3e-model-0.2.0',
    schemaVersion:2,
    attributes:ATTRIBUTES.slice(),
    defaults:{attributes:clone(DEFAULT_ATTRIBUTES)},
    affiliationRules:affiliationRules,
    cleanAttributes:cleanAttributes,
    calculate:calculate,
    normalize:normalize,
    create:create,
    updateAttribute:updateAttribute,
    adjustResource:adjustResource,
    clone:clone,
    uid:uid
  };
})(window);
