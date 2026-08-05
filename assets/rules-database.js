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
    'Zeus':overview('zeus','Zeus','⚡','Céu, raios e autoridade.','Dano bruto, corpo a corpo e à distância.'),
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
    version:'3e-rules-db-0.3.1',edition:'3e',affiliations:affiliations,
    getAffiliation:getAffiliation,getCatalogAffiliation:getCatalogAffiliation,
    listAffiliations:listAffiliations,listCompleteAffiliations:listCompleteAffiliations
  };
})(window);
