(function(global){
  'use strict';

  var affiliations={
    'Deméter':{
      id:'demeter',
      name:'Deméter',
      title:'A Senhora do Campo',
      icon:'🌾',
      domain:'Colheita, natureza e estações.',
      profile:'Controle de terreno e cura.',
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
    }
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function getAffiliation(name){return affiliations[name]?clone(affiliations[name]):null;}
  function listAffiliations(){return Object.keys(affiliations).map(function(name){return getAffiliation(name);});}

  global.SemideusesRulesDatabase={
    version:'3e-rules-db-0.1.0',
    edition:'3e',
    affiliations:affiliations,
    getAffiliation:getAffiliation,
    listAffiliations:listAffiliations
  };
})(window);
