(function(global){
  'use strict';

  var RULES={
    'Abalado':{
      summary:'O personagem sofreu um choque mental ou emocional severo.',
      effects:['Desvantagem em todos os testes de SAB e CAR.','Não pode usar habilidades de Rank S ou SS.'],
      pages:'9'
    },
    'Agarrado':{
      summary:'O personagem está preso por uma criatura ou efeito.',
      effects:['Velocidade reduzida a 0.','Termina se o efeito que a causou for removido ou se o personagem se libertar com um teste de FOR ou DES, com CD definida pelo efeito.'],
      pages:'9'
    },
    'Apavorado':{
      summary:'O personagem está dominado pelo medo.',
      effects:['Desvantagem em testes de atributo e jogadas de ataque enquanto a fonte do medo estiver visível.','Não pode se mover voluntariamente em direção à fonte do medo.'],
      pages:'9'
    },
    'Atordoado':{
      summary:'O personagem está desorientado e incapaz de agir com eficiência.',
      effects:['Não pode realizar ações nem reações.','Não pode se mover.','Falha automaticamente em Testes de Resistência de FOR e DES.','Ataques contra o personagem têm Vantagem.'],
      pages:'9'
    },
    'Caído':{
      summary:'O personagem está no chão.',
      effects:['Ataques corpo a corpo contra o personagem têm Vantagem.','Ataques à distância contra o personagem têm Desvantagem.','O personagem tem Desvantagem em jogadas de ataque.','Levantar custa metade do movimento.'],
      pages:'9'
    },
    'Cego':{
      summary:'O personagem não consegue ver.',
      effects:['Falha automaticamente em qualquer teste que dependa de visão.','Ataques contra o personagem têm Vantagem.','Jogadas de ataque do personagem têm Desvantagem.'],
      pages:'9'
    },
    'Dominado':{
      summary:'O personagem age sob o controle de quem o dominou.',
      effects:['Está Enfeitiçado por quem o dominou; enquanto durar, o dominador pode gastar uma ação para ditar o que ele faz no próximo turno.','A cada vez que sofre dano, faz um novo Teste de Resistência para encerrar a condição.'],
      pages:'9'
    },
    'Enfeitiçado':{
      summary:'O personagem está sob influência mágica ou divina.',
      effects:['Não pode atacar ou prejudicar a criatura que o enfeitiçou.','A criatura que o enfeitiçou tem Vantagem em testes de CAR contra o personagem.'],
      pages:'9'
    },
    'Envenenado':{
      summary:'O personagem está sob efeito de veneno, toxina ou substância nociva.',
      effects:['Desvantagem em jogadas de ataque e testes de atributo.','Perde PV no início de cada turno conforme indicado pelo efeito.'],
      pages:'9–10'
    },
    'Exausto':{
      summary:'O personagem ultrapassou seus limites físicos. A Exaustão possui seis níveis cumulativos.',
      effects:['Nível 1: Desvantagem em testes de atributo.','Nível 2: Velocidade reduzida à metade.','Nível 3: Desvantagem em jogadas de ataque e Testes de Resistência.','Nível 4: PV máximo reduzido à metade.','Nível 5: Velocidade reduzida a 0.','Nível 6: Morte.','Cada Descanso Longo remove 1 nível de Exaustão.'],
      pages:'10'
    },
    'Incapacitado':{
      summary:'O personagem não pode realizar ações nem reações, mas ainda pode se mover e falar.',
      effects:[],
      pages:'10'
    },
    'Inconsciente':{
      summary:'O personagem está inconsciente.',
      effects:['Não pode se mover, falar, realizar ações nem reações.','Falha automaticamente em Testes de Resistência de FOR e DES.','Ataques contra o personagem têm Vantagem.','Qualquer ataque bem-sucedido de um atacante a até 1 m é um acerto crítico.'],
      pages:'10'
    },
    'Invisível':{
      summary:'O personagem não pode ser visto por meios normais.',
      effects:['Ataques contra o personagem têm Desvantagem.','Jogadas de ataque do personagem têm Vantagem.','Ainda pode ser detectado por som, cheiro ou outros sentidos.'],
      pages:'10'
    },
    'Lento':{
      summary:'Os movimentos do personagem ficam pesados e atrasados.',
      effects:['Velocidade reduzida à metade.','−2 na CA e nos Testes de Resistência de DES.','Não pode usar Reações nem realizar mais de uma ação por turno: Ação ou Ação Bônus, não ambas.'],
      pages:'10'
    },
    'Morrendo':{
      summary:'Ao chegar a 0 PV, o personagem fica Inconsciente e começa a fazer Jogadas de Morte.',
      effects:['No início de cada turno, rola 1d20 e soma o Teste de Resistência de CON: 10 ou mais é um sucesso; 9 ou menos é uma falha.','20 natural recupera 1 PV e acorda; 1 natural conta como duas falhas.','Com 3 sucessos fica Estável; com 3 falhas morre.','Sofrer dano a 0 PV causa uma falha de Morte, ou duas se for um acerto crítico.'],
      pages:'7–8'
    },
    'Paralisado':{
      summary:'O personagem está completamente imóvel e sem controle do próprio corpo.',
      effects:['Não pode se mover nem falar.','Falha automaticamente em Testes de Resistência de FOR e DES.','Ataques contra o personagem têm Vantagem.','Qualquer ataque bem-sucedido de um atacante a até 1 m é um acerto crítico.'],
      pages:'10'
    },
    'Petrificado':{
      summary:'O personagem foi transformado em uma substância inerte, como pedra, bronze ou sal.',
      effects:['Incapaz de se mover, falar ou realizar qualquer ação.','Não tem consciência do que acontece ao redor.','Ataques contra o personagem têm Vantagem.','Falha automaticamente em Testes de Resistência de FOR e DES.','Resistência a todos os tipos de dano.','Imune a veneno e doenças; efeitos ativos são suspensos, não curados.'],
      pages:'10'
    },
    'Restrito':{
      summary:'O personagem está preso, enredado ou imobilizado no lugar.',
      effects:['Velocidade reduzida a 0.','Ataques contra o personagem têm Vantagem; as jogadas de ataque do personagem têm Desvantagem.','Desvantagem em Testes de Resistência de DES.'],
      pages:'10'
    },
    'Surdo':{
      summary:'O personagem não consegue ouvir.',
      effects:['Falha automaticamente em qualquer teste que dependa de audição.','Imune a efeitos que exijam que o alvo ouça o ativador.'],
      pages:'10'
    }
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function list(){return Object.keys(RULES);}
  function get(name){return RULES[name]?clone(RULES[name]):null;}

  global.SemideusesConditionRules={
    version:'player-book-3e-pages-7-10',
    source:'Livro do Jogador — Semideuses RPG 3e',
    list:list,
    get:get,
    all:function(){return clone(RULES);}
  };
})(window);
