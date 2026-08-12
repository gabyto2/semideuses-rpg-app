(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Nêmesis']={
    id:'nemesis',
    name:'Nêmesis',
    title:'A Vingança como Recurso',
    icon:'⚖',
    domain:'Vingança, equilíbrio e retribuição.',
    profile:'Vingadora de atrito.',
    mechanicalStatus:'complete',
    casting:'SAB',
    hitDie:8,
    savingThrows:['SAB','CAR'],
    skillProficiencies:['Intuição','Intimidação','Investigação'],
    weaponProficiencies:['Armas simples','Armas marciais'],
    armorProficiencies:['Armaduras médias','Armaduras leves'],
    overview:'Vingadora de atrito. Cada dano recebido vira Dívida, e Dívida vira punição dirigida a quem feriu você ou seus aliados. Quanto pior a luta fica para o grupo, mais perigosa Nêmesis se torna para quem começou.',
    signature:{
      name:'Dívida',
      summary:'Você ganha 1 ficha de Dívida quando sofre dano de um inimigo, é alvo de um acerto crítico ou um aliado cai a 0 PV. O máximo é 5 e todas as fichas desaparecem no fim do combate. Dívida amplifica a retribuição.',
      max:5,
      universalCosts:[
        {cost:1,effect:'Retribuição ampliada: acrescente +1d8 ao dano de uma habilidade ou ataque de vingança.'},
        {cost:1,effect:'Cobrança insistente: force um inimigo a repetir um Teste de Resistência.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Dívida','Marca do Equilíbrio'],
      2:['Memória do Golpe'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Golpe Justo','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Cobrança'],
      12:['Habilidade de Caminho'],
      15:['Cobrança em Dobro'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Acerto de Contas']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A balança cobra: quando uma criatura acerta um crítico contra você ou reduz você a menos da metade dos PV, ela fica marcada. Seu próximo ataque contra essa criatura tem Vantagem e causa +1d8 de dano.'),
      ability(1,'Marca do Equilíbrio','E',1,'Ação Bônus','Marque uma criatura a até 18 m por 1 minuto. Você gera Dívida quando é ferido por ela. À vontade, mantendo apenas uma marca por vez.'),
      ability(2,'Memória do Golpe','E',1,'Reação','Uma vez por rodada, quando um inimigo causa dano a você ou a um aliado a até 9 m, ganhe 1 ficha de Dívida e marque o agressor por 1 minuto. Seu próximo ataque contra um alvo marcado causa +1d8, e você sabe se os PV dele estão cheios, feridos ou quase chegando a 0.'),
      ability(5,'Golpe Justo','C',4,'Ação','Realize um ataque que causa +1d8 de dano por ficha de Dívida gasta, até o máximo de 3 fichas.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Cobrança','B',6,'Reação','Quando sofrer dano de um ataque, reflita metade do dano recebido de volta ao atacante como dano Psíquico.'),
      ability(15,'Cobrança em Dobro','A',8,'Reação','Uma vez por rodada, quando um inimigo a até 18 m causa dano a você ou a um aliado, gaste 3 fichas de Dívida para devolver ao agressor o mesmo dano em Psíquico, sem Teste de Resistência, ignorando resistência e com máximo de 60. Se o dano tiver derrubado um aliado a 0 PV, o retorno é dobrado e o agressor faz TR de CON; na falha, fica Atordoado por 1 rodada.'),
      ability(20,'O Acerto de Contas','Lendário',24,'Reação','Recarrega quando um aliado cai a 0 PV, no máximo uma vez por combate. Quando uma criatura a até 30 m causa dano, some todo o dano que ela causou a você e seus aliados no combate. Ela sofre metade desse total como Psíquico, sem TR e ignorando resistência, fica Atordoada por 1 rodada — TR de CON evita apenas o Atordoado — e não pode recuperar PV até o fim do combate. Contra chefes, o dano é reduzido a um terço. Preço: você perde toda a Dívida e não pode gerar novas fichas pelo resto do combate.')
    ],
    paths:[
      {
        id:'retribuicao',
        name:'Caminho da Retribuição',
        summary:'Devolver com juros. Transforma os próprios ferimentos em dano, reflete ataques e força o agressor a sofrer as consequências de cada golpe.',
        status:'complete',
        abilities:[
          ability(3,'Golpe Equânime','D',2,'Ação','Realize um ataque que causa +1d8 por cada 25% dos seus PV já perdidos, até o máximo de +3d8. Gaste 1 ficha de Dívida para acrescentar +1d8.'),
          ability(7,'Espelho da Culpa','B',6,'Reação','Reflita todo o dano de um ataque sofrido de volta ao atacante. Um TR de CAR reduz o dano refletido à metade. Gaste 1 ficha de Dívida para que o atacante também fique Abalado por 1 rodada.'),
          ability(12,'Veredito','A',8,'Ação, 1 minuto','Um alvo faz TR de CAR. Na falha, por 1 minuto, sempre que causar dano sofre metade desse valor como Psíquico de retorno. Gaste 1 ficha de Dívida para que o teste seja feito com Desvantagem.'),
          ability(17,'Acerto de Contas','S',12,'Ação','2 usos por dia. Um alvo sofre dano igual à diferença entre o maior e o menor PV atual entre os dois grupos, até o máximo de 80; TR de CON reduz à metade. Você pode consumir também suas fichas de Dívida para acrescentar +1d8 por ficha.')
        ]
      },
      {
        id:'perseguicao',
        name:'Caminho da Perseguição',
        summary:'A dívida que persegue. Marca um devedor, reduz suas defesas conforme a conta cresce e impede que ele fuja da cobrança final.',
        status:'complete',
        abilities:[
          ability(3,'Marca do Devedor','D',2,'Ação Bônus','Marque um inimigo. Enquanto ele estiver marcado, cada ficha de Dívida que você ganhar impõe -1 na CA dele, até o máximo de -3. Gaste 2 fichas de Dívida para se teleportar para junto do alvo.'),
          ability(7,'Cadeia da Culpa','B',6,'Reação','Quando o inimigo marcado ferir alguém, gaste 1 ficha de Dívida para que ele sofra o mesmo dano de volta.'),
          ability(12,'Sentença Inescapável','A',8,'Ação','Gaste qualquer quantidade de fichas de Dívida. O inimigo marcado faz TR de SAB com penalidade de -1 por ficha gasta. Na falha, fica Restrito e sofre 6d8 Psíquico.'),
          ability(17,'Juízo Final','S',12,'Ação','2 usos por dia. Consuma toda a sua Dívida. O alvo marcado sofre 3d8 de dano por ficha consumida. Se estiver abaixo da metade dos PV, faz TR de CON; na falha, fica Caído e Atordoado por 1 rodada.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.17.0';
})(window);
