(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Hefesto']={
    id:'hefesto',
    name:'Hefesto',
    title:'A Fortaleza',
    icon:'⚒',
    domain:'Fogo, forja e invenção.',
    profile:'Fortaleza: CA, constructos e fogo.',
    mechanicalStatus:'complete',
    casting:'INT',
    hitDie:10,
    savingThrows:['FOR','CON'],
    skillProficiencies:['Investigação','Percepção','Atletismo'],
    weaponProficiencies:['Armas simples','Armas marciais'],
    armorProficiencies:['Armaduras pesadas','Armaduras médias','Armaduras leves','Escudos'],
    overview:'Fortaleza: CA alta, constructos e fogo. Os Pontos de Máquina montam autômatos, torretas e dispositivos que fazem o trabalho por você. Hefesto constrói a vantagem antes do combate começar — e ela continua de pé mesmo quando o ferreiro cai.',
    signature:{
      name:'Dispositivos',
      summary:'Você possui um orçamento de Pontos de Máquina igual a 1 + metade do seu nível, reconfigurado no Descanso. Eles são gastos para implantar engenhocas que agem sozinhas na sua Iniciativa, e você nunca mantém mais Pontos de Máquina do que o seu orçamento.',
      universalCosts:[
        {cost:1,effect:'Torreta: uma torre que atira 2d8 a até 18 m por 1 minuto.'},
        {cost:2,effect:'Autômato: um autômato de ND aproximado a 1/4 do seu nível que age na sua Iniciativa.'},
        {cost:2,effect:'Bastião: uma barreira de bronze de 3 m, com cobertura de três quartos, por 1 minuto.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Dispositivos','Martelo Incandescente'],
      2:['Bancada Portátil'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Torreta','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Bastião'],
      12:['Habilidade de Caminho'],
      15:['Linha de Montagem'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Autômato de Bronze']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','A forja é sua aliada: você é imune ao fogo da sua própria forja, conserta objetos na metade do tempo e enxerga a fraqueza estrutural do que vê, causando dano adicional contra objetos e constructos.'),
      ability(1,'Martelo Incandescente','E',1,'Parte de um ataque','Ao acertar um ataque corpo a corpo, gaste 1 MP para causar +2d6 Ígneo e ganhar 1 Ponto de Máquina. À vontade. O bônus sobe para +3d6 no nível 5, +4d6 no 11 e +5d6 no 17.'),
      ability(2,'Bancada Portátil','Passiva',null,'Escolha após Descanso Longo','Escolha uma especialidade, podendo trocá-la no Descanso Longo. Munição: monte 3 engenhocas descartáveis por Descanso; com Ação Bônus, lance uma a até 9 m para causar 2d8 de Fogo, Perfurante ou Elétrico numa esfera de 3 m, com TR de DES para metade. Manutenção: seus dispositivos e autômatos recuperam 1d8 PV no início de cada turno seu, e você recupera 1 Ponto de Máquina quando um deles é destruído. Improviso: com 10 minutos e materiais, fabrique por 1 hora uma ferramenta que resolve um problema concreto da cena, como arrombar, escalar, sinalizar ou respirar.'),
      ability(5,'Torreta','C',4,'Ação','Implante uma torreta por 1 Ponto de Máquina. Ela atira sozinha, causando 2d8 a um alvo a até 18 m, e permanece por 1 minuto.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Bastião','B',6,'Ação','Erga por 1 minuto uma barreira de bronze de 3 m que concede cobertura de três quartos aos aliados posicionados atrás dela.'),
      ability(15,'Linha de Montagem','A',8,'Ação','Implante a Linha num ponto a até 12 m. Ela age na sua Iniciativa, sem gastar sua Ação, até o fim do combate. Em cada turno, monta e dispara uma opção: torre que causa 3d10 no alvo mais próximo; muro de bronze de 3 m × 3 m, 40 PV e cobertura total; ou braço de reparo que cura 3d8 num aliado ou dispositivo a até 9 m. A Linha possui CA 17 e 50 PV. Enquanto estiver de pé, seus dispositivos custam 1 Ponto de Máquina a menos, mínimo 1.'),
      ability(20,'O Autômato de Bronze','Lendário',24,'Ação','1 uso por dia. Talos surge num espaço livre a até 9 m e serve por 1 minuto, agindo na sua Iniciativa sem gastar sua Ação. É Enorme, possui CA 20, 180 PV, imunidade a Fogo e Veneno e resistência a dano físico não mágico. No turno dele, faça dois ataques +12 de 4d10 Contundente cada; quem é atingido faz TR de FOR ou é empurrado 3 m e fica Caído. Em vez disso, Talos pode liberar bronze derretido num cone de 9 m, causando 8d8 de Fogo, com TR de DES para metade. Ele pode usar a própria Reação para tomar para si um ataque contra um aliado a até 3 m. Preço: ao fim, Talos endurece como estátua no local, e você não pode conjurá-lo novamente enquanto não recuperar essa estátua.')
    ],
    paths:[
      {
        id:'forja',
        name:'Caminho da Forja',
        summary:'Bronze e bigorna. Forja equipamento divino temporário, aprimora o grupo e restaura itens e constructos durante o combate.',
        status:'complete',
        abilities:[
          ability(3,'Arma Divina','D',2,'Ação','Forje imediatamente uma arma ou escudo divino temporário, com bônus +1 e uma propriedade especial, por 10 minutos. Gaste 1 Ponto de Máquina para conceder uma segunda propriedade.'),
          ability(7,'Aprimorar Equipamento','B',6,'Ação, 1 minuto','Por 1 minuto, o equipamento do grupo recebe +1 em ataques e CA. Gaste 1 Ponto de Máquina para que um aliado escolhido receba +2 em vez de +1.'),
          ability(12,'Autoforja','A',8,'Ação','Repare e rearme em combate: restaure PV de um constructo ou objeto aliado e conceda PV Temporários a um aliado. Gaste 1 Ponto de Máquina para dobrar a restauração.'),
          ability(17,'Obra da Forja','S',12,'Ação','1 uso por dia. Crie um artefato lendário temporário com um efeito poderoso à sua escolha. Gaste 2 Pontos de Máquina para fazê-lo durar a cena inteira.')
        ]
      },
      {
        id:'fogo',
        name:'Caminho do Fogo',
        summary:'A chama da forja. Espalha dano Ígneo, cria áreas perigosas e sustenta um inferno sobre o campo.',
        status:'complete',
        abilities:[
          ability(3,'Jato de Fogo','D',2,'Ação','Cone de 4,5 m: 3d8 Ígneo, com TR de DES para metade. Gaste 1 Ponto de Máquina para causar +1d8 de dano.'),
          ability(7,'Campo de Brasas','B',6,'Ação, 1 minuto','Crie uma área de terreno em chamas de 6 m. Quem entra ou começa o turno nela sofre 2d8 Ígneo. Gaste 1 Ponto de Máquina para aumentar a área para 9 m.'),
          ability(12,'Explosão de Magma','A',8,'Ação','Uma área de 6 m sofre 5d8 Ígneo e se torna terreno difícil de lava por 1 minuto. Gaste 1 Ponto de Máquina para causar +1d8 de dano.'),
          ability(17,'Coração do Vulcão','S',12,'Ação, 1 minuto','2 usos por dia. Crie por 1 minuto um inferno sustentado num raio de 9 m. Cada inimigo que começa o turno na área sofre 4d8 Ígneo. Gaste 2 Pontos de Máquina para aumentar o raio em 3 m.')
        ]
      },
      {
        id:'automato',
        name:'Caminho do Autômato',
        summary:'A criação que ganha vida. Invoca constructos de combate, alterna funções e culmina num colosso de bronze.',
        status:'complete',
        abilities:[
          ability(3,'Autômato de Bronze','D',2,'Ação','Invoque um autômato de ND aproximado a 1/4 do seu nível, que age na sua Iniciativa até o fim do combate. Gaste 1 Ponto de Máquina para que ele surja com PV extras iguais ao seu nível. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(7,'Autômato Maior','B',6,'Ação, 1 minuto','Invoque por 1 minuto um autômato em um de dois modos: Torreta, imóvel, com um ataque por turno de 2d8 a até 18 m; ou Montaria, com velocidade 12 m e +1d6 nos ataques do cavaleiro. Gaste 1 Ponto de Máquina no início do turno para trocar o modo. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(12,'Dois Autômatos','A',8,'Ação','Mantenha dois autômatos coordenados ao mesmo tempo. Gaste 2 Pontos de Máquina para que ambos ataquem o mesmo alvo com Vantagem. Aplicam-se as regras de Criaturas Invocadas.'),
          ability(17,'Colosso','S',12,'Ação, 1 minuto','2 usos por dia. Erga por 1 minuto um colosso de bronze gigante que esmaga e controla o campo. Gaste 3 Pontos de Máquina para que ele entre com PV Temporários iguais a duas vezes o seu nível. Aplicam-se as regras de Criaturas Invocadas.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.10.0';
})(window);
