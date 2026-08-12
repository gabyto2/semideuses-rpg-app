(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Ares']={
    id:'ares',
    name:'Ares',
    title:'O Duelista Bruto',
    icon:'🪖',
    domain:'Guerra e violência.',
    profile:'Duelista bruto e resistente.',
    mechanicalStatus:'complete',
    casting:'FOR',
    hitDie:12,
    savingThrows:['FOR','CON'],
    skillProficiencies:['Atletismo','Intimidação','Sobrevivência'],
    weaponProficiencies:['Armas simples','Armas marciais'],
    armorProficiencies:['Armaduras pesadas','Armaduras médias','Armaduras leves','Escudos'],
    overview:'Duelista bruto e resistente. A Fúria sobe quando você apanha e desce quando você descarrega. O conjunto de poderes premia entrar na frente, permanecer de pé e converter violência recebida em pressão ofensiva.',
    signature:{
      name:'Fúria',
      summary:'Você possui um medidor de Fúria de 0 a 10. Ganha 1 quando sofre dano e 2 quando causa um crítico ou derruba um inimigo. Começa cada combate com Fúria igual à quantidade de PV que já perdeu. No seu turno ou como Reação, pode gastar no máximo uma opção por gatilho.',
      max:10,
      universalCosts:[
        {cost:2,effect:'Golpe Furioso: um ataque seu que acabou de acertar causa +1d8 de dano.'},
        {cost:3,effect:'Couro de Guerra: como Reação, reduza o dano de um golpe sofrido em 2d8.'},
        {cost:2,effect:'Rugido de Ares: um inimigo a até 9 m faz TR de CAR ou fica Abalado por 1 rodada.'},
        {cost:5,effect:'Sede de Batalha: faça imediatamente um ataque com arma adicional.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Fúria','Talho Brutal'],
      2:['Cheiro de Sangue'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Investida Sangrenta','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Pele de Guerra'],
      12:['Habilidade de Caminho'],
      15:['Sangue no Chão'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Grito de Guerra']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','Você empunha qualquer arma como se tivesse nascido com ela e luta com fúria controlada: pode atacar com Vantagem ao custo de conceder Vantagem aos ataques contra você até o seu próximo turno.'),
      ability(1,'Talho Brutal','E',1,'Parte de um ataque','Ao acertar um ataque corpo a corpo, gaste 1 MP para causar +2d6 de dano e ganhar 1 de Fúria. À vontade. O bônus sobe para +3d6 no nível 5, +4d6 no nível 11 e +5d6 no nível 17.'),
      ability(2,'Cheiro de Sangue','E',1,'Ação Bônus','Gaste até 3 de Fúria. Para cada ponto gasto, ganhe 5 PV Temporários e +1,5 m de deslocamento até o fim do turno. Se gastar 3, seu próximo ataque nesta rodada ignora cobertura e resistência a dano físico.'),
      ability(5,'Investida Sangrenta','C',4,'Ação','Mova-se até a sua velocidade e faça um ataque. Você pode gastar até 3 de Fúria para causar +1d8 de dano por ponto gasto.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Pele de Guerra','B',6,'Reação','Ao sofrer dano, reduza-o à metade por 1 rodada. Em vez de pagar MP, você pode gastar 4 de Fúria.'),
      ability(15,'Sangue no Chão','A',8,'Ação','Mova-se até o dobro do seu deslocamento em linha e faça um ataque com arma contra cada criatura que passar a até 1,5 m, máximo 6. Você tem Vantagem contra alvos abaixo da metade dos PV. Cada acerto causa +2d8 e rende 1 de Fúria. Se derrubar pelo menos 2 inimigos, todo inimigo a até 9 m faz TR de SAB ou fica Apavorado por 1 rodada.'),
      ability(20,'O Grito de Guerra','Lendário',24,'Ação','Recarrega quando você cai abaixo da metade dos PV, no máximo uma vez por combate. Todo inimigo a até 18 m faz TR de SAB: na falha, fica Apavorado por 1 minuto e perde a Reação enquanto estiver Apavorado; no sucesso, tem Desvantagem em ataques contra você por 1 rodada. Sua Fúria vai a 10 e, até o fim do combate, você ganha 2 de Fúria por rodada em vez de 1 e não pode ficar Apavorado nem Encantado. Preço: enquanto durar, você não pode se afastar voluntariamente de um inimigo visível.')
    ],
    paths:[
      {
        id:'furia',
        name:'Caminho da Fúria',
        summary:'A tempestade de violência. Multiplica ataques, abandona a defesa e transforma Fúria em pressão ofensiva contínua.',
        status:'complete',
        abilities:[
          ability(3,'Golpe Frenético','D',2,'Ação','Faça um ataque adicional neste turno. Gaste 3 de Fúria para que ele não consuma a Ação.'),
          ability(7,'Frenesi','B',6,'Ação, 1 minuto','Por 1 minuto, faça um ataque extra por turno, mas os ataques contra você têm Vantagem. Enquanto estiver em Frenesi, gere +1 de Fúria adicional sempre que acertar.'),
          ability(12,'Massacre','A',8,'Ação','Faça um ataque que atinge todos os inimigos adjacentes. Gaste 3 de Fúria para causar +1d8 de dano contra cada alvo atingido.'),
          ability(17,'Avatar da Guerra','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, faça dois ataques extras por turno, fique imune a medo e charme e, na primeira vez que cairia a 0 PV, permaneça com 1 PV. Ao ativar, sua Fúria vai diretamente a 10.')
        ]
      },
      {
        id:'tirano',
        name:'Caminho do Tirano',
        summary:'Domínio pelo medo. Espalha pavor, prejudica ataques inimigos e transforma execuções em controle de campo.',
        status:'complete',
        abilities:[
          ability(3,'Brado','D',2,'Ação','Cone de 9 m: inimigos fazem TR de CAR ou ficam Apavorados por 1 rodada. Gaste 3 de Fúria para aumentar o cone para 12 m.'),
          ability(7,'Presença Aterradora','B',6,'Ação Bônus, 1 minuto','Inimigos que começam o turno a até 6 m de você fazem TR de CAR ou recebem Desvantagem em ataques. Quando um inimigo passar no TR, gaste 2 de Fúria para fazê-lo repetir o teste.'),
          ability(12,'Execução Pública','A',8,'Ação','Realize um golpe pesado que causa +4d8 contra um alvo abaixo da metade dos PV. Se ele cair, inimigos a até 9 m ficam Apavorados por 1 minuto. Se o golpe derrubar o alvo, ganhe 4 de Fúria.'),
          ability(17,'Senhor do Pavor','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, todos os inimigos que enxergam você fazem TR de CAR a cada turno ou ficam Apavorados; quem já estiver Apavorado tem Desvantagem em tudo. Gaste 5 de Fúria ao ativar para impor Desvantagem no primeiro TR de cada inimigo.')
        ]
      },
      {
        id:'veterano',
        name:'Caminho do Veterano',
        summary:'A casca que não quebra. Absorve golpes, força inimigos a enfrentá-lo e protege a linha de frente.',
        status:'complete',
        abilities:[
          ability(3,'Aguentar','D',2,'Reação','Ao ser atingido, reduza o dano em 2d8 e faça um contra-ataque imediato. Se sua Fúria for 5 ou mais, o contra-ataque causa +1d8.'),
          ability(7,'Provocar','B',6,'Ação','Inimigos a até 9 m fazem TR de SAB ou são obrigados a atacar você no próximo turno. Enquanto estiverem provocados, você possui resistência ao dano deles. Ganhe 1 de Fúria por inimigo que falhar no TR.'),
          ability(12,'Inquebrável','A',null,'Passiva','Na primeira vez em cada combate que cairia a 0 PV, permaneça com PV iguais ao seu nível. Quando isso acontecer, sua Fúria vai diretamente a 10.'),
          ability(17,'Muralha de Ares','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, você não pode ser movido contra a vontade, possui resistência a todo dano e qualquer aliado a até 3 m também recebe metade do dano reduzido. Enquanto a Muralha durar, ataques sofridos geram 2 de Fúria em vez de 1.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.8.0';
})(window);
