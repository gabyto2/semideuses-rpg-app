(function(global){
  'use strict';

  var ATTRIBUTES=['FOR','DES','CON','INT','SAB','CAR'];
  var CONDITIONS=[
    'Saudável','Abalado','Agarrado','Apavorado','Atordoado','Caído','Cego',
    'Enfeitiçado','Envenenado','Exausto','Ferido','Impedido','Incapacitado',
    'Inconsciente','Lento','Morrendo','Paralisado','Restrito'
  ];
  var DEFAULT_ATTRIBUTES={FOR:15,DES:14,CON:13,INT:12,SAB:10,CAR:8};
  var DEFAULT_HERO_MARKS=['Ataque Extra','Bônus de Conjuração'];

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function uid(prefix){return (prefix||'char')+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8);}
  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function unique(source){
    if(!Array.isArray(source))return [];
    return source.filter(function(value,index,list){return list.indexOf(value)===index;});
  }
  function uniqueAttributes(source){
    return unique(source).filter(function(attribute){return ATTRIBUTES.indexOf(attribute)>=0;});
  }
  function cleanAttributes(source){
    var result={};
    ATTRIBUTES.forEach(function(attribute){
      var value=Number(source&&source[attribute]);
      result[attribute]=Number.isFinite(value)?clamp(value,1,30):DEFAULT_ATTRIBUTES[attribute];
    });
    return result;
  }
  function cleanSkills(source){
    if(!Array.isArray(source))return [];
    return source.map(function(skill){
      return {
        id:skill&&skill.id||uid('skill'),
        name:String(skill&&skill.name||'Habilidade'),
        cost:Math.max(0,Number(skill&&skill.cost!=null?skill.cost:skill&&skill.mp||0)),
        resourceId:String(skill&&skill.resourceId||'primary'),
        rank:skill&&skill.rank||'',
        description:skill&&skill.description||''
      };
    });
  }
  function database(){return global.SemideusesRulesDatabase||null;}
  function resourceRules(){return global.SemideusesResourceRules||null;}
  function databaseAffiliation(name){
    var rulesDatabase=database();
    if(!rulesDatabase||typeof rulesDatabase.getAffiliation!=='function')return null;
    return rulesDatabase.getAffiliation(name);
  }
  function heroMarks(){
    var rulesDatabase=database();
    var marks=rulesDatabase&&Array.isArray(rulesDatabase.heroMarks)?rulesDatabase.heroMarks:null;
    return marks&&marks.length?marks.map(function(mark){return mark.name;}):DEFAULT_HERO_MARKS.slice();
  }
  function affiliationRules(name){
    var official=databaseAffiliation(name);
    if(official){
      return {
        source:'rules-database',
        id:official.id||'',
        name:official.name||name,
        title:official.title||'',
        icon:official.icon||'',
        domain:official.domain||'',
        profile:official.profile||'',
        overview:official.overview||'',
        specialNature:official.specialNature||'',
        vow:clone(official.vow||null),
        casting:official.casting||'SAB',
        hitDie:Number(official.hitDie||8),
        savingThrows:uniqueAttributes(official.savingThrows),
        skillProficiencies:Array.isArray(official.skillProficiencies)?official.skillProficiencies.slice():[],
        weaponProficiencies:Array.isArray(official.weaponProficiencies)?official.weaponProficiencies.slice():[],
        armorProficiencies:Array.isArray(official.armorProficiencies)?official.armorProficiencies.slice():[],
        progression:clone(official.progression||{}),
        signature:clone(official.signature||null),
        abilities:clone(official.abilities||[]),
        paths:clone(official.paths||[]),
        resourceSystem:clone(official.resourceSystem||null)
      };
    }
    return {
      source:'missing-rules',id:'',name:name||'',title:'',icon:'',domain:'',profile:'',overview:'',
      specialNature:'',vow:null,casting:'SAB',hitDie:8,savingThrows:[],skillProficiencies:[],
      weaponProficiencies:[],armorProficiencies:[],progression:{},signature:null,abilities:[],paths:[],resourceSystem:null
    };
  }
  function primaryDefinition(affiliation){
    var resources=resourceRules();
    if(resources&&typeof resources.primaryFor==='function')return resources.primaryFor(affiliation.name);
    return {id:'mp',label:'MP',kind:'pool',usesMana:true,costLabel:'MP',min:{type:'fixed',value:0},max:{type:'mana'},initial:'max'};
  }
  function evaluateResource(formula,character,affiliation){
    var resources=resourceRules();
    if(resources&&typeof resources.evaluate==='function')return resources.evaluate(formula,character,affiliation);
    return formula&&formula.type==='fixed'?Number(formula.value||0):0;
  }
  function evaluatedPrimary(character,affiliation){
    var definition=primaryDefinition(affiliation);
    var minimum=evaluateResource(definition.min,character,affiliation);
    var maximum=evaluateResource(definition.max,character,affiliation);
    if(minimum==null)minimum=0;
    if(maximum==null)maximum=0;
    return Object.assign({},definition,{min:Number(minimum),max:Number(maximum)});
  }
  function initialPrimary(definition){return definition.initial==='max'?definition.max:definition.min;}
  function normalizeConditionList(resources){
    var list=Array.isArray(resources&&resources.conditions)?resources.conditions.slice():[];
    var legacy=resources&&resources.condition;
    if(legacy&&legacy!=='Saudável')list.unshift(legacy);
    list=unique(list).filter(function(condition){return CONDITIONS.indexOf(condition)>=0&&condition!=='Saudável';});
    return list;
  }
  function primaryCurrentFrom(resources,definition){
    if(resources&&resources.primaryId===definition.id&&resources.primaryCurrent!=null)return Number(resources.primaryCurrent);
    var namedKey=definition.id+'Current';
    if(resources&&resources[namedKey]!=null)return Number(resources[namedKey]);
    if(resources&&resources.mpCurrent!=null)return Number(resources.mpCurrent);
    return null;
  }
  function syncPrimaryAliases(resources,definition,current){
    resources.primaryId=definition.id;
    resources.primaryLabel=definition.label;
    resources.primaryCurrent=current;
    resources[definition.id+'Current']=current;
    resources.mpCurrent=current;
  }
  function calculate(character){
    var c=character;
    var affiliation=affiliationRules(c.affiliation);
    var level=clamp(Number(c.level||1),1,20);
    var oldPv=c.rules&&Number(c.rules.pvMax);
    var oldPrimaryMax=c.rules&&Number(c.rules.primaryMax!=null?c.rules.primaryMax:c.rules.mpMax);
    var ruleEngine=global.SemideusesRules;
    if(!ruleEngine)throw new Error('Motor de regras não carregado.');

    c.level=level;
    c.attributes=cleanAttributes(c.attributes);
    var primary=evaluatedPrimary(c,affiliation);
    var specialDefinitions=[];
    var resourcesApi=resourceRules();
    if(resourcesApi&&typeof resourcesApi.specialFor==='function'){
      specialDefinitions=resourcesApi.specialFor(affiliation.name).map(function(definition){
        return resourcesApi.evaluatedDefinition(definition,c,affiliation);
      });
    }

    c.rules={
      source:affiliation.source,
      affiliationId:affiliation.id,
      affiliationTitle:affiliation.title,
      affiliationIcon:affiliation.icon,
      domain:affiliation.domain,
      profile:affiliation.profile,
      overview:affiliation.overview,
      specialNature:affiliation.specialNature,
      vow:affiliation.vow,
      casting:affiliation.casting,
      hitDie:affiliation.hitDie,
      savingThrows:affiliation.savingThrows,
      skillProficiencies:affiliation.skillProficiencies,
      weaponProficiencies:affiliation.weaponProficiencies,
      armorProficiencies:affiliation.armorProficiencies,
      progression:affiliation.progression,
      signature:affiliation.signature,
      abilities:affiliation.abilities,
      paths:affiliation.paths,
      resourceSystem:affiliation.resourceSystem,
      primaryResource:clone(primary),
      specialResources:clone(specialDefinitions),
      proficiency:ruleEngine.proficiency(level),
      pvMax:ruleEngine.maxHP(level,affiliation.hitDie,c.attributes.CON),
      primaryMax:primary.max,
      manaMax:primary.usesMana===false?0:primary.max,
      mpMax:primary.max
    };

    c.resources=c.resources||{};
    if(c.resources.pvCurrent==null||c.resources.pvCurrent===oldPv)c.resources.pvCurrent=c.rules.pvMax;
    else c.resources.pvCurrent=clamp(Number(c.resources.pvCurrent||0),0,c.rules.pvMax);

    var previousPrimary=primaryCurrentFrom(c.resources,primary);
    if(previousPrimary==null||previousPrimary===oldPrimaryMax)previousPrimary=initialPrimary(primary);
    previousPrimary=clamp(Number(previousPrimary||0),primary.min,primary.max);
    syncPrimaryAliases(c.resources,primary,previousPrimary);

    c.resources.tempHp=Math.max(0,Number(c.resources.tempHp||0));
    c.resources.hitDiceMax=Math.max(1,level);
    if(c.resources.hitDiceCurrent==null)c.resources.hitDiceCurrent=c.resources.hitDiceMax;
    c.resources.hitDiceCurrent=clamp(Number(c.resources.hitDiceCurrent||0),0,c.resources.hitDiceMax);
    c.resources.conditions=normalizeConditionList(c.resources);
    c.resources.condition=c.resources.conditions[0]||'Saudável';

    if(resourcesApi&&typeof resourcesApi.normalizeSpecial==='function'){
      c.resources.special=resourcesApi.normalizeSpecial(c,affiliation,c.resources.special||{});
    }else c.resources.special={};

    c.officialSaveProficiencies=uniqueAttributes(affiliation.savingThrows);
    c.saveProficiencies=uniqueAttributes(c.saveProficiencies);
    return c;
  }
  function normalize(character){
    var c=clone(character||{});
    c.id=c.id||uid();
    c.systemEdition='3e';
    c.schemaVersion=5;
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
    c.skills=cleanSkills(c.skills);
    c.saveProficiencies=uniqueAttributes(c.saveProficiencies);
    c.officialSaveProficiencies=uniqueAttributes(c.officialSaveProficiencies);
    c.notes=c.notes||'';
    return calculate(c);
  }
  function create(overrides){
    return normalize(Object.assign({
      id:uid(),systemEdition:'3e',schemaVersion:5,name:'',player:'',age:'',
      appearance:'',level:1,concept:'',heroType:'Semideus Grego',affiliation:'',
      background:'',divinePath:'',heroMark:'',attributes:clone(DEFAULT_ATTRIBUTES),
      skills:[],saveProficiencies:[],officialSaveProficiencies:[],
      resources:{tempHp:0,condition:'Saudável',conditions:[],special:{}},notes:'',createdAt:new Date().toISOString()
    },overrides||{}));
  }
  function resourceState(character,type){
    var c=normalize(character);
    var primary=c.rules.primaryResource;
    if(type==='primary'||type==='mp'||type===primary.id){
      return {id:primary.id,label:primary.label,current:c.resources.primaryCurrent,max:c.rules.primaryMax,min:primary.min,kind:'pool'};
    }
    if(type==='pv')return {id:'pv',label:'PV',current:c.resources.pvCurrent,max:c.rules.pvMax,min:0,kind:'pool'};
    if(type==='tempHp')return {id:'tempHp',label:'PV Temporários',current:c.resources.tempHp,max:null,min:0,kind:'counter'};
    if(type==='hitDice')return {id:'hitDice',label:'Dados de Vida',current:c.resources.hitDiceCurrent,max:c.resources.hitDiceMax,min:0,kind:'counter'};
    var specialId=String(type||'').replace(/^special:/,'');
    var special=c.resources.special&&c.resources.special[specialId];
    if(special){
      var definition=(c.rules.specialResources||[]).find(function(item){return item.id===specialId;})||{};
      return Object.assign({},definition,special);
    }
    return null;
  }
  function adjustResource(character,type,amount){
    var c=normalize(character);
    var state=resourceState(c,type);
    if(!state)throw new Error('Recurso inválido: '+type);
    if(state.kind==='mode'||state.kind==='toggle'||state.kind==='target-marker'||state.kind==='target-counter'||state.kind==='reference'){
      throw new Error('Este recurso não aceita ajuste numérico: '+state.label);
    }
    var next=Number(state.current||0)+Number(amount||0);
    if(state.min!=null)next=Math.max(Number(state.min),next);
    if(state.max!=null)next=Math.min(Number(state.max),next);
    if(state.id==='pv')c.resources.pvCurrent=next;
    else if(state.id==='tempHp')c.resources.tempHp=next;
    else if(state.id==='hitDice')c.resources.hitDiceCurrent=next;
    else if(state.id===c.rules.primaryResource.id)syncPrimaryAliases(c.resources,c.rules.primaryResource,next);
    else c.resources.special[state.id].current=next;
    return calculate(c);
  }
  function setResource(character,type,value){
    var state=resourceState(character,type);
    if(!state)throw new Error('Recurso inválido: '+type);
    if(state.kind==='mode'){
      var c=normalize(character);
      var definition=(c.rules.specialResources||[]).find(function(item){return item.id===state.id;})||{};
      if(!Array.isArray(definition.options)||definition.options.indexOf(value)<0)throw new Error('Modo inválido para '+state.label+'.');
      c.resources.special[state.id].current=value;
      return calculate(c);
    }
    if(state.kind==='toggle'){
      var toggleCharacter=normalize(character);
      toggleCharacter.resources.special[state.id].current=!!value;
      return calculate(toggleCharacter);
    }
    return adjustResource(character,type,Number(value||0)-Number(state.current||0));
  }
  function updateAttribute(character,attribute,value){
    if(ATTRIBUTES.indexOf(attribute)<0)throw new Error('Atributo inválido: '+attribute);
    var c=normalize(character);
    c.attributes[attribute]=clamp(Number(value||10),1,30);
    return calculate(c);
  }
  function validate(character,options){
    var c=normalize(character);
    var onlyStep=options&&options.step;
    var errors=[];
    function add(step,field,code,message){if(onlyStep==null||onlyStep===step)errors.push({step:step,field:field,code:code,message:message});}
    if(!String(c.name||'').trim())add(1,'name','required-name','Informe o nome do personagem.');
    if(!String(c.heroType||'').trim())add(2,'heroType','required-nature','Escolha a Natureza do personagem.');
    var affiliation=databaseAffiliation(c.affiliation);
    if(!c.affiliation||!affiliation)add(3,'affiliation','required-affiliation','Escolha uma Filiação válida da 3ª edição.');
    ATTRIBUTES.forEach(function(attribute){
      var value=Number(c.attributes[attribute]);
      if(!Number.isFinite(value)||value<1||value>30)add(4,attribute,'invalid-attribute','O atributo '+attribute+' precisa estar entre 1 e 30.');
    });
    if(!String(c.background||'').trim())add(5,'background','required-background','Escolha um Antecedente antes de continuar.');
    if(affiliation&&c.level>=3&&Array.isArray(affiliation.paths)&&affiliation.paths.length){
      var pathNames=affiliation.paths.map(function(path){return path.name;});
      if(pathNames.indexOf(c.divinePath)<0)add(6,'divinePath','required-path','Escolha um Caminho válido para '+c.affiliation+'.');
    }
    if(c.level>=5&&heroMarks().indexOf(c.heroMark)<0)add(7,'heroMark','required-hero-mark','Escolha uma Marca do Herói válida.');
    return {valid:errors.length===0,errors:errors,character:c};
  }

  global.SemideusesCharacter={
    version:'3e-model-0.5.0',
    schemaVersion:5,
    attributes:ATTRIBUTES.slice(),
    conditions:CONDITIONS.slice(),
    heroMarks:heroMarks(),
    defaults:{attributes:clone(DEFAULT_ATTRIBUTES)},
    databaseAffiliation:databaseAffiliation,
    affiliationRules:affiliationRules,
    cleanAttributes:cleanAttributes,
    cleanSkills:cleanSkills,
    calculate:calculate,
    normalize:normalize,
    create:create,
    updateAttribute:updateAttribute,
    resourceState:resourceState,
    adjustResource:adjustResource,
    setResource:setResource,
    validate:validate,
    clone:clone,
    uid:uid
  };
})(window);
