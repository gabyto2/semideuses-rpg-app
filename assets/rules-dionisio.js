(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Dionísio']={
    id:'dionisio',
    name:'Dionísio',
    title:'O Caos',
    icon:'🍇',
    domain:'Vinho, loucura e êxtase.',
    profile:'Caos: debuff em área e frenesi.',
    mechanicalStatus:'complete',
    casting:'CAR',
    hitDie:6,
    savingThrows:['CON','CAR'],
    skillProficiencies:['Atuação','Enganação','Persuasão'],
    weaponProficiencies:['Armas simples'],
    armorProficiencies:['Armaduras leves'],
    overview:'Caos, debuff em área e frenesi. Os dados de Loucura tornam cada efeito imprevisível dentro de uma faixa conhecida, enquanto as zonas confundem grupos inteiros. Alto risco no detalhe e alta recompensa no total.',
    signature:{
      name:'Delírio',
      summary:'Várias habilidades usam dados de Loucura: parte do efeito é escolhida e parte é rolada em 1d6. Resultado 1 — Confusão: ataca o alvo mais próximo, aliado ou não. 2 — Pânico: fica Apavorado e foge por 1 rodada. 3 — Letargia: perde a ação neste turno. 4 — Euforia: ataca com Vantagem, mas tem Desvantagem em TR até o próximo turno. 5 — Frenesi: faz um ataque extra, mas ataques contra ela têm Vantagem até o próximo turno. 6 — Estupor: fica Atordoada por 1 rodada.',
      madnessTable:[
        {roll:1,name:'Confusão',effect:'A criatura ataca o alvo mais próximo, aliado ou não, neste turno.'},
        {roll:2,name:'Pânico',effect:'A criatura fica Apavorada e foge por 1 rodada.'},
        {roll:3,name:'Letargia',effect:'A criatura perde a ação neste turno.'},
        {roll:4,name:'Euforia',effect:'A criatura ataca com Vantagem, mas tem Desvantagem em TR até o próximo turno.'},
        {roll:5,name:'Frenesi',effect:'A criatura faz um ataque extra, mas ataques contra ela têm Vantagem até o próximo turno.'},
        {roll:6,name:'Estupor',effect:'A criatura fica Atordoada por 1 rodada.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Delírio','Toque Inebriante'],
      2:['Primeiro Gole'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Taça','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Histeria'],
      12:['Habilidade de Caminho'],
      15:['Delírio Coletivo'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Bacanal']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A loucura não o alcança: você é imune a Veneno, nunca rola na Tabela de Loucura, sente as emoções alheias e tem Vantagem nos Testes de Resistência contra efeitos que tentem Encantar, Dominar ou controlar as suas ações.'),
      ability(1,'Toque Inebriante','E',1,'Ação','Um alvo a até 12 m faz TR de SAB. Na falha, fica tonto e recebe Desvantagem na próxima rolagem; depois, role 1 dado de Loucura para ele. À vontade.'),
      ability(2,'Primeiro Gole','Passiva',null,'Escolha após Descanso Longo','Escolha uma taça, podendo trocá-la no Descanso Longo. Riso: quando um inimigo falha em um TR contra você, também recebe Desvantagem no próximo ataque. Coragem: você e aliados a até 6 m ficam imunes a Apavorado; quando um deles resistiria a medo, recebe 1d6 PV Temporários. Esquecimento: uma vez por combate, como Reação, force uma criatura a esquecer o alvo escolhido; ela deve escolher outro alvo legal ou perder a ação, e um TR de SAB evita.'),
      ability(5,'Taça','C',4,'Ação','Um aliado entra em frenesi controlado por 1 rodada: recebe +1d8 de dano nos ataques e movimento extra.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Histeria','B',6,'Ação','Inimigos em uma área de 4,5 m fazem TR de SAB. Na falha, atacam aleatoriamente por 1 rodada.'),
      ability(15,'Delírio Coletivo','A',8,'Ação, concentração por 1 minuto','Por 1 minuto, em um raio de 12 m centrado em você, sempre que uma criatura hostil rolar de 1 a 5 num d20 de ataque, teste ou TR, role imediatamente na Tabela de Loucura para ela. Criaturas hostis também não podem usar Ajudar, bênçãos ou curas entre si dentro da área. Aliados são imunes. Chefes só rolam na tabela com 1 natural.'),
      ability(20,'A Bacanal','Lendário',24,'Ação, 1 minuto','1 uso por dia. Por 1 minuto, toda criatura hostil a até 18 m faz TR de SAB no início do turno: quem falha rola na Tabela de Loucura e não pode conjurar naquele turno; quem passa recebe Desvantagem em ataques. Em qualquer habilidade, você rola 2 dados de Loucura e escolhe o resultado. Aliados a até 18 m ganham 2d6 PV Temporários por rodada e imunidade a Apavorado. Preço: ao terminar, você fica Atordoado por 1 rodada e ganha 1 nível de Exaustão.')
    ],
    paths:[
      {
        id:'loucura',
        name:'Caminho da Loucura',
        summary:'A mente que se parte. Confunde alvos, espalha efeitos de Loucura e faz grupos inteiros agirem ao acaso.',
        status:'complete',
        abilities:[
          ability(3,'Confundir','D',2,'Ação','Um alvo faz TR de SAB. Na falha, ataca a criatura mais próxima, aliada ou não, por 1 rodada.'),
          ability(7,'Contágio do Delírio','B',6,'Ação','Escolha um inimigo sob efeito de Loucura. Ele sofre 2d8 Psíquico e o efeito salta para até 2 inimigos a até 6 m dele; cada novo alvo pode evitar com TR de SAB.'),
          ability(12,'Loucura Coletiva','A',8,'Ação','Até 3 inimigos a até 9 m fazem TR de SAB. Na falha, voltam-se uns contra os outros por 1 rodada.'),
          ability(17,'Colapso Mental','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, todos os inimigos em uma área de 12 m fazem TR de SAB a cada turno. Na falha, agem ao acaso.')
        ]
      },
      {
        id:'vinho',
        name:'Caminho do Vinho',
        summary:'A taça que corrompe. Embriaga, restringe, envenena e aprisiona inimigos num êxtase letal.',
        status:'complete',
        abilities:[
          ability(3,'Embriagar','D',2,'Ação','Um alvo faz TR de CON. Na falha, fica Lento e com Desvantagem por 1 rodada, além de sofrer 1 dado de Loucura no início do próximo turno.'),
          ability(7,'Vinha Selvagem','B',6,'Ação','Vinhas báquicas agarram inimigos em uma área de 4,5 m. Um TR de FOR evita ficar Restrito. Alvos agarrados pelas vinhas fazem TR contra sua Loucura com Desvantagem.'),
          ability(12,'Veneno Báquico','A',8,'Ação, 1 minuto','Cria uma névoa de vinho em uma área de 6 m por 1 minuto. Inimigos que começam o turno nela fazem TR de CON; na falha, ficam Envenenados e sofrem 2d8. Quem termina dois turnos na névoa sofre 1 dado de Loucura.'),
          ability(17,'Festa Fatal','S',12,'Ação, 1 minuto','2 usos por dia. Inimigos em uma área de 9 m fazem TR de CAR. Na falha, ficam presos num êxtase letal por 1 minuto, incapazes de agir enquanto sofrem 3d8 por turno e 1 dado de Loucura por rodada.')
        ]
      },
      {
        id:'extase',
        name:'Caminho do Êxtase',
        summary:'O frenesi que liberta. Concede ataques e movimentos extras aos aliados e transforma a luta numa dança coordenada.',
        status:'complete',
        abilities:[
          ability(3,'Frenesi Báquico','D',2,'Ação','Um aliado entra em frenesi por 1 rodada: faz um ataque adicional no turno, mas recebe Desvantagem em TR mentais. Enquanto houver um inimigo sob efeito da sua Loucura, o frenesi se renova por mais 1 rodada, até 1 minuto. O aliado fica imune aos seus dados de Loucura.'),
          ability(7,'Dança de Guerra','B',6,'Ação','Por 1 rodada, aliados a até 9 m podem mover-se 3 m sem provocar Ataques de Oportunidade e trocar de posição com outro dançarino; quem trocar recebe +1d6 no próximo ataque. Se houver inimigo sob efeito de Loucura, a dança dura mais 1 rodada.'),
          ability(12,'Êxtase Coletivo','A',8,'Ação','Aliados a até 9 m entram em frenesi controlado por 1 rodada, recebendo ataque extra e movimento. Inimigos que errarem um ataque contra um aliado em êxtase fazem o próximo TR contra sua Loucura com Desvantagem.'),
          ability(17,'Bacanal','S',12,'Ação','2 usos por dia. Aliados a até 12 m recebem um turno selvagem extra de ações curtas. Cada inimigo derrubado durante a Bacanal impõe 1 dado de Loucura a um inimigo à sua escolha.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.13.0';
})(window);
