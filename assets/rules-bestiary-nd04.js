(function(global){
  'use strict';

  var THREAT={'1/8':25,'1/4':50,'1/2':100,'1':200,'2':450,'3':700,'4':1100,'5':1800,'6':2300,'7':2900,'8':3900,'9':5000,'10':5900,'11':7200,'12':7200,'13':8400,'14':8400,'15':10000,'16':10000,'17':13000,'18':13000,'19':18000,'20':18000,'21':33000,'22':33000,'23':33000,'24':33000,'25':70000,'26':70000,'27':70000,'28':155000,'29':155000,'30':155000};
  var DATA=[
    {
      id:'estrige',name:'Estrige',type:'Monstro',nd:'1/2',pv:14,ca:13,speed:'3m; voo 18m',page:83,
      description:'Pássaros de bronze que se alimentam de sangue. Individualmente são gerenciáveis; em bando viram uma nuvem de bicos e asas cortantes.',
      attributes:{FOR:'8 (−1)',DES:'16 (+3)',CON:'10 (+0)',INT:'2 (−4)',SAB:'12 (+1)',CAR:'4 (−3)'},
      resistances:['Concussivo de fontes não-mágicas'],senses:['Visão no Escuro 18m','Olfato apurado (sangue)'],skills:['Percepção +3'],
      traits:[
        {name:'Frenesi de Sangue',effect:'Quando uma criatura num raio de 18m estiver abaixo de metade dos PV, todas as Estriges na área têm Vantagem em ataques contra ela.'},
        {name:'Bando',effect:'Quando pelo menos 3 Estriges atacam o mesmo alvo no mesmo turno, o alvo faz TR de CON (CD 12) ou perde 1d4 PV adicionais no início do próximo turno por sangramento.'}
      ],
      actions:[{name:'Bico',effect:'Ataque corpo a corpo +5, alcance 1m. Acerto: 1d4 + 3 Perfurante.'}],
      tactics:'Atacam sempre em grupo, priorizam alvos feridos e fogem se mais de metade do bando for destruída. Funcionam melhor como encontro de desgaste.'
    },
    {
      id:'karpoi',name:'Karpoi',type:'Espírito da colheita corrompido',nd:'1/2',pv:14,ca:12,speed:'9m',page:84,attributes:{DES:'13 (+1)'},
      traits:[{name:'Feito de Palha',effect:'Vulnerável a dano Ígneo.'}],
      actions:[
        {name:'Garras Secas',effect:'Ataque +3, alcance 1m. Acerto: 1d6 + 1 Cortante.'},
        {name:'Emaranhar',effect:'Em grupos de 3 ou mais, o alvo faz TR de FOR (CD 11) ou fica Agarrado por palha e raízes.'}
      ]
    },
    {
      id:'mirmidao',name:'Mirmidão',type:'Constructo vivo',nd:'1/2',pv:18,ca:15,speed:'9m',page:84,attributes:{FOR:'13 (+1)',DES:'12 (+1)',CON:'12 (+1)'},
      resistances:['Concussivo'],immunities:['Veneno','Condição Enfeitiçado'],
      traits:[
        {name:'Carapaça',effect:'Resistência a dano Concussivo; imune a Veneno e à condição Enfeitiçado.'},
        {name:'Mente de Colmeia',effect:'Tem Vantagem em ataques contra um alvo que outro Mirmidão já atacou neste turno.'}
      ],
      actions:[{name:'Mandíbulas',effect:'Ataque +3, alcance 1m. Acerto: 1d6 + 1 Perfurante + 1d4 Ácido.'}]
    },
    {
      id:'ave-estinfalo',name:'Ave de Estínfalo',type:'Monstro',nd:'1',pv:22,ca:13,speed:'voo 15m',page:84,attributes:{DES:'16 (+3)'},
      resistances:['Cortante e Perfurante não-mágicos'],
      traits:[{name:'Penas de Bronze',effect:'Resistência a dano Cortante e Perfurante não-mágicos.'}],
      actions:[
        {name:'Bico de Bronze',effect:'Ataque +5, alcance 1m. Acerto: 1d8 + 3 Perfurante.'},
        {name:'Rajada de Penas',effect:'À distância 18m. TR de DES (CD 13); 2d6 Perfurante na falha. Recarrega 5–6.'}
      ]
    },
    {
      id:'cinocefalo',name:'Cinocéfalo',type:'Humanoide',nd:'1',pv:30,ca:13,speed:'12m',page:84,attributes:{FOR:'15 (+2)',DES:'13 (+1)'},
      traits:[
        {name:'Faro Apurado',effect:'Vantagem em Percepção por olfato; rastreia presas feridas a até 1 km.'},
        {name:'Matilha',effect:'Vantagem em ataques se um aliado estiver a 1,5m do alvo.'}
      ],
      actions:[{name:'Mordida',effect:'Ataque +4, alcance 1m. Acerto: 1d8 + 2 Perfurante; o alvo faz TR de FOR (CD 12) ou cai Caído.'}]
    },
    {
      id:'espirito-vingativo',name:'Espírito Vingativo',type:'Morto-vivo incorpóreo',nd:'1',pv:20,ca:13,speed:'voo 9m; flutua',page:84,attributes:{CAR:'14 (+2)'},
      resistances:['Dano não-mágico'],vulnerabilities:['Divino'],
      traits:[
        {name:'Incorpóreo',effect:'Move-se por criaturas e objetos; resistência a dano não-mágico e Vulnerabilidade a Divino.'},
        {name:'Presença Assombrosa',effect:'Criaturas que iniciem o turno a 3m fazem TR de SAB (CD 12) ou ficam Abaladas.'}
      ],
      actions:[{name:'Toque Gélido',effect:'Ataque +4, alcance 1m. Acerto: 2d6 Necrótico; o PV máximo do alvo é reduzido pelo mesmo valor até um Descanso Longo.'}]
    },
    {
      id:'esqueleto-guerreiro',name:'Esqueleto Guerreiro',type:'Morto-vivo',nd:'1',pv:22,ca:13,speed:'6m',page:85,
      description:'Não sente dor, medo nem recua quando ferido. Destruí-lo completamente é a única opção.',
      attributes:{FOR:'14 (+2)',DES:'14 (+2)',CON:'14 (+2)',INT:'6 (−2)',SAB:'8 (−1)',CAR:'5 (−3)'},
      vulnerabilities:['Concussivo'],immunities:['Veneno','Condição Exausto','Condição Envenenado'],senses:['Visão no Escuro 18m'],
      traits:[{name:'Instinto de Combate',effect:'Ataca o alvo mais próximo que o atacou; se nenhum atacante estiver próximo, ataca o alvo mais próximo em geral.'}],
      actions:[
        {name:'Espada Curta',effect:'Ataque corpo a corpo +4, alcance 1m. Acerto: 1d6 + 2 Perfurante.'},
        {name:'Arco Curto',effect:'Ataque à distância +4, alcance 18/60m. Acerto: 1d6 + 2 Perfurante.'}
      ],
      tactics:'Avança e ataca o mais próximo. Em grupo, rodeia automaticamente. Não sente medo, não recua e não negocia.',
      habitat:'Surge onde necromancia foi praticada, Dentes de Drakon foram plantados ou filhos de Hades o invocaram. Obedece ordens simples; sem invocador, ataca seres vivos.'
    },
    {
      id:'esqueleto-erebo',name:'Esqueleto Guerreiro do Érebo',type:'Morto-vivo',nd:'1',pv:26,ca:14,speed:'9m',page:85,attributes:{FOR:'14 (+2)',DES:'13 (+1)'},
      vulnerabilities:['Divino'],immunities:['Veneno','Psíquico','Condição Enfeitiçado','Condição Apavorado','Condição Envenenado'],
      traits:[
        {name:'Carcaça Implacável',effect:'Imune a Veneno, Psíquico e às condições Enfeitiçado, Apavorado e Envenenado. Vulnerável a dano Divino.'},
        {name:'Formação Cerrada',effect:'+1 na CA enquanto estiver adjacente a outro esqueleto.'}
      ],
      actions:[
        {name:'Espada de Bronze',effect:'Ataque +4, alcance 1m. Acerto: 1d8 + 2 Cortante.'},
        {name:'Lança em Formação',effect:'Ataque +4, alcance 2m. Acerto: 1d6 + 2 Perfurante; pode atacar por cima de um aliado esqueleto.'}
      ]
    },
    {
      id:'mortal-conhecimento',name:'Mortal com Conhecimento',type:'Humanoide',nd:'1–4',pv:null,pvText:'32–72',ca:null,caText:'12–16',speed:'6m',page:85,scalable:true,
      description:'Mortais que conhecem o mundo mítico são imprevisíveis, usam recursos mortais e podem ter aliados que os semideuses não esperam.',
      attributes:{FOR:'12 (+1)',DES:'14 (+2)',CON:'12 (+1)',INT:'16 (+3)',SAB:'14 (+2)',CAR:'14 (+2)'},skills:['Investigação +5','Saber Mítico +5','Persuasão +4, conforme especialidade'],
      traits:[
        {name:'Conhecimento do Mundo Mítico',effect:'Vantagem em Testes de Resistência contra poderes de Filiação que já viu antes.'},
        {name:'Recursos Mortais',effect:'Acesso a tecnologia, redes de contatos e recursos que semideuses frequentemente subestimam.'}
      ],
      actions:[
        {name:'Arma de Fogo',effect:'Ataque à distância +4, alcance 18/54m. Acerto: 2d6 + 2 Perfurante.'},
        {name:'Dispositivo Especial',effect:'Usa um dispositivo tecnológico com efeito equivalente a uma habilidade de Rank C, conforme o Mestre determinar.'},
        {name:'Chamar Reforços',effect:'Chama aliados; 1d4 mortais adicionais chegam em 1d4 rodadas.'}
      ],
      gmNote:'O livro fornece somente faixas de PV, CA e ND. O Mestre deve definir os valores concretos; o app não os deduz automaticamente.'
    },
    {
      id:'harpia',name:'Harpia',type:'Monstro',nd:'2',pv:38,ca:12,speed:'6m; voo 12m',page:86,
      description:'Ruidosas, fedorentas e mais inteligentes do que parecem; tornam-se perigosas quando dividem funções em grupo.',
      attributes:{FOR:'14 (+2)',DES:'14 (+2)',CON:'12 (+1)',INT:'8 (−1)',SAB:'10 (+0)',CAR:'10 (+0)'},senses:['Visão no Escuro 18m'],skills:['Percepção +2'],
      traits:[{name:'Canto Enfeitiçante',effect:'Enquanto canta, criaturas que puderem ouvi-la a 18m fazem TR de SAB (CD 12) no início do turno. Na falha ficam Enfeitiçadas, usam todo o movimento para se aproximar e não a atacam voluntariamente. A Harpia não pode atacar enquanto canta.'}],
      actions:[
        {name:'Garra',effect:'Ataque corpo a corpo +4, alcance 1m. Acerto: 2d6 + 2 Cortante.'},
        {name:'Mergulho Rasante',effect:'Depois de mergulhar pelo menos 9m, ataca. No acerto causa +2d6 e o alvo faz TR de DES (CD 12) ou cai Caído.'}
      ],
      tactics:'Em grupo, algumas cantam enquanto outras atacam. Alternam funções para manter o Enfeitiçamento e priorizam alvos isolados ou já Enfeitiçados.'
    },
    {
      id:'hipocampo-selvagem',name:'Hipocampo Selvagem',type:'Criatura',nd:'2',pv:42,ca:12,speed:'9m; natação 18m',page:87,
      description:'Cavalo-mar de temperamento tempestuoso, sem paciência para semideuses que não sejam filhos de Poseidon.',
      attributes:{FOR:'18 (+4)',DES:'14 (+2)',CON:'14 (+2)',INT:'6 (−2)',SAB:'12 (+1)',CAR:'10 (+0)'},senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Anfíbio',effect:'Respira ar e água.'},
        {name:'Reconhecimento Divino',effect:'Filhos de Poseidon não precisam de teste para montá-lo; ele os reconhece instintivamente.'}
      ],
      actions:[
        {name:'Mordida',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d6 + 4 Perfurante.'},
        {name:'Coice',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d8 + 4 Concussivo; TR de FOR (CD 14) ou o alvo cai Caído.'}
      ]
    },
    {
      id:'lobo-licaon',name:'Lobo de Licaon',type:'Licantropo menor',nd:'2',pv:45,ca:13,speed:'15m',page:87,attributes:{FOR:'16 (+3)'},
      traits:[
        {name:'Regeneração Lunar',effect:'Recupera 5 PV no início do turno, exceto se sofreu dano de Prata ou Ouro Imperial neste round.'},
        {name:'Faro Apurado',effect:'Vantagem em Percepção por olfato.'}
      ],
      actions:[{name:'Mordida Amaldiçoada',effect:'Ataque +5, alcance 1m. Acerto: 2d6 + 3 Perfurante; TR de CON (CD 13) ou o alvo contrai licantropia como efeito narrativo.'}]
    },
    {
      id:'sombra-faminta',name:'Sombra Faminta',type:'Morto-vivo',nd:'2',pv:34,ca:12,speed:'9m; voo 9m; atravessa objetos sólidos',page:87,
      description:'Ausência de corpo que caça energia vital, atravessa paredes e segue presas isoladas por horas.',
      attributes:{FOR:'6 (−2)',DES:'14 (+2)',CON:'10 (+0)',INT:'8 (−1)',SAB:'10 (+0)',CAR:'8 (−1)'},
      resistances:['Ácido','Ígneo','Elétrico','Gélido','Concussivo, Cortante e Perfurante de fontes não-mágicas'],immunities:['Frio','Necrótico','Agarrado','Caído','Paralisado','Petrificado','Envenenado'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Incorporal',effect:'Atravessa criaturas e objetos como Terreno Difícil. Sofre 5 de dano de Força se terminar o turno dentro de objeto sólido.'},
        {name:'Vulnerabilidade à Luz',effect:'Em Luz Plena, tem Desvantagem em todos os ataques e testes.'},
        {name:'Senso de Vida',effect:'Detecta automaticamente criaturas vivas dentro de 18m.'}
      ],
      actions:[{name:'Toque Drenante',effect:'Ataque corpo a corpo +4, alcance 1m. Acerto: 2d6 + 2 Necrótico; o PV máximo é reduzido pelo dano até um Descanso Longo. Se chegar a 0, o alvo morre e se torna uma Sombra Faminta.'}],
      tactics:'Atravessa paredes para flanquear, ataca e recua para objetos sólidos. Prioriza alvos isolados, evita luz e, em grupo, drena um alvo de cada vez.'
    },
    {
      id:'telquine',name:'Telquine',type:'Feiticeiro anfíbio',nd:'2',pv:52,ca:14,speed:'9m; natação 12m',page:88,attributes:{DES:'14 (+2)',INT:'15 (+2)'},
      traits:[
        {name:'Anfíbio',effect:'Respira ar e água.'},
        {name:'Mau-olhado',effect:'Criaturas que iniciem o turno a 3m fazem TR de SAB (CD 12) ou têm Desvantagem no próximo ataque.'}
      ],
      actions:[
        {name:'Tridente Encantado',effect:'Ataque +4, alcance 2m. Acerto: 2d6 + 2 Perfurante.'},
        {name:'Jato Corrosivo',effect:'À distância 12m; TR de DES (CD 13), 2d8 Ácido na falha.'}
      ]
    },
    {
      id:'ciclope-jovem',name:'Ciclope Jovem',type:'Monstro',nd:'3',pv:72,ca:11,speed:'9m',page:88,
      description:'Ainda está aprendendo o próprio poder; não é menos perigoso, apenas mais imprevisível.',
      attributes:{FOR:'18 (+4)',DES:'8 (−1)',CON:'16 (+3)',INT:'6 (−2)',SAB:'8 (−1)',CAR:'8 (−1)'},senses:['Visão no Escuro 18m, com Desvantagem à distância'],
      actions:[
        {name:'Porrete',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d6 + 4 Concussivo.'},
        {name:'Arremesso de Rocha',effect:'Ataque à distância +6, alcance 9/27m. Acerto: 2d8 + 4 Concussivo.'}
      ]
    },
    {
      id:'empusa',name:'Empusa',type:'Monstro',nd:'3',pv:58,ca:13,speed:'9m',page:89,
      description:'Metamorfa que esconde a perna de bronze e o casco de asno sob uma aparência humana atraente, aproximando-se antes de atacar.',
      attributes:{FOR:'14 (+2)',DES:'16 (+3)',CON:'14 (+2)',INT:'14 (+2)',SAB:'12 (+1)',CAR:'18 (+4)'},immunities:['Veneno','Enfeitiçado por magia não-divina'],senses:['Visão no Escuro 18m'],skills:['Enganação +6','Percepção +3','Persuasão +6'],
      traits:[
        {name:'Shapeshifting',effect:'Como Ação Bônus, assume a aparência de qualquer humanoide. A ilusão é perfeita para visão, não para toque. Semideuses fazem Percepção (CD 15) para detectar sua natureza.'},
        {name:'Cheiro de Semideus',effect:'Detecta automaticamente semideuses dentro de 18m pelo cheiro.'}
      ],
      actions:[
        {name:'Garras',effect:'Ataque corpo a corpo +5, alcance 1m. Acerto: 2d6 + 3 Cortante.'},
        {name:'Mordida Drenante',effect:'Ataque corpo a corpo +5, alcance 1m. Acerto: 2d8 + 3 Perfurante; recupera PV iguais ao dano causado.'},
        {name:'Encantamento',effect:'Recarga 5–6. Uma criatura a 9m faz TR de SAB (CD 14). Na falha, fica Enfeitiçada por 1 hora, trata a Empusa como amiga e não a ataca voluntariamente. Termina se a Empusa atacar o alvo.'}
      ],
      tactics:'Usa o disfarce para se aproximar e Encantamento antes do combate. Depois alterna Garras e Mordida Drenante para se sustentar.'
    },
    {
      id:'harpia-ancestral',name:'Harpia Ancestral',type:'Monstro',nd:'3',pv:50,ca:13,speed:'6m; voo 15m',page:89,attributes:{DES:'15 (+2)'},
      description:'Matriarca do bando, mais antiga, maior e cruel que as harpias comuns.',
      traits:[{name:'Fedor Nauseante',effect:'Criaturas que iniciem o turno a 3m fazem TR de CON (CD 12) ou ficam Envenenadas até saírem.'}],
      actions:[
        {name:'Garras Imundas',effect:'Ataque +5, alcance 1m. Acerto: 2d4 + 2 Cortante.'},
        {name:'Canto Lamentoso',effect:'Criaturas que ouçam a até 18m fazem TR de SAB (CD 13) ou ficam Enfeitiçadas, movendo-se em sua direção. Recarrega 5–6.'}
      ]
    },
    {
      id:'mormo',name:'Mormo',type:'Espírito do medo',nd:'3',pv:44,ca:14,speed:'voo 9m',page:90,attributes:{CAR:'15 (+2)'},
      traits:[
        {name:'Devora o Medo',effect:'Recupera 1d8 PV sempre que uma criatura fica Apavorada a 9m dela.'},
        {name:'Sombra Viva',effect:'Fica Invisível em escuridão total.'}
      ],
      actions:[
        {name:'Toque do Terror',effect:'Ataque +5, alcance 1m. Acerto: 2d8 Psíquico; TR de SAB (CD 13) ou o alvo fica Apavorado por 1 minuto.'},
        {name:'Sussurro Cruel',effect:'À distância 12m; o alvo tem Desvantagem na próxima jogada, sem teste.'}
      ]
    },
    {
      id:'sereia',name:'Sereia',type:'Monstro',nd:'3',pv:60,ca:13,speed:'6m; natação 15m',page:90,attributes:{CAR:'16 (+3)'},
      traits:[{name:'Anfíbia',effect:'Respira ar e água.'}],
      actions:[
        {name:'Canto Encantador',effect:'Criaturas que ouçam a até 18m fazem TR de SAB (CD 14) ou ficam Enfeitiçadas e movem-se em direção à Sereia. Repetem o teste se sofrerem dano.'},
        {name:'Garras',effect:'Ataque +5, alcance 1m. Acerto: 1d8 + 3 Cortante.'}
      ]
    },
    {
      id:'telquine-forjado',name:'Telquine Forjado',type:'Monstro',nd:'3',pv:62,ca:14,speed:'6m; natação 12m',page:90,
      description:'Ferreiro anfíbio endurecido por décadas de trabalho com Bronze Celestial; brilhante, rancoroso e mais letal quando tem metal e água.',
      attributes:{FOR:'14 (+2)',DES:'14 (+2)',CON:'14 (+2)',INT:'14 (+2)',SAB:'10 (+0)',CAR:'10 (+0)'},resistances:['Ígneo enquanto estiver em água','Ácido'],senses:['Visão no Escuro 18m'],skills:['Saber Mítico +4','Furtividade +4, com Vantagem em água'],
      traits:[
        {name:'Anfíbio',effect:'Respira ar e água.'},
        {name:'Ferreiro Instintivo',effect:'Cria armas básicas em 1 minuto usando qualquer metal disponível; elas têm as propriedades normais do material.'}
      ],
      actions:[
        {name:'Garra',effect:'Ataque corpo a corpo +4, alcance 1m. Acerto: 2d6 + 2 Cortante.'},
        {name:'Água Corrosiva',effect:'Recarga 5–6. Cone de 6m; TR de CON (CD 13). Falha: 3d8 Ácido e a armadura perde 1 de CA permanentemente. Sucesso: metade, sem penalidade na armadura.'}
      ],
      tactics:'Prefere lutar submerso. Usa Água Corrosiva antes do corpo a corpo para degradar armaduras; em terra é mais cauteloso.'
    },
    {
      id:'zumbi-antigo',name:'Zumbi Antigo',type:'Morto-vivo',nd:'3',pv:68,ca:10,speed:'6m',page:91,
      description:'Guerreiro reanimado por magia mais poderosa: lento e previsível, porém muito difícil de parar.',
      attributes:{FOR:'18 (+4)',DES:'6 (−2)',CON:'20 (+5)',INT:'3 (−4)',SAB:'6 (−2)',CAR:'5 (−3)'},immunities:['Veneno','Condição Exausto','Condição Envenenado'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Tenacidade Morta',effect:'Ao cair a 0 PV por dano não-Divino, faz TR de CON (CD 5 + dano recebido). No sucesso permanece com 1 PV. Não funciona contra dano Divino ou Bronze Celestial.'},
        {name:'Implacável',effect:'Nunca recua, hesita ou para por ferimentos.'}
      ],
      actions:[{name:'Soco Devastador',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d8 + 4 Concussivo; TR de FOR (CD 14) ou o alvo cai Caído.'}],
      tactics:'Avança em linha reta contra o alvo mais próximo e ignora dano até cair. Em grupo, absorve dano enquanto outras ameaças agem.'
    },
    {
      id:'centauro-hostil',name:'Centauro Hostil',type:'Monstro',nd:'4',pv:86,ca:14,speed:'12m',page:92,
      description:'Combina inteligência humana, força de cavalo e mobilidade para carregar, recuar e usar o terreno.',
      attributes:{FOR:'18 (+4)',DES:'14 (+2)',CON:'16 (+3)',INT:'10 (+0)',SAB:'12 (+1)',CAR:'10 (+0)'},skills:['Atletismo +6','Percepção +3','Sobrevivência +3'],
      traits:[{name:'Carga',effect:'Se mover pelo menos 9m em linha reta antes de acertar com Lança, causa +2d6 de dano.'}],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza um ataque de Lança e um de Coice.'},
        {name:'Lança',effect:'Ataque corpo a corpo ou à distância +6, alcance 1m ou arremesso 6/18m. Acerto: 2d6 + 4 Perfurante.'},
        {name:'Coice',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d8 + 4 Concussivo; TR de FOR (CD 14) ou o alvo cai Caído.'},
        {name:'Arco',effect:'Ataque à distância +4, alcance 24/96m. Acerto: 1d8 + 2 Perfurante.'}
      ],
      tactics:'Carrega, ataca e recua para poder carregar novamente. Em grupo, parte usa arcos enquanto os demais carregam, flanqueiam e exploram o terreno.'
    },
    {
      id:'centauro-selvagem',name:'Centauro Selvagem',type:'Humanoide monstruoso',nd:'4',pv:76,ca:14,speed:'15m',page:92,attributes:{FOR:'18 (+4)',DES:'14 (+2)'},
      traits:[{name:'Investida Galopante',effect:'Se mover pelo menos 6m em linha antes do corpo a corpo, causa +2d6 e o alvo faz TR de FOR (CD 15) ou cai Caído.'}],
      actions:[
        {name:'Lança Pesada',effect:'Ataque +6, alcance 2m. Acerto: 2d8 + 4 Perfurante.'},
        {name:'Arco Longo',effect:'Realiza dois ataques +5, alcance 45m. Acerto: 2d8 + 2 Perfurante cada.'}
      ]
    },
    {
      id:'empusa-matriarca',name:'Empusa Matriarca',type:'Morta-viva',nd:'4',pv:78,ca:14,speed:'12m',page:92,attributes:{DES:'15 (+2)',CAR:'15 (+2)'},
      description:'Mais antiga e cruel; Empusas menores obedecem ao seu chamado.',
      traits:[
        {name:'Disfarce da Névoa',effect:'Parece uma humana atraente até atacar; Investigação CD 15 revela o disfarce.'},
        {name:'Drenar Vida',effect:'Cura PV iguais à metade do dano causado com a Garra.'}
      ],
      actions:[
        {name:'Garra Flamejante',effect:'Ataque +6, alcance 1m. Acerto: 2d6 + 2 Cortante + 1d6 Ígneo.'},
        {name:'Encanto',effect:'Um alvo a 9m faz TR de SAB (CD 13) ou fica Enfeitiçado por 1 minuto, com Desvantagem para atacar a Empusa.'}
      ]
    },
    {
      id:'escorpiao-gigante',name:'Escorpião Gigante',type:'Monstro',nd:'4',pv:94,ca:15,speed:'9m',page:93,
      description:'Escorpião do tamanho de um carro que caça por emboscada e paralisa a presa antes de usar o ferrão.',
      attributes:{FOR:'18 (+4)',DES:'12 (+1)',CON:'16 (+3)',INT:'2 (−4)',SAB:'10 (+0)',CAR:'3 (−4)'},senses:['Visão no Escuro 18m','Tremorsense 18m'],skills:['Furtividade +3','Percepção +2'],
      traits:[{name:'Caça Silenciosa',effect:'Vantagem em Furtividade em terreno rochoso ou árido.'}],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques: duas Garras ou uma Garra e um Ferrão.'},
        {name:'Garra',effect:'Ataque +6, alcance 1m. Acerto: 1d8 + 4 Concussivo; o alvo fica Agarrado (escape CD 14). Pode agarrar até 2 criaturas simultaneamente.'},
        {name:'Ferrão',effect:'Ataque +6, alcance 2m. Acerto: 1d10 + 4 Perfurante + 3d6 Veneno; TR de CON (CD 14) ou Paralisado por 1 minuto, repetindo o teste no fim de cada turno.'}
      ],
      tactics:'Tenta agarrar dois alvos e usa o Ferrão em uma presa Agarrada. Prioriza armaduras leves e prefere emboscadas a combate aberto.',
      habitat:'Desertos, regiões áridas e cavernas rasas. Espera imóvel até a presa passar.',
      lore:'Aparece em mitos como instrumento de punição divina; Ártemis teria criado um para matar Órion.'
    },
    {
      id:'lestrigao',name:'Lestrigão',type:'Gigante canibal',nd:'4',pv:95,ca:13,speed:'12m',page:94,attributes:{FOR:'19 (+4)',CON:'17 (+3)'},
      traits:[{name:'Faminto',effect:'Vantagem em ataques contra criaturas Caídas ou Agarradas.'}],
      actions:[
        {name:'Garrote',effect:'Ataque +6, alcance 2m. Acerto: 3d6 + 4 Concussivo; TR de FOR (CD 15) ou o alvo fica Agarrado.'},
        {name:'Arremessar a Presa',effect:'Arremessa uma criatura Agarrada a até 6m. Ela e o alvo onde cair sofrem 3d6 Concussivo; TR de DES reduz à metade.'}
      ]
    },
    {
      id:'pegaso-sombrio',name:'Pégaso Sombrio',type:'Criatura',nd:'4',pv:82,ca:13,speed:'12m; voo 18m',page:94,
      description:'Pégaso corrompido por permanência no Submundo ou magia de Hades. Não é necessariamente maligno e pode ser purificado.',
      attributes:{FOR:'18 (+4)',DES:'16 (+3)',CON:'16 (+3)',INT:'8 (−1)',SAB:'12 (+1)',CAR:'8 (−1)'},resistances:['Necrótico'],senses:['Visão no Escuro 18m'],
      traits:[{name:'Aura Sombria',effect:'Criaturas que iniciem o turno a até 3m fazem TR de SAB (CD 13). Na falha, ficam Abaladas até o fim do próximo turno.'}],
      actions:[
        {name:'Coice Sombrio',effect:'Ataque corpo a corpo +6, alcance 1m. Acerto: 2d6 + 4 Concussivo + 1d6 Necrótico.'},
        {name:'Mergulho Aterrorizante',effect:'Depois de mergulhar pelo menos 9m, o alvo faz TR de SAB (CD 13) ou fica Apavorado por 1 minuto, além do dano normal de Coice Sombrio.'}
      ],
      gmNote:'Pode ser purificado por um filho de Apolo ou pelo Velo de Ouro. O livro recomenda considerar esse gancho em vez de apenas destruí-lo.'
    }
  ];

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function plain(value){return String(value==null?'':value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function searchable(creature){return plain([creature.name,creature.type,creature.nd,creature.description,creature.tactics,creature.habitat,creature.lore,creature.gmNote,(creature.traits||[]).map(function(item){return item.name+' '+item.effect;}).join(' '),(creature.actions||[]).map(function(item){return item.name+' '+item.effect;}).join(' ')].join(' '));}
  function threatFor(nd){return THREAT[String(nd)]==null?null:THREAT[String(nd)];}
  DATA.forEach(function(creature){creature.threat=threatFor(creature.nd);creature.source='Livro do Mestre 3e';creature.searchText=searchable(creature);});
  function list(filters){
    filters=filters||{};var query=plain(filters.query),nd=String(filters.nd||'all');
    return DATA.filter(function(creature){return (!query||creature.searchText.indexOf(query)>=0)&&(nd==='all'||creature.nd===nd);}).map(clone);
  }
  function get(id){var found=DATA.find(function(creature){return creature.id===id;});return found?clone(found):null;}

  global.SemideusesBestiary={version:'master-bestiary-nd04-0.1.0',source:'Livro do Mestre 3e · p. 83–94',threatTable:clone(THREAT),list:list,get:get,threatFor:threatFor,all:function(){return DATA.map(clone);}};
})(window);
