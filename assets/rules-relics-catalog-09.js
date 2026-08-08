(function(g){
'use strict';
var d=g.SemideusesRulesDatabase;
if(!d||!d.registerMythicItems)return;
d.registerMythicItems([
  {
    id:'relic-perola-de-anfitrite',
    name:'Pérola de Anfitrite',
    tier:'Relíquia',
    meta:'· O Mar e a Argo II',
    effect:"Fonte. Um presente da rainha do mar para quem devolveu algo perdido às águas. Passiva — Respire embaixo d'água; fale com criaturas do mar (elas entendem; responder é com elas). Ativa — Cortesia da Rainha (Rank B, 6 MP): por 10 min, você e até 3 aliados nadam com velocidade dobrada e enxergam no escuro subaquático. Recarrega no Descanso Longo.",
    kind:'object',
    page:59,
    active:{name:'Cortesia da Rainha',rank:'B',cost:6,action:'',recovery:'longRest',effect:'por 10 min, você e até 3 aliados nadam com velocidade dobrada e enxergam no escuro subaquático.',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-rede-de-glauco',
    name:'Rede de Glauco',
    tier:'Relíquia',
    meta:'· O Mar e a Argo II',
    effect:'Fonte. O pescador que virou deus menor comendo a erva errada. A rede dele pesca o que NÃO se vê. Passiva — Lançada na água (10 min): pesca farta garantida — e 10% de chance (d10=1) de algo ESTRANHO e útil (o Mestre decide). Ativa — Pescar o Invisível (Rank B, 6 MP): lance num ponto a 9 m — criaturas invisíveis/etéreas na área de 3 m ficam reveladas e Restritas (TR de DES nega). Recarrega no Descanso Curto.',
    kind:'object',
    page:59,
    active:{name:'Pescar o Invisível',rank:'B',cost:6,action:'',recovery:'shortRest',effect:'lance num ponto a 9 m — criaturas invisíveis/etéreas na área de 3 m ficam reveladas e Restritas (TR de DES nega).',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-ancora-da-argo',
    name:'Âncora da Argo',
    tier:'Relíquia',
    meta:'· O Mar e a Argo II',
    effect:'Fonte. A âncora que segurou o primeiro navio dos heróis em cada porto impossível. Passiva — Objetos/veículos ancorados por ela não se movem por meios naturais (vento, correnteza, empurrão de gigante conta como natural). Ativa — Fundear o Mundo (Rank B, 6 MP): finque-a (Ação) — aliados a 6 m não podem ser empurrados nem derrubados por 1 min. Recarrega no Descanso Curto.',
    kind:'object',
    page:59,
    active:{name:'Fundear o Mundo',rank:'B',cost:6,action:'',recovery:'shortRest',effect:'finque-a (Ação) — aliados a 6 m não podem ser empurrados nem derrubados por 1 min.',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-fragmento-da-proa-falante',
    name:'Fragmento da Proa Falante',
    tier:'Relíquia',
    meta:'· Os Argonautas',
    effect:"Fonte. A proa da Argo foi talhada no carvalho oracular de Dodona: o navio falava — e às vezes discordava do capitão. Passiva — Você sempre sabe o norte, a profundidade da água e se uma tempestade chega em até 1 hora. Ativa — Conselho de Dodona (Rank A, 8 MP): faça UMA pergunta sobre um plano de ação imediato ('se entrarmos por ali, o que nos espera?'); o Mestre responde com uma frase verdadeira e útil. 1× por dia. Teimosia do carvalho — Se você ignorar o conselho, a proa fica em silêncio ofendido por 24 h.",
    kind:'object',
    page:59,
    active:{name:'Conselho de Dodona',rank:'A',cost:8,action:'',recovery:'',effect:"faça UMA pergunta sobre um plano de ação imediato ('se entrarmos por ali, o que nos espera?'); o Mestre responde com uma frase verdadeira e útil. 1× por dia. Teimosia do carvalho — Se você ignorar o conselho, a proa fica em silêncio ofendido por 24 h.",rawMeta:'Rank A, 8 MP'},
    usage:{scope:'day',max:1}
  },
  {
    id:'relic-cinto-de-hipolita',
    name:'Cinto de Hipólita',
    tier:'Relíquia',
    meta:'· Os Doze Trabalhos',
    effect:'Fonte. O cinturão de guerra da rainha das amazonas, presente de Ares — símbolo de comando conquistado, não herdado. Passiva — +2 em Intimidação e Persuasão com guerreiros; você conta como tendo FOR 16 para requisitos de itens e manobras. Ativa — Grito de Guerra da Rainha (Rank B, 6 MP, Ação Bônus): até 3 aliados a 9 m ganham +1d6 no próximo ataque e imunidade a Apavorado por 1 rodada. Recarrega no Descanso Curto.',
    kind:'object',
    page:59,
    active:{name:'Grito de Guerra da Rainha',rank:'B',cost:6,action:'Ação Bônus',recovery:'shortRest',effect:'até 3 aliados a 9 m ganham +1d6 no próximo ataque e imunidade a Apavorado por 1 rodada.',rawMeta:'Rank B, 6 MP, Ação Bônus'}
  },
  {
    id:'relic-pelagem-da-corca-de-cerineia',
    name:'Pelagem da Corça de Cerineia',
    tier:'Relíquia',
    meta:'· Os Doze Trabalhos',
    effect:'Fonte. Héracles perseguiu a corça sagrada de Ártemis por um ano inteiro sem feri-la. A pelagem dourada lembra a lição: velocidade é paciência. Passiva — +3 m de deslocamento; rastros que você deixa somem em 1 minuto. Ativa — Corrida de Um Ano (Rank C, 4 MP, Ação Bônus): por 1 minuto, seu deslocamento dobra e você ignora terreno difícil natural. Recarrega no Descanso Curto. Voto — Se você ferir um animal sagrado ou uma criatura de Ártemis, a pelagem apaga (perde a passiva por uma semana).',
    kind:'object',
    page:60,
    active:{name:'Corrida de Um Ano',rank:'C',cost:4,action:'Ação Bônus',recovery:'shortRest',effect:'por 1 minuto, seu deslocamento dobra e você ignora terreno difícil natural.',rawMeta:'Rank C, 4 MP, Ação Bônus'}
  },
  {
    id:'relic-bolsa-da-chuva-de-ouro',
    name:'Bolsa da Chuva de Ouro',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. Zeus entrou na torre de Dânae como chuva de ouro, e dela nasceu Perseu. A bolsa guarda três gotas daquela chuva. Passiva — Sempre contém exatamente o troco necessário para compras de até 5 drc (o ouro miúdo nunca acaba). Ativa — Gota Dourada (Rank B, 6 MP): jogue uma gota num obstáculo SELADO (porta, grade, corrente): ela escorre por dentro e abre por dentro (fechaduras não-divinas). 3 gotas; 1 volta por semana.',
    kind:'object',
    page:60,
    active:{name:'Gota Dourada',rank:'B',cost:6,action:'',recovery:'',effect:'jogue uma gota num obstáculo SELADO (porta, grade, corrente): ela escorre por dentro e abre por dentro (fechaduras não-divinas). 3 gotas; 1 volta por semana.',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-bracadeira-do-salto-do-touro',
    name:'Braçadeira do Salto do Touro',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. Os cretenses dançavam POR CIMA dos touros: agarrar os chifres e saltar. A braçadeira de couro lembra o compasso. Passiva — Vantagem em Acrobacia para passar POR criaturas maiores que você. Ativa — Salto de Cnossos (Rank C, 4 MP, Ação Bônus): mova-se ATRAVÉS do espaço de um inimigo Grande+ sem provocar ataques; se parar atrás dele, seu próximo golpe tem Vantagem. Recarrega no Descanso Curto.',
    kind:'object',
    page:60,
    active:{name:'Salto de Cnossos',rank:'C',cost:4,action:'Ação Bônus',recovery:'shortRest',effect:'mova-se ATRAVÉS do espaço de um inimigo Grande+ sem provocar ataques; se parar atrás dele, seu próximo golpe tem Vantagem.',rawMeta:'Rank C, 4 MP, Ação Bônus'}
  },
  {
    id:'relic-cicatriz-do-javali-amuleto',
    name:'Cicatriz do Javali (amuleto)',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. A velha ama reconheceu Odisseu mendigo pela cicatriz de caça da juventude. Há marcas que provam quem somos. Passiva — Você não pode ser impedido de PROVAR sua identidade (efeitos que roubem seu rosto/nome deixam sempre uma marca reconhecível para quem o ama). Ativa — Reconhecimento (Rank C, 4 MP): toque um aliado sob ilusão, disfarce forçado ou Dominado: ele enxerga/lembra QUEM ELE É — novo TR imediato com Vantagem contra o efeito. Recarrega no Descanso Curto.',
    kind:'object',
    page:60,
    active:{name:'Reconhecimento',rank:'C',cost:4,action:'',recovery:'shortRest',effect:'toque um aliado sob ilusão, disfarce forçado ou Dominado: ele enxerga/lembra QUEM ELE É — novo TR imediato com Vantagem contra o efeito.',rawMeta:'Rank C, 4 MP'}
  },
  {
    id:'relic-coroa-funebre-de-aquiles',
    name:'Coroa Fúnebre de Aquiles',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. Colhida da pira em Troia, folhas de louro meio queimadas. Glória breve pesa mais que vida longa — foi a escolha dele. Passiva — Declare no início do dia: GLÓRIA (+1 em ataques, −1 em TR) ou VIDA LONGA (+1 em TR, −1 em ataques). Vale até o próximo amanhecer. Ativa — A Escolha de Aquiles (Rank A, 8 MP, Reação, 1×/dia): no seu 0 PV, escolha de verdade: fique com 1 PV e Vantagem em tudo até o fim da PRÓXIMA rodada — e caia inconsciente ao final dela, estável (a glória cobra o corpo inteiro).',
    kind:'object',
    page:60,
    active:{name:'A Escolha de Aquiles',rank:'A',cost:8,action:'Reação',recovery:'',effect:'no seu 0 PV, escolha de verdade: fique com 1 PV e Vantagem em tudo até o fim da PRÓXIMA rodada — e caia inconsciente ao final dela, estável (a glória cobra o corpo inteiro).',rawMeta:'Rank A, 8 MP, Reação, 1×/dia'},
    usage:{scope:'day',max:1}
  },
  {
    id:'relic-elo-da-coleira-de-cerbero',
    name:'Elo da Coleira de Cérbero',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. O 12º trabalho: descer, agarrar o cão de três cabeças SEM armas, e trazê-lo. Um elo da coleira ficou com Héracles. Passiva — Vantagem em testes de FOR para agarrar/conter criaturas maiores que você. Ativa — A Pegada do 12º (Rank B, 6 MP): um agarrão seu bem-sucedido também impõe Lento ao alvo enquanto durar (chefes: só o agarrão). Recarrega no Descanso Curto.',
    kind:'object',
    page:60,
    active:{name:'A Pegada do 12º',rank:'B',cost:6,action:'',recovery:'shortRest',effect:'um agarrão seu bem-sucedido também impõe Lento ao alvo enquanto durar (chefes: só o agarrão).',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-foice-adamantina-de-perseu-replica',
    name:'Foice Adamantina de Perseu (réplica)',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. Hermes emprestou a harpe de adamanto com que Cronos foi mutilado e Medusa, decapitada. Esta é a réplica que a forja fez da lâmina curva. Passiva — Espada curva 1d8; ignora Resistência a Cortante de criaturas serpentinas. Ativa — Corte do Impossível (Rank B, 6 MP): um golpe que pode cortar o incorpóreo (atinge etéreos/espíritos como se fossem sólidos), +2d8. Recarrega no Descanso Curto.',
    kind:'object',
    page:60,
    active:{name:'Corte do Impossível',rank:'B',cost:6,action:'',recovery:'shortRest',effect:'um golpe que pode cortar o incorpóreo (atinge etéreos/espíritos como se fossem sólidos), +2d8.',rawMeta:'Rank B, 6 MP'}
  },
  {
    id:'relic-fragmento-da-coluna-de-heracles',
    name:'Fragmento da Coluna de Héracles',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:"Fonte. 'Non plus ultra' — nada além daqui. As colunas marcam o fim do mundo conhecido. O fragmento discorda um pouco. Passiva — Você sabe quando está prestes a cruzar um LIMIAR significativo (território mítico, domínio divino, fronteira selada) — o fragmento esquenta. Ativa — Além das Colunas (Rank A, 8 MP): por 10 min, o grupo pode atravessar UMA fronteira mágica menor (selo de território, barreira de domínio de ND baixo). 1×/dia. O dono da fronteira SEMPRE fica sabendo.",
    kind:'object',
    page:61,
    active:{name:'Além das Colunas',rank:'A',cost:8,action:'',recovery:'',effect:'por 10 min, o grupo pode atravessar UMA fronteira mágica menor (selo de território, barreira de domínio de ND baixo). 1×/dia. O dono da fronteira SEMPRE fica sabendo.',rawMeta:'Rank A, 8 MP'},
    usage:{scope:'day',max:1}
  },
  {
    id:'relic-freio-de-xanto',
    name:'Freio de Xanto',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. O cavalo imortal de Aquiles FALOU uma vez — Hera lhe deu voz para avisar o dono da morte que vinha. As Fúrias o calaram depois. Passiva — Sua montaria não pode ser Apavorada; você entende as intenções dela (não palavras). Ativa — A Voz Emprestada (Rank A, 8 MP): por 1 min, um ANIMAL à vista fala com voz rouca — responde perguntas com o que viu, cheirou e teme. Ao final, sempre encerra com um AVISO (o Mestre entrega uma verdade incômoda). 1×/dia.',
    kind:'object',
    page:61,
    active:{name:'A Voz Emprestada',rank:'A',cost:8,action:'',recovery:'',effect:'por 1 min, um ANIMAL à vista fala com voz rouca — responde perguntas com o que viu, cheirou e teme. Ao final, sempre encerra com um AVISO (o Mestre entrega uma verdade incômoda). 1×/dia.',rawMeta:'Rank A, 8 MP'},
    usage:{scope:'day',max:1}
  },
  {
    id:'relic-isca-de-escila-sino-de-seis-badalos',
    name:'Isca de Escila (sino de seis badalos)',
    tier:'Relíquia',
    meta:'· Os Heróis Maiores',
    effect:'Fonte. Odisseu escolheu perder seis homens para Escila a perder todos para Caríbdis. O sino toca a matemática cruel do capitão. Passiva — 1×/sessão, quando o grupo precisar DIVIDIR um risco, o Mestre revela qual opção custa menos (sem números). Ativa — Toque da Escolha Dura (Rank C, 4 MP): por 1 rodada, redirecione para VOCÊ um efeito de área que pegaria 2+ aliados (você sofre com Desvantagem no TR; eles escapam). Recarrega no Descanso Curto.',
    kind:'object',
    page:61,
    active:{name:'Toque da Escolha Dura',rank:'C',cost:4,action:'',recovery:'shortRest',effect:'por 1 rodada, redirecione para VOCÊ um efeito de área que pegaria 2+ aliados (você sofre com Desvantagem no TR; eles escapam).',rawMeta:'Rank C, 4 MP'}
  }
]);
})(window);
