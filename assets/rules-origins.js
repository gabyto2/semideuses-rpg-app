(function(global){
  'use strict';

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function slug(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
  function ability(level,name,rank,cost,action,effect,extra){return Object.assign({id:slug(name),level:level,name:name,rank:rank,cost:cost,action:action,effect:effect},extra||{});}
  function usage(max,scope){return {max:max,scope:scope};}

  var ORIGINS=[
    {
      id:'semideus-grego',name:'Semideus Grego',icon:'⚜',group:'Semideus',implemented:true,requiresAffiliation:true,
      summary:'Filho de mortal e divindade do Olimpo. Usa Filiação, Mana ou recurso próprio, Caminho Divino e Marca do Herói.',
      sourcePages:'19–23',attributeBonus:{plus2:1,plus1:1},marks:['Ataque Extra','Bônus de Conjuração']
    },
    {
      id:'satiro-fauno',name:'Sátiro / Fauno',icon:'♬',group:'Heróis Além do Sangue',implemented:true,requiresAffiliation:false,
      summary:'Protetor da natureza e busca-sangue: mobilidade, exploração, controle de terreno e apoio.',sourcePages:'24–25',
      fixedPath:'Caminho da Natureza Selvagem',marks:['Ataque Extra','Bônus de Conjuração'],
      choices:{expertise:['Atletismo','Acrobacia']},
      rules:{
        title:'O protetor da natureza e busca-sangue',profile:'Mobilidade, exploração, controle de terreno e apoio.',
        casting:'SAB',hitDie:8,savingThrows:['DES','SAB'],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:['Armaduras leves'],
        primary:{id:'mp',label:'MP Natural',kind:'pool',usesMana:true,costLabel:'MP',formula:'mana',recovery:{shortRest:{type:'fractionMax',value:.25},longRest:'max'}},
        speed:9,talentBase:1,
        progression:{1:['Pés de Bode','Empatia Selvagem','Busca-Sangue'],2:['Trilha do Bosque'],3:['Cipós Agarrantes','Canção do Pânico'],5:['Marca do Herói'],7:['Bênção da Floresta'],12:['Fúria de Pã'],15:['O Rebanho de Pã'],17:['Coração da Mata'],20:['Coração de Pã']},
        abilities:[
          ability(1,'Pés de Bode','Passiva',null,'Passiva','Sua velocidade aumenta em 3 m, você ignora terreno difícil natural e tem deslocamento de escalada igual à sua velocidade. Você recebe Especialização em Atletismo ou Acrobacia.'),
          ability(1,'Empatia Selvagem','Passiva',null,'Passiva','Você fala com animais e plantas e tem Vantagem em Lidar com Animais e Natureza. Animais comuns raramente o veem como ameaça.'),
          ability(1,'Busca-Sangue','Passiva',null,'Passiva','Você sente a presença de semideuses e monstros a até 1 km e pode rastrear o cheiro divino deles.'),
          ability(2,'Trilha do Bosque','Passiva',null,'Passiva','Ao viajar por mata, montanha ou campo, você e até 5 companheiros ignoram terreno difícil natural e não podem ser surpreendidos por criaturas terrestres. Uma vez por dia, aponte a direção do abrigo, água potável ou saída mais próxima; o Mestre responde a verdade. Na primeira rodada de combate, sua velocidade é dobrada.'),
          ability(20,'Coração de Pã','Feito de origem',0,'Ação · 1 minuto','Por 1 minuto, a vegetação obedece a você em 18 m: terreno difícil para inimigos, cobertura e cura de 2d8 por turno para aliados que terminam o turno na área.',{usage:usage(1,'day')})
        ],
        paths:[{id:'natureza-selvagem',name:'Caminho da Natureza Selvagem',summary:'A mata viva atrasa, assusta, cura e transforma o terreno em aliado.',abilities:[
          ability(3,'Cipós Agarrantes','D',2,'Ação','Raízes irrompem em 3 m: TR de FOR ou Restrito até o fim do próximo turno; quem falha sofre 2d6 Perfurante. +1d6 nos níveis 7, 12 e 17.'),
          ability(3,'Canção do Pânico','C',4,'Ação','Você toca a flauta de Pã: inimigos em cone de 9 m fazem TR de SAB ou ficam Apavorados por 1 rodada e fogem.'),
          ability(7,'Bênção da Floresta','B',6,'Ação Bônus','Você e aliados a 9 m recuperam 3d8 PV no total e ganham +3 m de velocidade por 1 rodada.'),
          ability(12,'Fúria de Pã','A',8,'Ação','Inimigos em 12 m fazem TR de SAB. Na falha, ficam Apavorados por 1 rodada e sofrem 2d8 Psíquico; quem falhar por 5 ou mais também fica Atordoado por 1 rodada.'),
          ability(15,'O Rebanho de Pã','A',8,'Ação · 1 minuto','Javali, urso e lince espectrais surgem a até 12 m e agem juntos na sua Iniciativa. Cada um tem CA 15, 35 PV, deslocamento 12 m e ataque +9 que causa 2d8+3 Perfurante. O javali derruba com TR de FOR. Inimigos Apavorados por você não conseguem se aproximar enquanto o rebanho estiver em campo.'),
          ability(17,'Coração da Mata','S',12,'Ação · 1 minuto','Por 1 minuto, plantas em 18 m viram terreno difícil para inimigos; você e aliados recuperam 2d6 PV no início de cada turno; suas habilidades de Sátiro custam metade do MP.')
        ]}]
      }
    },
    {
      id:'ciclope',name:'Ciclope',icon:'◉',group:'Heróis Além do Sangue',implemented:true,requiresAffiliation:false,
      summary:'Bruto da forja: força, resistência e poderes físicos por Descanso, sem Mana.',sourcePages:'25–26',
      marks:['Ataque Extra'],
      rules:{
        title:'O bruto da forja — força que dobra ferro',profile:'Força, resistência, combate próximo e trabalho de forja.',
        casting:'FOR',hitDie:12,savingThrows:['FOR','CON'],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:['Armaduras médias','Armaduras leves','Escudos'],
        primary:{id:'rest-uses',label:'Poderes por Descanso',kind:'none',usesMana:false,costLabel:'uso',formula:'none',recovery:{}},
        naturalArmorBonus:2,carryingMultiplier:2,unarmedDamage:'1d10',improvisedDamage:'1d10',talentBase:1,passiveSkillsOnly:true,
        progression:{1:['Força Sobre-humana','Couro Grosso','Mãos de Forja','Olho Único'],2:['Bigorna de Campo'],3:['Arremesso Brutal'],5:['Marca do Herói: Ataque Extra'],7:['Pancada Sísmica'],12:['Pele de Ferro'],15:['Martelo de Montanha'],17:['Fúria do Ciclope'],20:['Filho da Forja Primeira']},
        abilities:[
          ability(1,'Força Sobre-humana','Passiva',null,'Passiva','Você tem Vantagem em testes de Força, dobra a capacidade de carga e seus ataques desarmados ou com objetos improvisados causam 1d10. Você empurra e agarra como se fosse uma categoria maior.'),
          ability(1,'Couro Grosso','Passiva',null,'Passiva','Sua pele é armadura natural: +2 na CA quando sem armadura e Resistência a dano Concussivo.'),
          ability(1,'Mãos de Forja','Passiva',null,'Passiva','Proficiência com Especialização em ferramentas de ferreiro; você conserta e forja na metade do tempo.'),
          ability(1,'Olho Único','Passiva',null,'Passiva','Você tem Desvantagem em ataques à distância contra alvos a mais de 18 m.'),
          ability(2,'Bigorna de Campo','—',0,'Ação Bônus','Escolha: repare uma arma, armadura ou escudo danificado a até 1,5 m; ganhe PV Temporários iguais ao seu nível; ou faça a arma de um aliado causar +2d6 Ígneo no próximo ataque.',{usage:usage(2,'longRest')}),
          ability(3,'Arremesso Brutal','—',0,'Ação','Arremesse um objeto pesado ou criatura agarrada até 9 m: 3d10 Concussivo e o alvo cai; TR de FOR reduz à metade e evita cair. +1d10 nos níveis 7, 12 e 17.',{usage:usage(3,'longRest')}),
          ability(7,'Pancada Sísmica','—',0,'Ação','Criaturas em 4,5 m fazem TR de DES ou caem e sofrem 4d8 Concussivo.',{usage:usage(2,'longRest')}),
          ability(12,'Pele de Ferro','—',0,'Ação Bônus · 1 minuto','Por 1 minuto, você ganha Resistência a dano Cortante e Perfurante e PV Temporários iguais ao dobro do seu nível.',{usage:usage(2,'longRest')}),
          ability(15,'Martelo de Montanha','—',0,'Ação','Linha de 12 m × 3 m: 10d10 Concussivo; TR de FOR reduz à metade. Quem falha fica Caído e Atordoado, repetindo TR de CON no fim dos turnos. O chão vira terreno difícil e estruturas não mágicas de até 3 m desabam.',{usage:usage(1,'longRest')}),
          ability(17,'Fúria do Ciclope','—',0,'Ação','Faça três ataques corpo a corpo com Vantagem, cada um causando +2d10. Alvos reduzidos a 0 PV explodem em uma onda de 3d10 aos adjacentes.',{usage:usage(1,'longRest')}),
          ability(20,'Filho da Forja Primeira','Feito de origem',0,'Ação Bônus · 1 minuto','Por 1 minuto, seus ataques contam como míticos e causam +2d6 Ígneo, você tem Resistência a Ígneo e pode consertar um objeto quebrado com um toque uma vez por turno.',{usage:usage(1,'day')})
        ],paths:[]
      }
    },
    {
      id:'mortal-vidente',name:'Mortal Vidente',icon:'👁',group:'Heróis Além do Sangue',implemented:true,requiresAffiliation:false,
      summary:'Humano que enxerga através da Névoa e compensa a falta de Mana com perícias, Talentos, Sorte e preparo.',sourcePages:'26–27',
      marks:['Ataque Extra'],choices:{keyAttribute:['FOR','DES','CON','INT','SAB','CAR'],skillCount:2,professions:['Investigador','Mecânico','Sobrevivente']},
      rules:{
        title:'O humano que enxerga o que não deveria',profile:'Clareza, engenho, perícia, preparo e sorte.',
        casting:'INT',hitDie:8,savingThrows:['INT','CAR'],skillProficiencies:[],weaponProficiencies:['Armas e ferramentas improvisadas'],armorProficiencies:['Armaduras médias','Armaduras leves'],
        primary:{id:'luck',label:'Pontos de Sorte',kind:'pool',usesMana:false,costLabel:'Ponto de Sorte',formula:'proficiency',recovery:{shortRest:{type:'profession'},longRest:'max'}},
        talentBase:2,talentBonusLevels:[6,11,16],passiveSkillsOnly:true,
        progression:{1:['Visão Clara','Sorte do Mortal','Engenhosidade Humana','Improviso'],2:['Ofício de Mortal'],3:['Reflexo de Sobrevivência'],5:['Marca do Herói: Ataque Extra'],7:['Adrenalina'],12:['Olho do Caçador'],15:['O Plano B'],17:['Lenda Improvável'],20:['Olhos Totalmente Abertos']},
        abilities:[
          ability(1,'Visão Clara','Passiva',null,'Passiva','Você enxerga através da Névoa, vê monstros e deuses como realmente são, tem Vantagem contra ilusões e nunca é enganado por disfarces da Névoa.'),
          ability(1,'Sorte do Mortal','Passiva',null,'Passiva','Você tem Pontos de Sorte iguais ao Bônus de Proficiência, recuperados no Descanso Longo. Gaste 1 para rolar novamente qualquer d20 seu ou forçar um inimigo a rolar novamente um ataque contra você.'),
          ability(1,'Engenhosidade Humana','Passiva',null,'Passiva','Você começa com 2 Talentos no nível 1, ganha um Talento extra nos níveis 6, 11 e 16 e possui duas perícias treinadas adicionais.'),
          ability(1,'Improviso','Passiva',null,'Passiva','Você tem proficiência com armas e ferramentas improvisadas e Vantagem ao usar tecnologia mortal de forma criativa contra o sobrenatural.'),
          ability(2,'Ofício de Mortal','Passiva',null,'Escolha após Descanso Longo','Escolha Investigador, Mecânico ou Sobrevivente. Investigador recebe Especialização em Investigação e pode examinar uma cena por 1 minuto para obter uma resposta de sim ou não. Mecânico opera e sabota máquinas com Vantagem e improvisa um dispositivo 1 vez por dia. Sobrevivente recupera 1 Ponto de Sorte no Descanso Curto e soma 1d4 ao gastar Sorte.'),
          ability(3,'Reflexo de Sobrevivência','—',0,'Reação','Quando for alvo de um ataque que enxerga, imponha Desvantagem; se acertar, você sofre metade do dano.',{usage:usage(1,'round')}),
          ability(7,'Adrenalina','—',0,'Ação Bônus','Você ganha uma Ação adicional neste turno.',{usage:usage(2,'longRest')}),
          ability(12,'Olho do Caçador','Passiva',null,'Passiva','Depois de estudar um inimigo por 1 rodada, seus ataques contra ele causam +2d8 e ignoram Resistência a dano físico até o fim do combate.'),
          ability(15,'O Plano B','—',0,'Ação Bônus · 1 minuto','Por 1 minuto, em 18 m, cada aliado pode refazer a primeira falha em teste, Teste de Resistência ou ataque, ficando com o segundo resultado. Você não pode ser surpreendido nem flanqueado durante o efeito.',{usage:usage(1,'longRest')}),
          ability(17,'Lenda Improvável','—',0,'Especial','Trate qualquer rolagem sua ou de um aliado a 9 m como 20 natural; o efeito acontece da forma mais espetacular possível.',{usage:usage(1,'longRest')}),
          ability(20,'Olhos Totalmente Abertos','Feito de origem',0,'Ação Bônus · 1 minuto','Por 1 minuto, você tem Vantagem em todos os testes e ataques; ataques contra você têm Desvantagem. Uma vez durante o efeito, declare “eu já vi isso” e um ataque ou efeito que o atingiria erra.',{usage:usage(1,'day')})
        ],paths:[]
      }
    },
    {
      id:'legado',name:'Legado',icon:'⚔',group:'Heróis Além do Sangue',implemented:true,requiresAffiliation:true,
      summary:'Descendente de semideus com sangue diluído: menos poder mágico e mais versatilidade marcial.',sourcePages:'27–29',
      marks:['Ataque Extra','Bônus de Conjuração'],choices:{skillCount:2},
      rules:{
        title:'O sangue diluído de Nova Roma',profile:'Versatilidade marcial com uma herança divina reduzida.',
        primary:{id:'mp',label:'MP Diluído',kind:'pool',usesMana:true,costLabel:'MP',formula:'legacyMana',recovery:{shortRest:{type:'fractionMax',value:.25},longRest:'max'}},
        talentBase:2,maxSkillRank:'S',pathLevelMap:{3:5,7:9,12:14,17:19},hitDieStepDown:true,dilutedSignature:true,
        progression:{1:['Sangue Diluído','Herança Tênue','Assinatura Diluída','Versatilidade Romana','Disciplina de Legião'],2:['Escudo do Camarada'],5:['Habilidade de Caminho atrasada','Marca do Herói'],9:['Habilidade de Caminho atrasada'],14:['Habilidade de Caminho atrasada'],15:['A Águia da Legião'],19:['Habilidade de Caminho atrasada'],20:['Sangue que Desperta']},
        abilities:[
          ability(1,'Sangue Diluído','Passiva',null,'Passiva','Você escolhe uma Filiação, recebe o Dom, a habilidade base de nível 1 e acesso a um Caminho. As habilidades do Caminho chegam nos níveis 5, 9, 14 e 19.'),
          ability(1,'Herança Tênue','Passiva',null,'Passiva','Seu MP máximo usa a progressão reduzida do Legado. Você não alcança os Ranks SS e Lendário.'),
          ability(1,'Assinatura Diluída','Passiva',null,'Passiva','Reservas, tetos e marcadores da Assinatura têm metade do máximo, arredondado para cima; ganhos em dobro viram ganhos simples.'),
          ability(1,'Versatilidade Romana','Passiva',null,'Passiva','Você ganha 1 Talento extra no nível 1, duas perícias treinadas adicionais e pode escolher Talentos de qualquer categoria.'),
          ability(1,'Disciplina de Legião','Passiva',null,'Passiva','Você tem Vantagem em Testes de Resistência contra medo e em testes para manter a compostura sob pressão.'),
          ability(2,'Escudo do Camarada','—',0,'Reação','Quando um aliado a até 1,5 m for alvo de um ataque, tome o ataque para si ou conceda +2 na CA contra ele. Se errar por causa disso, você e o aliado recebem +1 em ataques até o fim do seu próximo turno.',{usage:usage(1,'round')}),
          ability(15,'A Águia da Legião','A',8,'Ação','Finca um estandarte a até 9 m até o fim do combate (CA 16, 40 PV). Em 9 m, aliados são imunes a Apavorado, recebem +1 em ataques e Testes de Resistência e recuperam 1d6 PV no início do turno. Sua Assinatura gera recurso no ritmo cheio, mantendo o teto pela metade.'),
          ability(20,'Sangue que Desperta','Feito de origem',0,'Ação Bônus · 1 minuto','Por 1 minuto, a Assinatura Diluída opera com os tetos cheios da Filiação e, uma vez, você usa uma habilidade de Rank A da Filiação sem pagar MP.',{usage:usage(1,'day')})
        ]
      }
    }
  ];

  function get(idOrName){var value=ORIGINS.find(function(origin){return origin.id===idOrName||origin.name===idOrName;});return value?clone(value):null;}
  global.SemideusesOriginCatalog={
    version:'player-book-3e-pages-19-29-complete',source:'Livro do Jogador — Semideuses RPG 3e',
    list:function(){return clone(ORIGINS);},get:get,
    marksFor:function(idOrName){var origin=get(idOrName);return origin&&origin.marks?origin.marks.slice():[];}
  };
})(window);
