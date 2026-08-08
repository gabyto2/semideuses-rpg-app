(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Apolo']={
    id:'apolo',
    name:'Apolo',
    title:'O Curandeiro-Arqueiro',
    icon:'☀',
    domain:'Sol, música, profecia e cura.',
    profile:'Curandeiro-arqueiro à distância.',
    mechanicalStatus:'complete',
    casting:'SAB',
    hitDie:8,
    savingThrows:['DES','SAB'],
    skillProficiencies:['Medicina','Atuação','Religião / Panteão'],
    weaponProficiencies:['Armas simples','Arcos'],
    armorProficiencies:['Armaduras leves'],
    overview:'Curandeiro-arqueiro à distância. A Marca Solar pinta o alvo e o restante do conjunto cobra essa marca em dano; entre um tiro e outro, você cura e remove condições, sustentando o grupo sem sair do alcance seguro.',
    signature:{
      name:'Marca Solar',
      summary:'Suas flechas marcam o alvo com luz por 1 minuto. Aliados causam +1d6 de dano contra alvos Marcados, e suas curas podem saltar para um aliado a até 3 m de um alvo Marcado.'
    },
    progression:{
      1:['Dom','Assinatura: Marca Solar','Flecha Solar'],
      2:['Pontaria do Sol'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Hino de Cura','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Salva de Luz'],
      12:['Habilidade de Caminho'],
      15:['Flecha Sem Sombra'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Carro do Sol']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A luz do sol o serve: suas flechas acertam por Destreza, não por Sabedoria, e o brilho que você emana revela criaturas ocultas ou invisíveis a até 9 m.'),
      ability(1,'Flecha Solar','E',1,'Parte de um ataque','Ao acertar um ataque à distância, gaste 1 MP para causar +2d6 de dano Radiante e deixar o alvo Marcado. À vontade. O bônus sobe para +3d6 no nível 5, +4d6 no nível 11 e +5d6 no nível 17.'),
      ability(2,'Pontaria do Sol','Passiva',null,'Escolha após Descanso Longo','Escolha um dom, podendo trocá-lo no Descanso Longo. Arco: a primeira Marca Solar de cada combate não gasta MP e o alvo Marcado não se beneficia de cobertura contra você. Lira: quando você cura um aliado, ele recebe também 1d6 PV Temporários e pode se levantar sem gastar movimento. Oráculo: 1 vez por dia, ao terminar um Descanso, faça uma pergunta sobre as próximas 24 horas; o Mestre responde com uma imagem verdadeira, mas incompleta.'),
      ability(5,'Hino de Cura','C',4,'Ação','Um aliado a até 18 m recupera 3d8 PV. Com a Marca Solar, a cura pode saltar para um segundo aliado próximo a um alvo Marcado.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Salva de Luz','B',6,'Ação','Vários tiros menores atingem até 3 alvos a até 18 m, causando 2d6 Radiante em cada um e espalhando a Marca Solar.'),
      ability(15,'Flecha Sem Sombra','A',8,'Ação','Um único tiro contra um alvo Marcado a até 180 m causa 10d10 Radiante, sem jogada de ataque, atravessando cobertura e paredes de até 1 m. Se o alvo estiver na luz do dia ou em uma área iluminada por você, o dano é máximo em vez de rolado. Todo aliado a até 9 m do alvo recupera 3d8 PV com a luz do impacto.'),
      ability(20,'O Carro do Sol','Lendário',24,'Ação, 1 minuto','1 uso por dia. O Carro do Sol paira a até 60 m por 1 minuto e age na sua Iniciativa sem gastar sua Ação. No turno dele, escolha: cone de 18 m que causa 6d10 Radiante, com TR de DES para metade, e deixa o alvo Marcado; distribuir 6d8 de cura entre aliados a até 30 m; ou apagar toda escuridão mágica a até 60 m e conceder Vantagem contra criaturas que dependem dela. Enquanto ele estiver no céu, ninguém a até 60 m pode ficar Invisível nem se esconder de você. Preço: até o próximo Descanso Longo, suas curas restauram metade.')
    ],
    paths:[
      {
        id:'arqueiro',
        name:'Caminho do Arqueiro',
        summary:'O tiro divino. Aumenta precisão, perfuração e dano em área, explorando a Marca Solar para finalizar alvos.',
        status:'complete',
        abilities:[
          ability(3,'Tiro Certeiro','D',2,'Ação','Um tiro preciso causa 3d8 Perfurante, mais 1d6 se o alvo estiver Marcado.'),
          ability(7,'Tiro Perfurante','B',6,'Ação','Uma linha de 24 m causa 5d8 Perfurante e explora a Marca Solar de cada alvo atingido.'),
          ability(12,'Chuva de Flechas','A',8,'Ação','Uma área de 6 m em um ponto a até 24 m sofre 5d8 Perfurante, com TR de DES para metade.'),
          ability(17,'Flecha do Meio-Dia','S',12,'Ação','2 usos por dia. Um tiro decisivo causa 8d8 Radiante e produz um estouro de luz. O alvo e criaturas adjacentes fazem TR de CON ou ficam Cegos por 1 rodada.')
        ]
      },
      {
        id:'curandeiro',
        name:'Caminho do Curandeiro',
        summary:'A mão que devolve a vida. Concentra cura, restaura o grupo, remove condições graves e traz um aliado caído de volta à luta.',
        status:'complete',
        abilities:[
          ability(3,'Cura Focada','D',2,'Ação','Um aliado a até 18 m recupera 3d8 PV.'),
          ability(7,'Cura em Área','B',6,'Ação','Distribua 5d8 de cura entre aliados a até 12 m. Com a Marca Solar, a cura também alcança aliados próximos de inimigos Marcados.'),
          ability(12,'Restauração','A',8,'Ação','Remova as condições Paralisado, Apavorado, Envenenado ou Atordoado de até 3 aliados a até 12 m.'),
          ability(17,'Ressurgir','S',12,'Ação','1 uso por dia. Um aliado a até 9 m que esteja com 0 PV ou tenha morrido neste combate retorna à luta com metade dos PV.')
        ]
      },
      {
        id:'oraculo',
        name:'Caminho do Oráculo',
        summary:'Os olhos do amanhã. Concede presságios, interfere em ataques e testes e reescreve um resultado decisivo da cena.',
        status:'complete',
        abilities:[
          ability(3,'Vislumbre','D',2,'Ação Bônus','Você ou um aliado a até 9 m ganha Vantagem no próximo teste e é avisado do próximo perigo iminente. Se a jogada beneficiada for contra um alvo Marcado, some também +2.'),
          ability(7,'Profecia','B',6,'Ação','Conceda ao grupo uma rerrolagem coletiva nesta cena ou preveja um ataque inimigo e imponha Desvantagem a ele. Se quem ataca estiver Marcado, o ataque previsto simplesmente falha.'),
          ability(12,'Sina','A',8,'Ação','Um inimigo a até 18 m faz TR de SAB. Na falha, fica fadado ao fracasso por 1 minuto, recebendo Desvantagem em ataques e testes. Um alvo Marcado faz o TR com Desvantagem.'),
          ability(17,'Voz de Delfos','S',12,'Ação','1 uso por dia. Reescreva um resultado da cena, transformando uma rolagem sua ou de outra criatura no melhor ou pior resultado possível. Se o resultado reescrito envolver um alvo Marcado, aliados recebem +1d4 contra ele até o fim da cena.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.9.0';
})(window);
