(function(global){
  'use strict';

  function overview(id,name,icon,domain,profile,extra){
    var entry={
      id:id,name:name,icon:icon,domain:domain,profile:profile,
      mechanicalStatus:'overview',paths:[],progression:{},
      skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],savingThrows:[]
    };
    if(extra)Object.keys(extra).forEach(function(key){entry[key]=extra[key];});
    return entry;
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
        summary:'Habilidades que plantam uma Semente criam zonas vegetais que crescem, dificultam o movimento inimigo e protegem aliados.',
        maxZonesByLevel:{1:3,11:5}
      },
      progression:{
        1:['Dom','Assinatura','Semente'],
        2:['Raiz'],
        3:['Escolha do Caminho','Habilidade de Caminho'],
        5:['Campo Fértil','Marca do Herói'],
        7:['Habilidade de Caminho'],
        10:['Terra-Mãe'],
        12:['Habilidade de Caminho'],
        15:['Colheita Sem Fim'],
        17:['Habilidade de Caminho'],
        20:['Poder Supremo']
      },
      paths:[
        {id:'colheita',name:'Caminho da Colheita',summary:'Aprofunda a cura sustentada e transforma as zonas de Crescimento em fontes de recuperação para o grupo.'},
        {id:'estacoes',name:'Caminho das Estações',summary:'Usa o ciclo natural para alternar entre renovação, dano, controle e efeitos de terreno.'},
        {id:'terra',name:'Caminho da Terra',summary:'Fortalece o controle do solo, raízes e obstáculos, prendendo inimigos e dominando o campo.'}
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
  function getAffiliation(name){
    var entry=affiliations[name];
    return entry&&entry.mechanicalStatus==='complete'?clone(entry):null;
  }
  function listAffiliations(){return Object.keys(affiliations).map(function(name){return clone(affiliations[name]);});}
  function listCompleteAffiliations(){return listAffiliations().filter(function(entry){return entry.mechanicalStatus==='complete';});}

  global.SemideusesRulesDatabase={
    version:'3e-rules-db-0.2.0',
    edition:'3e',
    affiliations:affiliations,
    getAffiliation:getAffiliation,
    getCatalogAffiliation:getCatalogAffiliation,
    listAffiliations:listAffiliations,
    listCompleteAffiliations:listCompleteAffiliations
  };
})(window);
