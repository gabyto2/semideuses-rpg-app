(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Hermes']={
    id:'hermes',
    name:'Hermes',
    title:'O Velocista',
    icon:'⚕',
    domain:'Viagem, ladinagem e comércio.',
    profile:'Velocista furtivo e versátil.',
    mechanicalStatus:'complete',
    casting:'CAR',
    hitDie:8,
    savingThrows:['DES','INT'],
    skillProficiencies:['Prestidigitação','Enganação','Persuasão'],
    weaponProficiencies:['Armas simples','Armas marciais leves'],
    armorProficiencies:['Armaduras médias','Armaduras leves'],
    overview:'Velocista furtivo e versátil. O Ritmo se acumula quando você corre e se gasta em ações bônus extras, furtos e teleportes curtos. Você chega primeiro, pega o que precisa e sai antes da resposta.',
    signature:{
      name:'Ritmo',
      summary:'Você ganha 1 ficha de Ritmo quando se move 6 m ou mais e 1 quando faz um ataque ou usa uma habilidade. O máximo é igual ao Bônus de Proficiência + modificador de Conjuração. Fora do seu turno ou ao fim dele, você pode gastar Ritmo para acelerar ações, reposicionar aliados ou furtar benefícios.',
      maxFormula:'Bônus de Proficiência + modificador de Conjuração',
      universalCosts:[
        {cost:1,effect:'Impulso: você ganha uma Ação Bônus adicional neste turno.'},
        {cost:1,effect:'Reposicionar: um aliado a até 9 m se desloca 3 m sem provocar Ataques de Oportunidade.'},
        {cost:2,effect:'Furto Veloz: roube um benefício mágico ativo ou um item pequeno de um inimigo a até 9 m; TR de DES evita.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Ritmo','Golpe Veloz'],
      2:['Pé Leve'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Roubo','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Borrão'],
      12:['Habilidade de Caminho'],
      15:['Fora do Compasso'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: O Mensageiro dos Deuses']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','Nada o segura: sua velocidade aumenta em 3 m, você ignora terreno difícil, nunca é surpreendido e recebe proficiência com Especialização em Prestidigitação ou Acrobacia.'),
      ability(1,'Golpe Veloz','E',1,'Parte de um ataque','Ao acertar um ataque, gaste 1 MP para causar +2d6 de dano e ganhar 1 Ritmo. À vontade. O bônus sobe para +3d6 no nível 5, +4d6 no nível 11 e +5d6 no nível 17.'),
      ability(2,'Pé Leve','E',1,'Ação Bônus','Gaste 1 Ritmo para se Desengajar e mover metade do deslocamento. Se terminar a até 1,5 m de um inimigo diferente daquele de onde saiu, recupere 1 Ritmo. Pode usar antes ou depois do ataque, e o movimento não provoca Ataques de Oportunidade de nenhum inimigo.'),
      ability(5,'Roubo','C',4,'Ação','Subtraia um item, um benefício mágico ou uma condição de um inimigo a até 9 m. Um TR de DES evita o furto.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Borrão','B',6,'Ação Bônus','Mova-se até a sua velocidade sem provocar Ataques de Oportunidade e reposicione um aliado adjacente em até 3 m.'),
      ability(15,'Fora do Compasso','A',8,'Ação Bônus, 1 minuto','Por 1 minuto, o seu teto de Ritmo dobra e você ganha 1 Ritmo sempre que um inimigo erra um ataque contra você. Uma vez por rodada, ao gastar 3 Ritmos, resolva imediatamente uma Ação sua fora da ordem, mesmo durante o turno de outra criatura, antes que a ação dela termine. Isso não anula a ação alheia e nunca acontece mais de uma vez por rodada, contando todas as fontes.'),
      ability(20,'O Mensageiro dos Deuses','Lendário',24,'Ação, 1 minuto','1 uso por dia. Por 1 minuto, seu deslocamento triplica, você anda sobre líquidos e paredes e pode se teleportar 18 m como parte de qualquer movimento, uma vez por turno. Uma vez por rodada, ao acertar um inimigo, roube um efeito benéfico ativo dele e mantenha-o até o fim do combate. Você ganha 1 Ritmo extra por turno. Preço: ao terminar, fica Lento por 1 rodada e não gera Ritmo por 1 hora.')
    ],
    paths:[
      {
        id:'ladrao',
        name:'Caminho do Ladrão',
        summary:'As mãos mais rápidas do Olimpo. Ataca e furta no mesmo movimento, rouba benefícios e toma a vantagem decisiva da cena.',
        status:'complete',
        abilities:[
          ability(3,'Furto em Combate','D',2,'Ação','Realize um golpe oportunista que causa +2d8 de dano e também rouba um item pequeno ou munição do alvo. Gaste 1 Ritmo para causar +1d8 adicional.'),
          ability(7,'Roubar Bênção','B',6,'Ação','Roube um benefício mágico ativo de um inimigo, como um buff ou resistência, e transfira-o para você por 1 minuto. Gaste 1 Ritmo para aumentar a duração em 1 rodada.'),
          ability(12,'Saque Relâmpago','A',8,'Ação','Mova-se entre até 3 alvos, atacando e roubando algo de cada um. Gaste 2 Ritmos para incluir um quarto alvo.'),
          ability(17,'Grande Golpe','S',12,'Ação','2 usos por dia. Roube a vantagem decisiva da cena: um recurso, uma arma divina ou a Iniciativa do inimigo. Ao usar, seu Ritmo vai ao máximo.')
        ]
      },
      {
        id:'mensageiro',
        name:'Caminho do Mensageiro',
        summary:'O que nunca para. Move aliados, entrega recursos em qualquer ponto e acelera o grupo inteiro.',
        status:'complete',
        abilities:[
          ability(3,'Entrega','D',2,'Ação','Um aliado a até 18 m ganha movimento imediato igual à própria velocidade e uma Ação Bônus extra. Gaste 1 Ritmo para que ele também receba +2 de CA até o próximo turno.'),
          ability(7,'Entrega Rápida','B',6,'Ação','Leve uma cura ou item a um aliado a até 30 m instantaneamente, sem provocar Ataques de Oportunidade. Gaste 1 Ritmo para fazer duas entregas.'),
          ability(12,'Rede de Mensagens','A',8,'Ação, 1 minuto','Por 1 minuto, aliados a até 18 m podem trocar Ações Bônus entre si e agir em coordenação. Gaste 2 Ritmos ao ativar para a rede durar 2 minutos.'),
          ability(17,'Velocidade Divina','S',12,'Ação','2 usos por dia. O grupo ganha uma rodada extra de ações curtas: movimento e um ataque ou habilidade de Rank C ou inferior. Gaste 3 Ritmos ao ativar para que cada aliado também receba +3 m de velocidade nessa rodada extra.')
        ]
      },
      {
        id:'trapaceiro',
        name:'Caminho do Trapaceiro',
        summary:'Nada é o que parece. Abre guardas com ilusões, troca posições, confunde inimigos e vira a cena com um truque.',
        status:'complete',
        abilities:[
          ability(3,'Finta Ilusória','D',2,'Ação','Uma ilusão abre a guarda de um alvo: ele tem Desvantagem no próximo ataque e você tem Vantagem contra ele. Gaste 1 Ritmo para a Desvantagem valer para todos os ataques do alvo na rodada.'),
          ability(7,'Troca','B',6,'Ação','Troque de lugar com um aliado ou inimigo a até 18 m; um inimigo pode evitar com TR. Gaste 1 Ritmo para receber +2 de CA até o próximo turno após a troca.'),
          ability(12,'Confusão','A',8,'Ação','Inimigos em uma área de 6 m fazem TR de SAB ou atacam um alvo aleatório errado por 1 rodada. Gaste 2 Ritmos para aumentar a área para 9 m.'),
          ability(17,'Golpe de Mestre','S',12,'Ação','2 usos por dia. Vire a cena com um truque: anule uma ação inimiga importante e crie uma abertura decisiva para o grupo. Ao usar, ganhe 3 Ritmos.')
        ]
      },
      {
        id:'viajante',
        name:'Caminho do Viajante',
        summary:'Todos os caminhos levam a Hermes. Encurta distâncias, leva aliados consigo e cria uma rede de portais pela cena.',
        status:'complete',
        abilities:[
          ability(3,'Passo Dimensional','D',2,'Ação Bônus','Teleporte-se até 9 m para um ponto visível. Gaste 1 Ritmo para levar um aliado adjacente junto.'),
          ability(7,'Atalho','B',6,'Ação','Você e os aliados a até 9 m se movem imediatamente até 18 m para um ponto visível. Gaste 1 Ritmo para que o deslocamento não provoque Ataques de Oportunidade.'),
          ability(12,'Salto Longo','A',8,'Ação','Leve até 4 aliados a até 12 m de você a um ponto que já tenha visto, em curta distância. Gaste 2 Ritmos para que o ponto possa estar a até 24 m.'),
          ability(17,'Rede de Atalhos','S',12,'Ação','2 usos por dia. Crie uma rede de portais pela cena por 1 minuto; aliados se teleportam entre eles como movimento. Quando um aliado usar um portal, gaste 1 Ritmo para que ele receba +1d6 no próximo ataque.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.11.0';
})(window);
