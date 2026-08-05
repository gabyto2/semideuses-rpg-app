(function(global){
  'use strict';

  function overview(id,name,icon,domain,profile,extra){
    var entry={
      id:id,name:name,icon:icon,domain:domain,profile:profile,
      mechanicalStatus:'overview',paths:[],progression:{},abilities:[],
      skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],savingThrows:[]
    };
    if(extra)Object.keys(extra).forEach(function(key){entry[key]=extra[key];});
    return entry;
  }
  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  var affiliations={
    'Zeus':overview('zeus','Zeus','⚡','Céu, raios e autoridade.','Dano bruto, corpo a corpo e à distância.',{
      mechanicalStatus:'complete',
      title:'O Senhor do Raio',
      casting:'CAR',
      hitDie:10,
      savingThrows:['DES','CAR'],
      skillProficiencies:['Intimidação','Persuasão','História'],
      weaponProficiencies:['Armas simples','Armas marciais'],
      armorProficiencies:['Armaduras médias','Armaduras leves','Escudos'],
      overview:'Dano bruto que cresce com a luta. Você troca golpes ou dispara raios enquanto acumula Cargas; quanto mais longo o combate, mais pesado fica o seu ataque. Fora de combate, a autoridade divina favorece Intimidação e Persuasão.',
      signature:{
        name:'Tempestade Crescente',
        summary:'No início de cada um dos seus turnos em combate, você ganha 1 Carga, até o máximo de 5. Todas as Cargas somem após 1 minuto fora de combate. Diversas habilidades podem consumir Cargas para ampliar dano, alcance, área ou efeitos.'
      },
      progression:{
        1:['Dom','Assinatura: Tempestade Crescente','Pulso Elétrico'],
        2:['Para-Raios'],
        3:['Escolha do Caminho','Habilidade de Caminho'],
        5:['Raio Direto','Marca do Herói'],
        7:['Habilidade de Caminho'],
        10:['Condutor'],
        12:['Habilidade de Caminho'],
        15:['Fúlmen'],
        17:['Habilidade de Caminho'],
        20:['Poder Supremo: O Raio-Mestre']
      },
      abilities:[
        ability(1,'Dom','Passiva',null,'Passiva','O raio reconhece o seu sangue: você é imune a dano Elétrico e começa cada combate com 1 Carga. Começa com 2 Cargas quando estiver em altura elevada, sob céu aberto ou em meio a um temporal.'),
        ability(1,'Pulso Elétrico','E',1,'Parte de um ataque','Ao acertar um ataque com arma, gaste 1 MP: o alvo sofre +2d6 de dano Elétrico e você ganha 1 Carga. À vontade. O dano sobe para +3d6 no nível 5, +4d6 no nível 11 e +5d6 no nível 17.'),
        ability(2,'Para-Raios','Passiva',null,'Passiva','Uma vez por rodada, quando um inimigo a até 9 m causa dano a você ou a um aliado a até 3 m de você, ganhe 1 Carga e o agressor sofre 1d8 Elétrico, sem gastar sua Reação. Se o dano recebido for Elétrico, ganhe 2 Cargas e reduza esse dano à metade.'),
        ability(5,'Raio Direto','C',4,'Ação','Faça um Ataque de Conjuração contra um alvo a até 24 m. No acerto, causa 4d8 Elétrico. Você pode gastar até 3 Cargas para causar +1d8 por Carga.'),
        ability(10,'Condutor','B',null,'Passiva','Quando você causa dano Elétrico a uma criatura, o raio salta para um inimigo a até 3 m dela, causando metade do dano original. Uma vez por turno.'),
        ability(15,'Fúlmen','A',8,'Ação','Esfera de 9 m a até 60 m: 8d10 Elétrico, com TR de DES para metade. Consome todas as Cargas: +2d10 por Carga. A cada 2 Cargas consumidas, escolha 1 alvo na área para fazer TR de CON ou ficar Atordoado por 1 rodada. É instantâneo e não exige concentração.'),
        ability(20,'O Raio-Mestre','Lendário',24,'Ação','1 uso por dia. Escolha uma linha de 90 m × 6 m ou um círculo de 18 m a até 300 m: 24d10 Elétrico, com TR de DES para metade; quem falha fica Atordoado por 1 rodada. Resistência a Elétrico não se aplica e estruturas não mágicas desabam. Até o fim do combate, você não gera Cargas, não conjura Rank S ou superior e ganha 1 nível de Exaustão.')
      ],
      paths:[
        {id:'lanca',name:'Caminho da Lança',summary:'Precisão, linhas de ataque e penetração de cobertura e resistência.',status:'complete',abilities:[
          ability(3,'Lança Elétrica','D',2,'Ação','Linha de 18 m × 1,5 m: 3d8 Elétrico, com TR de DES para metade, e perfura cobertura leve. Para cada Carga gasta, causa +1d8 e aumenta o comprimento da linha em 6 m.'),
          ability(7,'Perfuração','B',6,'Ação','Linha de 24 m: 5d8 Elétrico, ignorando resistência a Elétrico. Cada alvo atravessado faz TR de CON ou fica Atordoado por 1 rodada.'),
          ability(12,'Tiro de Júpiter','A',8,'Ação','Um raio guiado acerta automaticamente um alvo a até 30 m e causa 7d8 Elétrico. Você pode gastar Cargas para causar +1d8 por Carga, até 5.'),
          ability(17,'Aniquilação','S',12,'Ação','2 usos por dia. Linha de 30 m; consome todas as suas Cargas. Causa 8d8 Elétrico +2d8 por Carga consumida, com TR de CON para metade. Quem falha também é derrubado.')
        ]},
        {id:'tempestade',name:'Caminho da Tempestade',summary:'Dano em área e pressão sustentada sobre o campo de batalha.',status:'complete',abilities:[
          ability(3,'Estouro','D',2,'Ação','Esfera de 6 m a até 18 m: 3d8 Elétrico, com TR de DES para metade.'),
          ability(7,'Nuvem de Tempestade','B',6,'Ação, concentração por 1 minuto','Cria um cilindro de 6 m que você pode mover 3 m por turno. No início do turno de cada inimigo dentro da área, ele sofre 2d8 Elétrico. A área fica levemente obscurecida.'),
          ability(12,'Relâmpagos','A',8,'Ação','Até 3 alvos diferentes a até 24 m sofrem 4d8 Elétrico cada. Para cada 2 Cargas gastas, escolha +1 alvo.'),
          ability(17,'Supercélula','S',12,'Ação, 1 minuto','2 usos por dia. Cria uma tempestade de 12 m de raio por 1 minuto. Cada inimigo que começa o turno dentro sofre 4d8 Elétrico, com TR de DES para metade. Cada Carga gasta ao conjurar amplia o raio em 3 m.')
        ]},
        {id:'trovao-encarnado',name:'Caminho do Trovão Encarnado',summary:'Mobilidade explosiva, mergulho e combate corpo a corpo eletrizado.',status:'complete',abilities:[
          ability(3,'Investida-Relâmpago','D',2,'Ação','Mova-se até sua velocidade em linha reta como uma faísca, sem provocar Ataques de Oportunidade. O primeiro alvo no caminho sofre 3d8 Elétrico e é derrubado. Gaste até 3 Cargas para causar +1d8 por Carga.'),
          ability(7,'Corpo Eletrizado','B',6,'Ação Bônus, 1 minuto','Por 1 minuto, qualquer criatura que o acerte corpo a corpo ou termine o turno adjacente a você sofre 2d8 Elétrico. Cada Carga gasta ao ativar aumenta o dano da aura em 1d6, até +3d6.'),
          ability(12,'Salto do Trovão','A',8,'Ação','Salte até 12 m. Ao aterrissar, produz uma onda de choque de 4,5 m: 5d8 Elétrico, com TR de DES para metade, e derruba. Gaste até 3 Cargas: +1,5 m no raio e +1d8 por Carga.'),
          ability(17,'Raio Vivo','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, você se torna eletricidade. Como parte do movimento, teleporte-se até 9 m; cada inimigo atravessado pela linha sofre 3d8 Elétrico. Cada Carga gasta ao ativar concede um salto adicional por turno.')
        ]},
        {id:'soberano',name:'Caminho do Soberano',summary:'Execução de inimigos feridos e sentenças elétricas decisivas.',status:'complete',abilities:[
          ability(3,'Sentença','D',2,'Ação','Um ataque causa +2d8 de dano se o alvo estiver abaixo da metade dos PV. Gaste 1 Carga para aplicar o bônus contra qualquer alvo, mesmo sem estar ferido.'),
          ability(7,'Trovão Atordoante','B',6,'Ação','Um alvo a até 18 m sofre 4d8 Elétrico e faz TR de CON ou fica Atordoado por 1 rodada. Gaste 2 Cargas para aumentar a duração do Atordoado em mais 1 rodada.'),
          ability(12,'Julgamento','A',8,'Ação','Um alvo abaixo de 1/3 dos PV faz TR de CON ou é reduzido a 0 PV; caso contrário, sofre 6d8 Elétrico. Gaste 3 Cargas para impor Desvantagem no TR.'),
          ability(17,'Decreto do Céu','S',12,'Ação','2 usos por dia. Um alvo faz TR de CON, com Desvantagem se estiver abaixo da metade dos PV. Na falha, morre instantaneamente; no sucesso, sofre 8d8 Elétrico. Cada Carga gasta impõe -1 no TR do alvo.')
        ]}
      ]
    }),
    'Poseidon':overview('poseidon','Poseidon','🔱','Mar, terremotos e cavalos.','Controle de campo e mobilidade.'),
    'Hades':overview('hades','Hades','♜','Morte, sombras e riquezas.','Atrito, invocação e dreno.'),
    'Atena':overview('atena','Atena','🦉','Sabedoria e estratégia.','Comando e suporte tático.'),
    'Ares':overview('ares','Ares','🪖','Guerra e violência.','Duelista bruto e resistente.'),
    'Apolo':overview('apolo','Apolo','☀','Sol, música, profecia e cura.','Curandeiro-arqueiro à distância.'),
    'Hermes':overview('hermes','Hermes','⚕','Viagem, ladinagem e comércio.','Velocista furtivo e versátil.'),
    'Hefesto':overview('hefesto','Hefesto','⚒','Fogo, forja e invenção.','Fortaleza, armadura, constructos e fogo.'),
    'Afrodite':overview('afrodite','Afrodite','♀','Amor, beleza e manipulação.','Controlador social.'),
    'Deméter':overview('demeter','Deméter','🌾','Colheita, natureza e estações.','Controle de terreno e cura.',{
      mechanicalStatus:'complete',
      title:'A Senhora do Campo',
      casting:'SAB',
      hitDie:8,
      savingThrows:['CON','SAB'],
      skillProficiencies:['Natureza','Sobrevivência','Medicina'],
      weaponProficiencies:['Armas simples','Armas marciais'],
      armorProficiencies:['Armaduras médias','Armaduras leves'],
      overview:'As zonas de plantas crescem a cada turno, fechando caminhos e curando quem estiver dentro. O personagem escolhe onde a luta acontece e transforma o campo em aliado.',
      signature:{
        name:'Crescimento',
        summary:'Toda habilidade que planta uma Semente deixa uma zona vegetal. No início de cada turno, a Semente vira uma zona de 3 m ou uma zona cresce 1,5 m, até 9 m. As zonas são terreno difícil para inimigos e cobertura leve para aliados. Você mantém 3 zonas, ou 5 a partir do nível 11.',
        universalCosts:[
          {cost:1,effect:'Mover uma zona 3 m ou fazê-la crescer 3 m imediatamente.'},
          {cost:2,effect:'Uma zona cura 1d8 PV em cada aliado dentro dela.'},
          {cost:3,effect:'Inimigos dentro da zona fazem TR de FOR ou ficam Restritos até o fim do próximo turno deles.'}
        ],
        maxZonesByLevel:{1:3,11:5}
      },
      progression:{
        1:['Dom','Assinatura: Crescimento','Espinho'],
        2:['Semente Teimosa'],
        3:['Escolha do Caminho','Habilidade de Caminho'],
        5:['Campo Fértil','Marca do Herói'],
        7:['Habilidade de Caminho'],
        10:['Vinhas'],
        12:['Habilidade de Caminho'],
        15:['Estação de Fartura'],
        17:['Habilidade de Caminho'],
        20:['Poder Supremo: O Ano Que Não Veio']
      },
      abilities:[
        ability(1,'Dom','Passiva',null,'Passiva','Cria comida e água, ignora terreno difícil causado por plantas e sente tudo que toca o solo a até 18 m.'),
        ability(1,'Espinho','E',1,'Ação','Um alvo a 12 m sofre 1d10 Perfurante e uma Semente de Crescimento brota no ponto. O dano aumenta para 2d10 no nível 5, 3d10 no 11 e 4d10 no 17.'),
        ability(2,'Semente Teimosa','Passiva',null,'Escolha permanente','Escolha Raiz, Espinho ou Fruto. Raiz aumenta o raio inicial das zonas em 3 m e protege contra Fogo não mágico. Espinho causa 1d8 Perfurante à primeira criatura que entra na zona a cada turno e reduz a velocidade em 3 m. Fruto cura 1d6 PV em um aliado que começa o turno na zona, uma vez por turno por aliado.'),
        ability(5,'Campo Fértil','C',4,'Ação','Cria uma zona de Crescimento de 4,5 m por 1 minuto. Aliados que terminam o turno nela recuperam 1d8 PV.'),
        ability(10,'Vinhas','B',6,'Ação','Inimigos na sua área de Crescimento fazem TR de FOR ou ficam Restritos por 1 rodada.'),
        ability(15,'Estação de Fartura','A',8,'Ação, concentração por 1 minuto','Um raio de 9 m a até 18 m vira um bosque vivo que cresce 3 m por turno, até 24 m. Inimigos enfrentam terreno difícil e Desvantagem para atacar quem está dentro. Aliados recebem cobertura leve e recuperam 2d6 PV no início do turno. No fim do seu turno, um inimigo faz TR de FOR ou fica Agarrado.'),
        ability(20,'O Ano Que Não Veio','Lendário',24,'Ação, 1 hora','1 vez por arco. Num raio de 1,5 km, escolha Fartura ou Fome e possa inverter uma vez. Fartura dobra curas e protege contra fome, sede e frio. Fome causa Exaustão, impede recuperação por descanso e apodrece recursos. Ao terminar, você não pode usar habilidades de cura até o próximo Descanso Longo.')
      ],
      paths:[
        {id:'colheita',name:'Caminho da Colheita',summary:'A abundância e a cura sustentada.',status:'complete',abilities:[
          ability(3,'Cura da Colheita','D',2,'Ação','Um aliado a até 18 m recupera 3d8 PV.'),
          ability(7,'Bênção da Colheita','B',6,'Ação','Até 3 aliados a 12 m ganham PV Temporários iguais ao seu nível.'),
          ability(12,'Fartura','A',8,'Ação','Aliados na zona de Crescimento recuperam um total de 4d8 PV distribuídos.'),
          ability(17,'Ano de Fartura','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, cada aliado dentro da sua área de Crescimento recupera 2d8 PV por turno.')
        ]},
        {id:'estacoes',name:'Caminho das Estações',summary:'O ciclo eterno alterna cura, dano e controle.',status:'complete',abilities:[
          ability(3,'Ciclo','D',2,'Ação','Escolha Primavera para curar um aliado em 2d8 PV ou Outono para causar 2d8 Necrótico e impor Desvantagem por 1 rodada.'),
          ability(7,'Geada','B',6,'Ação','Uma área de 6 m vira terreno gelado. Inimigos ficam Lentos, com metade da velocidade, por 1 rodada.'),
          ability(12,'Ciclo Acelerado','A',8,'Ação, 1 minuto','Por 1 minuto, as estações se aceleram e alternam efeitos de renovação e definhamento a cada turno.'),
          ability(17,'Equinócio','S',12,'Ação','2 usos por dia. Aliados a 12 m recuperam 4d8 PV e removem condições; inimigos a 12 m sofrem 6d8 Necrótico e enfrentam terreno difícil.')
        ]},
        {id:'terra',name:'Caminho da Terra',summary:'O solo que devora. Transforma o terreno em arma, restringe deslocamentos e retira inimigos do combate.',status:'complete',abilities:[
          ability(3,'Lama','D',2,'Ação','Amolece o chão em uma área de 4,5 m. Inimigos fazem TR de FOR ou ficam Restritos por 1 rodada. Dentro de uma zona de plantas sua, a área aumenta para 6 m.'),
          ability(7,'Terra Movediça','B',6,'Ação','Cria uma área de 6 m de terreno difícil que engole os pés dos inimigos. Quem falha no TR de FOR fica preso até conseguir se soltar. Dentro de uma zona de plantas sua, o TR é feito com Desvantagem.'),
          ability(12,'Abismo de Raízes','A',8,'Ação','Raízes irrompem em uma área de 6 m, causam 5d8 de dano Perfurante e agarram os alvos; TR de FOR evita ficar Restrito. Dentro de uma zona de plantas sua, causa +1d8 de dano.'),
          ability(17,'A Terra Reclama','S',12,'Ação','2 usos por dia. O solo se abre sob inimigos em uma área de 9 m. No fracasso em TR de DES, são engolidos, ficam Restritos e fora de combate até cavarem a saída, sofrendo 6d8 de dano. Suas zonas de plantas contam como parte da área.')
        ]}
      ]
    }),
    'Dionísio':overview('dionisio','Dionísio','🍇','Vinho, loucura e êxtase.','Caos, debilitação em área e frenesi.'),
    'Ártemis':overview('artemis','Ártemis','🏹','Devoção, caça e lua.','Arqueira de matilha com regras especiais de Voto.',{specialNature:'Voto de Ártemis'}),
    'Hécate':overview('hecate','Hécate','☾☽☾','Magia, Névoa e encruzilhadas.','Conjuradora flexível.'),
    'Íris':overview('iris','Íris','🌈','Luz, arco-íris e mensagens.','Suporte modal de luz.'),
    'Hipnos':overview('hipnos','Hipnos','🪶','Sono e torpor.','Controle por sono.'),
    'Morfeu':overview('morfeu','Morfeu','☁','Sonhos e ilusões.','Controle ilusório.'),
    'Tique':overview('tique','Tique','🎲','Sorte e acaso.','Sorte coletiva.'),
    'Éolo':overview('eolo','Éolo','🌀','Ventos e ar.','Controle de zona por vento.'),
    'Circe':overview('circe','Circe','⚗','Feitiço e transformação.','Transmutadora com reagentes.'),
    'Eros':overview('eros','Eros','🏹♥','Desejo e vínculos.','Manipulador de laços.'),
    'Nyx':overview('nyx','Nyx','✦','Noite, trevas e medo.','Controladora das trevas.'),
    'Nêmesis':overview('nemesis','Nêmesis','⚖','Vingança e equilíbrio.','Vingadora de atrito.'),
    'Nike':overview('nike','Nike','🪽','Vitória e ímpeto.','Suporte de momentum.'),
    'Tânatos':overview('tanatos','Tânatos','🕯','Morte gentil.','Executor.'),
    'Perséfone':overview('persefone','Perséfone','🌺','Primavera e Submundo.','Híbrido de cura e morte.'),
    'Hebe':overview('hebe','Hebe','🏺','Juventude e vigor.','Sustentação pura por Vigor.')
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function getCatalogAffiliation(name){return affiliations[name]?clone(affiliations[name]):null;}
  function getAffiliation(name){var entry=affiliations[name];return entry&&entry.mechanicalStatus==='complete'?clone(entry):null;}
  function listAffiliations(){return Object.keys(affiliations).map(function(name){return clone(affiliations[name]);});}
  function listCompleteAffiliations(){return listAffiliations().filter(function(entry){return entry.mechanicalStatus==='complete';});}

  global.SemideusesRulesDatabase={
    version:'3e-rules-db-0.4.0',edition:'3e',affiliations:affiliations,
    getAffiliation:getAffiliation,getCatalogAffiliation:getCatalogAffiliation,
    listAffiliations:listAffiliations,listCompleteAffiliations:listCompleteAffiliations
  };
})(window);
