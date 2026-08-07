(function(global){
  'use strict';
  var db=global.SemideusesRulesDatabase;
  if(!db)return;

  function skill(id,name,axis,rank,cost,minLevel,action,effect,extra){
    return Object.assign({id:id,name:name,axis:axis,rank:rank,cost:cost,minLevel:minLevel,action:action,effect:effect,source:'Livro do Jogador 3e · Cap. 11'},extra||{});
  }

  var skills=[
    skill('estocada-elemental','Estocada Elemental','Dano','E',1,1,'Ação','Um dardo do elemento escolhido atinge um alvo a até 9 m e causa 2d6 de dano do tipo temático escolhido.'),
    skill('golpe-do-colosso','Golpe do Colosso','Dano','D',2,1,'Ação','Um golpe corpo a corpo devastador causa 5d6 de dano a um alvo ao alcance.'),
    skill('explosao-radiante','Explosão Radiante','Dano','C',4,5,'Ação','Escolha um ponto a até 9 m. Uma esfera de 3 m causa 3d6 de dano; TR de DES reduz à metade.'),
    skill('lanca-perfurante','Lança Perfurante','Dano','B',6,5,'Ação','Uma linha de 9 m causa 5d6 de dano a cada criatura atingida; TR de DES reduz à metade.'),
    skill('lamina-do-ocaso','Lâmina do Ocaso','Dano','A',8,9,'Ação','Um alvo a até 9 m que esteja abaixo da metade dos PV sofre 12d6 de dano.'),

    skill('alento','Alento','Cura','E',1,1,'Ação Bônus','Um aliado tocado recupera 1d6 PV.'),
    skill('toque-restaurador','Toque Restaurador','Cura','D',2,1,'Ação','Um aliado a até 9 m recupera 3d6 PV.'),
    skill('prece-compartilhada','Prece Compartilhada','Cura','C',4,5,'Ação','Até 3 aliados a até 9 m recuperam 3d6 PV cada.'),
    skill('folego-do-campo','Fôlego do Campo','Cura','B',6,5,'Ação · Concentração, 1 min','Crie um círculo de 3 m. Aliados que começam o turno dentro recuperam 2d6 PV. Conta como Bênção.',{concentration:true,blessing:true}),
    skill('milagre-menor','Milagre Menor','Cura','A',8,9,'Ação','Todos os aliados a até 9 m recuperam 4d6 PV.'),

    skill('rasteira-arcana','Rasteira Arcana','Controle','E',1,1,'Ação','Uma criatura a até 9 m faz TR de FOR; na falha, fica Caída.'),
    skill('grilhoes','Grilhões','Controle','D',2,1,'Ação','Um alvo a até 9 m faz TR de FOR; na falha, fica Restrito por 1 rodada.'),
    skill('nevoa-entorpecente','Névoa Entorpecente','Controle','C',4,5,'Ação','Uma área de 3 m força TR de CON; quem falhar fica Lento por 1 rodada.'),
    skill('concussao-ressonante','Concussão Ressonante','Controle','B',6,5,'Ação','Um alvo a até 9 m faz TR de CON; na falha, fica Atordoado por 1 rodada. No sucesso, fica Lento por 1 rodada.'),
    skill('prisao-de-eter','Prisão de Éter','Controle','A',8,9,'Ação','Até 3 alvos a até 9 m fazem TR de FOR; na falha, ficam Restritos por 1 minuto e repetem o TR ao fim de cada turno.'),

    skill('guarda-instintiva','Guarda Instintiva','Defesa','E',1,1,'Reação','Quando um ataque é declarado contra você, ganhe +2 de CA contra esse ataque.'),
    skill('pele-de-pedra','Pele de Pedra','Defesa','D',2,1,'Ação Bônus','Ganhe 2d6 PV Temporários.'),
    skill('broquel-de-luz','Broquel de Luz','Defesa','C',4,5,'Reação','Quando um ataque atingir você, reduza o dano em 5d6.'),
    skill('barreira-espelhada','Barreira Espelhada','Defesa','B',6,5,'Ação, 1 min','Você e um aliado adjacente recebem +2 de CA por 1 minuto. Conta como Bênção.',{blessing:true}),
    skill('santuario-momentaneo','Santuário Momentâneo','Defesa','A',8,9,'Reação','Um ataque que acabou de acertar você ou um aliado a até 9 m causa 0 de dano.',{usage:{scope:'combat',max:1}}),

    skill('truque-prestidigital','Truque Prestidigital','Utilidade','E',1,1,'Ação','Produza um pequeno efeito sensorial ou físico: som a 9 m, faísca, acender/apagar chama ou mover objeto leve até 3 m.'),
    skill('eco-do-passado','Eco do Passado','Utilidade','D',2,1,'Ação','Ao tocar um objeto, perceba um vislumbre da última hora dele: quem o segurou e o que ocorreu por perto.'),
    skill('sentidos-agucados','Sentidos Aguçados','Utilidade','C',4,5,'Ação Bônus, 1 min','Por 1 minuto, ganhe Vantagem em Percepção e Investigação e enxergue em Escuridão Total. Conta como Bênção.',{blessing:true}),
    skill('elo-mental','Elo Mental','Utilidade','B',6,5,'Ação, 10 min','Até 5 aliados comunicam-se silenciosamente a até 100 m e não podem ser Surpreendidos enquanto o elo durar.'),
    skill('quebra-encanto','Quebra-Encanto','Utilidade','A',8,9,'Ação','Encerre um efeito mágico ativo em um alvo a até 9 m, ou suprima uma zona mágica por 1 rodada.'),

    skill('impulso-etereo','Impulso Etéreo','Mobilidade','E',1,1,'Ação Bônus','Ganhe +3 m de deslocamento neste turno.'),
    skill('passo-fantasma','Passo Fantasma','Mobilidade','D',2,1,'Ação Bônus','Seu movimento neste turno não provoca Ataques de Oportunidade.'),
    skill('salto-olimpico','Salto Olímpico','Mobilidade','C',4,5,'Ação Bônus','Salte até 9 m em qualquer direção sem provocar Ataques de Oportunidade e aterrisse ileso de até 9 m de altura.'),
    skill('corrente-de-vento','Corrente de Vento','Mobilidade','B',6,5,'Ação Bônus','Teleporte-se até 9 m para um ponto que possa ver.'),
    skill('marcha-eterea','Marcha Etérea','Mobilidade','A',8,9,'Ação · Concentração, 1 min','Você e um aliado adjacente recebem voo de 9 m por 1 minuto. Conta como Bênção.',{concentration:true,blessing:true}),

    skill('furia-do-firmamento','Fúria do Firmamento','Clímax','S',12,13,'Ação','Escolha um ponto a até 18 m. Uma esfera de 6 m causa 9d6 de dano; TR de DES reduz à metade.',{usage:{scope:'day',max:2}}),
    skill('ressurgencia','Ressurgência','Clímax','S',12,13,'Ação','Todos os aliados a até 9 m recuperam 6d6 PV. Aliados a 0 PV acordam normalmente pela cura.',{usage:{scope:'day',max:2}})
  ];

  function clone(value){return JSON.parse(JSON.stringify(value));}
  db.skills=skills;
  db.getSkill=function(nameOrId){var found=skills.find(function(item){return item.id===nameOrId||item.name===nameOrId;});return found?clone(found):null;};
  db.listSkills=function(){return skills.map(clone);};
  db.skillsByRank=function(rank){return skills.filter(function(item){return item.rank===rank;}).map(clone);};
  db.version='3e-rules-db-0.31.0';
})(window);