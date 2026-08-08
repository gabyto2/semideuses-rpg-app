(function(global){
  'use strict';

  var ORIGINS=[
    {
      id:'semideus-grego',name:'Semideus Grego',group:'Semideus',implemented:true,
      summary:'Filho de mortal e divindade do Olimpo. Usa Filiação, Mana ou recurso próprio, Caminho Divino e Marca do Herói.',
      sourcePages:'19–23'
    },
    {
      id:'satiro-fauno',name:'Sátiro / Fauno',group:'Heróis Além do Sangue',implemented:false,
      summary:'Protetor da natureza e busca-sangue: mobilidade, exploração, controle de terreno e apoio.',
      sourcePages:'24–25'
    },
    {
      id:'ciclope',name:'Ciclope',group:'Heróis Além do Sangue',implemented:false,
      summary:'Bruto da forja: força, resistência e poderes físicos por Descanso, sem Mana.',
      sourcePages:'25–26'
    },
    {
      id:'mortal-vidente',name:'Mortal Vidente',group:'Heróis Além do Sangue',implemented:false,
      summary:'Humano que enxerga através da Névoa e compensa a falta de Mana com perícias, Talentos, Sorte e preparo.',
      sourcePages:'26–27'
    },
    {
      id:'legado',name:'Legado',group:'Heróis Além do Sangue',implemented:false,
      summary:'Descendente de semideus com sangue diluído: menos poder mágico e mais versatilidade marcial.',
      sourcePages:'27–29'
    }
  ];

  function clone(value){return JSON.parse(JSON.stringify(value));}
  global.SemideusesOriginCatalog={
    version:'player-book-3e-pages-19-29',
    source:'Livro do Jogador — Semideuses RPG 3e',
    list:function(){return clone(ORIGINS);},
    get:function(idOrName){var value=ORIGINS.find(function(origin){return origin.id===idOrName||origin.name===idOrName;});return value?clone(value):null;}
  };
})(window);
