(function(global){
'use strict';
function overview(id,name,icon,domain,profile,extra){var e={id:id,name:name,icon:icon,domain:domain,profile:profile,mechanicalStatus:'overview',paths:[],progression:{},abilities:[],skillProficiencies:[],weaponProficiencies:[],armorProficiencies:[],savingThrows:[]};if(extra)Object.keys(extra).forEach(function(k){e[k]=extra[k];});return e;}
function ability(level,name,rank,cost,action,effect){return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};}
var affiliations={
'Zeus':overview('zeus','Zeus','⚡','Céu, raios e autoridade.','Dano bruto, corpo a corpo e à distância.'),
'Poseidon':overview('poseidon','Poseidon','🔱','Mar, terremotos e cavalos.','Controle de campo e mobilidade.'),
'Hades':overview('hades','Hades','♜','Morte, sombras e riquezas.','Atrito, invocação e dreno.'),
'Atena':overview('atena','Atena','🦉','Sabedoria e estratégia.','Comando e suporte tático.'),
'Ares':overview('ares','Ares','🪖','Guerra e violência.','Duelista bruto e resistente.'),
'Apolo':overview('apolo','Apolo','☀','Sol, música, profecia e cura.','Curandeiro-arqueiro à distância.'),
'Hermes':overview('hermes','Hermes','⚕','Viagem, ladinagem e comércio.','Velocista furtivo e versátil.'),
'Hefesto':overview('hefesto','Hefesto','⚒','Fogo, forja e invenção.','Fortaleza, armadura, constructos e fogo.'),
'Afrodite':overview('afrodite','Afrodite','♀','Amor, beleza e manipulação.','Controlador social.'),
'Deméter':overview('demeter','Deméter','🌾','Colheita, natureza e estações.','Controle de terreno e cura.',{
mechanicalStatus:'complete',title:'A Senhora do Campo',casting:'SAB',hitDie:8,savingThrows:['CON','SAB'],skillProficiencies:['Natureza','Sobrevivência','Medicina'],weaponProficiencies:['Armas simples','Armas marciais'],armorProficiencies:['Armaduras médias','Armaduras leves'],
overview:'Controle de terreno e cura. Suas zonas de plantas crescem sozinhas, fecham caminhos, protegem aliados e permitem escolher onde a luta acontece.',
signature:{name:'Crescimento',summary:'Habilidades que plantam uma Semente deixam uma zona vegetal. No início de cada turno, a zona nasce ou cresce. Ela é terreno difícil para inimigos e cobertura leve para aliados. Você mantém até 3 zonas, ou 5 a partir do nível 11.'},
progression:{1:['Dom','Assinatura: Crescimento','Semente'],2:['Raiz'],3:['Escolha do Caminho','Habilidade de Caminho'],4:['Aumento de Atributo'],5:['Campo Fértil','Marca do Herói'],6:[],7:['Habilidade de Caminho'],8:['Talento ou +2 em atributo'],9:[],10:['Vinhas'],11:[],12:['Habilidade de Caminho'],13:[],14:[],15:['Estação de Fartura'],16:[],17:['Habilidade de Caminho'],18:[],19:['Talento ou +2 em atributo'],20:['Poder Supremo: O Ano Que Não Veio']},
abilities:[
ability(1,'Dom','Passiva',null,'Passiva','O solo e as plantas reconhecem o sangue de Deméter. Esta habilidade sustenta a relação natural da Filiação com terreno, vegetação e sobrevivência.'),
ability(1,'Semente','E',1,'Ação','Planta uma Semente no ponto atingido e cria a base para uma zona de Crescimento.'),
ability(2,'Raiz','D',2,'Ação','Cria raízes para impedir movimento e ampliar o controle da zona vegetal.'),
ability(5,'Campo Fértil','Passiva',null,'Passiva','Fortalece as zonas de Crescimento e acompanha a escolha permanente da Marca do Herói.'),
ability(10,'Vinhas','B',6,'Ação','Vinhas surgem na sua área de Crescimento. Inimigos fazem TR de FOR ou ficam Restritos por 1 rodada.'),
ability(15,'Estação de Fartura','A',8,'Ação, concentração por 1 min','Um raio de 9 m a até 18 m vira um bosque vivo que cresce 3 m por turno, até 24 m. Inimigos enfrentam terreno difícil e Desvantagem para atacar quem está dentro. Aliados recebem cobertura leve e curam 2d6 no início do turno. Ao fim do seu turno, um inimigo faz TR de FOR ou fica Agarrado.'),
ability(20,'O Ano Que Não Veio','Lendário',24,'Ação, 1 hora','1 vez por arco. Em 1,5 km, escolha Fartura ou Fome e possa inverter uma vez. Fartura dobra curas e protege contra fome, sede e frio. Fome causa Exaustão, impede recuperação por descanso e apodrece recursos. Ao terminar, você não pode usar cura até o próximo Descanso Longo.')
],
paths:[
{id:'colheita',name:'Caminho da Colheita',summary:'A abundância e a cura sustentada.',abilities:[
ability(3,'Cura da Colheita','D',2,'Ação','Um aliado a até 18 m recupera 3d8 PV.'),
ability(7,'Bênção da Colheita','B',6,'Ação','Até 3 aliados a 12 m ganham PV Temporários iguais ao seu nível.'),
ability(12,'Fartura','A',8,'Ação','Aliados na zona de Crescimento recuperam um total de 4d8 PV distribuídos.'),
ability(17,'Ano de Fartura','S',12,'Ação, 1 min','2 usos por dia. Por 1 minuto, cada aliado dentro da área de Crescimento recupera 2d8 PV por turno.')
]},
{id:'estacoes',name:'Caminho das Estações',summary:'O ciclo eterno alterna cura, dano e controle.',abilities:[
ability(3,'Ciclo','D',2,'Ação','Escolha Primavera para curar um aliado em 2d8 ou Outono para causar 2d8 Necrótico e Desvantagem por 1 rodada.'),
ability(7,'Geada','B',6,'Ação','Uma área de 6 m vira terreno gelado; inimigos ficam Lentos por 1 rodada.'),
ability(12,'Ciclo Acelerado','A',8,'Ação, 1 min','Durante 1 minuto, as estações alternam cura e definhamento a cada turno.'),
ability(17,'Equinócio','S',12,'Ação','2 usos por dia. Aliados a 12 m curam 4d8 e removem condições; inimigos a 12 m sofrem 6d8 Necrótico e enfrentam terreno difícil.')
]},
{id:'rainha',name:'Caminho da Rainha',summary:'O Submundo, a Primavera e o controle necrótico.',abilities:[
ability(3,'Toque de Inverno','D',2,'Ação','Alvo a 9 m. No Inverno, 3d8 Necrótico e TR de CON ou Lento; na Primavera, cura 3d8 num aliado.'),
ability(7,'Colheita de Almas','B',6,'Ação','No Inverno, inimigos em 6 m fazem TR de CON ou sofrem 4d8 e você cura metade; na Primavera, aliados na área curam 3d8 por turno.'),
ability(12,'Domínio das Duas Terras','A',8,'Ação, 1 min','Por 1 minuto, alterne de Estação gratuitamente a cada turno e aplique simultaneamente as cláusulas de Primavera e Inverno.'),
ability(17,'Trono de Perséfone','S',12,'Ação, 1 min','2 usos por dia. Manifesta um domínio alternável: no Inverno, área de morte e restrição; na Primavera, área de vida, cura e PV Temporários.')
]}
]
}),
'Dionísio':overview('dionisio','Dionísio','🍇','Vinho, loucura e êxtase.','Caos, debilitação em área e frenesi.'),
'Ártemis':overview('artemis','Ártemis','🏹','Devoção, caça e lua.','Arqueira de matilha com regras especiais de Voto.',{specialNature:'Voto de Ártemis'}),
'Hécate':overview('hecate','Hécate','☾☽☾','Magia, Névoa e encruzilhadas.','Conjuradora flexível.'),
'Íris':overview('iris','Íris','🌈','Luz, arco-íris e mensagens.','Suporte modal de luz.'),
'Hipnos':overview('hipnos','Hipnos','🪶','Sono e torpor.','Controle por sono.'),
'Morfeu':overview('morfeu','Morfeu','☁','Sonhos e ilusões.','Controle ilusório.'),
'Tique':overview('tique','Tique','🎲','Sorte e acaso.','Sorte coletiva.'),
'Éolo':overview('eolo','Éolo','🌀','Ventos e ar.','Controle de zona por vento.'),
'Circe':overview('circe','Circe','⚗','Feitiço e transformação.','Transmutadora com reagentes.'),
'Eros':overview('eros','Eros','🏹♥','Desejo e vínculos.','Manipulador de laços.'),
'Nyx':overview('nyx','Nyx','✦','Noite, trevas e medo.','Controladora das trevas.'),
'Nêmesis':overview('nemesis','Nêmesis','⚖','Vingança e equilíbrio.','Vingadora de atrito.'),
'Nike':overview('nike','Nike','🪽','Vitória e ímpeto.','Suporte de momentum.'),
'Tânatos':overview('tanatos','Tânatos','🕯','Morte gentil.','Executor.'),
'Perséfone':overview('persefone','Perséfone','🌺','Primavera e Submundo.','Híbrido de cura e morte.'),
'Hebe':overview('hebe','Hebe','🏺','Juventude e vigor.','Sustentação pura por Vigor.')};
function clone(v){return JSON.parse(JSON.stringify(v));}
function getCatalogAffiliation(name){return affiliations[name]?clone(affiliations[name]):null;}
function getAffiliation(name){var e=affiliations[name];return e&&e.mechanicalStatus==='complete'?clone(e):null;}
function listAffiliations(){return Object.keys(affiliations).map(function(n){return clone(affiliations[n]);});}
function listCompleteAffiliations(){return listAffiliations().filter(function(e){return e.mechanicalStatus==='complete';});}
global.SemideusesRulesDatabase={version:'3e-rules-db-0.3.0',edition:'3e',affiliations:affiliations,getAffiliation:getAffiliation,getCatalogAffiliation:getCatalogAffiliation,listAffiliations:listAffiliations,listCompleteAffiliations:listCompleteAffiliations};
})(window);