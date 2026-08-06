(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  var DEFAULT_PRIMARY={
    id:'mp',label:'MP',kind:'pool',usesMana:true,costLabel:'MP',
    min:{type:'fixed',value:0},max:{type:'mana'},initial:'max',
    recovery:{shortRest:{type:'fractionMax',value:0.25},longRest:'max'}
  };

  var HERO_MARKS=[
    {id:'extra-attack',name:'Ataque Extra',description:'Ao usar a ação Atacar, realiza dois ataques com arma em vez de um.'},
    {id:'casting-bonus',name:'Bônus de Conjuração',description:'Reduz em 1 o custo do recurso principal para habilidades de Rank C e permite combinar uma habilidade de Rank E com sua Ação, pagando o custo.'}
  ];

  function fixed(value){return {type:'fixed',value:value};}
  function castingModifier(plus,minimum){return {type:'castingModifier',plus:Number(plus||0),minimum:minimum==null?0:Number(minimum)};}
  function proficiencyPlusCasting(){return {type:'proficiencyPlusCastingModifier',minimum:1};}
  function halfLevelPlus(value){return {type:'halfLevelPlus',value:Number(value||0)};}
  function levelMultiplier(value){return {type:'levelMultiplier',value:Number(value||1)};}
  function threshold(entries){return {type:'levelThreshold',entries:entries};}

  var SPECIAL={
    'Zeus':[
      {id:'charges',label:'Cargas',kind:'counter',min:fixed(0),max:fixed(5),initial:fixed(0),scope:'character',reset:'combat',description:'A Tempestade Crescente acumula Cargas durante o combate. O Dom normalmente inicia o combate com 1 Carga, ou 2 em condições favoráveis.'}
    ],
    'Poseidon':[
      {id:'tide',label:'Maré',kind:'signed-counter',min:fixed(-3),max:fixed(3),initial:fixed(0),scope:'character',reset:'combat',description:'Valores positivos representam Maré Alta; valores negativos representam Maré Baixa.'}
    ],
    'Hades':[
      {id:'souls',label:'Almas',kind:'counter',min:fixed(0),max:castingModifier(3,0),initial:fixed(0),scope:'character',reset:'combat',description:'Ganhas quando inimigos morrem próximos. O limite é 3 + modificador de Conjuração e as Almas zeram ao fim do combate.'}
    ],
    'Atena':[
      {id:'command',label:'Comando',kind:'counter',min:fixed(0),max:{type:'doubleCastingModifierPlus',plus:2,minimum:0},initial:castingModifier(2,0),scope:'character',reset:'combat',description:'Começa cada combate com 2 + modificador de Conjuração e pode chegar ao dobro desse valor.'}
    ],
    'Ares':[
      {id:'fury',label:'Fúria',kind:'counter',min:fixed(0),max:fixed(10),initial:fixed(0),scope:'character',reset:'combat',description:'Ganha Fúria ao sofrer dano, causar crítico ou derrubar inimigos. O início do combate considera os PV já perdidos.'}
    ],
    'Apolo':[
      {id:'solar-mark',label:'Marca Solar',kind:'target-marker',scope:'target',description:'Controle aplicado a criaturas marcadas pelas flechas solares. A duração e os efeitos dependem das habilidades usadas.'}
    ],
    'Hermes':[
      {id:'rhythm',label:'Ritmo',kind:'counter',min:fixed(0),max:proficiencyPlusCasting(),initial:fixed(0),scope:'character',reset:'combat',description:'Ganho ao se mover, atacar ou usar habilidades; gasto em ações rápidas, reposicionamento e furtos.'}
    ],
    'Hefesto':[
      {id:'machine-points',label:'Pontos de Máquina',kind:'counter',min:fixed(0),max:halfLevelPlus(1),initial:'max',scope:'character',reset:'rest',description:'Orçamento de Dispositivos igual a 1 + metade do nível, reconfigurado no Descanso.'}
    ],
    'Afrodite':[
      {id:'charm',label:'Encanto',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:'max',scope:'character',reset:'combat',description:'Enche a cada combate e aumenta quando inimigos falham em Testes de Resistência contra você.'}
    ],
    'Deméter':[
      {id:'growth-zones',label:'Zonas de Crescimento',kind:'counter',min:fixed(0),max:threshold([{level:1,value:3},{level:11,value:5}]),initial:fixed(0),scope:'field',reset:'manual',description:'Quantidade de zonas vegetais mantidas ao mesmo tempo: 3, ou 5 a partir do nível 11.'}
    ],
    'Dionísio':[
      {id:'madness',label:'Delírio',kind:'reference',scope:'target',description:'As habilidades aplicam resultados da Tabela de Loucura; não é uma reserva numérica do personagem.'}
    ],
    'Ártemis':[
      {id:'marked-prey',label:'Presa Marcada',kind:'target-marker',scope:'target',description:'Uma presa por vez, marcada por 1 minuto ou até a Caçadora escolher outra.'}
    ],
    'Hécate':[
      {id:'spell-points',label:'Pontos de Feitiço',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:'max',scope:'character',reset:'rest',description:'Reserva igual ao modificador de Conjuração, usada para alterar alvo, área, duração ou tipo de dano.'}
    ],
    'Íris':[
      {id:'spectrum',label:'Espectro',kind:'mode',options:['Dourado','Vermelho','Azul'],initial:'Dourado',scope:'character',reset:'manual',description:'Dourado cura; Vermelho causa dano e cegueira; Azul concede mobilidade e escudos.'}
    ],
    'Nêmesis':[
      {id:'debt',label:'Dívida',kind:'counter',min:fixed(0),max:fixed(5),initial:fixed(0),scope:'character',reset:'combat',description:'Ganha Dívida quando sofre dano, recebe crítico ou um aliado cai. Zera no fim do combate.'}
    ],
    'Hipnos':[
      {id:'drowsiness',label:'Sonolência',kind:'target-counter',min:fixed(0),max:fixed(3),scope:'target',description:'Cada alvo acumula Sonolência separadamente. Ao chegar a 3 fichas, cai Inconsciente.'}
    ],
    'Morfeu':[
      {id:'dream-threads',label:'Fios de Sonho',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:fixed(0),scope:'character',reset:'manual',description:'Ganha 1 Fio quando um inimigo falha em um Teste de Resistência contra você.'}
    ],
    'Nike':[
      {id:'momentum',label:'Ímpeto do grupo',kind:'counter',min:fixed(0),max:null,initial:fixed(0),scope:'group',reset:'manual',description:'Recurso coletivo gerado por críticos e inimigos reduzidos a 0 PV.'}
    ],
    'Tique':[
      {id:'luck-points',label:'Pontos de Sorte',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:'max',scope:'character',reset:'rest',description:'Gaste após um d20 para rolar novamente e escolher o resultado.'},
      {id:'stored-luck-dice',label:'Dados de Sorte guardados',kind:'counter',min:fixed(0),max:fixed(2),initial:fixed(0),scope:'character',reset:'combat',description:'Dados guardados por Bolso Furado durante o combate.'}
    ],
    'Tânatos':[
      {id:'death-mark',label:'Marca da Morte',kind:'target-marker',scope:'target',description:'Marca uma criatura visível; a partir do nível 2, pode manter duas marcas.'}
    ],
    'Éolo':[
      {id:'gale',label:'Ventania',kind:'toggle',initial:false,scope:'field',reset:'manual',description:'Esfera de vento de 6 m que pode ser movida pelo campo.'}
    ],
    'Circe':[
      {id:'reagents',label:'Reagentes',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:'max',scope:'character',reset:'long-rest',description:'Poções e pós preparados no Descanso, em quantidade igual ao modificador de Conjuração.'}
    ],
    'Perséfone':[
      {id:'season',label:'Estação',kind:'mode',options:['Primavera','Inverno'],initial:'Primavera',scope:'character',reset:'manual',description:'Primavera favorece cura e crescimento; Inverno favorece dano Necrótico e controle.'}
    ],
    'Hebe':[],
    'Eros':[
      {id:'bonds',label:'Vínculos ativos',kind:'counter',min:fixed(0),max:castingModifier(0,1),initial:fixed(0),scope:'field',reset:'manual',description:'Quantidade de Vínculos mantidos, limitada pelo modificador de Conjuração.'}
    ],
    'Nyx':[
      {id:'darkness-zone',label:'Escuridão',kind:'toggle',initial:false,scope:'field',reset:'manual',description:'Zona de escuridão mágica própria, uma por vez.'}
    ]
  };

  var PRIMARY_OVERRIDES={
    'Hebe':{
      id:'vigor',label:'Vigor',kind:'pool',usesMana:false,costLabel:'Vigor',
      min:fixed(0),max:levelMultiplier(2),initial:'max',
      recovery:{shortRest:{type:'fractionMax',value:0.5},longRest:'max'},
      description:'Hebe não usa Mana. O Vigor é igual a 2 × nível, recuperado por completo no Descanso Longo e pela metade no Descanso Curto.'
    }
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function modifier(value){return Math.floor((Number(value||10)-10)/2);}
  function levelOf(character){return Math.max(1,Math.min(20,Number(character&&character.level||1)));}
  function castingModifierOf(character,affiliation){
    var casting=affiliation&&affiliation.casting||'SAB';
    return modifier(character&&character.attributes&&character.attributes[casting]);
  }
  function proficiencyOf(character){
    var level=levelOf(character);
    if(global.SemideusesRules&&typeof global.SemideusesRules.proficiency==='function')return global.SemideusesRules.proficiency(level);
    if(level<=4)return 2;if(level<=8)return 3;if(level<=12)return 4;if(level<=16)return 5;return 6;
  }
  function evaluate(formula,character,affiliation){
    if(formula==null)return null;
    if(typeof formula==='number')return formula;
    if(typeof formula==='string')return formula==='max'?null:Number(formula);
    var type=formula.type;
    var result=0;
    if(type==='fixed')result=Number(formula.value||0);
    else if(type==='mana'){
      var score=character&&character.attributes&&character.attributes[affiliation&&affiliation.casting||'SAB'];
      result=global.SemideusesRules&&typeof global.SemideusesRules.maxMP==='function'?global.SemideusesRules.maxMP(levelOf(character),score):0;
    }
    else if(type==='castingModifier')result=castingModifierOf(character,affiliation)+Number(formula.plus||0);
    else if(type==='doubleCastingModifierPlus')result=2*(castingModifierOf(character,affiliation)+Number(formula.plus||0));
    else if(type==='proficiencyPlusCastingModifier')result=proficiencyOf(character)+castingModifierOf(character,affiliation);
    else if(type==='halfLevelPlus')result=Math.floor(levelOf(character)/2)+Number(formula.value||0);
    else if(type==='levelMultiplier')result=levelOf(character)*Number(formula.value||1);
    else if(type==='levelThreshold'){
      result=0;
      (formula.entries||[]).forEach(function(entry){if(levelOf(character)>=Number(entry.level||1))result=Number(entry.value||0);});
    }
    else if(type==='fractionMax')return null;
    if(formula.minimum!=null)result=Math.max(Number(formula.minimum),result);
    if(formula.maximum!=null)result=Math.min(Number(formula.maximum),result);
    return Math.round(result);
  }
  function primaryFor(name){return clone(PRIMARY_OVERRIDES[name]||DEFAULT_PRIMARY);}
  function specialFor(name){return clone(SPECIAL[name]||[]);}
  function affiliationFor(name){return db.affiliations[name]||null;}
  function evaluatedDefinition(definition,character,affiliation){
    var item=clone(definition);
    item.min=evaluate(definition.min,character,affiliation);
    item.max=evaluate(definition.max,character,affiliation);
    if(item.min==null)item.min=0;
    return item;
  }
  function initialValue(definition,character,affiliation){
    var evaluated=evaluatedDefinition(definition,character,affiliation);
    if(definition.kind==='mode')return definition.options&&definition.options.indexOf(definition.initial)>=0?definition.initial:definition.options&&definition.options[0]||'';
    if(definition.kind==='toggle')return !!definition.initial;
    if(definition.initial==='max')return evaluated.max==null?evaluated.min:evaluated.max;
    var value=evaluate(definition.initial,character,affiliation);
    return value==null?evaluated.min:value;
  }
  function clampNumber(value,min,max){
    value=Number(value||0);
    if(!Number.isFinite(value))value=Number(min||0);
    if(min!=null)value=Math.max(Number(min),value);
    if(max!=null)value=Math.min(Number(max),value);
    return value;
  }
  function normalizeSpecial(character,affiliation,previous){
    var output={};
    specialFor(affiliation&&affiliation.name).forEach(function(definition){
      var evaluated=evaluatedDefinition(definition,character,affiliation);
      var old=previous&&previous[definition.id];
      var state={id:definition.id,label:definition.label,kind:definition.kind,scope:definition.scope||'character'};
      if(definition.kind==='mode'){
        var selected=old&&old.current;
        state.current=definition.options&&definition.options.indexOf(selected)>=0?selected:initialValue(definition,character,affiliation);
      }else if(definition.kind==='toggle'){
        state.current=old&&typeof old.current==='boolean'?old.current:initialValue(definition,character,affiliation);
      }else if(definition.kind==='counter'||definition.kind==='signed-counter'){
        var initial=initialValue(definition,character,affiliation);
        var current=old&&old.current!=null?old.current:initial;
        state.current=clampNumber(current,evaluated.min,evaluated.max);
      }else{
        state.current=old&&old.current!=null?old.current:null;
      }
      output[definition.id]=state;
    });
    return output;
  }
  function recoveryAmount(rule,maximum){
    if(rule==='max')return Number(maximum||0);
    if(rule&&rule.type==='fractionMax')return Math.max(0,Math.floor(Number(maximum||0)*Number(rule.value||0)));
    return 0;
  }

  Object.keys(db.affiliations).forEach(function(name){
    var affiliation=db.affiliations[name];
    affiliation.resourceSystem={
      primary:primaryFor(name),
      special:specialFor(name)
    };
  });

  db.heroMarks=clone(HERO_MARKS);
  db.version='3e-rules-db-0.29.0';

  global.SemideusesResourceRules={
    version:'3e-resource-rules-1.0.0',
    heroMarks:clone(HERO_MARKS),
    primaryFor:primaryFor,
    specialFor:specialFor,
    affiliationFor:affiliationFor,
    evaluate:evaluate,
    evaluatedDefinition:evaluatedDefinition,
    initialValue:initialValue,
    normalizeSpecial:normalizeSpecial,
    recoveryAmount:recoveryAmount
  };
})(window);
