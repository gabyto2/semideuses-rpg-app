(function(global){
  'use strict';

  var Bestiary=global.SemideusesBestiary;
  if(!Bestiary||typeof Bestiary.register!=='function')return;

  var DATA=[
    {
      id:'basilisco',name:'Basilisco',type:'Monstro',nd:'—',catalogNd:'5',pv:null,pvText:'Não informado',ca:null,caText:'Não informada',speed:'Não informado',page:95,calculator:false,
      description:'Predador subterrâneo cujo olhar transforma vítimas em pedra. O trecho oficial preserva suas regras, mas não traz o cabeçalho da ficha.',
      attributes:{FOR:'16 (+3)',DES:'8 (−1)',CON:'18 (+4)',INT:'2 (−4)',SAB:'8 (−1)',CAR:'7 (−2)'},immunities:['Condição Petrificado'],senses:['Visão no Escuro 18m','Tremorsense 9m'],
      traits:[
        {name:'Olhar Petrificante',effect:'Criaturas que iniciem o turno olhando para o Basilisco a até 9m fazem TR de CON (CD 14). Falha: Restrita por 1 minuto, repetindo no fim de cada turno; falhar novamente enquanto Restrita causa Petrificação permanente. Fechar os olhos evita o efeito, mas dá Desvantagem nos ataques contra ele.'},
        {name:'Reflexo Fatal',effect:'Se vir o próprio reflexo, faz o mesmo TR (CD 14). Na falha, fica Restrito por 1d4 rodadas.'}
      ],
      actions:[
        {name:'Mordida',effect:'Ataque +5, alcance 1m. Acerto: 2d6 + 3 Perfurante + 2d6 Veneno; TR de CON (CD 14) ou Envenenado por 1 hora.'},
        {name:'Cuspe Ácido',effect:'Recarga 5–6, alcance 9m. Acerto: 4d8 Ácido; TR de CON (CD 14) ou Cego por 1 minuto.'}
      ],
      tactics:'Avança confiando no olhar e usa Cuspe Ácido contra quem fecha os olhos. Não costuma recuar e é vulnerável a espelhos e reflexos.',
      habitat:'Cavernas, ruínas subterrâneas e regiões áridas. Solitário, torna a área ao redor instintivamente evitada por outras criaturas.',
      lore:'Seu reflexo pode derrotá-lo. O sangue tem uso alquímico em preparos ligados à resistência contra petrificação.',
      manualReason:'A página 95 começa nos atributos: o livro omite ND, PV, CA e deslocamento do Basilisco. Ele fica consultável, mas não entra na calculadora até existir uma errata oficial.',
      gmNote:'Discrepância da fonte oficial: faltam ND, PV, CA e deslocamento. Não completar com estatísticas de outro sistema.'
    },
    {
      id:'ciclope',name:'Ciclope',type:'Gigante',nd:'5',pv:130,ca:13,speed:'12m',page:95,attributes:{FOR:'20 (+5)',CON:'18 (+4)'},
      traits:[{name:'Visão Única',effect:'Desvantagem em ataques à distância contra alvos a mais de 18m.'}],
      actions:[
        {name:'Clava Imensa',effect:'Ataque +8, alcance 3m. Acerto: 3d8 + 5 Concussivo; TR de FOR (CD 16) ou o alvo cai Caído.'},
        {name:'Arremessar Pedra',effect:'Ataque à distância +8, alcance 30m. Acerto: 4d6 + 5 Concussivo.'}
      ]
    },
    {
      id:'cao-bicefalo-orto',name:'Cão Bicéfalo de Orto',type:'Fera mítica',nd:'5',pv:105,ca:14,speed:'15m',page:95,attributes:{FOR:'18 (+4)'},
      traits:[{name:'Duas Cabeças',effect:'Vantagem em TR contra ficar Atordoado, Cego ou Inconsciente; não pode ser pego de surpresa.'}],
      actions:[
        {name:'Mordidas Gêmeas',effect:'Realiza dois ataques +6, alcance 1m. Cada acerto causa 2d8 + 4 Perfurante.'},
        {name:'Uivo Duplo',effect:'Recarga 5–6. Cone de 6m; TR de SAB (CD 14) ou Apavorado por 1 minuto.'}
      ]
    },
    {
      id:'espectro',name:'Espectro',type:'Morto-vivo',nd:'5',pv:82,ca:13,speed:'6m; voo 12m; atravessa objetos',page:95,
      description:'Alma furiosa que se recusa a seguir para o Submundo e transforma a memória da própria morte em combustível.',
      attributes:{FOR:'6 (−2)',DES:'16 (+3)',CON:'12 (+1)',INT:'12 (+1)',SAB:'12 (+1)',CAR:'16 (+3)'},
      resistances:['Ácido','Ígneo','Elétrico','Gélido','Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Frio','Necrótico','Agarrado','Caído','Exausto','Paralisado','Petrificado','Envenenado'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Incorpóreo',effect:'Atravessa criaturas e objetos como Terreno Difícil. Sofre 5 de dano de Força se terminar o turno dentro de objeto sólido.'},
        {name:'Memória da Morte',effect:'Tem Vantagem em ataques e testes contra a criatura responsável por sua morte, quando ela estiver presente.'}
      ],
      actions:[
        {name:'Toque Drenante',effect:'Ataque +6, alcance 1m. Acerto: 4d6 Necrótico; TR de CON (CD 14) ou o PV máximo é reduzido pelo dano até um Descanso Longo.'},
        {name:'Possessão',effect:'Recarga 6. Uma criatura a 1m faz TR de CAR (CD 14). Na falha, o Espectro controla o corpo; dano Divino encerra a possessão.'}
      ],
      tactics:'Atravessa paredes para isolar vítimas e prioriza quem se relaciona à sua morte. Usa Possessão para dividir o grupo ou obter acesso a posições protegidas.'
    },
    {
      id:'grifo',name:'Grifo',type:'Fera mítica',nd:'5',pv:98,ca:15,speed:'9m; voo 18m',page:96,
      attributes:{FOR:'18 (+4)',DES:'16 (+3)',CON:'16 (+3)',INT:'10 (+0)',SAB:'14 (+2)',CAR:'10 (+0)'},senses:['Visão de águia: alcance visual triplicado'],skills:['Percepção +6','Atletismo +7'],
      traits:[
        {name:'Mergulho Preciso',effect:'Depois de mergulhar pelo menos 12m antes de um ataque, causa +2d8 de dano.'},
        {name:'Orgulho',effect:'Não aceita montaria sem respeito ou vínculo; tentativas de domínio pela força provocam reação hostil.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza um ataque de Garra e um de Bico.'},
        {name:'Garra',effect:'Ataque +7, alcance 1m. Acerto: 2d8 + 4 Cortante.'},
        {name:'Bico',effect:'Ataque +7, alcance 1m. Acerto: 2d6 + 4 Perfurante; TR de FOR (CD 15) ou Agarrado.'}
      ],
      tactics:'Abre com mergulho contra o alvo mais vulnerável, tenta agarrá-lo com o bico e volta ao ar para controlar distância.'
    },
    {
      id:'lestrigao-chefe-cla',name:'Lestrigão Chefe de Clã',type:'Gigante canibal',nd:'5',pv:102,ca:13,speed:'9m',page:97,
      attributes:{FOR:'20 (+5)',DES:'10 (+0)',CON:'18 (+4)',INT:'8 (−1)',SAB:'10 (+0)',CAR:'8 (−1)'},senses:['Visão no Escuro 18m'],skills:['Atletismo +8','Percepção +3'],
      traits:[{name:'Grande',effect:'Ocupa espaço maior e usa alcance e força para manter inimigos próximos.'}],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques.'},
        {name:'Punho',effect:'Ataque +8, alcance 2m. Acerto: 2d8 + 5 Concussivo.'},
        {name:'Bola de Bronze Flamejante',effect:'Ataque à distância +3, alcance 12/36m. Acerto: 3d6 Ígneo; TR de DES (CD 14) ou o alvo fica em chamas, sofrendo 1d6 Ígneo por turno até apagar.'},
        {name:'Arremesso Explosivo',effect:'Recarga 5–6. Arremessa a até 18m; explosão em raio de 4m. TR de DES (CD 14), 4d6 Ígneo na falha e o alvo fica em chamas.'}
      ],
      tactics:'Abre com Arremesso Explosivo contra grupos e mantém pressão com os ataques físicos, usando o alcance para bloquear passagem.'
    },
    {
      id:'manticora',name:'Manticora',type:'Monstro',nd:'5',pv:100,ca:14,speed:'9m; voo 15m',page:98,attributes:{FOR:'17 (+3)'},
      traits:[{name:'Voo Ágil',effect:'Não provoca Ataques de Oportunidade ao decolar.'}],
      actions:[
        {name:'Garras',effect:'Realiza dois ataques +6, alcance 1m. Cada acerto causa 2d6 + 3 Cortante.'},
        {name:'Ferrões da Cauda',effect:'Recarga 5–6. Dispara três ferrões contra alvos a até 30m; cada ataque +6 causa 1d8 + 3 Perfurante.'}
      ]
    },
    {
      id:'minotauro',name:'Minotauro',type:'Monstro',nd:'5',pv:114,ca:14,speed:'9m',page:98,
      attributes:{FOR:'22 (+6)',DES:'10 (+0)',CON:'20 (+5)',INT:'6 (−2)',SAB:'10 (+0)',CAR:'5 (−3)'},resistances:['Concussivo não-mágico'],senses:['Faro: detecta criaturas vivas a até 18m'],skills:['Atletismo +9','Percepção +3'],
      traits:[
        {name:'Carga Devastadora',effect:'Depois de mover pelo menos 6m em linha reta, o alvo faz TR de FOR (CD 17). Na falha, sofre +2d8 Concussivo e cai Caído.'},
        {name:'Implacável',effect:'Uma vez por descanso, ao cair a 0 PV, faz um TR de CON para permanecer com 1 PV.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza um ataque de Chifre e um de Punho.'},
        {name:'Chifre',effect:'Ataque +9, alcance 1m. Acerto: 2d10 + 6 Perfurante.'},
        {name:'Punho',effect:'Ataque +9, alcance 1m. Acerto: 2d6 + 6 Concussivo.'},
        {name:'Rugido',effect:'Recarga 5–6. Criaturas que ouçam fazem TR de SAB (CD 14) ou ficam Apavoradas.'}
      ],
      tactics:'Usa a carga para derrubar, prende o alvo no corpo a corpo e recorre ao Rugido para quebrar a formação do grupo.',
      habitat:'Labirintos, ruínas fechadas e complexos subterrâneos. O faro reduz a utilidade de esconderijos convencionais.',
      lore:'A forma mais famosa descende do Minotauro de Creta, mas monstros semelhantes surgem onde maldições e labirintos se encontram.'
    },
    {
      id:'basilisco-agua',name:'Basilisco de Água',type:'Monstro aquático',nd:'6',pv:112,ca:14,speed:'6m; natação 12m',page:99,
      attributes:{FOR:'16 (+3)',DES:'12 (+1)',CON:'18 (+4)',INT:'2 (−4)',SAB:'10 (+0)',CAR:'5 (−3)'},immunities:['Condição Petrificado'],senses:['Visão no Escuro 18m','Tremorsense 18m na água'],skills:['Furtividade +4, com Vantagem na água'],
      traits:[
        {name:'Anfíbio',effect:'Respira ar e água.'},
        {name:'Olhar Petrificante',effect:'A até 9m, TR de CON (CD 14): falha deixa Restrito por 1 minuto e uma nova falha enquanto Restrito causa Petrificação permanente. Fechar os olhos evita o efeito com Desvantagem nos ataques.'},
        {name:'Camuflagem Aquática',effect:'Tem Vantagem em Furtividade enquanto estiver submerso.'}
      ],
      actions:[
        {name:'Mordida',effect:'Ataque +6, alcance 1m. Acerto: 2d6 + 3 Perfurante + 3d6 Veneno; na água, os dados de Veneno causam dano máximo.'},
        {name:'Constrição',effect:'Ataque +6, alcance 1m. Acerto: 2d8 + 3 Concussivo e o alvo fica Agarrado (escape CD 14), sujeito a afogamento.'}
      ],
      tactics:'Ataca submerso, combina olhar e constrição e tenta manter a vítima longe da superfície.'
    },
    {
      id:'ciclope-ferreiro',name:'Ciclope Ferreiro',type:'Gigante',nd:'6',pv:138,ca:12,speed:'9m',page:100,
      attributes:{FOR:'22 (+6)',DES:'9 (−1)',CON:'20 (+5)',INT:'8 (−1)',SAB:'8 (−1)',CAR:'10 (+0)'},resistances:['Concussivo não-mágico'],senses:['Visão no Escuro 18m','Visão única: Desvantagem à distância'],skills:['Atletismo +9','Percepção +2'],
      traits:[
        {name:'Arremesso Preciso',effect:'Ao arremessar pedras, ignora a Desvantagem causada pela visão única.'},
        {name:'Grande',effect:'Ao acertar um ataque corpo a corpo, pode Agarrar o alvo como parte do acerto.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques.'},
        {name:'Clava',effect:'Ataque +9, alcance 2m. Acerto: 3d8 + 6 Concussivo.'},
        {name:'Rocha',effect:'Ataque +9, alcance 12/36m. Acerto: 3d10 + 6 Concussivo; TR de FOR (CD 17) ou Caído.'},
        {name:'Esmagar',effect:'Recarga 5–6. Uma criatura Agarrada sofre 4d10 + 6 Concussivo.'}
      ],
      reactions:[{name:'Agarrão de Retaliação',effect:'Quando é atingido corpo a corpo, tenta Agarrar o atacante automaticamente; TR de DES (CD 17) evita.'}],
      tactics:'Usa rochas para derrubar à distância, agarra quem se aproxima e reserva Esmagar para uma presa já imobilizada.'
    },
    {
      id:'furia-erinea',name:'Fúria (Erínea)',type:'Entidade vingadora',nd:'6',pv:110,ca:14,speed:'9m; voo 18m',page:101,
      attributes:{FOR:'14 (+2)',DES:'18 (+4)',CON:'16 (+3)',INT:'14 (+2)',SAB:'16 (+3)',CAR:'18 (+4)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Condição Envenenado'],senses:['Visão no Escuro 18m','Visão Verdadeira 18m'],skills:['Percepção +6','Intimidação +7'],
      traits:[
        {name:'Designação',effect:'É enviada contra um culpado específico e sabe reconhecê-lo.'},
        {name:'Visão Verdadeira',effect:'Enxerga disfarces, ilusões e transformações dentro do alcance.'}
      ],
      actions:[
        {name:'Chicote Flamejante',effect:'Realiza dois ataques +7, alcance 3m. Cada acerto causa 2d8 + 4 Ígneo; TR de SAB (CD 15) ou o alvo fica Abalado.'},
        {name:'Olhar de Culpa',effect:'Recarga 5–6. TR de SAB (CD 15) ou Paralisado por 1 minuto; criaturas sem culpa relacionada à Designação são imunes.'}
      ],
      tactics:'Persegue a criatura designada e usa o Olhar de Culpa para neutralizá-la; não desperdiça o poder em inocentes.',
      gmNote:'A Fúria funciona melhor quando a culpa e a Designação são definidas na história antes do combate.'
    },
    {
      id:'gorgona',name:'Górgona',type:'Monstro',nd:'6',pv:95,ca:15,speed:'9m',page:102,attributes:{DES:'15 (+2)',CON:'16 (+3)'},
      traits:[{name:'Olhar Petrificante',effect:'TR de CON (CD 15). Na falha, o alvo fica Restrito; falhar novamente enquanto Restrito causa Petrificação. Desviar o olhar evita o efeito, mas impõe Desvantagem nos ataques.'}],
      actions:[{name:'Cabelos de Serpente',effect:'Ataque +5, alcance 1m. Acerto: 2d6 + 2 Perfurante + 2d6 Veneno.'}]
    },
    {
      id:'leao-nemeia',name:'Leão de Nemeia',type:'Fera mítica',nd:'6',pv:120,ca:17,speed:'12m',page:102,
      attributes:{FOR:'22 (+6)',DES:'16 (+3)',CON:'18 (+4)',INT:'4 (−3)',SAB:'14 (+2)',CAR:'8 (−1)'},immunities:['Concussivo, Cortante e Perfurante não-mágicos e não-divinos'],senses:['Visão no Escuro 18m','Olfato apurado'],skills:['Atletismo +9','Percepção +5','Furtividade +6'],
      traits:[
        {name:'Pele Impermeável',effect:'Dano físico só atravessa a pele se vier de fonte Divina, Bronze Celestial, Ferro Estígio ou Adamantina.'},
        {name:'Bote',effect:'Depois de mover 6m em linha reta, o alvo faz TR de FOR (CD 17) ou cai Caído; o Leão pode usar Mordida como Ação Bônus.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques de Garra.'},
        {name:'Garra',effect:'Ataque +9, alcance 1m. Acerto: 2d8 + 6 Cortante.'},
        {name:'Mordida',effect:'Ataque +9, alcance 1m. Acerto: 2d10 + 6 Perfurante; causa dano máximo contra alvo Agarrado.'},
        {name:'Rugido',effect:'Recarga 5–6. TR de SAB (CD 14) ou Apavorado.'}
      ],
      tactics:'Usa furtividade e Bote para derrubar, depois concentra Mordida na presa imobilizada.',
      habitat:'Regiões selvagens e isoladas. A pele quase invulnerável permite que cace sem cautela diante de armas comuns.',
      lore:'Descendente da fera enfrentada por Héracles; a resistência da pele é parte central do desafio.'
    },
    {
      id:'quimera',name:'Quimera',type:'Monstro',nd:'6',pv:120,ca:15,speed:'12m; voo 12m',page:103,attributes:{FOR:'19 (+4)',CON:'17 (+3)'},
      traits:[{name:'Três Cabeças',effect:'Vantagem em Percepção e em TR contra ficar Atordoada ou Inconsciente.'}],
      actions:[
        {name:'Mordida de Leão',effect:'Ataque +7, alcance 1m. Acerto: 2d8 + 4 Perfurante.'},
        {name:'Chifres de Cabra',effect:'Ataque +7, alcance 1m. Acerto: 2d6 + 4 Perfurante.'},
        {name:'Sopro de Fogo',effect:'Recarga 5–6. Cone de 6m; TR de DES (CD 15), 6d6 Ígneo na falha, metade no sucesso.'}
      ]
    },
    {
      id:'esfinge',name:'Esfinge',type:'Guardião divino',nd:'7',pv:126,ca:16,speed:'9m; voo 12m',page:103,
      attributes:{FOR:'18 (+4)',DES:'14 (+2)',CON:'18 (+4)',INT:'20 (+5)',SAB:'18 (+4)',CAR:'18 (+4)'},immunities:['Psíquico','Condição Abalado','Condição Enfeitiçado'],senses:['Visão no Escuro 18m','Visão Verdadeira 18m'],skills:['Saber Mítico +9','História +9','Percepção +8','Religião +9'],
      traits:[
        {name:'Enigmas Divinos',effect:'Propõe enigmas com CD de INT entre 15 e 20, conforme a complexidade.'},
        {name:'Imune a Engano',effect:'Reconhece mentiras e tentativas comuns de manipulação.'}
      ],
      actions:[
        {name:'Garras',effect:'Realiza dois ataques +8, alcance 1m. Cada acerto causa 2d10 + 4 Cortante.'},
        {name:'Enigma',effect:'3/dia. Uma criatura deve responder; resposta errada exige TR de INT (CD 17) e causa 4d10 Psíquico na falha.'},
        {name:'Rugido Paralisante',effect:'Recarga 5–6. Cone de 9m; TR de SAB (CD 16) ou Paralisado por 1 minuto.'}
      ],
      tactics:'Testa os invasores antes de atacar. Em combate, usa o Rugido para controlar o grupo e concentra garras em quem ameaça o objetivo protegido.'
    },
    {
      id:'manticora-ancia',name:'Manticora Anciã',type:'Monstro',nd:'7',pv:144,ca:15,speed:'9m; voo 12m',page:104,
      attributes:{FOR:'18 (+4)',DES:'16 (+3)',CON:'18 (+4)',INT:'12 (+1)',SAB:'12 (+1)',CAR:'14 (+2)'},resistances:['Concussivo não-mágico'],senses:['Visão no Escuro 18m'],skills:['Percepção +4','Enganação +5','Intimidação +5'],
      traits:[
        {name:'Espinhos Regenerativos',effect:'Possui 24 espinhos e recupera 1d6 espinhos ao amanhecer.'},
        {name:'Voz Humana',effect:'Imita fala humana para atrair vítimas e preparar emboscadas.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza três ataques entre Mordida, Garra e Espinho.'},
        {name:'Mordida',effect:'Ataque +7, alcance 1m. Acerto: 2d8 + 4 Perfurante.'},
        {name:'Garra',effect:'Ataque +7, alcance 1m. Acerto: 1d8 + 4 Cortante.'},
        {name:'Espinho',effect:'Ataque +6, alcance 18/36m. Acerto: 1d8 + 3 Perfurante + 2d6 Veneno; TR de CON (CD 14) ou Paralisado por 1 rodada.'},
        {name:'Rajada de Espinhos',effect:'Recarga 5–6. Dispara seis espinhos, cada um com ataque +6 e dano 1d8 + 3 Perfurante.'}
      ],
      tactics:'Atrai com voz humana, abre com a Rajada e permanece no ar enquanto houver espinhos.',
      habitat:'Penhascos, ruínas elevadas e regiões remotas onde possa observar a presa antes da aproximação.',
      lore:'A idade traz inteligência e paciência; uma anciã prefere manipular o encontro antes de expor o corpo.'
    },
    {
      id:'medusa',name:'Medusa',type:'Monstro',nd:'7',pv:127,ca:15,speed:'6m',page:106,
      attributes:{FOR:'16 (+3)',DES:'15 (+2)',CON:'18 (+4)',INT:'12 (+1)',SAB:'14 (+2)',CAR:'16 (+3)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],senses:['Visão no Escuro 18m','Tremorsense 6m'],skills:['Percepção +5','Furtividade +5','Enganação +6'],
      traits:[
        {name:'Olhar Petrificante',effect:'A até 18m, TR de CON (CD 15). Falha: Restrito; falha por 5 ou mais: Petrificado. Fechar os olhos e usar reflexos evita contato direto com as limitações normais.'},
        {name:'Cabelos Reativos',effect:'Quem se aproxima ou a atinge corpo a corpo faz TR de DES (CD 13) ou sofre 1d6 Veneno.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza um ataque de Arco e um de Mordida das Serpentes.'},
        {name:'Arco',effect:'Ataque +5, alcance 18/60m. Acerto: 1d8 + 2 Perfurante.'},
        {name:'Mordida das Serpentes',effect:'Ataque +6, alcance 1m. Acerto: 2d6 + 3 Perfurante + 2d6 Veneno.'},
        {name:'Olhar Focado',effect:'Recarga 5–6. TR de CON (CD 17); na falha, Petrificado por 1 hora; no sucesso, Restrito.'}
      ],
      tactics:'Usa cobertura e arco contra quem evita o olhar, aproxima-se só quando o alvo já está Restrito e reserva o Olhar Focado para a ameaça principal.',
      habitat:'Ruínas isoladas, templos abandonados e locais cercados por estátuas de vítimas.',
      lore:'O nome pode designar descendentes ou criaturas ligadas à maldição de Medusa; o olhar continua sendo sua arma central.'
    },
    {
      id:'serpente-marinha',name:'Serpente Marinha',type:'Monstro aquático',nd:'7',pv:136,ca:14,speed:'6m; natação 18m',page:107,
      attributes:{FOR:'22 (+6)',DES:'14 (+2)',CON:'18 (+4)',INT:'4 (−3)',SAB:'10 (+0)',CAR:'5 (−3)'},resistances:['Concussivo não-mágico'],senses:['Visão no Escuro 36m','Tremorsense 36m na água'],skills:['Atletismo +10','Furtividade +5, com Vantagem na água'],
      traits:[{name:'Anfíbia e Colossal',effect:'Respira ar e água, ocupa aproximadamente 6m × 2m e alcança alvos a 4m.'}],
      actions:[
        {name:'Mordida',effect:'Ataque +9, alcance 4m. Acerto: 3d8 + 6 Perfurante.'},
        {name:'Constrição',effect:'Ataque +9, alcance 4m. Acerto: 2d10 + 6 Concussivo; o alvo fica Agarrado e Restrito (escape CD 17).'},
        {name:'Arremessar Presa',effect:'Arremessa uma criatura Agarrada a até 12m. Ela sofre 2d6 Concussivo por cada 3m percorridos e cai Caída.'}
      ],
      tactics:'Surge de baixo, restringe a presa mais vulnerável e a arremessa para separar o grupo ou lançá-la contra obstáculos.'
    },
    {
      id:'touro-maratona',name:'Touro de Maratona',type:'Fera mítica',nd:'7',pv:150,ca:15,speed:'12m',page:108,attributes:{FOR:'21 (+5)',CON:'19 (+4)'},
      traits:[{name:'Carga Imparável',effect:'Ignora Terreno Difícil durante a carga e não é interrompido por barreira com menos de 30 PV temporários.'}],
      actions:[
        {name:'Chifre',effect:'Ataque +8, alcance 2m. Acerto: 3d10 + 5 Perfurante; arremessa o alvo 4m e o deixa Caído.'},
        {name:'Pisada de Brasa',effect:'Recarga 5–6. Raio de 2m; TR de DES (CD 16), 2d8 Concussivo + 1d8 Ígneo e Caído na falha.'}
      ],
      legendaryActions:[
        {name:'Carga',effect:'Move-se e executa a pressão da Carga Imparável.'},
        {name:'Pisada',effect:'Usa Pisada de Brasa quando disponível.'}
      ],
      bossNote:'Versão de chefe: 1–2 Ações Lendárias por rodada, 1 Resistência Lendária e, abaixo de metade dos PV, Pisada de Brasa recarrega com 4–6.'
    },
    {
      id:'gigante-fogo',name:'Gigante de Fogo',type:'Gigante',nd:'8',pv:162,ca:16,speed:'9m',page:108,
      attributes:{FOR:'24 (+7)',DES:'8 (−1)',CON:'22 (+6)',INT:'10 (+0)',SAB:'10 (+0)',CAR:'12 (+1)'},resistances:['Concussivo e Perfurante não-mágicos'],immunities:['Ígneo'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Grande',effect:'Alcance corpo a corpo de 2m.'},
        {name:'Aura de Calor',effect:'Criaturas que permanecem a até 2m sofrem 1d6 Ígneo.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques de Espada de Fogo.'},
        {name:'Espada de Fogo',effect:'Ataque +10, alcance 2m. Acerto: 3d8 + 7 Cortante + 2d6 Ígneo.'},
        {name:'Rocha Flamejante',effect:'Ataque +10, alcance 18/54m. Acerto: 3d10 + 7 Concussivo + 2d6 Ígneo; TR de DES (CD 16) ou o alvo fica em chamas.'}
      ]
    },
    {
      id:'hidra',name:'Hidra',type:'Monstro',nd:'8',pv:172,ca:15,speed:'9m; natação 9m',page:109,
      attributes:{FOR:'20 (+5)',DES:'8 (−1)',CON:'22 (+6)',INT:'3 (−4)',SAB:'10 (+0)',CAR:'7 (−2)'},immunities:['Veneno','Condição Envenenado'],senses:['Visão no Escuro 18m'],skills:['Percepção +6'],
      traits:[
        {name:'Cinco Cabeças',effect:'Começa com 5 cabeças, tem Vantagem em TR de SAB e Percepção Passiva 16.'},
        {name:'Cabeças Regenerativas',effect:'Quando sofre dano Cortante, no turno seguinte role 1d6; com 4+, surgem duas cabeças no lugar da cortada. Dano Ígneo cauteriza e impede o crescimento. Cada nova cabeça acrescenta uma Mordida, até 10.'},
        {name:'Anfíbia',effect:'Respira ar e água.'}
      ],
      actions:[{name:'Mordidas',effect:'Realiza um ataque por cabeça. Ataque +8, alcance 2m. Acerto: 2d6 + 5 Perfurante + 2d6 Veneno.'}],
      reactions:[{name:'Pescoço Protetor',effect:'Impõe Desvantagem a um ataque contra o corpo. Um pescoço pode ser atacado separadamente: CA 13 e 20 PV.'}],
      tactics:'Distribui as mordidas para pressionar vários alvos, protege o corpo com os pescoços e força o grupo a descobrir o uso de fogo.',
      habitat:'Pântanos, cavernas inundadas e ruínas próximas a água profunda.',
      lore:'Cortar sem cauterizar torna a criatura mais perigosa; reconhecer essa regra faz parte do desafio mítico.'
    },
    {
      id:'piton-delfos',name:'Píton de Delfos',type:'Serpente oracular',nd:'8',pv:175,ca:16,speed:'12m',page:110,attributes:{FOR:'20 (+5)',CON:'20 (+5)'},
      traits:[
        {name:'Vapores Proféticos',effect:'Inimigos em um raio de 6m têm Desvantagem em ataques.'},
        {name:'Constrição Profunda',effect:'Criaturas Agarradas têm Desvantagem para escapar.'}
      ],
      actions:[
        {name:'Mordida',effect:'Ataque +8, alcance 2m. Acerto: 2d10 + 5 Perfurante.'},
        {name:'Bote Constritor',effect:'TR de FOR (CD 16) ou o alvo fica Agarrado e sofre 2d8 Concussivo por turno.'},
        {name:'Cone de Vapor',effect:'Recarga 5–6. Cone de 6m; TR de CON (CD 16) ou Atordoado até o próximo turno.'}
      ],
      legendaryActions:[
        {name:'Mover',effect:'Reposiciona-se mantendo pressão com os vapores.'},
        {name:'Mordida',effect:'Executa um ataque de Mordida.'},
        {name:'Constrição',effect:'Pressiona uma criatura já Agarrada.'}
      ],
      bossNote:'Possui 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, os Vapores alcançam 12m e causam 2d6 Veneno por turno.'
    },
    {
      id:'revenant',name:'Revenant',type:'Morto-vivo',nd:'8',pv:136,ca:15,speed:'9m',page:110,
      attributes:{FOR:'20 (+5)',DES:'14 (+2)',CON:'20 (+5)',INT:'14 (+2)',SAB:'14 (+2)',CAR:'18 (+4)'},resistances:['Necrótico','Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Agarrado','Exausto','Paralisado','Envenenado'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Regeneração',effect:'Recupera 10 PV no início do turno, exceto depois de sofrer dano Divino.'},
        {name:'Alvo da Vingança',effect:'Sabe a direção do alvo jurado e recebe vantagens contra ele, enquanto outros alvos são secundários.'},
        {name:'Retorno Implacável',effect:'Uma hora depois de cair, retorna com 1 PV, a menos que tenha sido destruído por dano Divino ou que o alvo da vingança esteja morto.'}
      ],
      actions:[
        {name:'Punhos Espectrais',effect:'Realiza dois ataques +8, alcance 1m. Cada acerto causa 2d8 + 5 Concussivo + 2d6 Necrótico.'},
        {name:'Olhar Paralisante',effect:'TR de SAB (CD 15) ou Paralisado por 1 minuto.'}
      ],
      tactics:'Ignora distrações e persegue o alvo da vingança, usando regeneração e retorno para transformar o encontro em ameaça recorrente.',
      gmNote:'Defina o alvo e a causa da vingança. Sem isso, a criatura perde sua função narrativa e parte de suas regras.'
    },
    {
      id:'semideus-veterano',name:'Semideus Veterano',type:'Humanoide mítico',nd:'8–12',catalogNd:'8',pv:null,pvText:'160–220',ca:null,caText:'17–19',speed:'6m',page:111,scalable:true,calculator:false,
      description:'Modelo de adversário semideus experiente, ajustado pelo Mestre conforme Filiação, Talentos e capacidades escolhidas.',
      attributes:{FOR:'20 (+5)',DES:'18 (+4)',CON:'20 (+5)',INT:'16 (+3)',SAB:'18 (+4)',CAR:'16 (+3)'},skills:['Atletismo +9','Percepção +8','Intimidação +7','Duas perícias da Filiação'],
      traits:[
        {name:'Iniciativa Experiente',effect:'Vantagem na Iniciativa e não pode ser pego de surpresa.'},
        {name:'Construção de Veterano',effect:'Escolha 4–6 habilidades de Filiação de Rank B ou superior e 3–4 Talentos adequados ao conceito.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza três ataques com arma, com bônus +9 e dano normal da arma + 5.'},
        {name:'Habilidade de Filiação',effect:'Usa uma habilidade de Filiação de Rank B ou superior.'},
        {name:'Skill Avançada',effect:'Usa uma Skill de Rank A ou superior.'}
      ],
      tactics:'Deve agir como personagem experiente: explora terreno, recursos da Filiação, Talentos e o objetivo narrativo do encontro.',
      manualReason:'O livro fornece uma faixa ND 8–12, PV 160–220 e CA 17–19, mas não relaciona cada valor a um ND. O app não interpola a progressão.',
      gmNote:'Modelo escalável: defina ND, PV, CA, Filiação, 4–6 habilidades e 3–4 Talentos antes de usar.'
    },
    {
      id:'talos',name:'Talos, o Autômato de Bronze',type:'Constructo colossal',nd:'8',pv:175,ca:18,speed:'9m',page:112,attributes:{FOR:'22 (+6)',CON:'20 (+5)'},
      resistances:['Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Psíquico','Condição Enfeitiçado','Condição Apavorado','Condição Envenenado'],
      traits:[
        {name:'Corpo de Bronze',effect:'Sua construção concede as imunidades e resistências indicadas.'},
        {name:'Veia de Ícor',effect:'O ponto fraco pode ser mirado com Desvantagem. Quando atingido, Talos fica Vulnerável a todo dano por 1 rodada.'}
      ],
      actions:[
        {name:'Punhos de Bronze',effect:'Realiza dois ataques +9, alcance 2m. Cada acerto causa 3d8 + 6 Concussivo.'},
        {name:'Pisada Sísmica',effect:'Recarga 5–6. Raio de 3m; TR de DES (CD 17), 4d8 Concussivo e Caído na falha.'}
      ],
      legendaryActions:[
        {name:'Mover',effect:'Reposiciona-se sem perder a pressão sobre a área.'},
        {name:'Punho',effect:'Executa um ataque de Punho de Bronze.'},
        {name:'Pisada',effect:'Usa Pisada Sísmica quando disponível.'}
      ],
      bossNote:'Possui 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, a Veia de Ícor se fecha e Talos entra em sobrecarga, recebendo +1 ataque por turno.'
    }
  ];

  Bestiary.register(DATA,{version:'master-bestiary-nd08-0.1.0',source:'Livro do Mestre 3e · p. 83–112'});
})(window);
