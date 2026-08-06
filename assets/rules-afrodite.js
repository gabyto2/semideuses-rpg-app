(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Afrodite']={
    id:'afrodite',
    name:'Afrodite',
    title:'O Controle do Coração',
    icon:'♀',
    domain:'Amor, beleza e manipulação.',
    profile:'Controlador social.',
    mechanicalStatus:'complete',
    casting:'CAR',
    hitDie:6,
    savingThrows:['SAB','CAR'],
    skillProficiencies:['Persuasão','Enganação','Intuição'],
    weaponProficiencies:['Armas simples'],
    armorProficiencies:['Armaduras leves'],
    overview:'Controlador social. As fichas de Encanto viram alvos que não conseguem atacar você, aliados inesperados e conversas ganhas antes de começarem. Em combate, você não mata: desmonta o inimigo pela vontade dele.',
    signature:{
      name:'Encanto',
      summary:'Você possui fichas de Encanto iguais ao seu modificador de Conjuração. Elas enchem a cada combate e você ganha +1 sempre que um inimigo falha em um Teste de Resistência contra você. Encanto impõe charme, medo e distração e, sobretudo, redireciona quem o inimigo ataca.',
      maxFormula:'Modificador de Conjuração',
      universalCosts:[
        {cost:1,effect:'Redirecionar: o próximo ataque de um inimigo a até 12 m passa a atingir outro inimigo à sua escolha; TR de SAB nega.'},
        {cost:1,effect:'Deslumbrar: um inimigo a até 12 m recebe Desvantagem no próximo ataque.'},
        {cost:2,effect:'Ordem Sussurrada: um inimigo já Enfeitiçado por você gasta a ação dele cumprindo uma ordem simples e não suicida.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Encanto','Olhar'],
      2:['Primeiro Olhar'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Sussurro','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Fascínio'],
      12:['Habilidade de Caminho'],
      15:['Coração Coletivo'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Deusa Desce']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','Os corações se abrem para você: possui Vantagem em testes sociais e, uma vez por cena, pode fazer um alvo que o enxergue realizar TR de SAB; na falha, ele fica Enfeitiçado por 1 minuto, sem custo.'),
      ability(1,'Olhar','E',1,'Ação','Um alvo a até 12 m faz TR de SAB. Na falha, recebe Desvantagem em ataques contra outras criaturas, pois só consegue se concentrar em você, por 1 rodada. Gera 1 Encanto. À vontade.'),
      ability(2,'Primeiro Olhar','Passiva',null,'Passiva','Na primeira rodada de cada combate, um inimigo à sua escolha a até 18 m tem Desvantagem em ataques contra você e você ganha 1 Encanto. Fora de combate, ao conhecer alguém, sabe qual dos três a pessoa mais quer de você — aprovação, prazer ou proteção — e recebe Vantagem no primeiro teste social que use isso.'),
      ability(5,'Sussurro','C',4,'Ação','Redirecione o próximo ataque de um inimigo a até 12 m para outro inimigo à sua escolha. Um TR de SAB evita o redirecionamento.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Fascínio','B',6,'Ação','Inimigos em uma área de 6 m fazem TR de SAB. Na falha, hesitam e recebem Desvantagem em ataques por 1 rodada.'),
      ability(15,'Coração Coletivo','A',8,'Ação, concentração por 1 minuto','Por 1 minuto, em um raio de 18 m, sempre que uma criatura causa dano a outra, também sofre 1d10 Psíquico, sem TR. Você e aliados designados, até seu modificador de Conjuração, são imunes. Gaste 2 Encantos para que a regra também seja acionada por criaturas que apenas se movem para atacar. Criaturas com INT 4 ou menos ignoram a regra.'),
      ability(20,'A Deusa Desce','Lendário',24,'Ação, 1 minuto','1 uso por dia. Por 1 minuto, toda criatura que começar o turno vendo você faz TR de SAB e repete no fim de cada turno; na falha, fica Encantada por você, não pode atacar você nem seus aliados e obedece a ordens que não a machuquem. Chefes e criaturas com resistência lendária fazem o TR com Vantagem e, mesmo passando, têm Desvantagem em ataques contra você. Você ganha Encanto igual ao número de criaturas Encantadas. Preço: ao terminar, todos sabem exatamente o que você fez, e você fica com Desvantagem em testes sociais contra eles pelo resto da campanha.')
    ],
    paths:[
      {
        id:'encanto',
        name:'Caminho do Encanto',
        summary:'A voz que não se recusa. Enfeitiça, ordena e domina vontades, transformando inimigos em peças do seu lado.',
        status:'complete',
        abilities:[
          ability(3,'Enfeitiçar','D',2,'Ação','Um alvo faz TR de CAR. Na falha, fica Enfeitiçado por você por 1 minuto. Gaste 2 Encantos para que o TR seja feito com Desvantagem.'),
          ability(7,'Comando Enfeitiçado','B',6,'Ação','Um alvo já Enfeitiçado por você obedece a uma ordem simples que não seja claramente suicida. Gaste 1 Encanto para dar uma segunda ordem simples.'),
          ability(12,'Domínio','A',8,'Ação','Um alvo faz TR de CAR. Na falha, tem suas ações controladas por você e fica Dominado por 1 minuto. Gaste 2 Encantos para prolongar o domínio em 1 rodada.'),
          ability(17,'Coração do Olimpo','S',12,'Ação','2 usos por dia. Todos os inimigos em uma área de 9 m fazem TR de CAR. Na falha, ficam Enfeitiçados por 1 minuto e não conseguem atacar seus aliados. Gaste 3 Encantos para que os testes sejam feitos com Desvantagem.')
        ]
      },
      {
        id:'beleza',
        name:'Caminho da Beleza',
        summary:'O fascínio que desarma. Retira reações, redireciona golpes e paralisa a cena pelo deslumbre.',
        status:'complete',
        abilities:[
          ability(3,'Distrair','D',2,'Ação','Um alvo faz TR de SAB. Na falha, perde a Reação e recebe Desvantagem em ataques por 1 rodada. Gaste 1 Encanto para distrair um segundo alvo.'),
          ability(7,'Deslumbre Traiçoeiro','B',6,'Ação','Um alvo faz TR de CAR. Na falha, você redireciona o próximo ataque que ele realizar antes do fim do próximo turno para outra criatura ao alcance dele. Gaste 1 Encanto para também redirecionar o segundo ataque.'),
          ability(12,'Aura','A',8,'Ação, 1 minuto','Por 1 minuto, inimigos que começam o turno a até 6 m de você fazem TR de CAR. Na falha, baixam a guarda e recebem Desvantagem em ataques. Gaste 1 Encanto no início do seu turno para ampliar a aura para 9 m até o próximo turno.'),
          ability(17,'Visão Divina','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, qualquer inimigo que olhar para você faz TR de CAR. Na falha, fica Atordoado pelo deslumbre por 1 rodada. Ao ativar, você ganha 3 Encantos.')
        ]
      },
      {
        id:'amor',
        name:'Caminho do Amor',
        summary:'O vínculo que protege. Divide danos, pune agressores, protege contra controle e impede uma queda fatal.',
        status:'complete',
        abilities:[
          ability(3,'Vínculo Protetor','D',2,'Ação','Ligue dois aliados por 1 minuto. Cada um pode redirecionar para o outro metade do dano que sofreria. Gaste 1 Encanto para que o redirecionamento também reduza o dano em 1d6.'),
          ability(7,'Vínculo Ciumento','B',6,'Ação','Ligue um inimigo a um aliado por 1 minuto; TR de CAR anula. Um quarto do dano sofrido pelo aliado é refletido no inimigo, que também recebe Desvantagem em ataques contra qualquer outro alvo. Gaste 1 Encanto para que o reflexo suba para metade.'),
          ability(12,'Devoção','A',8,'Ação, 1 minuto','Por 1 minuto, aliados a até 9 m ficam imunes às condições Enfeitiçado e Apavorado. Gaste 1 Encanto para que a proteção também cubra Abalado.'),
          ability(17,'Laço Eterno','S',12,'Ação','1 uso por dia. Proteja um aliado com um laço: na próxima vez em que ele cairia a 0 PV, permanece com metade dos PV e fica livre de condições. Gaste 2 Encantos ao ativar para também remover imediatamente todas as condições atuais do aliado.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.12.0';
})(window);
