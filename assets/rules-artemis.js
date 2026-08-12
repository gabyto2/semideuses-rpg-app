(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Ártemis']={
    id:'artemis',
    name:'Ártemis',
    title:'O Voto da Caça',
    icon:'🏹',
    domain:'Devoção, caça e lua.',
    profile:'Arqueira de matilha com regras especiais de Voto.',
    specialNature:'Voto de Ártemis',
    mechanicalStatus:'complete',
    casting:'SAB',
    hitDie:8,
    savingThrows:['DES','SAB'],
    skillProficiencies:['Sobrevivência','Furtividade','Lidar com Animais'],
    weaponProficiencies:['Armas simples','Arcos'],
    armorProficiencies:['Armaduras leves'],
    overview:'Ártemis não possui filhas semideusas nesta opção: você é uma Caçadora mortal que realizou um Voto sagrado. Como arqueira de matilha, marca uma presa por vez e faz você, Caçadoras espectrais e lobas convergirem sobre ela. O Voto exige renunciar ao romance e obedecer à deusa; quebrar a palavra custa os poderes.',
    vow:{
      name:'Voto da Caça',
      tenets:['Renunciar ao romance','Obedecer a Ártemis e servir à caça'],
      breach:'Quebrar o Voto custa os poderes concedidos por Ártemis. A reparação depende de comparecer diante da própria deusa e ser aceita por ela.'
    },
    signature:{
      name:'Presa Marcada',
      summary:'Como Ação Bônus, à vontade, marque uma presa por vez por 1 minuto ou até marcar outra. Contra a presa, você causa +1d8 de dano e conta como flanqueando mesmo lutando sozinho. Suas Caçadoras espectrais recebem exatamente o mesmo benefício. Outros aliados não recebem o dano adicional, mas enxergam o brilho da marca e têm Vantagem para localizar a presa.'
    },
    progression:{
      1:['Dom','Assinatura: Presa Marcada','Flecha de Caça'],
      2:['Faro da Caçadora'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Tiro Coordenado','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Armadilha'],
      12:['Habilidade de Caminho'],
      15:['Flecha da Lua'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Caçada Selvagem']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','Você segue o Voto da Caça: renuncia ao romance e obedece a Ártemis; quebrar a palavra custa os poderes. Suas flechas usam Destreza para acertar, você consegue rastrear qualquer Presa Marcada e é imune à condição Enfeitiçado.'),
      ability(1,'Flecha de Caça','E',1,'Parte de um ataque','Ao acertar um ataque à distância, gaste 1 MP para marcar o alvo como sua Presa e causar +2d6 de dano. À vontade. O bônus sobe para +3d6 no nível 5, +4d6 no nível 11 e +5d6 no nível 17.'),
      ability(2,'Faro da Caçadora','Passiva',null,'Passiva','A primeira Presa Marcada de cada combate não exige Ação. Você sabe a direção e a distância aproximada de qualquer criatura marcada nas últimas 24 horas e sabe se ela está ferida. Se a presa cair, marcar a próxima custa apenas uma Ação Bônus naquele turno.'),
      ability(5,'Tiro Coordenado','C',4,'Ação','Até o fim do próximo turno, você e seus aliados causam +1d8 de dano contra sua Presa Marcada.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Armadilha','B',6,'Ação','Arme uma armadilha que prende ou atrasa sua presa. O alvo faz TR de DES; na falha, fica Restrito por 1 rodada.'),
      ability(15,'Flecha da Lua','A',8,'Ação','Dispare contra sua Presa Marcada a qualquer distância que consiga apontar, mesmo sem linha de visão se souber onde ela está. Sem jogada de ataque, causa 12d10 Perfurante, atravessa cobertura, paredes de até 1 m e escuridão. Se ninguém tiver visto você atacar nesta rodada, o dano é máximo em vez de rolado. Se o alvo cair, marque outra presa sem gastar ação.'),
      ability(20,'A Caçada Selvagem','Lendário',24,'Ação, 1 minuto','1 uso por dia. Quatro Caçadoras espectrais surgem a até 18 m e caçam por 1 minuto, agindo juntas na sua Iniciativa sem gastar sua Ação. Cada uma possui CA 17, 45 PV, deslocamento 18 m e realiza dois tiros com +11, causando 2d8+4 Perfurante contra sua Presa Marcada e metade do dano contra outros alvos. Enquanto estiverem em campo, a presa não pode ficar Invisível, teleportar-se para fora do alcance delas nem recuperar PV. Quando a presa cai, elas escolhem a próxima com você. Preço: até o próximo Descanso Longo, você só pode marcar como presa a criatura mais perigosa em campo.')
    ],
    paths:[
      {
        id:'caca-sagrada',
        name:'Caminho da Caça Sagrada',
        summary:'A perseguição. Flechas persistentes aumentam a pressão sobre a Presa Marcada, impedem sua fuga e encerram a caçada com execução.',
        status:'complete',
        abilities:[
          ability(3,'Tiro Perseguidor','D',2,'Ação','Dispare contra sua Presa Marcada, causando 3d8. Se o ataque errar, ele se repete gratuitamente contra a mesma presa no próximo turno.'),
          ability(7,'Foco-Fogo','B',6,'Ação, 1 minuto','Por 1 minuto, seu dano contra a Presa Marcada aumenta em +1d8 cumulativo a cada acerto seu nela, até o máximo de +4d8.'),
          ability(12,'Cerco','A',8,'Ação, 1 minuto','Por 1 minuto, enquanto estiver marcada, a velocidade da presa é reduzida e ela não pode se teleportar para fora de uma distância de 18 m.'),
          ability(17,'Abate Sagrado','S',12,'Ação','2 usos por dia. Realize um tiro de execução contra a Presa Marcada, causando 8d8. Se ela estiver abaixo da metade dos PV, faz TR de CON; na falha, é reduzida a 0 PV.')
        ]
      },
      {
        id:'lua-prateada',
        name:'Caminho da Lua Prateada',
        summary:'A luz da deusa. Revela inimigos ocultos, cura a matilha sob o luar e convoca Caçadoras espectrais durante a lua cheia.',
        status:'complete',
        abilities:[
          ability(3,'Luz da Lua','D',2,'Ação','Um raio prateado causa 3d8 Radiante, revela criaturas ocultas e impede que o alvo fique Invisível por 1 rodada.'),
          ability(7,'Bênção Lunar','B',6,'Ação','À noite ou na penumbra, aliados a até 9 m recuperam 3d8 PV no total e recebem +1d6 de dano por 1 rodada.'),
          ability(12,'Clarão Prateado','A',8,'Ação','Libere uma explosão de luar em cone de 9 m, causando 5d8 Radiante. As criaturas atingidas fazem TR de CON; na falha, ficam Cegas por 1 rodada.'),
          ability(17,'Lua Cheia','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, invoque 2 Caçadoras espectrais; se já possuir Caçadoras em campo, a quantidade delas dobra. Todo dano causado contra a Presa Marcada aumenta em +2d8. Aplicam-se as regras de Criaturas Invocadas.')
        ]
      },
      {
        id:'irmandade',
        name:'Caminho da Irmandade',
        summary:'A matilha. Invoca Caçadoras e lobas espectrais para flanquear, prender e perseguir a Presa Marcada.',
        status:'complete',
        abilities:[
          ability(3,'Caçadora Espectral','D',2,'Ação, 1 minuto','Invoque uma Caçadora espectral que age na sua Iniciativa por 1 minuto. Seu arco causa 1d8 de dano, aumentando para 2d8 no nível 12. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(7,'Matilha','B',6,'Ação','Invoque três Caçadoras espectrais que cercam a presa. Aliados possuem Vantagem contra criaturas flanqueadas por elas. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(12,'Lobas Espectrais','A',8,'Ação','Invoque lobas espectrais que prendem e perseguem sua Presa Marcada. O alvo faz TR de FOR; na falha, fica Agarrado. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(17,'A Caçada Eterna','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, convoque a matilha completa de Caçadoras e lobas para caçar ao seu lado, concentrando-se na Presa Marcada. Aplicam-se as regras de Criaturas Invocadas.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.14.0';
})(window);
