(function(global){
  'use strict';

  var Bestiary=global.SemideusesBestiary;
  if(!Bestiary||typeof Bestiary.register!=='function'||typeof Bestiary.update!=='function')return;

  function counter(id,label,max,options){return Object.assign({id:id,label:label,kind:'counter',max:max,current:max},options||{});}
  function segments(id,label,count,pv,ca,segmentLabel){return {id:id,label:label,kind:'segments',segments:count,segmentMax:pv,ca:ca,segmentLabel:segmentLabel||'Parte'};}
  function legendary(){return [counter('acoes-lendarias','Ações Lendárias',3,{resetOnRound:true}),counter('resistencias-lendarias','Resistências Lendárias',3)];}

  Bestiary.update('cila',{encounterTrackers:[segments('cabecas','Cabeças',6,25,15,'Cabeça'),counter('resistencias-lendarias','Resistências Lendárias',3)]});
  Bestiary.update('dracon-colquida',{encounterTrackers:legendary()});
  Bestiary.update('medusa-rainha-gorgona',{encounterTrackers:legendary()});
  Bestiary.update('caribdis',{encounterTrackers:[counter('pv-internos','PV internos',50),counter('resistencias-lendarias','Resistências Lendárias',3)]});
  Bestiary.update('equidna-mae-monstros',{encounterTrackers:legendary()});
  Bestiary.update('ladon-cem-cabecas',{encounterTrackers:legendary()});
  Bestiary.update('cila-profundezas',{encounterTrackers:[segments('cabecas','Cabeças',6,40,14,'Cabeça')]});

  var DATA=[
    {
      id:'caribdis-desperta',name:'Caríbdis Desperta',type:'Monstro-cenário',nd:'13',pv:252,ca:10,speed:'0m; redemoinho de 30m',page:119,environmental:true,
      description:'A fome primordial plenamente desperta. Não é um inimigo convencional: é um fenômeno que o grupo precisa atravessar, conter ou aguardar.',
      traits:[
        {name:'Forma de Redemoinho',effect:'Enquanto ativa, não pode ser alvo de ataques diretos. Criaturas e veículos a até 18m fazem TR de FOR (CD 20) no início do turno de Caríbdis ou são puxados 6m para o centro.'},
        {name:'Intervalo',effect:'Depois de usar Sucção Devastadora, fica inativa por 1d4 horas. Nesse intervalo pode ser atacada normalmente: PV 252 e CA 10.'}
      ],
      actions:[{name:'Sucção Devastadora',effect:'3/dia. Tudo num raio de 30m faz TR de FOR (CD 22). Falha: puxado ao centro, Agarrado e sofre 6d10 Concussivo por turno até escapar com Atletismo CD 22 ou ser liberado. Sucesso: puxado 12m.'}],
      tactics:'Use como encontro de sobrevivência. O objetivo normal é passar antes da sucção, resistir à corrente ou atacar durante o intervalo vulnerável.',
      gmNote:'Navios têm Desvantagem em todos os testes de manobra dentro do raio de influência.',
      scenarioNote:'Na Mesa, CA 10 só vale durante o intervalo. Controle os três usos diários de Sucção Devastadora e marque quando o redemoinho estiver vulnerável.',
      encounterTrackers:[counter('succao-devastadora','Sucções restantes',3),counter('intervalo-vulneravel','Intervalo vulnerável',1,{current:0})]
    },
    {
      id:'gegenes',name:'Gegenes, o Gigante Nascido da Terra',type:'Gigante',nd:'13',pv:320,ca:18,speed:'12m',page:119,
      attributes:{FOR:'26 (+8)',CON:'24 (+7)'},resistances:['Todo dano físico não-mágico enquanto a Pele de Pedra se aplicar'],
      traits:[
        {name:'Pele de Pedra',effect:'Resistência a todo dano físico não-mágico. Enquanto tocar o solo, recupera 10 PV no início do turno.'},
        {name:'Ligado à Terra',effect:'Se for erguido do chão por uma rodada, perde a regeneração e fica Vulnerável.'}
      ],
      actions:[
        {name:'Maça Colossal',effect:'Dois ataques +13, alcance 3m. Acerto: 4d10 + 8 Concussivo; TR de FOR (CD 20) ou arremessado 6m e Caído.'},
        {name:'Chuva de Rochas',effect:'Recarga 5–6. Três rochas, cada uma numa esfera de 3m a até 60m; TR de DES (CD 18), 4d6 + 8 Concussivo na falha.'}
      ],
      bossNote:'Chefe titânico com 3 Ações Lendárias e 3 Resistências Lendárias. A chave é tirá-lo do chão. A ½ PV, o campo vira Terreno Difícil.',
      encounterTrackers:legendary()
    },
    {
      id:'campe-carcereira',name:'Campe, Carcereira do Tártaro',type:'Aberração primordial',nd:'14',pv:300,ca:18,speed:'9m; voo 9m',page:120,
      attributes:{FOR:'24 (+7)',CON:'22 (+6)'},resistances:['Todo dano físico não-mágico'],immunities:['Veneno','Ser flanqueada'],
      traits:[
        {name:'Mil Faces',effect:'Cabeças de feras brotam de sua cintura. Resiste a todo dano físico não-mágico, é imune a Veneno e não pode ser flanqueada.'},
        {name:'Chaves do Abismo',effect:'Pode trancar ou abrir qualquer portal do Tártaro com um toque.'}
      ],
      actions:[
        {name:'Cauda de Escorpião',effect:'Ataque +12, alcance 3m. Acerto: 3d10 + 7 Perfurante + 3d6 Veneno; TR de CON (CD 18) ou Paralisado até o fim do próximo turno.'},
        {name:'Bocas Famintas',effect:'Três ataques +11, alcance 2m. Acerto: 2d8 + 7 cada, com tipos variados.'},
        {name:'Tempestade de Presas',effect:'Recarga 5–6. Esfera de 6m; TR de DES (CD 18), 6d8 na falha e metade no sucesso.'}
      ],
      bossNote:'Chefe titânico com 3 Ações Lendárias e 3 Resistências Lendárias. A ½ PV, Bocas Famintas passa de três para cinco ataques.',
      encounterTrackers:legendary()
    },
    {
      id:'cerbero',name:'Cérbero',type:'Criatura Divina',nd:'14',pv:270,ca:18,speed:'12m',page:120,
      description:'Guardião colossal do Submundo. Não é maligno: sua função é impedir que qualquer criatura saia.',
      attributes:{FOR:'26 (+8)',DES:'14 (+2)',CON:'24 (+7)',INT:'8 (−1)',SAB:'16 (+3)',CAR:'10 (+0)'},
      immunities:['Veneno','Necrótico','Abalado','Apavorado','Envenenado'],senses:['Visão no Escuro 36m','Tremorsense 18m','Olfato apurado'],skills:['Percepção +9','Atletismo +14'],
      traits:[
        {name:'Três Cabeças',effect:'Vantagem em todos os TR de SAB, Percepção Passiva 19 e não pode ser flanqueado.'},
        {name:'Guardião do Submundo',effect:'Detecta automaticamente seres vivos tentando sair do Submundo e tem Vantagem nos ataques contra eles.'},
        {name:'Tamanho Colossal',effect:'Ocupa 6m × 6m e tem alcance de 4m.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza três ataques de Mordida.'},
        {name:'Mordida',effect:'Ataque +14, alcance 4m. Acerto: 3d10 + 8 Perfurante; o alvo fica Agarrado, escape CD 20.'},
        {name:'Rugido das Três Cabeças',effect:'Recarga 5–6. Criaturas a até 18m fazem TR de SAB (CD 18). Falha: Apavoradas por 1 minuto e Atordoadas por 1 rodada.'},
        {name:'Baforada Sombria',effect:'Recarga 5–6. Cone de 12m; TR de CON (CD 18). Falha: 6d8 Necrótico e Envenenado por 1 hora; sucesso: metade.'}
      ],
      tactics:'Distribui Mordidas para agarrar vários alvos. Usa a Baforada quando o grupo está compacto e o Rugido para criar espaço. Não persegue para fora do Submundo.',
      gmNote:'Pode ser contornado com música, comida ou uma distração adequada ao seu tamanho. O combate direto é possível, mas não é a solução mais elegante.'
    },
    {
      id:'colera-tartaro',name:'Cólera do Tártaro',type:'Espírito primordial',nd:'15',pv:380,ca:19,speed:'voo 12m; flutua',page:121,
      attributes:{CON:'25 (+7)',CAR:'24 (+7)'},resistances:['Todo dano, salvo a limitação da Forma de Abismo'],immunities:['Necrótico','Veneno','Psíquico','Todas as condições'],
      traits:[
        {name:'Forma de Abismo',effect:'Só pode ser ferida de verdade por armas ou poderes divinos ou por Ferro Estígio.'},
        {name:'Aura de Dissolução',effect:'Hostis que iniciem o turno a 3m sofrem 3d6 Necrótico e não podem recuperar PV até o fim do turno.'}
      ],
      actions:[
        {name:'Toque do Vazio',effect:'Ataque +12, alcance 3m. Acerto: 6d8 Necrótico e o alvo perde a Reação até o fim do próximo turno.'},
        {name:'Maré do Tártaro',effect:'Recarga 5–6. Cone de 12m; TR de CON (CD 19), 8d8 Necrótico e Apavorado na falha; metade do dano no sucesso.'}
      ],
      bossNote:'Chefe final obrigatório com 3 Ações Lendárias e 3 Resistências Lendárias. Tem três fases; a cada 1/3 dos PV ganha um novo efeito de Aura. Feita para níveis 17–20 com itens divinos.',
      encounterTrackers:legendary()
    },
    {
      id:'tita-menor',name:'Titã Menor',type:'Titã',nd:'15',pv:300,ca:19,speed:'12m',page:122,
      description:'Poder comparável ao de um deus, sem a responsabilidade e com séculos de ressentimento.',
      attributes:{FOR:'28 (+9)',DES:'14 (+2)',CON:'26 (+8)',INT:'18 (+4)',SAB:'16 (+3)',CAR:'18 (+4)'},resistances:['Todos os danos não-divinos'],immunities:['Veneno','Abalado','Apavorado','Envenenado'],senses:['Visão no Escuro 36m','Tremorsense 18m'],skills:['Atletismo +15','Percepção +9','Intimidação +10'],
      traits:[
        {name:'Tamanho Colossal',effect:'Ocupa 6m × 6m e tem alcance corpo a corpo de 4m.'},
        {name:'Poder Primordial',effect:'O Mestre define três poderes ligados ao domínio do Titã, usando habilidades de Filiação escaladas para ND 15.'},
        {name:'Regeneração Titânica',effect:'Recupera 20 PV no início do turno se tiver ao menos 1 PV. Dano Divino suprime a regeneração naquele turno.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza três ataques.'},
        {name:'Golpe Titânico',effect:'Ataque +15, alcance 4m. Acerto: 4d10 + 9 Concussivo + 2d10 Divino.'},
        {name:'Poder do Domínio',effect:'3/dia. Usa um dos três poderes específicos do domínio.'},
        {name:'Presença Aterrorizante',effect:'Recarga 5–6. Criaturas a até 18m fazem TR de SAB (CD 20). Falha: Apavoradas por 1 minuto; repetem o teste no fim do turno.'}
      ],
      tactics:'Abre com Presença Aterrorizante, usa poderes do domínio contra ameaças específicas e concentra Golpes Titânicos nos alvos que resistirem.',
      encounterTrackers:[counter('poder-dominio','Poderes do Domínio',3)]
    },
    {
      id:'aspecto-tifon',name:'Aspecto de Tífon',type:'Primordial em forma reduzida',nd:'17',pv:400,ca:19,speed:'12m; voo 12m',page:122,
      attributes:{FOR:'27 (+8)',CON:'26 (+8)'},resistances:['Todo dano não-divino'],immunities:['Todas as condições'],
      traits:[
        {name:'Pai dos Monstros',effect:'Aura de tempestade de 6m causa 3d6 a hostis que iniciem o turno nela: metade Elétrico e metade Concussivo.'},
        {name:'Cabeças de Dragão',effect:'Enxerga em todas as direções, não pode ser Surpreendido e não sofre Desvantagem por estar cercado.'}
      ],
      actions:[
        {name:'Mãos que Tocam o Céu',effect:'Dois ataques +13, alcance 4m. Acerto: 4d10 + 8 Concussivo.'},
        {name:'Sopro do Caos',effect:'Recarga 5–6. Cone de 12m; role Ígneo, Gélido, Elétrico ou Ácido. TR de CON (CD 19), 8d8 na falha e metade no sucesso.'},
        {name:'Convocar a Tempestade',effect:'Três raios em pontos à escolha. Cada raio: esfera de 3m, TR de DES (CD 19), 6d10 Elétrico na falha.'}
      ],
      bossNote:'Chefe final obrigatório com 3 Ações Lendárias, 3 Resistências Lendárias e três fases. A cada 1/3 dos PV ganha um novo efeito de Aura. Indicado para níveis 17–20 com relíquias e armas divinas.',
      encounterTrackers:legendary()
    }
  ];

  Bestiary.register(DATA,{version:'master-bestiary-complete-1.0.0',source:'Livro do Mestre 3e · p. 83–123'});
})(window);
