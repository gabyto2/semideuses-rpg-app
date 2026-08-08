(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db||!db.affiliations)return;

  function ability(level,name,rank,cost,action,effect){
    return {level:level,name:name,rank:rank||'—',cost:cost==null?'—':cost,action:action||'—',effect:effect};
  }

  db.affiliations['Atena']={
    id:'atena',
    name:'Atena',
    title:'A Comandante',
    icon:'🦉',
    domain:'Sabedoria e estratégia.',
    profile:'Comando e suporte tático.',
    mechanicalStatus:'complete',
    casting:'INT',
    hitDie:8,
    savingThrows:['INT','SAB'],
    skillProficiencies:['História','Investigação','Saber Mítico'],
    weaponProficiencies:['Armas simples','Armas marciais'],
    armorProficiencies:['Armaduras médias','Armaduras leves','Escudos'],
    overview:'Comando e suporte tático. Atena transforma a rodada dos aliados: antecipa ameaças, marca prioridades, concede movimento e ataques fora do turno e reorganiza o campo. O grupo luta melhor porque você lê a batalha antes de todos.',
    signature:{
      name:'Plano de Batalha',
      summary:'Você possui um pool de Comando igual a 2 + seu modificador de Conjuração. Ele enche a cada combate e pode chegar ao dobro do valor inicial. Você ganha 1 Comando no início de cada turno e mais 1 quando um aliado acerta um inimigo marcado por você. No seu turno ou como Reação nos turnos alheios, gaste no máximo uma opção por gatilho.',
      universalCosts:[
        {cost:1,effect:'Avançar: um aliado a até 18 m usa a Reação para mover-se até a própria velocidade sem provocar Ataques de Oportunidade.'},
        {cost:1,effect:'Guarda: como Reação, um aliado a até 18 m atingido por um ataque recebe +5 de CA contra aquele ataque.'},
        {cost:2,effect:'Golpe Ordenado: um aliado a até 18 m usa a Reação para atacar imediatamente com uma arma, causando +1d6 de dano.'},
        {cost:3,effect:'Ofensiva Total: use sua Ação para que um aliado a até 18 m realize imediatamente um turno completo, com movimento, ação e ação bônus.'}
      ]
    },
    progression:{
      1:['Dom','Assinatura: Plano de Batalha','Ordem'],
      2:['Leitura de Campo'],
      3:['Escolha do Caminho','Habilidade de Caminho'],
      5:['Marcar Alvo','Marca do Herói'],
      7:['Habilidade de Caminho'],
      10:['Reposicionar'],
      12:['Habilidade de Caminho'],
      15:['Contra-Ordem'],
      17:['Habilidade de Caminho'],
      20:['Poder Supremo: A Coruja de Bronze']
    },
    abilities:[
      ability(1,'Dom','Passiva',null,'Passiva','Você recebe proficiência com Especialização em uma perícia tática. Uma vez por combate, rola a Iniciativa com Vantagem e pode trocar sua posição na ordem com a de um aliado.'),
      ability(1,'Ordem','E',1,'Ação Bônus','Um aliado a até 18 m soma seu modificador de Conjuração ao próximo ataque ou teste e gera 1 Comando para você. À vontade.'),
      ability(2,'Leitura de Campo','Passiva',null,'Escolha após Descanso Longo','Escolha uma doutrina, podendo trocá-la no Descanso Longo. Terreno: no início do combate, você e até 3 aliados a até 9 m podem mover-se 3 m antes da primeira rodada. Inimigo: aprenda a maior resistência e a menor defesa de um inimigo visível; o primeiro aliado a atacá-lo tem Vantagem. Aliado: comece cada combate com +2 de Comando e ganhe +1 Comando na primeira vez que um aliado ficar abaixo de metade dos PV naquele combate.'),
      ability(5,'Marcar Alvo','C',4,'Ação, concentração por 1 minuto','Marque um inimigo. Enquanto você mantiver a concentração, aliados recebem +2 para acertá-lo e causam +1d6 de dano contra ele. Você mantém apenas uma marca por vez.'),
      ability(5,'Marca do Herói','Passiva',null,'Escolha permanente','Escolha Ataque Extra ou Bônus de Conjuração. Ataque Extra permite dois ataques com arma ao usar a ação Atacar. Bônus de Conjuração reduz em 1 MP o custo de Rank C e permite, uma vez por turno, conjurar uma habilidade de Rank E junto com sua Ação. A escolha é permanente e não acumula com outra fonte do mesmo efeito.'),
      ability(10,'Reposicionar','B',6,'Ação Bônus','Mova dois aliados a até 9 m, cada um até a própria velocidade, sem provocar Ataques de Oportunidade.'),
      ability(15,'Contra-Ordem','A',8,'Reação','Quando um inimigo visível a até 18 m declara um ataque, habilidade ou movimento, gaste 3 Comando para anular a ação; ela é perdida, mas o recurso ou uso do inimigo não é consumido. Contra habilidade de Rank S ou superior, ou contra um chefe, a ação não é anulada: o alvo age com Desvantagem e você redireciona a área ou o alvo em até 9 m. Uma vez por rodada.'),
      ability(20,'A Coruja de Bronze','Lendário',24,'Ação, 1 minuto','1 uso por dia. Invoque a Coruja de Bronze por 1 minuto. Ela paira a até 30 m, age na sua Iniciativa sem consumir sua Ação e não pode ser alvo de ataques; uma dissipação CD 25 pode expulsá-la. No turno dela, escolha: devolver a um aliado uma Reação já usada; fazer um inimigo repetir um Teste de Resistência falho com Desvantagem; ou conceder a um aliado que ainda não agiu nesta rodada uma ação de ataque adicional, respeitando o máximo de uma ação adicional por rodada contando todas as fontes. Você ganha 2 Comando por rodada enquanto ela estiver presente. Quando a coruja parte, seu Comando zera e você não gera Comando até o fim do combate.')
    ],
    paths:[
      {
        id:'estrategia',
        name:'Caminho da Estratégia',
        summary:'Comando e antecipação. Concede ações imediatas, prejudica ataques inimigos e executa planos coordenados com todo o grupo.',
        status:'complete',
        abilities:[
          ability(3,'Reação Tática','D',2,'Reação','Conceda imediatamente a um aliado uma Reação para mover-se ou realizar um ataque.'),
          ability(7,'Antecipar','B',6,'Reação','Quando vir um inimigo atacar, gaste 1 Comando para que o ataque seja realizado com Desvantagem.'),
          ability(12,'Manobra Coordenada','A',8,'Ação','Dois aliados a até 12 m agem em sequência. Cada um pode mover-se e realizar um ataque imediatamente.'),
          ability(17,'Plano Perfeito','S',12,'Ação','2 usos por dia. O grupo executa uma rodada-relâmpago: cada aliado a até 18 m pode mover-se e realizar um ataque ou usar imediatamente uma habilidade de Rank C ou inferior.')
        ]
      },
      {
        id:'batalha',
        name:'Caminho da Batalha',
        summary:'A guerreira. Protege a formação, abre a guarda dos inimigos e aumenta a resistência e o rendimento de todo o grupo.',
        status:'complete',
        abilities:[
          ability(3,'Égide','D',2,'Ação Bônus','Você e um aliado a até 9 m recebem +2 de CA até o início do seu próximo turno.'),
          ability(7,'Golpe Tático','B',6,'Ação','Faça um ataque. Ao acertar, abra a guarda do alvo: um aliado pode usar a Reação para atacá-lo gratuitamente; quando esse aliado acerta, você ganha 1 Comando.'),
          ability(12,'Formação','A',8,'Ação, 1 minuto','Por 1 minuto, aliados a até 6 m de você compartilham +2 de CA e resistência a um tipo de dano escolhido por você.'),
          ability(17,'Comandante Suprema','S',12,'Ação, 1 minuto','2 usos por dia. Por 1 minuto, aliados a até 12 m recebem uma Ação Bônus extra por turno e +1d6 de dano no primeiro ataque de cada turno.')
        ]
      },
      {
        id:'artesao',
        name:'Caminho do Artesão',
        summary:'Engenho e equipamento. Improvisa dispositivos, impõe doutrinas de combate, constrói máquinas de cerco e forja itens lendários temporários.',
        status:'complete',
        abilities:[
          ability(3,'Engenho','D',2,'Ação','Crie um dispositivo tático temporário: uma rede que prende, fumaça que concede cobertura ou uma armadilha que causa 2d8 de dano e exige TR de DES para evitar ficar Restrito. Gaste 1 Comando para criar um segundo dispositivo no mesmo uso.'),
          ability(7,'Doutrina de Combate','B',6,'Ação, 1 minuto','Por 1 minuto, aliados a até 9 m seguem sua doutrina. Uma vez por turno, cada um pode rerrolar um dado de dano que mostrou 1, e os Ataques de Oportunidade deles recebem +2. Gaste 1 Comando para que um aliado escolhido receba +1d4 em ataques durante a duração.'),
          ability(12,'Engenho de Cerco','A',8,'Ação, 1 minuto','Monte uma balista ou parede móvel que age na sua Iniciativa por 1 minuto. Gaste 2 Comando para que a máquina aja uma segunda vez neste turno.'),
          ability(17,'Obra-Prima','S',12,'Ação','1 uso por dia. Forje imediatamente para um aliado um item lendário temporário, com um efeito poderoso à sua escolha, que dura pela cena. Gaste 3 Comando para forjar um segundo item para outro aliado.')
        ]
      }
    ]
  };

  db.version='3e-rules-db-0.7.1';
})(window);
