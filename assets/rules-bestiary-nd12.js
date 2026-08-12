(function(global){
  'use strict';

  var Bestiary=global.SemideusesBestiary;
  if(!Bestiary||typeof Bestiary.register!=='function'||typeof Bestiary.update!=='function')return;

  Bestiary.update('basilisco',{
    nd:'5',catalogNd:'5',calculator:true,
    manualReason:'O Apêndice A, na página 123, confirma ND 5. A ficha da página 95 ainda omite PV, CA e deslocamento, por isso o cálculo automático continua bloqueado.',
    gmNote:'O ND 5 é confirmado pelo Apêndice A (p. 123). PV, CA e deslocamento não aparecem no cabeçalho oficial e não devem ser importados de outro sistema.'
  });

  var DATA=[
    {
      id:'ciclope-anciao',name:'Ciclope Ancião',type:'Monstro',nd:'9',pv:178,ca:14,speed:'9m',page:112,
      description:'Um Ciclope que sobreviveu por séculos e aprendeu a compensar as fraquezas que heróis costumam explorar.',
      attributes:{FOR:'24 (+7)',DES:'8 (−1)',CON:'22 (+6)',INT:'10 (+0)',SAB:'10 (+0)',CAR:'10 (+0)'},resistances:['Concussivo não-mágico'],senses:['Visão no Escuro 18m'],
      traits:[
        {name:'Tamanho Grande',effect:'Ocupa 3m × 3m e tem alcance corpo a corpo de 2m.'},
        {name:'Experiência de Batalha',effect:'Vantagem em TR contra as condições Cego e Atordoado.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques de Porrete ou um de Porrete e um Arremesso de Rocha.'},
        {name:'Porrete',effect:'Ataque +10, alcance 2m. Acerto: 3d8 + 7 Concussivo.'},
        {name:'Arremesso de Rocha',effect:'Ataque +10, alcance 18/54m. Acerto: 3d10 + 7 Concussivo; TR de FOR (CD 18) ou Caído.'},
        {name:'Esmagar',effect:'Uma criatura Agarrada sofre 4d10 + 7 Concussivo, sem jogada de ataque.'}
      ]
    },
    {
      id:'cila',name:'Cila',type:'Horror das falésias',nd:'9',pv:200,ca:16,speed:'Não se desloca',page:113,environmental:true,
      traits:[
        {name:'Seis Cabeças',effect:'Ataca com 6 cabeças por turno. Cada cabeça tem CA 15 e 25 PV e pode ser decepada separadamente; cada cabeça perdida remove uma Mordida.'},
        {name:'Inalcançável',effect:'O corpo está cravado no penhasco e fora de alcance; somente cabeças e pescoços podem ser atingidos.'}
      ],
      actions:[{name:'Mordidas Múltiplas',effect:'Uma por cabeça ativa. Ataque +8, alcance 4m. Acerto: 2d8 + 4 Perfurante; num acerto, pode erguer o alvo, deixando-o Agarrado fora do alcance dos aliados.'}],
      bossNote:'Chefe ambiental com 3 Resistências Lendárias. O progresso real é decepar cabeças ou atravessar o estreito rapidamente, não reduzir os 200 PV do corpo. Pode ser combinado com Caríbdis.',
      scenarioNote:'Encontro ambiental: ao levar para a Mesa, use a ficha detalhada para rastrear as seis cabeças de CA 15 e 25 PV; o corpo não é um alvo normal.'
    },
    {
      id:'dracon-colquida',name:'Drácon da Cólquida',type:'Dragão grego',nd:'9',pv:190,ca:17,speed:'9m; natação 9m',page:113,attributes:{FOR:'21 (+5)',CON:'19 (+4)'},
      resistances:['Ígneo','Ácido'],senses:['Visão no Escuro 24m'],
      traits:[{name:'Olhos Insones',effect:'Não dorme e não pode ser Surpreendido.'},{name:'Escamas Antigas',effect:'Resistência a dano Ígneo e Ácido.'}],
      actions:[
        {name:'Mordida',effect:'Ataque +9, alcance 2m. Acerto: 2d10 + 5 Perfurante + 2d6 Veneno.'},
        {name:'Cauda Varredora',effect:'Criaturas num arco de 3m fazem TR de FOR (CD 17). Falha: 2d8 + 5 Concussivo e empurradas 3m.'},
        {name:'Cuspe Ácido',effect:'Recarga 5–6. Linha de 9m; TR de DES (CD 16), 6d8 Ácido na falha e metade no sucesso.'}
      ],
      bossNote:'Guardião clássico com 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, Cuspe Ácido recarrega com 4–6 e Mordida causa +2d6 Veneno.'
    },
    {
      id:'gorgona-ancestral',name:'Górgona Ancestral',type:'Monstro',nd:'9',pv:168,ca:16,speed:'9m; voo 12m',page:113,
      description:'Uma das irmãs imortais da linhagem de Górgonas, mais antiga e letal que as formas menores.',
      attributes:{FOR:'20 (+5)',DES:'16 (+3)',CON:'20 (+5)',INT:'14 (+2)',SAB:'14 (+2)',CAR:'18 (+4)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Condição Envenenado'],senses:['Visão no Escuro 18m','Tremorsense 9m'],skills:['Percepção +6','Intimidação +8','Furtividade +7'],
      traits:[
        {name:'Olhar Petrificante',effect:'A até 18m, TR de CON (CD 17). Falha: Restrito; falha por 5 ou mais: Petrificado. Fechar os olhos e usar reflexos evita o contato direto com as limitações normais.'},
        {name:'Imortal',effect:'Ao cair a 0 PV, dissolve-se e retorna reformada no Tártaro em 1d4 dias. Só pode ser destruída permanentemente no Tártaro.'},
        {name:'Cabelo de Serpentes Venenosas',effect:'Quem a acerta corpo a corpo faz TR de DES (CD 15) ou sofre 2d6 Veneno.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza duas Garras e uma Mordida de Serpente.'},
        {name:'Garra',effect:'Ataque +9, alcance 1m. Acerto: 2d8 + 5 Cortante.'},
        {name:'Mordida de Serpente',effect:'Ataque +9, alcance 1m. Acerto: 2d6 + 5 Perfurante + 3d8 Veneno.'},
        {name:'Olhar Focado',effect:'Recarga 5–6. TR de CON (CD 19); na falha, Petrificado por 1 hora; no sucesso, Restrito.'}
      ]
    },
    {
      id:'medusa-rainha-gorgona',name:'Medusa, a Rainha Górgona',type:'Monstro lendário',nd:'9',pv:165,ca:16,speed:'9m',page:114,attributes:{DES:'16 (+3)'},
      traits:[
        {name:'Olhar que Petrifica',effect:'No início do turno, criaturas a até 9m que a vejam fazem TR de CON (CD 16). Falha: Paralisadas; falhar novamente causa Petrificação. Desviar o olhar evita o efeito, mas impõe Desvantagem nos ataques.'},
        {name:'Cabeleira de Víboras',effect:'Quem a ataca corpo a corpo a 1m sofre 1d6 Veneno.'}
      ],
      actions:[
        {name:'Arco Longo',effect:'Realiza dois ataques +7, alcance 45m. Cada acerto causa 2d8 Perfurante + 1d6 Veneno.'},
        {name:'Cabelos Serpentinos',effect:'Ataque +7, alcance 1,5m. Acerto: 2d6 + 3 Perfurante + 2d6 Veneno.'}
      ],
      bossNote:'Possui 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, o Olhar Petrifica com uma única falha. Se for decapitada, a cabeça vira a relíquia Olho da Górgona, com um uso de petrificação.'
    },
    {
      id:'quimera-primordial',name:'Quimera Primordial',type:'Monstro',nd:'9',pv:168,ca:16,speed:'9m; voo 18m',page:114,
      description:'Cria direta de Équidna, maior e mais feroz que as linhagens posteriores.',
      attributes:{FOR:'20 (+5)',DES:'14 (+2)',CON:'18 (+4)',INT:'8 (−1)',SAB:'10 (+0)',CAR:'10 (+0)'},resistances:['Cortante e Perfurante não-mágicos'],immunities:['Ígneo','Condição Apavorado'],senses:['Visão no Escuro 18m'],skills:['Percepção +4','Atletismo +9'],
      traits:[
        {name:'Três Cabeças',effect:'Vantagem em TR de SAB e Percepção Passiva 14. Uma cabeça que sofra 30 ou mais de dano no mesmo turno fica incapacitada por 1 rodada, sem afetar as outras.'},
        {name:'Voo Ágil',effect:'Não provoca Ataques de Oportunidade ao voar.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza Mordida de Leão, Chifre de Cabra e Mordida de Serpente.'},
        {name:'Mordida de Leão',effect:'Ataque +9, alcance 1m. Acerto: 2d8 + 5 Perfurante.'},
        {name:'Chifre de Cabra',effect:'Ataque +9, alcance 1m. Acerto: 2d6 + 5 Perfurante; TR de FOR (CD 16) ou Caído.'},
        {name:'Mordida de Serpente',effect:'Ataque +9, alcance 2m. Acerto: 1d8 + 5 Perfurante + 3d6 Veneno.'},
        {name:'Sopro de Fogo',effect:'Recarga 5–6. Cone de 9m; TR de DES (CD 15), 8d6 Ígneo na falha e metade no sucesso.'}
      ],
      tactics:'Abre com Sopro de Fogo, usa o voo para controlar distância e distribui os três ataques entre alvos. Quando muito ferida, volta ao ar enquanto espera a recarga.',
      habitat:'Regiões vulcânicas e montanhas remotas. Solitária e agressivamente territorial.',
      lore:'A Quimera original foi vencida por Belerofonte montado em Pégaso, usando o próprio fogo da criatura para derreter chumbo em sua garganta.'
    },
    {
      id:'caribdis',name:'Caríbdis',type:'Monstro-cenário',nd:'10',pv:240,ca:13,speed:'Não se move; redemoinho vivo',page:115,environmental:true,attributes:{CON:'24 (+7)'},
      traits:[
        {name:'Sucção',effect:'No início do turno, toda criatura a até 18m na água faz TR de FOR (CD 18) ou é arrastada 6m para o centro. Quem chega ao centro é Engolido.'},
        {name:'Engolido',effect:'Sofre 6d6 Concussivo + 6d6 Ácido por turno e fica Restrito no interior. O interior tem 50 PV; destruí-lo permite sair.'}
      ],
      actions:[{name:'Maremoto',effect:'Recarga 5–6. Criaturas a até 12m fazem TR de DES (CD 18), sofrendo 8d6 Concussivo na falha.'}],
      bossNote:'Encontro ambiental com 3 Resistências Lendárias. O desafio é escapar ou fechar a goela, não simplesmente reduzir os PV. Pode ser combinada com Cila.',
      scenarioNote:'A Mesa registra Caríbdis como referência de iniciativa. Use a ficha detalhada para controlar Sucção, distância ao centro e os 50 PV internos.'
    },
    {
      id:'gigante-guerra',name:'Gigante de Guerra',type:'Gigante',nd:'10',pv:200,ca:17,speed:'12m',page:115,
      description:'Contra-medida divina criada para enfrentar um deus específico e resistir justamente ao poder que o grupo espera usar.',
      attributes:{FOR:'26 (+8)',DES:'10 (+0)',CON:'24 (+7)',INT:'12 (+1)',SAB:'12 (+1)',CAR:'14 (+2)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Condição Envenenado'],senses:['Visão no Escuro 18m'],skills:['Atletismo +13','Percepção +6','Intimidação +7'],
      traits:[
        {name:'Tamanho Colossal',effect:'Ocupa 4m × 4m e tem alcance corpo a corpo de 3m.'},
        {name:'Resistência Divina',effect:'O Mestre escolhe um deus. Poderes desse deus causam metade do dano ao Gigante.'},
        {name:'Requer Mortal',effect:'Só pode ser morto permanentemente pela combinação de semideus e deus, ou por semideus com armas divinas específicas. Um deus sozinho não basta.'}
      ],
      actions:[
        {name:'Ataque Duplo',effect:'Realiza dois ataques de Lança ou dois de Soco.'},
        {name:'Lança Colossal',effect:'Ataque +13, alcance 3m ou arremesso 18/54m. Acerto: 3d10 + 8 Perfurante.'},
        {name:'Soco Devastador',effect:'Ataque +13, alcance 2m. Acerto: 3d8 + 8 Concussivo; TR de FOR (CD 20) ou arremessado 6m e Caído.'},
        {name:'Arremesso',effect:'Recarga 5–6. Explosão de 6m em ponto a até 36m; TR de DES (CD 18), 4d12 Concussivo e Caído na falha, metade no sucesso.'}
      ],
      reactions:[{name:'Resistir',effect:'Ao ser alvo de poder divino do deus escolhido, reduz o dano à metade com a Reação, além da Resistência normal.'}],
      tactics:'Identifica a maior ameaça, usa Arremesso para desorganizar o grupo e concentra seus ataques para eliminar um alvo por vez.'
    },
    {
      id:'equidna-mae-monstros',name:'Équidna, a Mãe dos Monstros',type:'Monstro lendário',nd:'11',pv:250,ca:17,speed:'12m',page:116,attributes:{FOR:'20 (+5)',CON:'21 (+5)',CAR:'18 (+4)'},resistances:['Necrótico'],immunities:['Veneno'],
      traits:[{name:'Mãe de Mil Horrores',effect:'Imune a Veneno e Resistente a Necrótico.'},{name:'Ninhada',effect:'Criaturas invocadas agem na mesma Iniciativa de Équidna.'}],
      actions:[
        {name:'Mordida Peçonhenta',effect:'Ataque +9, alcance 2m. Acerto: 3d8 + 5 Perfurante + 3d6 Veneno.'},
        {name:'Parir Horrores',effect:'Recarga 5–6. Invoca 1d4 Mirmidões, Cinocéfalos ou Aves de Estínfalo a até 6m.'},
        {name:'Cauda Constritora',effect:'Um alvo a 3m faz TR de FOR (CD 17) ou fica Agarrado, com deslocamento 0, e sofre 2d10 por turno.'}
      ],
      bossNote:'Chefe com fases, 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, Ninhada recarrega com 4–6 e cada cria nasce Enfurecida, causando +1d6 de dano.'
    },
    {
      id:'ladon-cem-cabecas',name:'Ládon, o Dragão de Cem Cabeças',type:'Dragão guardião',nd:'11',pv:260,ca:18,speed:'9m',page:117,attributes:{FOR:'22 (+6)',CON:'21 (+5)'},
      traits:[
        {name:'Cem Cabeças',effect:'Nunca dorme, é imune a Surpresa e não pode ficar Cego ou Atordoado. Recupera uma cabeça por turno; a cada 50 PV perdidos, realiza uma Mordida a menos.'},
        {name:'Vigília Eterna',effect:'Vantagem em todos os TR enquanto estiver guardando seu tesouro ou local.'}
      ],
      actions:[
        {name:'Mordidas Múltiplas',effect:'Realiza quatro ataques +9, alcance 2m. Cada acerto causa 2d8 + 5 Perfurante.'},
        {name:'Rugido Coral',effect:'Recarga 5–6. Cone de 9m; TR de SAB (CD 17), 6d6 Trovejante e Apavorado na falha.'}
      ],
      bossNote:'Guardião com 3 Ações Lendárias e 3 Resistências Lendárias. Abaixo de metade dos PV, Rugido Coral vira Ação Lendária de 2 pontos.'
    },
    {
      id:'cila-profundezas',name:'Cila das Profundezas',type:'Monstro',nd:'11',pv:218,ca:17,speed:'0m; fixada; alcance 9m',page:117,environmental:true,
      description:'A matriarca original do Mar de Monstros: seis cabeças, doze pernas e alcance suficiente para ameaçar qualquer navio que passe.',
      attributes:{FOR:'24 (+7)',DES:'8 (−1)',CON:'22 (+6)',INT:'8 (−1)',SAB:'12 (+1)',CAR:'6 (−2)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],senses:['Visão no Escuro 18m','Tremorsense 18m na água'],
      traits:[
        {name:'Seis Cabeças',effect:'Pode realizar uma Mordida por cabeça intacta. Cada cabeça tem CA 14 e 40 PV; destruir uma cabeça remove uma Mordida.'},
        {name:'Fixada',effect:'Não pode se mover, mas qualquer criatura ou veículo a até 9m está ao alcance.'}
      ],
      actions:[
        {name:'Mordidas Múltiplas',effect:'Realiza Mordidas iguais ao número de cabeças intactas.'},
        {name:'Mordida',effect:'Ataque +11, alcance 9m. Acerto: 2d10 + 7 Perfurante; o alvo fica Agarrado (escape CD 18).'},
        {name:'Devorar',effect:'Uma criatura Agarrada sofre 4d10 + 7 Perfurante automaticamente e é engolida: Cega, Restrita e sofre 2d10 Ácido por turno. Escapa com Atletismo ou Acrobacia CD 20, ou quando uma cabeça é destruída.'}
      ],
      tactics:'Distribui Mordidas para agarrar vários alvos e prioriza Devorar. O grupo precisa decidir entre destruir cabeças ou atravessar a área rapidamente.',
      scenarioNote:'A ficha possui corpo e seis cabeças independentes. A Mesa usa o corpo como referência; rastreie separadamente as cabeças de CA 14 e 40 PV na ficha detalhada.'
    },
    {
      id:'drakon',name:'Drakon',type:'Monstro',nd:'12',pv:230,ca:18,speed:'12m; natação 12m',page:118,
      description:'Serpente colossal, silenciosa e territorial, com veneno corrosivo e olhos que hipnotizam antes do ataque.',
      attributes:{FOR:'26 (+8)',DES:'12 (+1)',CON:'24 (+7)',INT:'10 (+0)',SAB:'12 (+1)',CAR:'8 (−1)'},resistances:['Concussivo, Cortante e Perfurante não-mágicos'],immunities:['Veneno','Condição Envenenado'],senses:['Visão no Escuro 36m','Tremorsense 18m'],skills:['Atletismo +13','Percepção +6','Furtividade +6'],
      traits:[
        {name:'Veneno Corrosivo',effect:'Quem sofre seu dano de Veneno faz TR de CON (CD 18). Falha: Envenenado por 1 hora e não recupera PV por meios não-mágicos.'},
        {name:'Olhar Hipnótico',effect:'Criaturas que iniciem o turno olhando para seus olhos a até 9m fazem TR de SAB (CD 16). Falha: Enfeitiçadas até o fim do próximo turno e não o atacam voluntariamente.'},
        {name:'Tamanho Colossal',effect:'Ocupa 6m × 6m e pode Agarrar criaturas Grandes ou menores.'}
      ],
      actions:[
        {name:'Ataque Triplo',effect:'Realiza duas Mordidas e um ataque de Cauda.'},
        {name:'Mordida',effect:'Ataque +13, alcance 3m. Acerto: 3d10 + 8 Perfurante + 3d8 Veneno.'},
        {name:'Cauda',effect:'Ataque +13, alcance 4m. Acerto: 2d12 + 8 Concussivo; TR de FOR (CD 20) ou Caído e empurrado 4m.'},
        {name:'Constrição',effect:'Recarga 5–6. Uma criatura Agarrada sofre 6d10 + 8 Concussivo, fica Restrita, com deslocamento 0 e Desvantagem nos ataques. Escapa com Atletismo CD 20.'},
        {name:'Sopro de Veneno',effect:'Recarga 5–6. Cone de 12m; TR de CON (CD 18), 8d8 Veneno e Envenenado por 1 hora na falha, metade do dano no sucesso.'}
      ],
      tactics:'Usa o Olhar Hipnótico contra a maior ameaça, concentra ataques nos demais e reserva Constrição para alvos Agarrados e Sopro para grupos compactos.',
      habitat:'Florestas densas, pântanos e costas rochosas. Solitário, territorial e caçador ativo.',
      lore:'Drakons guardam locais sagrados. Ossos e dentes têm propriedades mágicas; dentes plantados podem criar guerreiros esqueléticos.'
    }
  ];

  Bestiary.register(DATA,{version:'master-bestiary-nd12-0.1.0',source:'Livro do Mestre 3e · p. 83–123'});
})(window);
