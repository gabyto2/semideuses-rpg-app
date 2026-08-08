(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Hécate']={
    id:'hecate',
    name:'Hécate',
    title:'A Conjuradora Flexível',
    icon:'☾☽☾',
    domain:'Magia, Névoa e encruzilhadas.',
    profile:'Conjuradora flexível.',
    mechanicalStatus:'complete',
    casting:'INT',
    hitDie:6,
    savingThrows:['INT','SAB'],
    skillProficiencies:['Saber Mítico','Religião / Panteão','Investigação'],
    weaponProficiencies:['Armas simples'],
    armorProficiencies:['Armaduras leves'],
    overview:'Conjuradora flexível. Os Pontos de Feitiço são um segundo recurso distribuído entre potência, alcance, duração e alvos extras, permitindo adaptar a mesma habilidade a situações diferentes. É a Filiação que responde a qualquer problema, sem ser a melhor em nenhum.',
    signature:{
      name:'Pontos de Feitiço',
      summary:'Você possui um pool de Pontos de Feitiço igual ao seu modificador de Conjuração e o recupera no Descanso. Antes de conjurar uma habilidade, pode gastar pontos para moldar a magia.',
      maxFormula:'Modificador de Conjuração',
      universalCosts:[
        {cost:1,effect:'Alvo adicional: acrescente +1 alvo à habilidade.'},
        {cost:1,effect:'Área ampliada: aumente a área da habilidade em +3 m.'},
        {cost:1,effect:'Duração dobrada: dobre a duração da habilidade.'},
        {cost:1,effect:'Transmutação: troque o tipo de dano causado pela habilidade.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Pontos de Feitiço','Lampejo Arcano'],
      2:['Mão na Encruzilhada'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Passo da Névoa','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Tecelã'],
      12:['Habilidade de Caminho'],
      15:['Tríplice Presença'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Chave de Todas as Portas']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A Névoa é sua tinta: você a manipula com Vantagem, conhece uma Skill adicional de qualquer fonte e pode conjurar à vontade uma ilusão menor de luz, som ou imagem imóvel.'),
      ability(1,'Lampejo Arcano','E',1,'Ação','Um dardo de poder acerta um alvo a até 18 m e causa 1d10 Místico. A habilidade aceita Pontos de Feitiço. À vontade. O dano aumenta em +1d10 nos níveis 5, 11 e 17.'),
      ability(2,'Mão na Encruzilhada','E',1,'Ritual de 10 minutos','Fora de combate, realize um ritual e escolha um efeito. Bússola: descubra qual caminho leva ao que procura; o Mestre responde “mais perto”, “mais longe” ou “guardado”. Selo: marque uma porta, baú ou trecho de 3 m e saiba se alguém passou ali e quem, nas últimas 24 horas. Empréstimo: recupere 1 Ponto de Feitiço gasto ou empreste 1 a um aliado conjurador até o próximo Descanso. Você mantém 1 ritual ativo por vez, mais 1 no nível 10.'),
      ability(5,'Passo da Névoa','C',4,'Ação Bônus','Teleporte-se até 9 m por uma fenda na Névoa e receba Camuflagem até o fim do próximo turno.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Tecelã','B',null,'Passiva','Sempre que conjura uma habilidade, você recupera 1 Ponto de Feitiço. Uma vez por cena, uma magia sua não consome o Ponto de Feitiço que gastaria.'),
      ability(15,'Tríplice Presença','A',8,'Ação, 1 minuto','Três imagens suas surgem em espaços livres a até 12 m e agem por 1 minuto, cada uma na própria Iniciativa, sem gastar sua Ação. Cada imagem possui CA igual à sua, 1 PV e desaparece ao sofrer dano. No turno dela, pode conjurar uma habilidade sua de Rank D ou inferior, pagando seu MP, ou mover-se 9 m. Enquanto ao menos duas permanecerem, você gasta 1 Ponto de Feitiço a menos para moldar magias, mínimo 0, e criaturas têm Desvantagem em ataques contra você.'),
      ability(20,'A Chave de Todas as Portas','Lendário',24,'Ação','1 uso por arco. Abra uma porta entre o local atual e outro e declare ao Mestre o que deseja, escolhendo o preço antes de conhecer o resultado. A porta pode transportar o grupo para qualquer lugar que você já tenha visto, mesmo em outro plano; trancar por 1 hora uma criatura Enorme ou menor, com TR de CAR para evitar e Vantagem para chefes; ou trazer de volta, inteiro, um aliado morto há menos de 1 dia. Escolha um preço: perder todos os Pontos de Feitiço até o próximo Descanso Longo; ganhar 2 níveis de Exaustão; ou deixar a porta aberta para que algo decidido pelo Mestre atravesse e se torne um problema da campanha.')
    ],
    paths:[
      {
        id:'feiticaria',
        name:'Caminho da Feitiçaria',
        summary:'Dano e controle arcano. Molda rajadas, dobra vontades, desaparece na Névoa e abre portais para transporte ou banimento.',
        status:'complete',
        abilities:[
          ability(3,'Rajada Arcana','D',2,'Ação','Um alvo a até 18 m sofre 3d8 Místico, com TR de DES para metade. Cada Ponto de Feitiço gasto acrescenta +1 alvo ou +1d8 de dano.'),
          ability(7,'Enfeitiçar','B',6,'Ação','Um alvo a até 12 m faz TR de SAB. Na falha, fica Enfeitiçado por 1 minuto e repete o teste sempre que sofrer dano.'),
          ability(12,'Manto da Névoa','A',8,'Ação Bônus, 1 minuto','Fique Invisível e ignore terreno difícil por 1 minuto ou até atacar. Ao reaparecer, libere uma onda que causa 4d8 Místico em uma área de 3 m.'),
          ability(17,'Encruzilhada','S',12,'Ação','2 usos por dia. Abra três portais. Eles podem transportar um grupo de até 8 criaturas por até 1 km até um lugar que você já tenha visto, ou banir um alvo para um vão da Névoa por 1 minuto; um TR de CAR evita o banimento.')
        ]
      },
      {
        id:'necromancia',
        name:'Caminho da Necromancia',
        summary:'Espíritos e maldições. Invoca servos sombrios, corrói a sorte, cobre o campo com um véu espectral e manifesta as três faces de Hécate.',
        status:'complete',
        abilities:[
          ability(3,'Servo Espectral','C',4,'Ação','Invoque um cão das sombras com ND aproximado a um quarto do seu nível, que obedece a você até o fim do combate. Gaste 1 Ponto de Feitiço para que ele surja com PV extras iguais ao seu nível. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(7,'Maldição da Bruxa','B',6,'Ação','Um alvo faz TR de SAB. Na falha, recebe Desvantagem em ataques e Testes de Resistência por 1 minuto e sofre 1d8 Místico por turno. Gaste 1 Ponto de Feitiço para prolongar a maldição em 1 rodada.'),
          ability(12,'Véu dos Mortos','A',8,'Ação, 1 minuto','Crie uma névoa fantasmagórica de 6 m por 1 minuto. Inimigos dentro dela recebem Desvantagem; você e seus aliados recebem Camuflagem. Gaste 1 Ponto de Feitiço para ampliar a área para 9 m.'),
          ability(17,'Noite Tríplice','S',12,'Ação, 1 minuto','2 usos por dia. Durante 1 minuto, escolha a cada turno uma das três faces: causar 6d8 Místico em uma linha; cegar criaturas em uma área de 6 m; ou comandar mortos-vivos à vista, com TR de SAB para resistir. Gaste 2 Pontos de Feitiço ao ativar para escolher duas faces na primeira rodada.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.15.0';
})(window);
