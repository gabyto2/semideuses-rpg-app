(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Hades']={
    id:'hades',
    name:'Hades',
    title:'O Senhor do Érebo',
    icon:'♜',
    domain:'Morte, sombras e riquezas.',
    profile:'Atrito: invocação, dreno e maldições.',
    mechanicalStatus:'complete',
    casting:'CAR',
    hitDie:8,
    savingThrows:['INT','CAR'],
    skillProficiencies:['Religião / Panteão','Intimidação','Furtividade'],
    weaponProficiencies:['Armas simples','Armas marciais'],
    armorProficiencies:['Armaduras médias','Armaduras leves'],
    overview:'Atrito: você vence o combate longo. Cada inimigo que cai produz Almas, e essas Almas erguem servos, convertem dano Necrótico em cura ou prolongam maldições. Hades cresce conforme o campo de batalha se enche de mortos que obedecem.',
    signature:{
      name:'Almas',
      summary:'Sempre que um inimigo morre a até 12 m, você ganha 1 Alma, até o máximo de 3 + seu modificador de Conjuração. As Almas zeram ao fim do combate. Uma vez por turno, sem gastar ação, elas podem alimentar cura necrótica, dar uma ação extra a um morto invocado, prolongar uma maldição ou erguer imediatamente um inimigo derrotado como servo.',
      universalCosts:[
        {cost:1,effect:'O próximo dano Necrótico que você causar nesta rodada cura você em metade do valor.'},
        {cost:2,effect:'Um morto que você invocou age novamente imediatamente.'},
        {cost:2,effect:'Estenda em 1 rodada uma maldição ou condição que você aplicou.'},
        {cost:3,effect:'Como Reação, quando um inimigo a até 12 m cai a 0 PV, ele se levanta como seu servo até o fim do combate.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Almas','Toque do Érebo'],
      2:['Colheita Precoce'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Erguer Morto','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Aura de Medo'],
      12:['Habilidade de Caminho'],
      15:['O Barqueiro'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Julgamento']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A morte não tem segredos para você: possui resistência a dano Necrótico, enxerga e conversa com espíritos e sente quando uma criatura próxima está à beira do fim, com menos de 25% dos PV.'),
      ability(1,'Toque do Érebo','E',1,'Ação','Um toque de morte fere um alvo a até 12 m, causando 1d10 Necrótico, e você recupera PV iguais à metade do dano. O dano aumenta em +1d10 nos níveis 5, 11 e 17.'),
      ability(2,'Colheita Precoce','Passiva',null,'Passiva','No início de cada combate, se houver um cadáver, um moribundo ou uma criatura abaixo da metade dos PV a até 12 m, você ganha 1 Alma. Além disso, a primeira Alma gasta em cada combate retorna no fim daquele turno.'),
      ability(5,'Erguer Morto','C',4,'Ação','Invoca um servo morto-vivo com ND igual a 1/4 do seu nível, que permanece até o fim do combate. Gaste 1 Alma para erguer dois servos de uma vez. Aplicam-se as regras de Criaturas Invocadas.'),
      ability(10,'Aura de Medo','B',6,'Ação Bônus, 1 minuto','Por 1 minuto, inimigos que começam o turno a até 4,5 m de você fazem TR de SAB ou ficam Apavorados até o fim do próximo turno.'),
      ability(15,'O Barqueiro','A',8,'Ação','Invoque a barca do Érebo em um ponto a até 18 m. Ela mede 3 m × 9 m e age na sua Iniciativa até o fim do combate, sem gastar sua Ação. Move 12 m, atravessa criaturas e paredes de até 1 m e força todo inimigo atravessado a fazer TR de CAR; na falha, sofre 4d8 Necrótico e tem a velocidade reduzida à metade por 1 rodada. Até 4 aliados podem embarcar e viajar sem gastar movimento. Você ganha 1 Alma sempre que a barca derruba um inimigo. A barca possui CA 16, 60 PV e imunidade a Necrótico.'),
      ability(20,'O Julgamento','Lendário',24,'Ação, 1 hora','1 uso por arco. Por 1 hora, num raio de 300 m, ninguém pode ser ressuscitado nem estabilizado por magia que não seja sua; você sabe o nome e a causa da morte de qualquer criatura que morra na área; e todo dano Necrótico seu ignora resistência. Uma vez durante a duração, chame um morto caído na área para responder com verdade a 3 perguntas, limitado ao que sabia em vida. Preço: até o próximo Descanso Longo, você não recebe cura de nenhuma fonte.')
    ],
    paths:[
      {
        id:'morte',
        name:'Caminho da Morte',
        summary:'O exército dos mortos. Ergue servos, constrói defesas de ossos e domina legiões.',
        status:'complete',
        abilities:[
          ability(3,'Comando Fúnebre','D',2,'Ação Bônus','Ergue do campo um esqueleto com ND igual a 1/4 do seu nível, que age na própria Iniciativa até o fim do combate. Você mantém no máximo 2 esqueletos erguidos por esta habilidade. Gaste 1 Alma para que seus mortos-vivos causem +1d6 de dano nos ataques até o início do próximo turno.'),
          ability(7,'Falange de Ossos','B',6,'Ação','Ergue uma muralha de ossos de 9 m × 3 m, com cobertura total e 30 PV, por 1 minuto. Inimigos que começam o turno adjacentes sofrem 2d6 Perfurante. Gaste 1 Alma para reposicionar a muralha em 6 m no início do seu turno.'),
          ability(12,'Horda','A',8,'Ação','Você pode comandar até 5 mortos-vivos simultaneamente. Gaste 1 Alma para cada morto adicional acima desse limite. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(17,'Senhor dos Mortos','S',12,'Ação, 1 minuto','2 usos por dia. Convoca um pequeno exército de mortos por 1 minuto. Cada Alma gasta acrescenta mais um morto à legião. Aplicam-se as regras de Criaturas Invocadas.')
        ]
      },
      {
        id:'sombras',
        name:'Caminho das Sombras',
        summary:'O assassino do Érebo. Teleporta-se pela escuridão, torna-se invisível e executa alvos isolados.',
        status:'complete',
        abilities:[
          ability(3,'Passo Sombrio','D',2,'Ação Bônus','Teleporte-se até 9 m entre sombras. Seu próximo ataque até o fim do turno tem Vantagem e causa +2d8 de dano.'),
          ability(7,'Manto de Sombras','B',6,'Ação Bônus, 1 minuto','Na penumbra ou escuridão, você fica Invisível. Seus ataques contra alvos que não conseguem vê-lo causam dano de crítico quando acertam.'),
          ability(12,'Lâminas de Sombra','A',8,'Ação','Três lâminas perseguem alvos a até 18 m. Faça um Ataque de Conjuração para cada lâmina; no acerto, causa 3d8 Necrótico. Uma lâmina que erra persegue o mesmo alvo e ataca novamente no próximo turno, com Vantagem.'),
          ability(17,'Execução das Sombras','S',12,'Ação','2 usos por dia. Você surge ao lado de um alvo e desfere um golpe de 8d8 Necrótico. Se o reduzir a 0 PV, teleporta-se de volta e recupera 1 Alma.')
        ]
      },
      {
        id:'soberano',
        name:'Caminho do Soberano',
        summary:'Maldições e sentença. Enfraquece inimigos, amplia o dano do grupo e impede recuperação.',
        status:'complete',
        abilities:[
          ability(3,'Maldição','D',2,'Ação','Um alvo a até 18 m faz TR de SAB. Na falha, recebe Desvantagem em ataques e sofre 1d8 Necrótico no início de cada turno por 1 minuto.'),
          ability(7,'Marca da Morte','B',6,'Ação','Marque um alvo por 1 minuto: ele sofre +50% de dano do próximo golpe de cada aliado. Gaste 1 Alma para impedir que a marca expire.'),
          ability(12,'Maldição em Área','A',8,'Ação','Inimigos em uma área de 6 m fazem TR de SAB. Na falha, ficam enfraquecidos por 1 minuto, com Desvantagem em ataques e Testes de Resistência.'),
          ability(17,'Sentença do Érebo','S',12,'Ação','2 usos por dia. Um alvo faz TR de CAR. Na falha, recebe por 1 minuto uma maldição quase irremovível: não recupera PV, tem Desvantagem em tudo e sofre 4d8 Necrótico por turno.')
        ]
      },
      {
        id:'riquezas',
        name:'Caminho das Riquezas',
        summary:'O ouro do Submundo. Manipula cobiça, protege com tesouros e fortalece o grupo.',
        status:'complete',
        abilities:[
          ability(3,'Ouro Tentador','D',2,'Ação','Faz brotar ouro ilusório. Um alvo a até 12 m faz TR de SAB ou fica distraído, com Desvantagem em ataques, por 1 rodada.'),
          ability(7,'Armadura de Tesouro','B',6,'Ação Bônus, 1 minuto','Por 1 minuto, cobre-se de bronze e gemas do Submundo, recebendo +2 de CA e PV Temporários iguais ao seu nível.'),
          ability(12,'Avareza','A',8,'Ação','Inimigos em uma área de 6 m fazem TR de SAB ou ficam Restritos por 1 minuto, incapazes de se afastar do ouro conjurado.'),
          ability(17,'Tesouro do Submundo','S',12,'Ação','2 usos por dia. Por 1 minuto, aliados a até 12 m recebem +1 de CA, PV Temporários e +1d6 de dano. Gaste Almas para estender a duração.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.6.0';
})(window);
