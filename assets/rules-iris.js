(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Íris']={
    id:'iris',
    name:'Íris',
    title:'O Suporte que Muda de Cor',
    icon:'🌈',
    domain:'Luz, arco-íris e mensagens.',
    profile:'Suporte modal de luz.',
    mechanicalStatus:'complete',
    casting:'CAR',
    hitDie:6,
    savingThrows:['DES','CAR'],
    skillProficiencies:['Persuasão','Percepção','Atuação'],
    weaponProficiencies:['Armas simples'],
    armorProficiencies:['Armaduras leves'],
    overview:'Suporte modal de luz. No início de cada turno, você sintoniza um Espectro voltado a cura, dano ou mobilidade e escudo. As mesmas habilidades mudam de função conforme a cor escolhida, permitindo trocar de papel a cada rodada sem custo.',
    signature:{
      name:'Espectro',
      summary:'No início de cada turno, sem custo, você sintoniza uma cor que modifica suas habilidades. Dourado favorece cura; Vermelho favorece dano e cegueira; Azul favorece mobilidade e escudos de luz.',
      modes:[
        {name:'Dourado',effect:'Cura e sustentação.'},
        {name:'Vermelho',effect:'Dano Radiante e efeitos de cegueira.'},
        {name:'Azul',effect:'Mobilidade, empurrões e escudos de luz.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Espectro','Fagulha de Luz'],
      2:['Prisma Interior'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Refração','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Prisma'],
      12:['Habilidade de Caminho'],
      15:['Espectro Duplo'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Ponte de Todas as Cores']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A luz não tem segredos para você: pode enviar uma Mensagem-Íris à vontade, enxerga através de ilusões e nunca se perde à luz do dia.'),
      ability(1,'Fagulha de Luz','E',1,'Ação','Escolha um alvo a até 18 m. Dourado: cure um aliado em 1d10 PV. Vermelho: cause 1d10 e o alvo faz TR de CON; na falha, fica Cego até o fim do próximo turno. Azul: empurre o alvo ou deslize você ou um aliado em 3 m. À vontade. O dado sobe para 2d10 no nível 5, 3d10 no nível 11 e 4d10 no nível 17, tanto no dano quanto na cura.'),
      ability(2,'Prisma Interior','E',1,'Ritual de 1 minuto','Abra uma Mensagem-Íris para qualquer criatura que você conheça pelo nome e já tenha visto. Vocês se veem e conversam por até 10 minutos, independentemente da distância. Entre planos, exige uma fonte de água e luz dos dois lados. Além disso, você pode trocar a cor sintonizada como parte de qualquer movimento, não apenas no início do turno.'),
      ability(5,'Refração','C',4,'Reação','Quando um aliado a até 9 m for alvo de um ataque, imponha Desvantagem ao ataque. Dourado: o aliado também recupera 1d8 PV. Vermelho: o atacante sofre 2d6 Radiante. Azul: o aliado desliza 3 m sem provocar Ataques de Oportunidade.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Prisma','B',6,'Ação','Divida um feixe de luz para atingir ou curar dois alvos a até 18 m, causando ou restaurando 2d8 em cada um conforme o Espectro sintonizado.'),
      ability(15,'Espectro Duplo','A',8,'Ação Bônus, 1 minuto','Por 1 minuto, mantenha duas cores sintonizadas ao mesmo tempo e aplique as cláusulas das duas em todas as habilidades. Uma vez por turno, ao conjurar, dispare também o efeito menor da terceira cor: 1d8 de cura, 1d8 Radiante ou 3 m de deslocamento para um aliado. Ao terminar, escolha uma cor; ela permanece sintonizada e não pode ser trocada até o fim do combate.'),
      ability(20,'A Ponte de Todas as Cores','Lendário',24,'Ação, 1 minuto','1 uso por dia. Crie uma ponte de luz de 6 m de largura e até 300 m de comprimento por 1 minuto. Você e seus aliados andam sobre ela com o dobro do deslocamento, atravessam qualquer terreno e podem entrar ou sair de qualquer ponto da ponte, teleportando-se até 30 m ao longo dela uma vez por turno. Inimigos não podem pisar nela. Enquanto durar, você mantém as três cores sintonizadas, e aliados sobre a ponte recuperam 2d8 PV por rodada e não podem ficar Cegos nem Apavorados. Preço: ao terminar, você fica sem cor sintonizada e não pode sintonizar por 1 hora.')
    ],
    paths:[
      {
        id:'espectro',
        name:'Caminho do Espectro',
        summary:'Luz modal. Potencializa diretamente os efeitos das três cores para causar dano, curar, proteger e controlar o campo.',
        status:'complete',
        abilities:[
          ability(3,'Lança Prismática','D',2,'Ação','Dispare um raio a até 18 m que causa 3d8 Radiante. No Espectro Vermelho, causa +1d8 e o alvo faz TR de CON; na falha, fica Cego até o fim do próximo turno.'),
          ability(7,'Bênção Iridescente','B',6,'Ação Bônus','Um aliado a até 12 m recupera 3d8 PV e recebe Vantagem no próximo ataque ou teste. Dourado: a cura sobe para 4d8. Vermelho: o próximo ataque causa +2d6 Radiante. Azul: o aliado ganha 3 m de deslocamento e não pode ser Agarrado até o fim do próximo turno.'),
          ability(12,'Clarão','A',8,'Ação','Cone de 9 m que causa 5d8 Radiante; criaturas atingidas fazem TR de CON ou ficam Cegas por 1 minuto, repetindo o teste no fim de cada turno. Dourado: aliados no cone recuperam 3d8 em vez de sofrer dano. Vermelho: o dano sobe para 6d8. Azul: quem falha também é empurrado 6 m.'),
          ability(17,'Ponte do Arco-Íris','S',12,'Ação, 1 minuto','2 usos por dia. Ative os três Espectros ao mesmo tempo por 1 minuto, reunindo cura, escudo de luz e dano Radiante numa ponte sólida que apenas aliados podem atravessar.')
        ]
      },
      {
        id:'mensageira',
        name:'Caminho da Mensageira',
        summary:'Elo e luz que viaja. Conecta aliados, entrega bênçãos à distância e cria rotas de arco-íris para mobilidade e suporte coletivo.',
        status:'complete',
        abilities:[
          ability(3,'Íris-Elo','D',2,'Ação Bônus, 1 minuto','Ligue-se a um aliado a até 18 m por 1 minuto. Você pode trocar de lugar com ele como parte do seu movimento, e ele compartilha a cor do seu Espectro atual.'),
          ability(7,'Entrega Radiante','B',6,'Ação','Envie um pulso a um aliado a até 30 m. Dourado: ele recupera 3d8 PV. Azul: recebe +2 de CA por 1 rodada. Vermelho: o próximo ataque dele causa +2d8.'),
          ability(12,'Arco de Passagem','A',8,'Ação, 1 minuto','Crie um arco de luz de 18 m por 1 minuto. Aliados podem atravessá-lo como parte do movimento e saem recebendo a bênção do seu Espectro atual.'),
          ability(17,'Prisma Total','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, mantenha os três Espectros ativos ao mesmo tempo. A cada turno, cada aliado a até 18 m escolhe qual bênção do Espectro deseja receber.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.16.0';
})(window);
