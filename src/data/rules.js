export const attributes=['FOR','DES','CON','INT','SAB','CAR'];
export const skills=[
 ['Atletismo','FOR'],['Acrobacia','DES'],['Furtividade','DES'],['Prestidigitação','DES'],
 ['Saber Mítico','INT'],['História','INT'],['Investigação','INT'],['Natureza','INT'],['Religião / Panteão','INT'],
 ['Intuição','SAB'],['Lidar com Animais','SAB'],['Medicina','SAB'],['Percepção','SAB'],['Sobrevivência','SAB'],
 ['Atuação','CAR'],['Enganação','CAR'],['Intimidação','CAR'],['Persuasão','CAR']
];
export const progression=[
 {level:1,prof:2,gains:['1 Talento gratuito','Criação do personagem','2 Skills Rank E']},
 {level:2,prof:2,gains:['Habilidade de Filiação nível 2','+PV e +MP']},
 {level:3,prof:2,gains:['Escolha do Caminho Divino','Habilidade inicial do Caminho','Skill Rank D']},
 {level:4,prof:2,gains:['+1 Talento e +2 em um atributo','+PV e +MP']},
 {level:5,prof:3,gains:['Habilidade de Filiação nível 5','Marca do Herói']},
 {level:6,prof:3,gains:['Skill Rank C','+PV e +MP']},
 {level:7,prof:3,gains:['Habilidade de Caminho']},
 {level:8,prof:3,gains:['+1 Talento ou +2 em um atributo','+PV e +MP']},
 {level:9,prof:4,gains:['Skill Rank B']},
 {level:10,prof:4,gains:['Habilidade de Filiação nível 10']},
 {level:11,prof:4,gains:['+PV e +MP']},
 {level:12,prof:4,gains:['+1 Talento ou +2 em um atributo','Habilidade de Caminho']},
 {level:13,prof:5,gains:['Skill Rank A']},
 {level:14,prof:5,gains:['+PV e +MP']},
 {level:15,prof:5,gains:['Habilidade de Filiação nível 15']},
 {level:16,prof:5,gains:['+1 Talento ou +2 em um atributo','+PV e +MP']},
 {level:17,prof:6,gains:['Habilidade de Caminho','Skill Rank S']},
 {level:18,prof:6,gains:['+PV e +MP']},
 {level:19,prof:6,gains:['+1 Talento ou +2 em um atributo','+PV e +MP']},
 {level:20,prof:6,gains:['Poder Supremo da Filiação']}
];
export const ranks={E:{mp:1,min:1},D:{mp:2,min:1},C:{mp:4,min:5},B:{mp:6,min:5},A:{mp:8,min:9},S:{mp:12,min:13,daily:2},SS:{mp:16,min:17,daily:1},Lendário:{mp:24,min:17,daily:1}};
export const conditions=['Abalado','Agarrado','Apavorado','Atordoado','Caído','Cego','Dominado','Enfeitiçado','Envenenado','Exausto','Incapacitado','Inconsciente','Invisível','Lento','Paralisado','Petrificado','Restrito','Surdo'];
export const backgrounds=[
 {id:'atleta',name:'Atleta',skills:['Atletismo','Acrobacia','Intimidação'],tool:'Equipamento esportivo à escolha',trait:'Segundo Fôlego',effect:'1× por Descanso Curto, Ação Bônus: recupera PV igual ao nível + mod. CON (mínimo 1).'},
 {id:'orfao-rua',name:'Órfão de Rua',skills:['Furtividade','Enganação','Sobrevivência'],tool:'Kit de ladrão',trait:'Instinto de Sobrevivência',effect:'Ao ser reduzido a 0 PV, Reação e TR de CON CD 10 + dano; no sucesso, fica com 1 PV. 1× por Descanso Longo.'}
];
export const affiliations=[
 {id:'demeter',name:'Deméter',domain:'Colheita, natureza, estações e fertilidade',status:'catalogação pendente'},
 {id:'nike',name:'Nike',domain:'Vitória e ímpeto do grupo',hitDie:8,casting:'CAR',saves:['FOR','CAR'],skills:['Atletismo','Persuasão','Intimidação'],armor:'Leves e médias',weapons:'Simples e marciais',signature:'Ímpeto',status:'parcialmente catalogada'}
];
export const gmTables={
 mist:[{complexity:'Simples',dc:10,example:'Fazer uma arma parecer objeto comum'},{complexity:'Moderada',dc:14,example:'Fazer criatura mítica parecer animal'},{complexity:'Complexa',dc:18,example:'Criar cobertura para uma batalha'},{complexity:'Extrema',dc:22,example:'Fazer um deus parecer mortal comum'}],
 exposure:['Menor','Moderada','Grave','Catastrófica'],
 missionComplications:['Informação estava errada','Aliado foi comprometido','Prazo foi encurtado','Recurso essencial foi perdido ou danificado','Terceira parte com agenda própria','Objetivo real não era o que foi dito','Consequência de missão anterior','Conflito de interesse pessoal','Ambiente mudou drasticamente','A ameaça é maior que o esperado'],
 npcReaction:['Hostil','Desconfiado','Cauteloso','Neutro','Amigável','Aliado']
};
