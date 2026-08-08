(function(global){
'use strict';
var db=global.SemideusesRulesDatabase;if(!db)return;
function material(id,name,cost,rarity,kind,effects,restrictions){return {id:id,name:name,costPerKg:cost,rarity:rarity,kind:kind,effects:effects||{},restrictions:restrictions||''};}
function prop(id,name,scope,effect){return {id:id,name:name,scope:scope,effect:effect};}
db.forge=db.forge||{};
db.forge.materials=[
material('ferro','Ferro',2,'Comum','comum',{notes:'Básico; enferruja com uso intenso.'}),
material('aco','Aço',8,'Comum','comum',{notes:'Padrão mortal; resistente e confiável.'}),
material('bronze','Bronze',5,'Comum','comum',{notes:'Clássico grego.'}),
material('madeira-dura','Madeira Dura',3,'Comum','comum',{notes:'Para cabos e arcos.'}),
material('couro','Couro',4,'Comum','comum',{notes:'Padrão para armaduras leves.'}),
material('couro-reforcado','Couro Reforçado',10,'Comum','comum',{notes:'Tratado com óleos especiais.'}),
material('seda','Seda',15,'Comum','comum',{notes:'Leve; para armaduras excepcionalmente leves.'}),
material('bronze-celestial','Bronze Celestial',50,'Raro','mitico',{weapon:'Passa por mortais sem dano permanente; eficaz contra criaturas míticas.',armor:'Mais leve que bronze comum; sem penalidade de velocidade.',property:'Conta como mágico para superar Resistências.'}),
material('ouro-imperial','Ouro Imperial',80,'Raro','mitico',{weapon:'+1d4 Divino contra mortos-vivos e servos de Titãs.',armor:'Resistência a dano Necrótico.',property:'Emite luz suave em 1 m, visível para semideuses.'}),
material('ferro-estigio','Ferro Estígio',150,'Muito Raro','mitico',{weapon:'Eficaz contra mortais e criaturas míticas.',armor:'Resistência a Necrótico e Divino.',property:'Criaturas acertadas fazem TR CON CD 13 ou ficam Abaladas até o fim do próximo turno.'}),
material('adamanto','Adamanto',300,'Extremamente Raro','mitico',{weapon:'Ignora Resistência a Cortante, Perfurante e Concussivo não-mágico.',armor:'+1 CA adicional e Resistência a Concussivo.',property:'Nunca se danifica por uso normal.'}),
material('couro-de-nemeia','Couro de Nemeia',200,'Extremamente Raro','mitico',{armor:'Resistência permanente a Cortante.',property:'Não pode ser danificado por armas não-mágicas.'},'Armaduras apenas.'),
material('escamas-de-drakon','Escamas de Drakon',250,'Extremamente Raro','mitico',{armor:'Resistência a Ígneo e Ácido.',property:'Criaturas de INT 4 ou menos têm Desvantagem em ataques contra o usuário.'},'Armaduras apenas.'),
material('madeira-de-dodona','Madeira de Dodona',400,'Lendário','lendario',{weapon:'Arcos causam +1d6 Divino adicional.',property:'1×/dia responde uma pergunta simples sobre o futuro imediato.'},'Arcos e cajados apenas.'),
material('metal-do-estige','Metal do Estige',null,'Lendário','lendario',{weapon:'Ignora Imunidades completamente.',armor:'Resistência a todos os tipos de dano.'},'Apenas Artesãos Divinos.'),
material('la-do-velo-de-ouro','Lã do Velo de Ouro',null,'Lendário','lendario',{armor:'No início de cada turno, recupera PV igual ao mod. CON.'},'Armaduras e cloaks apenas; apenas Artesãos Divinos.')
];
db.forge.components=[
{id:'dente-de-drakon',name:'Dente de Drakon',creature:'Drakon',effect:'+1d6 Veneno adicional.'},
{id:'presas-de-hidra',name:'Presas de Hidra',creature:'Hidra',effect:'Causa Envenenado por 1 minuto; TR CON CD 13.'},
{id:'olho-de-basilisco',name:'Olho de Basilisco',creature:'Basilisco',effect:'Imunidade à condição Petrificado.'},
{id:'penas-de-harpias',name:'Penas de Harpias',creature:'Harpia',effect:'Item permanentemente leve; sem penalidade de peso.'},
{id:'chifre-de-minotauro',name:'Chifre de Minotauro',creature:'Minotauro',effect:'+1d8 Concussivo adicional em cargas.'},
{id:'cauda-de-escorpiao-gigante',name:'Cauda de Escorpião Gigante',creature:'Escorpião Gigante',effect:'Paralisado por 1 rodada; TR CON CD 14.'},
{id:'pelo-de-nemeia',name:'Pelo de Nemeia',creature:'Leão de Nemeia',effect:'Resistência a dano Cortante.'},
{id:'cristal-de-ciclope',name:'Cristal de Ciclope',creature:'Ciclope',effect:'Alcance aumentado em 1 m permanentemente.'}
];
db.forge.properties=[
prop('afiada','Afiada','weapon','Acerto crítico em 19–20.'),prop('penetrante','Penetrante','weapon','Ignora Resistência ao tipo de dano.'),prop('queimante','Queimante','weapon','+1d4 Ígneo em todos os ataques.'),prop('eletrica','Elétrica','weapon','+1d4 Elétrico em todos os ataques.'),prop('gelida','Gélida','weapon','+1d4 Gélido em todos os ataques.'),prop('sombria','Sombria','weapon','+1d4 Necrótico em todos os ataques.'),prop('sagrada','Sagrada','weapon','+1d4 Divino contra mortos-vivos e servos de Titãs.'),prop('retornante','Retornante','weapon','Retorna à mão no início do próximo turno após arremesso.'),prop('silenciosa-arma','Silenciosa','weapon','Ataques não produzem som.'),prop('equilibrada','Equilibrada','weapon','Pode usar FOR ou DES para ataques e dano.'),prop('destrutiva','Destrutiva','weapon','1×/Descanso Curto, cause dano máximo automaticamente.'),prop('paralisante','Paralisante','weapon','1×/Descanso Longo, TR CON CD 14 ou Paralisado por 1 rodada.'),
prop('reforcada','Reforçada','armor','+1 à CA adicional.'),prop('leve-armadura','Leve','armor','Sem Desvantagem em Furtividade.'),prop('resistente','Resistente (tipo)','armor','Resistência a um tipo de dano escolhido.'),prop('reflexiva','Reflexiva','armor','1×/Descanso Curto, Reação: reflita metade do dano de volta.'),prop('intimidante','Intimidante','armor','Vantagem em Intimidação em situações sociais.'),prop('regenerativa','Regenerativa','armor','Recupera 1 PV no início de cada turno em combate.'),prop('protetora','Protetora','armor','1×/Descanso Longo, ao ser reduzido a 0 PV, permaneça com 1 PV.'),prop('silenciosa-armadura','Silenciosa','armor','Sem som ao se mover.'),prop('absorvente','Absorvente','armor','Ao sofrer dano Elétrico, Ígneo ou Gélido, recupera 1 MP por tipo.'),
prop('indestrutivel','Indestrutível','universal','Não pode ser danificado por meios não-mágicos.'),prop('magica','Mágica','universal','Conta como mágico para superar Resistências e Imunidades.'),prop('vinculada','Vinculada','universal','Retorna ao dono dentro de 1 minuto se perdido.'),prop('luminosa','Luminosa','universal','Emite luz suave em 3 m; Ação Livre.'),prop('detectora','Detectora','universal','Vibra na presença de criaturas míticas dentro de 9 m.')
];
db.forge.artisans={
common:{id:'common',name:'Artesão Comum',timeFactor:1,maxQuality:'Padrão',maxProperties:0,allowedMaterials:['comum'],testBonus:0,requirements:'Proficiência nas ferramentas relevantes.'},
skilled:{id:'skilled',name:'Artesão Habilidoso',timeFactor:.75,maxQuality:'Superior',maxProperties:1,allowedMaterials:['comum','bronze-celestial','ouro-imperial'],testBonus:3,requirements:'Talento Artesão Habilidoso.'},
master:{id:'master',name:'Mestre Artesão',timeFactor:.5,maxQuality:'Obra Prima',maxProperties:3,allowedMaterials:['*'],testBonus:0,requirements:'Filho de Hefesto ou habilidade Aprimorar Equipamento (nível 7).'},
divine:{id:'divine',name:'Artesão Divino',timeFactor:.25,maxQuality:'Obra Prima',maxProperties:3,allowedMaterials:['*'],testBonus:5,requirements:'Filho de Hefesto com Obra da Forja (nível 17) ou superior.'}
};
db.forge.quality={
'Padrão':{dc:10,weaponAttack:0,weaponDamage:0,armorAC:0,otherBonus:0,failure:'Defeito menor: -1 em ataques ou CA.'},
'Superior':{dc:15,weaponAttack:1,weaponDamage:1,armorAC:1,otherBonus:2,failure:'Item criado como Padrão.'},
'Obra Prima':{dc:20,weaponAttack:2,weaponDamage:2,armorAC:2,otherBonus:4,failure:'Item criado como Superior.'}
};
db.forge.baseMaterialKg={weaponLight:.5,weaponOne:1,weaponTwo:2,armorLight:3,armorMedium:6,armorHeavy:12,shield:2,utility:1};
db.forge.baseTimeDays={
weaponLight:{common:3,skilled:2,master:1,divine:.25},weaponOne:{common:7,skilled:5,master:3,divine:1},weaponTwo:{common:14,skilled:10,master:7,divine:3},armorLight:{common:7,skilled:5,master:3,divine:1},armorMedium:{common:21,skilled:14,master:10,divine:5},armorHeavy:{common:42,skilled:28,master:21,divine:10},shield:{common:7,skilled:5,master:3,divine:1},utility:{common:2,skilled:1.5,master:.75,divine:.25}
};
db.forge.forges={
improvised:{id:'improvised',name:'Forja Improvisada',testBonus:-2,timeFactor:1.5,costPerDay:0,limits:'Não cria Obra Prima nem trabalha materiais lendários.'},
standard:{id:'standard',name:'Forja Padrão',testBonus:0,timeFactor:1,costPerDay:5},
superior:{id:'superior',name:'Forja Superior',testBonus:2,timeFactor:.75,costPerDay:20},
sacred:{id:'sacred',name:'Forja Sagrada',testBonus:5,timeFactor:.5,costPerDay:100,autoProperty:'Mágica'},
camp:{id:'camp',name:'Forja do Acampamento Meio-Sangue',testBonus:2,timeFactor:.75,costPerDay:0,note:'Forja Superior. Semideuses do Acampamento usam gratuitamente em Tempo Livre; visitantes externos 15 drc/dia.'},
hephaestus:{id:'hephaestus',name:'Forja Original de Hefesto',testBonus:8,timeFactor:1,costPerDay:0,freeProperties:2,note:'Sem limite de qualidade e acesso a todos os materiais; requer permissão direta de Hefesto.'},
lemnos:{id:'lemnos',name:'Forja de Lemnos',testBonus:6,timeFactor:.25,costPerDay:0,autoProperty:'Indestrutível'},
vulcan:{id:'vulcan',name:'Forja Subterrânea de Vulcano',testBonus:5,weaponTestBonus:7,timeFactor:1,costPerDay:0,weaponExtraDamage:'+1d6 do tipo base'}
};
db.listForgeMaterials=function(){return JSON.parse(JSON.stringify(db.forge.materials));};
db.listForgeProperties=function(scope){return JSON.parse(JSON.stringify(db.forge.properties.filter(function(p){return !scope||p.scope===scope||p.scope==='universal';})));};
db.version='3e-rules-db-0.42.0';
})(window);
